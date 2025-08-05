"use client"

import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    ArrowLeft,
    Clock,
    Target,
    BookOpen,
    Play,
    FileText,
    PenToolIcon as Tool,
    Rocket,
    CheckCircle2,
    Star,
    Users,
    Award,
    Loader2,
    Sparkles,
    Video,
    Download,
    Share2,
    Bookmark,
} from "lucide-react"
import CourseGeneratorService from "@/services/course-generator.service"
import type { GeneratedCourse } from "@/services/course-generator.service"
export default function CourseGenerator() {
    const location = useLocation()
    const navigate = useNavigate()
    const [course, setCourse] = useState<GeneratedCourse | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [currentSection, setCurrentSection] = useState(0)
    const [completedSections, setCompletedSections] = useState<Set<string>>(new Set())

    const nodeData = location.state?.nodeData
    const roadmapTitle = location.state?.roadmapTitle
    const roadmapId = location.state?.roadmapId

    useEffect(() => {
        if (!nodeData) {
            navigate("/user/dashboard")
            return
        }

        generateCourse()
    }, [nodeData])

    const generateCourse = async () => {
        try {
            setLoading(true)
            const generatedCourse = await CourseGeneratorService.generateCourse(nodeData, {
                roadmapTitle,
                roadmapId,
            })
            setCourse(generatedCourse)
        } catch (err) {
            setError("Failed to generate course. Please try again.")
            console.error("Course generation error:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleSectionComplete = (sectionId: string) => {
        setCompletedSections((prev) => new Set([...prev, sectionId]))
    }

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

    const getSectionIcon = (type: string) => {
        switch (type) {
            case "theory":
                return BookOpen
            case "practical":
                return Tool
            case "quiz":
                return Target
            case "project":
                return Rocket
            default:
                return BookOpen
        }
    }

    const progressPercentage = course ? (completedSections.size / course.sections.length) * 100 : 0

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Sparkles className="w-8 h-8 text-indigo-600 animate-pulse" />
                        </div>
                        <Loader2 className="w-6 h-6 animate-spin absolute top-5 right-5 text-indigo-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Generating Your Course</h2>
                    <p className="text-gray-600">AI is creating a personalized learning experience...</p>
                </div>
            </div>
        )
    }

    if (error || !course) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-8">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Target className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Generation Failed</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <div className="flex gap-3 justify-center">
                        <Button onClick={() => navigate(-1)} variant="outline">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Go Back
                        </Button>
                        <Button onClick={generateCourse} className="bg-indigo-500 hover:bg-indigo-600">
                            Try Again
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                onClick={() => navigate(-1)}
                                variant="ghost"
                                size="sm"
                                className="text-gray-600 hover:text-gray-900"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Roadmap
                            </Button>
                            <div className="h-6 w-px bg-gray-300" />
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">{course.title}</h1>
                                <p className="text-sm text-gray-600">From: {roadmapTitle}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Badge className={getDifficultyColor(course.difficulty)}>{course.difficulty}</Badge>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Clock className="w-4 h-4" />
                                {course.estimatedDuration}
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                    <Bookmark className="w-4 h-4 mr-2" />
                                    Save
                                </Button>
                                <Button variant="outline" size="sm">
                                    <Share2 className="w-4 h-4 mr-2" />
                                    Share
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Course Overview */}
                        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                            <CardHeader className="pb-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-2xl text-gray-900 mb-2">{course.title}</CardTitle>
                                        <p className="text-gray-600 leading-relaxed">{course.description}</p>
                                    </div>
                                    <div className="flex items-center gap-2 text-yellow-500">
                                        <Star className="w-5 h-5 fill-current" />
                                        <span className="text-sm font-medium text-gray-700">4.8</span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="text-center p-4 bg-indigo-50 rounded-lg">
                                        <Users className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                                        <div className="text-2xl font-bold text-gray-900">2,847</div>
                                        <div className="text-sm text-gray-600">Students</div>
                                    </div>
                                    <div className="text-center p-4 bg-green-50 rounded-lg">
                                        <Award className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                        <div className="text-2xl font-bold text-gray-900">95%</div>
                                        <div className="text-sm text-gray-600">Completion Rate</div>
                                    </div>
                                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                                        <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                                        <div className="text-2xl font-bold text-gray-900">{course.estimatedDuration}</div>
                                        <div className="text-sm text-gray-600">Duration</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Course Content Tabs */}
                        <Tabs defaultValue="curriculum" className="w-full">
                            <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
                                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                                <TabsTrigger value="resources">Resources</TabsTrigger>
                                <TabsTrigger value="projects">Projects</TabsTrigger>
                                <TabsTrigger value="objectives">Objectives</TabsTrigger>
                            </TabsList>

                            <TabsContent value="curriculum" className="space-y-4">
                                {course.sections.map((section: any, index: any) => {
                                    const SectionIcon = getSectionIcon(section.type)
                                    const isCompleted = completedSections.has(section.id)
                                    const isCurrent = currentSection === index

                                    return (
                                        <Card
                                            key={section.id}
                                            className={`bg-white/80 backdrop-blur-sm border-0 shadow-lg transition-all duration-300 ${isCurrent ? "ring-2 ring-indigo-300 shadow-xl" : ""
                                                } ${isCompleted ? "bg-green-50/80" : ""}`}
                                        >
                                            <CardContent className="p-6">
                                                <div className="flex items-start gap-4">
                                                    <div
                                                        className={`p-3 rounded-lg ${isCompleted ? "bg-green-500" : isCurrent ? "bg-indigo-500" : "bg-gray-400"
                                                            } text-white`}
                                                    >
                                                        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <SectionIcon className="w-5 h-5" />}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                                                            <div className="flex items-center gap-3">
                                                                <Badge variant="secondary" className="text-xs">
                                                                    {section.type}
                                                                </Badge>
                                                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                                                    <Clock className="w-4 h-4" />
                                                                    {section.duration}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <p className="text-gray-600 leading-relaxed mb-4">{section.content}</p>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                size="sm"
                                                                className={`${isCompleted ? "bg-green-500 hover:bg-green-600" : "bg-indigo-500 hover:bg-indigo-600"
                                                                    } text-white`}
                                                                onClick={() => {
                                                                    setCurrentSection(index)
                                                                    if (!isCompleted) {
                                                                        handleSectionComplete(section.id)
                                                                    }
                                                                }}
                                                            >
                                                                <Play className="w-4 h-4 mr-2" />
                                                                {isCompleted ? "Review" : "Start Section"}
                                                            </Button>
                                                            {section.type === "project" && (
                                                                <Button variant="outline" size="sm">
                                                                    <Download className="w-4 h-4 mr-2" />
                                                                    Download Resources
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </TabsContent>

                            <TabsContent value="resources" className="space-y-6">
                                {/* Videos */}
                                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Video className="w-5 h-5 text-red-500" />
                                            Video Tutorials
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {Array.isArray(course.resources.videos) && course.resources.videos.length > 0 ? (
                                            course.resources.videos.map((video: any, index: any) => (
                                                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                                    <div className="w-24 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                                        <Play className="w-6 h-6 text-gray-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-gray-900">{video.title}</h4>
                                                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                                            <Clock className="w-4 h-4" />
                                                            {video.duration}
                                                        </div>
                                                    </div>
                                                    <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white">
                                                        <Play className="w-4 h-4 mr-2" />
                                                        Watch
                                                    </Button>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-gray-500 text-center py-4">No video tutorials available.</div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Articles */}
                                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <FileText className="w-5 h-5 text-blue-500" />
                                            Reading Materials
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {course.resources.articles.map((article: any, index: any) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div>
                                                    <h4 className="font-medium text-gray-900">{article.title}</h4>
                                                    <p className="text-sm text-gray-600">{article.readTime}</p>
                                                </div>
                                                <Button variant="outline" size="sm">
                                                    Read
                                                </Button>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>

                                {/* Tools */}
                                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Tool className="w-5 h-5 text-green-500" />
                                            Recommended Tools
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {course.resources.tools.map((tool: any, index: any) => (
                                            <div key={index} className="p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="font-medium text-gray-900">{tool.name}</h4>
                                                    <Button variant="outline" size="sm">
                                                        Visit
                                                    </Button>
                                                </div>
                                                <p className="text-sm text-gray-600">{tool.description}</p>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="projects" className="space-y-4">
                                {course.projects.map((project: any, index: any) => (
                                    <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                                        <CardContent className="p-6">
                                            <div className="flex items-start gap-4">
                                                <div className="p-3 rounded-lg bg-orange-500 text-white">
                                                    <Rocket className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                                                        <Badge className={getDifficultyColor(project.difficulty)}>{project.difficulty}</Badge>
                                                    </div>
                                                    <p className="text-gray-600 leading-relaxed mb-4">{project.description}</p>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-1 text-sm text-gray-600">
                                                            <Clock className="w-4 h-4" />
                                                            {project.estimatedTime}
                                                        </div>
                                                        <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                                                            <Rocket className="w-4 h-4 mr-2" />
                                                            Start Project
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </TabsContent>

                            <TabsContent value="objectives" className="space-y-4">
                                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Target className="w-5 h-5 text-indigo-500" />
                                            Learning Objectives
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-3">
                                            {course.learningObjectives.map((objective: any, index: any) => (
                                                <li key={index} className="flex items-start gap-3">
                                                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                                    <span className="text-gray-700">{objective}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>

                                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <BookOpen className="w-5 h-5 text-purple-500" />
                                            Prerequisites
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-3">
                                            {course.prerequisites.map((prerequisite: any, index: any) => (
                                                <li key={index} className="flex items-start gap-3">
                                                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2.5 flex-shrink-0" />
                                                    <span className="text-gray-700">{prerequisite}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Progress Card */}
                        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg sticky top-24">
                            <CardHeader>
                                <CardTitle className="text-lg">Your Progress</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-600">Course Progress</span>
                                        <span className="font-medium">{Math.round(progressPercentage)}%</span>
                                    </div>
                                    <Progress value={progressPercentage} className="h-2" />
                                </div>
                                <div className="text-sm text-gray-600">
                                    {completedSections.size} of {course.sections.length} sections completed
                                </div>
                                <Button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white">
                                    {progressPercentage === 100 ? "Get Certificate" : "Continue Learning"}
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Quick Stats */}
                        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-lg">Course Stats</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Sections</span>
                                    <span className="font-medium">{course.sections.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Videos</span>
                                    <span className="font-medium">{course.resources.videos.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Projects</span>
                                    <span className="font-medium">{course.projects.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Difficulty</span>
                                    <Badge className={getDifficultyColor(course.difficulty)} variant="secondary">
                                        {course.difficulty}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
