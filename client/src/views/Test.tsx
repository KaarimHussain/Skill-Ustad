"use client"

import type React from "react"

import Logo from "@/components/Logo"
import { Button } from "@/components/ui/button"
import { Menu, XIcon, BookOpen, Map, Trophy, DollarSign, Users, HelpCircle, MessageCircle } from "lucide-react"
import { motion } from "framer-motion"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/nav-sheet"
import { Link } from "react-router-dom"
import { TextAnimate } from "@/components/ui/text-animate"

function NavCard({
    to,
    icon: Icon,
    title,
    desc,
    className = "",
}: {
    to: string
    icon: React.ComponentType<any>
    title: string
    desc: string
    className?: string
}) {
    return (
        <Link
            to={to}
            className={`group block rounded-xl border p-4 bg-white/70 hover:bg-white transition-colors duration-200 ${className}`}
        >
            <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-indigo-100 transition-colors">
                    <Icon className="w-5 h-5 text-gray-700 group-hover:text-indigo-600" />
                </div>
                <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 group-hover:text-indigo-700 transition-colors">{title}</div>
                    <p className="text-xs text-gray-600 leading-relaxed">{desc}</p>
                </div>
            </div>
        </Link>
    )
}

export default function Test() {
    return (
        <div className="flex min-h-screen w-full flex-col bg-zinc-900 py-5 px-10">
            <nav className=" w-full sticky top-4 left-0 rounded-full flex items-center justify-between">
                <motion.div className="bg-white rounded-2xl w-auto p-2 flex items-center gap-2 transition-all duration-300">
                    <Logo height="h-14" width="w-14" logoOnly />
                </motion.div>
                <div className="flex gap-2 bg-secondary rounded-full p-2">
                    <Button variant="outline" className="rounded-full bg-transparent">
                        Login
                    </Button>
                    <Button className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-full">Get Started</Button>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button className="bg-indigo-500 hover:bg-indigo-600 rounded-full" size={"icon"}>
                                <Menu />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="top" className="max-h-dvh w-full overflow-y-auto p-0 gap-0">
                            <SheetHeader className="sticky top-0 z-10 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
                                <SheetTitle className="p-2 flex items-center justify-between">
                                    <Logo height="h-14" width="w-14" logoOnly />
                                    <div className="flex gap-2 items-center">
                                        <Button variant="outline" className="rounded-full bg-transparent">
                                            Login
                                        </Button>
                                        <Button className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-full">Get Started</Button>
                                        <SheetClose>
                                            <Button size={"icon"} variant="outline" className="rounded-full bg-transparent hover:bg-red-50">
                                                <XIcon />
                                            </Button>
                                        </SheetClose>
                                    </div>
                                </SheetTitle>
                            </SheetHeader>
                            <SheetDescription className="px-4 md:px-10 py-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                                    {/* Left column: big animated links */}
                                    <div className="flex flex-col">
                                        <Link to={"/"}>
                                            <TextAnimate
                                                animation="blurInUp"
                                                by="word"
                                                once
                                                duration={1}
                                                className="text-6xl md:text-7xl lg:text-8xl font-extralight hover:font-normal text-black hover:text-indigo-500 uppercase transition-all duration-300 cursor-pointer"
                                            >
                                                Home
                                            </TextAnimate>
                                        </Link>

                                        <Link to={"/features"}>
                                            <TextAnimate
                                                animation="blurInUp"
                                                by="word"
                                                once
                                                delay={0.2}
                                                duration={1.2}
                                                className="text-6xl md:text-7xl lg:text-8xl font-extralight hover:font-normal text-black hover:text-indigo-500 uppercase transition-all duration-300 cursor-pointer"
                                            >
                                                Features
                                            </TextAnimate>
                                        </Link>

                                        <Link to={"/community"}>
                                            <TextAnimate
                                                animation="blurInUp"
                                                by="word"
                                                once
                                                delay={0.4}
                                                duration={1.4}
                                                className="text-6xl md:text-7xl lg:text-8xl font-extralight hover:font-normal text-black hover:text-indigo-500 uppercase transition-all duration-300 cursor-pointer"
                                            >
                                                Community
                                            </TextAnimate>
                                        </Link>

                                        <Link to={"/ai-tools"}>
                                            <TextAnimate
                                                animation="blurInUp"
                                                by="word"
                                                once
                                                delay={0.6}
                                                duration={1.6}
                                                className="text-6xl md:text-7xl lg:text-8xl font-extralight hover:font-normal text-black hover:text-indigo-500 uppercase transition-all duration-300 cursor-pointer"
                                            >
                                                Ai-Tools
                                            </TextAnimate>
                                        </Link>
                                    </div>

                                    {/* Right column: detailed links in modern card UI */}
                                    <div className="space-y-10">
                                        {/* Features section (copied from original navbar links) */}
                                        <section aria-labelledby="features-heading" className="space-y-3">
                                            <div id="features-heading" className="flex items-center gap-2">
                                                <div className="p-1.5 rounded-md bg-indigo-100">
                                                    <BookOpen className="w-4 h-4 text-indigo-600" />
                                                </div>
                                                <h3 className="text-sm font-semibold text-gray-900">Features</h3>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <NavCard
                                                    to="/courses"
                                                    icon={BookOpen}
                                                    title="Courses"
                                                    desc="50+ comprehensive learning paths"
                                                    className="border-indigo-200/60"
                                                />
                                                <NavCard
                                                    to="/public/roadmaps"
                                                    icon={Map}
                                                    title="Roadmaps"
                                                    desc="Step-by-step learning paths"
                                                    className="border-gray-200/60"
                                                />
                                                <NavCard
                                                    to="/challenges"
                                                    icon={Trophy}
                                                    title="Challenges"
                                                    desc="Test your skills"
                                                    className="border-orange-200/60"
                                                />
                                                <NavCard
                                                    to="/blogs"
                                                    icon={BookOpen}
                                                    title="Blogs"
                                                    desc="Articles, tutorials, insights"
                                                    className="border-amber-200/60"
                                                />
                                                <NavCard
                                                    to="/jobs"
                                                    icon={DollarSign}
                                                    title="Jobs"
                                                    desc="Find your dream role"
                                                    className="border-cyan-200/60"
                                                />
                                            </div>
                                        </section>

                                        {/* Community section (copied from original navbar links) */}
                                        <section aria-labelledby="community-heading" className="space-y-3">
                                            <div id="community-heading" className="flex items-center gap-2">
                                                <div className="p-1.5 rounded-md bg-emerald-100">
                                                    <Users className="w-4 h-4 text-emerald-600" />
                                                </div>
                                                <h3 className="text-sm font-semibold text-gray-900">Community</h3>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <NavCard
                                                    to="/community"
                                                    icon={Users}
                                                    title="Community Hub"
                                                    desc="Connect with 50,000+ learners"
                                                    className="border-emerald-200/60"
                                                />
                                                <NavCard
                                                    to="/public/roadmaps"
                                                    icon={Map}
                                                    title="Community Roadmaps"
                                                    desc="Member-created learning paths"
                                                    className="border-gray-200/60"
                                                />
                                                <NavCard
                                                    to="/community/forums"
                                                    icon={MessageCircle}
                                                    title="Discussion Forums"
                                                    desc="Ask questions & share knowledge"
                                                    className="border-gray-200/60"
                                                />
                                                <NavCard
                                                    to="/qa"
                                                    icon={HelpCircle}
                                                    title="Q&A Hub"
                                                    desc="AI + experts answering questions"
                                                    className="border-violet-200/60"
                                                />
                                            </div>
                                        </section>
                                    </div>
                                </div>
                            </SheetDescription>
                            {/* <SheetFooter>
                                <div className="flex flex-col gap-4 w-fit">
                                    <Button variant="outline" className="rounded-full w-full bg-transparent">
                                        Login
                                    </Button>
                                    <Button className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-full w-full">
                                        Get Started
                                    </Button>
                                </div>
                            </SheetFooter> */}
                        </SheetContent>
                    </Sheet>
                </div>
            </nav>
        </div>
    )
}
