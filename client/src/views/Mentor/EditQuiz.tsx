"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, X, ArrowLeft } from "lucide-react"
import NotificationService from "@/components/Notification"
import type { Question, QuizAiRequest, QuizDataWithId } from "@/services/quiz.service"
import QuizService from "@/services/quiz.service"
import { Link, useLocation, useNavigate } from "react-router-dom"


export default function EditQuiz() {
    const navigate = useNavigate();
    const location = useLocation();

    // Getting the Quiz ID from the previous page
    const quizId = location.state?.quizId;

    // Create an Mount to fetch the data of that quiz

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        if (!quizId) {
            navigate("/mentor/quiz");
            return;
        }
        const data = await QuizService.fetchQuizWithId(quizId);
        if (data == null) {
            navigate("/mentor/quiz");
            return
        }

        setQuizData(data);
        console.log(data);
    }

    const [isLoading, setIsLoading] = useState(false);
    const [quizData, setQuizData] = useState<QuizDataWithId>(
        {
            id: "",
            title: "",
            description: "",
            duration: 30,
            difficulty: "beginner",
            tags: [],
            questions: [],
            isPublic: true,
            status: { status: "Draft" }, // 👈 Default status
        })
    const [currentTag, setCurrentTag] = useState("")
    const [currentQuestion, setCurrentQuestion] = useState<Question>({
        id: "",
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        explanation: "",
    })
    const [questionCount, setQuestionCount] = useState<number>(5); // default to 5
    const addTag = () => {
        if (currentTag.trim() && !quizData.tags.includes(currentTag.trim())) {
            setQuizData((prev) => ({
                ...prev,
                tags: [...prev.tags, currentTag.trim()],
            }))
            setCurrentTag("")
        }
    }

    const removeTag = (tagToRemove: string) => {
        setQuizData((prev) => ({
            ...prev,
            tags: prev.tags.filter((tag) => tag !== tagToRemove),
        }))
    }

    const addQuestion = () => {
        if (currentQuestion.question.trim() && currentQuestion.options.every((opt) => opt.trim())) {
            const newQuestion = {
                ...currentQuestion,
                id: Date.now().toString(),
            }
            setQuizData((prev) => ({
                ...prev,
                questions: [...prev.questions, newQuestion],
            }))
            setCurrentQuestion({
                id: "",
                question: "",
                options: ["", "", "", ""],
                correctAnswer: 0,
                explanation: "",
            })
        } else {
            NotificationService.error("Invalid Question", "Kindly fill all the questions field!")
        }
    }

    const removeQuestion = (questionId: string) => {
        setQuizData((prev) => ({
            ...prev,
            questions: prev.questions.filter((q) => q.id !== questionId),
        }))
    }

    const updateQuestionOption = (index: number, value: string) => {
        setCurrentQuestion((prev) => ({
            ...prev,
            options: prev.options.map((opt, i) => (i === index ? value : opt)),
        }))
    }

    const handleSubmit = async () => {
        setIsLoading(true);
        if (
            !quizData.title.trim() ||
            !quizData.description.trim() ||
            quizData.questions.length === 0
        ) {
            NotificationService.error(
                "Cannot Update a quiz",
                "The provided credentials are required"
            );
            setIsLoading(false)
            return;
        }

        const fullQuizData = {
            ...quizData,
            totalQuestions: quizData.questions.length,
            estimatedDuration: `${quizData.duration} minutes`,
            createdAt: new Date().toISOString(),
        };

        console.log("Quiz Data:", fullQuizData);
        const quizId = await QuizService.updateQuiz(quizData);

        if (quizId) {
            NotificationService.success("Quiz Updated", "Your quiz has been successfully updated!");
            navigate("/mentor/quiz")
            return
        } else {
            NotificationService.error("Updation Failed", "There was a problem updating the quiz. Please try again.");
        }
        setIsLoading(false)
    }

    const generateWithAI = async () => {
        // Validate required fields
        if (!quizData.title || !quizData.description) {
            NotificationService.error("Unable to Generate", "Quiz Title and Description are required.");
            return;
        }

        if (!quizData.difficulty) {
            NotificationService.error("Unable to Generate", "Difficulty level is required.");
            return;
        }
        setIsLoading(true)

        // Optional: default to 5 if not set
        const count = questionCount || 5;
        // Prepare request payload
        const quizRequestData: QuizAiRequest = {
            title: quizData.title.trim(),
            description: quizData.description.trim(),
            difficulty: quizData.difficulty,
            questionCount: count,
        };

        try {
            // Show loading indicator (optional)
            NotificationService.info("Generating Questions", "AI is creating your quiz questions...");
            console.log("Sending Request Data:", quizRequestData);

            // Call the service method
            const result = await QuizService.fetchQuestionsWithAi(quizRequestData);
            console.log("Result From Quize Service:", result);

            // Success: Add generated questions to current list
            if (result.questions && result.questions.length > 0) {
                setQuizData(prevQuizData => ({
                    ...prevQuizData,
                    questions: [...prevQuizData.questions, ...result.questions] // Add to existing questions
                }));
                NotificationService.success(
                    "Success",
                    `${result.questions.length} question(s) generated and added!`
                );
            } else {
                NotificationService.warning("No Questions Generated", "The AI returned no questions. Try rephrasing the description.");
            }
        } catch (error: any) {
            // Error already handled in service, but we can log or show generic fallback
            console.error("AI Generation Failed:", error);
            NotificationService.error("Generation Failed", error.message || "Could not generate questions. Please try again.");
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <div className="min-h-screen w-full bg-white">
            {/* Header with gradient background matching your design */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-700/40 via-indigo-900/10 to-indigo-500/10"></div>
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                    <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-900/40 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
                </div>
                <div className="relative px-4 sm:px-6 lg:px-8 pb-12 pt-25">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center gap-4 mb-6">
                            <Link to="/mentor/quiz">
                                <Button variant="outline" className="bg-transparent cursor-pointer rounded-full flex items-center gap-2">
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Quizzes
                                </Button>
                            </Link>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Edit Quiz</h1>
                        <p className="text-lg text-gray-600 max-w-2xl">
                            Modify and update your existing quiz to better engage students and enhance their learning experience
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Basic Quiz Information */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="text-2xl text-gray-900 font-semibold">Quiz Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Title *</label>
                            <Input
                                value={quizData.title}
                                onChange={(e) => setQuizData((prev) => ({ ...prev, title: e.target.value }))}
                                placeholder="Enter quiz title..."
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                            <Textarea
                                value={quizData.description}
                                onChange={(e) => setQuizData((prev) => ({ ...prev, description: e.target.value }))}
                                placeholder="Describe what this quiz covers..."
                                rows={4}
                                className="w-full"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                                <Input
                                    type="number"
                                    value={quizData.duration}
                                    onChange={(e) =>
                                        setQuizData((prev) => ({ ...prev, duration: Number.parseInt(e.target.value) || 30 }))
                                    }
                                    min="5"
                                    max="180"
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
                                <select
                                    value={quizData.difficulty}
                                    onChange={(e) => setQuizData((prev) => ({ ...prev, difficulty: e.target.value as any }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                            <div className="flex gap-2 mb-3">
                                <Input
                                    value={currentTag}
                                    onChange={(e) => setCurrentTag(e.target.value)}
                                    placeholder="Add a tag..."
                                    className="flex-1"
                                    onKeyPress={(e) => e.key === "Enter" && addTag()}
                                />
                                <Button onClick={addTag} size="sm" className="bg-indigo-500 hover:bg-indigo-600">
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {quizData.tags.map((tag, index) => (
                                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                        {tag}
                                        <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => removeTag(tag)} />
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Questions Section */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="text-2xl text-gray-900">Questions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Add New Question Form */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-6">
                            <div className="flex justify-between">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Question</h3>
                                <div className="flex items-center gap-2">
                                    <select
                                        value={questionCount}
                                        onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                                        className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                        aria-label="Select number of questions to generate"
                                    >
                                        {Array.from({ length: 20 }, (_, i) => (
                                            <option key={i + 1} value={i + 1}>
                                                {i + 1} {i + 1 === 1 ? 'Question' : 'Questions'}
                                            </option>
                                        ))}
                                    </select>
                                    <Button disabled={isLoading} onClick={generateWithAI} size={"sm"} className="bg-indigo-500 hover:bg-indigo-600 text-white cursor-pointer">
                                        {isLoading ? "Generating..." : "Generate with AI"}
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Question *</label>
                                    <Textarea
                                        value={currentQuestion.question}
                                        onChange={(e) => setCurrentQuestion((prev) => ({ ...prev, question: e.target.value }))}
                                        placeholder="Enter your question..."
                                        rows={3}
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Answer Options *</label>
                                    <div className="space-y-2">
                                        {currentQuestion.options.map((option, index) => (
                                            <div key={index} className="flex items-center gap-3">
                                                <input
                                                    type="radio"
                                                    name="correctAnswer"
                                                    checked={currentQuestion.correctAnswer === index}
                                                    onChange={() => setCurrentQuestion((prev) => ({ ...prev, correctAnswer: index }))}
                                                    className="text-indigo-500"
                                                />
                                                <Input
                                                    value={option}
                                                    onChange={(e) => updateQuestionOption(index, e.target.value)}
                                                    placeholder={`Option ${index + 1}...`}
                                                    className="flex-1"
                                                />
                                                <span className="text-sm text-gray-500 w-16">
                                                    {currentQuestion.correctAnswer === index ? "Correct" : ""}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Explanation (Optional)</label>
                                    <Textarea
                                        value={currentQuestion.explanation}
                                        onChange={(e) => setCurrentQuestion((prev) => ({ ...prev, explanation: e.target.value }))}
                                        placeholder="Explain why this is the correct answer..."
                                        rows={2}
                                        className="w-full"
                                    />
                                </div>

                                <Button onClick={addQuestion} className="bg-indigo-500 hover:bg-indigo-600">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Question
                                </Button>
                            </div>
                        </div>

                        {/* Existing Questions List */}
                        {quizData.questions.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900">Questions ({quizData.questions.length})</h3>
                                {quizData.questions.map((question, index) => (
                                    <Card key={question.id} className="border-l-4 border-l-indigo-500">
                                        <CardContent className="pt-4">
                                            <div className="flex justify-between items-start mb-3">
                                                <h4 className="font-medium text-gray-900">Question {index + 1}</h4>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => removeQuestion(question.id)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                            <p className="text-gray-700 mb-3">{question.question}</p>
                                            <div className="space-y-1">
                                                {question.options.map((option, optIndex) => (
                                                    <div
                                                        key={optIndex}
                                                        className={`flex items-center gap-2 p-2 rounded ${question.correctAnswer === optIndex ? "bg-green-50 border border-green-200" : "bg-gray-50"
                                                            }`}
                                                    >
                                                        <span className="text-sm font-medium">{String.fromCharCode(65 + optIndex)}.</span>
                                                        <span className="text-sm">{option}</span>
                                                        {question.correctAnswer === optIndex && (
                                                            <Badge variant="secondary" className="ml-auto bg-green-100 text-green-800">
                                                                Correct
                                                            </Badge>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            {question.explanation && (
                                                <div className="mt-3 p-3 bg-blue-50 rounded-md">
                                                    <p className="text-sm text-blue-800">
                                                        <strong>Explanation:</strong> {question.explanation}
                                                    </p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Submit Section */}
                <Card>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Button
                                variant={quizData.status.status === "Draft" ? "default" : "outline"}
                                onClick={() => setQuizData(prev => ({ ...prev, status: { status: "Draft" } }))}
                                className={`w-full ${quizData.status.status === "Draft" ? "bg-yellow-500 hover:bg-yellow-600 text-white" : "border-yellow-500 text-yellow-600 hover:bg-yellow-50"}`}
                            >
                                Draft
                            </Button>
                            <Button
                                variant={quizData.status.status === "Active" ? "default" : "outline"}
                                onClick={() => setQuizData(prev => ({ ...prev, status: { status: "Active" } }))}
                                className={`w-full ${quizData.status.status === "Active" ? "bg-green-500 hover:bg-green-600 text-white" : "border-green-500 text-green-600 hover:bg-green-50"}`}
                            >
                                Active
                            </Button>
                            <Button
                                variant={quizData.status.status === "Archived" ? "default" : "outline"}
                                onClick={() => setQuizData(prev => ({ ...prev, status: { status: "Archived" } }))}
                                className={`w-full ${quizData.status.status === "Archived" ? "bg-gray-500 hover:bg-gray-600 text-white" : "border-gray-500 text-gray-600 hover:bg-gray-50"}`}
                            >
                                Archived
                            </Button>
                            <Button
                                variant={quizData.status.status === "Private" ? "default" : "outline"}
                                onClick={() => setQuizData(prev => ({ ...prev, status: { status: "Private" } }))}
                                className={`w-full ${quizData.status.status === "Private" ? "bg-purple-500 hover:bg-purple-600 text-white" : "border-purple-500 text-purple-600 hover:bg-purple-50"}`}
                            >
                                Private
                            </Button>
                        </div>
                    </CardContent>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Ready to Publish?</h3>
                                <p className="text-gray-600">
                                    {quizData.questions.length} questions • {quizData.duration} minutes • {quizData.difficulty} level
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Button onClick={handleSubmit} disabled={isLoading} className="cursor-pointer bg-indigo-500 hover:bg-indigo-600">
                                    {isLoading ? "Updating..." : `Update Quiz as ${quizData.status.status}`}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div >
    )
}
