'use client'

import React, { useState } from 'react'
import { Dancing_Script } from "next/font/google"
import { data } from "../../../../../../public/assets/interests/data"
import InterestsCard from '@/components/interests'
import { Button } from '@/components/ui/button'
import { ArrowRight, BookOpen, Code, Database, Laptop, Loader2, Microscope, Server } from 'lucide-react'
import { api } from '@/trpc/react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const dancingScript = Dancing_Script({ subsets: ['latin'], weight: '400' })

export type datainterst = {
    title: string
    id: string
}

const Interests = () => {
    const [interests, setInterests] = useState<datainterst[]>([])
    const createInterest = api.interest.insertInterest.useMutation()
    const [isloading, setIsLoading] = useState(false)
    const router = useRouter();

    const handleInterest = () => {
        setIsLoading(true)
        createInterest.mutate({ name: interests.map((interest) => interest.title).join(', ') },
            {
                onSuccess: () => {
                    toast.success('Interests added successfully')
                    setIsLoading(false)
                    router.push("/groups/my-interest")
                },
                onError: (error) => {
                    console.log(error);
                    setIsLoading(false)
                    toast.error('Failed to add interests')
                },
            }
        )
    }

    // Categorized interests based on the provided data
    const categories = [
        {
            name: "Programming Languages",
            icon: <Code className="h-5 w-5 mr-2 text-primary" />,
            items: data.filter(item => [3, 4, 5, 6, 7, 8, 9, 10, 11, 12].includes(item.id))
        },
        {
            name: "Computer Science Fundamentals",
            icon: <Laptop className="h-5 w-5 mr-2 text-primary" />,
            items: data.filter(item => [1, 2, 41, 42, 43, 44, 45, 46, 50, 58].includes(item.id))
        },
        {
            name: "Advanced Technologies",
            icon: <Server className="h-5 w-5 mr-2 text-primary" />,
            items: data.filter(item => [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27].includes(item.id))
        },
        {
            name: "Mathematics & Statistics",
            icon: <Database className="h-5 w-5 mr-2 text-primary" />,
            items: data.filter(item => [28, 29, 30, 31, 49].includes(item.id))
        },
        {
            name: "Sciences & Engineering",
            icon: <Microscope className="h-5 w-5 mr-2 text-primary" />,
            items: data.filter(item => [32, 33, 34, 51, 52, 53, 54, 55, 56, 57].includes(item.id))
        },
        {
            name: "Humanities & Social Sciences",
            icon: <BookOpen className="h-5 w-5 mr-2 text-primary" />,
            items: data.filter(item => [35, 36, 37, 38, 39, 40].includes(item.id))
        }
    ];

    return (
        <ScrollArea className="h-[calc(100vh-4rem)] w-full">
            <div className='w-full  mx-auto px-4 py-8'>
                <Card className="border-2 border-primary/10 shadow-md">
                    <CardHeader className="text-center border-b border-primary/10 pb-6">
                        <CardTitle className={`text-4xl ${dancingScript.className} text-primary`}>
                            What are you interested in?
                        </CardTitle>
                        <CardDescription className="text-base mt-2">
                            Choose five interests to help us personalize your learning experience
                        </CardDescription>
                        <div className="mt-4 flex items-center justify-center gap-2">
                            <div className="flex items-center">
                                <div className="h-4 w-4 rounded-full bg-primary mr-2"></div>
                                <span className="text-sm text-muted-foreground">Selected ({interests.length})</span>
                            </div>
                            <div className="w-px h-4 bg-border mx-2"></div>
                            <div className="flex items-center">
                                <div className="h-4 w-4 rounded-full border border-primary/30 mr-2"></div>
                                <span className="text-sm text-muted-foreground">Available</span>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-6">
                        {categories.map((category, idx) => (
                            <div key={idx} className="mb-8">
                                <h3 className="text-lg font-medium mb-4 text-foreground flex items-center">
                                    {category.icon}
                                    {category.name}
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {category.items.map((interest) => (
                                        <InterestsCard
                                            key={interest.id}
                                            title={interest.title}
                                            interests={interests}
                                            setInterests={setInterests}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}

                        <div className="mt-8 flex justify-between items-center pt-4 border-t border-primary/10">
                            <div className="text-sm text-muted-foreground">
                                {interests.length < 5 ?
                                    `Please select at least ${5 - interests.length} more interests` :
                                    `${interests.length} interests selected`
                                }
                            </div>
                            <Button
                                onClick={handleInterest}
                                disabled={interests.length < 5}
                                className="px-6 py-5 bg-primary hover:bg-primary/90 transition-all"
                            >
                                {isloading ? (
                                    <div className='flex items-center gap-x-2'>
                                        <span>Saving</span>
                                        <Loader2 className='animate-spin h-4 w-4' />
                                    </div>
                                ) : (
                                    <div className='flex items-center gap-x-2'>
                                        <span>Continue</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </div>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </ScrollArea>
    )
}

export default Interests