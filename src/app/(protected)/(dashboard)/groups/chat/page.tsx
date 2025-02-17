'use client'
import { ScrollArea } from '@/components/ui/scroll-area'
import { api } from '@/trpc/react'
import React, { useState } from 'react'
import GroupChatCard from './_components/group-card'
import Image from 'next/image'

interface Group {
    id: string
    name: string
    imageUrl: string | null
    maxMembers: number
    members: { userId: string }[]
}

const ChatPage = () => {
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)
    const { data: getJoinedGroups, isLoading } = api.Groups.getJoinedGroups.useQuery()

    return (
        <div className='w-full grid md:grid-cols-4 gap-x-2 min-h-screen'>

            {/* Sidebar with Scrollable Group List */}
            <div className='grid md:col-span-1 rounded-md border'>
                <div className='p-2 border-b flex items-center'>Chats</div>
                <ScrollArea className="h-[calc(100vh-4rem)] w-full">
                    <div className="px-3 pb-16"> {/* Added padding-bottom to avoid last item cut-off */}
                        {getJoinedGroups?.map((group) => (
                            <div
                                key={group.id}
                                onClick={() => setSelectedGroup(group)}
                            >
                                <GroupChatCard group={group} selectedGroupid={selectedGroup?.id || ''} />
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            {/* Chat Window */}
            <div className='grid md:col-span-3 bg-blue-300 rounded-md '>
                {selectedGroup ? (
                    <>
                        <div className='border-b-2 flex items-center gap-x-4 h-14 p-2'>
                            <Image
                                src={'/assets/images/group.webp'}
                                alt='group'
                                width={35}
                                height={35}
                                className='rounded-full'
                            />
                            <h2 className='font-semibold'>{selectedGroup.name}</h2>
                        </div>
                        <div>{/* Chat messages can go here */}</div>
                        <div>{/* Input or additional UI elements */}</div>
                    </>
                ) : (
                    "Select a group to chat"
                )}
            </div>
        </div>
    )
}

export default ChatPage
