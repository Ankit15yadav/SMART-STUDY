'use client'

import { Button } from '@/components/ui/button'
import { UserButton, useUser } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'


const NavbatTabs = [
    {
        id: '1',
        title: "Home",
        path: "/",
    },
    {
        id: '2',
        title: "About Us",
        path: "/about"
    },
    {
        id: "3",
        title: "Create Group",
        path: "/groups/create"
    }
]

const Navbar = () => {

    const pathname = usePathname();
    const user = useUser();

    console.log(pathname)

    return (
        <div className='h-16 max-w-screen flex'>
            <div className='w-9/12 mx-auto h-full flex items-center justify-between p-4'>
                <Image
                    src={"/assets/images/logo.png"}
                    alt='logo '
                    width={120}
                    height={40}
                />
                <div className='flex gap-x-4 font-medium'>
                    {
                        NavbatTabs.map((item) => (
                            <Link href={item.path} key={item.id}
                                className={`${pathname === item.path ? 'text-primary' : ''}`}
                            >
                                {item.title}
                            </Link>
                        ))
                    }
                </div>

                <div>
                    {
                        user ?
                            (
                                <div className='flex gap-x-2'>
                                    <Button className=''>
                                        Dashboard
                                    </Button>
                                    <UserButton />
                                </div>
                            )
                            :
                            ('sign-in')
                    }
                </div>
            </div>
        </div>
    )
}

export default Navbar