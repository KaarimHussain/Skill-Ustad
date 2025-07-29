"use client"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
    ArrowRight,
    BarChart3,
    Brain,
    Code,
    DollarSign,
    Palette,
    Star,
    TrendingUp,
    Target,
    PlayCircle,
    Zap,
    Calendar,
    Trophy,
    BookOpen,
    ChevronRight,
    ChevronLeft,
    Flame,
    Clock,
    Award,
    BookmarkPlus,
    Share2,
    MoreHorizontal,
    Plus,
} from "lucide-react"
import DashboardService from "@/services/dashboard.service"
import { Link } from "react-router-dom"

// Mock service data (replace with your actual service)
const skillCourses = [
    {
        title: "Web Development",
        description: "Learn full-stack development using modern tools like React, Node.js & more.",
        icon: Code,
        color: "from-blue-500/20 to-cyan-500/20",
        iconColor: "text-blue-600",
        borderColor: "hover:border-blue-500/50",
        students: "12,847",
        duration: "16 weeks",
        rating: 4.9,
        level: "Beginner to Advanced",
        projects: 8,
        popular: true,
        progress: 65,
        modules: 12,
        nextMilestone: "React Fundamentals",
        difficulty: "Medium",
        category: "Development",
    },
    {
        title: "UI/UX Design",
        description: "Master design thinking, wireframing & real tools like Figma.",
        icon: Palette,
        color: "from-purple-500/20 to-pink-500/20",
        iconColor: "text-purple-600",
        borderColor: "hover:border-purple-500/50",
        students: "8,932",
        duration: "12 weeks",
        rating: 4.8,
        level: "Beginner to Pro",
        projects: 6,
        popular: false,
        progress: 30,
        modules: 10,
        nextMilestone: "Design Principles",
        difficulty: "Easy",
        category: "Design",
    },
    {
        title: "Digital Marketing",
        description: "Learn SEO, ads, content strategy & data-driven growth.",
        icon: TrendingUp,
        color: "from-green-500/20 to-emerald-500/20",
        iconColor: "text-green-600",
        borderColor: "hover:border-green-500/50",
        students: "6,543",
        duration: "10 weeks",
        rating: 4.7,
        level: "Beginner to Expert",
        projects: 5,
        popular: false,
        progress: 0,
        modules: 8,
        nextMilestone: "SEO Fundamentals",
        difficulty: "Easy",
        category: "Marketing",
    },
    {
        title: "AI & Machine Learning",
        description: "Build smart apps with Python, ML models & real datasets.",
        icon: Brain,
        color: "from-orange-500/20 to-red-500/20",
        iconColor: "text-orange-600",
        borderColor: "hover:border-orange-500/50",
        students: "9,876",
        duration: "20 weeks",
        rating: 4.9,
        level: "Intermediate to Advanced",
        projects: 10,
        popular: true,
        progress: 15,
        modules: 16,
        nextMilestone: "Python Basics",
        difficulty: "Hard",
        category: "AI/ML",
    },
    {
        title: "Freelancing & Monetization",
        description: "Learn how to earn online with your skills.",
        icon: DollarSign,
        color: "from-yellow-500/20 to-amber-500/20",
        iconColor: "text-yellow-600",
        borderColor: "hover:border-yellow-500/50",
        students: "4,321",
        duration: "8 weeks",
        rating: 4.6,
        level: "All Levels",
        projects: 4,
        popular: false,
        progress: 80,
        modules: 6,
        nextMilestone: "Building Your Portfolio",
        difficulty: "Medium",
        category: "Business",
    },
    {
        title: "Data Science",
        description: "Analyze data, build models & make smarter decisions.",
        icon: BarChart3,
        color: "from-cyan-500/20 to-blue-500/20",
        iconColor: "text-cyan-600",
        borderColor: "hover:border-cyan-500/50",
        students: "7,654",
        duration: "18 weeks",
        rating: 4.8,
        level: "Intermediate to Advanced",
        projects: 7,
        popular: false,
        progress: 45,
        modules: 14,
        nextMilestone: "Statistics Fundamentals",
        difficulty: "Hard",
        category: "Data",
    },
]

const quickLinks = [
    {
        title: "Generate Roadmap",
        description: "AI-powered learning path",
        icon: Target,
        color: "from-indigo-500 to-purple-600",
        bgColor: "bg-gradient-to-br from-indigo-50 to-purple-50",
        iconBg: "bg-indigo-100",
        iconColor: "text-indigo-600",
        action: "generate",
    },
    {
        title: "My Courses",
        description: "Continue your journey",
        icon: BookOpen,
        color: "from-blue-500 to-cyan-600",
        bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        action: "courses",
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
    },
    {
        title: "View Progress",
        description: "Track your achievements",
        icon: Trophy,
        color: "from-green-500 to-emerald-600",
        bgColor: "bg-gradient-to-br from-green-50 to-emerald-50",
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
        action: "progress",
    },
]

const stats = [
    { label: "Learning Streak", value: 12, unit: "days", icon: Flame, color: "text-orange-500" },
    { label: "Courses Completed", value: 3, unit: "courses", icon: Award, color: "text-purple-500" },
    { label: "Hours Learned", value: 47, unit: "hours", icon: Clock, color: "text-blue-500" },
    { label: "Skill Points", value: 1250, unit: "points", icon: Star, color: "text-yellow-500" },
]

export default function UserDashboard() {
    const [name, setName] = useState<string>("User")
    const [currentSlide, setCurrentSlide] = useState(0)
    const [animatedStats, setAnimatedStats] = useState(stats.map(() => 0))
    const carouselRef = useRef<HTMLDivElement>(null)

    const getUserName = () => {
        const dashboardService = new DashboardService();
        dashboardService.getUserBasicData().then((name) => {
            setName(name);
        })
    }

    // Animate stats on mount
    useEffect(() => {
        stats.forEach((stat, index) => {
            let current = 0
            const increment = stat.value / 30
            const timer = setInterval(() => {
                current += increment
                if (current >= stat.value) {
                    current = stat.value
                    clearInterval(timer)
                }
                setAnimatedStats((prev) => {
                    const newStats = [...prev]
                    newStats[index] = Math.floor(current)
                    return newStats
                })
            }, 50)
        })

        getUserName();
    }, [])

    const handleQuickAction = (action: string) => {
        console.log(`Quick action: ${action}`)
    }

    const handleStartCourse = (courseTitle: string) => {
        console.log(`Starting course: ${courseTitle}`)
    }

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % Math.ceil(skillCourses.length / 2))
    }

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + Math.ceil(skillCourses.length / 2)) % Math.ceil(skillCourses.length / 2))
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

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
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

                        {/* Stats Overview */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
                            {stats.map((stat, index) => (
                                <div
                                    key={stat.label}
                                    className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30 hover:bg-white/30 transition-all duration-300 group"
                                >
                                    <div className="flex items-center justify-center mb-2">
                                        <stat.icon
                                            className={`w-6 h-6 ${stat.color} group-hover:scale-110 transition-transform duration-300`}
                                        />
                                    </div>
                                    <div className="text-2xl font-bold text-gray-900 mb-1">
                                        {animatedStats[index]}
                                        <span className="text-sm font-normal text-gray-600 ml-1">{stat.unit}</span>
                                    </div>
                                    <div className="text-xs text-gray-600">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Quick Links Section */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Quick Actions</h2>
                            <p className="text-gray-600 mt-1">Jump right into your learning experience</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {quickLinks.map((link) => (
                            <Card
                                key={link.title}
                                className={`${link.bgColor} border-0 hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-300 hover:-translate-y-2 cursor-pointer group relative overflow-hidden`}
                                onClick={() => handleQuickAction(link.action)}
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
                        ))}
                    </div>
                </div>

                {/* Learning Roadmaps Carousel Section */}
                <div>
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Learning Roadmaps</h2>
                                <p className="text-gray-600 mt-1">Structured paths to master new skills</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={prevSlide}
                                    className="h-10 w-10 rounded-full bg-white/80 hover:bg-white border-gray-200 hover:border-gray-300"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={nextSlide}
                                    className="h-10 w-10 rounded-full bg-white/80 hover:bg-white border-gray-200 hover:border-gray-300"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                            <Button variant="outline" className="hidden sm:flex bg-white/80 hover:bg-white cursor-pointer">
                                View All Paths
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                            <Link to={"/user/roadmap-gen"}>
                                <Button className="bg-indigo-500 hover:bg-indigo-600 text-white cursor-pointer">
                                    <Plus />
                                    New Roadmap
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Carousel Container */}
                    <div className="relative overflow-hidden" ref={carouselRef}>
                        <div
                            className="flex transition-transform duration-500 ease-in-out gap-6"
                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                        >
                            {Array.from({ length: Math.ceil(skillCourses.length / 2) }).map((_, slideIndex) => (
                                <div key={slideIndex} className="min-w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {skillCourses.slice(slideIndex * 2, slideIndex * 2 + 2).map((course) => (
                                        <Card
                                            key={course.title}
                                            className={`bg-white/90 backdrop-blur-sm border border-white/60 ${course.borderColor} transition-all duration-300 group hover:transform hover:-translate-y-3 relative overflow-hidden hover:shadow-2xl hover:shadow-indigo-100/50`}
                                        >
                                            {/* Popular Badge */}
                                            {course.popular && (
                                                <div className="absolute top-4 right-4 z-10">
                                                    <Badge className="bg-indigo-500 text-white border-0 text-xs font-medium animate-pulse">
                                                        🔥 Most Popular
                                                    </Badge>
                                                </div>
                                            )}

                                            {/* Background Gradient */}
                                            <div className={`absolute inset-0 bg-gradient-to-br ${course.color} opacity-60`}></div>

                                            <CardContent className="p-6 relative z-10">
                                                {/* Header */}
                                                <div className="flex items-start justify-between mb-6">
                                                    <div className="flex items-start gap-4">
                                                        <div className="p-3 bg-white/90 backdrop-blur-sm rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                                                            <course.icon className={`w-8 h-8 ${course.iconColor}`} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors">
                                                                {course.title}
                                                            </h3>
                                                            <div className="flex items-center gap-3 text-sm mb-2">
                                                                <div className="flex items-center gap-1">
                                                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                                    <span className="font-medium text-gray-700">{course.rating}</span>
                                                                </div>
                                                                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                                                <span className="text-gray-600">{course.level}</span>
                                                            </div>
                                                            <Badge className={`text-xs ${getDifficultyColor(course.difficulty)}`}>
                                                                {course.difficulty}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </div>

                                                {/* Description */}
                                                <p className="text-gray-700 text-sm leading-relaxed mb-6">{course.description}</p>

                                                {/* Progress Bar */}
                                                <div className="mb-6">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-sm font-medium text-gray-700">Progress</span>
                                                        <span className="text-sm text-gray-600">{course.progress}%</span>
                                                    </div>
                                                    <Progress value={course.progress} className="h-2" />
                                                    {course.progress > 0 ? (
                                                        <p className="text-xs text-gray-500 mt-1">Next: {course.nextMilestone}</p>
                                                    ) : (
                                                        <p className="text-xs text-gray-500 mt-1">Ready to start • Next: {course.nextMilestone}</p>
                                                    )}
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex gap-2">
                                                    <Button
                                                        className="flex-1 bg-indigo-500 hover:bg-indigo-600 cursor-pointer text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 group-hover:scale-[1.02]"
                                                        onClick={() => handleStartCourse(course.title)}
                                                    >
                                                        <PlayCircle className="w-4 h-4 mr-2" />
                                                        {course.progress === 0 ? "Start Learning" : "Continue"}
                                                    </Button>
                                                    <Button variant="outline" size="icon" className="bg-white/80 hover:bg-white">
                                                        <BookmarkPlus className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="outline" size="icon" className="bg-white/80 hover:bg-white">
                                                        <Share2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Carousel Indicators */}
                    <div className="flex justify-center mt-8 gap-2">
                        {Array.from({ length: Math.ceil(skillCourses.length / 2) }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentSlide ? "bg-indigo-600 w-8" : "bg-gray-300 hover:bg-gray-400"
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Mobile View All Button */}
                <div className="mt-8 text-center sm:hidden">
                    <Button variant="outline" className="w-full bg-white/80 hover:bg-white">
                        View All Learning Paths
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
