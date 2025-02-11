"use client";

import React, { useState, ChangeEvent, KeyboardEvent, FormEvent } from "react";
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
import { X, Upload, Loader } from "lucide-react";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { number } from "zod";
import useRefetch from "@/hooks/use-refetch";

interface FormData {
    groupName: string;
    groupDescription: string;
    groupCategory: string;
    maxMembers: number,
    isPublic: boolean;
    tags: string[];
    image: File | null;
    preview: string | null;
}

const initialFormData: FormData = {
    groupName: "",
    groupDescription: "",
    groupCategory: "",
    maxMembers: 0,
    isPublic: true,
    tags: [],
    image: null,
    preview: null,
};

const CreateGroup: React.FC = () => {
    const [data, setData] = useState<FormData>(initialFormData);
    const [currentTag, setCurrentTag] = useState<string>("");
    const createGroup = api.Groups.createGroup.useMutation();
    const [isLoading, setIsLoading] = useState(false);
    const refetch = useRefetch();

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { id, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [id]: id === "maxMembers" ? (value ? parseInt(value) : "") : value,
        }));
    };

    const handleSwitchChange = (checked: boolean) => {
        setData((prevData) => ({
            ...prevData,
            isPublic: checked,
        }));
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData((prevData) => ({
                ...prevData,
                image: file,
                preview: URL.createObjectURL(file),
            }));
        }
    };

    const removeImage = () => {
        setData((prevData) => ({
            ...prevData,
            image: null,
            preview: null,
        }));
    };

    const handleAddTag = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && currentTag.trim() !== "") {
            e.preventDefault();
            setData((prevData) => ({
                ...prevData,
                tags: [...prevData.tags, currentTag.trim()],
            }));
            setCurrentTag("");
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setData((prevData) => ({
            ...prevData,
            tags: prevData.tags.filter((tag) => tag !== tagToRemove),
        }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        setIsLoading(true);
        try {

            const inputData = {
                name: data.groupName,
                description: data.groupDescription,
                Maxmembers: data.maxMembers,
                imageUrl: data.preview || undefined,
                category: data.groupCategory,
                isPublic: data.isPublic,
                Tag: data.tags,
            };
            createGroup.mutate(inputData, {
                onSuccess: () => {
                    setIsLoading(false);
                    setData(initialFormData);
                    refetch()
                    toast.success("Group created successfully");
                },
                onError: (error) => {
                    setIsLoading(false);
                    toast.error("Failed to create group",);
                },
            })

        } catch (error) {
            console.error("Failed to create group", error);
            setIsLoading(false);
            toast.error("Failed to create group , please try again");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Card className="max-w-7xl mx-auto shadow-lg">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-3xl bg-gradient-to-tl from-red-200 to-red-700 bg-clip-text text-transparent flex justify-center font-bold">
                        Create  Group
                    </CardTitle>
                    <CardDescription className="text-gray-500 flex justify-center">
                        Connect with like-minded individuals, define your purpose, and
                        start collaborating!
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Group Name */}
                        <div className="space-y-2">
                            <Label htmlFor="groupName" className="text-gray-700">
                                Group Name
                            </Label>
                            <Input
                                id="groupName"
                                placeholder="Enter name of your group"
                                required
                                className="w-full"
                                value={data.groupName}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Group Description */}
                        <div className="space-y-2">
                            <Label htmlFor="groupDescription" className="text-gray-700">
                                Group Description
                            </Label>
                            <Textarea
                                id="groupDescription"
                                placeholder="Describe the purpose and goals of your group"
                                required
                                className="w-full min-h-[100px]"
                                value={data.groupDescription}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-2">
                            <Label className="text-gray-700">
                                Cover Image (Optional)
                            </Label>
                            <div className="border border-dashed border-gray-300 p-4 rounded-lg text-center cursor-pointer">
                                {data.preview ? (
                                    <div className="relative w-full">
                                        <img
                                            src={data.preview}
                                            alt="Preview"
                                            className="mx-auto max-h-40 rounded-lg shadow-md"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center cursor-pointer">
                                        <Upload className="text-gray-500 mb-2" />
                                        <span className="text-gray-500 text-sm">
                                            Click to upload or drag and drop
                                        </span>
                                        <Input
                                            id="coverImage"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Group Category */}
                        <div className="space-y-2">
                            <Label htmlFor="groupCategory" className="text-gray-700">
                                Group Category
                            </Label>
                            <Input
                                id="groupCategory"
                                placeholder="Enter your group's category"
                                required
                                className="w-full"
                                value={data.groupCategory}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Tags */}
                        <div className="space-y-2">
                            <Label htmlFor="tags" className="text-gray-700">
                                Tags
                            </Label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {data.tags.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="text-sm">
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTag(tag)}
                                            className="ml-2 text-gray-500 hover:text-gray-700"
                                        >
                                            <X size={14} />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                            <Input
                                id="tags"
                                placeholder="Add tags and press Enter"
                                value={currentTag}
                                onChange={(e) => setCurrentTag(e.target.value)}
                                onKeyDown={handleAddTag}
                                className="w-full"
                            />
                        </div>

                        {/* Public or Private */}
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="isPublic"
                                checked={data.isPublic}
                                onCheckedChange={handleSwitchChange}
                            />
                            <Label htmlFor="isPublic" className="text-gray-700">
                                Public Group
                            </Label>
                        </div>

                        {/* Maximum Members */}
                        <div className="space-y-2">
                            <Label htmlFor="maxMembers" className="text-gray-700">
                                Maximum Members
                            </Label>
                            <Input
                                id="maxMembers"
                                type="number"
                                placeholder="Enter maximum number of members"
                                min="2"
                                required
                                className="w-full"
                                value={data.maxMembers}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Submit Button */}
                        <CardFooter className="pt-4">
                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                disabled={isLoading}
                            >
                                {
                                    isLoading ? (<div className="flex gap-x-1">
                                        <Loader className="animate-spin" />
                                        Creating...
                                    </div>)
                                        :
                                        (<div>
                                            Create Group
                                        </div>)
                                }
                            </Button>
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateGroup;
