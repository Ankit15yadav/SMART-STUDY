'use client'
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { MessageSquare, Users, PlusCircle, Settings, Heart, Group, FileUser } from "lucide-react";
import Image from 'next/image'
import { useRouter } from "next/navigation"
import { Button } from '@/components/ui/button'
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Dialog, DialogTitle } from '@/components/ui/dialog'
type Props = {}

const Dashboard = [
    {
        label: "My Chats",
        // href: "/groups/joined",
        href: "/user/groups/chat",

        icon: <MessageSquare size={20} />
    },
    {
        label: "Created Groups",
        href: "/user/groups/my-groups",

        icon: <Users size={20} />
    },
    {
        label: "All Groups",
        href: "/user/groups/my-interest",

        icon: <Group size={20} />
    },
    {
        label: "Create Group",
        href: "/user/groups/create",
        icon: <PlusCircle size={20} />
    },
    {
        label: "Resume Upload",
        href: "/user/groups/resume-upload",
        icon: <FileUser size={20} />
    },
    {
        label: "Interests",
        // href: "/interests",
        href: "/user/groups/interest",

        icon: <Heart size={20} />
    },

    {
        label: "Settings",
        // href: "/groups/settings",
        href: "/user/groups/settings",

        icon: <Settings size={20} />
    },
];

const AppSidebar = (props: Props) => {

    const { open } = useSidebar()
    const pathname = usePathname();
    const router = useRouter();

    // const 

    return (
        <Sidebar collapsible='icon' variant='floating'
            className="bg-white dark:bg-neutral-900 min-h-screen"
        >


            <SidebarHeader className='flex items-center cursor-pointer'>
                <Dialog>
                    <DialogTitle className='sr-only'>
                        Main navigation
                    </DialogTitle>
                </Dialog>

                <Image
                    src={"/assets/images/logo.png"}
                    alt='logo'
                    width={150}
                    height={150}
                    onClick={() => router.replace("/u/home")}
                />
            </SidebarHeader>
            <SidebarContent className='bg-inherit'>
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
            <SidebarFooter className='bg-inherit'>
                <Button asChild>
                    <Link href={'/groups/create'}>
                        {
                            open ? ('Create Group') : ('+')
                        }
                    </Link>
                </Button>
            </SidebarFooter>
        </Sidebar>
    )
}

export default AppSidebar