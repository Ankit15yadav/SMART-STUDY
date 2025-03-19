'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import { api } from '@/trpc/react'
import React, { useEffect, useState, useRef } from 'react'
import GroupChatCard from './_components/group-card'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/nextjs'
import { useSocket } from '@/context/SocketProvider'
import { Skeleton } from '@/components/ui/skeleton'

interface Group {
    id: string;
    name: string;
    imageUrl: string | null;
    maxMembers: number;
    members: { userId: string }[];
}

const ChatPage = () => {
    const { user } = useUser();
    const userId = user?.id;

    const { data: getJoinedGroups, isLoading: isGroupsLoading } = api.Groups.getJoinedGroups.useQuery(undefined, {
        staleTime: 1000 * 60 * 60 * 24,
    });

    const { joinGroup, sendMessage, messagess } = useSocket();

    const [groups, setGroups] = useState<Group[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [message, setMessage] = useState('');
    const [isMessageSending, setIsMessageSending] = useState(false);
    const [isJoiningGroup, setIsJoiningGroup] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [showMessage, setShowMessage] = useState(true);
    const [hideMessage, setHideMessage] = useState(false);

    // Helper function to format the timestamp
    const formatTimestamp = (timestamp: Date | string): string => {
        const date = new Date(timestamp);
        const now = new Date();

        // Create date objects for comparison (year, month, day only)
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        if (messageDate.getTime() === today.getTime()) {
            return `Today at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
        } else if (messageDate.getTime() === yesterday.getTime()) {
            return `Yesterday at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
        } else {
            return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
        }
    };

    // When a new group list is fetched, update local state
    useEffect(() => {
        if (getJoinedGroups) {
            setGroups(getJoinedGroups);
        }
    }, [getJoinedGroups]);

    // Show a fading message when a group is selected
    useEffect(() => {
        setShowMessage(true);
        setHideMessage(false);
        const fadeOutTimer = setTimeout(() => setHideMessage(true), 2500);
        const removeTimer = setTimeout(() => setShowMessage(false), 3000);
        return () => {
            clearTimeout(fadeOutTimer);
            clearTimeout(removeTimer);
        };
    }, [selectedGroup]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "instant", block: "end" });
        }
    }, [messagess]);

    // When joining a group, emit the join event
    const handleJoinGroup = (group: Group) => {
        setIsJoiningGroup(true);
        setSelectedGroup(group);
        joinGroup(group.id, userId!);
        // Simulate loading time for joining a group
        setTimeout(() => {
            setIsJoiningGroup(false);
        }, 800);
    };

    // When sending a message, emit the message and then reorder the groups
    const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (message.trim() && selectedGroup?.id && userId) {
            setIsMessageSending(true);
            sendMessage(message, selectedGroup.id, userId);
            setMessage('');

            // Reorder the groups so that the selected group moves to the top
            setGroups((prevGroups) => {
                if (!selectedGroup) return prevGroups;
                const filtered = prevGroups.filter((g) => g.id !== selectedGroup.id);
                return [selectedGroup, ...filtered];
            });

            // Simulate loading time for sending a message
            setTimeout(() => {
                setIsMessageSending(false);
            }, 500);
        }
    };

    // Group list loading skeleton
    const GroupListSkeleton = () => (
        <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex items-center space-x-3 p-2">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                    </div>
                </div>
            ))}
        </div>
    );

    // Message loading skeleton
    const MessageSkeleton = () => (
        <div className="space-y-4">
            <div className="flex justify-start">
                <div className="p-3 rounded-lg max-w-[75%] bg-gray-100">
                    <Skeleton className="h-3 w-24 mb-2" />
                    <Skeleton className="h-4 w-48 mb-1" />
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-16 mt-1" />
                </div>
            </div>
            <div className="flex justify-end">
                <div className="p-3 rounded-lg max-w-[75%] bg-primary">
                    <Skeleton className="h-4 w-36 mb-1 bg-blue-300" />
                    <Skeleton className="h-4 w-44 mb-1 bg-blue-300" />
                    <Skeleton className="h-3 w-16 mt-1 bg-blue-200" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="w-full grid md:grid-cols-4 gap-x-2 min-h-screen overflow-y-hidden">
            {/* Sidebar: Group List */}
            <div className="grid md:col-span-1 rounded-md border">
                <div className="p-2 border-b flex items-center justify-between font-semibold">
                    <span>Chats</span>
                    {isGroupsLoading && <span className="text-xs text-gray-500">Loading...</span>}
                </div>
                <ScrollArea className="h-[calc(100vh-4rem)] w-full">
                    <div className="px-3 pb-16 ">
                        {isGroupsLoading ? (
                            <GroupListSkeleton />
                        ) : groups.length > 0 ? (
                            groups.map((group) => (
                                <div key={group.id} onClick={() => handleJoinGroup(group)}>
                                    <GroupChatCard
                                        group={group}
                                        messages={messagess}
                                        selectedGroupid={selectedGroup?.id || ''}
                                        isLoading={isJoiningGroup && selectedGroup?.id === group.id}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="flex justify-center items-center h-32 text-gray-500">
                                No groups joined
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </div>

            {/* Chat Window */}
            <div className="grid md:col-span-3 rounded-md flex-col pb-16">
                <div className="flex flex-col justify-between h-full">
                    {selectedGroup ? (
                        <>
                            {/* Header Section */}
                            <div className="border-b-2 flex items-center gap-x-4 h-14 p-2">
                                {isJoiningGroup ? (
                                    <Skeleton className="h-9 w-9 rounded-full" />
                                ) : (
                                    <Image
                                        src={'/assets/images/group.webp'}
                                        alt="group"
                                        width={35}
                                        height={35}
                                        className="rounded-full"
                                    />
                                )}
                                <div>
                                    {isJoiningGroup ? (
                                        <Skeleton className="h-5 w-32" />
                                    ) : (
                                        <h2 className="font-semibold">{selectedGroup.name}</h2>
                                    )}
                                    {showMessage && !isJoiningGroup && (
                                        <p className={`text-sm transition-opacity duration-500 ease-in-out ${hideMessage ? "opacity-0" : "opacity-100"}`}>
                                            select for group info
                                        </p>
                                    )}
                                    {isJoiningGroup && <Skeleton className="h-3 w-24 mt-1" />}
                                </div>

                            </div>

                            {/* Chat Messages Area */}
                            <div className="flex-1 overflow-hidden">
                                <ScrollArea className="h-[calc(100vh-160px)] p-4">
                                    {isJoiningGroup ? (
                                        <MessageSkeleton />
                                    ) : (
                                        <div className="space-y-4">
                                            {messagess.filter((msg) => msg.groupId === selectedGroup?.id).map((msg) => (
                                                <div
                                                    key={`${msg.content}+${msg.id}+${msg.createdAt}`}
                                                    className={`flex ${msg.senderId === userId ? "justify-end" : "justify-start"}`}
                                                >
                                                    <div className={`p-3 rounded-lg max-w-[75%] ${msg.senderId === userId
                                                        ? "bg-primary text-white"
                                                        : "bg-gray-100"}`}
                                                    >
                                                        {msg.senderId !== userId && (
                                                            <p className="text-xs text-gray-600 mb-1">
                                                                {msg.sender?.firstName ? msg.sender?.firstName : "Unknown User"}{" "}
                                                            </p>
                                                        )}
                                                        <p>{msg.content}</p>
                                                        <p className={`text-xs mt-1 ${msg.senderId === userId
                                                            ? "text-blue-100"
                                                            : "text-gray-500"}`}
                                                        >
                                                            {formatTimestamp(msg.createdAt)}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                            <div ref={messagesEndRef} />
                                        </div>
                                    )}
                                </ScrollArea>
                            </div>

                            {/* Send Message Section */}
                            <div className="p-4 border-t-2">
                                <form onSubmit={handleSendMessage} className="flex gap-2">
                                    <Input
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder={isJoiningGroup ? "Joining group..." : "Send message to group"}
                                        className="flex-1"
                                        disabled={isJoiningGroup}
                                    />
                                    <Button
                                        type="submit"
                                        disabled={isJoiningGroup || isMessageSending}
                                        className="flex items-center gap-1"
                                    >
                                        {isMessageSending ? (
                                            <>
                                                <div className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin mr-1"></div>
                                                Sending
                                            </>
                                        ) : "Send"}
                                    </Button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex justify-center items-center h-full text-lg font-semibold">
                            {isGroupsLoading ? (
                                <div className="flex flex-col items-center">
                                    <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
                                    <p>Loading groups...</p>
                                </div>
                            ) : (
                                "Select a group to chat"
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatPage;