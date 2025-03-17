"use client"

import { motion } from "framer-motion"
import {
    BookOpen,
    BrainCircuit,
    Users,
    LockKeyhole,
    BotMessageSquare,
    GraduationCap,
    ArrowRight,
    Mail,
    MapPin,
    Phone,
    Loader2,
} from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { sendEmail } from "@/lib/send-mail"
import { toast } from "sonner"
import { api } from "@/trpc/react"

type contact = {
    name: string,
    email: string,
    subject: string,
    message: string,
}

const AboutPage = () => {

    const { user } = useUser()
    const router = useRouter();

    const initialform = {
        name: '',
        email: '',
        subject: '',
        message: '',
    }

    const [contact, setContact] = useState<contact>(initialform)
    const storeContact = api.contact.storeContact.useMutation();

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target

        setContact((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e: any) => {

        e.preventDefault()

        try {

            await storeContact.mutateAsync({
                email: contact.email,
                message: contact.message,
                name: contact.name,
                subject: contact.subject
            }, {
                onSuccess: async () => {

                    setContact(initialform)
                    toast.success("Message Sent successfully")

                    await sendEmail(contact.email, contact.message, contact.subject);

                }
            })

        } catch (error) {
            console.log(error);
        }

    }

    const teamMembers = [
        {
            name: "Ankit Yadav",
            role: "Co-Founder & CEO",
            image: "/assets/images/myImg.jpg",
            bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
            social: {
                linkedin: "#",
                twitter: "#",
                github: "#",
            },
        },
        {
            name: "Parth Bansal",
            role: "Co-Founder & CTO",
            image: "/assets/images/bansal_pra.jpg",
            bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
            social: {
                linkedin: "#",
                twitter: "#",
                github: "#",
            },
        },
    ]

    const features = [
        {
            icon: <BookOpen className="h-8 w-8" />,
            title: "Smart Group Creation",
            description: "Create study groups based on specific interests and academic needs",
        },
        {
            icon: <LockKeyhole className="h-8 w-8" />,
            title: "Public & Private Groups",
            description: "Choose between open communities or exclusive, verified study groups",
        },
        {
            icon: <BrainCircuit className="h-8 w-8" />,
            title: "AI Resume Analysis",
            description: "Automated qualification check for private groups using advanced AI",
        },
        {
            icon: <BotMessageSquare className="h-8 w-8" />,
            title: "Resume Assistant",
            description: "Get instant feedback and improvements for your academic profile",
        },
        {
            icon: <GraduationCap className="h-8 w-8" />,
            title: "Collaborative Learning",
            description: "Interactive study sessions and resource sharing within groups",
        },
        {
            icon: <Users className="h-8 w-8" />,
            title: "Community Building",
            description: "Connect with like-minded students across disciplines",
        },
    ]

    const stats = [
        { value: "10,000+", label: "Active Users" },
        { value: "500+", label: "Study Groups" },
        { value: "95%", label: "Success Rate" },
        { value: "24/7", label: "Support" },
    ]

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 },
        },
    }

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    return (
        <div className="min-h-screen " >
            {/* Hero Section with Gradient Background */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-sky-200/50  to-background z-0"></div>
                <div className="absolute inset-0 bg-[url('/placeholder.svg?height=500&width=1000')] bg-no-repeat bg-cover opacity-5 mix-blend-overlay"></div>

                <div className="relative z-10 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    <motion.div initial="hidden" animate="visible" variants={fadeIn} className="text-center">
                        <Badge className="mb-4 px-3 py-1 text-sm  font-medium rounded-full bg-blue-400 ">About SmartStudy</Badge>
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-gray-700  via-gray-400  to-gray-700">
                            Revolutionizing Collaborative Learning
                        </h1>
                        <p className="mt-6 text-sm text-muted-foreground max-w-3xl mx-auto">
                            SmartStudy is where intelligent group collaboration meets personalized learning. We empower students to
                            create focused study communities enhanced with AI-powered tools for optimal academic success.
                        </p>
                        <div className="mt-8 flex flex-wrap justify-center gap-4">
                            <Button size="lg" className="rounded-full bg-blue-400" onClick={() => router.push(`${user}` ? '/groups/create' : '/sign-up')}>
                                Get Started
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="lg" className="rounded-full">
                                Watch Demo
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 bg-sky-200/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="grid grid-cols-2 md:grid-cols-4 gap-8"
                    >
                        {stats.map((stat, index) => (
                            <motion.div key={index} variants={fadeIn} className="text-center">
                                <div className="text-3xl md:text-4xl font-bold text-gray-500/70">{stat.value}</div>
                                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20  bg-yellow-100/40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeIn}
                        className="grid md:grid-cols-2 gap-12 items-center"
                    >
                        <div className="relative h-[400px] rounded-2xl overflow-hidden">
                            <Image
                                src="/assets/images/collab.jpg"
                                alt="Students collaborating"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div>
                            <Badge className="mb-4 bg-yellow-400 px-4 py-2 hover:bg-yellow-300">Our Mission</Badge>
                            <h2 className="text-3xl font-bold mb-6">Empowering Students Through Smart Collaboration</h2>
                            <p className="text-muted-foreground mb-6">
                                At SmartStudy, we believe that the future of education lies in collaborative learning enhanced by
                                technology. Our platform is designed to break down barriers between students and create meaningful
                                connections that foster academic growth.
                            </p>
                            <p className="text-muted-foreground mb-6">
                                We're committed to creating an inclusive environment where students from all backgrounds can find their
                                perfect study group, verify their qualifications through our AI tools, and collaborate effectively to
                                achieve their academic goals.
                            </p>
                            <Button variant="outline" className="rounded-full bg-yellow-500/35">
                                Learn More About Our Vision
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section with Tabs */}
            <section className="py-20 bg-gradient-to-b from-rose-200/50 to-background relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeIn}
                        className="text-center mb-16"
                    >
                        <Badge className="mb-4 bg-rose-300 text-gray-100 px-4 py-2 hover:bg-rose-300/50 border text-sm font-medium">
                            Premium Features
                        </Badge>
                        <h2 className="text-4xl font-bold text-slate-800 font-[Inter] tracking-tight">
                            Discover SmartStudy's Advantages
                        </h2>
                        <p className="mt-4 text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
                            Our platform combines cutting-edge AI technology with intuitive design to create the ultimate
                            collaborative learning experience.
                        </p>
                    </motion.div>

                    <Tabs defaultValue="collaboration" className="w-full">
                        <TabsList className="grid grid-cols-3 max-w-xl mx-auto mb-12 bg-slate-100/80 p-2 rounded-xl border border-slate-200/50 backdrop-blur-sm">
                            <TabsTrigger
                                value="collaboration"
                                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-slate-200 rounded-lg py-2.5 px-4 transition-all border border-transparent hover:bg-white/50 text-slate-600 data-[state=active]:text-teal-600 font-medium"
                            >
                                🤝 Collaboration
                            </TabsTrigger>
                            <TabsTrigger
                                value="ai"
                                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-slate-200 rounded-lg py-2.5 px-4 transition-all border border-transparent hover:bg-white/50 text-slate-600 data-[state=active]:text-indigo-600 font-medium"
                            >
                                🧠 AI Tools
                            </TabsTrigger>
                            <TabsTrigger
                                value="community"
                                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-slate-200 rounded-lg py-2.5 px-4 transition-all border border-transparent hover:bg-white/50 text-slate-600 data-[state=active]:text-emerald-600 font-medium"
                            >
                                🌱 Community
                            </TabsTrigger>
                        </TabsList>

                        {/* Collaboration Tab Content */}
                        <TabsContent value="collaboration" className="mt-0">
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={staggerContainer}
                                className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                            >
                                {features.slice(0, 3).map((feature, index) => (
                                    <motion.div
                                        key={index}
                                        variants={fadeIn}
                                        className="bg-gradient-to-b from-teal-100/40 to-background backdrop-blur-sm rounded-2xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-all duration-300 border border-slate-200/50 hover:border-teal-200/80 relative group"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-teal-50/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                                        <div className="h-14 w-14 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-600 mb-6">
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-2xl font-semibold text-slate-800 mb-3">{feature.title}</h3>
                                        <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </TabsContent>

                        {/* AI Tools Tab Content */}
                        <TabsContent value="ai" className="mt-0">
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={staggerContainer}
                                className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                            >
                                {features.slice(2, 5).map((feature, index) => (
                                    <motion.div
                                        key={index}
                                        variants={fadeIn}
                                        className="bg-gradient-to-b from-indigo-100 to-background backdrop-blur-sm rounded-2xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-all duration-300 border border-slate-200/50 hover:border-indigo-200/80 relative group"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-indigo-50/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                                        <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 mb-6">
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-2xl font-semibold text-slate-800 mb-3">{feature.title}</h3>
                                        <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </TabsContent>

                        {/* Community Tab Content */}
                        <TabsContent value="community" className="mt-0">
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={staggerContainer}
                                className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                            >
                                {[features[0], features[4], features[5]].map((feature, index) => (
                                    <motion.div
                                        key={index}
                                        variants={fadeIn}
                                        className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-all duration-300 border border-slate-200/50 hover:border-emerald-200/80 relative group"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-emerald-50/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                                        <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 mb-6">
                                            {feature?.icon}
                                        </div>
                                        <h3 className="text-2xl font-semibold text-slate-800 mb-3">{feature?.title}</h3>
                                        <p className="text-slate-600 leading-relaxed">{feature?.description}</p>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Subtle texture overlay */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/soft-circle-scales.png')] opacity-[0.03] pointer-events-none -z-0" />
            </section>

            {/* How It Works Section */}
            <section className="py-20 bg-gradient-to-t from-stone-300/80 to-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeIn}
                        className="text-center mb-16"
                    >
                        <Badge className="mb-4 bg-slate-600 px-4 py-2 hover:bg-slate-500">Process</Badge>
                        <h2 className="text-3xl font-bold">How SmartStudy Works</h2>
                        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                            Our streamlined process makes it easy to find your perfect study group and start collaborating right away.
                        </p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="relative"
                    >
                        {/* Connection Line */}
                        <div className="absolute top-1/2 left-0 right-0 h-1 bg-primary/20 -translate-y-1/2 hidden md:block"></div>

                        <div className="grid md:grid-cols-3 gap-8 relative z-10">
                            <motion.div
                                variants={fadeIn}
                                className="bg-background rounded-xl p-8 shadow-sm border border-border/50 text-center relative"
                            >
                                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold mx-auto mb-6">
                                    1
                                </div>
                                <h3 className="text-xl font-semibold mb-4">Create or Find Groups</h3>
                                <p className="text-muted-foreground">
                                    Start your own specialized group or join existing communities based on your academic interests and
                                    goals
                                </p>
                            </motion.div>

                            <motion.div
                                variants={fadeIn}
                                className="bg-background rounded-xl p-8 shadow-sm border border-border/50 text-center relative"
                            >
                                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold mx-auto mb-6">
                                    2
                                </div>
                                <h3 className="text-xl font-semibold mb-4">AI Verification</h3>
                                <p className="text-muted-foreground">
                                    For private groups, our AI analyzes your resume to ensure perfect group compatibility and
                                    qualification match
                                </p>
                            </motion.div>

                            <motion.div
                                variants={fadeIn}
                                className="bg-background rounded-xl p-8 shadow-sm border border-border/50 text-center relative"
                            >
                                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold mx-auto mb-6">
                                    3
                                </div>
                                <h3 className="text-xl font-semibold mb-4">Collaborate & Learn</h3>
                                <p className="text-muted-foreground">
                                    Engage in focused discussions, share resources, and enhance your learning experience with like-minded
                                    peers
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20 bg-gradient-to-b from-stone-300/80 to-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeIn}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl font-bold">Meet the Founders</h2>
                        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                            The brilliant minds behind SmartStudy who are passionate about transforming the educational landscape.
                        </p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="grid md:grid-cols-2 gap-12"
                    >
                        {teamMembers.map((member, index) => (
                            <motion.div
                                key={index}
                                variants={fadeIn}
                                className="flex flex-col md:flex-row gap-8 items-center md:items-start bg-background p-8 rounded-xl shadow-sm border border-border/50"
                            >
                                <div className="relative h-48 w-48 rounded-full overflow-hidden flex-shrink-0">
                                    <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <h3 className="text-2xl font-bold">{member.name}</h3>
                                    <p className="text-primary font-medium mb-4">{member.role}</p>
                                    <p className="text-muted-foreground mb-6">{member.bio}</p>
                                    <div className="flex gap-4 justify-center md:justify-start">
                                        <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                fill="currentColor"
                                                viewBox="0 0 16 16"
                                            >
                                                <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
                                            </svg>
                                        </Button>
                                        <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                fill="currentColor"
                                                viewBox="0 0 16 16"
                                            >
                                                <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                                            </svg>
                                        </Button>
                                        <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                fill="currentColor"
                                                viewBox="0 0 16 16"
                                            >
                                                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                                            </svg>
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeIn}
                        className="text-center mb-16"
                    >
                        <Badge className="mb-4">Testimonials</Badge>
                        <h2 className="text-3xl font-bold">What Our Users Say</h2>
                        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                            Hear from students who have transformed their learning experience with SmartStudy.
                        </p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="grid md:grid-cols-3 gap-8"
                    >
                        {[1, 2, 3].map((item, index) => (
                            <motion.div
                                key={index}
                                variants={fadeIn}
                                className="bg-background rounded-xl p-8 shadow-sm border border-border/50"
                            >
                                <div className="flex items-center mb-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <svg
                                            key={star}
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="text-primary"
                                        >
                                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                        </svg>
                                    ))}
                                </div>
                                <p className="text-muted-foreground mb-6">
                                    "SmartStudy has completely transformed how I approach group projects. The AI-powered group matching
                                    is incredibly accurate, and I've made connections with peers who truly enhance my learning
                                    experience."
                                </p>
                                <div className="flex items-center">
                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4">
                                        <Users className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">Student {index + 1}</h4>
                                        <p className="text-sm text-muted-foreground">Computer Science Major</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-primary/5">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeIn}
                        className="text-center"
                    >
                        <Badge className="mb-4">Join Today</Badge>
                        <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Study Experience?</h2>
                        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Join thousands of students already enhancing their learning through smart collaboration and AI-powered
                            tools.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button size="lg" className="rounded-full" onClick={() => (window.location.href = "/sign-up")}>
                                Start Your Journey Today
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="lg" className="rounded-full">
                                Schedule a Demo
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Contact Form Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeIn}
                        className="text-center mb-16"
                    >
                        <Badge className="mb-4">Contact Us</Badge>
                        <h2 className="text-3xl font-bold">Get in Touch</h2>
                        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                            Have questions or need more information? Reach out to the SmartStudy team directly!
                        </p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="grid md:grid-cols-2 gap-12"
                    >
                        <motion.div variants={fadeIn} className="space-y-8">
                            <Card>
                                <CardContent className="p-6 flex items-start gap-4">
                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                        <Mail className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">Email Us</h3>
                                        <p className="text-muted-foreground mb-2">We'll respond within 24 hours</p>
                                        <a href="mailto:contact@SmartStudy.com" className="text-primary hover:underline">
                                            contact@SmartStudy.com
                                        </a>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6 flex items-start gap-4">
                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                        <Phone className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">Call Us</h3>
                                        <p className="text-muted-foreground mb-2">Mon-Fri from 9am to 5pm</p>
                                        <a href="tel:+1234567890" className="text-primary hover:underline">
                                            +1 (234) 567-890
                                        </a>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6 flex items-start gap-4">
                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                        <MapPin className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">Visit Us</h3>
                                        <p className="text-muted-foreground mb-2">Come say hello at our office</p>
                                        <address className="not-italic text-primary">
                                            123 Education Lane
                                            <br />
                                            Tech Hub, CA 94103
                                        </address>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div variants={fadeIn}>
                            <form
                                onSubmit={handleSubmit}
                                className="space-y-6 bg-background p-8 rounded-xl shadow-sm border border-border/50">
                                <div>
                                    <Label htmlFor="name" className="text-base">
                                        Name
                                    </Label>
                                    <Input
                                        id="name"
                                        name={"name"}
                                        value={contact.name}
                                        onChange={handleFormChange}
                                        type="text"
                                        placeholder="Your Name"
                                        className="mt-2"
                                        required
                                    />

                                </div>
                                <div>
                                    <Label htmlFor="email" className="text-base">
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        required
                                        name="email"
                                        value={contact.email}
                                        onChange={handleFormChange}
                                        type="email"
                                        placeholder="Your Email"
                                        className="mt-2" />
                                </div>
                                <div>
                                    <Label htmlFor="subject" className="text-base">
                                        Subject
                                    </Label>
                                    <Input
                                        id="subject"
                                        required
                                        name="subject"
                                        value={contact.subject}
                                        onChange={handleFormChange}
                                        type="text"
                                        placeholder="How can we help?"
                                        className="mt-2" />
                                </div>
                                <div>
                                    <Label htmlFor="message" className="text-base">
                                        Message
                                    </Label>
                                    <Textarea
                                        id="message"
                                        required
                                        name="message"
                                        value={contact.message}
                                        onChange={handleFormChange}
                                        placeholder="Your Message"
                                        className="mt-2" rows={5} />

                                </div>
                                <Button type="submit"
                                    size="lg" className="w-full">
                                    {
                                        storeContact.isPending ?
                                            (
                                                <div className="flex gap-x-3">
                                                    <Loader2
                                                        className="animate-spin"
                                                    />
                                                    Sending...
                                                </div>
                                            )
                                            :
                                            (
                                                <div>
                                                    Send Message
                                                </div>
                                            )
                                    }
                                </Button>
                            </form>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-accent/20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeIn}
                        className="text-center mb-16"
                    >
                        <Badge className="mb-4">FAQ</Badge>
                        <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
                        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                            Find answers to common questions about SmartStudy.
                        </p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeIn}
                    >
                        <Tabs defaultValue="general" className="w-full">
                            <TabsList className="grid grid-cols-3 max-w-md mx-auto mb-8">
                                <TabsTrigger value="general">General</TabsTrigger>
                                <TabsTrigger value="features">Features</TabsTrigger>
                                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                            </TabsList>

                            <TabsContent value="general" className="mt-0">
                                <Accordion type="single" collapsible className="space-y-4">
                                    {[
                                        {
                                            question: "What is SmartStudy?",
                                            answer:
                                                "SmartStudy is a collaborative learning platform that connects students with similar academic interests and goals. Our platform uses AI to help create and verify study groups, making it easier to find the perfect learning community.",
                                        },
                                        {
                                            question: "Who can use SmartStudy?",
                                            answer:
                                                "SmartStudy is designed for students at all levels of education, from high school to graduate studies. Anyone looking to enhance their learning through collaboration can benefit from our platform.",
                                        },
                                        {
                                            question: "How do I get started?",
                                            answer:
                                                "Simply sign up for an account, complete your profile with your academic interests and goals, and start exploring or creating study groups. Our intuitive interface makes it easy to find the perfect learning community.",
                                        },
                                    ].map((item, index) => (
                                        <AccordionItem key={index} value={`general-${index}`}>
                                            <AccordionTrigger>{item.question}</AccordionTrigger>
                                            <AccordionContent>{item.answer}</AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </TabsContent>

                            <TabsContent value="features" className="mt-0">
                                <Accordion type="single" collapsible className="space-y-4">
                                    {[
                                        {
                                            question: "How does the AI resume analysis work?",
                                            answer:
                                                "Our AI analyzes your resume to identify your skills, experience, and academic background. This information is used to match you with study groups that align with your qualifications and learning goals.",
                                        },
                                        {
                                            question: "Can I create both public and private groups?",
                                            answer:
                                                "Yes, SmartStudy allows you to create both public groups that anyone can join and private groups that require verification through our AI resume analysis.",
                                        },
                                        {
                                            question: "What tools are available for collaboration?",
                                            answer:
                                                "SmartStudy offers a variety of tools for collaboration, including discussion forums, resource sharing, video conferencing, and collaborative document editing.",
                                        },
                                    ].map((item, index) => (
                                        <AccordionItem key={index} value={`features-${index}`}>
                                            <AccordionTrigger>{item.question}</AccordionTrigger>
                                            <AccordionContent>{item.answer}</AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </TabsContent>

                            <TabsContent value="pricing" className="mt-0">
                                <Accordion type="single" collapsible className="space-y-4">
                                    {[
                                        {
                                            question: "Is SmartStudy free to use?",
                                            answer:
                                                "SmartStudy offers a free basic plan with limited features. We also offer premium plans with additional features and capabilities for a monthly subscription fee.",
                                        },
                                        {
                                            question: "Are there discounts for educational institutions?",
                                            answer:
                                                "Yes, we offer special pricing for educational institutions. Contact our sales team for more information on institutional licensing.",
                                        },
                                        {
                                            question: "Can I cancel my subscription at any time?",
                                            answer:
                                                "Yes, you can cancel your subscription at any time. Your access to premium features will continue until the end of your billing cycle.",
                                        },
                                    ].map((item, index) => (
                                        <AccordionItem key={index} value={`pricing-${index}`}>
                                            <AccordionTrigger>{item.question}</AccordionTrigger>
                                            <AccordionContent>{item.answer}</AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </TabsContent>
                        </Tabs>

                    </motion.div>
                </div>
            </section>
        </div>
    )
}

export default AboutPage

