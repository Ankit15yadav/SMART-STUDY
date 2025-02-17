'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import { api } from '@/trpc/react'
import React, { useEffect, useState, useRef } from 'react'
import GroupChatCard from './_components/group-card'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/nextjs'
import io from "socket.io-client";

const socket = io("http://192.168.1.6:4000");

interface Message {
    id: string;
    content: string;
    senderId: string;
    createdAt: Date;
    sender?: {
        firstName: string | null;
        lastName: string | null;
    };
}

interface Group {
    id: string
    name: string
    imageUrl: string | null
    maxMembers: number
    members: { userId: string }[]
}

const ChatPage = () => {
    const { user } = useUser();
    const userId = user?.id || "";
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)
    const { data: getJoinedGroups, isLoading } = api.Groups.getJoinedGroups.useQuery()
    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState('')
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Socket.io handlers
    useEffect(() => {
        socket.on("previousMessages", (msgs: Message[]) => {
            setMessages(msgs);
        });

        socket.on("newMessage", (msg: Message) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => {
            socket.off("previousMessages");
            socket.off("newMessage");
        };
    }, []);

    // Scroll to bottom when messages update
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "instant", block: "end" });
        }
    }, [messages]);

    const handleJoinGroup = (group: Group) => {
        setSelectedGroup(group);
        socket.emit("joinGroup", {
            groupId: group.id,
            userId: userId,
        });
    };

    const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (message.trim() && selectedGroup?.id && userId) {
            socket.emit("sendMessage", {
                groupId: selectedGroup.id,
                senderId: userId,
                content: message,
            });
            setMessage('')
        }
    }

    return (
        // <ScrollArea className='h-[calc(100vh-2rem)]'>
        <div className="w-full grid md:grid-cols-4 gap-x-2 min-h-screen">
            {/* Sidebar with Scrollable Group List */}
            <div className="grid md:col-span-1 rounded-md border">
                <div className="p-2 border-b flex items-center font-semibold">Chats</div>
                <ScrollArea className="h-[calc(100vh-4rem)] w-full">
                    <div className="px-3 pb-16">
                        {getJoinedGroups?.map((group) => (
                            <div key={group.id} onClick={() => handleJoinGroup(group)}>
                                <GroupChatCard group={group} selectedGroupid={selectedGroup?.id || ''} />
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            {/* Chat Window */}
            <div className="grid md:col-span-3 rounded-md flex-col pb-16">
                <div className='flex flex-col justify-between h-full'>
                    {selectedGroup ? (
                        <>
                            {/* Header Section */}
                            <div className="border-b-2 flex items-center gap-x-4 h-14 p-2">
                                <Image
                                    src={'/assets/images/group.webp'}
                                    alt="group"
                                    width={35}
                                    height={35}
                                    className="rounded-full"
                                />
                                <div>
                                    <h2 className="font-semibold">{selectedGroup.name}</h2>
                                    <p className="text-sm text-muted-foreground">
                                        {selectedGroup.members.length}/{selectedGroup.maxMembers} members
                                    </p>
                                </div>
                            </div>

                            {/* Chat Messages Area */}
                            <div className="flex-1 overflow-hidden">
                                <ScrollArea className="h-[calc(100vh-160px)] p-4">
                                    <div className="space-y-4">
                                        {messages.map((msg) => (
                                            <div
                                                key={msg.id}
                                                className={`flex ${msg.senderId === userId ? "justify-end" : "justify-start"}`}
                                            >
                                                <div className={`p-3 rounded-lg max-w-[75%] ${msg.senderId === userId
                                                    ? "bg-blue-500 text-white"
                                                    : "bg-gray-100"}`}
                                                >
                                                    {msg.senderId !== userId && (
                                                        <p className="text-xs text-gray-600 mb-1">
                                                            {msg.sender?.firstName || "Unknown User"}
                                                        </p>
                                                    )}
                                                    <p>{msg.content}</p>
                                                    <p className={`text-xs mt-1 ${msg.senderId === userId
                                                        ? "text-blue-100"
                                                        : "text-gray-500"}`}
                                                    >
                                                        {new Date(msg.createdAt).toLocaleTimeString([], {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                        <div ref={messagesEndRef} />
                                    </div>
                                </ScrollArea>
                            </div>

                            {/* Send Message Section */}
                            <div className="p-4 border-t-2">
                                <form onSubmit={handleSendMessage} className="flex gap-2">
                                    <Input
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Send message to group"
                                        className="flex-1"
                                    />
                                    <Button type="submit">Send</Button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex justify-center items-center h-full text-lg font-semibold">
                            Select a group to chat
                        </div>
                    )}
                </div>
            </div>
        </div>
        // </ScrollArea>
    )
}

export default ChatPage