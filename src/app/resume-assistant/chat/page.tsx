'use client'
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation'
import React from 'react'

type Props = {}

const ChatPage = (props: Props) => {

    const router = useRouter();

    const handleChatCreation = () => {

        const uuid = crypto.randomUUID();
        router.push(`/resume-assistant/chat/${uuid}`)
    }

    return (
        <div>

            <p>Create New Chat</p>
            <Button
                onClick={handleChatCreation}
            >
                Create New Chat
            </Button>
        </div>
    )
}

export default ChatPage