"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Bell, MessageSquare, Search, Users } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import NotificationService from "./Notification"

export default function CommunityNavbar() {
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleMessageRedirect = () => {
        if (!isAuthenticated) {
            NotificationService.info("Login Required", "You need to login first in order to view your messages");
            navigate("/login")
        } else {
            navigate("/messages")
        }
    }

    const handleNotificationRedirect = () => {
        if (!isAuthenticated) {
            NotificationService.info("Login Required", "You need to login first in order to view your notification");
            navigate("/login")
        } else {
            navigate("/notifications")
        }
    }

    return (
        <nav className="w-full bg-white/95 backdrop-blur-md border-b border-indigo-100 shadow-sm px-4 sm:px-6 lg:px-8 py-3 fixed top-18 z-40">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
                <Link to="/community">
                    <div className="flex items-center gap-3 flex-1">
                        <div className="flex items-center justify-center w-10 h-10 bg-indigo-500 rounded-xl shadow-sm">
                            <Users className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-2xl sm:text-3xl font-bold text-indigo-900 tracking-tight">Community</h1>
                            <p className="text-indigo-600 text-xs sm:text-sm font-medium hidden sm:block">Connect & Collaborate</p>
                        </div>
                    </div>
                </Link>

                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Search Button */}
                    <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                        <DialogTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="relative bg-indigo-50 hover:bg-indigo-100 text-indigo-700 hover:text-indigo-800 border border-indigo-200 hover:border-indigo-300 transition-all duration-200 h-9 w-9 sm:h-10 sm:w-auto sm:px-4"
                            >
                                <Search className="w-4 h-4" />
                                <span className="hidden sm:inline-block ml-2 text-sm font-medium">Search</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle className="text-indigo-900">Search Community</DialogTitle>
                            </DialogHeader>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                                    <Search className="w-4 h-4 text-indigo-400" />
                                </div>
                                <Input
                                    type="text"
                                    placeholder="Search posts, users, topics..."
                                    className="pl-10 pr-3 py-2 text-sm border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500"
                                    autoFocus
                                />
                            </div>
                        </DialogContent>
                    </Dialog>

                    {/* Messages Button */}
                    <Button
                        onClick={handleMessageRedirect}
                        variant="ghost"
                        size="sm"
                        className="relative bg-indigo-50 hover:bg-indigo-100 text-indigo-700 hover:text-indigo-800 border border-indigo-200 hover:border-indigo-300 transition-all duration-200 h-9 w-9 sm:h-10 sm:w-auto sm:px-4"
                    >
                        <MessageSquare className="w-4 h-4" />
                        <span className="hidden sm:inline-block ml-2 text-sm font-medium">Messages</span>
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white shadow-sm"></span>
                    </Button>

                    {/* Notifications Button */}
                    <Button
                        onClick={handleNotificationRedirect}
                        variant="ghost"
                        size="sm"
                        className="relative bg-indigo-50 hover:bg-indigo-100 text-indigo-700 hover:text-indigo-800 border border-indigo-200 hover:border-indigo-300 transition-all duration-200 h-9 w-9 sm:h-10 sm:w-auto sm:px-4"
                    >
                        <Bell className="w-4 h-4" />
                        <span className="hidden sm:inline-block ml-2 text-sm font-medium">Notifications</span>
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full border-2 border-white shadow-sm animate-pulse"></span>
                    </Button>
                </div>
            </div>
        </nav>
    )
}
