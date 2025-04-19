'use client'
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import useRefetch from '@/hooks/use-refetch';
import { api } from '@/trpc/react'
import { Edit, Ellipsis, Globe, Globe2, Loader, Plus, Trash } from 'lucide-react';
import Image from 'next/image';
import React, { ChangeEvent, useState } from 'react'
import { toast } from 'sonner';

type group = {
    name: string;
    id: string;
    description: string;
    imageUrl: string | null;
    isPublic: boolean;
    privateGroupInfo: string | null;
    maxMembers: number;
    category: string;
    tags: string[];
    members: {
        userId: string
    }[];
}

interface EditGroup {
    groupName: string,
    description: string,
    visibility: boolean,
    groupSize: number,
    privateGroupInfo: string | null
}

const GroupShowCard = ({ group }: { group: group }) => {

    const [groupData, setGroupData] = useState<EditGroup>({
        groupName: group?.name,
        description: group?.description,
        visibility: group?.isPublic,
        groupSize: group?.maxMembers,
        privateGroupInfo: group?.privateGroupInfo || "no data"
    })

    const [open, setOpen] = useState(false);

    // const membershipPercentage = (group.joinedMembers / group.maxMembers) * 100
    const updateGroup = api.Groups.updateParticularGroup.useMutation();

    const refetch = useRefetch();


    const handleGroupChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setGroupData((prev) => {
            if (name === "groupSize") {
                const numValue = Number(value);
                return { ...prev, [name]: numValue };
            }
            return { ...prev, [name]: value };
        });
    };


    const handleSwitchChange = (checked: boolean) => {
        setGroupData((prev) => ({ ...prev, visibility: checked }))
    }

    const handleSubmit = async () => {
        await updateGroup.mutateAsync({
            groupdId: group?.id,
            name: groupData.groupName,
            description: groupData.description,
            isPublic: groupData.visibility,
            size: groupData.groupSize,
            privateGroupInfo: groupData.privateGroupInfo || ''
        }, {
            onSuccess: () => {
                toast.success("Group Updated Successfully")
                refetch()
                setOpen(false);

            },
            onError: () => {
                toast.error("Group Updation Failed");
            }
        })

    }

    return (
        <>
            {/* modal for editing */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[600px] p-6">
                    <DialogHeader className="pb-4 border-b mb-4">
                        <DialogTitle className="text-xl font-semibold">Edit Group</DialogTitle>
                        <DialogDescription className="text-gray-500 mt-1">
                            Make changes to your group here. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6 py-4">
                        <div className="grid sm:grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-sm font-medium sm:text-right">
                                Name
                            </Label>
                            <div className="sm:col-span-3">
                                <Input
                                    id="name"
                                    name="groupName"
                                    value={groupData.groupName}
                                    onChange={handleGroupChange}
                                    className="w-full"
                                    placeholder="Enter group name"
                                />
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-4 items-start gap-4">
                            <Label htmlFor="description" className="text-sm font-medium sm:text-right pt-2">
                                Description
                            </Label>
                            <div className="sm:col-span-3">
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={groupData.description}
                                    onChange={handleGroupChange}
                                    className="w-full min-h-[100px] resize-y"
                                    placeholder="Describe your group's purpose"
                                />
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-4 items-center gap-4">
                            <Label htmlFor="size" className="text-sm font-medium sm:text-right">
                                Group Size
                            </Label>
                            <div className="sm:col-span-3">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-primary font-medium text-sm">{groupData.groupSize}</span>
                                </div>
                                <Input
                                    id="size"
                                    name="groupSize"
                                    type="range"
                                    value={groupData.groupSize}
                                    min={group?.members.length || 1}
                                    max={20}
                                    onChange={handleGroupChange}
                                    className="w-full accent-primary"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Adjust group size between {group?.members.length || 1} (current members) and 20 members
                                </p>
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-4 items-center gap-4">
                            <Label htmlFor="isPublic" className="text-sm font-medium sm:text-right">
                                Group Visibility
                            </Label>
                            <div className="sm:col-span-3 flex items-center gap-2">
                                <Switch
                                    id="isPublic"
                                    name="visibility"
                                    checked={groupData.visibility}
                                    onCheckedChange={handleSwitchChange}
                                    className="data-[state=checked]:bg-primary"
                                />
                                <span className="text-sm text-gray-700">
                                    {groupData.visibility ? "Public" : "Private"}
                                </span>
                            </div>
                        </div>

                        {!groupData.visibility && (
                            <div className="grid sm:grid-cols-4 items-start gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-md">
                                <Label htmlFor="privateInfo" className="text-sm font-medium sm:text-right pt-2">
                                    Private Group Requirements
                                </Label>
                                <div className="sm:col-span-3">
                                    <Textarea
                                        id="privateInfo"
                                        name="privateGroupInfo"
                                        value={groupData.privateGroupInfo || ''}
                                        onChange={handleGroupChange}
                                        className="w-full min-h-[80px] resize-y"
                                        placeholder="Define requirements for joining this private group"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        This information will be shown to users requesting to join your group
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="pt-4 border-t mt-2">
                        <div className="flex gap-2 w-full sm:w-auto">
                            <Button
                                variant="outline"
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={updateGroup.isPending}
                                className="min-w-[120px]"
                            >
                                {updateGroup.isPending ? (
                                    <div className="flex items-center justify-center gap-x-2">
                                        <Loader size={18} className="animate-spin" />
                                        <span>Saving...</span>
                                    </div>
                                ) : (
                                    <span>Save Changes</span>
                                )}
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
                <div className=''>
                    <div >
                        <Card className='h-fit min-w-[330px]  py-2 '>
                            <CardContent className='flex justify-between items-center'>
                                <div className='flex gap-x-2 items-center justify-center'>
                                    <p className='text-xs border border-yellow-200 bg-yellow-50 text-yellow-500 w-fit px-2 py-2 rounded-sm'>
                                        {group?.tags[0]}
                                    </p>

                                    <div className='flex gap-x-1 items-center justify-center w-fit bg-slate-100 px-2 py-2 rounded-xl'>
                                        <TooltipProvider >
                                            <Tooltip>
                                                <TooltipTrigger asChild >
                                                    <div className='flex items-center justify-center '>
                                                        <Plus size={12} />

                                                        <p className='text-xs'>
                                                            {group?.tags.length - 1}
                                                        </p>
                                                    </div>

                                                </TooltipTrigger>

                                                <TooltipContent className='bg-yellow-50 border border-yellow-300 text-yellow-500 '>

                                                    {
                                                        group.tags?.slice(1)?.map((tag) => (
                                                            <p key={tag}>
                                                                {tag}
                                                            </p>
                                                        ))
                                                    }
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>

                                    </div>
                                </div>
                                <div className='bg-slate-100 px-2 rounded-xl hover:cursor-pointer'>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Ellipsis />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className='w-20 '>
                                            <DropdownMenuGroup>
                                                <DialogTrigger asChild>
                                                    <DropdownMenuItem className='flex items-center gap-2 hover:cursor-pointer'>
                                                        <Edit size={16} />
                                                        <span>Edit</span>
                                                    </DropdownMenuItem>
                                                </DialogTrigger>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className='hover:cursor-pointer hover:bg-red-300 text-red-400'>
                                                    <Trash className='' />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardContent>
                            <CardContent>
                                <CardTitle className='text-sm font-semibold'>
                                    {group?.name}
                                </CardTitle>
                                <CardDescription>
                                    {group.description.split(" ").slice(0, 5).join(' ')} ...
                                </CardDescription>
                                <div className='flex items-center justify-between mt-4'>
                                    <div>
                                        {group?.isPublic
                                            ?
                                            (
                                                <div className='text-sm flex gap-x-1 items-center w-fit px-2 py-1 bg-green-100 rounded-xl text-green-700'>
                                                    <Globe size={15} />
                                                    public
                                                </div>
                                            )
                                            :
                                            (
                                                <div className='text-sm flex gap-x-1 items-center w-fit px-2 py-1 bg-red-50 rounded-xl text-red-400'>
                                                    <Globe2 size={15} />
                                                    private
                                                </div>
                                            )}
                                    </div>
                                    <div className='text-sm text-gray-800 w-fit bg-gray-100 px-3 py-1 rounded-lg'>
                                        <p>
                                            {group?.members.length} / {group?.maxMembers}
                                        </p>
                                    </div>

                                </div>
                            </CardContent>
                        </Card>


                    </div>
                </div>
            </Dialog>

        </>


    )
}

export default GroupShowCard