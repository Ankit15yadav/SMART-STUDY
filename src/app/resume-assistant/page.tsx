'use client'

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
} from '@/components/ui/sidebar'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { api } from '@/trpc/react'
import { SquarePen, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

const AppSidebar = () => {
    const { data: History, isLoading } = api.chat.getHistory.useQuery();
    const { open, toggleSidebar } = useSidebar();
    const pathname = usePathname()
    const router = useRouter();

    const handleChatCreation = () => {
        const uuid = crypto.randomUUID();
        router.push(`/resume-assistant/chat/${uuid}`)
    }

    return (
        <TooltipProvider>
            <Sidebar className='min-h-screen'>
                <SidebarHeader>
                    {open && (
                        <div className='flex items-center justify-between p-2'>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div>
                                        <SidebarTrigger size={'lg'} onClick={toggleSidebar} />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Close Sidebar</p>
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span
                                        className='hover:cursor-pointer'
                                        onClick={handleChatCreation}
                                    >
                                        <SquarePen size={20} />
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Create New Chat</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    )}
                    {!open && (
                        <div className='p-2'>
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
                        <SidebarGroupLabel>
                            History
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            {isLoading ? (
                                <div className="flex items-center justify-center h-24">
                                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                                </div>
                            ) : (
                                <SidebarMenu>
                                    {History?.map((item, index) => (
                                        <SidebarMenuItem key={index}>
                                            <SidebarMenuButton asChild>
                                                <Link
                                                    className={cn({
                                                        '!bg-primary !text-white': pathname === `/resume-assistant/chat/${item.id}`
                                                    }, 'list-none')}
                                                    href={`/resume-assistant/chat/${item.id}`}
                                                >
                                                    {item.title}
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
    )
}

export default AppSidebar