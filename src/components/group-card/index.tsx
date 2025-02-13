import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Globe, Lock, Users, Edit, User } from "lucide-react"
import Image from "next/image"
import { Progress } from "@/components/ui/progress"


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

    return (
        <Card className="w-full max-w-md overflow-hidden hover:shadow-lg transition-shadow group/card">
            <CardContent className="p-0">
                <div className="flex items-start p-4 gap-4">
                    {/* Group Image with hover effect */}
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 border-muted/50 hover:border-primary/20 transition-all">
                        <Image
                            src="/assets/images/group.webp"
                            alt={group.name}
                            layout="fill"
                            objectFit="cover"
                            className="transition-opacity hover:opacity-90"
                            priority
                        />
                    </div>

                    {/* Content Area */}
                    <div className="flex-grow space-y-2">
                        {/* Header Section with improved truncation */}
                        <div className="flex justify-between items-start gap-2">
                            <h3 className="text-lg font-semibold truncate max-w-[70%] hover:text-primary transition-colors">
                                {group.name}
                            </h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onEdit(group.id)}
                                className="h-8 w-8 p-0 rounded-full hover:bg-accent/50"
                                aria-label="Edit group"
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Description with fade effect */}
                        <p className="text-sm text-muted-foreground line-clamp-2 transition-opacity group-hover/card:text-foreground/80">
                            {group.description}
                        </p>

                        {/* Tags Section with hover effects */}
                        {group.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {group.tags.map((tag, index) => (
                                    <Badge
                                        key={index}
                                        variant="secondary"
                                        className="px-2 py-1 text-xs font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                                    >
                                        #{tag}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>

            {/* Footer Section with tighter spacing */}
            <CardFooter className="px-4 py-2.5 bg-muted/10">
                <div className="w-full flex items-center justify-between gap-3">
                    {/* Privacy Indicator with pulse animation */}
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full transition-colors ${group.isPublic
                        ? 'bg-green-100/80 hover:bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-red-100/80 hover:bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        }`}>
                        {group.isPublic ? (
                            <Globe className="h-4 w-4" />
                        ) : (
                            <Lock className="h-4 w-4" />
                        )}
                        <span className="text-sm font-medium">
                            {group.isPublic ? 'Public' : 'Private'}
                        </span>
                    </div>

                    {/* Members & Progress with tooltip-ready container */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                            <User className="h-4 w-4 flex-shrink-0" />
                            <span className="font-medium text-foreground">
                                {group.joinedMembers}
                            </span>
                            <span>/</span>
                            <span>{group.maxMembers}</span>
                        </div>

                        <div className="flex items-center gap-2 w-24 relative">
                            <Progress
                                value={membershipPercentage}
                                className="h-2 bg-muted/50 hover:bg-muted transition-colors"
                                style={{
                                    backgroundColor: '#e5e7eb',
                                    ['--progress' as any]: membershipPercentage >= 90
                                        ? '#f87171'
                                        : membershipPercentage >= 75
                                            ? '#fb923c'
                                            : '#4ade80' // Brighter green
                                }}
                            />
                            <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                {Math.round(membershipPercentage)}%
                            </span>
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}