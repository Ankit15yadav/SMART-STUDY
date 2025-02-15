"use client";

import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { useUser } from "@clerk/nextjs";
import { api } from "@/trpc/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";

// --- Socket.io Setup ---
const socket = io("http://localhost:4000");

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

interface GroupCardProps {
    id: string;
    name: string;
    category: string;
    description: string;
    imageUrl: string | null;
    isPublic: boolean;
    maxMembers: number;
    tags: string[];
    joinedMembers: number;
    members: {
        id: string;
    }[];
    createdBy: {
        firstName: string | null;
        lastName: string | null;
        imageUrl?: string | null;
    };
}

export default function GroupsAndChat() {
    const { user } = useUser();
    const userId = user?.id || "";

    // Fetch user's interests
    const { data: interests } = api.Groups.getUserInterest.useQuery();
    const interestData = interests?.split(",").map((int) => int.trim()) || [];

    // Fetch matching groups based on interests
    const { data: groups, isLoading } = api.Groups.GetMatchingGroups.useQuery({
        userInterests: interestData,
    });

    const [selectedGroup, setSelectedGroup] = useState<GroupCardProps | null>(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Socket.io listeners
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

    // Scroll to the latest message whenever messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleJoinGroup = (group: GroupCardProps) => {
        setSelectedGroup(group);
        socket.emit("joinGroup", {
            groupId: group.id,
            userId: userId,
        });
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() && selectedGroup?.id && userId) {
            socket.emit("sendMessage", {
                groupId: selectedGroup.id,
                senderId: userId,
                content: message,
            });
            setMessage("");
        }
    };

    if (isLoading) {
        return <div className="p-4">Loading groups...</div>;
    }

    return (
        <div className="flex h-screen bg-background">
            {/* Left Section (1/3) - Group List */}
            <div className="w-1/3 border-r flex flex-col">
                <div className="p-4 border-b">
                    <h2 className="text-xl font-semibold">Your Groups</h2>
                </div>
                <ScrollArea className="flex-1">
                    {groups?.map((group) => (
                        <Card
                            key={group.id}
                            className={`m-2 p-4 cursor-pointer hover:bg-muted ${selectedGroup?.id === group.id ? "bg-accent" : ""
                                }`}
                            onClick={() =>
                                handleJoinGroup({ ...group, joinedMembers: group.members.length })
                            }
                        >
                            <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={group.imageUrl || ""} />
                                    <AvatarFallback>{group.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold">{group.name}</h3>
                                        <Badge variant="outline">
                                            {group.members.length}/{group.maxMembers}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground truncate">
                                        {group.description}
                                    </p>
                                    <div className="flex gap-2 mt-1">
                                        {group.tags.map((tag) => (
                                            <Badge key={tag} variant="secondary" className="text-xs">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </ScrollArea>
            </div>

            {/* Right Section (2/3) - Chat Area */}
            <div className="w-2/3 flex flex-col min-h-0">
                {selectedGroup ? (
                    <>
                        {/* Group Header */}
                        <div className="p-4 border-b flex items-center gap-4">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={selectedGroup.imageUrl || ""} />
                                <AvatarFallback>{selectedGroup.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h2 className="font-semibold">{selectedGroup.name}</h2>
                                <p className="text-sm text-muted-foreground">
                                    Created by {selectedGroup.createdBy.firstName}{" "}
                                    {selectedGroup.createdBy.lastName}
                                </p>
                            </div>
                        </div>

                        {/* Messages */}
                        <ScrollArea className="flex-1 p-4">
                            <div className="space-y-4">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.senderId === userId ? "justify-end" : "justify-start"
                                            }`}
                                    >
                                        <Card
                                            className={`p-3 max-w-[75%] ${msg.senderId === userId
                                                    ? "bg-primary text-primary-foreground"
                                                    : ""
                                                }`}
                                        >
                                            {/* Show sender's name if not current user */}
                                            {msg.senderId !== userId && (
                                                <p className="text-xs font-medium text-muted-foreground mb-1">
                                                    {msg.sender?.firstName || "Unknown User"}
                                                </p>
                                            )}
                                            <p>{msg.content}</p>
                                            <p
                                                className={`text-xs mt-1 ${msg.senderId === userId
                                                        ? "text-primary-foreground/70"
                                                        : "text-muted-foreground"
                                                    }`}
                                            >
                                                {new Date(msg.createdAt).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </p>
                                        </Card>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                        </ScrollArea>

                        {/* Chat Input */}
                        <form onSubmit={handleSendMessage} className="p-2 border-t">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Type your message..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="flex-1"
                                />
                                <Button type="submit">
                                    <Send className="h-4 w-4 mr-2" />
                                    Send
                                </Button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-muted-foreground">
                            Select a group to start chatting
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
