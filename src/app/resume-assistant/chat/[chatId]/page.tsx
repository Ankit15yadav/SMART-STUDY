'use client'
import { Button } from '@/components/ui/button'
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import { Textarea } from '@/components/ui/textarea'
import useRefetch from '@/hooks/use-refetch'
import { api } from '@/trpc/react'
import { UserButton } from '@clerk/nextjs'
import { ArrowUp, ChevronDown, MessageCircleDashed, Plus, PlusSquare, SquarePen } from 'lucide-react'
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

    // Generate a comprehensive demo response with bullet points and code snippets
    const generateDemoResponse = (prompt: string) => {
        // Create base response that incorporates the user's prompt
        let baseResponse = `# Comprehensive Analysis of\n\n`;

        // Introduction
        // baseResponse += `Thank you for your query about "${prompt}". Below is a detailed analysis of key considerations and recommendations for implementation.\n\n`;

        // Key Considerations
        baseResponse += `## Key Considerations for Implementation\n\n`;
        baseResponse += "The following points are crucial for a successful implementation:\n\n";
        baseResponse += "- **Integration with Existing Architecture**: Ensure seamless integration to minimize disruptions to current workflows.\n\n";
        baseResponse += "- **Scalability**: Prioritize scalability to accommodate future growth and increasing data volumes.\n\n";
        baseResponse += "- **Security**: Implement end-to-end encryption for all message transmissions.\n\n";
        baseResponse += "- **Performance Optimization**: Optimize performance, particularly for the message chunking mechanism, to ensure a smooth user experience.\n\n";
        baseResponse += "- **Cross-Platform Compatibility**: Ensure consistent functionality across different devices and browsers.\n\n";

        // Recommended Implementation Approach
        baseResponse += `## Recommended Implementation Approach\n\n`;
        baseResponse += "To achieve a robust and efficient system, consider the following strategies:\n\n";
        baseResponse += "- **Microservices Architecture**: Separate messaging functionality from other\n\n system components using a microservices architecture.\n\n";
        baseResponse += "- **WebSocket Connections**: Use WebSocket connections for real-time message delivery \n\n instead of traditional HTTP requests.\n\n";
        baseResponse += "- **Caching Layer**: Implement a caching layer to improve response times for frequently \n\naccessed message history.\n\n";
        baseResponse += "- **Progressive Loading**: Consider implementing progressive loading patterns for message \n\nhistory to improve initial load times.\n\n";

        // Code Implementation Example
        baseResponse += `### Code Implementation Example\n\n`;
        baseResponse += "Here's a JavaScript code example for a chunked message delivery system:\n\n";
        // baseResponse += "
        baseResponse += "// Message chunking implementation\n";
        baseResponse += "class MessageChunker {\n";
        baseResponse += "  constructor(message, chunkSize = 50, delayMs = 100) {\n";
        baseResponse += "    this.message = message;\n";
        baseResponse += "    this.chunkSize = chunkSize;\n";
        baseResponse += "    this.delayMs = delayMs;\n";
        baseResponse += "    this.chunks = this.prepareChunks();\n";
        baseResponse += "  }\n\n";
        baseResponse += "  prepareChunks() {\n";
        baseResponse += "    const totalChunks = Math.ceil(this.message.length / this.chunkSize);\n";
        baseResponse += "    const chunks = [];\n";
        baseResponse += "    \n";
        baseResponse += "    for (let i = 0; i < totalChunks; i++) {\n";
        baseResponse += "      const start = i * this.chunkSize;\n";
        baseResponse += "      const end = Math.min(start + this.chunkSize, this.message.length);\n";
        baseResponse += "      chunks.push(this.message.substring(start, end));\n";
        baseResponse += "    }\n";
        baseResponse += "    \n";
        baseResponse += "    return chunks;\n";
        baseResponse += "  }\n\n";
        baseResponse += "  async streamToUI(updateCallback) {\n";
        baseResponse += "    let accumulatedText = '';\n";
        baseResponse += "    \n";
        baseResponse += "    for (const chunk of this.chunks) {\n";
        baseResponse += "      await new Promise(resolve => setTimeout(resolve, this.delayMs));\n";
        baseResponse += "      accumulatedText += chunk;\n";
        baseResponse += "      updateCallback(accumulatedText);\n";
        baseResponse += "    }\n";
        baseResponse += "    \n";
        baseResponse += "    return accumulatedText;\n";
        baseResponse += "  }\n";
        baseResponse += "}\n";
        baseResponse += "```\n\n";

        return baseResponse;
    };


    // Updated function with chunked message handling
    const handleFormSubmit = async () => {
        if (!prompt) return;
        setPrompt('')
        setSave(true);
        const newPrompt = prompt;
        const fullResponse = generateDemoResponse(newPrompt);

        // Create a temporary message ID for this conversation
        const tempMessageId = Date.now().toString();

        // Initialize with empty response
        setLocalMessages(prev => [
            ...prev,
            { prompt: newPrompt, response: "", id: tempMessageId }
        ]);

        // Simulate chunked response by breaking the full response into pieces
        const chunkSize = 50; // Characters per chunk
        const totalChunks = Math.ceil(fullResponse.length / chunkSize);

        try {
            let accumulatedResponse = "";

            // Process response in chunks
            for (let i = 0; i < totalChunks; i++) {
                const start = i * chunkSize;
                const end = Math.min(start + chunkSize, fullResponse.length);
                const chunk = fullResponse.substring(start, end);

                // Add delay to simulate streaming
                await new Promise(resolve => setTimeout(resolve, 100));

                // Update accumulated response
                accumulatedResponse += chunk;

                // Update the message with the current accumulated response
                setLocalMessages(prev =>
                    prev.map(msg =>
                        msg.id === tempMessageId
                            ? { ...msg, response: accumulatedResponse }
                            : msg
                    )
                );
            }

            // Once all chunks are processed, save to database
            if (chatPresent) {
                await createGroup.mutateAsync({
                    chatId: chatId,
                    prompt: newPrompt,
                    response: fullResponse
                }, {
                    onSuccess: () => {
                        refetch();
                    }
                });
            } else {
                await createGroup.mutateAsync({
                    chatId: chatId,
                    prompt: newPrompt,
                    response: fullResponse,
                    title: generateTitle(newPrompt)
                }, {
                    onSuccess: () => {
                        refetch();
                    }
                });
            }
        } catch (error) {
            // Rollback local messages on error
            setLocalMessages(prev => prev.filter(msg => msg.id !== tempMessageId));
            toast.error("Failed to send message");
        }

    };

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "instant", block: "end" })
        }
    }, [localMessages])

    return (
        <div className='h-screen flex flex-col overflow-x-hidden'>
            {/* Header remains unchanged */}
            <div className='sticky min-h-10 p-3.5 flex  rounded-b-3xl items-center justify-between'>
                <div className='flex gap-x-2'>
                    {!open && (
                        <div className='flex items-center gap-x-3'>
                            <SidebarTrigger>

                            </SidebarTrigger>
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