"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    ArrowRight,
    Target,
    Zap,
    Calendar,
    BookOpen,
    MessageCircle,
    Lightbulb,
    GraduationCap,
} from "lucide-react"

import DashboardService from "@/services/dashboard.service"
import { Link, useNavigate } from "react-router-dom"
import { link } from "fs"
import AddtionalInfoService from "@/services/additional-info.service"
import AuthService from "@/services/auth.service"

const quickLinks = [
    {
        title: "Roadmaps",
        description: "Design step-by-step paths for student success.",
        icon: Target,
        color: "from-indigo-500 to-purple-600",
        bgColor: "bg-gradient-to-br from-indigo-50 to-purple-50",
        iconBg: "bg-indigo-100",
        iconColor: "text-indigo-600",
        action: "generate",
        link: "/mentor/roadmaps"
    },
    {
        title: "My Blogs",
        description: "Share insights and experiences with your audience.",
        icon: BookOpen,
        color: "from-blue-500 to-cyan-600",
        bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        action: "courses",
        link: "/mentor/blogs"
    },
    {
        title: "Create Quiz",
        description: "Challenge students and assess their skills.",
        icon: Zap,
        color: "from-yellow-500 to-orange-600",
        bgColor: "bg-gradient-to-br from-yellow-50 to-orange-50",
        iconBg: "bg-yellow-100",
        iconColor: "text-yellow-600",
        action: "quiz",
        link: "/mentor/quiz"
    },
    {
        title: "Manage Students", // <-- Changed from "View Progress"
        description: "Track mentees and review their activities.",
        icon: GraduationCap,
        color: "from-green-500 to-emerald-600",
        bgColor: "bg-gradient-to-br from-green-50 to-emerald-50",
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
        action: "manage_students",
        link: "/user/manage-students"
    },
];

const contentToolLinks = [
    {
        title: "Create Lessons",
        description: "Upload resources or link AI-generated material.",
        icon: BookOpen,
        color: "from-blue-500 to-cyan-500",
        bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        action: "create_lessons",
        link: "/mentor/create-lessons"
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
        link: "/mentor/schedule-sessions"
    },
    {
        title: "Host Q&A or AMA",
        description: "Engage with mentees via live Q&A sessions.",
        icon: MessageCircle,
        color: "from-orange-500 to-amber-500",
        bgColor: "bg-gradient-to-br from-orange-50 to-amber-50",
        iconBg: "bg-orange-100",
        iconColor: "text-orange-600",
        action: "host_qa",
        link: "/mentor/qa-ama"
    },
    {
        title: "Feedback Hub",
        description: "Review and respond to mentee feedbacks.",
        icon: Lightbulb,
        color: "from-purple-500 to-pink-500",
        bgColor: "bg-gradient-to-br from-purple-50 to-pink-50",
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600",
        action: "ai_suggestions",
        link: "/mentor/ai-lesson-suggestions"
    }
];

export default function MentorDashboard() {
    const [name, setName] = useState<string>("User")
    const navigate = useNavigate();

    const checkInfoData = async () => {
        const role = AuthService.getUserType();
        const email = AuthService.getUserEmail();
        console.log(email);

        var infoModel = {
            role: role ?? "Student",
            email: email ?? ""
        }

        const infoBool = await AddtionalInfoService.infoCheck(infoModel)
        console.log("Current User Additional Info Check", infoBool);

        if (!infoBool) {
            navigate("/mentor/additional-info");
        }
    }

    const getUserName = () => {
        const dashboardService = new DashboardService()
        dashboardService.getUserBasicData().then((name) => {
            setName(name)
        })
    }
    // Animate stats on mount
    useEffect(() => {
        checkInfoData();
        getUserName();

        
    }, [checkInfoData, getUserName])

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
                            Ready to teach students something new?
                        </p>
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
                            <Link to={link.link}>
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

                {/* Content Links Section */}
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
                        {contentToolLinks.map((link) => (
                            <Link to={link.link}>
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
