import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Globe, Lock, User, Edit, Loader2, Loader } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { ChangeEvent, useState } from "react"
import { Switch } from "../ui/switch"
import { api } from "@/trpc/react"
import { toast } from "sonner"
import useRefetch from "@/hooks/use-refetch"
import { Textarea } from "../ui/textarea"

interface GroupCardProps {
    group: {
        id: string
        name: string
        category: string
        description: string
        imageUrl: string | null
        isPublic: boolean
        maxMembers: number
        tags: string[],
        joinedMembers: number
        privateGroupInfo: string | null
    }

}

interface EditGroup {
    groupName: string,
    description: string,
    visibility: boolean,
    groupSize: number,
    privateGroupInfo: string | null
}


export function GroupCard({ group }: GroupCardProps) {

    const [groupData, setGroupData] = useState<EditGroup>({
        groupName: group.name,
        description: group.description,
        visibility: group.isPublic,
        groupSize: group.maxMembers,
        privateGroupInfo: group.privateGroupInfo || "no data"
    })

    const [open, setOpen] = useState(false);

    const membershipPercentage = (group.joinedMembers / group.maxMembers) * 100
    const updateGroup = api.Groups.updateParticularGroup.useMutation();

    const refetch = useRefetch();


    const handleGroupChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setGroupData((prev) => {
            if (name === "groupSize") {
                const numValue = Number(value); // Convert directly without parseInt
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

    // Determine progress color based on membership percentage
    const getProgressColor = () => {
        if (membershipPercentage >= 90) return "bg-destructive"
        if (membershipPercentage >= 75) return "bg-warning"
        return "bg-success"
    }

    return (
        <Card className="w-full overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="p-4 pb-0 flex flex-row items-start justify-between space-y-0">
                <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border-2 border-muted">
                        <AvatarImage
                            src={group.imageUrl || '/assets/images/group.webp'}
                            alt={group.name}
                        />
                        <AvatarFallback>{group.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <CardTitle className="text-base sm:text-lg font-semibold line-clamp-1 pr-6">
                                        {group.name}
                                    </CardTitle>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{group.name}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <p className="text-xs text-muted-foreground">{group.category}</p>
                    </div>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label="Edit group"
                            onClick={() => setOpen(true)}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                    </DialogTrigger>
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
                                        min={group.joinedMembers || 1}
                                        max={20}
                                        onChange={handleGroupChange}
                                        className="w-full accent-primary"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Adjust group size between {group.joinedMembers || 1} (current members) and 20 members
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
                </Dialog>

            </CardHeader>

            <CardContent className="p-4">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                {group.description}
                            </p>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-md">
                            <p>{group.description}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                {group.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                        {group.tags.slice(0, 5).map((tag, index) => (
                            <Badge
                                key={index}
                                variant="secondary"
                                className="px-2 py-0.5 text-xs font-medium"
                            >
                                #{tag}
                            </Badge>
                        ))}
                        {group.tags.length > 5 && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Badge variant="outline" className="px-2 py-0.5 text-xs">
                                            +{group.tags.length - 5} more
                                        </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <div className="flex flex-wrap gap-1 max-w-xs">
                                            {group.tags.slice(5).map((tag, index) => (
                                                <Badge key={index} variant="secondary" className="text-xs">
                                                    #{tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </div>
                )}
            </CardContent>

            <CardFooter className="p-3 border-t bg-muted/5 flex flex-col sm:flex-row gap-3">
                <div className="w-full sm:w-auto flex items-center">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${group.isPublic
                                    ? "bg-primary/10 text-primary hover:bg-primary/15"
                                    : "bg-destructive/10 text-destructive hover:bg-destructive/15"
                                    } transition-colors`}>
                                    {group.isPublic ? (
                                        <Globe className="h-3.5 w-3.5" />
                                    ) : (
                                        <Lock className="h-3.5 w-3.5" />
                                    )}
                                    <span className="text-xs font-medium">
                                        {group.isPublic ? "Public" : "Private"}
                                    </span>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{group.isPublic ? "Anyone can join this group" : "Invitation required to join"}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

                <div className="w-full sm:flex-1 flex items-center justify-between sm:justify-end gap-3">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="flex items-center gap-1.5">
                                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span className="text-xs font-medium">
                                        {group.joinedMembers}/{group.maxMembers}
                                    </span>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{group.joinedMembers} of {group.maxMembers} members have joined</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="flex items-center gap-2 w-32">
                                    <Progress
                                        value={membershipPercentage}
                                        className={`h-2 ${getProgressColor()}`}
                                    />
                                    <span className="text-xs text-muted-foreground">
                                        {Math.round(membershipPercentage)}%
                                    </span>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Group is {Math.round(membershipPercentage)}% full</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </CardFooter>
        </Card>
    )
}