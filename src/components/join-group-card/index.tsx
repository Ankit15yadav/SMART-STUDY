"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { DoorClosed, Globe, Lock, User, Users } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import DialogOpen from "../dialogTrigger"
import { useUser } from "@clerk/nextjs"
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
        privateGroupInfo: string | null
        createdBy: {
            firstName: string | null
            lastName: string | null
            imageUrl?: string | null
        }
    }
}

export default function GroupJoinCard({ group }: GroupCardProps) {
    const { user } = useUser()
    const isJoined = user?.id
        ? group.members.some(member => member.userId === user.id)
        : false

    const membershipPercentage = (group.joinedMembers / group.maxMembers) * 100
    const spotsLeft = group.maxMembers - group.joinedMembers

    return (
        <Card className="w-full mx-auto mb-6 overflow-hidden border-2 border-primary/10 hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-md">
            <CardContent className="p-0">
                <div className="flex flex-col md:flex-row items-start gap-6 p-6">
                    {/* Group Image */}
                    <div className="relative h-32 w-32 flex-shrink-0 rounded-xl overflow-hidden border-2 border-primary/20 shadow-sm">
                        {group.imageUrl ? (
                            <Image
                                src={"/assets/images/group.webp"}
                                alt={group.name}
                                layout="fill"
                                objectFit="cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full w-full bg-primary/5">
                                <User className="w-12 h-12 text-primary/60" />
                            </div>
                        )}
                    </div>

                    {/* Group Info */}
                    <div className="flex-grow space-y-3 py-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-2xl font-bold text-foreground">{group.name}</h2>
                            {group.isPublic ? (
                                <Badge variant="outline" className="flex items-center gap-1 bg-green-100 text-primary border-primary/20 px-3 py-1">
                                    <Globe className="w-3 h-3" />
                                    <span>Public</span>
                                </Badge>
                            ) : (
                                <Badge variant="outline" className="flex items-center gap-1 bg-destructive/10 text-destructive border-destructive/20 px-3 py-1">
                                    <Lock className="w-3 h-3" />
                                    <span>Private</span>
                                </Badge>
                            )}
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2">{group.description}</p>

                        <div className="flex flex-wrap gap-2">
                            {group.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                                    #{tag}
                                </Badge>
                            ))}
                        </div>

                        <div className="flex items-center text-sm text-muted-foreground">
                            <User className="w-4 h-4 mr-2 text-primary/70" />
                            <span>
                                Created by <span className="font-medium text-primary/80">{group.createdBy.firstName} {group.createdBy.lastName}</span>
                            </span>
                        </div>
                    </div>

                    {/* Membership Stats and Join Button */}
                    <div className="flex-shrink-0 w-full md:w-56 space-y-4 py-1 mt-4 md:mt-0 border-t md:border-t-0 pt-4 md:pt-0 md:border-l border-primary/10 md:pl-6">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm text-foreground">
                                <span className="flex items-center font-medium">
                                    <Users className="w-4 h-4 mr-2 text-primary" />
                                    {group.joinedMembers} / {group.maxMembers}
                                </span>
                                <span className="text-primary font-medium">{spotsLeft} spots left</span>
                            </div>
                            <Progress
                                value={membershipPercentage}
                                className="h-2.5 bg-primary/10"
                            />
                        </div>

                        {isJoined ? (
                            <Button
                                disabled
                                variant="outline"
                                className="w-full flex items-center justify-center gap-2 border-2 border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 font-medium py-5"
                            >
                                <DoorClosed size={18} />
                                <span>Joined</span>
                            </Button>
                        ) : (
                            <DialogOpen group={group} />
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}