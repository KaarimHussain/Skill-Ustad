"use client"

import { Link, useNavigate } from "react-router-dom"
import {
    BookOpen,
    Brain,
    HelpCircle,
    Map,
    MapPin,
    Menu,
    MessageCircle,
    MessageSquare,
    Sparkle,
    Target,
    Trophy,
    UserCheck,
    Users,
    LogOut,
    LayoutDashboard,
    User,
    TriangleAlert,
} from "lucide-react"
import navStyle from "../css/Navbar.module.css"
import clsx from "clsx"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { useState, useCallback, memo, useEffect } from "react"
import { Button } from "./ui/button"
import Logo from "./Logo"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import AuthService from "@/services/auth.service"
import { useAuth } from "@/context/AuthContext"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"

// Memoized navigation item component to prevent unnecessary re-renders
const NavigationItem = memo(
    ({
        to,
        icon: Icon,
        title,
        description,
        className = "",
        onClick,
        badge,
        isLive = false,
    }: {
        to: string
        icon: any
        title: string
        description: string
        className?: string
        onClick?: () => void
        badge?: string
        isLive?: boolean
    }) => (
        <Link
            to={to}
            className={`flex items-center gap-3 p-4 rounded-xl transition-all duration-200 group ${className}`}
            onClick={onClick}
        >
            <div className="p-2 rounded-lg transition-colors">
                <Icon className="w-4 h-4 text-gray-700" />
            </div>
            <div className="flex-1">
                <div className="font-medium text-gray-900 text-sm">{title}</div>
                <div className="text-gray-600 text-xs">{description}</div>
            </div>
            {badge && <div className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">{badge}</div>}
            {isLive && (
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600">Live</span>
                </div>
            )}
        </Link>
    ),
)

// Memoized desktop navigation menu content
const DesktopNavigationContent = memo(
    () => (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuLink className="bg-transparent p-0 m-0 border-none hover:bg-transparent">
                        <Link to={"/"}>
                            <Button className="py-3 border-none bg-transparent shadow-transparent text-gray-700 hover:text-gray-900 hover:bg-gray-100/50 rounded-full cursor-pointer">
                                Home
                            </Button>
                        </Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent p-0 m-0 border-none hover:bg-transparent">
                        <Button className="py-3 border-none bg-transparent shadow-transparent text-gray-700 hover:text-gray-900 hover:bg-gray-100/50 rounded-full cursor-pointer">
                            Features
                        </Button>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="bg-white">
                        <ul className="grid gap-3 md:w-[450px] lg:w-[550px] lg:grid-cols-[1fr_.8fr] bg-white p-4 rounded-2xl shadow-xl shadow-gray-200/50">
                            <li className="row-span-3">
                                <NavigationMenuLink asChild>
                                    <Link
                                        to="/courses"
                                        className="transition-all ease-in-out flex h-full w-full flex-col justify-end rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 p-6 no-underline outline-hidden select-none focus:shadow-md border border-indigo-200/50 hover:border-indigo-300/60 group relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/20 to-purple-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="relative z-10">
                                            <div className="p-2 bg-indigo-100 rounded-lg w-fit mb-4 group-hover:bg-indigo-200 transition-colors">
                                                <BookOpen className="w-6 h-6 text-indigo-600" />
                                            </div>
                                            <h1 className="mt-4 mb-2 font-bold text-gray-900 text-2xl group-hover:text-gray-800 transition-colors">
                                                Courses
                                            </h1>
                                            <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors">
                                                Comprehensive learning paths with hands-on projects, AI assistance, and expert mentorship
                                            </p>
                                            <div className="mt-4 flex items-center gap-2 text-xs text-indigo-600">
                                                <span>50+ Courses Available</span>
                                                <div className="w-1 h-1 bg-indigo-600 rounded-full"></div>
                                                <span>New courses weekly</span>
                                            </div>
                                        </div>
                                    </Link>
                                </NavigationMenuLink>
                            </li>
                            <li>
                                <NavigationMenuLink asChild>
                                    <Link
                                        to="/public/roadmaps"
                                        className="block p-4 rounded-xl bg-blue-50/60 hover:bg-blue-100/80 border border-gray-200/60 hover:border-gray-300/60 transition-all duration-200 group backdrop-blur-sm"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                                                <Map className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-900 text-sm mb-1 group-hover:text-blue-800 transition-colors">
                                                    Roadmaps
                                                </div>
                                                <p className="text-gray-600 text-xs leading-relaxed">
                                                    Step-by-step learning paths tailored to your career goals and skill level
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                </NavigationMenuLink>
                            </li>
                            <li>
                                <NavigationMenuLink asChild>
                                    <Link
                                        to="/challenges"
                                        className="block p-4 rounded-xl bg-orange-50/60 hover:bg-orange-100/60 border border-orange-200/60 hover:border-orange-300/60 transition-all duration-200 group backdrop-blur-sm"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                                                <Trophy className="w-5 h-5 text-orange-600" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-900 text-sm mb-1 group-hover:text-orange-800 transition-colors">
                                                    Challenges
                                                </div>
                                                <p className="text-gray-600 text-xs leading-relaxed">
                                                    Test your skills with coding challenges and real-world problem-solving tasks
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                </NavigationMenuLink>
                            </li>
                            <li>
                                <NavigationMenuLink asChild>
                                    <Link
                                        to="/advisor"
                                        className="block p-4 rounded-xl bg-green-50/60 hover:bg-green-100/60 border border-green-200/60 hover:border-green-300/60 transition-all duration-200 group backdrop-blur-sm"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                                                <UserCheck className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-900 text-sm mb-1 group-hover:text-green-800 transition-colors">
                                                    Advisor
                                                </div>
                                                <p className="text-gray-600 text-xs leading-relaxed">
                                                    Get personalized guidance from industry experts and career mentors
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                </NavigationMenuLink>
                            </li>
                            <li className="row-span-2 col-span-2">
                                <NavigationMenuLink asChild>
                                    <Link
                                        to="/blogs"
                                        className="block p-4 rounded-xl bg-amber-50/60 hover:bg-amber-100/80 border border-amber-200/60 hover:border-amber-300/60 transition-all duration-200 group backdrop-blur-sm"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition-colors">
                                                <BookOpen className="w-5 h-5 text-amber-600" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-900 text-sm mb-1 group-hover:text-amber-800 transition-colors">
                                                    Blogs
                                                </div>
                                                <p className="text-gray-600 text-xs leading-relaxed">
                                                    Discover insightful articles, tutorials, and industry insights from experts and community members
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
                    <NavigationMenuTrigger className="bg-transparent p-0 m-0 border-none hover:bg-transparent">
                        <Button className="py-3 border-none bg-transparent shadow-transparent text-gray-700 hover:text-gray-900 hover:bg-gray-100/50 rounded-full cursor-pointer">
                            Community
                        </Button>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="bg-white">
                        <ul className="grid gap-3 md:w-[400px] lg:w-[500px] lg:grid-cols-[1fr_.8fr] bg-white p-4 rounded-2xl">
                            <li className="row-span-2">
                                <NavigationMenuLink asChild>
                                    <Link
                                        to="/community"
                                        className="transition-all ease-in-out flex h-full w-full flex-col justify-end rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 p-6 no-underline outline-hidden select-none focus:shadow-md border border-emerald-200/50 hover:border-emerald-300/60 group relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/20 to-teal-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="relative z-10">
                                            <div className="p-2 bg-emerald-100 rounded-lg w-fit mb-4 group-hover:bg-emerald-200 transition-colors">
                                                <Users className="w-6 h-6 text-emerald-600" />
                                            </div>
                                            <h1 className="mt-4 mb-2 font-bold text-gray-900 text-2xl group-hover:text-gray-800 transition-colors">
                                                Community
                                            </h1>
                                            <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors">
                                                Connect with 50,000+ learners, share projects, get help, and grow together in our supportive
                                                community
                                            </p>
                                            <div className="mt-4 flex items-center gap-2 text-xs text-emerald-600">
                                                <span>24/7 Active Support</span>
                                                <div className="w-1 h-1 bg-emerald-600 rounded-full"></div>
                                                <span>1,200+ online now</span>
                                            </div>
                                        </div>
                                    </Link>
                                </NavigationMenuLink>
                            </li>
                            <li>
                                <NavigationMenuLink asChild>
                                    <Link
                                        to="/community/roadmaps"
                                        className="block p-4 rounded-xl bg-cyan-50/60 hover:bg-cyan-100/60 border border-cyan-200/60 hover:border-cyan-300/60 transition-all duration-200 group backdrop-blur-sm"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-cyan-100 rounded-lg group-hover:bg-cyan-200 transition-colors">
                                                <MapPin className="w-5 h-5 text-cyan-600" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-900 text-sm mb-1 group-hover:text-cyan-800 transition-colors">
                                                    Community Roadmaps
                                                </div>
                                                <p className="text-gray-600 text-xs leading-relaxed">
                                                    Discover learning paths created and shared by our community members
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                </NavigationMenuLink>
                            </li>
                            <li>
                                <NavigationMenuLink asChild>
                                    <Link
                                        to="/community/forums"
                                        className="block p-4 rounded-xl bg-purple-50/60 hover:bg-purple-100/60 border border-purple-200/60 hover:border-purple-300/60 transition-all duration-200 group backdrop-blur-sm"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                                                <MessageCircle className="w-5 h-5 text-purple-600" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-900 text-sm mb-1 group-hover:text-purple-800 transition-colors">
                                                    Discussion Forums
                                                </div>
                                                <p className="text-gray-600 text-xs leading-relaxed">
                                                    Ask questions, share knowledge, and participate in tech discussions
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                </NavigationMenuLink>
                            </li>
                            <li className="row-span-2 col-span-2">
                                <NavigationMenuLink asChild>
                                    <Link
                                        to="/qa"
                                        className="block p-4 rounded-xl bg-violet-50/60 hover:bg-violet-100/60 border border-violet-200/60 hover:border-violet-300/60 transition-all duration-200 group backdrop-blur-sm"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-violet-100 rounded-lg group-hover:bg-violet-200 transition-colors">
                                                <HelpCircle className="w-5 h-5 text-violet-600" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-900 text-sm mb-1 group-hover:text-violet-800 transition-colors">
                                                    Q&A Hub
                                                </div>
                                                <p className="text-gray-600 text-xs leading-relaxed">
                                                    Get instant answers to your coding questions from our AI assistant and community experts
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
                    <NavigationMenuLink className="bg-transparent p-0 m-0 border-none hover:bg-transparent">
                        <Link to={"/ai/tools"}>
                            <Button className="py-3 border-none bg-transparent shadow-transparent text-gray-700 hover:text-gray-900 hover:bg-gray-100/50 rounded-full cursor-pointer">
                                AI Tools
                            </Button>
                        </Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    ),
)

// Memoized mobile menu content
const MobileMenuContent = memo(
    ({
        onClose,
        isAuthenticated,
        userType,
        handleLogout,
    }: { onClose: () => void; isAuthenticated: boolean; userType: string | null; handleLogout: () => void }) => {
        const handleLinkClick = useCallback(() => {
            onClose()
        }, [onClose])

        return (
            <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="flex items-center justify-between pb-6 border-b border-gray-200/60">
                    <div className="flex items-center gap-2">
                        <Logo />
                    </div>
                </div>

                {/* Mobile Navigation Content */}
                <div className="flex-1 py-6 space-y-8 overflow-y-auto">
                    {/* Main Navigation */}
                    <div>
                        <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-4 px-2">Navigation</h3>
                        <div className="space-y-2">
                            <NavigationItem
                                to="/"
                                icon={Sparkle}
                                title="Home"
                                description="Back to homepage"
                                className="bg-gray-100/60 hover:bg-gray-200/60 border border-gray-200/60 hover:border-gray-300/60"
                                onClick={handleLinkClick}
                            />
                            {isAuthenticated && (
                                <NavigationItem
                                    to={AuthService.getRedirectUrl(userType || "student")}
                                    icon={LayoutDashboard}
                                    title="Dashboard"
                                    description={`Your ${userType || "User"} Dashboard`}
                                    className="bg-indigo-50/60 hover:bg-indigo-100/60 border border-indigo-200/60 hover:border-indigo-300/60"
                                    onClick={handleLinkClick}
                                />
                            )}
                        </div>
                    </div>

                    {/* Features Section */}
                    <div>
                        <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-4 px-2">Features</h3>
                        <div className="space-y-2">
                            <NavigationItem
                                to="/courses"
                                icon={BookOpen}
                                title="Courses"
                                description="50+ comprehensive learning paths"
                                className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200/60 hover:border-indigo-300/60"
                                onClick={handleLinkClick}
                            />
                            <NavigationItem
                                to="/roadmaps"
                                icon={Map}
                                title="Roadmaps"
                                description="Step-by-step learning paths"
                                className="bg-gray-100/60 hover:bg-gray-200/60 border border-gray-200/60 hover:border-gray-300/60"
                                onClick={handleLinkClick}
                            />
                            <NavigationItem
                                to="/challenges"
                                icon={Trophy}
                                title="Challenges"
                                description="Test your skills"
                                className="bg-gray-100/60 hover:bg-gray-200/60 border border-gray-200/60 hover:border-gray-300/60"
                                onClick={handleLinkClick}
                            />
                            <NavigationItem
                                to="/advisor"
                                icon={UserCheck}
                                title="Advisor"
                                description="Expert guidance"
                                className="bg-gray-100/60 hover:bg-gray-200/60 border border-gray-200/60 hover:border-gray-300/60"
                                onClick={handleLinkClick}
                            />
                        </div>
                    </div>

                    {/* AI Tools Section */}
                    <div>
                        <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-4 px-2 flex items-center gap-2">
                            <Brain className="w-3 h-3" />
                            AI Tools
                        </h3>
                        <div className="space-y-2">
                            <NavigationItem
                                to="/ai/interview-simulator"
                                icon={MessageSquare}
                                title="Interview Simulator"
                                description="Practice with AI feedback"
                                className="bg-gray-100/60 hover:bg-gray-200/60 border border-gray-200/60 hover:border-gray-300/60"
                                onClick={handleLinkClick}
                            />
                            <NavigationItem
                                to="/ai/quiz-taker"
                                icon={HelpCircle}
                                title="AI Quiz Taker"
                                description="Adaptive learning quizzes"
                                className="bg-gray-100/60 hover:bg-gray-200/60 border border-gray-200/60 hover:border-gray-300/60"
                                onClick={handleLinkClick}
                            />
                            <NavigationItem
                                to="/ai/career-suggestion"
                                icon={Target}
                                title="Career Suggestion"
                                description="Personalized career paths"
                                className="bg-gray-100/60 hover:bg-gray-200/60 border border-gray-200/60 hover:border-gray-300/60"
                                onClick={handleLinkClick}
                            />
                        </div>
                    </div>

                    {/* Community Section */}
                    <div>
                        <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-4 px-2 flex items-center gap-2">
                            <Users className="w-3 h-3" />
                            Community
                        </h3>
                        <div className="space-y-2">
                            <NavigationItem
                                to="/community"
                                icon={Users}
                                title="Community Hub"
                                description="Connect with 50,000+ learners"
                                className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/60 hover:border-emerald-300/60"
                                onClick={handleLinkClick}
                            />
                            <NavigationItem
                                to="/community/roadmaps"
                                icon={MapPin}
                                title="Community Roadmaps"
                                description="Member-created learning paths"
                                className="bg-gray-100/60 hover:bg-gray-200/60 border border-gray-200/60 hover:border-gray-300/60"
                                onClick={handleLinkClick}
                            />
                            <NavigationItem
                                to="/community/forums"
                                icon={MessageCircle}
                                title="Discussion Forums"
                                description="Ask questions & share knowledge"
                                className="bg-gray-100/60 hover:bg-gray-200/60 border border-gray-200/60 hover:border-gray-300/60"
                                onClick={handleLinkClick}
                            />
                        </div>
                    </div>
                </div>

                {/* Mobile Auth Buttons */}
                <div className="border-t border-gray-200/60 pt-6 space-y-3">
                    {isAuthenticated ? (
                        <Button
                            className="cursor-pointer w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-indigo-200/50"
                            onClick={() => {
                                handleLogout()
                                handleLinkClick() // Close menu after logout
                            }}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <LogOut className="w-4 h-4" />
                                <span>Logout</span>
                            </div>
                        </Button>
                    ) : (
                        <>
                            <Link to={"/login"} className="w-full">
                                <Button
                                    className="cursor-pointer w-full bg-white hover:bg-gray-50 text-gray-900 hover:text-gray-700 border border-gray-300 py-3 rounded-xl transition-all duration-200"
                                    onClick={handleLinkClick}
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                        <span>Login</span>
                                    </div>
                                </Button>
                            </Link>
                            <Link to={"/signup"} className="w-full">
                                <Button
                                    className="cursor-pointer w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-indigo-200/50"
                                    onClick={handleLinkClick}
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <span>Get Started Free</span>
                                    </div>
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        )
    },
)

// Main Navbar Container
export default function Navbar() {
    const navigate = useNavigate()
    const { isAuthenticated, userType, refreshAuth } = useAuth()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [role, setRole] = useState("Student");

    const handleMobileMenuClose = useCallback(() => {
        setIsMobileMenuOpen(false)
    }, [])

    useEffect(() => {
        var userType = AuthService.getUserType();
        setRole(userType ?? "Student");
    }, [role])

    // Actual logout logic
    const doLogout = useCallback(() => {
        AuthService.logout()
        refreshAuth() // 👈 this updates Navbar immediately
        navigate("/login")
    }, [navigate, refreshAuth])

    return (
        <div className={clsx(navStyle.nav, navStyle.navbarFade)}>
            <nav className="flex items-center justify-between py-4 lg:px-50 md:px-30 sm:px-5 px-5 border-b border-gray-200/60">
                <div className="flex items-center gap-2">{<Logo />}</div>
                <div className="md:hidden sm:hidden lg:block hidden">
                    <DesktopNavigationContent />
                </div>
                <div className="flex gap-2">
                    {isAuthenticated ? (
                        <div className="flex gap-2">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link to={role == "Mentor" ? "/mentor/profile" : "/user/profile"}>
                                            <Button variant="ghost" size="icon" className="text-gray-700 hover:bg-gray-100/60">
                                                <User className="w-5 h-5" />
                                            </Button>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>View Profile</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link to={AuthService.getRedirectUrl(userType || "student")}>
                                            <Button variant="ghost" size="icon" className="text-indigo-600 hover:bg-indigo-50/60">
                                                <LayoutDashboard className="w-5 h-5" />
                                            </Button>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Go to Dashboard</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="icon">
                                        <LogOut className="w-5 h-5" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle className="flex gap-3 items-center">
                                            <div className="aspect-square bg-red-100 rounded-full p-3">
                                                <TriangleAlert className="text-red-500" size={25} />
                                            </div>
                                            <div>
                                                <h1 className="text-3xl font-bold">Are you sure?</h1>
                                            </div>
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to sign out of your account? You'll need to sign in again to access your
                                            dashboard.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            className="bg-red-500 hover:bg-red-600 text-white cursor-pointer"
                                            onClick={doLogout}
                                        >
                                            Continue
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    ) : (
                        <>
                            <Link to={"/login"}>
                                <Button className="shadow-transparent bg-transparent hover:bg-gray-100/60 text-gray-700 hover:text-gray-900 md:hidden sm:hidden lg:block hidden cursor-pointer">
                                    Login
                                </Button>
                            </Link>
                            <Link to={"/signup"}>
                                <Button className="bg-indigo-500 hover:bg-indigo-600 text-white cursor-pointer">Get Started</Button>
                            </Link>
                        </>
                    )}
                    {/* Mobile Menu Button */}
                    <div className="lg:hidden">
                        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-gray-700 hover:bg-gray-100/60">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent
                                side="left"
                                className="w-[320px] z-[110] bg-white/90 backdrop-blur-3xl border-gray-200/60 p-3"
                            >
                                <MobileMenuContent
                                    isAuthenticated={isAuthenticated}
                                    userType={userType}
                                    handleLogout={doLogout}
                                    onClose={handleMobileMenuClose}
                                />
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </nav>
        </div>
    )
}