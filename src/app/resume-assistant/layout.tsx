'use client'
import { SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'
import AppSidebar from './page'

type Props = {
    children: React.ReactNode
}

const SidebarLayout = ({ children }: Props) => {
    return (
        <SidebarProvider className="flex h-screen w-full">
            <SidebarContent>
                {children}
            </SidebarContent>
        </SidebarProvider>
    )
}

const SidebarContent = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex h-screen w-full overflow-x-hidden">
            <div>
                <AppSidebar />
            </div>
            <main className="w-full">{children}</main>
        </div>
    )
}

export default SidebarLayout
