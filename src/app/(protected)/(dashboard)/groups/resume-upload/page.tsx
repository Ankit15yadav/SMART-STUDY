"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import useLocalStorageState from "use-local-storage-state"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    RocketIcon,
    UploadIcon,
    FileTextIcon,
    MessageCircleIcon,
    UploadCloudIcon,
    FileIcon,
    Loader2,
    SendIcon,
    CheckCircleIcon,
    AlertCircleIcon,
    UserIcon,
    BotIcon
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
    const [groupId, setSelectedGroupId] = useState<string | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const particularGroup = groups?.find((group) => group.id === groupId)

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const selectedFile = acceptedFiles[0]
        if (selectedFile) {
            if (selectedFile.type !== "application/pdf") {
                setError("Only PDF files are allowed.")
                setFile(null)
                toast.error("Only PDF files are allowed")
            } else if (selectedFile.size > 5 * 1024 * 1024) {
                setError("File size must be less than 5MB")
                setFile(null)
                toast.error("File size must be less than 5MB")
            } else {
                setError(null)
                setFile(selectedFile)
                toast.success("File selected successfully")
            }
        }
    }, [])

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" })
        }
    }, [chatHistory])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "application/pdf": [".pdf"] },
        maxSize: 5 * 1024 * 1024,
        multiple: false,
    })

    const handleUpload = async () => {
        if (!file) {
            setError("Please select a PDF file first.")
            toast.error("Please select a PDF file first")
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
            setSuccessMessage("Resume uploaded successfully!")
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
        if (!chatMessage.trim() || !storedResume) {
            if (!storedResume) {
                toast.error("Please upload your resume first")
                return
            }
            return
        }

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

            const output = await FinalRespone(storedResume, userQuestion);

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
        <div className="min-h-screen bg-gradient-to-b from-primary/5 to-muted/40 p-4 sm:p-6">
            <div className="max-w-8xl mx-auto space-y-6">
                <div className="flex items-center justify-center">
                    <Badge variant="outline" className="py-2 px-4 text-base font-medium gap-2 border-primary/30">
                        <RocketIcon className="h-5 w-5 text-primary" />
                        Resume Enhancement Hub
                    </Badge>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Resume Management Panel */}
                    <Card className="h-full md:col-span-1 shadow-md border-primary/20">
                        <CardHeader className="bg-primary/5 rounded-t-lg">
                            <div className="flex items-center gap-3">
                                <div className="bg-primary/10 p-2 rounded-full">
                                    <RocketIcon className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <CardTitle>Resume Manager</CardTitle>
                                    <CardDescription>Upload and optimize your professional profile</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="space-y-5">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="resume" className="text-base font-medium">Upload Resume</Label>
                                    {file && (
                                        <Badge variant="outline" className="text-xs">PDF Selected</Badge>
                                    )}
                                </div>

                                <div
                                    {...getRootProps()}
                                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${isDragActive
                                        ? "border-primary bg-primary/10 scale-[0.98]"
                                        : "border-muted-foreground/25 hover:border-primary hover:bg-primary/5"
                                        }`}
                                >
                                    <input {...getInputProps()} />
                                    <UploadCloudIcon className="mx-auto h-16 w-16 text-primary/60" />
                                    <p className="mt-4 text-sm font-medium">
                                        {isDragActive
                                            ? "Drop your resume here..."
                                            : "Drag & drop your resume here, or click to browse"
                                        }
                                    </p>
                                    <p className="mt-2 text-xs text-muted-foreground">(PDF files up to 5MB)</p>
                                </div>

                                {file && (
                                    <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border border-border">
                                        <FileIcon className="h-5 w-5 text-primary" />
                                        <span className="text-sm font-medium truncate flex-1">{file.name}</span>
                                        <Badge variant="secondary" className="text-xs">
                                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                                        </Badge>
                                    </div>
                                )}

                                {error && (
                                    <div className="flex items-center gap-2 text-destructive text-sm">
                                        <AlertCircleIcon className="h-4 w-4" />
                                        <span>{error}</span>
                                    </div>
                                )}

                                {successMessage && (
                                    <div className="flex items-center gap-2 text-green-600 text-sm">
                                        <CheckCircleIcon className="h-4 w-4" />
                                        <span>{successMessage}</span>
                                    </div>
                                )}

                                <div className="flex flex-col gap-3 pt-2">
                                    <Button
                                        onClick={handleUpload}
                                        disabled={uploading || !file}
                                        className="gap-2 w-full h-11 font-medium"
                                        size="lg"
                                    >
                                        {uploading ? (
                                            <>
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                                Uploading Resume...
                                            </>
                                        ) : (
                                            <>
                                                <UploadIcon className="h-5 w-5" />
                                                Upload Resume
                                            </>
                                        )}
                                    </Button>

                                    {storedResume && (
                                        <Button variant="outline" asChild className="w-full h-11">
                                            <a
                                                href={storedResume}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="gap-2 font-medium"
                                            >
                                                <FileTextIcon className="h-5 w-5 text-primary" />
                                                View Current Resume
                                            </a>
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <Separator className="my-4" />

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label className="text-base font-medium">Target Group</Label>
                                    {particularGroup && (
                                        <Badge variant="secondary" className="text-xs">
                                            {particularGroup.name}
                                        </Badge>
                                    )}
                                </div>

                                {groups && !isLoading ? (
                                    <SelectGroupForResume
                                        groups={groups}
                                        selectedGroupId={setSelectedGroupId}
                                    />
                                ) : (
                                    <div className="flex justify-center items-center py-4">
                                        <Loader2 className="h-6 w-6 text-primary animate-spin mr-2" />
                                        <span className="text-sm">Loading available groups...</span>
                                    </div>
                                )}

                                <div className="bg-primary/5 p-3 rounded-lg mt-4 text-sm">
                                    <p className="font-medium text-primary mb-1">Pro Tip</p>
                                    <p className="text-muted-foreground">
                                        Select a target group to receive tailored resume optimization suggestions.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Chat Assistant Panel */}
                    <Card className="flex flex-col h-full md:col-span-2 shadow-md border-primary/20">
                        <CardHeader className="bg-primary/5 rounded-t-lg">
                            <div className="flex items-center gap-3">
                                <div className="bg-primary/10 p-2 rounded-full">
                                    <MessageCircleIcon className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <CardTitle>Resume Assistant</CardTitle>
                                    <CardDescription>Get personalized guidance to enhance your resume</CardDescription>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="flex-grow p-0">
                            {/* Welcome message if no chat history */}
                            {chatHistory.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-4">
                                    <div className="bg-primary/10 p-4 rounded-full">
                                        <BotIcon className="h-12 w-12 text-primary" />
                                    </div>
                                    <h3 className="text-lg font-medium">Resume Assistant</h3>
                                    <p className="text-muted-foreground max-w-md">
                                        Upload your resume and start a conversation to get personalized feedback
                                        and advice on how to optimize it for your target opportunities.
                                    </p>
                                    <div className="flex flex-wrap justify-center gap-2 pt-2">
                                        <Badge variant="outline" className="py-1">
                                            "Analyze my resume strengths"
                                        </Badge>
                                        <Badge variant="outline" className="py-1">
                                            "Suggest improvements for tech roles"
                                        </Badge>
                                        <Badge variant="outline" className="py-1">
                                            "How can I highlight my leadership?"
                                        </Badge>
                                    </div>
                                </div>
                            )}

                            {/* Chat messages */}
                            {chatHistory.length > 0 && (
                                <ScrollArea className="h-[550px] px-6 pt-6 pb-2">
                                    <div className="space-y-6">
                                        {chatHistory.map((chat, index) => (
                                            <div key={index} className="space-y-4">
                                                {/* User message */}
                                                <div className="flex items-start gap-3 justify-end">
                                                    <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%] shadow-sm">
                                                        <p>{chat.question}</p>
                                                    </div>
                                                    <Avatar className="h-8 w-8 bg-primary/10">
                                                        <AvatarFallback className="bg-primary/10 text-primary">
                                                            <UserIcon className="h-4 w-4" />
                                                        </AvatarFallback>
                                                    </Avatar>
                                                </div>

                                                {/* Assistant response */}
                                                <div className="flex items-start gap-3">
                                                    <Avatar className="h-8 w-8 bg-primary/10">
                                                        <AvatarFallback className="bg-primary/10 text-primary">
                                                            <BotIcon className="h-4 w-4" />
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%] shadow-sm">
                                                        {chat.answer === "Loading..." ? (
                                                            <div className="flex items-center py-2">
                                                                <span className="flex items-center justify-center">
                                                                    <span className="inline-block h-2 w-2 bg-primary/60 rounded-full mx-0.5 animate-bounce"
                                                                        style={{ animationDelay: "0ms" }}>
                                                                    </span>
                                                                    <span className="inline-block h-2 w-2 bg-primary/60 rounded-full mx-0.5 animate-bounce"
                                                                        style={{ animationDelay: "200ms" }}>
                                                                    </span>
                                                                    <span className="inline-block h-2 w-2 bg-primary/60 rounded-full mx-0.5 animate-bounce"
                                                                        style={{ animationDelay: "400ms" }}>
                                                                    </span>
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <div className="markdown-content">
                                                                <MDEditor.Markdown
                                                                    style={{
                                                                        padding: '0',
                                                                        backgroundColor: 'transparent',
                                                                        color: 'dimgray',
                                                                        width: '100%'
                                                                    }}
                                                                    source={chat.answer}
                                                                    className="w-full bg-transparent"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <div ref={messagesEndRef} />
                                    </div>
                                </ScrollArea>
                            )}
                        </CardContent>

                        <CardFooter className="p-4 border-t">
                            <form onSubmit={handleChatSubmit} className="w-full flex gap-2">
                                <Input
                                    value={chatMessage}
                                    onChange={(e) => setChatMessage(e.target.value)}
                                    placeholder={!storedResume
                                        ? "Upload your resume to start chatting..."
                                        : "Ask about resume improvements..."}
                                    className="h-12 px-4"
                                    disabled={!storedResume || isProcessing}
                                />
                                <Button
                                    type="submit"
                                    className="h-12 px-4 gap-2"
                                    disabled={!chatMessage.trim() || !storedResume || isProcessing}
                                >
                                    {isProcessing ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <>
                                            <SendIcon className="h-5 w-5" />
                                            <span className="hidden sm:inline">Send</span>
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default ResumeUploader