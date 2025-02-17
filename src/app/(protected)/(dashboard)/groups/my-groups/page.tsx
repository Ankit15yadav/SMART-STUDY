"use client"

import { GroupCard } from "@/components/group-card"
import { api } from "@/trpc/react"
import MyGroupsSkeleton from "@/components/group-skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"

const MyGroups = () => {
    const { data: groups, isLoading } = api.Groups.getMyGroups.useQuery()

    const handleEdit = (groupId: string) => {
        // Implement edit functionality here
    }

    return (
        <ScrollArea className="h-[calc(100vh-4rem)] w-full ">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 ">
                {isLoading
                    ? // Show skeleton cards while loading
                    Array.from({ length: 3 }).map((_, index) => <MyGroupsSkeleton key={index} />)
                    : // Show actual groups when loaded
                    groups?.map((group) => (
                        <GroupCard
                            key={group.id}
                            group={{
                                ...group,
                                imageUrl: group.imageUrl || "",
                                joinedMembers: group.members.length,
                            }}
                            onEdit={() => handleEdit(group.id)}
                        />
                    ))}
            </div>
        </ScrollArea>
    )
}

export default MyGroups

