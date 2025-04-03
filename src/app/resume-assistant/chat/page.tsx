'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

const ChatPage = () => {
    const router = useRouter()

    const handleChatCreation = () => {
        const uuid = crypto.randomUUID()
        router.push(`/resume-assistant/chat/${uuid}`)
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
            <h1 className="text-3xl font-bold mb-4">Start a New Chat</h1>
            <p className="text-gray-600 mb-6 text-center max-w-md">
                Click the button below to begin a new chat session .
            </p>
            <Button onClick={handleChatCreation}
                variant={'outline'}
                className="w-48 border-primary">
                Create New Chat
            </Button>
        </div>
    )
}

export default ChatPage
