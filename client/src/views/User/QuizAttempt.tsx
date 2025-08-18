"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    ArrowLeft,
    Clock,
    BookOpen,
    Target,
    CheckCircle,
    XCircle,
    AlertCircle,
    Shield,
    Eye,
    EyeOff,
    Star,
} from "lucide-react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import QuizService, { type QuizAttempt } from "@/services/quiz.service"
import NotificationService from "@/components/Notification"
import AuthService from "@/services/auth.service"

interface Question {
    id: string
    question: string
    options: string[]
    correctAnswer: number
    explanation?: string
}

interface QuizData {
    id: string
    title: string
    description: string
    duration: number
    difficulty: "beginner" | "intermediate" | "advanced"
    tags: string[]
    questions: Question[]
    isPublic: boolean
    status: { status: "Active" | "Draft" | "Archived" | "Private" }
}

export default function UserAttemptQuiz() {
    const navigate = useNavigate()
    const location = useLocation()
    const [quiz, setQuiz] = useState<QuizData | null>(null)
    const [loading, setLoading] = useState(true)
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({})
    const [showResults, setShowResults] = useState(false)
    const [timeRemaining, setTimeRemaining] = useState(0)
    const [startTime, setStartTime] = useState<Date | null>(null)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [securityViolations, setSecurityViolations] = useState<string[]>([])
    const [showSecurityWarning, setShowSecurityWarning] = useState(false)
    const [attemptSaved, setAttemptSaved] = useState(false)
    const [saving, setSaving] = useState(false)
    const [ratingData, setRatingData] = useState({
        rating: 0,
        comment: ""
    })
    const [showRating, setShowRating] = useState(false)

    // Getting the Quiz ID from the previous page
    const quizId = location.state?.quizId || null

    const addSecurityViolation = useCallback((violation: string) => {
        setSecurityViolations((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${violation}`])
        setShowSecurityWarning(true)
    }, [])

    const enterFullscreen = useCallback(async () => {
        try {
            await document.documentElement.requestFullscreen()
            setIsFullscreen(true)
        } catch (error) {
            console.error("Failed to enter fullscreen:", error)
        }
    }, [])

    const exitFullscreen = useCallback(async () => {
        try {
            await document.exitFullscreen()
            setIsFullscreen(false)
        } catch (error) {
            console.error("Failed to exit fullscreen:", error)
        }
    }, [])

    useEffect(() => {
        if (!quiz || showResults) return

        const handleKeyDown = (e: KeyboardEvent) => {
            // Block F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
            if (
                e.key === "F12" ||
                (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J")) ||
                (e.ctrlKey && e.key === "u")
            ) {
                e.preventDefault()
                addSecurityViolation("Attempted to access developer tools")
            }

            // Block Ctrl+C, Ctrl+V, Ctrl+A
            if (e.ctrlKey && (e.key === "c" || e.key === "v" || e.key === "a")) {
                e.preventDefault()
                addSecurityViolation("Attempted to copy/paste content")
            }

            // Block Alt+Tab, Ctrl+Tab
            if ((e.altKey && e.key === "Tab") || (e.ctrlKey && e.key === "Tab")) {
                e.preventDefault()
                addSecurityViolation("Attempted to switch tabs/windows")
            }

            // Block Escape key
            if (e.key === "Escape") {
                e.preventDefault()
                addSecurityViolation("Attempted to exit fullscreen")
            }
        }

        const handleVisibilityChange = () => {
            if (document.hidden) {
                addSecurityViolation("Tab/window lost focus")
            }
        }

        const handleFullscreenChange = () => {
            if (!document.fullscreenElement) {
                setIsFullscreen(false)
                addSecurityViolation("Exited fullscreen mode")
            }
        }

        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault()
            addSecurityViolation("Attempted to access context menu")
        }

        const handleResize = () => {
            if (window.innerHeight < screen.height * 0.9 || window.innerWidth < screen.width * 0.9) {
                addSecurityViolation("Window was resized/minimized")
            }
        }

        document.addEventListener("keydown", handleKeyDown)
        document.addEventListener("visibilitychange", handleVisibilityChange)
        document.addEventListener("fullscreenchange", handleFullscreenChange)
        document.addEventListener("contextmenu", handleContextMenu)
        window.addEventListener("resize", handleResize)

        return () => {
            document.removeEventListener("keydown", handleKeyDown)
            document.removeEventListener("visibilitychange", handleVisibilityChange)
            document.removeEventListener("fullscreenchange", handleFullscreenChange)
            document.removeEventListener("contextmenu", handleContextMenu)
            window.removeEventListener("resize", handleResize)
        }
    }, [quiz, showResults, addSecurityViolation])

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        if (quiz && timeRemaining > 0 && !showResults) {
            const timer = setInterval(() => {
                setTimeRemaining((prev) => {
                    if (prev <= 1) {
                        handleSubmitQuiz()
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
            return () => clearInterval(timer)
        }
    }, [quiz, timeRemaining, showResults])

    const fetchData = async () => {
        if (!quizId) {
            navigate("/user/quiz")
            return
        }

        try {
            const data = await QuizService.fetchQuizWithId(quizId)
            if (data == null) {
                navigate("/user/quiz")
                return
            }
            setQuiz(data)
            setTimeRemaining(data.duration * 60)
            setStartTime(new Date())
        } catch (error: any) {
            console.error("Error fetching quiz:", error)
            NotificationService.error("Error Fetching Quizes", error);
            navigate("/user/quiz")
        } finally {
            setLoading(false)
        }
    }

    const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionIndex]: answerIndex,
        }))
    }

    const handleNextQuestion = () => {
        if (quiz && currentQuestion < quiz.questions.length - 1) {
            setCurrentQuestion((prev) => prev + 1)
        }
    }

    const handlePreviousQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion((prev) => prev - 1)
        }
    }

    const handleSubmitQuiz = async () => {
        if (!quiz || !startTime) return

        const userId = AuthService.getAuthenticatedUserId();
        if(userId == null) return navigate("/user/quiz");
        const endTime = new Date()
        const timeSpent = Math.floor((endTime.getTime() - startTime.getTime()) / 1000)
        const correctAnswers = quiz.questions.filter(
            (question, index) => selectedAnswers[index] === question.correctAnswer,
        ).length
        const score = Math.round((correctAnswers / quiz.questions.length) * 100)

        setShowResults(true)
        setSaving(true)

        // Save attempt to Firebase
        try {
            const attemptData: Omit<QuizAttempt, "id"> = {
                quizId: quiz.id,
                userId: userId,
                answers: selectedAnswers,
                score,
                totalQuestions: quiz.questions.length,
                correctAnswers,
                timeSpent,
                completedAt: endTime,
                startedAt: startTime,
            }

            const attemptId = await QuizService.saveQuizAttempt(attemptData)
            if (attemptId) {
                setAttemptSaved(true)
            }
        } catch (error) {
            console.error("Failed to save quiz attempt:", error)
        } finally {
            setSaving(false)
        }

        // Exit fullscreen after quiz completion
        if (document.fullscreenElement) {
            exitFullscreen()
        }
    }

    const calculateScore = () => {
        if (!quiz) return 0
        let correct = 0
        quiz.questions.forEach((question, index) => {
            if (selectedAnswers[index] === question.correctAnswer) {
                correct++
            }
        })
        return Math.round((correct / quiz.questions.length) * 100)
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, "0")}`
    }

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case "beginner":
                return "bg-green-100 text-green-800"
            case "intermediate":
                return "bg-yellow-100 text-yellow-800"
            case "advanced":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const handleRatingSubmit = async () => {
        if (ratingData.rating === 0 || ratingData.comment == null) {
            NotificationService.error("Error Rating Quiz", "Please select a rating");
            return
        }

        await QuizService.saveRating(ratingData.rating, ratingData.comment, quizId)
        NotificationService.success("Thank you for your rating!", "Your rating helps mentors to improve there quizes.");
        console.log("Quiz rated:", ratingData)
        setShowRating(false)
    }

    if (loading) {
        return (
            <div className="min-h-screen w-full bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading quiz...</p>
                </div>
            </div>
        )
    }

    if (!quiz) {
        return (
            <div className="min-h-screen w-full bg-white flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Quiz not found</p>
                    <Link to="/user/quiz">
                        <Button className="bg-indigo-500 hover:bg-indigo-600">Back to Quizzes</Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen w-full bg-white">
            {showSecurityWarning && (
                <div className="fixed inset-0 bg-black/10 backdrop-filter-3xl bg-opacity-50 flex items-center justify-center z-50">
                    <Card className="max-w-md mx-4">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-red-600">
                                <Shield className="w-5 h-5" />
                                Security Violation Detected
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700 mb-4">
                                Security violations have been detected during your quiz attempt. Please follow the quiz guidelines.
                            </p>
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 max-h-32 overflow-y-auto">
                                {securityViolations.map((violation, index) => (
                                    <p key={index} className="text-sm text-red-700">
                                        {violation}
                                    </p>
                                ))}
                            </div>
                            <Button onClick={() => setShowSecurityWarning(false)} className="w-full bg-red-500 hover:bg-red-600">
                                I Understand
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}

            {showRating && (
                <div className="fixed inset-0 bg-black/10 backdrop-blur-3xl bg-opacity-50 flex items-center justify-center z-50">
                    <Card className="max-w-md mx-4">
                        <CardHeader>
                            <CardTitle className="text-center">Rate This Quiz</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 text-center mb-6">How would you rate your experience with this quiz?</p>
                            <div className="flex justify-center gap-2 mb-6">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setRatingData(prev => ({ ...prev, rating: star }))}
                                        className="p-1"
                                    >
                                        <Star
                                            className={`w-8 h-8 ${star <= ratingData.rating
                                                ? "text-yellow-400 fill-current"
                                                : "text-gray-300"
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>

                            <div className="mb-6">
                                <label htmlFor="rating-comment" className="block text-sm font-medium text-gray-700 mb-2">
                                    Comment (optional)
                                </label>
                                <textarea
                                    id="rating-comment"
                                    value={ratingData.comment}
                                    onChange={(e) => setRatingData(prev => ({ ...prev, comment: e.target.value }))}
                                    placeholder="Share your thoughts about this quiz..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                                    rows={3}
                                />
                            </div>
                            <div className="flex gap-3">
                                <Button variant="outline" onClick={() => setShowRating(false)} className="flex-1">
                                    Skip
                                </Button>
                                <Button
                                    onClick={handleRatingSubmit}
                                    disabled={ratingData.rating === 0}
                                    className="flex-1 bg-indigo-500 hover:bg-indigo-600"
                                >
                                    Submit Rating
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Header with gradient background */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-700/40 via-indigo-900/10 to-indigo-500/10"></div>
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                    <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-900/40 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
                </div>
                <div className="relative px-4 sm:px-6 lg:px-8 pb-12 pt-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-between mb-6">
                            <Link to="/quiz">
                                <Button
                                    variant="outline"
                                    className="bg-transparent cursor-pointer rounded-full flex items-center gap-2"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Quizzes
                                </Button>
                            </Link>
                            <div className="flex items-center gap-3">
                                <Badge
                                    className={`px-3 py-1 ${securityViolations.length > 0 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}
                                >
                                    <Shield className="w-3 h-3 mr-1" />
                                    {securityViolations.length > 0 ? `${securityViolations.length} Violations` : "Secure Mode"}
                                </Badge>
                                {!showResults && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={isFullscreen ? exitFullscreen : enterFullscreen}
                                        className="bg-transparent"
                                    >
                                        {isFullscreen ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        {isFullscreen ? "Exit" : "Fullscreen"}
                                    </Button>
                                )}
                            </div>
                        </div>

                        {!showResults ? (
                            <>
                                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">{quiz.title}</h1>
                                <p className="text-lg text-gray-600 max-w-2xl mb-6">{quiz.description}</p>

                                <div className="flex flex-wrap items-center gap-4">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Clock className="w-5 h-5" />
                                        <span className={timeRemaining < 300 ? "text-red-600 font-bold" : ""}>
                                            {formatTime(timeRemaining)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <BookOpen className="w-5 h-5" />
                                        <span>{quiz.questions.length} Questions</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Target className="w-5 h-5" />
                                        <Badge className={getDifficultyColor(quiz.difficulty)}>
                                            {quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 mt-4">
                                    {quiz.tags.map((tag, index) => (
                                        <Badge key={index} variant="secondary" className="bg-indigo-50 text-indigo-700">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="text-center">
                                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                                    {saving ? "Saving Results..." : "Quiz Complete!"}
                                </h1>
                                <p className="text-lg text-gray-600">
                                    {saving
                                        ? "Please wait while we save your results"
                                        : attemptSaved
                                            ? "Your results have been saved successfully"
                                            : "Your quiz attempt has been completed"}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {!showResults ? (
                    <>
                        {/* Progress Bar */}
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-700">
                                    Question {currentQuestion + 1} of {quiz.questions.length}
                                </span>
                                <span className="text-sm text-gray-500">
                                    {Math.round(((currentQuestion + 1) / quiz.questions.length) * 100)}% Complete
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Current Question */}
                        <Card className="mb-8">
                            <CardHeader>
                                <CardTitle className="text-xl text-gray-900">{quiz.questions[currentQuestion].question}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {quiz.questions[currentQuestion].options.map((option, index) => (
                                        <div
                                            key={index}
                                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedAnswers[currentQuestion] === index
                                                ? "border-indigo-500 bg-indigo-50"
                                                : "border-gray-200 hover:border-gray-300"
                                                }`}
                                            onClick={() => handleAnswerSelect(currentQuestion, index)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedAnswers[currentQuestion] === index
                                                        ? "border-indigo-500 bg-indigo-500"
                                                        : "border-gray-300"
                                                        }`}
                                                >
                                                    {selectedAnswers[currentQuestion] === index && (
                                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                                    )}
                                                </div>
                                                <span className="font-medium text-gray-700">{String.fromCharCode(65 + index)}.</span>
                                                <span className="text-gray-900">{option}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Navigation */}
                        <div className="flex justify-between items-center">
                            <Button
                                variant="outline"
                                onClick={handlePreviousQuestion}
                                disabled={currentQuestion === 0}
                                className="flex items-center gap-2 bg-transparent"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Previous
                            </Button>

                            <div className="flex gap-2">
                                {quiz.questions.map((_, index) => (
                                    <div
                                        key={index}
                                        className={`w-3 h-3 rounded-full ${index === currentQuestion
                                            ? "bg-indigo-500"
                                            : selectedAnswers[index] !== undefined
                                                ? "bg-green-400"
                                                : "bg-gray-300"
                                            }`}
                                    ></div>
                                ))}
                            </div>

                            {currentQuestion === quiz.questions.length - 1 ? (
                                <Button
                                    onClick={handleSubmitQuiz}
                                    className="bg-indigo-500 hover:bg-indigo-600"
                                    disabled={Object.keys(selectedAnswers).length !== quiz.questions.length}
                                >
                                    Submit Quiz
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleNextQuestion}
                                    className="bg-indigo-500 hover:bg-indigo-600 flex items-center gap-2"
                                    disabled={selectedAnswers[currentQuestion] === undefined}
                                >
                                    Next
                                    <ArrowLeft className="w-4 h-4 rotate-180" />
                                </Button>
                            )}
                        </div>
                    </>
                ) : (
                    /* Results View */
                    <div className="space-y-8">
                        {/* Score Card */}
                        <Card className="text-center">
                            <CardContent className="pt-8 pb-8">
                                <div className="mb-6">
                                    <div className="text-6xl font-bold text-indigo-500 mb-2">{calculateScore()}%</div>
                                    <p className="text-xl text-gray-600">Your Score</p>
                                    {saving && (
                                        <div className="flex items-center justify-center gap-2 mt-4">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-500"></div>
                                            <span className="text-sm text-gray-500">Saving results...</span>
                                        </div>
                                    )}
                                    {attemptSaved && (
                                        <div className="flex items-center justify-center gap-2 mt-4 text-green-600">
                                            <CheckCircle className="w-4 h-4" />
                                            <span className="text-sm">Results saved successfully!</span>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-green-500">
                                            {
                                                Object.values(selectedAnswers).filter(
                                                    (answer, index) => answer === quiz.questions[index].correctAnswer,
                                                ).length
                                            }
                                        </div>
                                        <p className="text-sm text-gray-600">Correct</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-red-500">
                                            {
                                                Object.values(selectedAnswers).filter(
                                                    (answer, index) => answer !== quiz.questions[index].correctAnswer,
                                                ).length
                                            }
                                        </div>
                                        <p className="text-sm text-gray-600">Incorrect</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-500">{quiz.questions.length}</div>
                                        <p className="text-sm text-gray-600">Total</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Security Report */}
                        {securityViolations.length > 0 && (
                            <Card className="border-l-4 border-l-red-500">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-red-600">
                                        <Shield className="w-5 h-5" />
                                        Security Report
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-700 mb-3">
                                        {securityViolations.length} security violation(s) were detected during your quiz attempt:
                                    </p>
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 max-h-32 overflow-y-auto">
                                        {securityViolations.map((violation, index) => (
                                            <p key={index} className="text-sm text-red-700">
                                                {violation}
                                            </p>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Question Review */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-gray-900">Question Review</h2>
                            {quiz.questions.map((question, questionIndex) => {
                                const userAnswer = selectedAnswers[questionIndex]
                                const isCorrect = userAnswer === question.correctAnswer

                                return (
                                    <Card
                                        key={question.id}
                                        className={`border-l-4 ${isCorrect ? "border-l-green-500" : "border-l-red-500"}`}
                                    >
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <CardTitle className="text-lg text-gray-900 flex-1">
                                                    Question {questionIndex + 1}: {question.question}
                                                </CardTitle>
                                                {isCorrect ? (
                                                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 ml-4" />
                                                ) : (
                                                    <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 ml-4" />
                                                )}
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2 mb-4">
                                                {question.options.map((option, optionIndex) => (
                                                    <div
                                                        key={optionIndex}
                                                        className={`p-3 rounded-lg border ${optionIndex === question.correctAnswer
                                                            ? "bg-green-50 border-green-200"
                                                            : optionIndex === userAnswer && !isCorrect
                                                                ? "bg-red-50 border-red-200"
                                                                : "bg-gray-50 border-gray-200"
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium">{String.fromCharCode(65 + optionIndex)}.</span>
                                                            <span>{option}</span>
                                                            {optionIndex === question.correctAnswer && (
                                                                <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                                                            )}
                                                            {optionIndex === userAnswer && !isCorrect && (
                                                                <XCircle className="w-4 h-4 text-red-500 ml-auto" />
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {question.explanation && (
                                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                    <div className="flex items-start gap-2">
                                                        <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                                        <div>
                                                            <p className="font-medium text-blue-900 mb-1">Explanation</p>
                                                            <p className="text-blue-800">{question.explanation}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>

                        <div className="flex justify-center gap-4">
                            {attemptSaved && !showRating && (
                                <Button
                                    onClick={() => setShowRating(true)}
                                    className="bg-yellow-500 hover:bg-yellow-600 flex items-center gap-2"
                                >
                                    <Star className="w-4 h-4" />
                                    Rate Quiz
                                </Button>
                            )}
                            <Link to="/user/quiz">
                                <Button className="bg-indigo-500 hover:bg-indigo-600">Back to Quizzes</Button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
