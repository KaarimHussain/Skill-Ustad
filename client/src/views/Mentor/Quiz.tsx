import FormatDate from "@/components/FormatDate";
import QuizStatusBadge from "@/components/QuizStatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import QuizService, { type QuizFirebaseResponse } from "@/services/quiz.service";
import { MapPin, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function MentorQuiz() {

    const [quizData, setQuizData] = useState<QuizFirebaseResponse[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const getData = async () => {
        setIsLoading(true)
        const data = await QuizService.fetchCurrentUserQuiz();
        if (data != null) {
            setQuizData(data);
        } else { setQuizData(null) }
        setIsLoading(false)
    }

    useEffect(() => {
        getData();
    }, [])

    return (
        <>
            <div className="min-h-screen w-full bg-white">
                <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-700/40 via-indigo-900/10 to-indigo-500/10"></div>
                    <div className="absolute inset-0">
                        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-900/40 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
                    </div>
                    <div className="relative px-4 sm:px-6 lg:px-8 pb-20 pt-35 h-full flex items-center">
                        <div className="max-w-7xl mx-auto text-center">
                            <h1 className="text-5xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                                Quiz
                            </h1>
                            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                                View, Create, Edit or Delete your quizes, use your experience to study the students
                            </p>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Quizes</h2>
                            <p className="text-gray-600 mt-1">Craft engaging quizzes that challenge minds and unlock potential</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link to={"/mentor/create-quiz"}>
                                <Button className="bg-indigo-500 hover:bg-indigo-600 cursor-pointer">
                                    Create an Quiz
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {isLoading ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3].map((i) => (
                                    <Card key={i} className="animate-pulse">
                                        <CardContent className="p-6">
                                            <div className="flex items-start gap-4 mb-4">
                                                <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                                                <div className="flex-1">
                                                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                                </div>
                                            </div>
                                            <div className="h-2 bg-gray-200 rounded mb-4"></div>
                                            <div className="h-10 bg-gray-200 rounded"></div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </>
                    ) : quizData?.length == 0 ? (
                        <>
                            <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-dashed border-2 border-gray-300">
                                <CardContent className="p-12 text-center">
                                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <MapPin className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Quizzes yet</h3>
                                    <p className="text-gray-600 mb-6">Create your first quiz to get started!</p>
                                    <Link to="/mentor/edit-quiz">
                                        <Button className="bg-indigo-500 hover:bg-indigo-600 text-white">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Create Your First Quiz
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </>
                    ) : (
                        <>
                            {/* Quiz Cards */}
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {quizData?.map((data) => {
                                    return (
                                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                                            <div className="p-6">
                                                <div className="flex items-center justify-between mb-4">
                                                    <QuizStatusBadge status={data.status.status} />
                                                    <span className="text-xs text-gray-500">{FormatDate(data.createdAt)}</span>
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-2">{data.title}</h3>
                                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                    {data.description}
                                                </p>
                                                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                                    <span>{data.questions.length} Questions</span>
                                                    <span>{data.duration} min</span>
                                                    <span>0 Attempts</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-1">
                                                        <span className="text-yellow-400">★</span>
                                                        <span className="text-sm font-medium">0.0</span>
                                                        <span className="text-xs text-gray-500">(0 reviews)</span>
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        <Link
                                                            to={"/mentor/edit-quiz"}
                                                            state={{ quizId: data.id }}
                                                        >
                                                            <Button variant="outline" size="sm">Edit</Button>
                                                        </Link>
                                                        <Link
                                                            to={"/mentor/view-quiz"}
                                                            state={{ quizId: data.id }}
                                                        >
                                                            <Button size="sm" className="bg-indigo-500 hover:bg-indigo-600">View</Button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </>
                    )}


                </div>
            </div>
        </>
    )
}