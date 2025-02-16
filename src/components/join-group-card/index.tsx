"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { DoorClosed, Globe, Lock, User } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import DialogOpen from "../dialogTrigger"
import { useUser } from "@clerk/nextjs" // Import Clerk's hook
import { Button } from "../ui/button"

interface GroupCardProps {
    group: {
        id: string
        name: string
        category: string
        description: string
        imageUrl: string | null
        isPublic: boolean
        maxMembers: number
        tags: string[]
        joinedMembers: number
        members: {
            userId: string
        }[],
        createdBy: {
            firstName: string | null
            lastName: string | null
            imageUrl?: string | null
        }
    }
    // onJoin: (id: string) => void
}

export default function GroupJoinCard({ group }: GroupCardProps) {
    const { user } = useUser() // Get the current user from Clerk
    const isJoined = user?.id
        ? group.members.some(member => member.userId === user.id)
        : false

    const membershipPercentage = (group.joinedMembers / group.maxMembers) * 100
    const spotsLeft = group.maxMembers - group.joinedMembers

    return (
        <Card className="w-11/12 mx-auto mb-4 overflow-hidden shadow-md transition-shadow hover:shadow-lg">
            <CardContent className="p-4 flex items-center gap-4">
                {/* Group Image */}
                <div className="relative h-24 w-24 flex-shrink-0">
                    {group.imageUrl ? (
                        <Image
                            src={"/assets/images/group.webp"}
                            alt={group.name}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-lg"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full w-full bg-gray-200 rounded-lg">
                            <User className="w-8 h-8 text-gray-400" />
                        </div>
                    )}
                </div>

                {/* Group Info */}
                <div className="flex-grow space-y-2">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-800">{group.name}</h2>
                        {group.isPublic ? (
                            <div className="flex items-center gap-1 text-green-600 text-sm">
                                <Globe className="w-4 h-4" />
                                <span>Public</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1 text-red-600 text-sm">
                                <Lock className="w-4 h-4" />
                                <span>Private</span>
                            </div>
                        )}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{group.description}</p>
                    <div className="flex flex-wrap gap-2">
                        {group.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                                #{tag}
                            </Badge>
                        ))}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        <User className="w-4 h-4 mr-1" />
                        <span>
                            Created by {group.createdBy.firstName} {group.createdBy.lastName}
                        </span>
                    </div>
                </div>

                {/* Membership Stats and Join Button */}
                <div className="flex-shrink-0 w-48 space-y-2">
                    <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>
                            {group.joinedMembers} / {group.maxMembers} members
                        </span>
                        <span>{spotsLeft} spots left</span>
                    </div>
                    <Progress value={membershipPercentage} className="h-2 rounded-full" />

                    {isJoined ? (
                        // If the user has already joined, show a disabled "Joined" button
                        <Button
                            disabled
                            className="w-full flex items-center py-2 rounded-md "
                        >
                            <DoorClosed size={20} />
                            Joined
                        </Button>
                    ) : (
                        // Otherwise, show the join dialog trigger
                        <DialogOpen group={group} />
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
