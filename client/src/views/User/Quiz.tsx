"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Search,
    Clock,
    Users,
    Trophy,
    Star,
    Play,
    BookOpen,
    Brain,
    Code,
    Palette,
    Calculator,
    Globe,
    Microscope,
    TrendingUp,
    ChevronRight,
    Hash,
} from "lucide-react"
import { useState } from "react"

// Sample quiz data - replace with your actual data
const quizzes = [
    {
        id: 1,
        title: "JavaScript Fundamentals",
        description: "Test your knowledge of JavaScript basics including variables, functions, and DOM manipulation.",
        category: "Programming",
        difficulty: "Beginner",
        duration: 15,
        questions: 20,
        participants: 1250,
        rating: 4.8,
        tags: ["JavaScript", "Web Development", "Frontend"],
        featured: true,
    },
    {
        id: 2,
        title: "React Advanced Concepts",
        description: "Deep dive into React hooks, context API, performance optimization, and advanced patterns.",
        category: "Programming",
        difficulty: "Advanced",
        duration: 30,
        questions: 25,
        participants: 890,
        rating: 4.9,
        tags: ["React", "Hooks", "Performance"],
        featured: false,
    },
    {
        id: 3,
        title: "UI/UX Design Principles",
        description: "Learn about design thinking, user experience principles, and modern design trends.",
        category: "Design",
        difficulty: "Intermediate",
        duration: 20,
        questions: 18,
        participants: 2100,
        rating: 4.7,
        tags: ["UI/UX", "Design", "User Experience"],
        featured: true,
    },
    {
        id: 4,
        title: "Data Structures & Algorithms",
        description: "Master fundamental data structures and algorithmic thinking for technical interviews.",
        category: "Computer Science",
        difficulty: "Advanced",
        duration: 45,
        questions: 30,
        participants: 750,
        rating: 4.6,
        tags: ["Algorithms", "Data Structures", "Interview Prep"],
        featured: false,
    },
    {
        id: 5,
        title: "Digital Marketing Basics",
        description: "Introduction to SEO, social media marketing, content strategy, and analytics.",
        category: "Marketing",
        difficulty: "Beginner",
        duration: 25,
        questions: 22,
        participants: 1800,
        rating: 4.5,
        tags: ["SEO", "Social Media", "Content Marketing"],
        featured: false,
    },
    {
        id: 6,
        title: "Python for Data Science",
        description: "Learn Python libraries like Pandas, NumPy, and Matplotlib for data analysis.",
        category: "Data Science",
        difficulty: "Intermediate",
        duration: 35,
        questions: 28,
        participants: 950,
        rating: 4.8,
        tags: ["Python", "Data Analysis", "Machine Learning"],
        featured: true,
    },
]

const categories = [
    { name: "All Categories", value: "all", icon: BookOpen },
    { name: "Programming", value: "programming", icon: Code },
    { name: "Design", value: "design", icon: Palette },
    { name: "Computer Science", value: "computer-science", icon: Brain },
    { name: "Marketing", value: "marketing", icon: TrendingUp },
    { name: "Data Science", value: "data-science", icon: Microscope },
    { name: "Mathematics", value: "mathematics", icon: Calculator },
    { name: "General Knowledge", value: "general", icon: Globe },
]

const difficulties = ["All Levels", "Beginner", "Intermediate", "Advanced"]

export default function Quiz() {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [selectedDifficulty, setSelectedDifficulty] = useState("All Levels")
    const [sortBy, setSortBy] = useState("popular")

    // Filter and sort quizzes
    const filteredQuizzes = quizzes
        .filter((quiz) => {
            const matchesSearch =
                quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                quiz.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                quiz.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

            const matchesCategory =
                selectedCategory === "all" || quiz.category.toLowerCase().replace(/\s+/g, "-") === selectedCategory

            const matchesDifficulty = selectedDifficulty === "All Levels" || quiz.difficulty === selectedDifficulty

            return matchesSearch && matchesCategory && matchesDifficulty
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "popular":
                    return b.participants - a.participants
                case "rating":
                    return b.rating - a.rating
                case "newest":
                    return b.id - a.id
                case "duration":
                    return a.duration - b.duration
                default:
                    return 0
            }
        })

    const featuredQuizzes = quizzes.filter((quiz) => quiz.featured)

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case "Beginner":
                return "bg-green-100 text-green-700 border-green-200"
            case "Intermediate":
                return "bg-yellow-100 text-yellow-700 border-yellow-200"
            case "Advanced":
                return "bg-red-100 text-red-700 border-red-200"
            default:
                return "bg-gray-100 text-gray-700 border-gray-200"
        }
    }

    const getCategoryIcon = (category: string) => {
        const categoryData = categories.find((cat) => cat.name.toLowerCase() === category.toLowerCase())
        return categoryData?.icon || BookOpen
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-white via-indigo-50/30 to-white py-24">
            <div className="container mx-auto py-8 px-4 md:px-10 lg:px-15">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Explore Quizzes</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Discover, learn, and challenge yourself with our comprehensive collection of quizzes across various topics
                        and skill levels.
                    </p>
                </div>

                {/* Featured Quizzes */}
                {featuredQuizzes.length > 0 && (
                    <div className="mb-12">
                        <div className="flex items-center gap-2 mb-6">
                            <Trophy className="w-6 h-6 text-indigo-600" />
                            <h2 className="text-2xl font-bold text-gray-900">Featured Quizzes</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredQuizzes.map((quiz) => {
                                const CategoryIcon = getCategoryIcon(quiz.category)
                                return (
                                    <Card
                                        key={quiz.id}
                                        className="group border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden"
                                    >
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <Badge className="bg-indigo-600 text-white border-0">Featured</Badge>
                                                <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                                                    <CategoryIcon className="w-5 h-5 text-indigo-600" />
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                                        {quiz.title}
                                                    </h3>
                                                    <p className="text-gray-600 text-sm line-clamp-2">{quiz.description}</p>
                                                </div>

                                                <div className="flex flex-wrap gap-2">
                                                    {quiz.tags.slice(0, 3).map((tag) => (
                                                        <Badge key={tag} variant="secondary" className="bg-indigo-100 text-indigo-700 text-xs">
                                                            <Hash className="w-3 h-3 mr-1" />
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>

                                                <div className="flex items-center justify-between text-sm text-gray-500">
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="w-4 h-4" />
                                                            <span>{quiz.duration}m</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Users className="w-4 h-4" />
                                                            <span>{quiz.participants.toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                        <span className="font-medium">{quiz.rating}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between pt-2">
                                                    <Badge variant="outline" className={getDifficultyColor(quiz.difficulty)}>
                                                        {quiz.difficulty}
                                                    </Badge>
                                                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                                        <Play className="w-4 h-4 mr-2" />
                                                        Start Quiz
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Search and Filters */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mb-8">
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Search quizzes..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 bg-white/60 border-gray-300 focus:border-indigo-500"
                                />
                            </div>

                            {/* Category Filter */}
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger className="bg-white/60 border-gray-300 focus:border-indigo-500">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => {
                                        const Icon = category.icon
                                        return (
                                            <SelectItem key={category.value} value={category.value}>
                                                <div className="flex items-center gap-2">
                                                    <Icon className="w-4 h-4" />
                                                    {category.name}
                                                </div>
                                            </SelectItem>
                                        )
                                    })}
                                </SelectContent>
                            </Select>

                            {/* Difficulty Filter */}
                            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                                <SelectTrigger className="bg-white/60 border-gray-300 focus:border-indigo-500">
                                    <SelectValue placeholder="Difficulty" />
                                </SelectTrigger>
                                <SelectContent>
                                    {difficulties.map((difficulty) => (
                                        <SelectItem key={difficulty} value={difficulty}>
                                            {difficulty}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Sort By */}
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="bg-white/60 border-gray-300 focus:border-indigo-500">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="popular">Most Popular</SelectItem>
                                    <SelectItem value="rating">Highest Rated</SelectItem>
                                    <SelectItem value="newest">Newest</SelectItem>
                                    <SelectItem value="duration">Shortest Duration</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Results Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">All Quizzes</h2>
                        <p className="text-gray-600">
                            Showing {filteredQuizzes.length} of {quizzes.length} quizzes
                        </p>
                    </div>
                </div>

                {/* Quiz Grid */}
                {filteredQuizzes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredQuizzes.map((quiz) => {
                            const CategoryIcon = getCategoryIcon(quiz.category)
                            return (
                                <Card
                                    key={quiz.id}
                                    className="group border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden"
                                >
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-end mb-4">
                                            <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                                                <CategoryIcon className="w-5 h-5 text-indigo-600" />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                                    {quiz.title}
                                                </h3>
                                                <p className="text-gray-600 text-sm line-clamp-2">{quiz.description}</p>
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                {quiz.tags.slice(0, 3).map((tag) => (
                                                    <Badge key={tag} variant="secondary" className="bg-indigo-100 text-indigo-700 text-xs">
                                                        <Hash className="w-3 h-3 mr-1" />
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>

                                            <div className="flex items-center justify-between text-sm text-gray-500">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        <span>{quiz.duration}m</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Users className="w-4 h-4" />
                                                        <span>{quiz.participants.toLocaleString()}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                    <span className="font-medium">{quiz.rating}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-2">
                                                <Badge variant="outline" className={getDifficultyColor(quiz.difficulty)}>
                                                    {quiz.difficulty}
                                                </Badge>
                                                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white group/btn">
                                                    <Play className="w-4 h-4 mr-2" />
                                                    Start Quiz
                                                    <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                ) : (
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-12 text-center">
                            <div className="space-y-4">
                                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
                                    <Search className="w-8 h-8 text-indigo-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900">No quizzes found</h3>
                                <p className="text-gray-600">Try adjusting your search criteria or browse all available quizzes.</p>
                                <Button
                                    onClick={() => {
                                        setSearchTerm("")
                                        setSelectedCategory("all")
                                        setSelectedDifficulty("All Levels")
                                    }}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                >
                                    Clear Filters
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
