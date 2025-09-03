"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    ArrowRight,
    BarChart3,
    Brain,
    Code,
    DollarSign,
    Palette,
    TrendingUp,
    Target,
    Zap,
    Calendar,
    BookOpen,
    Plus,
    MapPin,
    Eye,
    EyeOff,
    GitBranch,
    Trash,
    Users,
    Network as ChartNetwork,
    MessageCircle,
    Lightbulb,
    RefreshCw,
    Building,
} from "lucide-react"
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
import DashboardService from "@/services/dashboard.service"
import { Link, useNavigate } from "react-router-dom"
import RoadmapService from "@/services/roadmap.service"
import type { FirebaseRoadmapDto } from "@/dtos/firebase.roadmap"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { toast } from "sonner"
import AuthService from "@/services/auth.service"
import AddtionalInfoService from "@/services/additional-info.service"
import { cacheManager, CACHE_KEYS } from "@/utils/cache"

const quickLinks = [
    {
        title: "Roadmaps",
        description: "AI-powered learning path",
        icon: Target,
        color: "from-indigo-500 to-purple-600",
        bgColor: "bg-gradient-to-br from-indigo-50 to-purple-50",
        iconBg: "bg-indigo-100",
        iconColor: "text-indigo-600",
        action: "generate",
        link: "/public/roadmaps",
    },
    {
        title: "Courses",
        description: "Continue your journey",
        icon: BookOpen,
        color: "from-blue-500 to-cyan-600",
        bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        action: "courses",
        link: "/courses",
    },
    {
        title: "Take Quiz",
        description: "Test your knowledge",
        icon: Zap,
        color: "from-yellow-500 to-orange-600",
        bgColor: "bg-gradient-to-br from-yellow-50 to-orange-50",
        iconBg: "bg-yellow-100",
        iconColor: "text-yellow-600",
        action: "quiz",
        link: "/user/quiz",
    },
    {
        title: "Community Hub",
        description: "Discuss & grow together",
        icon: Users,
        color: "from-green-500 to-emerald-600",
        bgColor: "bg-gradient-to-br from-green-50 to-emerald-50",
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
        action: "progress",
        link: "/community",
    },
    {
        title: "Jobs",
        description: "Find your dream tech job",
        icon: DollarSign,
        color: "from-teal-500 to-cyan-600",
        bgColor: "bg-gradient-to-br from-teal-50 to-cyan-50",
        iconBg: "bg-teal-100",
        iconColor: "text-teal-600",
        action: "jobs",
        link: "/jobs",
    },
]
const contentToolLinks = [
    {
        title: "Lessons",
        description: "A Full fledged course editor and manager where you can manage courses",
        icon: BookOpen,
        color: "from-blue-500 to-cyan-500",
        bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        action: "create_lessons",
        link: "/user/course",
    },
    {
        title: "Schedule Live Sessions",
        description: "Set times for 1-on-1 or group mentorship calls.",
        icon: Calendar,
        color: "from-green-500 to-emerald-500",
        bgColor: "bg-gradient-to-br from-green-50 to-emerald-50",
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
        action: "schedule_sessions",
        link: "/schedule-sessions",
    },
    {
        title: "Host Q&A or AMA",
        description: "Engage with mentors via live Q&A sessions.",
        icon: MessageCircle,
        color: "from-orange-500 to-amber-500",
        bgColor: "bg-gradient-to-br from-orange-50 to-amber-50",
        iconBg: "bg-orange-100",
        iconColor: "text-orange-600",
        action: "host_qa",
        link: "/qa",
    },
    {
        title: "Find Mentors",
        description: "Connect with experienced mentors in your field.",
        icon: Lightbulb,
        color: "from-purple-500 to-pink-500",
        bgColor: "bg-gradient-to-br from-purple-50 to-pink-50",
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600",
        action: "ai_suggestions",
        link: "/user/find-mentor",
    },
    {
        title: "Find Company",
        description: "Connect with Enterprises and view there goals",
        icon: Building,
        color: "from-red-500 to-rose-500",
        bgColor: "bg-gradient-to-br from-red-50 to-rose-50",
        iconBg: "bg-red-100",
        iconColor: "text-red-600",
        action: "ai_suggestions",
        link: "/user/find-company",
    },
]
export default function UserDashboard() {
    const [name, setName] = useState<string>("User")
    const [roadmapData, setRoadmapData] = useState<FirebaseRoadmapDto[]>([])
    const [roadmapProgressData, setRoadmapProgressData] = useState<any[]>([])
    const [isLoadingRoadmaps, setIsLoadingRoadmaps] = useState(true)
    const [isLoadingProgress, setIsLoadingProgress] = useState(true)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [cacheStatus, setCacheStatus] = useState({ roadmaps: false, progress: false })
    const navigate = useNavigate()

    const checkInfoData = async () => {
        const role = AuthService.getUserType()
        const email = AuthService.getUserEmail()
        console.log(email)

        var infoModel = {
            role: role ?? "Student",
            email: email ?? "",
        }
        console.log("Current Logged User Type: ", infoModel)

        const infoBool = await AddtionalInfoService.infoCheck(infoModel)
        console.log("Current User Additional Info Check", infoBool)

        if (!infoBool) {
            navigate("/user/additional-info")
        }
    }
    const getUserName = () => {
        const dashboardService = new DashboardService()
        dashboardService.getUserBasicData().then((name) => {
            setName(name)
        })
    }
    useEffect(() => {
        checkInfoData()
        getUserName()
        getRoadmapData()
        getProgressData()
    }, [])

    const checkCacheStatus = () => {
        const userId = AuthService.getAuthenticatedUserId()
        if (!userId) return

        const roadmapsCached = cacheManager.has(CACHE_KEYS.USER_ROADMAPS(userId))
        const progressCached = cacheManager.has(CACHE_KEYS.USER_PROGRESS(userId))

        setCacheStatus({ roadmaps: roadmapsCached, progress: progressCached })
    }

    const getRoadmapData = async (useCache: boolean = true) => {
        try {
            setIsLoadingRoadmaps(true)
            const data = await RoadmapService.getCurrentUserRoadmapData(useCache)
            console.log("✅ User Roadmap Data:", data)
            setRoadmapData(data as FirebaseRoadmapDto[])
            checkCacheStatus()
        } catch (err) {
            console.error("❌ Error fetching roadmap data:", err)
            toast.error("Failed to load roadmaps", {
                description: "Please try refreshing the page or check your connection."
            })
        } finally {
            setIsLoadingRoadmaps(false)
        }
    }

    const getProgressData = async (useCache: boolean = true) => {
        try {
            setIsLoadingProgress(true)
            const data = await RoadmapService.getCurrentUserProgressData(useCache)
            console.log("✅ User Progress Data:", data)
            setRoadmapProgressData(data)
            checkCacheStatus()
        } catch (err) {
            console.error("❌ Error fetching progress data:", err)
            toast.error("Failed to load progress data", {
                description: "Please try refreshing the page or check your connection."
            })
        } finally {
            setIsLoadingProgress(false)
        }
    }

    const handleRefreshData = async () => {
        setIsRefreshing(true)
        try {
            // Clear cache and fetch fresh data
            const userId = AuthService.getAuthenticatedUserId()
            if (userId) {
                cacheManager.invalidate(CACHE_KEYS.USER_ROADMAPS(userId))
                cacheManager.invalidate(CACHE_KEYS.USER_PROGRESS(userId))
            }

            await Promise.all([
                getRoadmapData(false), // Force fresh data
                getProgressData(false)  // Force fresh data
            ])

            toast.success("Data refreshed", {
                description: "Your dashboard has been updated with the latest information."
            })
        } catch (error) {
            console.error("Error refreshing data:", error)
            toast.error("Refresh failed", {
                description: "Unable to refresh data. Please try again."
            })
        } finally {
            setIsRefreshing(false)
        }
    }

    const getRoadmapDifficulty = (roadmap: FirebaseRoadmapDto) => {
        const diff = roadmap.difficulty
        return diff || "Medium"
    }

    const getRoadmapIcon = (title: string) => {
        const titleLower = title.toLowerCase()
        if (titleLower.includes("web") || titleLower.includes("frontend") || titleLower.includes("backend")) return Code
        if (titleLower.includes("design") || titleLower.includes("ui") || titleLower.includes("ux")) return Palette
        if (titleLower.includes("data") || titleLower.includes("analytics")) return BarChart3
        if (titleLower.includes("ai") || titleLower.includes("machine") || titleLower.includes("ml")) return Brain
        if (titleLower.includes("marketing") || titleLower.includes("seo")) return TrendingUp
        if (titleLower.includes("business") || titleLower.includes("freelance")) return DollarSign
        return Target
    }

    const getRoadmapColorScheme = (index: number) => {
        const schemes = [
            {
                color: "from-blue-500/20 to-cyan-500/20",
                iconColor: "text-blue-600",
                borderColor: "hover:border-blue-500/50",
                bgColor: "bg-blue-50",
            },
            {
                color: "from-purple-500/20 to-pink-500/20",
                iconColor: "text-purple-600",
                borderColor: "hover:border-purple-500/50",
                bgColor: "bg-purple-50",
            },
            {
                color: "from-green-500/20 to-emerald-500/20",
                iconColor: "text-green-600",
                borderColor: "hover:border-green-500/50",
                bgColor: "bg-green-50",
            },
            {
                color: "from-orange-500/20 to-red-500/20",
                iconColor: "text-orange-600",
                borderColor: "hover:border-orange-500/50",
                bgColor: "bg-orange-50",
            },
            {
                color: "from-yellow-500/20 to-amber-500/20",
                iconColor: "text-yellow-600",
                borderColor: "hover:border-yellow-500/50",
                bgColor: "bg-yellow-50",
            },
        ]
        return schemes[index % schemes.length]
    }

    const handleContinueRoadmap = (roadmapId: string) => {
        console.log(`Continuing roadmap: ${roadmapId}`)
        navigate(`/user/learn-roadmap/${roadmapId}`)
    }

    const handleContinueProgress = (progressId: string, roadmapId: string) => {
        console.log(`Continuing progress: ${progressId} for roadmap: ${roadmapId}`)
        navigate(`/user/learn-roadmap/${roadmapId}?progressId=${progressId}`)
    }

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case "Easy":
                return "bg-green-100 text-green-700 border-green-200"
            case "Medium":
                return "bg-yellow-100 text-yellow-700 border-yellow-200"
            case "Hard":
                return "bg-red-100 text-red-700 border-red-200"
            default:
                return "bg-gray-100 text-gray-700 border-gray-200"
        }
    }

    const formatDate = (timestamp: any) => {
        if (!timestamp) return "Recently"

        try {
            const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
            return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            })
        } catch {
            return "Recently"
        }
    }

    const handleDocDelete = async (id: string) => {
        setIsDeleting(true)
        try {
            const success = await RoadmapService.deleteRoadmap(id)

            if (success) {
                setRoadmapData((prevData) => prevData.filter((roadmap) => roadmap.id !== id))
                toast.success("Roadmap deleted", {
                    description: "The roadmap has been permanently removed from your dashboard.",
                })
            } else {
                toast.error("Delete failed", {
                    description: "Unable to delete roadmap. Please try again.",
                })
            }
        } catch (error) {
            console.error("Error deleting roadmap:", error)
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-700/40 via-indigo-900/10 to-indigo-500/10"></div>
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                    <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-900/40 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
                </div>
                <div className="relative px-4 sm:px-6 lg:px-8 py-25">
                    <div className="max-w-7xl mx-auto text-center">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-6 hover:bg-white/30 transition-all duration-300">
                            <Calendar className="w-4 h-4 mr-2 text-indigo-600" />
                            <span className="text-sm font-medium text-gray-700">
                                {new Date().toLocaleDateString("en-US", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                            Welcome back,{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 animate-gradient">
                                {name}!
                            </span>
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                            Ready to level up your skills today? Let's continue your learning journey.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Quick Actions</h2>
                            <p className="text-gray-600 mt-1">Jump right into your learning experience</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {quickLinks.map((link, index) => (
                            <Link key={index} to={link.link}>
                                <Card
                                    key={link.title}
                                    className={`${link.bgColor} border-0 hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-300 hover:-translate-y-2 cursor-pointer group relative overflow-hidden`}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                    <CardContent className="p-6 relative">
                                        <div
                                            className={`w-12 h-12 ${link.iconBg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm`}
                                        >
                                            <link.icon className={`w-6 h-6 ${link.iconColor}`} />
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-indigo-700 transition-colors">
                                            {link.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-4">{link.description}</p>
                                        <div className="flex items-center text-indigo-600 text-sm font-medium group-hover:text-indigo-700">
                                            Get started
                                            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="mb-12">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Content & Session Tools</h2>
                            <p className="text-gray-600 mt-1">
                                Create, manage different content tools or conduct an session with students
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {contentToolLinks.map((link, index) => (
                            <Link key={index} to={link.link}>
                                <Card
                                    key={link.title}
                                    className={`${link.bgColor} border-0 hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-300 hover:-translate-y-2 cursor-pointer group relative overflow-hidden h-full`}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                    <CardContent className="p-6 relative">
                                        <div
                                            className={`w-12 h-12 ${link.iconBg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm`}
                                        >
                                            <link.icon className={`w-6 h-6 ${link.iconColor}`} />
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-indigo-700 transition-colors">
                                            {link.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-4">{link.description}</p>
                                        <div className="flex items-center text-indigo-600 text-sm font-medium group-hover:text-indigo-700">
                                            Get started
                                            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="mb-12">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Start where you left</h2>
                            <p className="text-zinc-500 mt-1">Don't let laziness get in your way!</p>
                            {(cacheStatus.roadmaps || cacheStatus.progress) && (
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="flex items-center gap-1 text-xs text-green-600">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span>Data cached for faster loading</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                onClick={handleRefreshData}
                                disabled={isRefreshing}
                                className="cursor-pointer"
                            >
                                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                                {isRefreshing ? 'Refreshing...' : 'Refresh'}
                            </Button>
                            <Link to={"/user/roadmap-gen"}>
                                <Button className="bg-indigo-500 hover:bg-indigo-600 text-white cursor-pointer">
                                    <Plus className="w-4 h-4 mr-2" />
                                    New Roadmap
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {isLoadingRoadmaps ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map((i) => (
                                <Card key={i} className="animate-pulse">
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                                            <div className="flex-1">
                                                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                            </div>
                                        </div>
                                        <div className="h-2 bg-gray-200 rounded mb-4"></div>
                                        <div className="h-10 bg-gray-200 rounded"></div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : roadmapData.length === 0 ? (
                        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-dashed border-2 border-gray-300">
                            <CardContent className="p-12 text-center">
                                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MapPin className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No roadmaps yet</h3>
                                <p className="text-gray-600 mb-6">Create your first learning roadmap to get started on your journey!</p>
                                <Link to="/user/roadmap-gen">
                                    <Button className="bg-indigo-500 hover:bg-indigo-600 text-white">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create Your First Roadmap
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        <Carousel className="w-full">
                            <CarouselContent className="-ml-2 md:-ml-4">
                                {roadmapData.map((roadmap, index) => {
                                    const difficulty = getRoadmapDifficulty(roadmap)
                                    const RoadmapIcon = getRoadmapIcon(roadmap.title)
                                    const colorScheme = getRoadmapColorScheme(index)
                                    return (
                                        <CarouselItem key={roadmap.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                                            <Card
                                                className={`bg-white/90 backdrop-blur-sm border border-white/60 ${colorScheme.borderColor} transition-all duration-300 group hover:transform hover:-translate-y-3 relative overflow-hidden hover:shadow-2xl hover:shadow-indigo-100/50 h-full`}
                                            >
                                                <div className={`absolute inset-0 bg-gradient-to-br ${colorScheme.color} opacity-60`}></div>

                                                <div className="absolute top-4 right-4 z-10">
                                                    <Badge className="bg-white/80 text-gray-700 border-0 text-xs font-medium">
                                                        {roadmap.visibility === "public" ? (
                                                            <>
                                                                <Eye className="w-3 h-3 mr-1" />
                                                                Public
                                                            </>
                                                        ) : (
                                                            <>
                                                                <EyeOff className="w-3 h-3 mr-1" />
                                                                Private
                                                            </>
                                                        )}
                                                    </Badge>
                                                </div>

                                                <CardContent className="p-6 relative z-10 h-full flex flex-col">
                                                    <div className="flex items-start gap-4 mb-4">
                                                        <div className="p-3 bg-white/90 backdrop-blur-sm rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                                                            <RoadmapIcon className={`w-6 h-6 ${colorScheme.iconColor}`} />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-gray-800 transition-colors truncate">
                                                                {roadmap.title}
                                                            </h3>
                                                            <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                                                                <Calendar className="w-3 h-3" />
                                                                <span>Created {formatDate(roadmap.createdAt)}</span>
                                                            </div>
                                                            <div className="flex flex-wrap gap-2 mb-2">
                                                                {roadmap.difficulty && (
                                                                    <Badge className={`text-xs ${getDifficultyColor(roadmap.difficulty)}`}>
                                                                        {difficulty}
                                                                    </Badge>
                                                                )}
                                                                {roadmap.visibility && (
                                                                    <Badge className="bg-gray-100 text-gray-700 border-0 text-xs">
                                                                        {roadmap.visibility === "public" ? (
                                                                            <>
                                                                                <Eye className="w-3 h-3 mr-1" />
                                                                                Public
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <EyeOff className="w-3 h-3 mr-1" />
                                                                                Private
                                                                            </>
                                                                        )}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            {roadmap.createdAt && (
                                                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                                                    <BookOpen className="w-3 h-3" />
                                                                    <span>Created {formatDate(roadmap.createdAt)}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                                        <div className="bg-white/50 rounded-lg p-2 text-center">
                                                            <div className="flex items-center justify-center gap-1 text-xs text-gray-600 mb-1">
                                                                <GitBranch className="w-3 h-3" />
                                                                Nodes
                                                            </div>
                                                            <div className="font-semibold text-gray-900">{roadmap.nodes?.length || 0}</div>
                                                        </div>
                                                        <div className="bg-white/50 rounded-lg p-2 text-center">
                                                            <div className="flex items-center justify-center gap-1 text-xs text-gray-600 mb-1">
                                                                <ChartNetwork className="w-3 h-3" />
                                                                Edges
                                                            </div>
                                                            <div className="font-semibold text-gray-900">%</div>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-2 mt-auto">
                                                        <Link className="flex-1" to={`/user/roadmap/${roadmap.id}`}>
                                                            <Button
                                                                className="w-full cursor-pointer bg-indigo-500 hover:bg-indigo-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 group-hover:scale-[1.02]"
                                                                onClick={() => handleContinueRoadmap(roadmap.id)}
                                                            >
                                                                <Eye className="w-4 h-4 mr-2" />
                                                                View
                                                            </Button>
                                                        </Link>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    size="icon"
                                                                    className="text-white bg-red-500/80 hover:bg-red-500 transition-all cursor-pointer"
                                                                >
                                                                    <Trash className="w-4 h-4" />
                                                                </Button>
                                                            </AlertDialogTrigger>

                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        This action cannot be undone. This will permanently delete your roadmap and remove
                                                                        all associated data from our servers.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>

                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={() => handleDocDelete(roadmap.id)}
                                                                        className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                                                                        disabled={isDeleting}
                                                                    >
                                                                        {isDeleting ? "Deleting..." : "Delete"}
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </CarouselItem>
                                    )
                                })}
                            </CarouselContent>
                            <CarouselPrevious className="hidden md:flex" />
                            <CarouselNext className="hidden md:flex" />
                        </Carousel>
                    )}
                </div>

                <div className="mb-12">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Continue Your Learning Journey</h2>
                            <p className="text-gray-600 mt-1">Pick up where you left off and maintain your momentum.</p>
                            {cacheStatus.progress && (
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="flex items-center gap-1 text-xs text-green-600">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span>Progress data cached for faster loading</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {isLoadingProgress ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map((i) => (
                                <Card key={i} className="animate-pulse">
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                                            <div className="flex-1">
                                                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                            </div>
                                        </div>
                                        <div className="h-2 bg-gray-200 rounded mb-4"></div>
                                        <div className="h-10 bg-gray-200 rounded"></div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : roadmapProgressData.length === 0 ? (
                        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-dashed border-2 border-gray-300">
                            <CardContent className="p-12 text-center">
                                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Target className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No progress yet</h3>
                                <p className="text-gray-600 mb-6">Start learning from your roadmaps to see your progress here!</p>
                                <Link to="/user/roadmap-gen">
                                    <Button className="bg-indigo-500 hover:bg-indigo-600 text-white">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Start Learning
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        <Carousel className="w-full">
                            <CarouselContent className="-ml-2 md:-ml-4">
                                {roadmapProgressData.map((progressItem: any, index) => {
                                    const RoadmapIcon = getRoadmapIcon(progressItem.roadmapTitle)
                                    const colorScheme = getRoadmapColorScheme(index)
                                    return (
                                        <CarouselItem key={progressItem.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                                            <Card
                                                className={`bg-white/90 backdrop-blur-sm border border-white/60 ${colorScheme.borderColor} transition-all duration-300 group hover:transform hover:-translate-y-3 relative overflow-hidden hover:shadow-2xl hover:shadow-indigo-100/50 h-full`}
                                            >
                                                <div className={`absolute inset-0 bg-gradient-to-br ${colorScheme.color} opacity-60`}></div>

                                                <CardContent className="p-6 relative z-10 h-full flex flex-col">
                                                    <div className="flex items-start gap-4 mb-4">
                                                        <div className="p-3 bg-white/90 backdrop-blur-sm rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                                                            <RoadmapIcon className={`w-6 h-6 ${colorScheme.iconColor}`} />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-gray-800 transition-colors truncate">
                                                                {progressItem.roadmapTitle}
                                                            </h3>
                                                            <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                                                                <Calendar className="w-3 h-3" />
                                                                <span>Started {formatDate(progressItem.startedAt)}</span>
                                                            </div>
                                                            <div className="flex flex-wrap gap-2 mb-2">
                                                                {progressItem.roadmapDifficulty && (
                                                                    <Badge className={`text-xs ${getDifficultyColor(progressItem.roadmapDifficulty)}`}>
                                                                        {progressItem.roadmapDifficulty}
                                                                    </Badge>
                                                                )}
                                                                <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">
                                                                    {progressItem.progressPercentage}% Complete
                                                                </Badge>
                                                            </div>
                                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                                <BookOpen className="w-3 h-3" />
                                                                <span>Last updated {formatDate(progressItem.lastUpdated)}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="mb-4">
                                                        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                                                            <span>Progress</span>
                                                            <span>{progressItem.completedNodes}/{progressItem.totalNodes} nodes</span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                                                                style={{ width: `${progressItem.progressPercentage}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                                        <div className="bg-white/50 rounded-lg p-2 text-center">
                                                            <div className="flex items-center justify-center gap-1 text-xs text-gray-600 mb-1">
                                                                <Target className="w-3 h-3" />
                                                                Completed
                                                            </div>
                                                            <div className="font-semibold text-gray-900">{progressItem.completedNodes}</div>
                                                        </div>
                                                        <div className="bg-white/50 rounded-lg p-2 text-center">
                                                            <div className="flex items-center justify-center gap-1 text-xs text-gray-600 mb-1">
                                                                <TrendingUp className="w-3 h-3" />
                                                                Progress
                                                            </div>
                                                            <div className="font-semibold text-gray-900">{progressItem.progressPercentage}%</div>
                                                        </div>
                                                    </div>

                                                    <div className="mt-auto">
                                                        <Button
                                                            className="w-full cursor-pointer bg-indigo-500 hover:bg-indigo-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 group-hover:scale-[1.02]"
                                                            onClick={() => handleContinueProgress(progressItem.id, progressItem.roadmapId)}
                                                        >
                                                            <ArrowRight className="w-4 h-4 mr-2" />
                                                            Continue Learning
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </CarouselItem>
                                    )
                                })}
                            </CarouselContent>
                            <CarouselPrevious className="hidden md:flex" />
                            <CarouselNext className="hidden md:flex" />
                        </Carousel>
                    )}
                </div>
            </div>
        </div>
    )
}
