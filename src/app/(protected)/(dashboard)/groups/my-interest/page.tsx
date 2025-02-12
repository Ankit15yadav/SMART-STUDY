'use client'

import React from 'react'
import { api } from '@/trpc/react'
import Image from 'next/image'

type Group = {
    id: string
    name: string
    description: string
    category: string
    imageUrl: string
    tags: string[]
    // include other fields as needed
}

const AllGroupsBasedOnInterest = () => {
    // Fetch the user's interests and split them into an array
    const { data: interests } = api.Groups.getUserInterest.useQuery()
    const interestData = interests?.split(',').map((int) => int.trim()) || []

    // Fetch groups that match the user interests
    const {
        data: groups,
        isLoading,
        error,
    } = api.Groups.GetMatchingGroups.useQuery({ userInterests: interestData })

    // Example joinGroup handler (you would replace this with your actual join group logic)
    const joinGroup = (groupId: string) => {
        console.log('Joining group with id:', groupId)
        // Implement join group logic here, e.g., call a mutation.
    }

    if (isLoading) return <div>Loading groups...</div>
    if (error) return <div>Error loading groups.</div>

    return (
        <div className="groups-container">
            {groups && groups.length > 0 ? (
                groups.map((group) => (
                    <div key={group.id} className="group-card border p-4 m-2 rounded shadow">
                        {/* <Image
                            src={group.imageUrl}
                            alt={`${group.name} image`}
                            width={300}
                            height={100}
                            className="w-full h-48 object-cover rounded"
                        /> */}
                        <h2 className="mt-2 text-xl font-bold">{group.name}</h2>
                        <p className="mt-1 text-gray-600">{group.description}</p>
                        <p className="mt-1">
                            <strong>Category:</strong> {group.category}
                        </p>
                        <p className="mt-1">
                            <strong>Tags:</strong> {group.tags.join(', ')}
                        </p>
                        <button
                            onClick={() => joinGroup(group.id)}
                            className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Join Group
                        </button>
                    </div>
                ))) : (
                <p>No groups match your interests at the moment.</p>
            )}
        </div>
    )
}

export default AllGroupsBasedOnInterest
