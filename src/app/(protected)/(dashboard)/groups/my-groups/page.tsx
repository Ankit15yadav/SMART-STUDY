"use client"

import { GroupCard } from "@/components/group-card"
import { api } from "@/trpc/react"

const MyGroups = () => {
    const { data: groups } = api.Groups.getMyGroups.useQuery()


    const handleEdit = (groupId: string) => {
        // Implement edit functionality here
        // console.log(`Edit group with id: ${groupId}`)
    }

    // console.log(groups);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {groups?.map((group) => (
                <GroupCard key={group.id} group={{ ...group, imageUrl: group.imageUrl || '', joinedMembers: group.members.length }} onEdit={() => handleEdit(group.id)} />
            ))}
        </div>
    )
}

export default MyGroups

