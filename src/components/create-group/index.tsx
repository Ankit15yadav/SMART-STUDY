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
import { X, Loader, Upload, Info } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

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
    const [selectedValue, setSelectedValue] = useState('beginner');
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

        if (!data.isPublic && !data.privateGroupInfo) {
            toast.error("Please provide requirements for your private group.");
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
                evaluationCriteria: selectedValue || '',
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
            <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
                <Card className="max-w-7xl mx-auto shadow-md border-border">
                    <CardHeader className="space-y-1 pb-4">
                        <CardTitle className="text-2xl font-bold text-center text-primary">
                            Create New Group
                        </CardTitle>
                        <CardDescription className="text-muted-foreground text-center">
                            Build your community with shared interests and goals
                        </CardDescription>
                    </CardHeader>
                    <Separator className="mb-6" />
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Cover Image Upload with Improved UI */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="coverImage" className="text-base font-medium">Cover Image</Label>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <Info size={16} className="text-muted-foreground" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p className="w-60">Upload an image that represents your group</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                                <div
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                    className="relative border-2 border-dashed rounded-lg p-6 cursor-pointer transition-all hover:border-primary hover:bg-primary/5"
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
                                                width={400}
                                                height={225}
                                                className="w-full h-48 object-cover rounded-md"
                                            />
                                            <Button
                                                type="button"
                                                onClick={handleRemoveImage}
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-2 right-2"
                                            >
                                                <X size={16} />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-8">
                                            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                                                <Upload size={24} className="text-primary" />
                                            </div>
                                            <p className="mt-4 text-muted-foreground text-center">
                                                Drag & drop an image here or click to select one
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Basic Information Section */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>

                                {/* Group Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="groupName" className="text-base">Group Name <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="groupName"
                                        placeholder="Enter your group name"
                                        value={data.groupName}
                                        onChange={handleInputChange}
                                        maxLength={50}
                                        className="focus-visible:ring-primary"
                                        required
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        {50 - data.groupName.length} characters remaining
                                    </p>
                                </div>

                                {/* Group Description */}
                                <div className="space-y-2">
                                    <Label htmlFor="groupDescription" className="text-base">Description <span className="text-destructive">*</span></Label>
                                    <Textarea
                                        id="groupDescription"
                                        placeholder="Describe your group's purpose and goals..."
                                        value={data.groupDescription}
                                        onChange={handleInputChange}
                                        className="min-h-32 focus-visible:ring-primary"
                                        maxLength={300}
                                        required
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        {300 - data.groupDescription.length} characters remaining
                                    </p>
                                </div>
                            </div>

                            <Separator />

                            {/* Group Settings Section */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-foreground">Group Settings</h3>

                                {/* Privacy Settings */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label htmlFor="isPublic" className="text-base">Group Privacy</Label>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {data.isPublic
                                                    ? "Anyone can join this group"
                                                    : "Requires invitation to join"}
                                            </p>
                                        </div>
                                        <Switch
                                            id="isPublic"
                                            checked={data.isPublic}
                                            onCheckedChange={handleSwitchChange}
                                            className="data-[state=checked]:bg-primary"
                                        />
                                    </div>

                                    {!data.isPublic && (
                                        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                                            <div>
                                                <Label htmlFor="privateGroupInfo" className="text-base">Private Group Requirements <span className="text-destructive">*</span></Label>
                                                <Textarea
                                                    className="mt-2 focus-visible:ring-primary"
                                                    placeholder="Describe the requirements to join this private group..."
                                                    id="privateGroupInfo"
                                                    value={data.privateGroupInfo || ""}
                                                    onChange={handleInputChange}
                                                    required
                                                />

                                                <div className="mt-4">
                                                    <Label htmlFor="evaluationCriteria" className="text-base" >AI Evaluation Criteria <span className="text-destructive">*</span></Label>
                                                    <RadioGroup
                                                        defaultValue="comfortable"
                                                        name="evaluationCriteria"
                                                        value={selectedValue}
                                                        onValueChange={setSelectedValue}
                                                        className="mt-4 flex gap-x-4"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="beginner" id="r1" />
                                                            <Label htmlFor="r1">Beginner</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="intermediate" id="r2" />
                                                            <Label htmlFor="r2">Intermediate</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="advance" id="r3" />
                                                            <Label htmlFor="r3">Advance</Label>
                                                        </div>
                                                    </RadioGroup>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Max Members */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="maxMembers" className="text-base">Maximum Members</Label>
                                        <span className="text-primary font-medium">{data.maxMembers}</span>
                                    </div>
                                    <Input
                                        id="maxMembers"
                                        type="range"
                                        min="2"
                                        max="20"
                                        value={data.maxMembers}
                                        onChange={handleInputChange}
                                        className="w-full focus-visible:ring-primary accent-primary"
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        Group size must be between 2 and 20 members
                                    </p>
                                </div>
                            </div>

                            <Separator />

                            {/* Tags Section */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-foreground">Group Tags</h3>
                                    <Badge variant="outline" className="text-primary border-primary/50">
                                        {data.tags.length}/5
                                    </Badge>
                                </div>

                                <Command className="rounded-lg border shadow-sm">
                                    <CommandInput
                                        placeholder="Search interests..."
                                        value={searchQuery}
                                        onValueChange={setSearchQuery}
                                        className="focus-visible:ring-primary"
                                    />
                                    <CommandList className="max-h-40">
                                        {filteredInterests.length > 0 ? (
                                            filteredInterests.map((interest) => (
                                                <CommandItem
                                                    key={interest.id}
                                                    value={interest.title}
                                                    onSelect={() => handleAddTag(interest.title)}
                                                    className="cursor-pointer hover:bg-primary/10"
                                                    disabled={data.tags.includes(interest.title) || data.tags.length >= 5}
                                                >
                                                    {interest.title}
                                                </CommandItem>
                                            ))
                                        ) : (
                                            <CommandEmpty>No matching interests found</CommandEmpty>
                                        )}
                                    </CommandList>
                                </Command>

                                <div className="flex flex-wrap gap-2 min-h-12">
                                    {data.tags.map((tag) => (
                                        <Badge
                                            key={tag}
                                            className="bg-primary/10 text-primary border-primary/30 hover:bg-primary/20 px-3 py-1"
                                        >
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTag(tag)}
                                                className="ml-2 text-primary hover:text-destructive"
                                            >
                                                <X size={14} />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Select relevant interests to help others find your group
                                </p>
                            </div>
                        </form>
                    </CardContent>

                    <CardFooter className="flex justify-end gap-4 pt-6 pb-8 px-6">
                        <Button
                            variant="outline"
                            onClick={() => setData(initialFormData)}
                            disabled={isLoading}
                            className="w-1/3"
                        >
                            Reset
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            className="w-2/3 bg-primary hover:bg-primary/90 text-primary-foreground"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-x-2">
                                    <Loader className="animate-spin" size={18} />
                                    <span>Creating Group...</span>
                                </div>
                            ) : (
                                "Create Group"
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </ScrollArea>
    );
};

export default CreateGroup;