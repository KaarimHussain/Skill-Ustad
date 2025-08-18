"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Home, ArrowLeft, Search, Mail, RefreshCw } from "lucide-react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function NotFound() {
    const navigate = useNavigate()
    const [countdown, setCountdown] = useState(10)
    const [isAutoRedirect, setIsAutoRedirect] = useState(true)

    // Auto redirect countdown
    useEffect(() => {
        if (!isAutoRedirect) return

        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    navigate("/")
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [navigate, isAutoRedirect])

    const handleGoHome = () => {
        navigate("/")
    }

    const handleGoBack = () => {
        window.history.back()
    }

    const handleRefresh = () => {
        window.location.reload()
    }

    const stopAutoRedirect = () => {
        setIsAutoRedirect(false)
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-white via-indigo-50/30 to-white flex items-center justify-center p-4">
            <div className="max-w-4xl mx-auto text-center">
                {/* Animated 404 */}
                <div className="relative mb-8">
                    <div className="text-[12rem] md:text-[16rem] font-bold text-indigo-100 select-none animate-pulse">404</div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent animate-bounce">
                            404
                        </div>
                    </div>

                    {/* Floating elements */}
                    <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-indigo-400 rounded-full animate-ping opacity-75"></div>
                    <div className="absolute top-3/4 right-1/4 w-6 h-6 bg-indigo-300 rounded-full animate-pulse opacity-60"></div>
                    <div className="absolute top-1/2 left-1/6 w-3 h-3 bg-indigo-500 rounded-full animate-bounce opacity-80"></div>
                </div>

                {/* Main content */}
                <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm max-w-2xl mx-auto">
                    <CardContent className="p-8 md:p-12">
                        <div className="space-y-6">
                            {/* Title and description */}
                            <div className="space-y-4">
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Oops! Page Not Found</h1>
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    The page you're looking for seems to have wandered off into the digital void. Don't worry, it happens
                                    to the best of us!
                                </p>
                            </div>

                            {/* Auto redirect notice */}
                            {isAutoRedirect && (
                                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                                    <div className="flex items-center justify-center gap-2 text-indigo-700">
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                        <span className="text-sm">
                                            Redirecting to home page in <span className="font-bold text-indigo-800">{countdown}</span> seconds
                                        </span>
                                    </div>
                                    <button
                                        onClick={stopAutoRedirect}
                                        className="text-xs text-indigo-600 hover:text-indigo-800 underline mt-2"
                                    >
                                        Cancel auto-redirect
                                    </button>
                                </div>
                            )}

                            {/* Action buttons */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                                <Button
                                    onClick={handleGoHome}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white h-12 rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-indigo-200/50"
                                >
                                    <Home className="w-4 h-4 mr-2" />
                                    Go Home
                                </Button>

                                <Button
                                    onClick={handleGoBack}
                                    variant="outline"
                                    className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 h-12 rounded-xl font-medium transition-all duration-200 hover:scale-105 bg-transparent"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Go Back
                                </Button>

                                <Button
                                    onClick={handleRefresh}
                                    variant="outline"
                                    className="border-gray-200 text-gray-700 hover:bg-gray-50 h-12 rounded-xl font-medium transition-all duration-200 hover:scale-105 sm:col-span-2 lg:col-span-1 bg-transparent"
                                >
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Refresh Page
                                </Button>
                            </div>

                            {/* Helpful suggestions */}
                            <div className="pt-6 border-t border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">What can you do?</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                                        <Search className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-medium text-gray-900">Check the URL</h4>
                                            <p className="text-sm text-gray-600">Make sure the web address is spelled correctly</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                                        <Mail className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-medium text-gray-900">Contact Support</h4>
                                            <p className="text-sm text-gray-600">Let us know if you think this is an error</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Popular links */}
                            <div className="pt-6 border-t border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Pages</h3>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {[
                                        { name: "Home", path: "/" },
                                        { name: "About", path: "/about" },
                                        { name: "Services", path: "/services" },
                                        { name: "Contact", path: "/contact" },
                                        { name: "Login", path: "/login" },
                                        { name: "Sign Up", path: "/signup" },
                                    ].map((link) => (
                                        <button
                                            key={link.name}
                                            onClick={() => navigate(link.path)}
                                            className="px-4 py-2 text-sm text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                                        >
                                            {link.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Fun fact */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500">
                        💡 Fun fact: The first 404 error was at CERN in 1992, where Tim Berners-Lee's team couldn't find a requested
                        file on their server.
                    </p>
                </div>
            </div>
        </div>
    )
}
