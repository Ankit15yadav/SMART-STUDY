'use client'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { MessageSquare, Users, PlusCircle, Settings, Heart, Group } from "lucide-react";
import Image from 'next/image'

type Props = {}

const Dashboard = [
    {
        label: "My Chats",
        // href: "/groups/joined",
        href: "/groups/5",

        icon: <MessageSquare size={20} />
    },
    {
        label: "Created Groups",
        href: "/groups/my-groups",

        icon: <Users size={20} />
    },
    {
        label: "All Groups",
        href: "/groups/my-interest",

        icon: <Group size={20} />
    },
    {
        label: "Create Group",
        href: "/groups/create",
        icon: <PlusCircle size={20} />
    },
    {
        label: "Settings",
        // href: "/groups/settings",
        href: "/groups/2",

        icon: <Settings size={20} />
    },
    {
        label: "Interests",
        // href: "/interests",
        href: "/groups/interest",

        icon: <Heart size={20} />
    }
];

const AppSidebar = (props: Props) => {

    const { open } = useSidebar()
    const pathname = usePathname();
    // const 

    return (
        <Sidebar collapsible='icon' variant='floating'>
            <SidebarHeader className='flex items-center'>
                <Image
                    src={"/assets/images/logo.png"}
                    alt='logo'
                    width={150}
                    height={150}
                />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        Dashboard
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {
                                Dashboard.map(item => {
                                    return (
                                        <SidebarMenuItem key={item.label}>
                                            <SidebarMenuButton asChild>
                                                <Link href={item.href} className={cn({
                                                    '!bg-primary !text-white': pathname === item.href
                                                }, 'list-none')} >
                                                    {item.icon}
                                                    <span>{item.label} </span>

                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    )
                                })
                            }
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}

export default AppSidebar