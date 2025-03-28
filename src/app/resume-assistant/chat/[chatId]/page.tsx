'use client'
import { Button } from '@/components/ui/button'
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import { Textarea } from '@/components/ui/textarea'
import useRefetch from '@/hooks/use-refetch'
import { api } from '@/trpc/react'
import { UserButton } from '@clerk/nextjs'
import { ArrowUp, ChevronDown, MessageCircleDashed, Plus, SquarePen } from 'lucide-react'
import { useParams } from 'next/navigation'
import React, { useState, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import MDEditor from "@uiw/react-md-editor"
import { ScrollArea } from '@/components/ui/scroll-area'

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



    // Updated function with chunked message handling
    const handleFormSubmit = async () => {
        if (!prompt) return;
        setPrompt('')
        setSave(true);
        const newPrompt = prompt;
        // const fullResponse = generateDemoResponse(newPrompt);

        // Create a temporary message ID for this conversation
        // const tempMessageId = Date.now().toString();

        // // Initialize with empty response
        // setLocalMessages(prev => [
        //     ...prev,
        //     { prompt: newPrompt, response: "", id: tempMessageId }
        // ]);

        // // Simulate chunked response by breaking the full response into pieces
        // const chunkSize = 50; // Characters per chunk
        // const totalChunks = Math.ceil(fullResponse.length / chunkSize);

        // try {
        //     let accumulatedResponse = "";

        //     // Process response in chunks
        //     for (let i = 0; i < totalChunks; i++) {
        //         const start = i * chunkSize;
        //         const end = Math.min(start + chunkSize, fullResponse.length);
        //         const chunk = fullResponse.substring(start, end);

        //         // Add delay to simulate streaming
        //         await new Promise(resolve => setTimeout(resolve, 100));

        //         // Update accumulated response
        //         accumulatedResponse += chunk;

        //         // Update the message with the current accumulated response
        //         setLocalMessages(prev =>
        //             prev.map(msg =>
        //                 msg.id === tempMessageId
        //                     ? { ...msg, response: accumulatedResponse }
        //                     : msg
        //             )
        //         );
        //     }

        //     // Once all chunks are processed, save to database
        //     if (chatPresent) {
        //         await createGroup.mutateAsync({
        //             chatId: chatId,
        //             prompt: newPrompt,
        //             response: fullResponse
        //         }, {
        //             onSuccess: () => {
        //                 refetch();
        //             }
        //         });
        //     } else {
        //         await createGroup.mutateAsync({
        //             chatId: chatId,
        //             prompt: newPrompt,
        //             response: fullResponse,
        //             title: generateTitle(newPrompt)
        //         }, {
        //             onSuccess: () => {
        //                 refetch();
        //             }
        //         });
        //     }
        // } catch (error) {
        //     // Rollback local messages on error
        //     setLocalMessages(prev => prev.filter(msg => msg.id !== tempMessageId));
        //     toast.error("Failed to send message");
        // }

    };

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "instant", block: "end" })
        }
    }, [localMessages])

    return (
        <div className='h-screen flex flex-col overflow-x-hidden'>
            {/* Header remains unchanged */}
            <div className='sticky min-h-20 px-4 flex border border-b-gray-400 rounded-b-3xl items-center justify-between'>
                <div className='flex gap-x-2'>
                    {!open && (
                        <div className='flex items-center gap-x-1'>
                            <SidebarTrigger />
                            <span className='hover:cursor-pointer' onClick={handleChatCreation}>
                                <SquarePen size={20} />
                            </span>
                        </div>
                    )}
                    <Button className='flex gap-x-1.5 border-0 border-none p-3' variant={'ghost'}>
                        <span className='text-xl cursor-pointer'>LawyerUP</span>
                        <ChevronDown size={20} />
                    </Button>
                </div>
                <div className='flex gap-x-2'>
                    <Button className='flex gap-x-0.5 rounded-full items-center justify-center' variant={'outline'}>
                        <MessageCircleDashed size={10} />
                        <p>Temporary</p>
                    </Button>
                    <UserButton />
                </div>
            </div>

            {/* Chat messages section */}
            <div className="flex-1 flex flex-col">
                <ScrollArea className='max-h-[500px] w-full rounded-3xl'>
                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="w-7/12 mx-auto space-y-4">
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
                        <h1 className="text-2xl mb-4 font-semibold">What can I help with?</h1>
                    )}
                    <div className="text-center w-full rounded-4xl border rounded-3xl p-2 border-gray-600">
                        <Textarea
                            className="w-full rounded-2xl max-h-40 border-none focus:outline-none focus:ring-0 focus:border-transparent"
                            placeholder='Ask anything'
                            value={prompt ?? ''}
                            onChange={(e) => setPrompt(e.target.value)}

                        />
                        <div className='flex mt-2 items-center justify-between'>
                            <div className="flex gap-x-2">
                                <Button className="w-fit rounded-full" variant="outline">
                                    <Plus />
                                </Button>
                                <Button
                                    className={`rounded-full cursor-pointer ${selectedOption === 'hello1' ? 'text-white' : 'text-black'}`}
                                    variant={selectedOption === "hello1" ? "secondary" : "outline"}
                                    onClick={() => handleSelection("hello1")}
                                >
                                    Employ
                                </Button>
                                <Button
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
                                </Button>
                            </div>
                            <div>
                                <Button
                                    onClick={handleFormSubmit}
                                    className='w-10 h-10 rounded-full'>
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