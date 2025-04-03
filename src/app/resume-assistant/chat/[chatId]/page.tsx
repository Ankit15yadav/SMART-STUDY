'use client'
import { Button } from '@/components/ui/button'
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import { Textarea } from '@/components/ui/textarea'
import useRefetch from '@/hooks/use-refetch'
import { api } from '@/trpc/react'
import { UserButton } from '@clerk/nextjs'
import { ArrowUp, ChevronDown, MessageCircleDashed, Plus, PlusSquare, SquarePen } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useState, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import MDEditor from "@uiw/react-md-editor"
import { ScrollArea } from '@/components/ui/scroll-area'
import useLocalStorageState from 'use-local-storage-state'
import { FinalResponse } from '@/lib/deepseek/resume-chat'
import { readStreamableValue } from 'ai/rsc'

interface History {
    title: string | null;
    id: string;
    messages: {
        prompt: string;
        response: string;
        id: string;
    }[];
}[]

const ChatPage = () => {
    const [prompt, setPrompt] = useState<string | null>('')
    const { open } = useSidebar()
    const { data: History, isLoading } = api.chat.getHistory.useQuery()
    const { chatId } = useParams<{ chatId: string }>()
    const [selectedOption, setSelectedOption] = useState<string | null>(null)
    const { data: chatPresent } = api.chat.isChat.useQuery({ chatId: chatId })
    const createGroup = api.chat.createChat.useMutation()
    const refetch = useRefetch()
    const [localMessages, setLocalMessages] = useState<{ prompt: string; response: string; id: string }[]>([])
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const [save, setSave] = useState(false);
    const [storedResume, setStoredResume] = useLocalStorageState<string>("userResume")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter();




    const currentChat = History?.find(chat => chat.id === chatId)

    // Sync local messages with server data
    useEffect(() => {
        if (currentChat?.ResumeMessage) {
            setLocalMessages(currentChat.ResumeMessage)
        }
    }, [currentChat])

    const handleSelection = (option: string) => {
        setSelectedOption(prev => (prev === option ? null : option))
    }

    const handleChatCreation = () => {
        // Your existing creation logic
    }

    const generateTitle = (prompt: string, maxWords = 5) => {
        const words = prompt.trim().split(/\s+/)
        return words.length > maxWords ?
            words.slice(0, maxWords).join(' ') + ' ...' :
            prompt
    }

    const handleFormSubmit = async () => {

        setSave(true);
        if (!storedResume) {
            toast.error("Upload Your Resume First")
            return
        }
        if (!prompt?.trim()) return

        setIsSubmitting(true)
        const userPrompt = prompt
        setPrompt('') // Clear input immediately

        try {
            // Add user message immediately
            setLocalMessages(prev => [
                ...prev,
                {
                    id: Date.now().toString(),
                    prompt: userPrompt,
                    response: ''
                }
            ])

            let answer = ""
            const output = await FinalResponse(storedResume, userPrompt, "")

            for await (const delta of readStreamableValue(output)) {
                if (delta) {
                    answer += delta
                    // Update last message with streaming response
                    setLocalMessages(prev => {
                        const newMessages = [...prev]
                        const lastMessage = newMessages[newMessages.length - 1]
                        if (lastMessage) {
                            newMessages[newMessages.length - 1] = {
                                ...lastMessage,
                                response: answer
                            }
                        }
                        return newMessages
                    })
                }
            }

            if (chatPresent) {
                await createGroup.mutateAsync({
                    chatId: chatId,
                    prompt: prompt,
                    response: answer
                })

            } else {
                await createGroup.mutateAsync({
                    chatId: chatId,
                    prompt: prompt,
                    title: generateTitle(prompt),
                    response: answer
                }, {
                    onSuccess: () => {
                        refetch()
                    }
                })
            }

        } catch (error) {
            toast.error("Failed to generate response")
        } finally {
            setIsSubmitting(false)
        }
    }

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "instant", block: "end" })
        }
    }, [localMessages])

    return (
        <div className='h-screen flex flex-col overflow-x-hidden '>
            {/* Header remains unchanged */}
            <div className='sticky min-h-10 p-3.5 flex  rounded-b-3xl items-center justify-between'>
                <div className='flex gap-x-2'>
                    {!open && (
                        <div className='flex items-center gap-x-3'>
                            <SidebarTrigger />
                            <span className='hover:cursor-pointer' onClick={handleChatCreation}>
                                <SquarePen size={20} />
                            </span>
                        </div>
                    )}
                    <Button className='flex gap-x-1.5 border-0  p-3' variant={'outline'}>
                        <span className='text-xl cursor-pointer'>Upload Resume</span>
                        <Plus size={20} />
                    </Button>
                </div>
                <div className='flex gap-x-2'>
                    <Button className='flex gap-x-0.5 rounded-full items-center justify-center' variant={'outline'}
                        onClick={() => router.push("/user/groups/chat")}
                    >
                        Dashboard
                    </Button>
                    <Button className='flex gap-x-0.5 rounded-full items-center justify-center' variant={'outline'}
                        onClick={() => router.push("/u/home")}
                    >
                        Home
                    </Button>
                    <UserButton />
                </div>
            </div>

            {/* Chat messages section */}
            <div className="flex-1 flex flex-col">
                <ScrollArea className='max-h-[500px] w-full rounded-3xl'>
                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="w-8/12 mx-auto space-y-4">
                            {localMessages.map((message) => (
                                <React.Fragment key={message.id}>
                                    {/* User Message */}
                                    <div className="flex justify-end animate-fade-in">
                                        <div className="max-w-[70%] bg-zinc-500 text-white p-3 rounded-3xl">
                                            {message.prompt}
                                        </div>
                                    </div>
                                    {/* AI Response */}
                                    <div className="flex justify-start animate-fade-in">
                                        <div className=" bg-transparent  p-3 rounded-lg">
                                            <MDEditor.Markdown
                                                style={{
                                                    padding: '2px',
                                                    backgroundColor: 'transparent',
                                                    color: 'dimgray',
                                                    width: '100%'
                                                }}

                                                source={message.response}
                                                className='w-full'
                                            />
                                        </div>
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                    <div
                        ref={messagesEndRef}
                    />
                </ScrollArea>



                {/* Input section */}
                <div className={`w-7/12 mx-auto ${currentChat?.ResumeMessage?.length ? 'mt-auto py-4' : 'flex-1 flex flex-col items-center border-transparent justify-center'}`}>
                    {!currentChat?.ResumeMessage?.length && !save && (
                        <h1 className="text-2xl mb-4 font-semibold">What can I help with your resume?</h1>
                    )}
                    <div className="text-center w-full rounded-4xl border rounded-3xl p-2 border-gray-600">
                        <Textarea
                            className="w-full rounded-2xl max-h-40 !border-none focus:outline-none focus:ring-0 focus:border-none"
                            placeholder="Ask anything"
                            value={prompt ?? ""}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault()
                                    handleFormSubmit();
                                }
                            }}
                        />
                        <div className='flex mt-2 items-center justify-between'>
                            <div className="flex gap-x-2">
                                <Button className="w-fit rounded-full" variant="outline">
                                    <Plus />
                                </Button>
                                <Button
                                    className={`rounded-full cursor-pointer ${selectedOption === 'hello1' ? 'text-white' : 'text-black'}`}
                                    variant={selectedOption === "hello1" ? "default" : "outline"}
                                    onClick={() => handleSelection("hello1")}
                                >
                                    Reason
                                </Button>
                                {/* <Button
                                    className={`rounded-full cursor-pointer ${selectedOption === 'hello2' ? 'text-white' : 'text-black'}`}
                                    variant={selectedOption === "hello2" ? "secondary" : "outline"}
                                    onClick={() => handleSelection("hello2")}
                                >
                                    Lease
                                </Button>
                                <Button
                                    className={`rounded-full cursor-pointer ${selectedOption === 'hello2' ? 'text-white' : 'text-black'}`}
                                    variant={selectedOption === "hello2" ? "secondary" : "outline"}
                                    onClick={() => handleSelection("hello2")}
                                >
                                    Licence
                                </Button> */}
                            </div>
                            <div>
                                <Button
                                    onClick={handleFormSubmit}
                                    className='w-10 h-10 rounded-full'
                                    disabled={isSubmitting || !prompt?.trim()}
                                >
                                    <ArrowUp />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatPage