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