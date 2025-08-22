"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
    ArrowLeft,
    Download,
    Camera,
    Shield,
    AlertTriangle,
    CheckCircle,
    Clock,
    Mic,
    FileText,
    BarChart3,
    Calendar,
    User,
    Award,
    TrendingUp,
    TrendingDown,
    Minus,
} from "lucide-react"
import type { InterviewConfig } from "@/types/services"

interface ChatMessage {
    role: "user" | "assistant" | "system"
    content: string
    timestamp: Date
    confidence?: number
    questionIndex?: number
}

interface SecurityEvent {
    type: "tab_blur" | "window_blur" | "fullscreen_exit" | "prohibited_key" | "right_click" | "focus_loss"
    timestamp: Date
    duration?: number
    details?: string
}

interface PhotoCapture {
    image: string
    timestamp: Date
    timing: "start" | "middle" | "end"
    index: number
}

interface InterviewReportProps {
    config: InterviewConfig
    chatHistory: ChatMessage[]
    securityEvents: SecurityEvent[]
    photoCaptures: PhotoCapture[]
    securityScore: number
    interviewDuration: number
    onBackToStaging: () => void
    onStartNew: () => void
}

interface ResponseAnalysis {
    questionIndex: number
    question: string
    response: string
    wordCount: number
    confidence: number
    responseTime: number
    quality: "excellent" | "good" | "fair" | "poor"
    keyPoints: string[]
}

interface SecurityAnalysis {
    totalViolations: number
    criticalViolations: number
    violationsByType: Record<string, number>
    timeSpentOutOfFocus: number
    complianceRate: number
}

interface PerformanceMetrics {
    overallScore: number
    communicationScore: number
    technicalScore: number
    confidenceScore: number
    consistencyScore: number
    responseQuality: number
}

const analyzeResponses = (chatHistory: ChatMessage[], questions: string[]): ResponseAnalysis[] => {
    const userResponses = chatHistory.filter((msg) => msg.role === "user")

    return userResponses.map((response, index) => {
        const wordCount = response.content.split(/\s+/).length
        const confidence = response.confidence || 0

        // Simulate response time calculation (in real app, this would be tracked)
        const responseTime = Math.random() * 30 + 10 // 10-40 seconds

        // Quality assessment based on word count, confidence, and content analysis
        let quality: "excellent" | "good" | "fair" | "poor"
        if (wordCount > 50 && confidence > 0.8) quality = "excellent"
        else if (wordCount > 30 && confidence > 0.6) quality = "good"
        else if (wordCount > 15 && confidence > 0.4) quality = "fair"
        else quality = "poor"

        // Extract key points (simplified - in real app, use NLP)
        const sentences = response.content.split(/[.!?]+/).filter((s) => s.trim().length > 10)
        const keyPoints = sentences.slice(0, 3).map((s) => s.trim())

        return {
            questionIndex: index,
            question: questions[index] || "Question not found",
            response: response.content,
            wordCount,
            confidence,
            responseTime,
            quality,
            keyPoints,
        }
    })
}

const analyzeSecurityEvents = (securityEvents: SecurityEvent[]): SecurityAnalysis => {
    const violationsByType = securityEvents.reduce(
        (acc, event) => {
            acc[event.type] = (acc[event.type] || 0) + 1
            return acc
        },
        {} as Record<string, number>,
    )

    const criticalViolations = securityEvents.filter(
        (event) => event.type === "fullscreen_exit" || event.type === "prohibited_key",
    ).length

    const timeSpentOutOfFocus = securityEvents
        .filter((event) => event.duration)
        .reduce((total, event) => total + (event.duration || 0), 0)

    const totalPossibleScore = 100
    const deductionsPerViolation = {
        tab_blur: 5,
        window_blur: 3,
        fullscreen_exit: 20,
        prohibited_key: 8,
        right_click: 3,
        focus_loss: 2,
    }

    const totalDeductions = securityEvents.reduce((total, event) => {
        return total + (deductionsPerViolation[event.type] || 0)
    }, 0)

    const complianceRate = Math.max(0, totalPossibleScore - totalDeductions)

    return {
        totalViolations: securityEvents.length,
        criticalViolations,
        violationsByType,
        timeSpentOutOfFocus,
        complianceRate,
    }
}

const calculatePerformanceMetrics = (
    responses: ResponseAnalysis[],
    securityAnalysis: SecurityAnalysis,
): PerformanceMetrics => {
    const avgConfidence = responses.reduce((sum, r) => sum + r.confidence, 0) / responses.length || 0
    const avgWordCount = responses.reduce((sum, r) => sum + r.wordCount, 0) / responses.length || 0
    const qualityScores = responses.map((r) => {
        switch (r.quality) {
            case "excellent":
                return 100
            case "good":
                return 80
            case "fair":
                return 60
            case "poor":
                return 40
            default:
                return 0
        }
    })
    const avgQuality = qualityScores.reduce((sum, score) => sum + score, 0) / qualityScores.length || 0

    const communicationScore = Math.min(100, (avgWordCount / 50) * 100) // Based on response length
    const technicalScore = avgQuality // Based on response quality
    const confidenceScore = avgConfidence * 100 // Based on speech confidence
    const consistencyScore = Math.max(
        0,
        100 -
        (responses.length > 0
            ? (responses.reduce((sum, r) => sum + Math.abs(r.confidence - avgConfidence), 0) / responses.length) * 200
            : 0),
    ) // Based on confidence consistency
    const responseQuality = avgQuality

    const overallScore =
        communicationScore * 0.25 +
        technicalScore * 0.25 +
        confidenceScore * 0.2 +
        consistencyScore * 0.15 +
        securityAnalysis.complianceRate * 0.15

    return {
        overallScore: Math.round(overallScore),
        communicationScore: Math.round(communicationScore),
        technicalScore: Math.round(technicalScore),
        confidenceScore: Math.round(confidenceScore),
        consistencyScore: Math.round(consistencyScore),
        responseQuality: Math.round(responseQuality),
    }
}

const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
}

const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return "default" // Green
    if (score >= 60) return "secondary" // Yellow
    return "destructive" // Red
}

const getTrendIcon = (score: number) => {
    if (score >= 80) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (score >= 60) return <Minus className="h-4 w-4 text-yellow-600" />
    return <TrendingDown className="h-4 w-4 text-red-600" />
}

export default function InterviewReport({
    config,
    chatHistory,
    securityEvents,
    photoCaptures,
    securityScore,
    interviewDuration,
    onBackToStaging,
    onStartNew,
}: InterviewReportProps) {
    const [selectedPhoto, setSelectedPhoto] = useState<PhotoCapture | null>(null)
    const [activeTab, setActiveTab] = useState("overview")

    const responseAnalysis = analyzeResponses(chatHistory, config.maxQuestions)
    const securityAnalysis = analyzeSecurityEvents(securityEvents)
    const performanceMetrics = calculatePerformanceMetrics(responseAnalysis, securityAnalysis)

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, "0")}`
    }

    const formatTimestamp = (date: Date) => {
        return date.toLocaleString()
    }

    const downloadReport = () => {
        const reportData = {
            config,
            chatHistory,
            securityEvents,
            photoCaptures: photoCaptures.map((p) => ({ ...p, image: "[Base64 Image Data]" })), // Exclude actual image data
            securityScore,
            interviewDuration,
            responseAnalysis,
            securityAnalysis,
            performanceMetrics,
            generatedAt: new Date().toISOString(),
        }

        const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `interview-report-${new Date().toISOString().split("T")[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
            {/* Background Effects */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-radial from-blue-100/60 via-indigo-50/40 to-slate-50/20" />
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-slate-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-600 bg-clip-text text-transparent">
                            Interview Report
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Comprehensive analysis of your interview performance and security compliance
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Button variant="outline" onClick={downloadReport} className="flex items-center gap-2 bg-transparent">
                            <Download className="h-4 w-4" />
                            Download Report
                        </Button>
                        <Button variant="outline" onClick={onBackToStaging} className="flex items-center gap-2 bg-transparent">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Setup
                        </Button>
                        <Button onClick={onStartNew} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                            Start New Interview
                        </Button>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Award className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-blue-600">{performanceMetrics.overallScore}%</div>
                                <div className="text-sm text-gray-600">Overall Score</div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Shield className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-green-600">{securityAnalysis.complianceRate}%</div>
                                <div className="text-sm text-gray-600">Security Compliance</div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Clock className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-purple-600">{formatDuration(interviewDuration)}</div>
                                <div className="text-sm text-gray-600">Duration</div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <Camera className="h-5 w-5 text-orange-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-orange-600">{photoCaptures.length}</div>
                                <div className="text-sm text-gray-600">Photos Captured</div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Main Content Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="responses">Responses</TabsTrigger>
                        <TabsTrigger value="security">Security</TabsTrigger>
                        <TabsTrigger value="photos">Photos</TabsTrigger>
                        <TabsTrigger value="transcript">Transcript</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Performance Metrics */}
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5" />
                                    Performance Metrics
                                </h3>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Communication</span>
                                        <div className="flex items-center gap-2">
                                            {getTrendIcon(performanceMetrics.communicationScore)}
                                            <Badge variant={getScoreBadgeVariant(performanceMetrics.communicationScore)}>
                                                {performanceMetrics.communicationScore}%
                                            </Badge>
                                        </div>
                                    </div>
                                    <Progress value={performanceMetrics.communicationScore} className="h-2" />

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Technical Knowledge</span>
                                        <div className="flex items-center gap-2">
                                            {getTrendIcon(performanceMetrics.technicalScore)}
                                            <Badge variant={getScoreBadgeVariant(performanceMetrics.technicalScore)}>
                                                {performanceMetrics.technicalScore}%
                                            </Badge>
                                        </div>
                                    </div>
                                    <Progress value={performanceMetrics.technicalScore} className="h-2" />

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Confidence</span>
                                        <div className="flex items-center gap-2">
                                            {getTrendIcon(performanceMetrics.confidenceScore)}
                                            <Badge variant={getScoreBadgeVariant(performanceMetrics.confidenceScore)}>
                                                {performanceMetrics.confidenceScore}%
                                            </Badge>
                                        </div>
                                    </div>
                                    <Progress value={performanceMetrics.confidenceScore} className="h-2" />

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Consistency</span>
                                        <div className="flex items-center gap-2">
                                            {getTrendIcon(performanceMetrics.consistencyScore)}
                                            <Badge variant={getScoreBadgeVariant(performanceMetrics.consistencyScore)}>
                                                {performanceMetrics.consistencyScore}%
                                            </Badge>
                                        </div>
                                    </div>
                                    <Progress value={performanceMetrics.consistencyScore} className="h-2" />
                                </div>
                            </Card>

                            {/* Interview Summary */}
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Interview Summary
                                </h3>

                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Experience Level:</span>
                                        <Badge variant="outline" className="capitalize">
                                            {config.experienceLevel}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Language:</span>
                                        <Badge variant="outline">{config.language.toUpperCase()}</Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Questions Asked:</span>
                                        <span className="font-medium">{config.maxQuestions.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Responses Given:</span>
                                        <span className="font-medium">{responseAnalysis.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Avg Response Time:</span>
                                        <span className="font-medium">
                                            {Math.round(
                                                responseAnalysis.reduce((sum, r) => sum + r.responseTime, 0) / responseAnalysis.length || 0,
                                            )}
                                            s
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Total Word Count:</span>
                                        <span className="font-medium">{responseAnalysis.reduce((sum, r) => sum + r.wordCount, 0)}</span>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Recommendations */}
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {performanceMetrics.communicationScore < 70 && (
                                    <Alert>
                                        <TrendingUp className="h-4 w-4" />
                                        <AlertTitle>Improve Communication</AlertTitle>
                                        <AlertDescription>
                                            Consider providing more detailed responses. Aim for 50-100 words per answer to demonstrate
                                            thorough thinking.
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {performanceMetrics.confidenceScore < 70 && (
                                    <Alert>
                                        <Mic className="h-4 w-4" />
                                        <AlertTitle>Enhance Speech Clarity</AlertTitle>
                                        <AlertDescription>
                                            Practice speaking clearly and at a steady pace. Consider using a better microphone or quieter
                                            environment.
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {securityAnalysis.complianceRate < 80 && (
                                    <Alert className="border-orange-200 bg-orange-50">
                                        <Shield className="h-4 w-4 text-orange-600" />
                                        <AlertTitle className="text-orange-800">Security Compliance</AlertTitle>
                                        <AlertDescription className="text-orange-700">
                                            Focus on maintaining fullscreen mode and avoiding tab switches during future interviews.
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {performanceMetrics.overallScore >= 80 && (
                                    <Alert className="border-green-200 bg-green-50">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        <AlertTitle className="text-green-800">Excellent Performance</AlertTitle>
                                        <AlertDescription className="text-green-700">
                                            Great job! You demonstrated strong communication skills and maintained good security compliance.
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>
                        </Card>
                    </TabsContent>

                    {/* Responses Tab */}
                    <TabsContent value="responses" className="space-y-6">
                        <div className="space-y-4">
                            {responseAnalysis.map((response, index) => (
                                <Card key={index} className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-lg mb-2">Question {response.questionIndex + 1}</h4>
                                            <p className="text-gray-700 mb-3">{response.question}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant={getScoreBadgeVariant(response.confidence * 100)}>
                                                {Math.round(response.confidence * 100)}% confidence
                                            </Badge>
                                            <Badge
                                                variant="outline"
                                                className={
                                                    response.quality === "excellent"
                                                        ? "border-green-500 text-green-700"
                                                        : response.quality === "good"
                                                            ? "border-blue-500 text-blue-700"
                                                            : response.quality === "fair"
                                                                ? "border-yellow-500 text-yellow-700"
                                                                : "border-red-500 text-red-700"
                                                }
                                            >
                                                {response.quality}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                        <p className="text-gray-800">{response.response}</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-gray-500" />
                                            <span>{response.wordCount} words</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-gray-500" />
                                            <span>{Math.round(response.responseTime)}s response time</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Mic className="h-4 w-4 text-gray-500" />
                                            <span>{Math.round(response.confidence * 100)}% speech clarity</span>
                                        </div>
                                    </div>

                                    {response.keyPoints.length > 0 && (
                                        <div className="mt-4">
                                            <h5 className="font-medium mb-2">Key Points:</h5>
                                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                                                {response.keyPoints.map((point, idx) => (
                                                    <li key={idx}>{point}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Security Tab */}
                    <TabsContent value="security" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Security Overview */}
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Shield className="h-5 w-5" />
                                    Security Overview
                                </h3>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span>Compliance Rate</span>
                                        <Badge
                                            variant={getScoreBadgeVariant(securityAnalysis.complianceRate)}
                                            className="text-lg px-3 py-1"
                                        >
                                            {securityAnalysis.complianceRate}%
                                        </Badge>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Total Violations:</span>
                                        <span className="font-medium text-red-600">{securityAnalysis.totalViolations}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Critical Violations:</span>
                                        <span className="font-medium text-red-600">{securityAnalysis.criticalViolations}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Time Out of Focus:</span>
                                        <span className="font-medium">{Math.round(securityAnalysis.timeSpentOutOfFocus / 1000)}s</span>
                                    </div>
                                </div>
                            </Card>

                            {/* Violation Breakdown */}
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold mb-4">Violation Breakdown</h3>
                                <div className="space-y-3">
                                    {Object.entries(securityAnalysis.violationsByType).map(([type, count]) => (
                                        <div key={type} className="flex justify-between items-center">
                                            <span className="text-sm capitalize">{type.replace("_", " ")}</span>
                                            <Badge variant="outline" className="text-red-600 border-red-200">
                                                {count}
                                            </Badge>
                                        </div>
                                    ))}

                                    {Object.keys(securityAnalysis.violationsByType).length === 0 && (
                                        <div className="text-center py-4 text-green-600">
                                            <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                                            <p>No security violations detected!</p>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </div>

                        {/* Security Events Timeline */}
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Security Events Timeline</h3>
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {securityEvents.map((event, index) => (
                                    <div key={index} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                                        <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium text-red-800 capitalize">{event.type.replace("_", " ")}</span>
                                                <Badge variant="outline" className="text-xs">
                                                    {formatTimestamp(event.timestamp)}
                                                </Badge>
                                            </div>
                                            {event.details && <p className="text-sm text-red-700">{event.details}</p>}
                                            {event.duration && (
                                                <p className="text-xs text-red-600 mt-1">Duration: {Math.round(event.duration / 1000)}s</p>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {securityEvents.length === 0 && (
                                    <div className="text-center py-8 text-green-600">
                                        <CheckCircle className="h-12 w-12 mx-auto mb-3" />
                                        <p className="text-lg font-medium">Perfect Security Compliance!</p>
                                        <p className="text-sm text-gray-600">No security violations were detected during your interview.</p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </TabsContent>

                    {/* Photos Tab */}
                    <TabsContent value="photos" className="space-y-6">
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Camera className="h-5 w-5" />
                                Identity Verification Photos ({photoCaptures.length})
                            </h3>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {photoCaptures.map((photo, index) => (
                                    <div key={index} className="relative group cursor-pointer" onClick={() => setSelectedPhoto(photo)}>
                                        <img
                                            src={photo.image || "/placeholder.svg"}
                                            alt={`Capture ${photo.index}`}
                                            className="w-full h-32 object-cover rounded-lg border-2 border-gray-200 group-hover:border-blue-400 transition-colors"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-opacity" />
                                        <div className="absolute bottom-2 left-2 right-2">
                                            <Badge variant="secondary" className="text-xs w-full justify-center">
                                                {photo.timing} - {formatTimestamp(photo.timestamp)}
                                            </Badge>
                                        </div>
                                        <div className="absolute top-2 right-2">
                                            <Badge variant="outline" className="text-xs bg-white">
                                                #{photo.index}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {photoCaptures.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <Camera className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                    <p>No photos were captured during this interview.</p>
                                </div>
                            )}
                        </Card>

                        {/* Photo Modal */}
                        {selectedPhoto && (
                            <div
                                className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
                                onClick={() => setSelectedPhoto(null)}
                            >
                                <div className="bg-white rounded-lg p-4 max-w-2xl max-h-[90vh] overflow-auto">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-lg font-semibold">Photo #{selectedPhoto.index}</h4>
                                        <Button variant="outline" size="sm" onClick={() => setSelectedPhoto(null)}>
                                            Close
                                        </Button>
                                    </div>
                                    <img
                                        src={selectedPhoto.image || "/placeholder.svg"}
                                        alt={`Capture ${selectedPhoto.index}`}
                                        className="w-full h-auto rounded-lg mb-4"
                                    />
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="font-medium">Timing:</span>
                                            <p className="capitalize">{selectedPhoto.timing}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium">Timestamp:</span>
                                            <p>{formatTimestamp(selectedPhoto.timestamp)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </TabsContent>

                    {/* Transcript Tab */}
                    <TabsContent value="transcript" className="space-y-6">
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Complete Interview Transcript
                            </h3>

                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                {chatHistory.map((entry, index) => (
                                    <div
                                        key={index}
                                        className={`p-4 rounded-lg border-l-4 ${entry.role === "assistant" ? "bg-blue-50 border-blue-400" : "bg-green-50 border-green-400"
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <Badge variant={entry.role === "assistant" ? "default" : "secondary"}>
                                                {entry.role === "assistant" ? "Interviewer" : "Candidate"}
                                            </Badge>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <Calendar className="h-3 w-3" />
                                                {formatTimestamp(entry.timestamp)}
                                                {entry.confidence && (
                                                    <>
                                                        <Mic className="h-3 w-3" />
                                                        {Math.round(entry.confidence * 100)}%
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-gray-800 leading-relaxed">{entry.content}</p>
                                    </div>
                                ))}

                                {chatHistory.length === 0 && (
                                    <div className="text-center py-8 text-gray-500">
                                        <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                        <p>No transcript available.</p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
