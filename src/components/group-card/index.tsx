import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Globe, Lock, Users, Edit } from "lucide-react"
import Image from "next/image"

interface GroupCardProps {
    group: {
        id: string
        name: string
        category: string
        description: string
        imageUrl: string | null
        isPublic: boolean
        maxMembers: number
    }
    onEdit: (id: string) => void
}

export function GroupCard({ group, onEdit }: GroupCardProps) {
    const categories = group.category.split(",").map((cat) => cat.trim())

    return (
        <Card className="w-full max-w-md overflow-hidden">
            <CardContent className="p-0">
                <div className="flex items-start p-4">
                    <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 mr-4">
                        <Image
                            src={"/assets/images/group.webp"}
                            alt={group.name}
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>
                    <div className="flex-grow">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-semibold">{group.name}</h3>
                            <Button variant="ghost" size="icon" onClick={() => onEdit(group.id)}>
                                <Edit className="h-4 w-4" />
                            </Button>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{group.description}</p>
                        <div className="flex flex-wrap gap-1 mb-2">
                            {categories.map((category, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                    {category}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center bg-muted/50 px-4 py-2">
                <div className="flex items-center text-sm text-muted-foreground">
                    {group.isPublic ? (
                        <>
                            <Globe className="w-4 h-4 mr-1" />
                            <span>Public</span>
                        </>
                    ) : (
                        <>
                            <Lock className="w-4 h-4 mr-1" />
                            <span>Private</span>
                        </>
                    )}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="w-4 h-4 mr-1" />
                    <span>Max: {group.maxMembers}</span>
                </div>
            </CardFooter>
        </Card>
    )
}

