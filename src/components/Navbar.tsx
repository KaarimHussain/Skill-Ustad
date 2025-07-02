"use client"
import { Link } from "react-router-dom"
import { BookOpen, Brain, HelpCircle, Map, MapPin, Menu, MessageCircle, MessageSquare, Sparkle, Target, Trophy, UserCheck, Users } from "lucide-react"
import navStyle from "../css/Navbar.module.css";
import clsx from "clsx";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
    Sheet,
    SheetContent,
    SheetTrigger
} from "./ui/sheet"
import { useState } from "react";
import { Button } from "./ui/button"

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    return (
        <div className={clsx(navStyle.nav, navStyle.navbarFade)} >
            <nav className="flex items-center justify-between py-4 lg:px-50 md:px-30 sm-px-5 bg-black/10">
                <div className="flex items-center gap-2">
                    <Sparkle className="text-white" />
                    <h1 className="font-light text-2xl text-white ">Skill-Ustad</h1>
                </div>
                <div className="md:hidden sm:hidden lg:block hidden">
                    <NavigationMenu viewport={false}>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuLink className="bg-transparent">
                                    <Button className="bg-transparent text-white hover:text-zinc-500 hover:bg-transparent rounded-full">
                                        Home
                                    </Button>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>
                                    <Button className="bg-transparent text-white hover:text-zinc-500 hover:bg-transparent rounded-full">
                                        Features
                                    </Button>
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid gap-3 md:w-[450px] lg:w-[550px] lg:grid-cols-[1fr_.8fr] bg-black p-4 rounded-2xl">
                                        {/* Main Highlight - Courses */}
                                        <li className="row-span-3">
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    to="/courses"
                                                    className="transition-all ease-in-out flex h-full w-full flex-col justify-end rounded-xl bg-gradient-to-br from-indigo-900/50 to-purple-900/50 hover:from-indigo-800/60 hover:to-purple-800/60 p-6 no-underline outline-hidden select-none focus:shadow-md border border-indigo-500/20 hover:border-indigo-400/30 group relative overflow-hidden"
                                                >
                                                    {/* Background gradient effect */}
                                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                                    <div className="relative z-10">
                                                        <div className="p-2 bg-indigo-500/20 rounded-lg w-fit mb-4 group-hover:bg-indigo-500/30 transition-colors">
                                                            <BookOpen className="w-6 h-6 text-indigo-400" />
                                                        </div>
                                                        <h1 className="mt-4 mb-2 font-bold text-white/90 text-2xl group-hover:text-white transition-colors">
                                                            Courses
                                                        </h1>
                                                        <p className="text-zinc-400 text-sm leading-relaxed group-hover:text-zinc-300 transition-colors">
                                                            Comprehensive learning paths with hands-on projects, AI assistance, and expert mentorship
                                                        </p>
                                                        <div className="mt-4 flex items-center gap-2 text-xs text-indigo-400">
                                                            <span>50+ Courses Available</span>
                                                            <div className="w-1 h-1 bg-indigo-400 rounded-full"></div>
                                                            <span>New courses weekly</span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </NavigationMenuLink>
                                        </li>

                                        {/* Roadmaps */}
                                        <li>
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    to="/roadmaps"
                                                    className="block p-4 rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-800 hover:from-zinc-800 hover:to-zinc-700 border border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-200 group"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                                                            <Map className="w-5 h-5 text-blue-400" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="font-medium text-white text-sm mb-1 group-hover:text-blue-100 transition-colors">
                                                                Roadmaps
                                                            </div>
                                                            <p className="text-zinc-400 text-xs leading-relaxed">
                                                                Step-by-step learning paths tailored to your career goals and skill level
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </NavigationMenuLink>
                                        </li>

                                        {/* Challenges */}
                                        <li>
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    to="/challenges"
                                                    className="block p-4 rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-800 hover:from-zinc-800 hover:to-zinc-700 border border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-200 group"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="p-2 bg-orange-500/20 rounded-lg group-hover:bg-orange-500/30 transition-colors">
                                                            <Trophy className="w-5 h-5 text-orange-400" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="font-medium text-white text-sm mb-1 group-hover:text-orange-100 transition-colors">
                                                                Challenges
                                                            </div>
                                                            <p className="text-zinc-400 text-xs leading-relaxed">
                                                                Test your skills with coding challenges and real-world problem-solving tasks
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </NavigationMenuLink>
                                        </li>

                                        {/* Advisor */}
                                        <li>
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    to="/advisor"
                                                    className="block p-4 rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-800 hover:from-zinc-800 hover:to-zinc-700 border border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-200 group"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="p-2 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors">
                                                            <UserCheck className="w-5 h-5 text-green-400" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="font-medium text-white text-sm mb-1 group-hover:text-green-100 transition-colors">
                                                                Advisor
                                                            </div>
                                                            <p className="text-zinc-400 text-xs leading-relaxed">
                                                                Get personalized guidance from industry experts and career mentors
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </NavigationMenuLink>
                                        </li>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>
                                    <Button className="bg-transparent text-white hover:text-zinc-500 hover:bg-transparent rounded-full">
                                        Community
                                    </Button>
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid gap-3 md:w-[400px] lg:w-[500px] lg:grid-cols-[1fr_.8fr] bg-black p-4 rounded-2xl">
                                        {/* Main Highlight - Community */}
                                        <li className="row-span-2">
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    to="/community"
                                                    className="transition-all ease-in-out flex h-full w-full flex-col justify-end rounded-xl bg-gradient-to-br from-emerald-900/50 to-teal-900/50 hover:from-emerald-800/60 hover:to-teal-800/60 p-6 no-underline outline-hidden select-none focus:shadow-md border border-emerald-500/20 hover:border-emerald-400/30 group relative overflow-hidden"
                                                >
                                                    {/* Background gradient effect */}
                                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                                    <div className="relative z-10">
                                                        <div className="p-2 bg-emerald-500/20 rounded-lg w-fit mb-4 group-hover:bg-emerald-500/30 transition-colors">
                                                            <Users className="w-6 h-6 text-emerald-400" />
                                                        </div>
                                                        <h1 className="mt-4 mb-2 font-bold text-white/90 text-2xl group-hover:text-white transition-colors">
                                                            Community
                                                        </h1>
                                                        <p className="text-zinc-400 text-sm leading-relaxed group-hover:text-zinc-300 transition-colors">
                                                            Connect with 50,000+ learners, share projects, get help, and grow together in our
                                                            supportive community
                                                        </p>
                                                        <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400">
                                                            <span>24/7 Active Support</span>
                                                            <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
                                                            <span>1,200+ online now</span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </NavigationMenuLink>
                                        </li>

                                        {/* Community Roadmaps */}
                                        <li>
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    to="/community/roadmaps"
                                                    className="block p-4 rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-800 hover:from-zinc-800 hover:to-zinc-700 border border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-200 group"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="p-2 bg-cyan-500/20 rounded-lg group-hover:bg-cyan-500/30 transition-colors">
                                                            <MapPin className="w-5 h-5 text-cyan-400" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="font-medium text-white text-sm mb-1 group-hover:text-cyan-100 transition-colors">
                                                                Community Roadmaps
                                                            </div>
                                                            <p className="text-zinc-400 text-xs leading-relaxed">
                                                                Discover learning paths created and shared by our community members
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </NavigationMenuLink>
                                        </li>

                                        {/* Discussion Forums */}
                                        <li>
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    to="/community/forums"
                                                    className="block p-4 rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-800 hover:from-zinc-800 hover:to-zinc-700 border border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-200 group"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                                                            <MessageCircle className="w-5 h-5 text-purple-400" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="font-medium text-white text-sm mb-1 group-hover:text-purple-100 transition-colors">
                                                                Discussion Forums
                                                            </div>
                                                            <p className="text-zinc-400 text-xs leading-relaxed">
                                                                Ask questions, share knowledge, and participate in tech discussions
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </NavigationMenuLink>
                                        </li>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>
                                    <Button className="bg-transparent text-white hover:text-zinc-500 hover:bg-transparent rounded-full">
                                        AI
                                    </Button>
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid gap-3 w-[400px] bg-black p-4 rounded-2xl">
                                        {/* Header */}
                                        <li className="mb-2">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="p-1.5 bg-indigo-500/20 rounded-lg">
                                                    <Brain className="w-4 h-4 text-indigo-400" />
                                                </div>
                                                <h3 className="font-semibold text-white text-sm">AI-Powered Tools</h3>
                                            </div>
                                            <p className="text-zinc-400 text-xs leading-relaxed">
                                                Leverage artificial intelligence to accelerate your learning journey
                                            </p>
                                        </li>

                                        {/* Interview Simulator */}
                                        <li>
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    to="/ai/interview-simulator"
                                                    className="block p-4 rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-800 hover:from-zinc-800 hover:to-zinc-700 border border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-200 group"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                                                            <MessageSquare className="w-5 h-5 text-blue-400" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="font-medium text-white text-sm mb-1 group-hover:text-blue-100 transition-colors">
                                                                Interview Simulator
                                                            </div>
                                                            <p className="text-zinc-400 text-xs leading-relaxed">
                                                                Practice real interviews with AI feedback and personalized improvement tips
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </NavigationMenuLink>
                                        </li>

                                        {/* AI Quiz Taker */}
                                        <li>
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    to="/ai/quiz-taker"
                                                    className="block p-4 rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-800 hover:from-zinc-800 hover:to-zinc-700 border border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-200 group"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="p-2 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors">
                                                            <HelpCircle className="w-5 h-5 text-green-400" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="font-medium text-white text-sm mb-1 group-hover:text-green-100 transition-colors">
                                                                AI Quiz Taker
                                                            </div>
                                                            <p className="text-zinc-400 text-xs leading-relaxed">
                                                                Generate adaptive quizzes that adjust to your skill level and learning pace
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </NavigationMenuLink>
                                        </li>

                                        {/* Career Suggestion */}
                                        <li>
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    to="/ai/career-suggestion"
                                                    className="block p-4 rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-800 hover:from-zinc-800 hover:to-zinc-700 border border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-200 group"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                                                            <Target className="w-5 h-5 text-purple-400" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="font-medium text-white text-sm mb-1 group-hover:text-purple-100 transition-colors">
                                                                Career Suggestion
                                                            </div>
                                                            <p className="text-zinc-400 text-xs leading-relaxed">
                                                                Get personalized career recommendations based on your skills and interests
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </NavigationMenuLink>
                                        </li>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
                <div className="flex gap-2" >
                    <Button className="bg-transparent hover:bg-indigo-800/15 text-white hover:text-indigo-200 md:hidden sm:hidden lg:block hidden">
                        Login
                    </Button>
                    <Button className="bg-indigo-500 hover:bg-indigo-600 text-white">
                        Get Started
                    </Button>
                    {/* Mobile Menu Button */}
                    <div className="lg:hidden">
                        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[320px] z-[110] bg-black/95 backdrop-blur-3xl border-zinc-700/50 p-3">
                                <div className="flex flex-col h-full">
                                    {/* Mobile Header */}
                                    <div className="flex items-center justify-between pb-6 border-b border-zinc-700/50">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                                                <Sparkle className="text-white w-5 h-5" />
                                            </div>
                                            <span className="font-light text-xl text-white">Skill-Ustad</span>
                                        </div>
                                    </div>

                                    {/* Mobile Navigation Content */}
                                    <div className="flex-1 py-6 space-y-8 overflow-y-auto">
                                        {/* Main Navigation */}
                                        <div>
                                            <h3 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-4 px-2">
                                                Navigation
                                            </h3>
                                            <div className="space-y-2">
                                                <Link
                                                    to="/"
                                                    className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-zinc-900/50 to-zinc-800/50 hover:from-zinc-800/60 hover:to-zinc-700/60 border border-zinc-700/30 hover:border-zinc-600/50 transition-all duration-200 group"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                    <div className="p-2 bg-indigo-500/20 rounded-lg group-hover:bg-indigo-500/30 transition-colors">
                                                        <Sparkle className="w-4 h-4 text-indigo-400" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-white text-sm">Home</div>
                                                        <div className="text-zinc-400 text-xs">Back to homepage</div>
                                                    </div>
                                                </Link>
                                            </div>
                                        </div>

                                        {/* Features Section */}
                                        <div>
                                            <h3 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-4 px-2">Features</h3>
                                            <div className="space-y-2">
                                                <Link
                                                    to="/courses"
                                                    className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-500/20 hover:border-indigo-400/40 transition-all duration-200 group"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                    <div className="p-2 bg-indigo-500/20 rounded-lg group-hover:bg-indigo-500/30 transition-colors">
                                                        <BookOpen className="w-4 h-4 text-indigo-400" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-medium text-white text-sm">Courses</div>
                                                        <div className="text-zinc-400 text-xs">50+ comprehensive learning paths</div>
                                                    </div>
                                                    <div className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-full">Popular</div>
                                                </Link>

                                                <Link
                                                    to="/roadmaps"
                                                    className="flex items-center gap-3 p-4 rounded-xl bg-zinc-900/50 hover:bg-zinc-800/60 border border-zinc-700/30 hover:border-zinc-600/50 transition-all duration-200 group"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                    <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                                                        <Map className="w-4 h-4 text-blue-400" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-white text-sm">Roadmaps</div>
                                                        <div className="text-zinc-400 text-xs">Step-by-step learning paths</div>
                                                    </div>
                                                </Link>

                                                <Link
                                                    to="/challenges"
                                                    className="flex items-center gap-3 p-4 rounded-xl bg-zinc-900/50 hover:bg-zinc-800/60 border border-zinc-700/30 hover:border-zinc-600/50 transition-all duration-200 group"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                    <div className="p-2 bg-orange-500/20 rounded-lg group-hover:bg-orange-500/30 transition-colors">
                                                        <Trophy className="w-4 h-4 text-orange-400" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-white text-sm">Challenges</div>
                                                        <div className="text-zinc-400 text-xs">Test your skills</div>
                                                    </div>
                                                </Link>

                                                <Link
                                                    to="/advisor"
                                                    className="flex items-center gap-3 p-4 rounded-xl bg-zinc-900/50 hover:bg-zinc-800/60 border border-zinc-700/30 hover:border-zinc-600/50 transition-all duration-200 group"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                    <div className="p-2 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors">
                                                        <UserCheck className="w-4 h-4 text-green-400" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-white text-sm">Advisor</div>
                                                        <div className="text-zinc-400 text-xs">Expert guidance</div>
                                                    </div>
                                                </Link>
                                            </div>
                                        </div>

                                        {/* AI Tools Section */}
                                        <div>
                                            <h3 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-4 px-2 flex items-center gap-2">
                                                <Brain className="w-3 h-3" />
                                                AI Tools
                                            </h3>
                                            <div className="space-y-2">
                                                <Link
                                                    to="/ai/interview-simulator"
                                                    className="flex items-center gap-3 p-4 rounded-xl bg-zinc-900/50 hover:bg-zinc-800/60 border border-zinc-700/30 hover:border-zinc-600/50 transition-all duration-200 group"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                    <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                                                        <MessageSquare className="w-4 h-4 text-blue-400" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-white text-sm">Interview Simulator</div>
                                                        <div className="text-zinc-400 text-xs">Practice with AI feedback</div>
                                                    </div>
                                                </Link>

                                                <Link
                                                    to="/ai/quiz-taker"
                                                    className="flex items-center gap-3 p-4 rounded-xl bg-zinc-900/50 hover:bg-zinc-800/60 border border-zinc-700/30 hover:border-zinc-600/50 transition-all duration-200 group"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                    <div className="p-2 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors">
                                                        <HelpCircle className="w-4 h-4 text-green-400" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-white text-sm">AI Quiz Taker</div>
                                                        <div className="text-zinc-400 text-xs">Adaptive learning quizzes</div>
                                                    </div>
                                                </Link>

                                                <Link
                                                    to="/ai/career-suggestion"
                                                    className="flex items-center gap-3 p-4 rounded-xl bg-zinc-900/50 hover:bg-zinc-800/60 border border-zinc-700/30 hover:border-zinc-600/50 transition-all duration-200 group"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                    <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                                                        <Target className="w-4 h-4 text-purple-400" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-white text-sm">Career Suggestion</div>
                                                        <div className="text-zinc-400 text-xs">Personalized career paths</div>
                                                    </div>
                                                </Link>
                                            </div>
                                        </div>

                                        {/* Community Section */}
                                        <div>
                                            <h3 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-4 px-2 flex items-center gap-2">
                                                <Users className="w-3 h-3" />
                                                Community
                                            </h3>
                                            <div className="space-y-2">
                                                <Link
                                                    to="/community"
                                                    className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-200 group"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                    <div className="p-2 bg-emerald-500/20 rounded-lg group-hover:bg-emerald-500/30 transition-colors">
                                                        <Users className="w-4 h-4 text-emerald-400" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-medium text-white text-sm">Community Hub</div>
                                                        <div className="text-zinc-400 text-xs">Connect with 50,000+ learners</div>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                                        <span className="text-xs text-green-400">Live</span>
                                                    </div>
                                                </Link>

                                                <Link
                                                    to="/community/roadmaps"
                                                    className="flex items-center gap-3 p-4 rounded-xl bg-zinc-900/50 hover:bg-zinc-800/60 border border-zinc-700/30 hover:border-zinc-600/50 transition-all duration-200 group"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                    <div className="p-2 bg-cyan-500/20 rounded-lg group-hover:bg-cyan-500/30 transition-colors">
                                                        <MapPin className="w-4 h-4 text-cyan-400" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-white text-sm">Community Roadmaps</div>
                                                        <div className="text-zinc-400 text-xs">Member-created learning paths</div>
                                                    </div>
                                                </Link>

                                                <Link
                                                    to="/community/forums"
                                                    className="flex items-center gap-3 p-4 rounded-xl bg-zinc-900/50 hover:bg-zinc-800/60 border border-zinc-700/30 hover:border-zinc-600/50 transition-all duration-200 group"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                    <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                                                        <MessageCircle className="w-4 h-4 text-purple-400" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-white text-sm">Discussion Forums</div>
                                                        <div className="text-zinc-400 text-xs">Ask questions & share knowledge</div>
                                                    </div>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mobile Auth Buttons */}
                                    <div className="border-t border-zinc-700/50 pt-6 space-y-3">
                                        <Button
                                            className="w-full bg-transparent hover:bg-indigo-800/15 text-white hover:text-indigo-200 border border-zinc-700/50 hover:border-indigo-500/30 py-3 rounded-xl transition-all duration-200"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-2 h-2 bg-zinc-400 rounded-full"></div>
                                                <span>Sign In</span>
                                            </div>
                                        </Button>
                                        <Button
                                            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-indigo-500/25"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <div className="flex items-center justify-center gap-2">
                                                <Sparkle className="w-4 h-4" />
                                                <span>Get Started Free</span>
                                            </div>
                                        </Button>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>

            </nav>
        </div>
    )
}
