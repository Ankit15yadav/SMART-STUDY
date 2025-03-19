'use client';

import React, { useState } from 'react';
import { api } from '@/trpc/react';
import MyGroupsSkeleton from "@/components/group-skeleton";
import GroupCard from "@/components/join-group-card";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Search, Info } from 'lucide-react';

const AllGroupsBasedOnInterest = () => {
    // Fetch the user's interests and split them into an array
    const { data: interests } = api.Groups.getUserInterest.useQuery();
    const interestData = interests?.split(',').map((int) => int.trim()) || [];

    // Search functionality
    const [searchQuery, setSearchQuery] = useState('');

    const {
        data: groups,
        isLoading,
        error,
    } = api.Groups.GetMatchingGroups.useQuery({ userInterests: interestData }, {
        staleTime: 1000 * 60 * 2,
    });

    // Filter groups based on tags instead of name or description
    const filteredGroups = groups?.filter(group => {
        return searchQuery === '' ||
            group?.tags.some((tag: string) =>
                tag.toLowerCase().includes(searchQuery.toLowerCase())
            );
    });

    if (error) return <div>Error loading groups.</div>;

    return (
        <div className="p-4">
            <div className="mb-4">
                <div className="flex flex-col mb-6">
                    <div className="flex items-center justify-between border-b pb-4">
                        <h1 className="text-2xl font-semibold text-gray-800">Groups Based on Your Interests</h1>
                        <TooltipProvider>
                            <Tooltip delayDuration={300}>
                                <TooltipTrigger asChild>
                                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700">
                                        <Info className="h-4 w-4" />
                                        <span className="text-sm font-medium">Manage Interests</span>
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent className="bg-white p-3 shadow-lg rounded-md border">
                                    <p className="text-sm text-gray-700 max-w-xs">You can update your interests in your profile settings to discover more relevant groups</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <p className="text-gray-500 text-sm mt-2">Discover and join communities that match what you care about</p>
                </div>

                <div className="relative mt-4 flex">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                        placeholder="Search groups by tags..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-1 w-full md:w-1/2 lg:w-1/3 "
                    />
                </div>
            </div>

            <div>
                <ScrollArea className="h-[calc(100vh-12rem)]">
                    <div className="w-full h-full pb-10">
                        {filteredGroups?.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                No groups match your search criteria. Try searching for different tags.
                            </div>
                        ) : (
                            <>
                                {
                                    isLoading ? (
                                        <div className="mt-2 p-4">
                                            {Array.from({ length: 3 }).map((_, index) => (
                                                <MyGroupsSkeleton key={index} />
                                            ))}
                                        </div>
                                    )
                                        :
                                        (
                                            filteredGroups?.map((group) => (
                                                <GroupCard
                                                    key={group.id}
                                                    group={{
                                                        ...group,
                                                        joinedMembers: group.members.length,
                                                        members: group.members
                                                    }}
                                                />
                                            ))
                                        )
                                }
                            </>


                        )}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
};

export default AllGroupsBasedOnInterest;