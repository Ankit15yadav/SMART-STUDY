"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import useLocalStorageState from "use-local-storage-state"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    RocketIcon,
    UploadIcon,
    FileTextIcon,
    MessageCircleIcon as ChatBubbleIcon,
    UploadCloudIcon,
    FileIcon,
    Loader,
    Loader2,
} from "lucide-react"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"
import { api } from "@/trpc/react"
import SelectGroupForResume from "./_component/select-group-resume"
import { analyzeResumeWithGemini, FinalRespone } from "@/lib/deepseek/resume-chat"
import MDEditor from "@uiw/react-md-editor"
import { readStreamableValue } from "ai/rsc"
import { cosineSimilarity } from "ai"


const ResumeUploader = () => {
    const { data: interests } = api.Groups.getUserInterest.useQuery();
    const interestData = interests?.split(',').map((int) => int.trim()) || [];

    const {
        data: groups,
        isLoading
    } = api.Groups.GetMatchingGroups.useQuery({ userInterests: interestData }, {
        staleTime: 1000 * 60 * 2,
    });

    const [file, setFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [storedResume, setStoredResume] = useLocalStorageState<string>("userResume")
    const [chatMessage, setChatMessage] = useState("")
    const [chatHistory, setChatHistory] = useState<Array<{ question: string; answer: string }>>([])
    const [groupId, selectedGroupId] = useState<string | null>(null)
    const [isProcessing, setIsProcessing] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const particularGroup = groups?.find((group) => group.id === groupId);



    const onDrop = useCallback((acceptedFiles: File[]) => {
        const selectedFile = acceptedFiles[0]
        if (selectedFile) {
            if (selectedFile.type !== "application/pdf") {
                setError("Only PDF files are allowed.")
                setFile(null)
            } else if (selectedFile.size > 5 * 1024 * 1024) {
                setError("File size must be less than 5MB")
                setFile(null)
            } else {
                setError(null)
                setFile(selectedFile)
            }
        }
    }, [])

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" })
        }
    })

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "application/pdf": [".pdf"] },
        maxSize: 5 * 1024 * 1024,
        multiple: false,
    })

    const handleUpload = async () => {
        if (!file) {
            setError("Please select a PDF file first.")
            return
        }

        setUploading(true)
        setError(null)
        setSuccessMessage(null)

        try {
            const formData = new FormData()
            formData.append("file", file)

            const response = await fetch("/api/pdf-upload", {
                method: "POST",
                body: formData,
            })

            const data = await response.json()
            if (!response.ok) throw new Error(data.error || "Upload failed.")

            setStoredResume(data.secureUrl)
            toast.success("Resume uploaded successfully!")
        } catch (err: any) {
            setError(err.message)
            toast.error(err.message)
        } finally {
            setUploading(false)
        }
    }

    const handleChatSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatMessage.trim()) return;

        // Add user message immediately with loading state
        const userQuestion = chatMessage;
        const messageIndex = chatHistory.length;

        setChatHistory((prev) => [
            ...prev,
            {
                question: userQuestion,
                answer: "Loading..." // Temporary loading message
            },
        ]);
        setChatMessage(""); // Clear input field immediately
        setIsProcessing(true);

        try {
            // Initialize an empty string for this specific message's answer
            let currentAnswer = "";

            const output = await FinalRespone(storedResume!, userQuestion);

            for await (const delta of readStreamableValue(output)) {
                if (delta) {
                    // Update the current answer with new delta
                    currentAnswer += delta;

                    // Update the specific message in chat history with the current accumulated answer
                    setChatHistory(prev => {
                        const updatedHistory = [...prev];
                        updatedHistory[messageIndex] = {
                            question: userQuestion,
                            answer: currentAnswer // Use the accumulated answer for this message
                        };
                        return updatedHistory;
                    });
                }
            }
        } catch (error) {
            console.error("Error processing request:", error);

            // Update with error message
            setChatHistory(prev => {
                const updatedHistory = [...prev];
                updatedHistory[messageIndex] = {
                    question: userQuestion,
                    answer: "Sorry, there was an error processing your request."
                };
                return updatedHistory;
            });
            toast.error("Error while fetching resume details");
        } finally {
            setIsProcessing(false);
        }
    }

    return (
        <div className="min-h-screen bg-muted/40 p-4 sm:p-8 ">
            {/* Set overall max-width to 8xl and use a 3-column grid on medium screens */}
            <div className="max-w-8xl mx-auto grid gap-8 md:grid-cols-3">
                {/* Resume Section takes 1 column */}
                <Card className="h-full md:col-span-1">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <RocketIcon className="h-6 w-6 text-primary" />
                            <div>
                                <CardTitle>Resume Manager</CardTitle>
                                <CardDescription>Upload and manage your professional resume</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <Label htmlFor="resume">Upload Resume (PDF)</Label>
                            <div
                                {...getRootProps()}
                                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/25 hover:border-primary"
                                    }`}
                            >
                                <input {...getInputProps()} />
                                <UploadCloudIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Drag & drop your resume here, or click to select a file
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground">(Only PDF files up to 5MB are accepted)</p>
                            </div>
                            {file && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <FileIcon className="h-4 w-4" />
                                    <span>{file.name}</span>
                                </div>
                            )}
                            <div className="flex flex-col gap-3">
                                <Button onClick={handleUpload} disabled={uploading || !file} className="gap-2 w-full">
                                    {uploading ? (
                                        <>
                                            <UploadIcon className="h-4 w-4 animate-pulse" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <UploadIcon className="h-4 w-4" />
                                            Upload Resume
                                        </>
                                    )}
                                </Button>
                                {storedResume && (
                                    <Button variant="outline" asChild className="w-full">
                                        <a href={storedResume} target="_blank" rel="noopener noreferrer" className="gap-2">
                                            <FileTextIcon className="h-4 w-4" />
                                            View Current Resume
                                        </a>
                                    </Button>
                                )}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <CardDescription className="text-red-600 font-semibold">
                                Select Group you want to refine your resume for
                            </CardDescription>

                            {groups && !isLoading ? (
                                <SelectGroupForResume groups={groups} selectedGroupId={selectedGroupId} />
                            ) : (
                                <div className="flex justify-center">
                                    <div className="text-muted-foreground">Loading groups...</div>
                                    <Loader2 className="animate-spin" />
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Chat Section takes 2 columns */}
                <Card className="flex flex-col h-full md:col-span-2">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <ChatBubbleIcon className="h-6 w-6 text-primary" />
                            <div>
                                <CardTitle>Resume Assistant</CardTitle>
                                <CardDescription>Ask questions about your resume</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <ScrollArea className="h-[500px] pr-4 min-w-full">
                            {chatHistory.map((chat, index) => (
                                <div key={index} className="space-y-4 mb-4">
                                    <div className="flex justify-start">
                                        <div className="bg-primary text-primary-foreground flex flex-wrap rounded-md px-3 py-1 max-w-[70%]">{chat.question}</div>
                                    </div>
                                    <div className="flex justify-start">
                                        <div className="rounded-md  py-1 w-full">
                                            {chat.answer === "Loading..." ? (
                                                <div className="flex items-center">
                                                    <span className="flex items-center justify-center p-2">
                                                        {/* First dot - grows and shrinks */}
                                                        <span className="inline-block h-2 w-2 bg-gray-500 rounded-full mx-0.5 transform transition-all duration-700"
                                                            style={{ animation: "pulse 1.4s cubic-bezier(0.4, 0, 0.6, 1) infinite", animationDelay: "0ms" }}>
                                                        </span>

                                                        {/* Second dot - fades in and out */}
                                                        <span className="inline-block h-2 w-2 bg-gray-500 rounded-full mx-0.5 transition-opacity duration-700"
                                                            style={{ animation: "fade 1.4s ease-in-out infinite", animationDelay: "200ms" }}>
                                                        </span>

                                                        {/* Third dot - slides up and down */}
                                                        <span className="inline-block h-2 w-2 bg-gray-500 rounded-full mx-0.5 transition-transform duration-700"
                                                            style={{ animation: "bounce 1.4s ease infinite", animationDelay: "400ms" }}>
                                                        </span>
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className='flex-1 min-h-0 max-w-full overflow-x-auto'>
                                                    <MDEditor.Markdown
                                                        style={{
                                                            padding: '10px',
                                                            height: '100%',
                                                            backgroundColor: '#0f172a',
                                                            overflowX: 'auto',  // Horizontal scrolling for code blocks   // Constrain width to container
                                                            overflowWrap: 'break-word',    // Add this
                                                            wordBreak: 'break-all',
                                                            width: '100%'     // Add this

                                                        }}
                                                        source={chat.answer}
                                                        className='h-full w-fit rounded-md border'
                                                        skipHtml
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div ref={messagesEndRef} />
                                </div>
                            ))}
                        </ScrollArea>
                    </CardContent>
                    <CardFooter>
                        <form onSubmit={handleChatSubmit} className="w-full flex gap-2">
                            <Input
                                value={chatMessage}
                                onChange={(e) => setChatMessage(e.target.value)}
                                placeholder="Ask about resume improvements..."
                            />
                            <Button
                                type="submit"
                                className="shrink-0"
                                disabled={chatMessage === "" || isProcessing}>
                                {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send"}
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

export default ResumeUploader

