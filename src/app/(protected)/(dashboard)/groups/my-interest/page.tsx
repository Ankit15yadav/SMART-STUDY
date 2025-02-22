'use client';

import React from 'react';
import { api } from '@/trpc/react';
import MyGroupsSkeleton from "@/components/group-skeleton";
import GroupCard from "@/components/join-group-card";
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { group } from 'console';
import { ScrollArea } from '@/components/ui/scroll-area';

const AllGroupsBasedOnInterest = () => {
    // Fetch the user's interests and split them into an array
    const { data: interests } = api.Groups.getUserInterest.useQuery();
    const interestData = interests?.split(',').map((int) => int.trim()) || [];

    const {
        data: groups,
        isLoading,
        error,
    } = api.Groups.GetMatchingGroups.useQuery({ userInterests: interestData }, {
        staleTime: 1000 * 60 * 2,
    });

    // console.log("groups of my interest", groups);

    if (isLoading) return (
        <div className="mt-2 p-4">
            {Array.from({ length: 3 }).map((_, index) => (
                <MyGroupsSkeleton key={index} />
            ))}
        </div>
    );

    if (error) return <div>Error loading groups.</div>;

    return (
        <div>
            {/* <div>
                <h1 className="text-2xl font-bold">Groups based on your interests</h1>
            </div> */}
            <div>
                <ScrollArea className='h-[calc(100vh-4rem)]'>
                    <div className="w-full h-full pb-10">
                        {groups?.map((group) => (
                            <GroupCard
                                key={group.id}
                                group={{
                                    ...group,
                                    joinedMembers: group.members.length,
                                    members: group.members
                                }}
                            />
                        ))}
                    </div>
                </ScrollArea>
            </div>


        </div>

    );
};

export default AllGroupsBasedOnInterest;