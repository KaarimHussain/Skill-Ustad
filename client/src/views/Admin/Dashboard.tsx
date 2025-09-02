"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
    ArrowRight,
    Users,
    BarChart3,
    Shield,
    DollarSign,
    Activity,
    FileText,
    MessageSquare,
    Calendar,
    TrendingUp,
    AlertTriangle,
    Database,
    GraduationCap,
    Building,
    Building2,
} from "lucide-react"
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts"
import type { IStatsCount } from "@/services/admin-dashboard.service"
import { Link } from "react-router-dom"
import AdminDashboardService from "@/services/admin-dashboard.service"

// Sample data for charts
const userGrowthData = [
    { month: "Jan", users: 1200, active: 980 },
    { month: "Feb", users: 1450, active: 1180 },
    { month: "Mar", users: 1680, active: 1420 },
    { month: "Apr", users: 1920, active: 1650 },
    { month: "May", users: 2150, active: 1890 },
    { month: "Jun", users: 2380, active: 2100 },
]

const contentData = [
    { type: "Courses", count: 245, color: "#3b82f6" },
    { type: "Blogs", count: 189, color: "#10b981" },
    { type: "Quizzes", count: 156, color: "#f59e0b" },
    { type: "Roadmaps", count: 98, color: "#8b5cf6" },
]

const systemMetrics = [
    { metric: "CPU Usage", value: 68, color: "#ef4444" },
    { metric: "Memory", value: 45, color: "#3b82f6" },
    { metric: "Storage", value: 72, color: "#f59e0b" },
    { metric: "Network", value: 34, color: "#10b981" },
]

const quickActions = [
    {
        title: "User Management",
        description: "Manage users, roles, and permissions across the platform.",
        icon: Users,
        color: "from-blue-500 to-cyan-600",
        bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        link: "/admin/users",
    },
    {
        title: "Analytics Hub",
        description: "View detailed analytics and performance metrics.",
        icon: BarChart3,
        color: "from-green-500 to-emerald-600",
        bgColor: "bg-gradient-to-br from-green-50 to-emerald-50",
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
        link: "/admin/analytics",
    },
    {
        title: "Content Moderation",
        description: "Review and moderate user-generated content.",
        icon: Shield,
        color: "from-orange-500 to-red-600",
        bgColor: "bg-gradient-to-br from-orange-50 to-red-50",
        iconBg: "bg-orange-100",
        iconColor: "text-orange-600",
        link: "/admin/moderation",
    },
    {
        title: "Pending Requests",
        description: "Review and approve company registration requests",
        icon: Building2,
        color: "from-purple-500 to-indigo-600",
        bgColor: "bg-gradient-to-br from-purple-50 to-indigo-50",
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600",
        link: "/admin/request",
    },
]

const managementTools = [
    {
        title: "News Letter",
        description: "Send news letter to those who are subscribed",
        icon: DollarSign,
        color: "from-emerald-500 to-teal-600",
        bgColor: "bg-gradient-to-br from-emerald-50 to-teal-50",
        iconBg: "bg-emerald-100",
        iconColor: "text-emerald-600",
        link: "/admin/finance",
    },
    {
        title: "System Monitor",
        description: "Monitor server performance and system health.",
        icon: Activity,
        color: "from-red-500 to-pink-600",
        bgColor: "bg-gradient-to-br from-red-50 to-pink-50",
        iconBg: "bg-red-100",
        iconColor: "text-red-600",
        link: "/admin/monitoring",
    },
    {
        title: "Content Library",
        description: "Manage courses, blogs, and educational content.",
        icon: FileText,
        color: "from-indigo-500 to-blue-600",
        bgColor: "bg-gradient-to-br from-indigo-50 to-blue-50",
        iconBg: "bg-indigo-100",
        iconColor: "text-indigo-600",
        link: "/admin/content",
    },
    {
        title: "Support Center",
        description: "Handle user support tickets and communications.",
        icon: MessageSquare,
        color: "from-violet-500 to-purple-600",
        bgColor: "bg-gradient-to-br from-violet-50 to-purple-50",
        iconBg: "bg-violet-100",
        iconColor: "text-violet-600",
        link: "/admin/support",
    },
]

export default function AdminDashboard() {
    const [adminName,] = useState<string>("Admin")
    const [stats, setStats] = useState<IStatsCount>({
        totalStudents: 0,
        totalCompanies: 0,
        totalMentor: 0,
        companiesPendingRequest: 0
    })

    const [statsLoading, setStatsLoading] = useState(false);

    useEffect(() => {
        setStatsLoading(true);
        const fetchStats = async () => {
            try {
                const data = await AdminDashboardService.getStatsCount();
                setStats(data);
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setStatsLoading(false);
            }
        }
        fetchStats();
    }, [])

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-700/40 via-purple-900/10 to-indigo-500/10"></div>
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                    <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-900/40 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
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
                                {adminName}!
                            </span>
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                            Monitor your platform's performance and manage operations efficiently.
                        </p>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mt-8">
                            <Card className="bg-white/80 backdrop-blur-sm border-white/50">
                                <CardContent className="p-4 text-center">
                                    <div className="flex items-center justify-center mb-2">
                                        <Users className="w-5 h-5 text-indigo-600 mr-2" />
                                        <span className="text-sm font-medium text-gray-600">Total Students</span>
                                    </div>
                                    {statsLoading ? (
                                        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                                    ) : (
                                        <div className="text-2xl font-bold text-gray-900">{stats.totalStudents.toLocaleString()}</div>
                                    )}
                                </CardContent>
                            </Card>
                            <Card className="bg-white/80 backdrop-blur-sm border-white/50">
                                <CardContent className="p-4 text-center">
                                    <div className="flex items-center justify-center mb-2">
                                        <GraduationCap className="w-5 h-5 text-green-600 mr-2" />
                                        <span className="text-sm font-medium text-gray-600">Total Mentors</span>
                                    </div>
                                    {statsLoading ? (
                                        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                                    ) : (
                                        <div className="text-2xl font-bold text-gray-900">{stats.totalMentor.toLocaleString()}</div>
                                    )}
                                </CardContent>
                            </Card>
                            <Card className="bg-white/80 backdrop-blur-sm border-white/50">
                                <CardContent className="p-4 text-center">
                                    <div className="flex items-center justify-center mb-2">
                                        <Building className="w-5 h-5 text-emerald-600 mr-2" />
                                        <span className="text-sm font-medium text-gray-600">Total Companies</span>
                                    </div>
                                    {statsLoading ? (
                                        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                                    ) : (
                                        <div className="text-2xl font-bold text-gray-900">{stats.totalCompanies.toLocaleString()}</div>
                                    )}
                                </CardContent>
                            </Card>
                            <Card className="bg-white/80 backdrop-blur-sm border-white/50">
                                <CardContent className="p-4 text-center">
                                    <div className="flex items-center justify-center mb-2">
                                        <AlertTriangle className="w-5 h-5 text-orange-600 mr-2" />
                                        <span className="text-sm font-medium text-gray-600">Pending Company</span>
                                    </div>
                                    {statsLoading ? (
                                        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                                    ) : (
                                        <div className="text-2xl font-bold text-gray-900">{stats.companiesPendingRequest}</div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Analytics Charts Section */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Platform Analytics</h2>
                            <p className="text-gray-600 mt-1">Real-time insights into your platform's performance</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 mb-8 px-4 sm:px-6 lg:px-10">
                        {/* User Growth Chart */}
                        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                            <CardHeader className="px-4 sm:px-6">
                                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                                    User Growth
                                </CardTitle>
                                <CardDescription className="text-sm sm:text-base">Total and active users over time</CardDescription>
                            </CardHeader>
                            <CardContent className="px-4 sm:px-6">
                                <ChartContainer
                                    config={{
                                        users: { label: "Total Users", color: "hsl(var(--chart-1))" },
                                        active: { label: "Active Users", color: "hsl(var(--chart-2))" },
                                    }}
                                    className="w-full h-[250px] sm:h-[300px] lg:h-[350px]"
                                >
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart
                                            accessibilityLayer
                                            data={userGrowthData}
                                            margin={{
                                                left: 8,
                                                right: 8,
                                                top: 8,
                                                bottom: 8,
                                            }}
                                        >
                                            <CartesianGrid vertical={false} />
                                            <XAxis
                                                dataKey="month"
                                                tickLine={false}
                                                axisLine={false}
                                                tickMargin={8}
                                                fontSize={12}
                                                className="text-xs sm:text-sm"
                                            />
                                            <YAxis
                                                tickLine={false}
                                                axisLine={false}
                                                tickMargin={8}
                                                fontSize={12}
                                                className="text-xs sm:text-sm"
                                            />
                                            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                            <defs>
                                                <linearGradient id="fillUsers" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="var(--color-users)" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="var(--color-users)" stopOpacity={0.1} />
                                                </linearGradient>
                                                <linearGradient id="fillActive" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="var(--color-active)" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="var(--color-active)" stopOpacity={0.1} />
                                                </linearGradient>
                                            </defs>
                                            <Area
                                                dataKey="active"
                                                type="natural"
                                                fill="url(#fillActive)"
                                                fillOpacity={0.4}
                                                stroke="var(--color-active)"
                                                stackId="a"
                                            />
                                            <Area
                                                dataKey="users"
                                                type="natural"
                                                fill="url(#fillUsers)"
                                                fillOpacity={0.4}
                                                stroke="var(--color-users)"
                                                stackId="a"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Content Distribution */}
                        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-indigo-600" />
                                    Content Distribution
                                </CardTitle>
                                <CardDescription>Breakdown of content types on the platform</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer
                                    config={{
                                        count: { label: "Count" },
                                        courses: { label: "Courses", color: "#4f46e5" },
                                        blogs: { label: "Blogs", color: "#6366f1" },
                                        quizzes: { label: "Quizzes", color: "#7c3aed" },
                                        roadmaps: { label: "Roadmaps", color: "#8b5cf6" },
                                    }}
                                    className="h-[300px]"
                                >
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            accessibilityLayer
                                            data={contentData}
                                            margin={{
                                                left: 12,
                                                right: 12,
                                            }}
                                        >
                                            <CartesianGrid vertical={false} />
                                            <XAxis
                                                dataKey="type"
                                                tickLine={false}
                                                axisLine={false}
                                                tickMargin={8}
                                                angle={-45}
                                                textAnchor="end"
                                                height={60}
                                            />
                                            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                                            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                                {contentData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            </CardContent>
                        </Card>

                        {/* System Performance */}
                        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Database className="w-5 h-5 text-red-600" />
                                    System Performance
                                </CardTitle>
                                <CardDescription>Current system resource utilization</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer
                                    config={{
                                        value: { label: "Usage %", color: "hsl(var(--chart-1))" },
                                        cpu: { label: "CPU Usage", color: "#ef4444" },
                                        memory: { label: "Memory", color: "#3b82f6" },
                                        storage: { label: "Storage", color: "#f59e0b" },
                                        network: { label: "Network", color: "#10b981" },
                                    }}
                                    className="h-[300px]"
                                >
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            accessibilityLayer
                                            data={systemMetrics}
                                            layout="horizontal"
                                            margin={{
                                                left: 80,
                                            }}
                                        >
                                            <CartesianGrid horizontal={false} />
                                            <YAxis
                                                dataKey="metric"
                                                type="category"
                                                tickLine={false}
                                                tickMargin={10}
                                                axisLine={false}
                                                width={70}
                                            />
                                            <XAxis dataKey="value" type="number" hide />
                                            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                                            <Bar dataKey="value" layout="horizontal" radius={4}>
                                                {systemMetrics.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Quick Actions Section */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Quick Actions</h2>
                            <p className="text-gray-600 mt-1">Essential admin tools at your fingertips</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {quickActions.map((action) => (
                            <Link to={action.link}>
                                <Card
                                    key={action.title}
                                    className={`${action.bgColor} border-0 hover:shadow-xl hover:shadow-slate-100/50 transition-all duration-300 hover:-translate-y-2 cursor-pointer group relative overflow-hidden h-full`}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                    <CardContent className="p-6 relative">
                                        <div
                                            className={`w-12 h-12 ${action.iconBg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm`}
                                        >
                                            <action.icon className={`w-6 h-6 ${action.iconColor}`} />
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-slate-700 transition-colors">
                                            {action.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-4">{action.description}</p>
                                        <div className="flex items-center text-slate-600 text-sm font-medium group-hover:text-slate-700">
                                            Access now
                                            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Management Tools Section */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Management Tools</h2>
                            <p className="text-gray-600 mt-1">Advanced tools for platform administration and monitoring</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {managementTools.map((tool) => (
                            <Card
                                key={tool.title}
                                className={`${tool.bgColor} border-0 hover:shadow-xl hover:shadow-slate-100/50 transition-all duration-300 hover:-translate-y-2 cursor-pointer group relative overflow-hidden h-full`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                <CardContent className="p-6 relative">
                                    <div
                                        className={`w-12 h-12 ${tool.iconBg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm`}
                                    >
                                        <tool.icon className={`w-6 h-6 ${tool.iconColor}`} />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-slate-700 transition-colors">
                                        {tool.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4">{tool.description}</p>
                                    <div className="flex items-center text-slate-600 text-sm font-medium group-hover:text-slate-700">
                                        Manage
                                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
