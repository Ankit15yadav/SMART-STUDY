"use client";

import React, { useState, ChangeEvent, FormEvent, DragEvent } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Loader, Upload } from "lucide-react";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import useRefetch from "@/hooks/use-refetch";
import {
    Command,
    CommandInput,
    CommandList,
    CommandItem,
    CommandEmpty,
} from "@/components/ui/command";
import Image from "next/image";
import { data as InterestList } from "public/assets/interests/data";
import { ScrollArea } from "../ui/scroll-area";

interface FormData {
    groupName: string;
    groupDescription: string;
    maxMembers: number;
    isPublic: boolean;
    tags: string[];
    image: File | null;
    preview: string | null;
    privateGroupInfo?: string | null;
}

const initialFormData: FormData = {
    groupName: "",
    groupDescription: "",
    maxMembers: 2, // starting at the minimum allowed value
    isPublic: true,
    tags: [],
    image: null,
    preview: null,
    privateGroupInfo: null,
};


const CreateGroup: React.FC = () => {
    const [data, setData] = useState<FormData>(initialFormData);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const createGroup = api.Groups.createGroup.useMutation();
    const refetch = useRefetch();

    const filteredInterests = InterestList.filter((interest) =>
        interest.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { id, value } = e.target;
        setData((prev) => ({
            ...prev,
            [id]:
                id === "maxMembers"
                    ? value === ""
                        ? 2
                        : parseInt(value)
                    : value,
        }));
    };

    const handleSwitchChange = (checked: boolean) => {
        setData((prev) => ({ ...prev, isPublic: checked }));
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const preview = URL.createObjectURL(file);
            setData((prev) => ({ ...prev, image: file, preview }));
        }
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            const preview = URL.createObjectURL(file);
            setData((prev) => ({ ...prev, image: file, preview }));
        }
    };

    const handleRemoveImage = () => {
        setData((prev) => ({ ...prev, image: null, preview: null }));
    };

    const handleAddTag = (tag: string) => {
        if (!data.tags.includes(tag) && data.tags.length < 5) {
            setData((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
            setSearchQuery("");
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setData((prev) => ({
            ...prev,
            tags: prev.tags.filter((tag) => tag !== tagToRemove),
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (
            data.groupName.trim() === "" ||
            data.groupDescription.trim() === ""
        ) {
            toast.error("Please fill out all required fields.");
            return;
        }
        if (data.maxMembers < 2 || data.maxMembers > 20) {
            toast.error("Maximum members must be between 2 and 20.");
            return;
        }

        setIsLoading(true);
        try {
            await createGroup.mutateAsync({
                name: data.groupName,
                description: data.groupDescription,
                Maxmembers: data.maxMembers,
                isPublic: data.isPublic,
                Tag: data.tags,
                imageUrl: data.preview || undefined,
                privateGroupInfo: data.privateGroupInfo || undefined,
            });
            toast.success("Group created successfully!");
            refetch();
            setData(initialFormData);
        } catch (error) {
            console.error("Error while creating group:", error);
            toast.error("Failed to create group. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScrollArea className="h-[calc(100vh-4rem)] w-full">
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <Card className="max-w-6xl mx-auto shadow-lg">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-3xl bg-gradient-to-tl from-red-200 to-red-700 bg-clip-text text-transparent text-center font-bold">
                            Create New Group
                        </CardTitle>
                        <CardDescription className="text-gray-500 text-center">
                            Build your community with shared interests and goals
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Group Name */}
                            <div className="space-y-2">
                                <Label htmlFor="groupName">Group Name</Label>
                                <Input
                                    id="groupName"
                                    placeholder="Awesome Community"
                                    value={data.groupName}
                                    onChange={handleInputChange}
                                    maxLength={50}
                                />
                                <span className="text-sm text-gray-500">
                                    {50 - data.groupName.length} characters remaining
                                </span>
                            </div>

                            {/* Cover Image Upload with Improved UI */}
                            <div className="space-y-2">
                                <Label htmlFor="coverImage">Cover Image</Label>
                                <div
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                    className="relative border-2 border-dashed border-gray-300 rounded-md p-6 cursor-pointer hover:border-blue-500 transition-colors"
                                >
                                    <input
                                        id="coverImage"
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        onChange={handleImageChange}
                                    />
                                    {data.preview ? (
                                        <div className="relative">
                                            <Image
                                                src={data.preview}
                                                alt="Cover Preview"
                                                width={100}
                                                height={10}
                                                className="w-full h-fit object-cover rounded-md"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleRemoveImage}
                                                className="absolute top-2 right-2 bg-red-600 rounded-full text-white p-1"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center">
                                            <Upload size={32} className="text-gray-400" />
                                            <p className="mt-2 text-gray-500">
                                                Drag & drop an image here or click to select one
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Group Description */}
                            <div className="space-y-2">
                                <Label htmlFor="groupDescription">Description</Label>
                                <Textarea
                                    id="groupDescription"
                                    placeholder="Describe your group's purpose and goals..."
                                    value={data.groupDescription}
                                    onChange={handleInputChange}
                                    className="min-h-[120px]"
                                    maxLength={300}
                                />
                                <span className="text-sm text-gray-500">
                                    {300 - data.groupDescription.length} characters remaining
                                </span>
                            </div>

                            {/* Tags Select with Search */}
                            <div className="space-y-2">
                                <Label>Tags (Max 5)</Label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {data.tags.map((tag) => (
                                        <Badge
                                            key={tag}
                                            variant="secondary"
                                            className="text-sm pr-1 flex items-center"
                                        >
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTag(tag)}
                                                className="ml-2 hover:text-red-500"
                                            >
                                                <X size={14} />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>

                                <Command className="rounded-lg border">
                                    <CommandInput
                                        placeholder="Search interests..."
                                        value={searchQuery}
                                        onValueChange={setSearchQuery}
                                    />
                                    <CommandList>
                                        {filteredInterests.length > 0 ? (
                                            filteredInterests.map((interest) => (
                                                <CommandItem
                                                    key={interest.id}
                                                    value={interest.title}
                                                    onSelect={() => handleAddTag(interest.title)}
                                                    className="cursor-pointer p-2 hover:bg-gray-50"
                                                >
                                                    {interest.title}
                                                </CommandItem>
                                            ))
                                        ) : (
                                            <CommandEmpty>No matching interests found</CommandEmpty>
                                        )}
                                    </CommandList>
                                </Command>
                                <p className="text-sm text-gray-500 mt-1">
                                    Select relevant interests to help others find your group
                                </p>
                            </div>

                            {/* Privacy and Members */}
                            <div className="flex flex-col ">
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="isPublic"
                                        checked={data.isPublic}
                                        onCheckedChange={handleSwitchChange}
                                    />
                                    <div>
                                        <Label htmlFor="isPublic">Public Group</Label>
                                        <p className="text-sm text-gray-500">
                                            {data.isPublic
                                                ? "Anyone can join this group"
                                                : "Requires invitation to join"}
                                        </p>
                                    </div>
                                </div>


                                {
                                    !data.isPublic && (
                                        <div className="mt-2">
                                            <Label htmlFor="privateGroupInfo"> Group Requirements</Label>
                                            <Textarea
                                                className="mt-2"
                                                placeholder="Describe the requirements to join this private group..."
                                                id="privateGroupInfo"
                                                value={data.privateGroupInfo || ""}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>

                                    )
                                }

                                <div className="space-y-2 mt-4">
                                    <Label htmlFor="maxMembers">Maximum Members</Label>
                                    <Input
                                        id="maxMembers"
                                        type="number"
                                        min="2"
                                        max="20"
                                        value={data.maxMembers}
                                        onChange={handleInputChange}
                                        className="w-full"
                                    />
                                    <p className="text-sm text-gray-500">
                                        Group members must be between 2 and 20.
                                    </p>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <CardFooter className="pt-4 px-0">
                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-x-2">
                                            <Loader className="animate-spin" size={18} />
                                            Creating Group...
                                        </div>
                                    ) : (
                                        "Create Group"
                                    )}
                                </Button>
                            </CardFooter>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </ScrollArea>

    );
};

export default CreateGroup;
