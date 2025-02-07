'use client'

import React, { useState } from 'react'
import { Dancing_Script } from "next/font/google"
import { Input } from '@/components/ui/input'
import { data } from "../../../../public/assets/interests/data"
import InterestsCard from '@/components/interests'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

const dancingScript = Dancing_Script({ subsets: ['latin'], weight: '400' })

export type datainterst = {
    title: string
    id: string
}

const Interests = () => {

    const [interests, setInterests] = useState<datainterst[]>([])

    return (
        <div className='w-full bg-gradient-to-bl from-teal-200 to-emerald-100'>
            <div className='w-11/12 mx-auto  min-h-screen'>
                <div className='flex flex-col justify-center items-center py-8'>
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
                        onClick={() => console.log(interests)}
                        disabled={interests.length < 5}
                    >
                        continue
                        <ArrowRight />
                    </Button>
                </div>

            </div>
        </div>

    )
}

export default Interests