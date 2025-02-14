"use client"

import { useState, useCallback } from "react"
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
} from "lucide-react"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"

const ResumeUploader = () => {
    const [file, setFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [storedResume, setStoredResume] = useLocalStorageState<string>("userResume")
    const [chatMessage, setChatMessage] = useState("")
    const [chatHistory, setChatHistory] = useState<Array<{ question: string; answer: string }>>([])

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

    const handleChatSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!chatMessage.trim()) return

        // Temporary mock response
        setChatHistory((prev) => [
            ...prev,
            {
                question: chatMessage,
                answer:
                    "AI analysis feature coming soon! We'll analyze your resume for keywords, suggestions, and career advice.",
            },
        ])
        setChatMessage("")
    }

    return (
        <div className="min-h-screen bg-muted/40 p-4 sm:p-8">
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
                        <ScrollArea className="h-[400px] pr-4">
                            {chatHistory.map((chat, index) => (
                                <div key={index} className="space-y-4 mb-4">
                                    <div className="flex justify-end">
                                        <div className="bg-primary text-primary-foreground rounded-md px-3 py-1 max-w-[80%]">{chat.question}</div>
                                    </div>
                                    <div className="flex justify-start">
                                        <div className="bg-muted rounded-lg p-4 max-w-[80%]">{chat.answer}</div>
                                    </div>
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
                            <Button type="submit" className="shrink-0">
                                Send
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

export default ResumeUploader
