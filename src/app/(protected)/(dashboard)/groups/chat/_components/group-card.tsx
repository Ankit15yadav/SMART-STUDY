import { Card } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDistanceToNow } from 'date-fns'

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
    selectedGroupid: string,
    messages: Message[],
    isLoading?: boolean
}

interface Message {
    id: string;
    content: string;
    senderId: string;
    groupId: string;
    createdAt: Date;
    sender?: {
        firstName: string | null;
        lastName: string | null;
    };
}

const GroupChatCard = ({ group, selectedGroupid, messages, isLoading = false }: GroupChatCardProps) => {
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

    // Get the latest message for this group
    const latestMessage = messages
        .filter(msg => msg.groupId === group.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

    // Truncate message content if too long
    const truncateMessage = (message: string, maxLength: number = 28) => {
        if (message.length <= maxLength) return message;
        return message.substring(0, maxLength) + '...';
    }

    // Format time for latest message
    const formatMessageTime = (date: Date) => {
        try {
            return formatDistanceToNow(new Date(date), { addSuffix: true });
        } catch (error) {
            return '';
        }
    }

    return (
        <Card
            className={`mt-1 w-full cursor-pointer px-2 py-1 mx-auto rounded-md transition-all duration-200 hover:bg-gray-100 ${selectedGroupid === group.id
                ? 'bg-gray-200 border-primary border-l-4'
                : 'hover:translate-x-1'
                } ${isLoading ? 'opacity-70' : ''}`}
        >
            <div className="flex items-center gap-4 relative">
                {isLoading ? (
                    <Skeleton className="h-12 w-12 rounded-full" />
                ) : (
                    <Avatar className="h-12 w-12 border-2 border-gray-200">
                        {group.imageUrl ? (
                            <AvatarImage src={group.imageUrl} />
                        ) : (
                            <AvatarFallback className="bg-primary text-white">
                                {getInitials(group.name)}
                            </AvatarFallback>
                        )}
                    </Avatar>
                )}

                <div className="flex-1 min-w-0">
                    {isLoading ? (
                        <>
                            <Skeleton className="h-5 w-24 mb-2" />
                            <Skeleton className="h-4 w-32" />
                        </>
                    ) : (
                        <>
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold truncate">{group.name}</h3>
                                {latestMessage && (
                                    <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                                        {formatMessageTime(latestMessage.createdAt)}
                                    </span>
                                )}
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-muted-foreground truncate">
                                    {latestMessage ? (
                                        <>
                                            {latestMessage.sender?.firstName && `${latestMessage.sender.firstName}: `}
                                            {truncateMessage(latestMessage.content)}
                                        </>
                                    ) : (
                                        <span className="text-gray-400">No messages yet</span>
                                    )}
                                </p>
                                <span className="text-xs bg-gray-100 rounded-full px-2 py-0.5">
                                    {membersCount}/{maxMembers}
                                </span>
                            </div>
                        </>
                    )}
                </div>

                {isLoading && (
                    <div className="absolute inset-0 flex justify-center items-center bg-white/50 rounded-md">
                        <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
            </div>
        </Card>
    )
}

export default GroupChatCard