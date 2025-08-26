"use client"

import { useState } from "react"
import {
    Search,
    Filter,
    ChevronUp,
    MessageSquare,
    Users,
    Clock,
    Tag,
    Loader2,
    RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Logo from "@/components/Logo"
import { Link, useNavigate } from "react-router-dom"
import { useCachedQuestions } from "@/hooks/use-cached-questions"

export default function QA() {
    const { questions, loading, error, refreshQuestions, clearCache } = useCachedQuestions()

    // State for UI
    const [searchQuery, setSearchQuery] = useState("")
    const [activeFilter, setActiveFilter] = useState("all")
    const [sortBy, setSortBy] = useState("newest")
    const [refreshing, setRefreshing] = useState(false)

    const navigate = useNavigate()

    const handleRefresh = async () => {
        setRefreshing(true)
        await refreshQuestions()
        setRefreshing(false)
    }

    // Filter questions based on search and active filter
    const filteredQuestions = questions.filter((question) => {
        const matchesSearch =
            question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            question.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            question.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

        const matchesFilter =
            activeFilter === "all" ||
            (activeFilter === "answered" && question.isAnswered) ||
            (activeFilter === "unanswered" && !question.isAnswered) ||
            (activeFilter === "popular" && question.votes > 20)

        return matchesSearch && matchesFilter
    })

    // Sort questions based on selected sort option
    const sortedQuestions = [...filteredQuestions].sort((a, b) => {
        switch (sortBy) {
            case "votes":
                return b.votes - a.votes
            case "newest":
            default:
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        }
    })

    // Calculate filter counts
    const filterOptions = [
        { id: "all", label: "All Questions", count: questions.length },
        { id: "unanswered", label: "Unanswered", count: questions.filter((q) => !q.isAnswered).length },
        { id: "answered", label: "Answered", count: questions.filter((q) => q.isAnswered).length },
        { id: "popular", label: "Most Popular", count: questions.filter((q) => q.votes > 20).length },
    ]

    // Get popular tags from all questions
    const getPopularTags = () => {
        const tagCounts: { [key: string]: number } = {}
        questions.forEach((question) => {
            question.tags.forEach((tag) => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1
            })
        })

        return Object.entries(tagCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 6)
            .map(([tag]) => tag)
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
                                <span className="text-3xl font-light">Q&A</span>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="container mx-auto px-4 py-12 flex items-center justify-center">
                    <div className="flex items-center space-x-2">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span>Loading questions...</span>
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
                                <span className="text-3xl font-light">Q&A</span>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="container mx-auto px-4 py-12">
                    <Card className="text-center py-12">
                        <CardContent>
                            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Error Loading Questions</h3>
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
                                <span className="text-2xl lg:text-3xl font-light">Q&A</span>
                            </div>

                            {/* Mobile buttons - show only essential ones */}
                            <div className="flex lg:hidden items-center space-x-2">
                                <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
                                    <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                                </Button>
                                <Button onClick={() => navigate("/qa-create")} className="bg-indigo-500 hover:bg-indigo-600" size="sm">
                                    Ask
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={() => navigate("/qa-responses")}
                                    className="bg-indigo-500 hover:bg-indigo-600 cursor-pointer"
                                >
                                    My Q&A's
                                </Button>
                            </div>
                        </div>

                        {/* Search bar - full width on mobile */}
                        <div className="flex-1 lg:max-w-2xl lg:mx-8">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    placeholder="Search questions, tags, or users..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 bg-background"
                                />
                            </div>
                        </div>

                        {/* Desktop buttons - hidden on mobile */}
                        <div className="hidden lg:flex items-center space-x-3">
                            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
                                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                                Refresh
                            </Button>
                            <Button
                                onClick={() => navigate("/qa-responses")}
                                className="bg-indigo-500 hover:bg-indigo-600 cursor-pointer"
                            >
                                My Q&A's
                            </Button>
                            <Button
                                onClick={() => navigate("/qa-create")}
                                className="bg-indigo-500 hover:bg-indigo-600 cursor-pointer"
                            >
                                Ask Question
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar - hidden on mobile, shown on desktop */}
                    <aside className="hidden lg:block lg:w-64 space-y-6">
                        <Card>
                            <CardHeader className="pb-3">
                                <h3 className="font-semibold">Quick Stats</h3>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Total Questions</span>
                                    <span className="font-medium">{questions.length}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Answered</span>
                                    <span className="font-medium text-green-600">{questions.filter((q) => q.isAnswered).length}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Unanswered</span>
                                    <span className="font-medium text-orange-600">{questions.filter((q) => !q.isAnswered).length}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <h3 className="font-semibold">Popular Tags</h3>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {getPopularTags().map((tag) => (
                                        <Badge
                                            key={tag}
                                            variant="secondary"
                                            className="text-xs cursor-pointer hover:bg-secondary/80"
                                            onClick={() => setSearchQuery(tag)}
                                        >
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </aside>

                    {/* Mobile stats card - shown only on mobile */}
                    <div className="lg:hidden mb-6">
                        <Card>
                            <CardContent className="p-4">
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <div className="font-semibold text-lg">{questions.length}</div>
                                        <div className="text-xs text-muted-foreground">Total</div>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-lg text-green-600">
                                            {questions.filter((q) => q.isAnswered).length}
                                        </div>
                                        <div className="text-xs text-muted-foreground">Answered</div>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-lg text-orange-600">
                                            {questions.filter((q) => !q.isAnswered).length}
                                        </div>
                                        <div className="text-xs text-muted-foreground">Unanswered</div>
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

                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-muted-foreground hidden sm:inline">Sort by:</span>
                                <Button
                                    className={`cursor-pointer ${sortBy === "newest" ? "bg-indigo-500 hover:bg-indigo-600" : ""}`}
                                    variant={sortBy === "newest" ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setSortBy("newest")}
                                >
                                    <Clock className="h-4 w-4 mr-1" />
                                    <span className="hidden sm:inline">Newest</span>
                                </Button>
                                <Button
                                    className={`cursor-pointer ${sortBy === "votes" ? "bg-indigo-500 hover:bg-indigo-600" : ""}`}
                                    variant={sortBy === "votes" ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setSortBy("votes")}
                                >
                                    <ChevronUp className="h-4 w-4 mr-1" />
                                    <span className="hidden sm:inline">Votes</span>
                                </Button>
                            </div>
                        </div>

                        {/* Questions List */}
                        <div className="space-y-4">
                            {sortedQuestions.map((question) => (
                                <Link key={question.id} to={`/qa/${question.id}`}>
                                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                                        <CardContent className="">
                                            <div className="flex flex-col sm:flex-row gap-4">
                                                {/* Question Content */}
                                                <div className="flex-1">
                                                    <small className="text-sm">{question.id}</small>
                                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                                                        <h3 className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
                                                            {question.title}
                                                        </h3>
                                                        {question.isAnswered && (
                                                            <Badge
                                                                variant="default"
                                                                className="bg-green-100 text-green-800 border-green-200 self-start"
                                                            >
                                                                Answered
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    <p className="text-muted-foreground mb-4 line-clamp-2 text-sm sm:text-base">
                                                        {question.content.substring(0, 150)}
                                                        {question.content.length > 150 ? "..." : ""}
                                                    </p>

                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                        {question.tags.map((tag) => (
                                                            <Badge key={tag} variant="secondary" className="text-xs">
                                                                <Tag className="h-3 w-3 mr-1" />
                                                                {tag}
                                                            </Badge>
                                                        ))}
                                                    </div>

                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                                            <div className="flex items-center space-x-1">
                                                                <MessageSquare className="h-4 w-4" />
                                                                <span>{question.answers} answers</span>
                                                            </div>
                                                            <div className="flex items-center space-x-1">
                                                                <Users className="h-4 w-4" />
                                                                <span>{question.views} views</span>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center justify-between sm:justify-end space-x-3">
                                                            <span className="text-sm text-muted-foreground">{question.createdAt}</span>
                                                            <div className="flex items-center space-x-2">
                                                                <Avatar className="h-6 w-6">
                                                                    <AvatarImage src={question.author.avatar || "/placeholder.svg"} />
                                                                    <AvatarFallback className="h-15 w-15">
                                                                        {question.author.name
                                                                            .split(" ")
                                                                            .map((n) => n[0])
                                                                            .join("")}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div className="text-sm">
                                                                    <span className="font-medium">{question.author.name}</span>
                                                                    <span className="text-muted-foreground ml-1 hidden sm:inline">
                                                                        ({question.author.reputation})
                                                                    </span>
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
                        {sortedQuestions.length === 0 && (
                            <Card className="text-center py-12">
                                <CardContent>
                                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">No questions found</h3>
                                    <p className="text-muted-foreground mb-4">
                                        {searchQuery ? "Try adjusting your search terms or filters." : "Be the first to ask a question!"}
                                    </p>
                                    <Button onClick={() => navigate("/qa-create")} className="bg-indigo-500 hover:bg-indigo-600">
                                        Ask the First Question
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
