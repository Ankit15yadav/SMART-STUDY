'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { UserButton, useUser } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, Bell, Search, Moon, Sun } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

const NavbarTabs = [
    {
        id: '1',
        title: "Home",
        path: "/u/home",
    },
    {
        id: '2',
        title: "About Us",
        path: "/u/about"
    },
    {
        id: "3",
        title: "Groups",
        path: "/groups"
    },
    {
        id: "4",
        title: "Create Group",
        path: "/groups/create"
    }
]

const Navbar = () => {
    const pathname = usePathname();
    const { isSignedIn, user } = useUser();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle dark mode toggle
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 border-b border-gray-300 transition-all duration-300 ${isScrolled ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md' : 'bg-white dark:bg-gray-900'}`}>
                <div className='w-11/12 md:w-10/12 lg:w-9/12 mx-auto h-16 flex items-center justify-between'>
                    {/* Logo */}
                    <div className='flex items-center'>
                        <Image
                            src={"/assets/images/logo.png"}
                            alt='logo'
                            width={120}
                            height={40}
                            className='cursor-pointer'
                            onClick={() => router.push('/')}
                        />
                    </div>

                    {/* Desktop navigation */}
                    <div className='hidden md:flex gap-x-6 font-medium'>
                        {NavbarTabs.map((item) => (
                            <Link
                                href={item.path}
                                key={item.id}
                                className={`${pathname === item.path
                                    ? 'text-primary border-b-2 border-primary py-1'
                                    : 'text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors'
                                    }`}
                            >
                                {item.title}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop actions */}
                    <div className='hidden md:flex items-center gap-x-4'>
                        {/* Search button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push('/groups/my-interest')}
                            className='text-gray-700 dark:text-gray-300'
                        >
                            <Search size={20} />
                        </Button>

                        {/* Dark mode toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleDarkMode}
                            className='text-gray-700 dark:text-gray-300'
                        >
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </Button>

                        {/* Authentication */}
                        {isSignedIn ? (
                            <div className='flex items-center gap-x-3'>
                                {/* Notifications */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className='relative text-gray-700 dark:text-gray-300'>
                                            <Bell size={20} />
                                            <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center'>3</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className='w-64'>
                                        <DropdownMenuItem className='cursor-pointer'>
                                            <div className='flex flex-col'>
                                                <span className='font-medium'>New group invitation</span>
                                                <span className='text-sm text-gray-500'>2 minutes ago</span>
                                            </div>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className='cursor-pointer'>
                                            <div className='flex flex-col'>
                                                <span className='font-medium'>Group meeting scheduled</span>
                                                <span className='text-sm text-gray-500'>1 hour ago</span>
                                            </div>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className='cursor-pointer'>
                                            <div className='flex flex-col'>
                                                <span className='font-medium'>New message from admin</span>
                                                <span className='text-sm text-gray-500'>Yesterday</span>
                                            </div>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                {/* Dashboard button */}
                                <Button
                                    className='px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 transition-colors'
                                    onClick={() => router.push("/groups")}
                                >
                                    Dashboard
                                </Button>

                                {/* User profile */}
                                <UserButton fallback="/" />
                            </div>
                        ) : (
                            <div className='flex gap-x-2'>
                                <Button
                                    variant="outline"
                                    onClick={() => router.push("/sign-in")}
                                    className='border-primary text-primary hover:bg-primary/10'
                                >
                                    Sign In
                                </Button>
                                <Button
                                    onClick={() => router.push("/sign-up")}
                                    className='bg-primary hover:bg-primary/90'
                                >
                                    Sign Up
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className='md:hidden flex items-center gap-x-2'>
                        {isSignedIn && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className='relative text-gray-700 dark:text-gray-300'
                            >
                                <Bell size={20} />
                                <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center'>3</span>
                            </Button>
                        )}

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className='text-gray-700 dark:text-gray-300'
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </Button>
                    </div>
                </div>

                {/* Mobile menu */}
                {isMobileMenuOpen && (
                    <div className='md:hidden bg-white dark:bg-gray-900 shadow-md'>
                        <div className='w-11/12 mx-auto py-4 flex flex-col gap-y-4'>
                            {NavbarTabs.map((item) => (
                                <Link
                                    href={item.path}
                                    key={item.id}
                                    className={`${pathname === item.path
                                        ? 'text-primary font-semibold'
                                        : 'text-gray-700 dark:text-gray-300'
                                        } py-2`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {item.title}
                                </Link>
                            ))}

                            <div className='flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700'>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={toggleDarkMode}
                                    className='text-gray-700 dark:text-gray-300'
                                >
                                    {isDarkMode ? (
                                        <div className='flex items-center gap-x-2'>
                                            <Sun size={16} />
                                            <span>Light Mode</span>
                                        </div>
                                    ) : (
                                        <div className='flex items-center gap-x-2'>
                                            <Moon size={16} />
                                            <span>Dark Mode</span>
                                        </div>
                                    )}
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => router.push('/search')}
                                    className='text-gray-700 dark:text-gray-300'
                                >
                                    <div className='flex items-center gap-x-2'>
                                        <Search size={16} />
                                        <span>Search</span>
                                    </div>
                                </Button>
                            </div>

                            {!isSignedIn && (
                                <div className='flex flex-col gap-y-2 pt-4 border-t border-gray-200 dark:border-gray-700'>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            router.push("/sign-in");
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className='border-primary text-primary hover:bg-primary/10 w-full'
                                    >
                                        Sign In
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            router.push("/sign-up");
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className='bg-primary hover:bg-primary/90 w-full'
                                    >
                                        Sign Up
                                    </Button>
                                </div>
                            )}

                            {isSignedIn && (
                                <div className='flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700'>
                                    <Button
                                        className='px-4 py-2 bg-primary hover:bg-primary/90'
                                        onClick={() => {
                                            router.push("/groups");
                                            setIsMobileMenuOpen(false);
                                        }}
                                    >
                                        Dashboard
                                    </Button>
                                    <UserButton />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </nav>
            {/* Spacer to prevent content from being hidden behind the fixed navbar */}
            <div className="h-16"></div>
        </>
    )
}

export default Navbar
