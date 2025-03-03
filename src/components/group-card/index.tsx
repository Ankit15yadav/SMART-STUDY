import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Globe, Lock, User, Edit, MoreHorizontal } from "lucide-react"
import Image from "next/image"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
    }
    onEdit: (id: string) => void
}

export function GroupCard({ group, onEdit }: GroupCardProps) {
    const membershipPercentage = (group.joinedMembers / group.maxMembers) * 100

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
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(group.id)}
                    className="h-8 w-8 rounded-full"
                    aria-label="Edit group"
                >
                    <Edit className="h-4 w-4" />
                </Button>
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