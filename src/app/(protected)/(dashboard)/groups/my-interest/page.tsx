'use client';

import React from 'react';
import { api } from '@/trpc/react';
import MyGroupsSkeleton from "@/components/group-skeleton";
import GroupCard from "@/components/join-group-card";

const AllGroupsBasedOnInterest = () => {
    // Fetch the user's interests and split them into an array
    const { data: interests } = api.Groups.getUserInterest.useQuery();
    const interestData = interests?.split(',').map((int) => int.trim()) || [];

    // Fetch groups that match the user interests
    const {
        data: groups,
        isLoading,
        error,
    } = api.Groups.GetMatchingGroups.useQuery({ userInterests: interestData });

    const joinGroup = (groupId: string) => {
        console.log('Joining group with id:', groupId);
        // Implement join group logic here, e.g., call a mutation.
    };

    if (isLoading) return (
        <div className="groups-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {Array.from({ length: 3 }).map((_, index) => (
                <MyGroupsSkeleton key={index} />
            ))}
        </div>
    );

    if (error) return <div>Error loading groups.</div>;

    return (
        <div className="w-full">
            {groups?.map((group) => (
                <GroupCard
                    key={group.id}
                    group={{
                        ...group,
                        joinedMembers: group.members.length
                    }}
                    onJoin={joinGroup}
                />
            ))}
        </div>
    );
};

export default AllGroupsBasedOnInterest;