'use client'

import React, { useState } from 'react'
import { Dancing_Script } from "next/font/google"
import { Input } from '@/components/ui/input'
import { data } from "../../../../../../public/assets/interests/data"
import InterestsCard from '@/components/interests'
import { Button } from '@/components/ui/button'
import { ArrowRight, Loader2 } from 'lucide-react'
import { api } from '@/trpc/react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { ScrollArea } from '@/components/ui/scroll-area'


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
        // console.log(interests)

        setIsLoading(true)
        createInterest.mutate({ name: interests.map((interest) => interest.title).join(', ') },
            {
                onSuccess: () => {
                    toast.success('Interests added successfully')

                    setIsLoading(false)
                    // redirect('/')
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

    return (

        <ScrollArea className="h-[calc(100vh-4rem)] w-full">
            <div className='w-full '>
                <div className='w-11/12 mx-auto  min-h-screen'>
                    {/* <div className='flex items-center justify-center  pt-2'>
                    <Image
                        src={"/assets/images/logo.png"}
                        alt='logo'
                        width={150}
                        height={150}
                        className='flex it'
                    />
                </div> */}

                    <div className='flex flex-col justify-center items-center py-4'>
                        <h1 className={`text-4xl ${dancingScript.className}`}>What are you interested in?</h1>
                        <p className='text-muted-foreground mt-2 text-sm' >Choose  five interests or more</p>
                    </div>

                    <div className="h-8"></div>
                    <div className='w-11/12 mx-auto  justify-center flex flex-wrap gap-4'>
                        {data.map((Interest, index) => (
                            <InterestsCard title={Interest.title} interests={interests} setInterests={setInterests} key={index} />
                        ))}
                    </div>
                    <div className="h-4"></div>
                    <div className='flex justify-end'>
                        <Button
                            onClick={handleInterest}
                            disabled={interests.length < 5}
                        >
                            {
                                isloading ?
                                    (<div className='flex items-center gap-x-2'>
                                        Saving...
                                        <Loader2 className='animate-spin' />
                                    </div>)
                                    :
                                    (<div className='flex items-center gap-x-2'>
                                        Continue
                                        <ArrowRight />
                                    </div>)
                            }
                        </Button>
                    </div>

                </div>
            </div>

        </ScrollArea>


    )
}

export default Interests


