import { Card } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

interface GroupChatCardProps {
    group: {
        id: string
        name: string
        imageUrl: string | null
        maxMembers: number
        members: {
            userId: string
        }[]
    },
    selectedGroupid: string
    messages: Message[]
}

interface Message {
    id: string;
    content: string;
    senderId: string;
    createdAt: Date;
    sender?: {
        firstName: string | null;
        lastName: string | null;
    };
}

const GroupChatCard = ({ group, selectedGroupid, messages }: GroupChatCardProps) => {
    const membersCount = group.members.length
    const maxMembers = group.maxMembers

    // Generate initials from group name
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .slice(0, 2)
            .map(word => word[0])
            .join('')
            .toUpperCase()
    }

    return (
        <Card className={`mt-1 cursor-pointer p-2 rounded-md transition-colors ${selectedGroupid === group.id ? 'bg-gray-300' : ''
            }`}>
            <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                    {group.imageUrl && (
                        <AvatarImage src={group.imageUrl} />
                    )}
                    <AvatarFallback>
                        {getInitials(group.name)}
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                    <h3 className="font-semibold">{group.name}</h3>
                    <p className="text-sm text-muted-foreground">
                        {messages[0]?.sender?.firstName}
                        {" "}
                        {messages[0]?.content}
                    </p>
                </div>
            </div>
        </Card>
    )
}

export default GroupChatCard