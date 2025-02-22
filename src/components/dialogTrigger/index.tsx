'use client'
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { BookOpen, Briefcase, Calendar, CheckCircle, DoorOpen, FileText, Globe, Lock, MessageSquare, Rocket, Send, Star, UploadCloud, User, Users, X } from "lucide-react"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { processPDF } from '@/lib/resume-loader'
import { toast } from 'sonner'
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import useLocalStorageState from "use-local-storage-state";
import { useRouter } from 'next/navigation'
import { api } from '@/trpc/react'
import useRefetch from '@/hooks/use-refetch'
import { groupCollapsed } from 'console'

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
        joinedMembers: number,
        privateGroupInfo?: string | null,
        createdBy: {
            firstName: string | null
            lastName: string | null
            imageUrl?: string | null
        }
    }
}

const DialogOpen = ({ group }: GroupCardProps) => {
    // Log the entire group object at the start for debugging
    // console.log("Group prop received:", group)

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [userResume] = useLocalStorageState<string>('userResume');
    const [isLoading, setIsLoading] = useState(false);
    const joinGroups = api.Groups.JoinGroup.useMutation();
    const reftech = useRefetch();

    const router = useRouter();

    const joinGroup = async (groupId: string) => {
        // console.log("Joining group with ID:", groupId);

        try {

            await joinGroups.mutateAsync({ groupId },
                {
                    onSuccess: () => {
                        toast.success("Group Joined Successfully")

                        router.push("/groups/chat")
                        reftech()
                    },
                    onError: (error) => {
                        toast.error("Error while joining group")
                    }
                }
            )

        } catch (error) {

        }

        // router.push("/groups/chat")
    }

    const handlePublicGroupJoin = async (groupdId: string) => {
        await joinGroup(groupdId);
    }

    const handlePrivateGroupJoin = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsLoading(true)

        try {
            const result = await processPDF(userResume!, group.tags, group.privateGroupInfo || "");

            if (result?.verdict === "Approved") {
                await joinGroup(group.id);

                toast.success("Profile accepted,  Joining group process initiated.");
            }

            if (result?.verdict === "Rejected") {
                toast.error("Profile rejected,  Please update your Profile More.");
            }
        } catch (error) {
            toast.error("Error in AI generation");
        }
        finally {
            setIsLoading(false)
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="default"
                    className="w-full transition-all"
                    disabled={group.joinedMembers >= group.maxMembers}
                >
                    {group.joinedMembers >= group.maxMembers ? (
                        <span className="flex items-center gap-2">
                            <Lock className="w-4 h-4" /> Group Full
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            <DoorOpen className="w-4 h-4" /> Join Group
                        </span>
                    )}
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-2xl">
                <DialogHeader className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        {group.isPublic ? (
                            <Users className="w-8 h-8 text-blue-600" />
                        ) : (
                            <Lock className="w-8 h-8 text-purple-600" />
                        )}
                        <DialogTitle className="text-3xl font-bold text-gray-900">
                            {group.name}
                            <span className="ml-3 text-sm font-medium px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                                {group.isPublic ? "Public Group" : "Private Group"}
                            </span>

                        </DialogTitle>
                    </div>

                    <DialogDescription className="text-gray-600 text-sm">
                        {group.isPublic
                            ? `Join ${group.name} and collaborate with ${group.joinedMembers} members`
                            : `Apply to join. AI auto-approves the joining process if you qualify.`}
                    </DialogDescription>

                    {group.isPublic && (
                        <div className="mt-3 space-y-1 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span>{group.joinedMembers}/{group.maxMembers} members</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full">
                                <div
                                    className="h-2 bg-green-500 rounded-full transition-all duration-500"
                                    style={{ width: `${(group.joinedMembers / group.maxMembers) * 100}%` }}
                                />
                            </div>
                        </div>
                    )}
                </DialogHeader>

                {group.isPublic ? (
                    // Public Group Confirmation
                    <div className="space-y-6">
                        <DialogFooter className="flex flex-col gap-3 sm:flex-row">
                            <DialogClose asChild>
                                <Button variant="outline" type="button" className="w-full">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button
                                variant="default"
                                className="w-full bg-green-600 hover:bg-green-700"
                                onClick={() => handlePublicGroupJoin(group.id)}
                            >
                                <CheckCircle className="w-5 h-5 mr-2" />
                                Confirm Join
                            </Button>
                        </DialogFooter>
                    </div>
                ) : (
                    // Private Group Request
                    <form onSubmit={handlePrivateGroupJoin}>
                        <div className="space-y-6">
                            {/* Academic Profile */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="academic-info" className="text-right font-medium">
                                    Academic Profile
                                </Label>
                                <div className="col-span-3">
                                    {userResume ? (
                                        <div className="relative p-4 border border-green-200 bg-green-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <FileText className="w-5 h-5 text-green-600" />
                                                <span className="text-gray-700 font-medium">
                                                    Resume found in your profile
                                                </span>
                                                <div className="flex items-center gap-2 ml-auto">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        asChild
                                                    >
                                                        <a
                                                            href={userResume}
                                                            target="_blank"
                                                            rel="noopener"
                                                        >
                                                            View Resume
                                                        </a>
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        asChild
                                                    >
                                                        <Link href="/groups/resume-upload">
                                                            Update Resume
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="relative p-4 border border-red-200 bg-red-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <AlertTriangle className="w-5 h-5 text-red-600" />
                                                <span className="text-gray-700 font-medium">
                                                    No resume uploaded
                                                </span>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="ml-auto"
                                                    asChild
                                                >
                                                    <Link href="/groups/resume-upload">
                                                        Upload Resume
                                                    </Link>
                                                </Button>
                                            </div>
                                            <p className="text-sm text-red-600 mt-2">
                                                A resume is required for academic profile completion
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Learning Interests */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="interests" className="text-right font-medium">
                                    Learning Goals
                                </Label>
                                <div className="col-span-3">
                                    <Input
                                        id="interests"
                                        placeholder="Web Development, Machine Learning, UI/UX Design..."
                                        className="w-full"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Collaborative Preferences */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="collaboration" className="text-right font-medium">
                                    Study Preferences
                                </Label>
                                <div className="col-span-3 space-y-3">
                                    <Textarea
                                        id="collaboration"
                                        placeholder={`I'm looking to collaborate on...\nI learn best through...`}
                                        rows={3}
                                        className="resize-none"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="social" className="text-right font-medium">
                                    Social Links
                                </Label>
                                <div className="col-span-3 space-y-3">
                                    <Input
                                        id="github"
                                        placeholder="GitHub Profile URL"
                                        className="w-full"
                                        required
                                    />
                                    <Input
                                        id="linkedin"
                                        placeholder="LinkedIn Profile URL"
                                        className="w-full"
                                        required
                                    />
                                </div>
                            </div>

                            <DialogFooter className="flex flex-col gap-3 sm:flex-row">
                                <DialogClose asChild>
                                    <Button variant="outline" type="button" className="w-full">
                                        Cancel
                                    </Button>
                                </DialogClose>

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                                >
                                    {
                                        isLoading
                                            ?
                                            (<div className='flex gap-x-2 items-center'>
                                                <Rocket className="w-5 h-5 mr-2" />
                                                Processing... Please Wait
                                            </div>)
                                            :
                                            (<div className='flex gap-x-2 items-center'>
                                                <Rocket className="w-5 h-5 mr-2" />
                                                Start Learning Journey
                                            </div>)
                                    }
                                </Button>
                            </DialogFooter>
                        </div>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
export default DialogOpen;
