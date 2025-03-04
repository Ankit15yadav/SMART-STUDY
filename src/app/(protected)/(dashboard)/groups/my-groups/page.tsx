"use client"

import { GroupCard } from "@/components/group-card"
import { api } from "@/trpc/react"
import MyGroupsSkeleton from "@/components/group-skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

const MyGroups = () => {
    const { data: groups, isLoading } = api.Groups.getMyGroups.useQuery()
    const [searchQuery, setSearchQuery] = useState("")

    const router = useRouter();

    const handleEdit = (groupId: string) => {
        // Implement edit functionality here
        router.push(`/groups/my-groups/edit/${groupId}`);

    }

    // Filter groups based on search query
    const filteredGroups = groups?.filter((group) => {
        const searchTerm = searchQuery.toLowerCase()
        return (
            group.name.toLowerCase().includes(searchTerm) ||
            group.description.toLowerCase().includes(searchTerm) ||
            group.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        )
    })

    return (
        <div className="flex flex-col h-full w-full">
            {/* Header with title and search */}
            <div className="p-6 pb-2 border-b">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold tracking-tight">My Created Groups</h1>
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search groups..."
                            className="pl-9 w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <p className="text-muted-foreground mt-1">
                    Manage the groups you've created
                </p>
            </div>

            {/* Groups content area */}
            <ScrollArea className="flex-grow">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                    {isLoading ? (
                        // Show skeleton cards while loading
                        Array.from({ length: 3 }).map((_, index) => (
                            <MyGroupsSkeleton key={index} />
                        ))
                    ) : filteredGroups && filteredGroups.length > 0 ? (
                        // Show filtered groups
                        filteredGroups.map((group) => (
                            <GroupCard
                                key={group.id}
                                group={{
                                    ...group,
                                    imageUrl: group.imageUrl || "",
                                    joinedMembers: group.members.length,
                                }}
                                onEdit={handleEdit}
                            />
                        ))
                    ) : filteredGroups && filteredGroups.length === 0 ? (
                        // No results found
                        <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                            <Search className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium">No groups found</h3>
                            <p className="text-muted-foreground mt-1">
                                {searchQuery
                                    ? "Try a different search term or create a new group"
                                    : "You haven't created any groups yet"}
                            </p>
                        </div>
                    ) : null}
                </div>
            </ScrollArea>
        </div>
    )
}

export default MyGroups