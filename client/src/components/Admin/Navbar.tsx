"use client"

import { Link, useNavigate } from "react-router-dom"
import {
    BarChart3,
    Settings,
    Users,
    FileText,
    Shield,
    Menu,
    LogOut,
    LayoutDashboard,
    User,
    TriangleAlert,
    Bell,
    Database,
    MessageSquare,
    TrendingUp,
    Mail,
    Activity,
} from "lucide-react"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState, useCallback, memo } from "react"
import { Button } from "@/components/ui/button"
import Logo from "../Logo"
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Memoized navigation item component for mobile menu
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
            {badge && <div className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">{badge}</div>}
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
const DesktopNavigationContent = memo(() => (
    <NavigationMenu>
        <NavigationMenuList>
            <NavigationMenuItem>
                <NavigationMenuLink className="bg-transparent p-0 m-0 border-none hover:bg-transparent">
                    <Link to={"/admin/dashboard"}>
                        <Button className="py-3 border-none bg-transparent shadow-transparent text-gray-700 hover:text-gray-900 hover:bg-gray-100/50 rounded-full cursor-pointer">
                            Dashboard
                        </Button>
                    </Link>
                </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent p-0 m-0 border-none hover:bg-transparent">
                    <Button className="py-3 border-none bg-transparent shadow-transparent text-gray-700 hover:text-gray-900 hover:bg-gray-100/50 rounded-full cursor-pointer">
                        Management
                    </Button>
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-white">
                    <ul className="grid gap-3 md:w-[450px] lg:w-[550px] lg:grid-cols-[1fr_.8fr] bg-white p-4 rounded-2xl shadow-xl shadow-gray-200/50">
                        <li className="row-span-3">
                            <NavigationMenuLink asChild>
                                <Link
                                    to="/admin/users"
                                    className="transition-all ease-in-out flex h-full w-full flex-col justify-end rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 p-6 no-underline outline-hidden select-none focus:shadow-md border border-blue-200/50 hover:border-blue-300/60 group relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-indigo-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="relative z-10">
                                        <div className="p-2 bg-blue-100 rounded-lg w-fit mb-4 group-hover:bg-blue-200 transition-colors">
                                            <Users className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <h1 className="mt-4 mb-2 font-bold text-gray-900 text-2xl group-hover:text-gray-800 transition-colors">
                                            User Management
                                        </h1>
                                        <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors">
                                            Manage user accounts, permissions, and access controls across the platform
                                        </p>
                                        <div className="mt-4 flex items-center gap-2 text-xs text-blue-600">
                                            <span>15,000+ Active Users</span>
                                            <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                                            <span>Real-time monitoring</span>
                                        </div>
                                    </div>
                                </Link>
                            </NavigationMenuLink>
                        </li>
                        <li>
                            <NavigationMenuLink asChild>
                                <Link
                                    to="/admin/content"
                                    className="block p-4 rounded-xl bg-emerald-50/60 hover:bg-emerald-100/80 border border-gray-200/60 hover:border-gray-300/60 transition-all duration-200 group backdrop-blur-sm"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                                            <FileText className="w-5 h-5 text-emerald-600" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900 text-sm mb-1 group-hover:text-emerald-800 transition-colors">
                                                Content Management
                                            </div>
                                            <p className="text-gray-600 text-xs leading-relaxed">
                                                Manage courses, blogs, and educational content across the platform
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </NavigationMenuLink>
                        </li>
                        <li>
                            <NavigationMenuLink asChild>
                                <Link
                                    to="/admin/moderation"
                                    className="block p-4 rounded-xl bg-orange-50/60 hover:bg-orange-100/60 border border-orange-200/60 hover:border-orange-300/60 transition-all duration-200 group backdrop-blur-sm"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                                            <Shield className="w-5 h-5 text-orange-600" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900 text-sm mb-1 group-hover:text-orange-800 transition-colors">
                                                Moderation
                                            </div>
                                            <p className="text-gray-600 text-xs leading-relaxed">
                                                Review reported content and manage community guidelines
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </NavigationMenuLink>
                        </li>
                        <li className="row-span-2 col-span-2">
                            <NavigationMenuLink asChild>
                                <Link
                                    to="/admin/system"
                                    className="block p-4 rounded-xl bg-purple-50/60 hover:bg-purple-100/80 border border-purple-200/60 hover:border-purple-300/60 transition-all duration-200 group backdrop-blur-sm"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                                            <Database className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900 text-sm mb-1 group-hover:text-purple-800 transition-colors">
                                                System Management
                                            </div>
                                            <p className="text-gray-600 text-xs leading-relaxed">
                                                Monitor system health, manage backups, and configure platform settings
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
                        Analytics
                    </Button>
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-white">
                    <ul className="grid gap-3 md:w-[400px] lg:w-[500px] lg:grid-cols-[1fr_.8fr] bg-white p-4 rounded-2xl">
                        <li className="row-span-2 col-span-2">
                            <NavigationMenuLink asChild>
                                <Link
                                    to="/admin/analytics"
                                    className="transition-all ease-in-out flex h-full w-full flex-col justify-end rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 hover:from-cyan-100 hover:to-blue-100 p-6 no-underline outline-hidden select-none focus:shadow-md border border-cyan-200/50 hover:border-cyan-300/60 group relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-100/20 to-blue-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="relative z-10">
                                        <div className="p-2 bg-cyan-100 rounded-lg w-fit mb-4 group-hover:bg-cyan-200 transition-colors">
                                            <BarChart3 className="w-6 h-6 text-cyan-600" />
                                        </div>
                                        <h1 className="mt-4 mb-2 font-bold text-gray-900 text-2xl group-hover:text-gray-800 transition-colors">
                                            Platform Analytics
                                        </h1>
                                        <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors">
                                            Comprehensive insights into user engagement, course performance, and platform metrics
                                        </p>
                                        <div className="mt-4 flex items-center gap-2 text-xs text-cyan-600">
                                            <span>Real-time Data</span>
                                            <div className="w-1 h-1 bg-cyan-600 rounded-full"></div>
                                            <span>Advanced Reports</span>
                                        </div>
                                    </div>
                                </Link>
                            </NavigationMenuLink>
                        </li>
                        <li className="row-span-2 col-span-2">
                            <NavigationMenuLink asChild>
                                <Link
                                    to="/admin/reports"
                                    className="block p-4 rounded-xl bg-green-50/60 hover:bg-green-100/80 border border-gray-200/60 hover:border-gray-300/60 transition-all duration-200 group backdrop-blur-sm"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                                            <TrendingUp className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900 text-sm mb-1 group-hover:text-green-800 transition-colors">
                                                Performance Reports
                                            </div>
                                            <p className="text-gray-600 text-xs leading-relaxed">
                                                Detailed performance metrics and custom report generation
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </NavigationMenuLink>
                        </li>
                        <li className="row-span-2 col-span-2">
                            <NavigationMenuLink asChild>
                                <Link
                                    to="/admin/activity"
                                    className="block p-4 rounded-xl bg-amber-50/60 hover:bg-amber-100/60 border border-amber-200/60 hover:border-amber-300/60 transition-all duration-200 group backdrop-blur-sm"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition-colors">
                                            <Activity className="w-5 h-5 text-amber-600" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900 text-sm mb-1 group-hover:text-amber-800 transition-colors">
                                                Activity Monitoring
                                            </div>
                                            <p className="text-gray-600 text-xs leading-relaxed">
                                                Track user activity, system events, and security logs in real-time
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
                    <Link to={"/admin/settings"}>
                        <Button className="py-3 border-none bg-transparent shadow-transparent text-gray-700 hover:text-gray-900 hover:bg-gray-100/50 rounded-full cursor-pointer">
                            Settings
                        </Button>
                    </Link>
                </NavigationMenuLink>
            </NavigationMenuItem>
        </NavigationMenuList>
    </NavigationMenu>
))

// Memoized mobile menu content
const MobileMenuContent = memo(
    ({
        onClose,
        isAuthenticated,
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
                        <span className="text-sm font-medium text-gray-600">Admin Panel</span>
                    </div>
                </div>

                {/* Mobile Navigation Content */}
                <div className="flex-1 py-6 space-y-8 overflow-y-auto">
                    {/* Main Navigation */}
                    <div>
                        <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-4 px-2">Navigation</h3>
                        <div className="space-y-2">
                            <NavigationItem
                                to="/admin/dashboard"
                                icon={LayoutDashboard}
                                title="Dashboard"
                                description="Admin overview and metrics"
                                className="bg-blue-50/60 hover:bg-blue-100/60 border border-blue-200/60 hover:border-blue-300/60"
                                onClick={handleLinkClick}
                            />
                        </div>
                    </div>

                    {/* Management Section */}
                    <div>
                        <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-4 px-2">Management</h3>
                        <div className="space-y-2">
                            <NavigationItem
                                to="/admin/users"
                                icon={Users}
                                title="User Management"
                                description="Manage user accounts and permissions"
                                className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/60 hover:border-blue-300/60"
                                onClick={handleLinkClick}
                            />
                            <NavigationItem
                                to="/admin/content"
                                icon={FileText}
                                title="Content Management"
                                description="Manage courses and educational content"
                                className="bg-gray-100/60 hover:bg-gray-200/60 border border-gray-200/60 hover:border-gray-300/60"
                                onClick={handleLinkClick}
                            />
                            <NavigationItem
                                to="/admin/moderation"
                                icon={Shield}
                                title="Moderation"
                                description="Review and moderate content"
                                className="bg-gray-100/60 hover:bg-gray-200/60 border border-gray-200/60 hover:border-gray-300/60"
                                onClick={handleLinkClick}
                            />
                            <NavigationItem
                                to="/admin/system"
                                icon={Database}
                                title="System Management"
                                description="System health and configuration"
                                className="bg-gray-100/60 hover:bg-gray-200/60 border border-gray-200/60 hover:border-gray-300/60"
                                onClick={handleLinkClick}
                            />
                        </div>
                    </div>

                    {/* Analytics Section */}
                    <div>
                        <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-4 px-2 flex items-center gap-2">
                            <BarChart3 className="w-3 h-3" />
                            Analytics
                        </h3>
                        <div className="space-y-2">
                            <NavigationItem
                                to="/admin/analytics"
                                icon={BarChart3}
                                title="Platform Analytics"
                                description="Comprehensive platform insights"
                                className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200/60 hover:border-cyan-300/60"
                                onClick={handleLinkClick}
                            />
                            <NavigationItem
                                to="/admin/reports"
                                icon={TrendingUp}
                                title="Performance Reports"
                                description="Detailed performance metrics"
                                className="bg-gray-100/60 hover:bg-gray-200/60 border border-gray-200/60 hover:border-gray-300/60"
                                onClick={handleLinkClick}
                            />
                            <NavigationItem
                                to="/admin/activity"
                                icon={Activity}
                                title="Activity Monitoring"
                                description="Real-time activity tracking"
                                className="bg-gray-100/60 hover:bg-gray-200/60 border border-gray-200/60 hover:border-gray-300/60"
                                onClick={handleLinkClick}
                                isLive={true}
                            />
                        </div>
                    </div>

                    {/* Communication Section */}
                    <div>
                        <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-4 px-2 flex items-center gap-2">
                            <MessageSquare className="w-3 h-3" />
                            Communication
                        </h3>
                        <div className="space-y-2">
                            <NavigationItem
                                to="/admin/notifications"
                                icon={Bell}
                                title="Notifications"
                                description="System and user notifications"
                                className="bg-gray-100/60 hover:bg-gray-200/60 border border-gray-200/60 hover:border-gray-300/60"
                                onClick={handleLinkClick}
                                badge="12"
                            />
                            <NavigationItem
                                to="/admin/messages"
                                icon={Mail}
                                title="Messages"
                                description="Admin communications"
                                className="bg-gray-100/60 hover:bg-gray-200/60 border border-gray-200/60 hover:border-gray-300/60"
                                onClick={handleLinkClick}
                            />
                            <NavigationItem
                                to="/admin/announcements"
                                icon={MessageSquare}
                                title="Announcements"
                                description="Platform-wide announcements"
                                className="bg-gray-100/60 hover:bg-gray-200/60 border border-gray-200/60 hover:border-gray-300/60"
                                onClick={handleLinkClick}
                            />
                        </div>
                    </div>
                </div>

                {/* Mobile Auth Buttons */}
                <div className="border-t border-gray-200/60 pt-6 space-y-3">
                    {isAuthenticated && (
                        <Button
                            className="cursor-pointer w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-red-200/50"
                            onClick={() => {
                                handleLogout()
                                handleLinkClick()
                            }}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <LogOut className="w-4 h-4" />
                                <span>Logout</span>
                            </div>
                        </Button>
                    )}
                </div>
            </div>
        )
    },
)

// Main Admin Navbar Component
export default function AdminNavbar() {
    const navigate = useNavigate()
    const { isAuthenticated, userType, refreshAuth } = useAuth()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const handleMobileMenuClose = useCallback(() => {
        setIsMobileMenuOpen(false)
    }, [])

    // Logout logic
    const doLogout = useCallback(() => {
        AuthService.logout()
        refreshAuth()
        navigate("/company/login")
    }, [navigate, refreshAuth])

    return (
        <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200/60 sticky top-0 z-50">
            <nav className="flex items-center justify-between py-4 lg:px-50 md:px-30 sm:px-5 px-5">
                <div className="flex items-center gap-3">
                    <Logo logoOnly />
                    <div className="hidden sm:block">
                        <span className="text-4xl font-light">Admin Panel</span>
                    </div>
                </div>

                <div className="md:hidden sm:hidden lg:block hidden">
                    <DesktopNavigationContent />
                </div>

                <div className="flex gap-2 items-center">
                    {isAuthenticated && (
                        <div className="flex gap-2 items-center">
                            {/* Notifications */}
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="text-gray-700 hover:bg-gray-100/60 relative">
                                            <Bell className="w-5 h-5" />
                                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                                                <span className="text-xs text-white font-bold">3</span>
                                            </div>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Notifications (3 new)</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            {/* Profile */}
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link to="/admin/profile">
                                            <Button variant="ghost" size="icon" className="text-gray-700 hover:bg-gray-100/60">
                                                <User className="w-5 h-5" />
                                            </Button>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Admin Profile</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            {/* Settings */}
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link to="/admin/settings">
                                            <Button variant="ghost" size="icon" className="text-gray-700 hover:bg-gray-100/60">
                                                <Settings className="w-5 h-5" />
                                            </Button>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>System Settings</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            {/* Logout */}
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
                                                <h1 className="text-3xl font-bold">Sign out of Admin Panel?</h1>
                                            </div>
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to sign out of the admin panel? You'll need to sign in again to access admin
                                            features.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            className="bg-red-500 hover:bg-red-600 text-white cursor-pointer"
                                            onClick={doLogout}
                                        >
                                            Sign Out
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
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
