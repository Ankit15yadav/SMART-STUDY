'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Loader2, SquarePen } from 'lucide-react';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
    useSidebar
} from '@/components/ui/sidebar';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip';
import { api } from '@/trpc/react';
import { usePathname, useRouter } from 'next/navigation';
import TypingText from '@/components/typing-text';

interface ChatHistoryItem {
    id: string;
    title: string | null;
    ResumeMessage: {
        id: string;
        prompt: string;
        response: string;
    }[];
}

const AppSidebar: React.FC = () => {
    // State for chat history and new chat id
    const { data: History, isLoading } = api.chat.getHistory.useQuery<ChatHistoryItem[]>();
    const { open, toggleSidebar } = useSidebar();
    const pathname = usePathname();
    const router = useRouter();
    const [newChatId, setNewChatId] = useState<string | null>(null);

    const handleChatCreation = () => {
        const uuid = crypto.randomUUID();
        setNewChatId(uuid);
        router.push(`/resume-assistant/chat/${uuid}`);
    };

    return (
        <TooltipProvider>
            {/* Remove hard-coded colors to let the default theme take over */}
            <Sidebar className="min-h-screen">
                <SidebarHeader>
                    {open ? (
                        <div className="flex items-center justify-between p-2">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div>
                                        <SidebarTrigger size={'icon'} onClick={toggleSidebar} />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Close Sidebar</p>
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span className="hover:cursor-pointer" onClick={handleChatCreation}>
                                        <SquarePen size={20} />
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Create New Chat</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    ) : (
                        <div className="p-2">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div>
                                        <SidebarTrigger size={'lg'} onClick={toggleSidebar} />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Open Sidebar</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    )}
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>History</SidebarGroupLabel>
                        <SidebarGroupContent>
                            {isLoading ? (
                                <div className="flex items-center justify-center h-24">
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                </div>
                            ) : (
                                <SidebarMenu>
                                    {History?.map((item: ChatHistoryItem, index: number) => (
                                        <SidebarMenuItem key={index}>
                                            <SidebarMenuButton
                                                asChild
                                                className={cn(
                                                    // When the route is active, use the primary color and its foreground text
                                                    pathname === `/resume-assistant/chat/${item.id}`
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'hover:bg-muted',
                                                    'text-sm'
                                                )}
                                            >
                                                <Link href={`/resume-assistant/chat/${item.id}`} className="list-none">
                                                    {item.id === newChatId ? (
                                                        <TypingText
                                                            text={item.title!}
                                                            speed={50}
                                                            onComplete={() => setNewChatId(null)}
                                                        />
                                                    ) : (
                                                        <span>{item.title}</span>
                                                    )}
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            )}
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
        </TooltipProvider>
    );
};

export default AppSidebar;
