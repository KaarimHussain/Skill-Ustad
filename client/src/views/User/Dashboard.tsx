"use client"
import { useState, useEffect, useRef, memo } from "react"
import {
    Search,
    Bell,
    Menu,
    X,
    ChevronRight,
    Star,
    Clock,
    BookOpen,
    BarChart2,
    CheckCircle,
    Award,
    Bookmark,
    Settings,
    LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Abstract Background Component inspired by the reference image but in light theme with indigo
const AbstractBackground = () => (
    <div className="fixed inset-0 -z-1 overflow-hidden">
        {/* Base gradient - light theme with indigo */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-indigo-50" />

        {/* Abstract SVG Pattern */}
        <svg
            className="absolute inset-0 w-full h-full opacity-[0.2]"
            viewBox="0 0 1000 1000"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Abstract flowing curves */}
            <path d="M0,1000 C150,800 350,900 500,750 C650,600 750,800 1000,650 L1000,1000 Z" fill="url(#indigo-gradient)" />
            <path
                d="M0,600 C150,750 300,650 500,700 C700,750 800,650 1000,800 L1000,1000 L0,1000 Z"
                fill="url(#purple-gradient)"
                opacity="0.7"
            />
            <path
                d="M0,900 C200,850 300,950 500,850 C700,750 800,850 1000,900 L1000,1000 L0,1000 Z"
                fill="url(#violet-gradient)"
                opacity="0.4"
            />

            {/* Network lines inspired by the reference image */}
            <path
                d="M-100,200 Q150,250 300,150 T600,200 T900,100"
                stroke="url(#line-gradient)"
                strokeWidth="1"
                fill="none"
                opacity="0.3"
            />
            <path
                d="M100,300 Q300,350 500,250 T800,300"
                stroke="url(#line-gradient)"
                strokeWidth="1"
                fill="none"
                opacity="0.2"
            />
            <path
                d="M-50,500 Q200,450 400,550 T700,450 T1050,500"
                stroke="url(#line-gradient)"
                strokeWidth="1"
                fill="none"
                opacity="0.25"
            />
            <path
                d="M-100,700 Q100,650 300,750 T600,650 T900,750"
                stroke="url(#line-gradient)"
                strokeWidth="1"
                fill="none"
                opacity="0.2"
            />

            {/* Connection points */}
            <circle cx="150" cy="250" r="3" fill="#6366F1" opacity="0.8" />
            <circle cx="300" cy="150" r="2" fill="#6366F1" opacity="0.6" />
            <circle cx="600" cy="200" r="4" fill="#6366F1" opacity="0.7" />
            <circle cx="900" cy="100" r="3" fill="#6366F1" opacity="0.8" />

            <circle cx="300" cy="350" r="3" fill="#8B5CF6" opacity="0.7" />
            <circle cx="500" cy="250" r="2" fill="#8B5CF6" opacity="0.6" />
            <circle cx="800" cy="300" r="4" fill="#8B5CF6" opacity="0.8" />

            <circle cx="200" cy="450" r="3" fill="#6366F1" opacity="0.7" />
            <circle cx="400" cy="550" r="2" fill="#6366F1" opacity="0.6" />
            <circle cx="700" cy="450" r="4" fill="#6366F1" opacity="0.8" />

            <circle cx="100" cy="650" r="3" fill="#8B5CF6" opacity="0.7" />
            <circle cx="300" cy="750" r="2" fill="#8B5CF6" opacity="0.6" />
            <circle cx="600" cy="650" r="4" fill="#8B5CF6" opacity="0.8" />
            <circle cx="900" cy="750" r="3" fill="#8B5CF6" opacity="0.7" />

            {/* Define gradients */}
            <defs>
                <linearGradient id="indigo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#4F46E5" />
                </linearGradient>
                <linearGradient id="purple-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#7C3AED" />
                </linearGradient>
                <linearGradient id="violet-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#A78BFA" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
                <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366F1" stopOpacity="0" />
                    <stop offset="50%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
                </linearGradient>
            </defs>
        </svg>

        {/* Subtle animated particles */}
        <div className="absolute inset-0 opacity-30">
            <div
                className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-indigo-500 animate-pulse"
                style={{ animationDelay: "0s", animationDuration: "4s" }}
            />
            <div
                className="absolute top-3/4 left-1/3 w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"
                style={{ animationDelay: "1s", animationDuration: "5s" }}
            />
            <div
                className="absolute top-1/3 left-2/3 w-2 h-2 rounded-full bg-indigo-400 animate-pulse"
                style={{ animationDelay: "2s", animationDuration: "6s" }}
            />
            <div
                className="absolute top-2/3 left-3/4 w-1 h-1 rounded-full bg-purple-400 animate-pulse"
                style={{ animationDelay: "3s", animationDuration: "7s" }}
            />
            <div
                className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-indigo-500 animate-pulse"
                style={{ animationDelay: "4s", animationDuration: "8s" }}
            />
        </div>
    </div>
)

// Sample data for roadmaps
const roadmaps = [
    {
        id: 1,
        title: "Frontend Development",
        description: "Master modern frontend technologies and frameworks",
        progress: 65,
        courses: 12,
        completed: 8,
        image: "/placeholder.svg?height=400&width=600",
        featured: true,
        category: "Web Development",
    },
    {
        id: 2,
        title: "Backend Engineering",
        description: "Build scalable and robust backend systems",
        progress: 40,
        courses: 10,
        completed: 4,
        image: "/placeholder.svg?height=400&width=600",
        featured: false,
        category: "Web Development",
    },
    {
        id: 3,
        title: "Data Science Fundamentals",
        description: "Learn essential data science skills and tools",
        progress: 20,
        courses: 15,
        completed: 3,
        image: "/placeholder.svg?height=400&width=600",
        featured: true,
        category: "Data Science",
    },
    {
        id: 4,
        title: "Mobile App Development",
        description: "Create cross-platform mobile applications",
        progress: 80,
        courses: 8,
        completed: 6,
        image: "/placeholder.svg?height=400&width=600",
        featured: false,
        category: "Mobile Development",
    },
    {
        id: 5,
        title: "DevOps & Cloud Computing",
        description: "Master cloud platforms and DevOps practices",
        progress: 30,
        courses: 14,
        completed: 4,
        image: "/placeholder.svg?height=400&width=600",
        featured: true,
        category: "DevOps",
    },
    {
        id: 6,
        title: "UI/UX Design Principles",
        description: "Learn to create beautiful and functional interfaces",
        progress: 50,
        courses: 9,
        completed: 4,
        image: "/placeholder.svg?height=400&width=600",
        featured: false,
        category: "Design",
    },
]

// Sample data for courses
const courses = [
    {
        id: 101,
        title: "React Fundamentals",
        description: "Learn the core concepts of React",
        duration: "4 hours",
        level: "Beginner",
        completed: true,
        roadmapId: 1,
    },
    {
        id: 102,
        title: "Advanced CSS Techniques",
        description: "Master modern CSS layouts and animations",
        duration: "6 hours",
        level: "Intermediate",
        completed: true,
        roadmapId: 1,
    },
    {
        id: 103,
        title: "JavaScript ES6+",
        description: "Modern JavaScript features and patterns",
        duration: "5 hours",
        level: "Intermediate",
        completed: true,
        roadmapId: 1,
    },
    {
        id: 104,
        title: "Node.js Essentials",
        description: "Build backend services with Node.js",
        duration: "8 hours",
        level: "Intermediate",
        completed: false,
        roadmapId: 2,
    },
    {
        id: 105,
        title: "Python for Data Science",
        description: "Learn Python libraries for data analysis",
        duration: "10 hours",
        level: "Beginner",
        completed: true,
        roadmapId: 3,
    },
    {
        id: 106,
        title: "React Native Basics",
        description: "Build your first mobile app with React Native",
        duration: "7 hours",
        level: "Intermediate",
        completed: true,
        roadmapId: 4,
    },
]

// Dashboard component
export default function UserDashboard() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [isMobile, setIsMobile] = useState(false)
    const [activeRoadmap, setActiveRoadmap] = useState<number | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const sidebarRef = useRef<HTMLDivElement>(null)

    // Handle responsive sidebar
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 1024)
            if (window.innerWidth < 1024) {
                setIsSidebarOpen(false)
            } else {
                setIsSidebarOpen(true)
            }
        }

        checkIfMobile()
        window.addEventListener("resize", checkIfMobile)

        return () => {
            window.removeEventListener("resize", checkIfMobile)
        }
    }, [])

    // Filter roadmaps based on search
    const filteredRoadmaps = roadmaps.filter(
        (roadmap) =>
            roadmap.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            roadmap.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            roadmap.category.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    // Get courses for active roadmap
    const activeCourses = activeRoadmap ? courses.filter((course) => course.roadmapId === activeRoadmap) : []

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex">
            <AbstractBackground />

            {/* Sidebar - Made sticky for desktop */}
            <aside
                ref={sidebarRef}
                className={`fixed lg:sticky top-[75px] lg:top-[75px] z-20 h-[calc(100vh-75px)] bg-white shadow-lg transition-all duration-300 ease-in-out ${isSidebarOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full lg:w-20 lg:translate-x-0"
                    }`}
                style={{ height: "calc(100vh - 75px)" }}
            >
                <div className="h-full flex flex-col overflow-hidden">
                    {/* Logo */}
                    <div className="flex items-center justify-between h-16 px-4 border-b border-slate-100">
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-md bg-indigo-600 flex items-center justify-center">
                                <BookOpen className="w-4 h-4 text-white" />
                            </div>
                            {(!isMobile || isSidebarOpen) && (
                                <span
                                    className={`ml-3 font-semibold text-lg transition-opacity duration-300 ${isSidebarOpen ? "opacity-100" : "opacity-0 lg:hidden"
                                        }`}
                                >
                                    SkillUstad
                                </span>
                            )}
                        </div>
                        {isMobile && (
                            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-500 hover:text-slate-700">
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {/* User profile */}
                    <div className={`px-4 py-6 border-b border-slate-100 ${!isSidebarOpen && "lg:border-none"}`}>
                        <div className="flex items-center">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                                <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            {isSidebarOpen && (
                                <div className="ml-3 overflow-hidden">
                                    <p className="font-medium text-sm">Jane Doe</p>
                                    <p className="text-xs text-slate-500 truncate">jane.doe@example.com</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 py-4 overflow-y-auto">
                        <ul className="space-y-1 px-2">
                            {[
                                { icon: BarChart2, label: "Dashboard", active: true },
                                { icon: BookOpen, label: "My Courses" },
                                { icon: Star, label: "Featured" },
                                { icon: Clock, label: "Recent" },
                                { icon: Bookmark, label: "Bookmarks" },
                                { icon: Award, label: "Certificates" },
                            ].map((item, index) => (
                                <li key={index}>
                                    <button
                                        className={`flex items-center w-full px-3 py-2 rounded-lg transition-colors ${item.active ? "bg-indigo-50 text-indigo-600" : "text-slate-600 hover:bg-slate-100"
                                            } ${!isSidebarOpen && "lg:justify-center"}`}
                                    >
                                        <item.icon className={`w-5 h-5 ${item.active ? "text-indigo-600" : "text-slate-500"}`} />
                                        {isSidebarOpen && <span className="ml-3 text-sm">{item.label}</span>}
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-8 px-4">
                            <div
                                className={`text-xs font-semibold text-slate-400 uppercase tracking-wider ${!isSidebarOpen && "lg:text-center"
                                    }`}
                            >
                                {isSidebarOpen ? "Settings" : ""}
                            </div>
                            <ul className="mt-3 space-y-1 px-2">
                                {[
                                    { icon: Settings, label: "Settings" },
                                    { icon: LogOut, label: "Log out" },
                                ].map((item, index) => (
                                    <li key={index}>
                                        <button
                                            className={`flex items-center w-full px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors ${!isSidebarOpen && "lg:justify-center"
                                                }`}
                                        >
                                            <item.icon className="w-5 h-5 text-slate-500" />
                                            {isSidebarOpen && <span className="ml-3 text-sm">{item.label}</span>}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </nav>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 flex flex-col min-h-screen pt-[75px]">
                {/* Fixed Header - 75px height as requested */}
                <header className="h-[75px] fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 z-10">
                    <div className="flex items-center">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="text-slate-500 hover:text-slate-700 focus:outline-none"
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        <div className="ml-4 lg:ml-8 flex items-center">
                            <div className="w-8 h-8 rounded-md bg-indigo-600 flex items-center justify-center mr-2 lg:hidden">
                                <BookOpen className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-bold text-xl text-indigo-600">SkillUstad</span>
                        </div>

                        <div className="ml-8 relative max-w-md w-full hidden md:block">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <Input
                                type="search"
                                placeholder="Search roadmaps and courses..."
                                className="pl-10 py-2 h-9 text-sm bg-slate-50 border-slate-200 focus:border-indigo-500 rounded-lg w-full"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button className="relative text-slate-500 hover:text-slate-700">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-indigo-600 rounded-full"></span>
                        </button>

                        <div className="h-8 w-px bg-slate-200 hidden md:block"></div>

                        <button className="flex items-center text-sm font-medium text-slate-700 hover:text-slate-900 hidden md:flex">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                                <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            <span className="ml-2">Jane Doe</span>
                        </button>
                    </div>
                </header>

                {/* Mobile search */}
                <div className="p-4 md:hidden">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input
                            type="search"
                            placeholder="Search roadmaps and courses..."
                            className="pl-10 py-2 text-sm bg-slate-50 border-slate-200 focus:border-indigo-500 rounded-lg w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Dashboard content */}
                <div className="flex-1 px-4 lg:px-8 py-6">
                    {/* Welcome section */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-slate-900">Welcome back, Jane!</h1>
                        <p className="text-slate-600 mt-1">Continue your learning journey where you left off.</p>
                    </div>

                    {/* Stats - Some with glassmorphism */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {/* First card with glassmorphism */}
                        <Card className="bg-white/40 backdrop-blur-md border-indigo-100 shadow-sm">
                            <CardContent className="p-6 flex items-center">
                                <div className="w-12 h-12 rounded-lg bg-indigo-500 flex items-center justify-center">
                                    <BookOpen className="w-6 h-6 text-white" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-slate-500">Courses in Progress</p>
                                    <p className="text-2xl font-bold text-slate-900">4</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Regular card */}
                        <Card className="bg-white border-slate-200 shadow-sm">
                            <CardContent className="p-6 flex items-center">
                                <div className="w-12 h-12 rounded-lg bg-emerald-500 flex items-center justify-center">
                                    <CheckCircle className="w-6 h-6 text-white" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-slate-500">Completed Courses</p>
                                    <p className="text-2xl font-bold text-slate-900">12</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Another glassmorphism card */}
                        <Card className="bg-white/40 backdrop-blur-md border-indigo-100 shadow-sm">
                            <CardContent className="p-6 flex items-center">
                                <div className="w-12 h-12 rounded-lg bg-amber-500 flex items-center justify-center">
                                    <Clock className="w-6 h-6 text-white" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-slate-500">Hours Learned</p>
                                    <p className="text-2xl font-bold text-slate-900">48</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Regular card */}
                        <Card className="bg-white border-slate-200 shadow-sm">
                            <CardContent className="p-6 flex items-center">
                                <div className="w-12 h-12 rounded-lg bg-purple-500 flex items-center justify-center">
                                    <Award className="w-6 h-6 text-white" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-slate-500">Certificates Earned</p>
                                    <p className="text-2xl font-bold text-slate-900">3</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Tabs */}
                    <Tabs defaultValue="all" className="mb-6">
                        <TabsList className="bg-slate-100 p-1 rounded-lg">
                            <TabsTrigger value="all" className="rounded-md text-sm">
                                All Roadmaps
                            </TabsTrigger>
                            <TabsTrigger value="in-progress" className="rounded-md text-sm">
                                In Progress
                            </TabsTrigger>
                            <TabsTrigger value="featured" className="rounded-md text-sm">
                                Featured
                            </TabsTrigger>
                            <TabsTrigger value="completed" className="rounded-md text-sm">
                                Completed
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="all" className="mt-6">
                            {activeRoadmap ? (
                                <div className="space-y-6">
                                    {/* Active roadmap header */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <button
                                                onClick={() => setActiveRoadmap(null)}
                                                className="mr-3 text-slate-500 hover:text-slate-700"
                                            >
                                                <ChevronRight className="w-5 h-5 rotate-180" />
                                            </button>
                                            <h2 className="text-xl font-bold text-slate-900">
                                                {roadmaps.find((r) => r.id === activeRoadmap)?.title}
                                            </h2>
                                        </div>
                                        <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                                            {roadmaps.find((r) => r.id === activeRoadmap)?.category}
                                        </Badge>
                                    </div>

                                    {/* Roadmap description - with glassmorphism */}
                                    <div className="bg-white/60 backdrop-blur-md rounded-xl border border-indigo-100 p-6 shadow-sm">
                                        <div className="flex flex-col md:flex-row md:items-center gap-6">
                                            <div className="w-full md:w-1/3 aspect-video rounded-lg overflow-hidden">
                                                <img
                                                    src={roadmaps.find((r) => r.id === activeRoadmap)?.image || "/placeholder.svg"}
                                                    alt={roadmaps.find((r) => r.id === activeRoadmap)?.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-slate-600 mb-4">
                                                    {roadmaps.find((r) => r.id === activeRoadmap)?.description}
                                                </p>
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                                                    <div>
                                                        <p className="text-sm text-slate-500">Progress</p>
                                                        <div className="flex items-center mt-1">
                                                            <Progress
                                                                value={roadmaps.find((r) => r.id === activeRoadmap)?.progress}
                                                                className="h-2 w-32 bg-indigo-100"
                                                            />
                                                            <span className="ml-3 text-sm font-medium text-slate-700">
                                                                {roadmaps.find((r) => r.id === activeRoadmap)?.progress}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="h-10 w-px bg-slate-200 hidden sm:block"></div>
                                                    <div>
                                                        <p className="text-sm text-slate-500">Courses</p>
                                                        <p className="text-sm font-medium text-slate-700 mt-1">
                                                            {roadmaps.find((r) => r.id === activeRoadmap)?.completed} of{" "}
                                                            {roadmaps.find((r) => r.id === activeRoadmap)?.courses} completed
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Continue Learning</Button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Course list */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Courses in this Roadmap</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {activeCourses.map((course, index) => (
                                                <Card
                                                    key={course.id}
                                                    className={
                                                        index % 3 === 0
                                                            ? "bg-white/60 backdrop-blur-md border-indigo-100 shadow-sm overflow-hidden"
                                                            : "bg-white border-slate-200 shadow-sm overflow-hidden"
                                                    }
                                                >
                                                    <CardContent className="p-0">
                                                        <div className="p-6">
                                                            <div className="flex items-start justify-between">
                                                                <div>
                                                                    <h4 className="font-semibold text-slate-900">{course.title}</h4>
                                                                    <p className="text-sm text-slate-600 mt-1">{course.description}</p>
                                                                </div>
                                                                {course.completed ? (
                                                                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                                                                        Completed
                                                                    </Badge>
                                                                ) : (
                                                                    <Badge className="bg-amber-100 text-amber-700 border-amber-200">In Progress</Badge>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center mt-4 text-xs text-slate-500">
                                                                <Clock className="w-3 h-3 mr-1" />
                                                                <span>{course.duration}</span>
                                                                <span className="mx-2">•</span>
                                                                <span>{course.level}</span>
                                                            </div>
                                                        </div>
                                                        <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-3 flex justify-between items-center">
                                                            <div className="flex items-center">
                                                                {course.completed ? (
                                                                    <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                                                                ) : (
                                                                    <div className="w-4 h-4 rounded-full border-2 border-amber-500 mr-2"></div>
                                                                )}
                                                                <span className="text-xs font-medium text-slate-700">
                                                                    {course.completed ? "Completed" : "Continue"}
                                                                </span>
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 p-0 h-8 px-2"
                                                            >
                                                                {course.completed ? "Review" : "Start"}
                                                            </Button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* Featured roadmap - with glassmorphism */}
                                    <div className="mb-8">
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="text-xl font-bold text-slate-900">Continue Learning</h2>
                                            <Button variant="ghost" className="text-indigo-600 hover:text-indigo-700">
                                                View All
                                            </Button>
                                        </div>

                                        <div className="bg-white/60 backdrop-blur-md rounded-xl border border-indigo-100 overflow-hidden shadow-sm">
                                            <div className="flex flex-col md:flex-row">
                                                <div className="w-full md:w-2/5 aspect-video md:aspect-auto">
                                                    <img
                                                        src={roadmaps[0].image || "/placeholder.svg"}
                                                        alt={roadmaps[0].title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="p-6 flex-1">
                                                    <div className="flex items-center mb-2">
                                                        <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200">
                                                            {roadmaps[0].category}
                                                        </Badge>
                                                        <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-700 border-amber-200">
                                                            In Progress
                                                        </Badge>
                                                    </div>
                                                    <h3 className="text-xl font-bold text-slate-900 mb-2">{roadmaps[0].title}</h3>
                                                    <p className="text-slate-600 mb-6">{roadmaps[0].description}</p>

                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                                                        <div>
                                                            <p className="text-sm text-slate-500">Progress</p>
                                                            <div className="flex items-center mt-1">
                                                                <Progress value={roadmaps[0].progress} className="h-2 w-32 bg-indigo-100" />
                                                                <span className="ml-3 text-sm font-medium text-slate-700">{roadmaps[0].progress}%</span>
                                                            </div>
                                                        </div>
                                                        <div className="h-10 w-px bg-slate-200 hidden sm:block"></div>
                                                        <div>
                                                            <p className="text-sm text-slate-500">Courses</p>
                                                            <p className="text-sm font-medium text-slate-700 mt-1">
                                                                {roadmaps[0].completed} of {roadmaps[0].courses} completed
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col sm:flex-row gap-3">
                                                        <Button
                                                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                                            onClick={() => setActiveRoadmap(roadmaps[0].id)}
                                                        >
                                                            Continue Learning
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            className="border-slate-300 text-slate-700 hover:bg-slate-50 bg-transparent"
                                                        >
                                                            View Details
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Roadmap grid */}
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="text-xl font-bold text-slate-900">All Roadmaps</h2>
                                            <div className="flex items-center">
                                                <span className="text-sm text-slate-500 mr-2">{filteredRoadmaps.length} roadmaps</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {filteredRoadmaps.slice(1).map((roadmap, index) => (
                                                <Card
                                                    key={roadmap.id}
                                                    className={
                                                        index % 3 === 1
                                                            ? "bg-white/60 backdrop-blur-md border-indigo-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                                                            : "bg-white border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                                                    }
                                                    onClick={() => setActiveRoadmap(roadmap.id)}
                                                >
                                                    <CardContent className="p-0">
                                                        <div className="aspect-video w-full">
                                                            <img
                                                                src={roadmap.image || "/placeholder.svg"}
                                                                alt={roadmap.title}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="p-5">
                                                            <div className="flex items-center mb-2">
                                                                <Badge className="bg-slate-100 text-slate-700 border-slate-200 text-xs">
                                                                    {roadmap.category}
                                                                </Badge>
                                                                {roadmap.featured && (
                                                                    <Badge className="ml-2 bg-amber-100 text-amber-700 border-amber-200 text-xs">
                                                                        Featured
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <h3 className="font-semibold text-slate-900 mb-1">{roadmap.title}</h3>
                                                            <p className="text-sm text-slate-600 mb-4 line-clamp-2">{roadmap.description}</p>

                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <p className="text-xs text-slate-500 mb-1">Progress</p>
                                                                    <div className="flex items-center">
                                                                        <Progress value={roadmap.progress} className="h-1.5 w-24 bg-indigo-100" />
                                                                        <span className="ml-2 text-xs font-medium text-slate-700">{roadmap.progress}%</span>
                                                                    </div>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="text-xs text-slate-500 mb-1">Courses</p>
                                                                    <p className="text-xs font-medium text-slate-700">
                                                                        {roadmap.completed}/{roadmap.courses}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </TabsContent>

                        <TabsContent value="in-progress" className="mt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredRoadmaps
                                    .filter((r) => r.progress > 0 && r.progress < 100)
                                    .map((roadmap, index) => (
                                        <Card
                                            key={roadmap.id}
                                            className={
                                                index % 3 === 0
                                                    ? "bg-white/60 backdrop-blur-md border-indigo-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                                                    : "bg-white border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                                            }
                                            onClick={() => setActiveRoadmap(roadmap.id)}
                                        >
                                            <CardContent className="p-0">
                                                <div className="aspect-video w-full">
                                                    <img
                                                        src={roadmap.image || "/placeholder.svg"}
                                                        alt={roadmap.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="p-5">
                                                    <div className="flex items-center mb-2">
                                                        <Badge className="bg-slate-100 text-slate-700 border-slate-200 text-xs">
                                                            {roadmap.category}
                                                        </Badge>
                                                        <Badge className="ml-2 bg-amber-100 text-amber-700 border-amber-200 text-xs">
                                                            In Progress
                                                        </Badge>
                                                    </div>
                                                    <h3 className="font-semibold text-slate-900 mb-1">{roadmap.title}</h3>
                                                    <p className="text-sm text-slate-600 mb-4 line-clamp-2">{roadmap.description}</p>

                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-xs text-slate-500 mb-1">Progress</p>
                                                            <div className="flex items-center">
                                                                <Progress value={roadmap.progress} className="h-1.5 w-24 bg-indigo-100" />
                                                                <span className="ml-2 text-xs font-medium text-slate-700">{roadmap.progress}%</span>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xs text-slate-500 mb-1">Courses</p>
                                                            <p className="text-xs font-medium text-slate-700">
                                                                {roadmap.completed}/{roadmap.courses}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="featured" className="mt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredRoadmaps
                                    .filter((r) => r.featured)
                                    .map((roadmap, index) => (
                                        <Card
                                            key={roadmap.id}
                                            className={
                                                index % 2 === 0
                                                    ? "bg-white/60 backdrop-blur-md border-indigo-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                                                    : "bg-white border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                                            }
                                            onClick={() => setActiveRoadmap(roadmap.id)}
                                        >
                                            <CardContent className="p-0">
                                                <div className="aspect-video w-full">
                                                    <img
                                                        src={roadmap.image || "/placeholder.svg"}
                                                        alt={roadmap.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="p-5">
                                                    <div className="flex items-center mb-2">
                                                        <Badge className="bg-slate-100 text-slate-700 border-slate-200 text-xs">
                                                            {roadmap.category}
                                                        </Badge>
                                                        <Badge className="ml-2 bg-amber-100 text-amber-700 border-amber-200 text-xs">
                                                            Featured
                                                        </Badge>
                                                    </div>
                                                    <h3 className="font-semibold text-slate-900 mb-1">{roadmap.title}</h3>
                                                    <p className="text-sm text-slate-600 mb-4 line-clamp-2">{roadmap.description}</p>

                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-xs text-slate-500 mb-1">Progress</p>
                                                            <div className="flex items-center">
                                                                <Progress value={roadmap.progress} className="h-1.5 w-24 bg-indigo-100" />
                                                                <span className="ml-2 text-xs font-medium text-slate-700">{roadmap.progress}%</span>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xs text-slate-500 mb-1">Courses</p>
                                                            <p className="text-xs font-medium text-slate-700">
                                                                {roadmap.completed}/{roadmap.courses}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="completed" className="mt-6">
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Award className="w-8 h-8 text-slate-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">No completed roadmaps yet</h3>
                                <p className="text-slate-600 max-w-md mx-auto mb-6">
                                    Keep learning and complete your first roadmap to see it here.
                                </p>
                                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Explore Roadmaps</Button>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>

            {/* Mobile floating action button to expand sidebar */}
            {isMobile && !isSidebarOpen && (
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="fixed bottom-6 left-6 z-30 w-14 h-14 rounded-full bg-indigo-600 text-white shadow-lg flex items-center justify-center hover:bg-indigo-700 transition-colors lg:hidden"
                    aria-label="Open sidebar"
                >
                    <Menu className="w-6 h-6" />
                </button>
            )}
        </div>
    )
}
