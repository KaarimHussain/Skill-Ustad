"use client"

import Logo from "@/components/Logo"
import NotificationService from "@/components/Notification"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import AuthService from "@/services/auth.service"
import QAService, { type Question, type Answer } from "@/services/qa.service"
import { ArrowLeft, MessageSquare, Eye, ThumbsUp, CheckCircle, Award, Calendar, Hash } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { RichContent } from "@/components/QAContent"

interface QuestionWithAnswers {
    question: Question
    answers: Answer[]
}

export default function QAResponses() {
    const navigate = useNavigate()
    const [questionsData, setQuestionsData] = useState<QuestionWithAnswers[]>([])
    const [loading, setLoading] = useState(true)
    const [markingAnswer, setMarkingAnswer] = useState<string | null>(null)

    const fetchQuestionsWithAnswers = async () => {
        try {
            const userId = AuthService.getAuthenticatedUserId()
            console.log("User ID: ", userId)

            if (userId == null) {
                NotificationService.error("Failed to Fetch the Questions", "it seems you are not loggedIn!")
                setLoading(false)
                return
            }

            // Fetch user's questions
            const questions = await QAService.fetchQuestionsByUserId(userId)
            console.log("Fetched questions:", questions)

            // For each question, fetch its answers
            const questionsWithAnswers: QuestionWithAnswers[] = await Promise.all(
                questions.map(async (question) => {
                    try {
                        const answers = await QAService.fetchAnswers(question.id)
                        return {
                            question,
                            answers,
                        }
                    } catch (error) {
                        console.error(`Error fetching answers for question ${question.id}:`, error)
                        return {
                            question,
                            answers: [],
                        }
                    }
                }),
            )

            setQuestionsData(questionsWithAnswers)
        } catch (error) {
            console.error("Error fetching questions:", error)
            NotificationService.error("Error", "Failed to fetch your questions and answers")
        } finally {
            setLoading(false)
        }
    }

    const handleMarkAsCorrect = async (questionId: string, answerId: string) => {
        try {
            setMarkingAnswer(answerId)

            await QAService.markAnswerAsCorrect(questionId, answerId)

            // Refresh the data to show the updated state
            await fetchQuestionsWithAnswers()

            NotificationService.success("Success", "Answer marked as correct!")
        } catch (error) {
            console.error("Error marking answer as correct:", error)
            NotificationService.error("Error", "Failed to mark answer as correct")
        } finally {
            setMarkingAnswer(null)
        }
    }

    useEffect(() => {
        fetchQuestionsWithAnswers()
    }, [])

    if (loading) {
        return (
            <main className="min-h-screen w-full bg-white py-20">
                <header className="border-b bg-white/80 backdrop-blur-sm sticky top-18 z-50 shadow-sm">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="flex items-center space-x-4">
                                <Button onClick={() => navigate("/qa")} className="cursor-pointer" variant="ghost" size="sm">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to Questions
                                </Button>
                                <Separator orientation="vertical" className="h-6" />
                                <Logo logoOnly />
                                <div className="flex flex-col">
                                    <span className="text-2xl font-light text-gray-800">Q&A Responses</span>
                                    <span className="text-sm text-gray-500">Manage your questions and answers</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="container mx-auto px-4 py-20">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading your questions and responses...</p>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <>
            <main className="min-h-screen w-full bg-gray-50 py-20">
                <header className="border-b bg-white/70 backdrop-blur-sm sticky top-18 z-50 shadow-sm">
                    <div className="container mx-auto px-4 py-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="flex items-center space-x-4">
                                <Button
                                    onClick={() => navigate("/qa")}
                                    className="cursor-pointer hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                    variant="ghost"
                                    size="sm"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to Questions
                                </Button>
                                <Separator orientation="vertical" className="h-6" />
                                <Logo logoOnly />
                                <div className="flex flex-col">
                                    <span className="text-2xl font-light text-gray-800">Q&A Responses</span>
                                    <span className="text-sm text-gray-500">Manage your questions and answers</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-5xl mx-auto">
                        {questionsData.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 max-w-md mx-auto">
                                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <MessageSquare className="h-8 w-8 text-indigo-500" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">No Questions Found</h3>
                                    <p className="text-gray-600 mb-8 leading-relaxed">
                                        You haven't asked any questions yet. Start engaging with the community!
                                    </p>
                                    <Button
                                        onClick={() => navigate("/qa")}
                                        className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                                    >
                                        Ask Your First Question
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {questionsData.map(({ question, answers }) => (
                                    <Card
                                        key={question.id}
                                        className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white rounded-xl overflow-hidden"
                                    >
                                        <CardHeader className="pb-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                                            {/* Question Section */}
                                            <div className="space-y-4">
                                                <div className="flex items-start justify-between gap-4">
                                                    <h2 className="text-xl font-semibold text-gray-900 flex-1 leading-tight">{question.title}</h2>
                                                    {question.isAnswered && (
                                                        <Badge className="bg-green-100 text-green-700 border-green-200 px-3 py-1 rounded-full font-medium">
                                                            <CheckCircle className="h-3 w-3 mr-1.5" />
                                                            Answered
                                                        </Badge>
                                                    )}
                                                </div>

                                                {/* Enhanced content rendering */}
                                                <div className="prose prose-gray max-w-none">
                                                    <RichContent content={question.content} />
                                                </div>

                                                {/* Enhanced tags section */}
                                                {question.tags && question.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 pt-2">
                                                        {question.tags.map((tag, index) => (
                                                            <Badge
                                                                key={index}
                                                                variant="secondary"
                                                                className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200 px-2 py-1 rounded-md font-medium hover:bg-indigo-100 transition-colors"
                                                            >
                                                                <Hash className="h-3 w-3 mr-1" />
                                                                {tag}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Enhanced question stats with better visual design */}
                                                <div className="flex items-center gap-6 text-sm text-gray-600 pt-4 border-t border-gray-100">
                                                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                                                        <ThumbsUp className="h-4 w-4 text-indigo-500" />
                                                        <span className="font-medium">{question.votes}</span>
                                                        <span className="text-gray-500">votes</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                                                        <Eye className="h-4 w-4 text-indigo-500" />
                                                        <span className="font-medium">{question.views}</span>
                                                        <span className="text-gray-500">views</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                                                        <MessageSquare className="h-4 w-4 text-indigo-500" />
                                                        <span className="font-medium">{answers.length}</span>
                                                        <span className="text-gray-500">answers</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 ml-auto text-gray-500">
                                                        <Calendar className="h-4 w-4" />
                                                        <span>Asked {question.createdAt}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardHeader>

                                        {/* Enhanced Answers Section */}
                                        {answers.length > 0 && (
                                            <CardContent className="pt-6">
                                                <div className="space-y-6">
                                                    <div className="flex items-center gap-3">
                                                        <h3 className="text-lg font-semibold text-gray-900">
                                                            {answers.length} Answer{answers.length > 1 ? "s" : ""}
                                                        </h3>
                                                        <Separator className="flex-1" />
                                                    </div>

                                                    <div className="space-y-6">
                                                        {answers.map((answer) => (
                                                            <div
                                                                key={answer.id}
                                                                className={`relative p-6 rounded-xl border-2 transition-all duration-200 ${answer.isAccepted
                                                                    ? "border-green-200 bg-green-50/50 shadow-sm"
                                                                    : "border-gray-200 bg-white hover:border-indigo-200 hover:shadow-sm"
                                                                    }`}
                                                            >
                                                                {/* Accepted answer indicator */}
                                                                {answer.isAccepted && (
                                                                    <div className="absolute -top-3 left-6">
                                                                        <Badge className="bg-green-500 text-white px-3 py-1 rounded-full font-medium shadow-sm">
                                                                            <Award className="h-3 w-3 mr-1.5" />
                                                                            Accepted Answer
                                                                        </Badge>
                                                                    </div>
                                                                )}

                                                                <div className="space-y-4">
                                                                    {/* Enhanced answer content */}
                                                                    <div className="prose prose-gray max-w-none">
                                                                        <RichContent content={answer.content} />
                                                                    </div>

                                                                    <Separator />

                                                                    {/* Enhanced answer footer */}
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="flex items-center space-x-6">
                                                                            {/* Answer stats */}
                                                                            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                                                                                <ThumbsUp className="h-4 w-4 text-indigo-500" />
                                                                                <span className="font-medium text-sm">{answer.votes}</span>
                                                                                <span className="text-gray-500 text-sm">votes</span>
                                                                            </div>

                                                                            {/* Enhanced author info */}
                                                                            <div className="flex items-center gap-3">
                                                                                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                                                                                    <img
                                                                                        src={answer.author.avatar || "/placeholder.svg"}
                                                                                        alt={answer.author.name}
                                                                                        className="h-6 w-6 rounded-full border border-gray-200"
                                                                                    />
                                                                                    <span className="font-medium text-sm text-gray-700">
                                                                                        {answer.author.name}
                                                                                    </span>
                                                                                </div>
                                                                                <div className="flex items-center gap-2 text-gray-500 text-sm">
                                                                                    <Calendar className="h-4 w-4" />
                                                                                    <span>{answer.createdAt}</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        {/* Enhanced mark as correct button */}
                                                                        <div className="flex items-center gap-2">
                                                                            {!answer.isAccepted && !question.isAnswered && (
                                                                                <Button
                                                                                    size="sm"
                                                                                    variant="outline"
                                                                                    onClick={() => handleMarkAsCorrect(question.id, answer.id)}
                                                                                    disabled={markingAnswer === answer.id}
                                                                                    className="text-green-600 border-green-300 hover:bg-green-50 hover:border-green-400 transition-colors px-4 py-2 rounded-lg font-medium"
                                                                                >
                                                                                    {markingAnswer === answer.id ? (
                                                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
                                                                                    ) : (
                                                                                        <CheckCircle className="h-4 w-4 mr-2" />
                                                                                    )}
                                                                                    Mark as Correct
                                                                                </Button>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        )}

                                        {/* Enhanced No Answers State */}
                                        {answers.length === 0 && (
                                            <CardContent className="pt-6">
                                                <Separator className="mb-6" />
                                                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                        <MessageSquare className="h-6 w-6 text-gray-400" />
                                                    </div>
                                                    <h4 className="font-medium text-gray-900 mb-2">No answers yet</h4>
                                                    <p className="text-sm text-gray-600 mb-1">This question is waiting for responses.</p>
                                                    <p className="text-xs text-gray-500">Share your question to get more visibility!</p>
                                                </div>
                                            </CardContent>
                                        )}
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    )
}
