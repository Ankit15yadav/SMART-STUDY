"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { BookOpen, Briefcase, Calendar, CheckCircle, DoorOpen, FileText, Globe, Lock, MessageSquare, Rocket, Send, Star, UploadCloud, User, Users, X } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { useState } from "react"

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
        createdBy: {
            firstName: string | null
            lastName: string | null
            imageUrl?: string | null
        }
    }
    // onJoin: (id: string) => void
}

export default function GroupJoinCard({ group }: GroupCardProps) {

    const membershipPercentage = (group.joinedMembers / group.maxMembers) * 100
    const spotsLeft = group.maxMembers - group.joinedMembers

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

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
                    <Progress
                        value={membershipPercentage}
                        className="h-2 rounded-full"
                    />
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

                                <DialogDescription className="text-gray-600 text-md">
                                    {group.isPublic ? (
                                        `Join ${group.name} and collaborate with ${group.joinedMembers} members`
                                    ) : (
                                        `Request access to this private group. The owner will review your application.`
                                    )}
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
                                            <Button
                                                variant="outline"
                                                type="button"
                                                className="w-full"
                                            >
                                                Cancel
                                            </Button>
                                        </DialogClose>
                                        <Button
                                            variant="default"
                                            className="w-full bg-green-600 hover:bg-green-700"
                                            onClick={() => console.log("Joining group...")}
                                        >
                                            <CheckCircle className="w-5 h-5 mr-2" />
                                            Confirm Join
                                        </Button>
                                    </DialogFooter>
                                </div>
                            ) : (
                                // Private Group Request
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    console.log("Submitting request...");
                                }}>
                                    <div className="space-y-6">
                                        {/* Academic Profile */}
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="academic-info" className="text-right font-medium">
                                                Academic Profile
                                            </Label>
                                            <div className="col-span-3">
                                                <div className="flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg p-6 transition-colors hover:border-blue-500">
                                                    <Input
                                                        id="academic-info"
                                                        type="file"
                                                        className="sr-only"
                                                        accept=".pdf"
                                                        onChange={handleFileChange}
                                                        required
                                                    />

                                                    <label
                                                        htmlFor="academic-info"
                                                        className="flex flex-col items-center gap-2 cursor-pointer w-full"
                                                    >
                                                        {selectedFile ? (
                                                            <div className="flex items-center gap-3">
                                                                <FileText className="w-5 h-5 text-blue-500" />
                                                                <span className="text-gray-700 font-medium">
                                                                    {selectedFile.name}
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setSelectedFile(null)}
                                                                    className="text-red-500 hover:text-red-700"
                                                                >
                                                                    <X className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <BookOpen className="w-8 h-8 text-blue-400" />
                                                                <span className="text-sm font-medium text-gray-600">
                                                                    Upload Academic Materials
                                                                </span>
                                                                <span className="text-xs text-gray-500">
                                                                    Transcripts, Certificates, or Learning Portfolio (PDF only)
                                                                </span>
                                                            </>
                                                        )}
                                                    </label>
                                                </div>
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
                                                <Button
                                                    variant="outline"
                                                    type="button"
                                                    className="w-full"
                                                >
                                                    Cancel
                                                </Button>
                                            </DialogClose>

                                            <Button
                                                type="submit"
                                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                                            >
                                                <Rocket className="w-5 h-5 mr-2" />
                                                Start Learning Journey
                                            </Button>
                                        </DialogFooter>
                                    </div>
                                </form>
                            )}
                        </DialogContent>
                    </Dialog>


                </div>
            </CardContent>
        </Card>
    )
}

