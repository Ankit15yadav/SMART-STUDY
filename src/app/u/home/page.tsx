"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { Environment, PerspectiveCamera, Stars, Sparkles } from "@react-three/drei"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import AnimatedBackground from "@/components/animated-background"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Users,
    MessageSquare,
    FileCode,
    Video,
    Shield,
    FileSpreadsheet,
    Zap,
    Brain,
    Rocket,
    ArrowRight,
    ChevronRight,
    SparklesIcon,
    Code,
    BookOpen,
    Lightbulb,
    GraduationCap,
    Award,
    Target,
} from "lucide-react"

// Main Page Component
export default function HomePage() {
    const [scrollY, setScrollY] = useState(0)
    const { scrollYProgress } = useScroll()
    const [activeSection, setActiveSection] = useState("hero")
    const [mounted, setMounted] = useState(false)

    // Refs for sections to track scrolling
    const heroRef = useRef<HTMLElement | null>(null)
    const featuresRef = useRef<HTMLElement | null>(null)
    const workflowRef = useRef<HTMLElement | null>(null)
    const testimonialsRef = useRef<HTMLElement | null>(null)
    const resourcesRef = useRef<HTMLElement | null>(null)
    const faqRef = useRef<HTMLElement | null>(null)

    useEffect(() => {
        setMounted(true)

        const handleScroll = () => {
            setScrollY(window.scrollY)

            // Determine active section based on scroll position
            const scrollPosition = window.scrollY + window.innerHeight / 2

            if (heroRef.current && scrollPosition < heroRef.current.offsetTop + heroRef.current.offsetHeight) {
                setActiveSection("hero")
            } else if (
                featuresRef.current &&
                scrollPosition < featuresRef.current.offsetTop + featuresRef.current.offsetHeight
            ) {
                setActiveSection("features")
            } else if (
                workflowRef.current &&
                scrollPosition < workflowRef.current.offsetTop + workflowRef.current.offsetHeight
            ) {
                setActiveSection("workflow")
            } else if (
                testimonialsRef.current &&
                scrollPosition < testimonialsRef.current.offsetTop + testimonialsRef.current.offsetHeight
            ) {
                setActiveSection("testimonials")
            } else if (
                resourcesRef.current &&
                scrollPosition < resourcesRef.current.offsetTop + resourcesRef.current.offsetHeight
            ) {
                setActiveSection("resources")
            } else {
                setActiveSection("faq")
            }
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    // Transform values for parallax effects
    const y1 = useTransform(scrollYProgress, [0, 1], [0, -500])
    const y2 = useTransform(scrollYProgress, [0, 1], [0, -1000])
    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])

    if (!mounted) return null

    return (
        <main className="relative overflow-hidden bg-background text-gray-800">
            {/* Hero Section with 3D Animation */}
            <section ref={heroRef} className="relative min-h-screen flex items-center justify-center">
                {/* 3D Background */}
                {/* <div className="absolute inset-0 z-0 bg-gradient-to-b from-blue-50 to-white">
                    <Canvas>
                        <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={75} />
                        <Suspense fallback={null}>
                            <color attach="background" args={["#f8fafc"]} />
                            <StarsBackground />
                            <Environment preset="sunset" />
                        </Suspense>
                    </Canvas>
                </div> */}

                <AnimatedBackground />

                {/* Hero Content */}
                <div className="container mx-auto px-4 z-10 relative">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="max-w-4xl mx-auto text-center"
                    >
                        <motion.div style={{ y: y1, opacity }} className="mb-6">
                            <Badge className="mb-4 py-1.5 px-4 bg-purple-100 text-purple-700 border-none">
                                The Future of Student Collaboration
                            </Badge>
                            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600">
                                Connect, Collaborate, and Grow Together
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                                An AI-powered platform where college students connect based on shared interests, collaborate on
                                projects, and enhance their skills together.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 rounded-full text-lg">
                                Get Started
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                            <Button
                                variant="outline"
                                className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 px-8 py-6 rounded-full text-lg"
                            >
                                Watch Demo
                                <Video className="ml-2 h-5 w-5" />
                            </Button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 1.2 }}
                            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto"
                        >
                            {[
                                { count: "100+", label: "Active Students" },
                                { count: "5+", label: "Universities" },
                                { count: "2,500+", label: "Study Groups" },
                                { count: "95%", label: "Success Rate" },
                            ].map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
                                        {stat.count}
                                    </div>
                                    <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1.5 }}
                    className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
                >
                    <p className="text-gray-500 text-sm mb-2">Scroll to explore</p>
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
                    >
                        <ChevronRight className="h-6 w-6 text-gray-400 transform rotate-90" />
                    </motion.div>
                </motion.div>
            </section>

            {/* Features Section */}
            <section id="features" ref={featuresRef} className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white via-purple-50 to-white z-0"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <Badge className="mb-4 py-1.5 px-4 bg-purple-100 text-purple-700 border-none">Platform Features</Badge>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">Everything You Need to Succeed</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Our platform combines AI-powered tools with real-time collaboration features to create the ultimate
                            student networking experience.
                        </p>
                    </motion.div>

                    <Tabs defaultValue="connect" className="w-full max-w-5xl mx-auto">
                        <TabsList className="grid grid-cols-3 mb-12 bg-white border border-gray-200 rounded-full p-1 w-full max-w-2xl mx-auto">
                            <TabsTrigger
                                value="connect"
                                className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white"
                            >
                                Connect
                            </TabsTrigger>
                            <TabsTrigger
                                value="collaborate"
                                className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white"
                            >
                                Collaborate
                            </TabsTrigger>
                            <TabsTrigger
                                value="grow"
                                className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white"
                            >
                                Grow
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="connect" className="mt-0">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
                            >
                                <div className="order-2 md:order-1">
                                    <h3 className="text-3xl font-bold mb-6 text-gray-800">Find Your Community</h3>
                                    <p className="text-gray-600 mb-8">
                                        Connect with like-minded students based on shared interests, academic goals, and career aspirations.
                                        Our AI-powered matching system helps you find the perfect study groups and collaborators.
                                    </p>

                                    <div className="space-y-4">
                                        {[
                                            {
                                                icon: <Users className="h-5 w-5" />,
                                                title: "Interest-Based Groups",
                                                description: "Join public or private groups aligned with your interests",
                                            },
                                            {
                                                icon: <Brain className="h-5 w-5" />,
                                                title: "AI Matching",
                                                description: "Get personalized group recommendations based on your profile",
                                            },
                                            {
                                                icon: <Shield className="h-5 w-5" />,
                                                title: "Verified Communities",
                                                description: "Private groups with AI resume verification for quality interactions",
                                            },
                                        ].map((feature, index) => (
                                            <div key={index} className="flex gap-4">
                                                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white">
                                                    {feature.icon}
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-semibold text-gray-800">{feature.title}</h4>
                                                    <p className="text-gray-600">{feature.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="order-1 md:order-2 relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl blur-3xl opacity-10"></div>
                                    <div className="relative bg-white border border-gray-200 shadow-lg rounded-3xl p-8 overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full filter blur-3xl opacity-10 -mr-10 -mt-10"></div>
                                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500 rounded-full filter blur-3xl opacity-10 -ml-10 -mb-10"></div>

                                        <div className="mb-8 flex justify-between items-center">
                                            <h4 className="text-xl font-bold text-gray-800">Popular Groups</h4>
                                            <Badge className="bg-purple-100 hover:bg-purple-200 text-purple-700">View All</Badge>
                                        </div>

                                        <div className="space-y-4">
                                            {[
                                                { name: "Web Dev Wizards", members: 128, tags: ["JavaScript", "React"], isPrivate: false },
                                                {
                                                    name: "AI Research Collective",
                                                    members: 63,
                                                    tags: ["Machine Learning", "Neural Networks"],
                                                    isPrivate: true,
                                                },
                                                { name: "Data Science Hub", members: 95, tags: ["Python", "Data Analysis"], isPrivate: false },
                                            ].map((group, index) => (
                                                <div
                                                    key={index}
                                                    className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors cursor-pointer"
                                                >
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h5 className="font-semibold text-gray-800">{group.name}</h5>
                                                        {group.isPrivate && (
                                                            <Badge
                                                                variant="outline"
                                                                className="flex items-center gap-1 border-gray-300 text-gray-600"
                                                            >
                                                                <Shield className="h-3 w-3" /> Private
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                                                        <Users className="h-3 w-3" /> {group.members} members
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {group.tags.map((tag, i) => (
                                                            <Badge
                                                                key={i}
                                                                variant="secondary"
                                                                className="bg-blue-100 text-blue-700 hover:bg-blue-200"
                                                            >
                                                                {tag}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </TabsContent>

                        <TabsContent value="collaborate">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
                            >
                                <div className="order-2 md:order-1">
                                    <h3 className="text-3xl font-bold mb-6 text-gray-800">Seamless Collaboration</h3>
                                    <p className="text-gray-600 mb-8">
                                        Work together in real-time with zero latency communication, integrated video meetings, and
                                        intelligent code repository analysis for effective project collaboration.
                                    </p>

                                    <div className="space-y-4">
                                        {[
                                            {
                                                icon: <MessageSquare className="h-5 w-5" />,
                                                title: "Real-Time Chat",
                                                description: "Zero latency messaging with history and search",
                                            },
                                            {
                                                icon: <Video className="h-5 w-5" />,
                                                title: "Integrated Video Meetings",
                                                description: "One-click video sessions with screen sharing",
                                            },
                                            {
                                                icon: <FileCode className="h-5 w-5" />,
                                                title: "Repository Analysis",
                                                description: "AI-powered code analysis and Q&A for your repositories",
                                            },
                                        ].map((feature, index) => (
                                            <div key={index} className="flex gap-4">
                                                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white">
                                                    {feature.icon}
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-semibold text-gray-800">{feature.title}</h4>
                                                    <p className="text-gray-600">{feature.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="order-1 md:order-2 relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl blur-3xl opacity-10"></div>
                                    <div className="relative bg-white border border-gray-200 shadow-lg rounded-3xl p-8 overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full filter blur-3xl opacity-10 -mr-10 -mt-10"></div>
                                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500 rounded-full filter blur-3xl opacity-10 -ml-10 -mb-10"></div>

                                        <div className="mb-4">
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                                <div className="text-sm text-gray-500 ml-2">repository-analyzer.js</div>
                                            </div>

                                            <div className="font-mono text-sm bg-gray-50 rounded-lg p-4 text-gray-800">
                                                <div className="text-blue-600">
                                                    import <span className="text-green-600">{"{ analyzeCode }"}</span> from{" "}
                                                    <span className="text-yellow-600">'./ai-tools'</span>;
                                                </div>
                                                <div className="text-purple-600">async function</div>{" "}
                                                <div className="text-yellow-600">processRepository</div>
                                                <span className="text-gray-800">(repoUrl) {"{"}</span>
                                                <div className="ml-4 text-gray-700">
                                                    const result = <span className="text-purple-600">await</span>{" "}
                                                    <span className="text-yellow-600">analyzeCode</span>(repoUrl);
                                                </div>
                                                <div className="ml-4 text-gray-700">return result.insights;</div>
                                                <div className="text-gray-800">{"}"}</div>
                                            </div>
                                        </div>

                                        <div className="mt-6 border-t border-gray-200 pt-6">
                                            <div className="flex items-start gap-3 mb-4">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
                                                    AI
                                                </div>
                                                <div className="bg-gray-50 rounded-xl rounded-tl-none p-3">
                                                    <p className="text-sm text-gray-700">
                                                        I've analyzed your repository. The code has potential memory leaks in the data processing
                                                        functions. Would you like me to suggest optimizations?
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 mt-4">
                                                <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                                                    Show Details
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                                                >
                                                    Optimize Code
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </TabsContent>

                        <TabsContent value="grow">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
                            >
                                <div className="order-2 md:order-1">
                                    <h3 className="text-3xl font-bold mb-6 text-gray-800">Accelerate Your Growth</h3>
                                    <p className="text-gray-600 mb-8">
                                        Enhance your skills and career prospects with AI-powered resume enhancement, personalized learning
                                        paths, and access to a network of like-minded peers.
                                    </p>

                                    <div className="space-y-4">
                                        {[
                                            {
                                                icon: <FileSpreadsheet className="h-5 w-5" />,
                                                title: "Resume Enhancement",
                                                description: "AI-powered resume analysis and improvement suggestions",
                                            },
                                            {
                                                icon: <BookOpen className="h-5 w-5" />,
                                                title: "Personalized Learning",
                                                description: "Custom learning paths based on your goals and interests",
                                            },
                                            {
                                                icon: <Rocket className="h-5 w-5" />,
                                                title: "Career Opportunities",
                                                description: "Connect with industry partners and discover internships",
                                            },
                                        ].map((feature, index) => (
                                            <div key={index} className="flex gap-4">
                                                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white">
                                                    {feature.icon}
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-semibold text-gray-800">{feature.title}</h4>
                                                    <p className="text-gray-600">{feature.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="order-1 md:order-2 relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl blur-3xl opacity-10"></div>
                                    <div className="relative bg-white border border-gray-200 shadow-lg rounded-3xl p-8 overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full filter blur-3xl opacity-10 -mr-10 -mt-10"></div>
                                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500 rounded-full filter blur-3xl opacity-10 -ml-10 -mb-10"></div>

                                        <div className="mb-6">
                                            <h4 className="text-xl font-bold mb-4 text-gray-800">Resume Analysis</h4>
                                            <div className="bg-gray-50 rounded-xl p-4 mb-4">
                                                <div className="flex justify-between items-center mb-2">
                                                    <div className="font-semibold text-gray-800">Technical Skills</div>
                                                    <Badge className="bg-green-100 text-green-700 hover:bg-green-200">Strong</Badge>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                                                    <div
                                                        className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full"
                                                        style={{ width: "85%" }}
                                                    ></div>
                                                </div>

                                                <div className="flex justify-between items-center mb-2">
                                                    <div className="font-semibold text-gray-800">Work Experience</div>
                                                    <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200">Needs Work</Badge>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                                                    <div
                                                        className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full"
                                                        style={{ width: "45%" }}
                                                    ></div>
                                                </div>

                                                <div className="flex justify-between items-center mb-2">
                                                    <div className="font-semibold text-gray-800">Education</div>
                                                    <Badge className="bg-green-100 text-green-700 hover:bg-green-200">Strong</Badge>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full"
                                                        style={{ width: "90%" }}
                                                    ></div>
                                                </div>
                                            </div>

                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <h5 className="font-semibold mb-2 text-gray-800">AI Recommendations</h5>
                                                <ul className="space-y-2 text-sm text-gray-700">
                                                    <li className="flex items-start gap-2">
                                                        <Zap className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                                                        <span>Add specific metrics to your project descriptions</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <Zap className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                                                        <span>Include relevant internship experience</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <Zap className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                                                        <span>Highlight leadership roles in student organizations</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>

                                        <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                                            Enhance Your Resume
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        </TabsContent>
                    </Tabs>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="workflow" ref={workflowRef} className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50 to-white z-0"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <Badge className="mb-4 py-1.5 px-4 bg-blue-100 text-blue-700 border-none">How It Works</Badge>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">Your Journey to Success</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            From sign-up to collaboration, our platform makes it easy to connect with peers, join communities, and
                            accelerate your academic and career growth.
                        </p>
                    </motion.div>

                    <div className="max-w-5xl mx-auto">
                        <div className="relative">
                            {/* Connecting line */}
                            <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 via-blue-500 to-purple-500 z-0"></div>

                            {/* Steps */}
                            {[
                                {
                                    title: "Create Your Profile",
                                    description: "Sign up and set up your academic profile with your interests, skills, and goals.",
                                    icon: <Users className="h-6 w-6" />,
                                    image: (
                                        <div className="bg-white border border-gray-200 shadow-lg rounded-xl p-4 overflow-hidden">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white">
                                                    <Users className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <div className="h-4 w-32 bg-gray-200 rounded-full"></div>
                                                    <div className="h-3 w-24 bg-gray-100 rounded-full mt-2"></div>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="h-3 w-full bg-gray-100 rounded-full animate-pulse"></div>
                                                <div className="h-3 w-5/6 bg-gray-100 rounded-full animate-pulse"></div>
                                                <div className="h-3 w-4/6 bg-gray-100 rounded-full animate-pulse"></div>
                                            </div>
                                            <div className="mt-4 flex flex-wrap gap-2">
                                                <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                                                <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                                                <div className="h-6 w-14 bg-gray-200 rounded-full"></div>
                                            </div>
                                        </div>
                                    ),
                                },
                                {
                                    title: "Discover Communities",
                                    description: "Browse and join groups based on your interests or create your own community.",
                                    icon: <Rocket className="h-6 w-6" />,
                                    image: (
                                        <div className="bg-white border border-gray-200 shadow-lg rounded-xl p-4 overflow-hidden">
                                            <div className="grid grid-cols-2 gap-3">
                                                {[1, 2, 3, 4].map((i) => (
                                                    <div key={i} className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                                                        <div className="h-3 w-full bg-gray-200 rounded-full mb-2"></div>
                                                        <div className="h-2 w-5/6 bg-gray-100 rounded-full mb-3"></div>
                                                        <div className="flex gap-1">
                                                            <div className="h-4 w-8 bg-blue-100 rounded-full"></div>
                                                            <div className="h-4 w-10 bg-purple-100 rounded-full"></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ),
                                },
                                {
                                    title: "Collaborate & Learn",
                                    description: "Engage in real-time discussions, share resources, and work on projects together.",
                                    icon: <MessageSquare className="h-6 w-6" />,
                                    image: (
                                        <div className="bg-white border border-gray-200 shadow-lg rounded-xl p-4 overflow-hidden">
                                            <div className="flex flex-col gap-3">
                                                <div className="flex items-start gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0"></div>
                                                    <div className="bg-gray-50 rounded-lg rounded-tl-none p-2 w-4/5">
                                                        <div className="h-2 w-full bg-gray-200 rounded-full mb-1"></div>
                                                        <div className="h-2 w-5/6 bg-gray-200 rounded-full"></div>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-2 justify-end">
                                                    <div className="bg-purple-100 rounded-lg rounded-tr-none p-2 w-4/5">
                                                        <div className="h-2 w-full bg-purple-200 rounded-full mb-1"></div>
                                                        <div className="h-2 w-3/6 bg-purple-200 rounded-full"></div>
                                                    </div>
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex-shrink-0"></div>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0"></div>
                                                    <div className="bg-gray-50 rounded-lg rounded-tl-none p-2 w-3/5">
                                                        <div className="h-2 w-full bg-gray-200 rounded-full mb-1"></div>
                                                        <div className="h-2 w-4/6 bg-gray-200 rounded-full"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ),
                                },
                                {
                                    title: "Grow Your Skills",
                                    description: "Enhance your resume, get AI-powered feedback, and unlock new opportunities.",
                                    icon: <Brain className="h-6 w-6" />,
                                    image: (
                                        <div className="bg-white border border-gray-200 shadow-lg rounded-xl p-4 overflow-hidden">
                                            <div className="h-4 w-32 bg-gray-200 rounded-full mb-3"></div>
                                            <div className="space-y-3">
                                                <div className="w-full bg-gray-100 rounded-full h-2.5">
                                                    <div
                                                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2.5 rounded-full"
                                                        style={{ width: "75%" }}
                                                    ></div>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-2.5">
                                                    <div
                                                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2.5 rounded-full"
                                                        style={{ width: "60%" }}
                                                    ></div>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-2.5">
                                                    <div
                                                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2.5 rounded-full"
                                                        style={{ width: "90%" }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    ),
                                },
                            ].map((step, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.2 }}
                                    viewport={{ once: true }}
                                    className={`relative  z-10 flex items-center gap-8 mb-16 ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                                        }`}
                                >
                                    <div className="hidden md:block w-1/2">{step.image}</div>

                                    <div className="flex-1 md:w-1/2">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white">
                                                {step.icon}
                                            </div>
                                            <h3 className="text-2xl font-bold text-gray-800">{step.title}</h3>
                                        </div>
                                        <p className="text-gray-600 ml-16">{step.description}</p>

                                        <div className="md:hidden mt-6">{step.image}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" ref={testimonialsRef} className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white via-purple-50 to-white z-0"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <Badge className="mb-4 py-1.5 px-4 bg-purple-100 text-purple-700 border-none">Success Stories</Badge>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">From Students Like You</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Hear from students who have transformed their academic journey and career prospects through our platform.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {[
                            {
                                name: "Alex Johnson",
                                role: "Computer Science Major",
                                university: "Stanford University",
                                quote:
                                    "I found my research team through ConnectEdu. Our AI project won the national competition, and I landed my dream internship at Google!",
                                image: "/placeholder.svg?height=80&width=80",
                            },
                            {
                                name: "Sophia Chen",
                                role: "Data Science Student",
                                university: "MIT",
                                quote:
                                    "The resume enhancement tool helped me completely transform my CV. I received interview calls from 8 out of 10 companies I applied to!",
                                image: "/placeholder.svg?height=80&width=80",
                            },
                            {
                                name: "Marcus Williams",
                                role: "Business Administration",
                                university: "NYU",
                                quote:
                                    "I created a private group for startup enthusiasts, and we've already launched two successful ventures with members I met on the platform.",
                                image: "/placeholder.svg?height=80&width=80",
                            },
                        ].map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                                viewport={{ once: true }}
                            >
                                <Card className="bg-white border border-gray-200 shadow-lg text-gray-800 h-full flex flex-col">
                                    <div className="p-6 flex-1">
                                        <div className="mb-6">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} className="text-yellow-500 inline-block mr-1">
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                        <p className="italic text-gray-600 mb-6">"{testimonial.quote}"</p>
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={testimonial.image || "/placeholder.svg"}
                                                alt={testimonial.name}
                                                className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 p-0.5"
                                            />
                                            <div>
                                                <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                                                <p className="text-sm text-gray-500">{testimonial.role}</p>
                                                <p className="text-xs text-gray-500">{testimonial.university}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Resources Section - New Section */}
            <section id="resources" ref={resourcesRef} className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50 to-white z-0"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <Badge className="mb-4 py-1.5 px-4 bg-blue-100 text-blue-700 border-none">Learning Resources</Badge>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">Expand Your Knowledge</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Access a wealth of resources to enhance your learning journey and develop new skills that will set you
                            apart in your academic and professional life.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {[
                            {
                                title: "Interactive Tutorials",
                                description: "Learn at your own pace with step-by-step tutorials on various subjects and technologies.",
                                icon: <Lightbulb className="h-6 w-6" />,
                                stats: "500+ Tutorials",
                                color: "from-blue-500 to-cyan-500",
                            },
                            {
                                title: "Study Materials",
                                description: "Access comprehensive study materials, practice tests, and exam preparation resources.",
                                icon: <BookOpen className="h-6 w-6" />,
                                stats: "1,200+ Documents",
                                color: "from-purple-500 to-pink-500",
                            },
                            {
                                title: "Skill Workshops",
                                description: "Join virtual workshops led by industry experts to develop practical skills.",
                                icon: <GraduationCap className="h-6 w-6" />,
                                stats: "Weekly Sessions",
                                color: "from-amber-500 to-orange-500",
                            },
                            {
                                title: "Research Opportunities",
                                description: "Discover research projects and collaborate with professors and fellow students.",
                                icon: <Target className="h-6 w-6" />,
                                stats: "300+ Projects",
                                color: "from-emerald-500 to-green-500",
                            },
                            {
                                title: "Career Resources",
                                description:
                                    "Prepare for your career with resume templates, interview tips, and job search strategies.",
                                icon: <Award className="h-6 w-6" />,
                                stats: "Career Ready",
                                color: "from-red-500 to-rose-500",
                            },
                            {
                                title: "Coding Challenges",
                                description: "Test and improve your coding skills with regular challenges and competitions.",
                                icon: <Code className="h-6 w-6" />,
                                stats: "Weekly Challenges",
                                color: "from-violet-500 to-indigo-500",
                            },
                        ].map((resource, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <Card className="bg-white border border-gray-200 shadow-lg text-gray-800 h-full hover:shadow-xl transition-shadow">
                                    <div className="p-6">
                                        <div
                                            className={`w-14 h-14 rounded-full bg-gradient-to-r ${resource.color} flex items-center justify-center text-white mb-6`}
                                        >
                                            {resource.icon}
                                        </div>
                                        <h3 className="text-xl font-bold mb-3 text-gray-800">{resource.title}</h3>
                                        <p className="text-gray-600 mb-4">{resource.description}</p>
                                        <div className="flex justify-between items-center">
                                            <Badge className="bg-gray-100 text-gray-700">{resource.stats}</Badge>
                                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 p-0">
                                                Explore <ChevronRight className="h-4 w-4 ml-1" />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section - New Section */}
            <section id="faq" ref={faqRef} className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white via-purple-50 to-white z-0"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <Badge className="mb-4 py-1.5 px-4 bg-purple-100 text-purple-700 border-none">
                            Frequently Asked Questions
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">Got Questions?</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Find answers to common questions about our platform, features, and how to get started.
                        </p>
                    </motion.div>

                    <div className="max-w-3xl mx-auto">
                        {[
                            {
                                question: "How do I join a private group?",
                                answer:
                                    "To join a private group, you'll need to submit your resume for AI verification. Our system checks if your qualifications match the group's requirements. If approved, you'll gain immediate access. If not, you'll be directed to our resume enhancer to improve your qualifications.",
                            },
                            {
                                question: "Is the platform free to use?",
                                answer:
                                    "Yes, the basic features of our platform are completely free for all college students. We offer premium plans with additional features like advanced AI tools, unlimited repository analysis, and priority support for those who need more.",
                            },
                            {
                                question: "How does the repository analysis work?",
                                answer:
                                    "Our AI analyzes your code repositories by examining the structure, patterns, and potential issues. You can ask questions about your code, and the AI will provide insights, suggestions for improvements, and identify bugs or inefficiencies.",
                            },
                            {
                                question: "Can I create my own study group?",
                                answer:
                                    "You can create both public and private study groups. For private groups, you can set specific requirements that potential members must meet. You'll have tools to manage members, share resources, and facilitate discussions.",
                            },
                            {
                                question: "How secure is my personal information?",
                                answer:
                                    "We take data security very seriously. All personal information is encrypted, and we never share your data with third parties without your explicit consent. Your resume and academic information are only used for the purposes you approve.",
                            },
                        ].map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="mb-6"
                            >
                                <div className="bg-white border border-gray-200 shadow-md rounded-xl overflow-hidden">
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold mb-3 text-gray-800">{faq.question}</h3>
                                        <p className="text-gray-600">{faq.answer}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        <div className="text-center mt-12">
                            <p className="text-gray-600 mb-6">Still have questions? We're here to help!</p>
                            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-full">
                                Contact Support
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-blue-100 z-0"></div>
                <div className="absolute inset-0 bg-[url('/placeholder.svg?height=600&width=1200')] bg-cover bg-center opacity-5 z-0"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gray-800">
                            Ready to Transform Your College Experience?
                        </h2>
                        <p className="text-xl text-gray-600 mb-10">
                            Join thousands of students who are connecting, collaborating, and growing together. Your community is
                            waiting for you.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 rounded-full text-lg">
                                Get Started for Free
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                            <Button
                                variant="outline"
                                className="border-gray-400 text-gray-700 hover:bg-gray-100 hover:text-gray-900 px-8 py-6 rounded-full text-lg"
                            >
                                Schedule a Demo
                                <Video className="ml-2 h-5 w-5" />
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="relative w-8 h-8">
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"></div>
                                    <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
                                        <SparklesIcon className="w-4 h-4 text-blue-600" />
                                    </div>
                                </div>
                                <span className="text-xl font-bold text-gray-800">ConnectEdu</span>
                            </div>
                            <p className="text-gray-500 mb-4">
                                Connecting students, fostering collaboration, and accelerating growth.
                            </p>
                            <div className="flex gap-4">
                                {["twitter", "facebook", "instagram", "linkedin"].map((social) => (
                                    <a
                                        key={social}
                                        href="#"
                                        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                                    >
                                        <span className="sr-only">{social}</span>
                                        <div className="w-4 h-4"></div>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {[
                            {
                                title: "Platform",
                                links: ["Features", "Communities", "AI Tools", "Pricing", "FAQ"],
                            },
                            {
                                title: "Company",
                                links: ["About Us", "Careers", "Blog", "Press", "Contact"],
                            },
                            {
                                title: "Resources",
                                links: ["Documentation", "Tutorials", "Support", "API", "Privacy Policy"],
                            },
                        ].map((column, index) => (
                            <div key={index}>
                                <h4 className="font-semibold mb-4 text-gray-800">{column.title}</h4>
                                <ul className="space-y-2">
                                    {column.links.map((link) => (
                                        <li key={link}>
                                            <a href="#" className="text-gray-500 hover:text-gray-800 transition-colors">
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-500 text-sm mb-4 md:mb-0">
                            © {new Date().getFullYear()} ConnectEdu. All rights reserved.
                        </p>
                        <div className="flex gap-6">
                            <a href="#" className="text-gray-500 hover:text-gray-800 text-sm">
                                Terms of Service
                            </a>
                            <a href="#" className="text-gray-500 hover:text-gray-800 text-sm">
                                Privacy Policy
                            </a>
                            <a href="#" className="text-gray-500 hover:text-gray-800 text-sm">
                                Cookies
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </main>
    )
}

// Stars Background Component
function StarsBackground() {
    return (
        <>
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <Sparkles count={100} scale={10} size={1} speed={0.3} color="#000000" />
        </>
    )
}

