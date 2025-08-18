"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { QuizDataWithId } from "@/services/quiz.service"
import {
    Clock,
    BookOpen,
    Shield,
    AlertTriangle,
    Eye,
    Keyboard,
    Monitor,
    Copy,
    RotateCcw,
} from "lucide-react"
import FormatDate from "@/components/FormatDate"
import QuizStatusBadge from "@/components/QuizStatusBadge"

interface QuizDetailsModalProps {
    quiz: QuizDataWithId | null
    isOpen: boolean
    onClose: () => void
    onStart: () => void
}

export default function QuizDetailsModal({ quiz, isOpen, onClose, onStart }: QuizDetailsModalProps) {
    if (!quiz) return null

    const securityGuidelines = [
        {
            icon: <Keyboard className="w-4 h-4" />,
            title: "Developer Tools Restriction",
            description: "F12, Ctrl+Shift+I, Ctrl+Shift+J, and right-click inspect are disabled during the quiz.",
        },
        {
            icon: <Monitor className="w-4 h-4" />,
            title: "Full Screen Mode",
            description: "Your screen will be maximized and you cannot minimize or resize the window during the quiz.",
        },
        {
            icon: <Copy className="w-4 h-4" />,
            title: "Copy-Paste Disabled",
            description: "Ctrl+C, Ctrl+V, and all copy-paste operations are blocked to ensure authenticity.",
        },
        {
            icon: <RotateCcw className="w-4 h-4" />,
            title: "Tab Switching Prevention",
            description: "Alt+Tab, Ctrl+Tab, and window switching shortcuts are monitored and restricted.",
        },
        {
            icon: <Eye className="w-4 h-4" />,
            title: "Focus Monitoring",
            description: "Leaving the quiz window or switching applications will be detected and logged.",
        },
        {
            icon: <AlertTriangle className="w-4 h-4" />,
            title: "Violation Detection",
            description: "Multiple security violations may result in automatic quiz termination.",
        },
    ]

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto z-[100]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-900">Quiz Details</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Quiz Information */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xl">{quiz.title}</CardTitle>
                                <QuizStatusBadge status={quiz.status.status} />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-gray-600">{quiz.description}</p>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-indigo-500" />
                                    <span className="text-sm">{quiz.questions.length} Questions</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-indigo-500" />
                                    <span className="text-sm">{quiz.duration} minutes</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary" className="capitalize">
                                    {quiz.difficulty}
                                </Badge>
                                {quiz.tags.map((tag, index) => (
                                    <Badge key={index} variant="outline">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>

                            <div className="text-xs text-gray-500">Created on {FormatDate(quiz.createdAt)}</div>
                        </CardContent>
                    </Card>

                    <Separator />

                    {/* Security Guidelines */}
                    <Card className="border-orange-200 bg-orange-50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-orange-800">
                                <Shield className="w-5 h-5" />
                                Security Guidelines & Quiz Rules
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4">
                                <p className="text-sm text-orange-700 mb-3">
                                    To ensure the authenticity and integrity of your quiz attempt, the following security measures will be
                                    enforced:
                                </p>
                            </div>

                            <div className="grid gap-3">
                                {securityGuidelines.map((guideline, index) => (
                                    <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-orange-200">
                                        <div className="text-orange-600 mt-0.5">{guideline.icon}</div>
                                        <div>
                                            <h4 className="font-medium text-orange-800 text-sm">{guideline.title}</h4>
                                            <p className="text-xs text-orange-600 mt-1">{guideline.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-start gap-2">
                                    <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
                                    <div>
                                        <h4 className="font-medium text-red-800 text-sm">Important Notice</h4>
                                        <p className="text-xs text-red-600 mt-1">
                                            By proceeding with this quiz, you acknowledge that you understand and agree to comply with all
                                            security guidelines. Any attempt to circumvent these measures may result in disqualification.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button onClick={onStart} className="bg-indigo-500 hover:bg-indigo-600 cursor-pointer">Start Quiz</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
