"use client"

import { useState } from "react"
import {
    Search,
    Filter,
    BookOpen,
    Tag,
    Loader2,
    RefreshCw,
    Calendar,
    User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Logo from "@/components/Logo"
import { Link, useNavigate } from "react-router-dom"
import { usePublicRoadmaps } from "@/hooks/use-public-roadmaps"

export default function Roadmap() {
    const { roadmaps, loading, error, refreshRoadmaps, clearCache } = usePublicRoadmaps()

    // State for UI
    const [searchQuery, setSearchQuery] = useState("")
    const [activeFilter, setActiveFilter] = useState("all")
    const [sortBy, ] = useState("newest")
    const [refreshing, setRefreshing] = useState(false)

    const navigate = useNavigate()

    const handleRefresh = async () => {
        setRefreshing(true)
        await refreshRoadmaps()
        setRefreshing(false)
    }

    // Filter roadmaps based on search and active filter
    const filteredRoadmaps = roadmaps.filter((roadmap) => {
        const matchesSearch =
            roadmap.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            roadmap.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
            roadmap.difficulty?.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesFilter =
            activeFilter === "all" ||
            (activeFilter === "easy" && roadmap.difficulty?.toLowerCase() === "easy") ||
            (activeFilter === "medium" && roadmap.difficulty?.toLowerCase() === "medium") ||
            (activeFilter === "hard" && roadmap.difficulty?.toLowerCase() === "hard")

        return matchesSearch && matchesFilter
    })

    // Sort roadmaps based on selected sort option
    const sortedRoadmaps = [...filteredRoadmaps].sort((a, b) => {
        switch (sortBy) {
            case "views":
                return (b.views || 0) - (a.views || 0)
            case "newest":
            default:
                return new Date(b.createdAt?.toDate() || 0).getTime() - new Date(a.createdAt?.toDate() || 0).getTime()
        }
    })

    // Calculate filter counts
    const filterOptions = [
        { id: "all", label: "All Roadmaps", count: roadmaps.length },
        { id: "easy", label: "Easy", count: roadmaps.filter((r) => r.difficulty?.toLowerCase() === "easy").length },
        { id: "medium", label: "Medium", count: roadmaps.filter((r) => r.difficulty?.toLowerCase() === "medium").length },
        { id: "hard", label: "Hard", count: roadmaps.filter((r) => r.difficulty?.toLowerCase() === "hard").length },
    ]

    // Get difficulty color
    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty?.toLowerCase()) {
            case "beginner":
                return "bg-green-100 text-green-800 border-green-200"
            case "intermediate":
                return "bg-yellow-100 text-yellow-800 border-yellow-200"
            case "advanced":
                return "bg-red-100 text-red-800 border-red-200"
            default:
                return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-background pt-18">
                <header className="border-b bg-card/50 backdrop-blur-sm sticky top-18 z-50">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Logo logoOnly />
                                <span className="text-3xl font-light">Public Roadmaps</span>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="container mx-auto px-4 py-12 flex items-center justify-center">
                    <div className="flex items-center space-x-2">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span>Loading roadmaps...</span>
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
                                <span className="text-3xl font-light">Public Roadmaps</span>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="container mx-auto px-4 py-12">
                    <Card className="text-center py-12">
                        <CardContent>
                            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Error Loading Roadmaps</h3>
                            <p className="text-muted-foreground mb-4">{error}</p>
                            <div className="flex gap-2 justify-center">
                                <Button onClick={handleRefresh} className="bg-indigo-500 hover:bg-indigo-600" disabled={refreshing}>
                                    {refreshing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                    Try Again
                                </Button>
                                <Button onClick={clearCache} variant="outline">
                                    Clear Cache
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
                                <div>
                                    <span className="text-2xl lg:text-3xl font-light">Public Roadmaps</span>
                                    <p className="text-sm text-muted-foreground hidden lg:block">
                                        Discover inspiring learning journeys from professionals and students worldwide
                                    </p>
                                </div>
                            </div>

                            {/* Mobile buttons */}
                            <div className="flex lg:hidden items-center space-x-2">
                                <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
                                    <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                                </Button>
                                <Button onClick={() => navigate("/user/roadmap-gen")} className="bg-indigo-500 hover:bg-indigo-600" size="sm">
                                    Create
                                </Button>
                            </div>
                        </div>

                        {/* Search bar */}
                        <div className="flex-1 lg:max-w-2xl lg:mx-8">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    placeholder="Search roadmaps, tags, or difficulty..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 bg-background"
                                />
                            </div>
                        </div>

                        {/* Desktop buttons */}
                        <div className="hidden lg:flex items-center space-x-3">
                            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
                                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                                Refresh
                            </Button>
                            <Button
                                onClick={() => navigate("/user/roadmap-gen")}
                                className="bg-indigo-500 hover:bg-indigo-600 cursor-pointer"
                            >
                                Create Roadmap
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar - hidden on mobile */}
                    <aside className="hidden lg:block lg:w-64 space-y-6">
                        <Card>
                            <CardHeader className="pb-3">
                                <h3 className="font-semibold">Quick Stats</h3>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Total Roadmaps</span>
                                    <span className="font-medium">{roadmaps.length}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Easy</span>
                                    <span className="font-medium text-green-600">
                                        {roadmaps.filter((r) => r.difficulty?.toLowerCase() === "easy").length}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Medium</span>
                                    <span className="font-medium text-yellow-600">
                                        {roadmaps.filter((r) => r.difficulty?.toLowerCase() === "medium").length}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Hard</span>
                                    <span className="font-medium text-red-600">
                                        {roadmaps.filter((r) => r.difficulty?.toLowerCase() === "hard").length}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </aside>

                    {/* Mobile stats card */}
                    <div className="lg:hidden mb-6">
                        <Card>
                            <CardContent className="p-4">
                                <div className="grid grid-cols-4 gap-4 text-center">
                                    <div>
                                        <div className="font-semibold text-lg">{roadmaps.length}</div>
                                        <div className="text-xs text-muted-foreground">Total</div>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-lg text-green-600">
                                            {roadmaps.filter((r) => r.difficulty?.toLowerCase() === "easy").length}
                                        </div>
                                        <div className="text-xs text-muted-foreground">Easy</div>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-lg text-yellow-600">
                                            {roadmaps.filter((r) => r.difficulty?.toLowerCase() === "medium").length}
                                        </div>
                                        <div className="text-xs text-muted-foreground">Medium</div>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-lg text-red-600">
                                            {roadmaps.filter((r) => r.difficulty?.toLowerCase() === "hard").length}
                                        </div>
                                        <div className="text-xs text-muted-foreground">Hard</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <main className="flex-1">
                        {/* Filter Bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                            <div className="flex items-center space-x-2">
                                <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <div className="flex space-x-1 overflow-x-auto pb-2 sm:pb-0">
                                    {filterOptions.map((option) => (
                                        <Button
                                            key={option.id}
                                            variant={activeFilter === option.id ? "default" : "ghost"}
                                            size="sm"
                                            onClick={() => setActiveFilter(option.id)}
                                            className={`text-sm cursor-pointer whitespace-nowrap flex-shrink-0 ${activeFilter === option.id ? "bg-indigo-500 hover:bg-indigo-600" : ""
                                                }`}
                                        >
                                            <span className="hidden sm:inline">{option.label}</span>
                                            <span className="sm:hidden">{option.label.split(" ")[0]}</span>
                                            <Badge variant="secondary" className="ml-2 text-xs">
                                                {option.count}
                                            </Badge>
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Roadmaps List */}
                        <div className="space-y-4">
                            {sortedRoadmaps.map((roadmap) => (
                                <Link key={roadmap.id} to={`/user/roadmap/${roadmap.id}`}>
                                    <Card className="hover:shadow-md transition-shadow cursor-pointer mb-3">
                                        <CardContent>
                                            <div className="flex flex-col sm:flex-row gap-4">
                                                {/* Roadmap Content */}
                                                <div className="flex-1">
                                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                                                        <h3 className="text-4xl font-semibold text-foreground hover:text-primary transition-colors">
                                                            {roadmap.title}
                                                        </h3>
                                                        <div className="flex gap-2">
                                                            {roadmap.difficulty && (
                                                                <Badge
                                                                    variant="outline"
                                                                    className={getDifficultyColor(roadmap.difficulty)}
                                                                >
                                                                    {roadmap.difficulty}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <p className="text-muted-foreground mb-4 line-clamp-2 text-sm sm:text-base">
                                                        {roadmap.nodes?.length || 0} learning steps •
                                                        Created {roadmap.createdAt?.toDate().toLocaleDateString() || "Recently"}
                                                    </p>

                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                        {roadmap.tags?.slice(0, 4).map((tag) => (
                                                            <Badge key={tag} variant="secondary" className="text-xs">
                                                                <Tag className="h-3 w-3 mr-1" />
                                                                {tag}
                                                            </Badge>
                                                        ))}
                                                        {(roadmap.tags?.length || 0) > 4 && (
                                                            <Badge variant="secondary" className="text-xs">
                                                                +{(roadmap.tags?.length || 0) - 4} more
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                                        <div className="flex items-center justify-between sm:justify-end space-x-3">
                                                            <span className="text-sm text-muted-foreground">
                                                                <Calendar className="h-3 w-3 inline mr-1" />
                                                                {roadmap.createdAt?.toDate().toLocaleDateString() || "Recently"}
                                                            </span>
                                                            <div className="flex items-center space-x-2">
                                                                <Avatar className="h-6 w-6">
                                                                    <AvatarFallback className="text-xs">
                                                                        <User className="h-3 w-3" />
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div className="text-sm">
                                                                    <span className="font-medium">{roadmap.authorName || "Anonymous"}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>

                        {/* Empty State */}
                        {sortedRoadmaps.length === 0 && (
                            <Card className="text-center py-12">
                                <CardContent>
                                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">No roadmaps found</h3>
                                    <p className="text-muted-foreground mb-4">
                                        {searchQuery ? "Try adjusting your search terms or filters." : "Be the first to create a public roadmap!"}
                                    </p>
                                    <Button onClick={() => navigate("/user/roadmap-gen")} className="bg-indigo-500 hover:bg-indigo-600">
                                        Create First Roadmap
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </main>
                </div>
            </div>
        </div>
    )
}