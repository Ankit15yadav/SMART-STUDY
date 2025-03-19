// \"use client";

// import type React from "react";
// import { useEffect, useState, useRef } from "react";
// import io from "socket.io-client";
// import { useUser } from "@clerk/nextjs";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Badge } from "@/components/ui/badge";
// import { Send, Menu, Smile } from "lucide-react";
// import { api } from "@/trpc/react";
// import EmojiPicker, { Theme } from "emoji-picker-react";

// const socket = io("http://localhost:4000");

// interface Message {
//     id: string;
//     content: string;
//     senderId: string;
//     createdAt: Date;
//     sender?: {
//         firstName: string | null;
//         lastName: string | null;
//     };
// }

// interface GroupCardProps {
//     id: string;
//     name: string;
//     category: string;
//     description: string;
//     imageUrl: string | null;
//     isPublic: boolean;
//     maxMembers: number;
//     tags: string[];
//     joinedMembers: number;
//     members: {
//         id: string;
//     }[];
//     createdBy: {
//         firstName: string | null;
//         lastName: string | null;
//         imageUrl?: string | null;
//     };
// }

// const ChatComponent = () => {
//     const { user } = useUser();
//     const userId = user?.id || "";

//     const { data: interests } = api.Groups.getUserInterest.useQuery();
//     const interestData = interests?.split(",").map((int) => int.trim()) || [];

//     const { data: groups, isLoading } = api.Groups.GetMatchingGroups.useQuery({
//         userInterests: interestData,
//     });

//     const [selectedGroup, setSelectedGroup] = useState<GroupCardProps | null>(null);
//     const [message, setMessage] = useState("");
//     const [messages, setMessages] = useState<Message[]>([]);
//     const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//     const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//     const messagesEndRef = useRef<HTMLDivElement>(null);
//     const emojiPickerRef = useRef<HTMLDivElement>(null);

//     useEffect(() => {
//         socket.on("previousMessages", (msgs: Message[]) => {
//             setMessages(msgs);
//         });

//         socket.on("newMessage", (msg: Message) => {
//             setMessages((prev) => [...prev, msg]);
//         });

//         return () => {
//             socket.off("previousMessages");
//             socket.off("newMessage");
//         };
//     }, []);

//     useEffect(() => {
//         messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
//     }, [messages]);

//     useEffect(() => {
//         const handleClickOutside = (event: MouseEvent) => {
//             if (emojiPickerRef.current &&
//                 !emojiPickerRef.current.contains(event.target as Node)) {
//                 setShowEmojiPicker(false);
//             }
//         };
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, []);

//     const handleJoinGroup = (group: GroupCardProps) => {
//         setSelectedGroup(group);
//         socket.emit("joinGroup", {
//             groupId: group.id,
//             userId: userId,
//         });
//     };

//     const handleSendMessage = (e: React.FormEvent) => {
//         e.preventDefault();
//         if (message.trim() && selectedGroup?.id && userId) {
//             socket.emit("sendMessage", {
//                 groupId: selectedGroup.id,
//                 senderId: userId,
//                 content: message,
//             });
//             setMessage("");
//         }
//     };

//     const handleEmojiSelect = (emoji: any) => {
//         setMessage(prev => prev + emoji.emoji);
//         setShowEmojiPicker(false);
//     };

//     if (isLoading) return <div>Loading groups...</div>;

//     return (
//         <div className="flex h-screen bg-background">
//             {/* Sidebar Toggle Button */}
//             <Button
//                 variant="ghost"
//                 size="icon"
//                 className="fixed top-4 left-4 z-50 md:hidden"
//                 onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//             >
//                 <Menu />
//             </Button>

//             {/* Left sidebar - Group List */}
//             <Card
//                 className={`w-80 border-r ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
//                     } transition-transform duration-300 ease-in-out fixed md:relative md:translate-x-0 z-40 h-full`}
//             >
//                 <div className="p-4 border-b">
//                     <h2 className="text-xl font-semibold">Your Groups</h2>
//                 </div>
//                 <ScrollArea className="h-[calc(100vh-4rem)]">
//                     {groups?.map((group) => (
//                         <Card
//                             key={group.id}
//                             onClick={() =>
//                                 handleJoinGroup({ ...group, joinedMembers: group.members.length })
//                             }
//                             className={`m-2 p-4 cursor-pointer transition-colors ${selectedGroup?.id === group.id ? "bg-accent" : "hover:bg-muted"
//                                 }`}
//                         >
//                             <div className="flex items-center gap-4">
//                                 <Avatar className="h-12 w-12">
//                                     <AvatarImage src={group.imageUrl || ""} />
//                                     <AvatarFallback>{group.name.charAt(0)}</AvatarFallback>
//                                 </Avatar>
//                                 <div className="flex-1">
//                                     <div className="flex justify-between items-center">
//                                         <h3 className="font-semibold">{group.name}</h3>
//                                         <Badge variant="outline">
//                                             {group.members.length}/{group.maxMembers}
//                                         </Badge>
//                                     </div>
//                                     <p className="text-sm text-muted-foreground truncate">
//                                         {group.description}
//                                     </p>
//                                     <div className="flex gap-2 mt-1">
//                                         {group.tags.map((tag) => (
//                                             <Badge key={tag} variant="secondary" className="text-xs">
//                                                 {tag}
//                                             </Badge>
//                                         ))}
//                                     </div>
//                                 </div>
//                             </div>
//                         </Card>
//                     ))}
//                 </ScrollArea>
//             </Card>

//             {/* Right side - Chat Area */}
//             <div className="flex-1 flex flex-col min-h-0">
//                 {selectedGroup ? (
//                     <>
//                         {/* Group Info Section */}
//                         <div className="p-4 border-b">
//                             <div className="flex items-center gap-4">
//                                 <Avatar className="h-10 w-10">
//                                     <AvatarImage src={selectedGroup.imageUrl || ""} />
//                                     <AvatarFallback>{selectedGroup.name.charAt(0)}</AvatarFallback>
//                                 </Avatar>
//                                 <div>
//                                     <h2 className="font-semibold">{selectedGroup.name}</h2>
//                                     <p className="text-sm text-muted-foreground">
//                                         Created by {selectedGroup.createdBy.firstName}{" "}
//                                         {selectedGroup.createdBy.lastName}
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Chat Messages Section */}
//                         <div className="flex-1 flex flex-col min-h-0">
//                             <ScrollArea className="flex-1 p-4">
//                                 <div className="space-y-4">
//                                     {messages.map((msg) => (
//                                         <div
//                                             key={msg.id}
//                                             className={`flex ${msg.senderId === userId ? "justify-end" : "justify-start"
//                                                 }`}
//                                         >
//                                             <Card
//                                                 className={`p-3 max-w-[75%] ${msg.senderId === userId
//                                                     ? "bg-primary text-primary-foreground"
//                                                     : ""
//                                                     }`}
//                                             >
//                                                 {msg.senderId !== userId && (
//                                                     <p className="text-xs font-medium text-muted-foreground mb-1">
//                                                         {msg.sender?.firstName || "Unknown User"}
//                                                     </p>
//                                                 )}
//                                                 <p>{msg.content}</p>
//                                                 <p
//                                                     className={`text-xs mt-1 ${msg.senderId === userId
//                                                         ? "text-primary-foreground/70"
//                                                         : "text-muted-foreground"
//                                                         }`}
//                                                 >
//                                                     {new Date(msg.createdAt).toLocaleTimeString([], {
//                                                         hour: "2-digit",
//                                                         minute: "2-digit",
//                                                     })}
//                                                 </p>
//                                             </Card>
//                                         </div>
//                                     ))}
//                                     <div ref={messagesEndRef} />
//                                 </div>
//                             </ScrollArea>

//                             {/* Chat Input Section with Emoji Picker */}
//                             <form onSubmit={handleSendMessage} className="p-2 border-t relative">
//                                 <div className="flex gap-2">
//                                     <div className="relative flex-1">
//                                         <div className="absolute left-2 top-2.5">
//                                             <Button
//                                                 type="button"
//                                                 variant="ghost"
//                                                 size="icon"
//                                                 className="h-8 w-8"
//                                                 onClick={() => setShowEmojiPicker(!showEmojiPicker)}
//                                             >
//                                                 <Smile className="h-4 w-4" />
//                                             </Button>
//                                         </div>
//                                         {showEmojiPicker && (
//                                             <div ref={emojiPickerRef} className="absolute bottom-16 left-0 z-50">
//                                                 <EmojiPicker
//                                                     theme={Theme.AUTO}
//                                                     onEmojiClick={handleEmojiSelect}
//                                                     searchDisabled
//                                                     skinTonesDisabled
//                                                     previewConfig={{ showPreview: false }}
//                                                 />
//                                             </div>
//                                         )}
//                                         <Input
//                                             placeholder="Type your message..."
//                                             value={message}
//                                             onChange={(e) => setMessage(e.target.value)}
//                                             className="flex-1 pl-10"
//                                         />
//                                     </div>
//                                     <Button type="submit">
//                                         <Send className="h-4 w-4 mr-2" />
//                                         Send
//                                     </Button>
//                                 </div>
//                             </form>
//                         </div>
//                     </>
//                 ) : (
//                     <div className="flex-1 flex items-center justify-center">
//                         <p className="text-muted-foreground">
//                             Select a group to start chatting
//                         </p>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ChatComponent;


// "dev:socket": "concurrently \"next dev\" \"tsx server.mts\"",





// const geminiApiKey = 'AIzaSyBB3mTO2FWOrEY9P9XQc8SL174ICVoB82A';

// // console.log(geminiApiKey);

// if (!geminiApiKey) {
//     throw new Error("GEMINI_API_KEY is not set");
// }

// const genAI = new GoogleGenerativeAI(geminiApiKey);
// const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });


// export const analyzeResumeWithGemini = async (
//     resume: string,
//     message: string
// ) => {
//     const prompt = `
// **Role:**
// You are an expert AI Resume Advisor. Provide focused, concise feedback on this resume.

// **Resume Context:**
// ${resume}

// **User Query:**
// ${message}

// **Guidelines:**
// 1. Identify ONLY 3-5 critical improvement areas
// 2. Keep responses under 150 words
// 3. Use bullet points with clear priorities
// 4. Focus on high-impact changes

// **Response Format:**
// - **Top Priorities:** [3-5 concise improvement areas with impact level]
// - **Quick Fixes:** [Immediately actionable changes]
// - **Key Focus:** [Single most important area to address]

// Example Response:
// - **Top Priorities:**
//   1. Add project metrics (High Impact)
//   2. Include missing React keywords (Medium Impact)
//   3. Simplify technical jargon (Low Impact)
// - **Quick Fixes:**
//   • Add "TypeScript" to skills section
//   • Replace passive verbs with action words
// - **Key Focus:** Quantify achievements in current role
// `;

//     try {
//         const response = await model.generateContent(prompt);
//         const fullResponse = response.response.text();

//         //  Clean and format response
//         // const cleanedResponse = fullResponse
//         //     .replace(/\*\*/g, '')
//         //     .replace(/- /g, '\n• ')
//         //     .replace(/(\d+\.)/g, '\n$1');

//         // console.log("=== Essential Resume Feedback ===");
//         // console.log(cleanedResponse);

//         // return {
//         //     analysis: cleanedResponse,
//         //     fullResponse,
//         // };
//     } catch (error) {
//         console.error("Error:", error);
//         return {
//             analysis: "Could not generate analysis",
//             fullResponse: "Error processing request",
//             error: (error as Error).message
//         };
//     }
// };

// const exampleResume = `
// Education
// SRM University Chennai B.TECH in Computer Science 2022 – 2026
// ◦ GPA: 9.16
// ◦ Coursework: Computer Architecture, Computer Networking, Operating System
// Silver Oak School Class XII 2020 – 2021
// ◦ Percentage: 85%
// Experience
// App Developer Intern @Samarth Softech december 2024 – present
// ◦ Led the end-to-end development of a comprehensive application for Samarth Softech, showcasing expertise
// in full-cycle app development.
// ◦ Worked in a cross-functional team to boost the performance and functionality of the App.
// Fullstack Developer Computer Society on India July 2024 – Present
// ◦ Spearheaded the development and launch of the official Computer Society of India website with a user-centric
// design
// ◦ Enhanced the front-end with React.js, incorporating dynamic animations and responsive UI elements.
// ◦ Collaborated with backend teams using Express.js to ensure seamless data handling and integration.
// Projects
// AI Email Platform
// ◦ Developed an AI-powered email platform integrating Google API for fetching emails, improving workflow
// automation.
// ◦ Built features allowing users to compose, send, and reply to emails with AI-powered assistance.
// ◦ Used Prisma for efficient ORM and PostgreSQL for scalable data storage; leveraged Neon.tech for cloud
// database management
// ◦ Tools Used: Next.js, Prisma, PostgreSQL, Neon.tech DB, Aurinko API
// GitHub Chat AI
// ◦ Developed an AI-powered repository analysis system integrating GitHub API with RAG architecture to
// enable natural language querying of any repository content.
// ◦ Implemented vector embeddings and LLM technology to convert repository data into searchable format,
// allowing comprehensive code and documentation exploration.
// ◦ Tools Used: Typescript, LangChain, GitHub API, Vector Database, LLM Models, Prisma ORM
// StudyNotion EdTech Platform
// ◦ Designed and deployed an e-learning platform facilitating course creation, purchase, and management.
// ◦ Integrated secure user authentication and Razorpay for payment processing.
// ◦ Ensured a fully responsive and engaging UI, enhancing user retention.
// ◦ Tools Used: Node.js, React, Express.js, Tailwind CSS, MongoDB
// Technologies
// Languages: C++, C, Python, Java, SQL, JavaScript, Typescript
// Frameworks: Next.js, Express.js
// Web Technologies: React.js, CSS, Tailwind CSS, Prisma, REST APIs, POSTMAN
// Development Tools: Git, Visual Studio Code, Docker, Kubernetes
// Databases: PostgreSQL, MongoDB
// Other Skills: Problem Solving, Data Structures, Algorithms, Dynamic Programming
// `

// const exampleMessage = "What are the chances of my resume being selected for a job in a tech company?";
// // analyzeResumeWithGemini(exampleResume, exampleMessage);



/** @type {import("eslint").Linter.Config} */
const config = {
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "project": true
    },
    "extends": [
        "next/core-web-vitals",
        "plugin:@typescript-eslint/recommended-type-checked",
        "plugin:@typescript-eslint/stylistic-type-checked"
    ],
    "rules": {
        "@typescript-eslint/array-type": "off",
        "@typescript-eslint/consistent-type-definitions": "off",
        "@typescript-eslint/consistent-type-imports": [
            "warn",
            {
                "prefer": "type-imports",
                "fixStyle": "inline-type-imports"
            }
        ],
        "@typescript-eslint/no-unused-vars": [
            "warn",
            {
                "argsIgnorePattern": "^_"
            }
        ],
        "@typescript-eslint/require-await": "off",
        "@typescript-eslint/no-misused-promises": [
            "error",
            {
                "checksVoidReturn": {
                    "attributes": false
                }
            }
        ]
    }
}
module.exports = config;