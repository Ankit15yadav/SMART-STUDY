'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { UserButton, useUser } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, Bell, Search, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
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
        title: "Interets",
        path: "/user/groups/interest"
    },
    {
        id: "4",
        title: "Resume Assitant",
        path: "/resume-assistant/chat"
    }
]

const Navbar = () => {
    const pathname = usePathname();
    const { isSignedIn, user } = useUser();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { theme, setTheme } = useTheme();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${isScrolled ? 'bg-background/90 backdrop-blur-md shadow-sm' : 'bg-background'}`}>
                <div className='w-11/12 md:w-10/12 lg:w-9/12 mx-auto h-16 flex items-center justify-between'>
                    {/* Logo */}
                    <div className='flex items-center gap-2'>
                        <Image
                            src={"/assets/images/logo.png"}
                            alt='logo'
                            width={120}
                            height={40}
                            className='cursor-pointer hover:opacity-80 transition-opacity'
                            onClick={() => router.push('/')}
                            priority
                        />
                    </div>

                    {/* Desktop navigation */}
                    <div className='hidden md:flex gap-x-8'>
                        {NavbarTabs.map((item) => (
                            <Link
                                href={item.path}
                                key={item.id}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${pathname === item.path
                                    ? 'bg-primary/10 text-primary font-semibold'
                                    : 'text-foreground/80 hover:bg-accent hover:text-foreground'
                                    }`}
                            >
                                {item.title}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop actions */}
                    <div className='hidden md:flex items-center gap-x-3'>
                        {/* Theme Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className='text-foreground/70 hover:text-foreground'
                        >
                            {theme === 'dark' ? (
                                <Sun size={20} className='rotate-0 scale-100 transition-all' />
                            ) : (
                                <Moon size={20} className='rotate-0 scale-100 transition-all' />
                            )}
                        </Button>

                        {/* Search button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push('/groups/my-interest')}
                            className='text-foreground/70 hover:text-foreground'
                        >
                            <Search size={20} />
                        </Button>

                        {isSignedIn ? (
                            <div className='flex items-center gap-x-3'>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className='relative text-foreground/70 hover:text-foreground'>
                                            <Bell size={20} />
                                            <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center'>3</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className='w-64'>
                                        <DropdownMenuItem className='cursor-pointer'>
                                            <div className='flex flex-col'>
                                                <span className='font-medium'>New group invitation</span>
                                                <span className='text-sm text-muted-foreground'>2 minutes ago</span>
                                            </div>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className='cursor-pointer'>
                                            <div className='flex flex-col'>
                                                <span className='font-medium'>Group meeting scheduled</span>
                                                <span className='text-sm text-muted-foreground'>1 hour ago</span>
                                            </div>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className='cursor-pointer'>
                                            <div className='flex flex-col'>
                                                <span className='font-medium'>New message from admin</span>
                                                <span className='text-sm text-muted-foreground'>Yesterday</span>
                                            </div>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                <Button
                                    className='px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 transition-colors font-medium'
                                    onClick={() => router.push("/user/groups")}
                                >
                                    Dashboard
                                </Button>

                                <UserButton appearance={{
                                    elements: {
                                        avatarBox: 'h-9 w-9'
                                    }
                                }} />
                            </div>
                        ) : (
                            <div className='flex gap-x-2'>
                                <Button
                                    variant="outline"
                                    onClick={() => router.push("/sign-in")}
                                    className='text-foreground/80 hover:text-foreground'
                                >
                                    Sign In
                                </Button>
                                <Button
                                    onClick={() => router.push("/sign-up")}
                                    className='bg-primary hover:bg-primary/90 font-medium'
                                >
                                    Get Started
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
                                className='relative text-foreground/70 hover:text-foreground'
                            >
                                <Bell size={20} />
                                <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center'>3</span>
                            </Button>
                        )}

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className='text-foreground/70 hover:text-foreground'
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </Button>
                    </div>
                </div>

                {/* Mobile menu */}
                {isMobileMenuOpen && (
                    <div className='md:hidden bg-background shadow-lg'>
                        <div className='w-11/12 mx-auto py-4 flex flex-col gap-y-2'>
                            {NavbarTabs.map((item) => (
                                <Link
                                    href={item.path}
                                    key={item.id}
                                    className={`px-4 py-2.5 rounded-lg text-sm font-medium ${pathname === item.path
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-foreground/80 hover:bg-accent'
                                        }`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {item.title}
                                </Link>
                            ))}

                            <div className='pt-4 mt-2 border-t border-border'>
                                <div className='flex flex-col gap-y-2'>
                                    <Button
                                        variant="ghost"
                                        className='justify-start text-foreground/80 hover:text-foreground'
                                        onClick={() => {
                                            router.push('/groups/my-interest');
                                            setIsMobileMenuOpen(false);
                                        }}
                                    >
                                        <Search size={16} className='mr-2' />
                                        Search
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        className='justify-start text-foreground/80 hover:text-foreground'
                                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                    >
                                        {theme === 'dark' ? (
                                            <Sun size={16} className='mr-2' />
                                        ) : (
                                            <Moon size={16} className='mr-2' />
                                        )}
                                        {theme === 'dark' ? 'Light Theme' : 'Dark Theme'}
                                    </Button>

                                    {!isSignedIn ? (
                                        <>
                                            <Button
                                                variant="outline"
                                                className='mt-2'
                                                onClick={() => {
                                                    router.push("/sign-in");
                                                    setIsMobileMenuOpen(false);
                                                }}
                                            >
                                                Sign In
                                            </Button>
                                            <Button
                                                className='bg-primary hover:bg-primary/90'
                                                onClick={() => {
                                                    router.push("/sign-up");
                                                    setIsMobileMenuOpen(false);
                                                }}
                                            >
                                                Get Started
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button
                                                className='bg-primary hover:bg-primary/90'
                                                onClick={() => {
                                                    router.push("/groups");
                                                    setIsMobileMenuOpen(false);
                                                }}
                                            >
                                                Dashboard
                                            </Button>
                                            <div className='flex items-center justify-between pt-4'>
                                                <span className='text-sm text-foreground/80'>Account</span>
                                                <UserButton />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </nav>
            <div className="h-16"></div>
        </>
    )
}

export default Navbar