import { useState } from 'react'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, Trophy, Save } from "lucide-react"

// Project Interface Component
export const ProjectInterface = ({ projectData, onComplete }:any) => {
    const [tasks, setTasks] = useState(projectData.tasks)
    const [submissionData, setSubmissionData] = useState<any>({})

    const handleTaskComplete = async (taskId: string) => {
        const updatedTasks = tasks.map((task:any) =>
            task.id === taskId ? { ...task, completed: true } : task
        )
        setTasks(updatedTasks)

        // Save to Firebase
        const projectDocRef = doc(db, 'learning-content', `${projectData.roadmapId}_${projectData.nodeId}_project`)
        await setDoc(projectDocRef, { ...projectData, tasks: updatedTasks }, { merge: true })

        // Check if all tasks completed
        if (updatedTasks.every((task:any) => task.completed)) {
            setTimeout(onComplete, 1500) // Small delay to show completion
        }
    }

    const handleSubmission = async (taskId: string, submission: any) => {
        const updatedTasks = tasks.map((task:any) =>
            task.id === taskId ? { ...task, ...submission, completed: true } : task
        )
        setTasks(updatedTasks)

        // Save to Firebase
        const projectDocRef = doc(db, 'learning-content', `${projectData.roadmapId}_${projectData.nodeId}_project`)
        await setDoc(projectDocRef, { ...projectData, tasks: updatedTasks }, { merge: true })

        // Auto-complete if all tasks done
        if (updatedTasks.every((task:any) => task.completed)) {
            setTimeout(onComplete, 1500)
        }
    }

    const completedTasks = tasks.filter((t:any) => t.completed).length
    const totalTasks = tasks.length
    const progressPercentage = (completedTasks / totalTasks) * 100

    if (completedTasks === totalTasks) {
        return (
            <div className="text-center space-y-6 py-8">
                <div className="animate-bounce">
                    <Trophy className="w-16 h-16 text-yellow-500 mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-green-600">Project Completed!</h3>
                <p className="text-gray-600">Congratulations! You've successfully completed all project tasks.</p>
                <Badge className="bg-green-500 text-white px-4 py-2">All Tasks Complete</Badge>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <h3 className="text-lg font-semibold text-amber-800 mb-2">{projectData.title}</h3>
                <p className="text-amber-700 text-sm">{projectData.description}</p>
            </div>

            <div className="space-y-1">
                <div className="flex justify-between text-sm">
                    <span>Project Progress</span>
                    <span>{completedTasks} / {totalTasks} tasks</span>
                </div>
                <Progress value={progressPercentage} className="w-full" />
            </div>

            <div className="space-y-4">
                {tasks.map((task: any, index: any) => (
                    <div key={task.id} className={`border rounded-lg p-4 ${task.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5 ${task.completed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                                    }`}>
                                    {task.completed ? <CheckCircle className="w-4 h-4" /> : index + 1}
                                </div>
                                <div className="flex-1">
                                    <h4 className={`font-medium ${task.completed ? 'text-green-800' : 'text-gray-900'}`}>
                                        {task.title}
                                    </h4>
                                    <p className={`text-sm mt-1 ${task.completed ? 'text-green-700' : 'text-gray-600'}`}>
                                        {task.description}
                                    </p>
                                </div>
                            </div>
                            <Badge variant={task.completed ? "default" : "secondary"} className={task.completed ? "bg-green-500" : ""}>
                                {task.completed ? "Complete" : "Pending"}
                            </Badge>
                        </div>

                        {task.completed && task.submissionText && (
                            <div className="mt-3 p-3 bg-green-100 rounded border-l-4 border-green-500">
                                <p className="text-sm text-green-800"><strong>Your Submission:</strong></p>
                                <p className="text-sm text-green-700 mt-1">{task.submissionText}</p>
                            </div>
                        )}

                        {!task.completed && (
                            <div className="mt-4 space-y-3">
                                <Textarea
                                    placeholder="Describe what you've accomplished, add links to your work, or write notes about your progress..."
                                    value={submissionData[task.id] || ''}
                                    onChange={(e) => setSubmissionData({ ...submissionData, [task.id]: e.target.value })}
                                    className="min-h-[80px]"
                                />
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        onClick={() => handleSubmission(task.id, { submissionText: submissionData[task.id] })}
                                        disabled={!submissionData[task.id]?.trim()}
                                        className="bg-amber-500 hover:bg-amber-600"
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        Submit & Complete
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleTaskComplete(task.id)}
                                    >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Mark Complete
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

// Quiz Interface Component
export const QuizInterface = ({ quizData, onComplete }:any) => {
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [answers, setAnswers] = useState([])
    const [showResults, setShowResults] = useState(false)
    const [score, setScore] = useState(0)
    const [showExplanation, setShowExplanation] = useState(false)

    const handleAnswer = (answerIndex: number) => {
        const newAnswers:any = [...answers]
        newAnswers[currentQuestion] = answerIndex
        setAnswers(newAnswers)
        setShowExplanation(false)
    }

    const handleNext = () => {
        if (currentQuestion < quizData.questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1)
            setShowExplanation(false)
        } else {
            calculateScore()
        }
    }

    const handlePrevious = () => {
        setCurrentQuestion(currentQuestion - 1)
        setShowExplanation(false)
    }

    const calculateScore = async () => {
        const correctAnswers = answers.reduce((count, answer, index) => {
            return answer === quizData.questions[index].correctAnswer ? count + 1 : count
        }, 0)

        const finalScore = (correctAnswers / quizData.questions.length) * 100
        setScore(finalScore)
        setShowResults(true)

        // Save results to Firebase
        const quizResultRef = doc(db, 'quiz-results', `${quizData.roadmapId}_${quizData.nodeId}_${quizData.userId}`)
        await setDoc(quizResultRef, {
            score: finalScore,
            answers,
            completedAt: new Date(),
            passed: finalScore >= quizData.passingScore
        })

        // Auto-complete if passed
        if (finalScore >= quizData.passingScore) {
            setTimeout(onComplete, 3000) // Give user time to see results
        }
    }

    if (showResults) {
        const passed = score >= quizData.passingScore
        return (
            <div className="text-center space-y-6 py-8">
                <div className={`text-6xl font-bold ${passed ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.round(score)}%
                </div>
                <div className="space-y-2">
                    <h3 className="text-2xl font-bold">Quiz Complete!</h3>
                    <p className={`text-lg ${passed ? 'text-green-600' : 'text-red-600'}`}>
                        {passed
                            ? 'Congratulations! You passed!'
                            : `You need ${quizData.passingScore}% to pass. Keep studying and try again.`
                        }
                    </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Results Summary</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                            <div className="font-medium">Correct</div>
                            <div className="text-green-600">{answers.filter((a, i) => a === quizData.questions[i].correctAnswer).length}</div>
                        </div>
                        <div>
                            <div className="font-medium">Incorrect</div>
                            <div className="text-red-600">{answers.filter((a, i) => a !== quizData.questions[i].correctAnswer).length}</div>
                        </div>
                        <div>
                            <div className="font-medium">Total</div>
                            <div>{quizData.questions.length}</div>
                        </div>
                    </div>
                </div>

                {passed && (
                    <Badge className="bg-green-500 text-white px-4 py-2">
                        Quiz Passed!
                    </Badge>
                )}
            </div>
        )
    }

    const question = quizData.questions[currentQuestion]
    const hasAnswered = answers[currentQuestion] !== undefined

    return (
        <div className="space-y-6">
            <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-pink-800">Quiz: {quizData.title}</h3>
                    <Badge variant="outline" className="border-pink-300 text-pink-700">
                        Question {currentQuestion + 1} of {quizData.questions.length}
                    </Badge>
                </div>
            </div>

            <Progress value={((currentQuestion + 1) / quizData.questions.length) * 100} className="w-full" />

            <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900">{question.question}</h4>
                <div className="space-y-2">
                    {question.options.map((option:any, index:any) => (
                        <Button
                            key={index}
                            variant={answers[currentQuestion] === index ? "default" : "outline"}
                            className={`w-full text-left justify-start p-4 h-auto ${answers[currentQuestion] === index
                                ? "bg-pink-500 hover:bg-pink-600 border-pink-500"
                                : "hover:bg-pink-50 border-gray-200"
                                }`}
                            onClick={() => handleAnswer(index)}
                        >
                            <span className="mr-3 font-semibold">{String.fromCharCode(65 + index)}.</span>
                            {option}
                        </Button>
                    ))}
                </div>

                {hasAnswered && (
                    <Button
                        variant="outline"
                        onClick={() => setShowExplanation(!showExplanation)}
                        className="w-full"
                    >
                        {showExplanation ? 'Hide' : 'Show'} Explanation
                    </Button>
                )}

                {showExplanation && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p className="text-blue-800"><strong>Explanation:</strong> {question.explanation}</p>
                    </div>
                )}
            </div>

            <div className="flex justify-between">
                <Button
                    variant="outline"
                    disabled={currentQuestion === 0}
                    onClick={handlePrevious}
                >
                    Previous
                </Button>
                <Button
                    onClick={handleNext}
                    disabled={!hasAnswered}
                    className="bg-pink-500 hover:bg-pink-600"
                >
                    {currentQuestion === quizData.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                </Button>
            </div>
        </div>
    )
}

// Course Interface Component
export const CourseInterface = ({ courseData, onComplete }:any) => {
    const [modules, setModules] = useState(courseData.modules)
    const [currentModule, setCurrentModule] = useState(0)

    const handleModuleComplete = async (moduleId: string) => {
        const updatedModules = modules.map((module:any) =>
            module.id === moduleId ? { ...module, completed: true } : module
        )
        setModules(updatedModules)

        // Save progress
        const courseDocRef = doc(db, 'learning-content', `${courseData.roadmapId}_${courseData.nodeId}_course`)
        await setDoc(courseDocRef, { ...courseData, modules: updatedModules }, { merge: true })

        // Auto-complete if all modules done
        if (updatedModules.every((module:any) => module.completed)) {
            setTimeout(onComplete, 1500)
        } else {
            // Move to next incomplete module
            const nextIncomplete = updatedModules.findIndex((m:any) => !m.completed)
            if (nextIncomplete !== -1) {
                setCurrentModule(nextIncomplete)
            }
        }
    }

    const completedModules = modules.filter((m:any) => m.completed).length
    const totalModules = modules.length

    if (completedModules === totalModules) {
        return (
            <div className="text-center space-y-6 py-8">
                <div className="animate-bounce">
                    <Trophy className="w-16 h-16 text-blue-500 mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-blue-600">Course Completed!</h3>
                <p className="text-gray-600">You've successfully completed all course modules.</p>
                <Badge className="bg-blue-500 text-white px-4 py-2">Course Complete</Badge>
            </div>
        )
    }

    const module = modules[currentModule]

    return (
        <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-blue-800">{courseData.title}</h3>
                    <Badge variant="outline" className="border-blue-300 text-blue-700">
                        Module {currentModule + 1} of {modules.length}
                    </Badge>
                </div>
            </div>

            <Progress value={(completedModules / totalModules) * 100} className="w-full" />

            <div className="space-y-4">
                <h4 className="text-lg font-medium text-blue-700">{module.title}</h4>
                <div className="bg-white p-6 rounded-lg border prose prose-sm max-w-none">
                    <div className="whitespace-pre-line leading-relaxed text-gray-700">
                        {module.content}
                    </div>
                </div>

                {module.videoUrl && (
                    <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center border">
                        <p className="text-gray-500">Video: {module.videoUrl}</p>
                    </div>
                )}
            </div>

            <div className="flex justify-between">
                <Button
                    variant="outline"
                    disabled={currentModule === 0}
                    onClick={() => setCurrentModule(currentModule - 1)}
                >
                    Previous Module
                </Button>
                <Button
                    onClick={() => handleModuleComplete(module.id)}
                    className="bg-blue-500 hover:bg-blue-600"
                >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete Module
                </Button>
            </div>
        </div>
    )
}

// Concept Interface Component
export const ConceptInterface = ({ conceptData, onComplete }:any) => {
    const [concepts, setConcepts] = useState(conceptData.concepts)
    const [currentConcept, setCurrentConcept] = useState(0)

    const handleConceptComplete = async (conceptId: string) => {
        const updatedConcepts = concepts.map((concept:any) =>
            concept.id === conceptId ? { ...concept, completed: true } : concept
        )
        setConcepts(updatedConcepts)

        // Save progress
        const conceptDocRef = doc(db, 'learning-content', `${conceptData.roadmapId}_${conceptData.nodeId}_concept`)
        await setDoc(conceptDocRef, { ...conceptData, concepts: updatedConcepts }, { merge: true })

        // Auto-complete if all concepts learned
        if (updatedConcepts.every((concept:any) => concept.completed)) {
            setTimeout(onComplete, 1500)
        } else {
            // Move to next concept
            const nextIncomplete = updatedConcepts.findIndex((c:any) => !c.completed)
            if (nextIncomplete !== -1) {
                setCurrentConcept(nextIncomplete)
            }
        }
    }

    const completedConcepts = concepts.filter((c:any) => c.completed).length
    const totalConcepts = concepts.length

    if (completedConcepts === totalConcepts) {
        return (
            <div className="text-center space-y-6 py-8">
                <div className="animate-bounce">
                    <Trophy className="w-16 h-16 text-violet-500 mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-violet-600">All Concepts Mastered!</h3>
                <p className="text-gray-600">You've successfully learned all the key concepts.</p>
                <Badge className="bg-violet-500 text-white px-4 py-2">Concepts Complete</Badge>
            </div>
        )
    }

    const concept = concepts[currentConcept]

    return (
        <div className="space-y-6">
            <div className="bg-violet-50 p-4 rounded-lg border border-violet-200">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-violet-800">{conceptData.title}</h3>
                    <Badge variant="outline" className="border-violet-300 text-violet-700">
                        Concept {currentConcept + 1} of {concepts.length}
                    </Badge>
                </div>
            </div>

            <Progress value={(completedConcepts / totalConcepts) * 100} className="w-full" />

            <div className="space-y-4">
                <h4 className="text-lg font-medium text-violet-700">{concept.title}</h4>
                <div className="bg-violet-50 p-6 rounded-lg border border-violet-200">
                    <p className="text-violet-800 leading-relaxed">{concept.description}</p>
                    {concept.example && (
                        <div className="mt-4 p-4 bg-violet-100 rounded border-l-4 border-violet-500">
                            <p className="text-violet-800"><strong>Example:</strong></p>
                            <p className="text-violet-700 mt-1">{concept.example}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-between">
                <Button
                    variant="outline"
                    disabled={currentConcept === 0}
                    onClick={() => setCurrentConcept(currentConcept - 1)}
                >
                    Previous Concept
                </Button>
                <Button
                    onClick={() => handleConceptComplete(concept.id)}
                    className="bg-violet-500 hover:bg-violet-600"
                >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    I Understand This
                </Button>
            </div>
        </div>
    )
}