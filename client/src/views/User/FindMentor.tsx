"use client"

import FormatDate from "@/components/FormatDate"
import NotificationService from "@/components/Notification"
import Logo from "@/components/Logo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Calendar, Search, Loader2, RefreshCw, ArrowRight, User, MapPin, Briefcase, Globe } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function FindMentor() {
    // State for data
    const [mentors, setMentors] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // State for UI
    const [searchQuery, setSearchQuery] = useState("")
    const [sortBy, setSortBy] = useState("newest")
    const [refreshing, setRefreshing] = useState(false)

    const navigate = useNavigate()

    const fetchMentors = async () => {
        const BASE_URL = import.meta.env.VITE_SERVER_URL

        setLoading(true)
        try {
            const response = await fetch(`${BASE_URL}/api/user-data/mentor`)
            if (!response.ok) {
                throw new Error("Failed to fetch mentors")
            }
            const data = await response.json()
            console.log("DATA MENTOR:", data)

            setMentors(data)
            setError(null)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMentors()
    }, [])

    const handleRefresh = async () => {
        setRefreshing(true)
        await fetchMentors()
        setRefreshing(false)
    }

    const handleViewMentor = (id: string) => {
        if (!id) {
            NotificationService.error("Failed to View", "Cannot view the Mentor Details! unable to get the id")
            return
        }
        navigate(`/user/find-mentor/${id}`)
    }

    // Filter mentors based on search
    const filteredMentors = mentors.filter((mentor) => {
        const matchesSearch =
            mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            mentor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (mentor.fieldOfExpertise && mentor.fieldOfExpertise.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (mentor.city && mentor.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (mentor.expertiseTags &&
                mentor.expertiseTags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase())))

        return matchesSearch
    })

    // Sort mentors based on selected sort option
    const sortedMentors = [...filteredMentors].sort((a, b) => {
        switch (sortBy) {
            case "name":
                return a.name.localeCompare(b.name)
            case "newest":
            default:
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        }
    })

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-background pt-18">
                <header className="border-b bg-card/50 backdrop-blur-sm sticky top-18 z-50">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Logo logoOnly />
                                <span className="text-3xl font-light">Find Mentors</span>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="container mx-auto px-4 py-12 flex items-center justify-center">
                    <div className="flex items-center space-x-2">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span>Loading mentors...</span>
                    </div>
                </div>
            </div>
        )
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-background pt-18">
                <header className="border-b bg-card/50 backdrop-blur-sm sticky top-18 z-50">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Logo logoOnly />
                                <span className="text-3xl font-light">Find Mentors</span>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="container mx-auto px-4 py-12">
                    <Card className="text-center py-12">
                        <CardContent>
                            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Error Loading Mentors</h3>
                            <p className="text-muted-foreground mb-4">{error}</p>
                            <div className="flex gap-2 justify-center">
                                <Button onClick={handleRefresh} className="bg-indigo-500 hover:bg-indigo-600" disabled={refreshing}>
                                    {refreshing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                    Try Again
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background pt-18">
            {/* Header */}
            <header className="border-b bg-card/50 backdrop-blur-sm sticky top-18 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Logo logoOnly />
                                <span className="text-2xl lg:text-3xl font-light">Find Mentors</span>
                            </div>

                            {/* Mobile refresh button */}
                            <div className="flex lg:hidden items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleRefresh}
                                    disabled={refreshing}
                                    className="border-slate-300 bg-transparent"
                                >
                                    <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                                </Button>
                            </div>
                        </div>

                        {/* Enhanced search bar */}
                        <div className="flex-1 lg:max-w-2xl lg:mx-8">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    placeholder="Search Mentors by name, email, field, city, or tags..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 bg-background"
                                />
                            </div>
                        </div>

                        {/* Desktop controls */}
                        <div className="hidden lg:flex items-center space-x-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleRefresh}
                                disabled={refreshing}
                                className="border-slate-300 font-medium bg-transparent"
                            >
                                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                                Refresh
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Enhanced sidebar */}
                    <aside className="hidden lg:block lg:w-64 space-y-6">
                        <Card>
                            <CardHeader className="pb-3">
                                <h3 className="font-semibold">Quick Stats</h3>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Total Mentors</span>
                                    <span className="font-medium">{mentors.length}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </aside>

                    {/* Mobile stats */}
                    <div className="lg:hidden mb-6">
                        <Card>
                            <CardContent className="p-4">
                                <div className="grid grid-cols-1 gap-4 text-center">
                                    <div>
                                        <div className="font-semibold text-lg">{mentors.length}</div>
                                        <div className="text-xs text-muted-foreground">Total Mentors</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <main className="flex-1">
                        {/* Enhanced filter bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                            <div className="flex items-center space-x-2"></div>

                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-muted-foreground hidden sm:inline">Sort by:</span>
                                <Button
                                    className={`cursor-pointer ${sortBy === "newest" ? "bg-indigo-500 hover:bg-indigo-600" : ""}`}
                                    variant={sortBy === "newest" ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setSortBy("newest")}
                                >
                                    <Calendar className="h-4 w-4 mr-1" />
                                    <span className="hidden sm:inline">Newest</span>
                                </Button>
                                <Button
                                    className={`cursor-pointer ${sortBy === "name" ? "bg-indigo-500 hover:bg-indigo-600" : ""}`}
                                    variant={sortBy === "name" ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setSortBy("name")}
                                >
                                    <User className="h-4 w-4 mr-1" />
                                    <span className="hidden sm:inline">Name</span>
                                </Button>
                            </div>
                        </div>

                        {/* Enhanced mentors grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {sortedMentors.length === 0 ? (
                                <div className="col-span-full text-center py-10">
                                    <p className="text-lg text-gray-500">No mentors found matching your criteria.</p>
                                </div>
                            ) : (
                                sortedMentors.map((mentor) => (
                                    <Card
                                        key={mentor.id}
                                        className="group flex flex-col h-full bg-white border border-indigo-100 rounded-xl overflow-hidden hover:shadow-xl hover:border-indigo-200 transition-all duration-300 cursor-pointer"
                                        onClick={() => handleViewMentor(mentor.id)}
                                    >
                                        <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-2 sm:pb-4">
                                            <div className="flex items-start gap-3 sm:gap-4">
                                                {mentor.profilePicture ? (
                                                    <img
                                                        src={mentor.profilePicture || "/placeholder.svg"}
                                                        alt={mentor.name}
                                                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-indigo-200 group-hover:border-indigo-300 transition-colors"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-400 border-2 border-indigo-200 group-hover:border-indigo-300 transition-colors">
                                                        <User className="w-6 h-6 sm:w-8 sm:h-8" />
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                                                        <span className="block truncate" title={mentor.name}>
                                                            {mentor.name}
                                                        </span>
                                                    </CardTitle>
                                                    <p
                                                        className="text-sm sm:text-base text-indigo-600 font-medium mt-1 truncate"
                                                        title={mentor.fieldOfExpertise || "Expert Mentor"}
                                                    >
                                                        {mentor.fieldOfExpertise || "Expert Mentor"}
                                                    </p>
                                                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1 text-xs sm:text-sm text-gray-600">
                                                        {mentor.city && (
                                                            <div className="flex items-center gap-1 min-w-0">
                                                                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                                                <span className="truncate" title={mentor.city}>
                                                                    {mentor.city}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {mentor.levelOfExpertise && (
                                                            <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 text-xs sm:text-sm">
                                                                {mentor.levelOfExpertise}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="flex-1 px-4 sm:px-6 pb-4">
                                            <div className="space-y-3 sm:space-y-4">
                                                {mentor.industryExperience && (
                                                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                                                        <Briefcase className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                                        <span className="truncate" title={mentor.industryExperience}>
                                                            {mentor.industryExperience}
                                                        </span>
                                                    </div>
                                                )}
                                                {mentor.bio && (
                                                    <p
                                                        className="text-gray-600 text-xs sm:text-sm line-clamp-2 sm:line-clamp-3 text-pretty leading-relaxed"
                                                        title={mentor.bio}
                                                    >
                                                        {mentor.bio}
                                                    </p>
                                                )}
                                                {mentor.expertiseTags && mentor.expertiseTags.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 sm:gap-2">
                                                        {mentor.expertiseTags.slice(0, 3).map((tag: string, index: number) => (
                                                            <Badge
                                                                key={index}
                                                                variant="outline"
                                                                className="px-2 w-auto text-xs sm:text-sm border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                                                                title={tag}
                                                            >
                                                                {tag}
                                                            </Badge>
                                                        ))}
                                                        {mentor.expertiseTags.length > 3 && (
                                                            <Badge variant="outline" className="px-4 w-fit text-xs sm:text-sm border-indigo-200 text-indigo-700">
                                                                +{mentor.expertiseTags.length - 3}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                )}
                                                {mentor.spokenLanguages && mentor.spokenLanguages.length > 0 && (
                                                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                                                        <Globe className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                                        <span className="truncate" title={mentor.spokenLanguages.join(", ")}>
                                                            {mentor.spokenLanguages.join(", ")}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 mt-2 pt-2 border-t border-gray-100">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                                        <span>Joined {FormatDate(mentor.createdAt)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>

                                        <CardFooter className="pt-0 px-4 sm:px-6 pb-4 sm:pb-6">
                                            <Button
                                                onClick={() => handleViewMentor(mentor.id)}
                                                size="lg"
                                                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium text-sm sm:text-base group-hover:bg-indigo-600 transition-colors"
                                            >
                                                View Profile
                                                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}
