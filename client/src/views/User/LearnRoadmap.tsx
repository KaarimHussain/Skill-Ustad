"use client"

import type React from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState, useRef, useCallback, useMemo } from "react"
import { db } from "@/lib/firebase"
import { collection, doc, getDoc, updateDoc, Timestamp, setDoc } from "firebase/firestore"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
    Play,
    BookOpen,
    Target,
    FolderOpen,
    CheckCircle,
    Loader2,
    Move,
    Puzzle,
    BrainCircuit,
    Tag,
    Footprints,
    ZoomIn,
    ZoomOut,
    RotateCcw,
    ArrowLeft,
    Maximize2,
    Minimize2,
    Cable,
    Workflow,
    Sparkles,
    X,
    Trophy,
    Edit3,
    Save,
    Home,
    SkipForward,
} from "lucide-react"
import AuthService from "@/services/auth.service"
import NotificationService from "@/components/Notification"
import { ConceptInterface, CourseInterface, ProjectInterface, QuizInterface } from "@/components/CourseInterface"

interface NodeData {
    label: string
    description: string
}

interface RoadmapNode {
    id: number
    data: NodeData
    type: "start" | "course" | "milestone" | "project" | "concept" | "topic" | "step" | "end" | "quiz"
    position: {
        x: number
        y: number
    }
    completed?: boolean
}

interface RoadmapEdge {
    id: number
    source: number
    target: number
}

interface FirebaseRoadmapData {
    title: string
    nodes: RoadmapNode[]
    edges: RoadmapEdge[]
    createdAt?: any
    userId?: string
    visibility: "public" | "private"
    difficulty: "Easy" | "Medium" | "Hard"
}

interface LearningSession {
    type: 'project' | 'quiz' | 'course' | 'concept' | null
    data: any
    isActive: boolean
}

interface UserNotes {
    [nodeId: string]: string
}

const nodeConfig = {
    start: {
        icon: Play,
        color: "bg-emerald-500",
        textColor: "text-emerald-700",
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-200",
        description: "Starting point of your learning journey",
    },
    course: {
        icon: BookOpen,
        color: "bg-blue-500",
        textColor: "text-blue-700",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        description: "Structured learning content or course",
    },
    milestone: {
        icon: Target,
        color: "bg-purple-500",
        textColor: "text-purple-700",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
        description: "Important achievement or checkpoint",
    },
    project: {
        icon: FolderOpen,
        color: "bg-amber-500",
        textColor: "text-amber-700",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
        description: "Hands-on project or practical application",
    },
    concept: {
        icon: BrainCircuit,
        color: "bg-violet-500",
        textColor: "text-violet-700",
        bgColor: "bg-violet-50",
        borderColor: "border-violet-200",
        description: "Core concept or theoretical knowledge",
    },
    topic: {
        icon: Tag,
        color: "bg-cyan-500",
        textColor: "text-cyan-700",
        bgColor: "bg-cyan-50",
        borderColor: "border-cyan-200",
        description: "Specific topic or subject area",
    },
    step: {
        icon: Footprints,
        color: "bg-teal-500",
        textColor: "text-teal-700",
        bgColor: "bg-teal-50",
        borderColor: "border-teal-200",
        description: "Individual step in the learning process",
    },
    quiz: {
        icon: Sparkles,
        color: "bg-pink-500",
        textColor: "text-pink-700",
        bgColor: "bg-pink-50",
        borderColor: "border-pink-200",
        description: "Quick quiz to test your knowledge",
    },
    end: {
        icon: CheckCircle,
        color: "bg-rose-500",
        textColor: "text-rose-700",
        bgColor: "bg-rose-50",
        borderColor: "border-rose-200",
        description: "Completion or end goal",
    },
}

const defaultNodeConfig = {
    icon: Puzzle,
    color: "bg-indigo-500",
    textColor: "text-indigo-700",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
    description: "General learning element",
}

const NODE_WIDTH = 224
const NODE_HEIGHT = 128
const NODE_HALF_WIDTH = NODE_WIDTH / 2
const NODE_HALF_HEIGHT = NODE_HEIGHT / 2
const SPACING_MULTIPLIER = 2.0

// Progress collection helper functions
const progressCollectionRef = collection(db, "roadmap-progress")

async function getUserProgress(roadmapId: string, userId: string): Promise<string[]> {
    const progressDocRef = doc(progressCollectionRef, `${roadmapId}_${userId}`)
    const progressDoc = await getDoc(progressDocRef)

    if (progressDoc.exists()) {
        return progressDoc.data()?.progress || []
    }
    return []
}

async function updateUserProgress(roadmapId: string, userId: string, completedNodeIds: string[]) {
    const progressDocRef = doc(progressCollectionRef, `${roadmapId}_${userId}`)
    await updateDoc(progressDocRef, {
        progress: completedNodeIds,
        lastUpdated: Timestamp.now(),
    })
}

const getUserId = () => {
    try {
        return AuthService.getAuthenticatedUserId()
    } catch {
        return "demo-user"
    }
}

const showNotification = {
    success: (title: string, message: string) => {
        try {
            NotificationService.success(title, message)
        } catch {
            console.log(`Success: ${title} - ${message}`)
        }
    },
    error: (title: string, message: string) => {
        try {
            NotificationService.error(title, message)
        } catch {
            console.log(`Error: ${title} - ${message}`)
        }
    },
}

export default function LearnRoadmap() {
    const { id } = useParams()
    const navigate = useNavigate();
    const [roadmapData, setRoadmapData] = useState<FirebaseRoadmapData | null>(null)
    const [progress, setProgress] = useState<string[]>([])
    const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [courseLoading, setCourseLoading] = useState(false);
    const [userNotes, setUserNotes] = useState<UserNotes>({})
    const [currentNote, setCurrentNote] = useState("")
    const [isEditingNote, setIsEditingNote] = useState(false)

    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
    const [scale, setScale] = useState(0.8)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [learningSession, setLearningSession] = useState<LearningSession>({
        type: null,
        data: null,
        isActive: false
    })
    const [showInterviewDialog, setShowInterviewDialog] = useState(false);
    const [isInterviewStart, setIsInterviewStart] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLDivElement>(null)

    const nodeMap = useMemo(() => {
        if (!roadmapData?.nodes) return new Map()
        return new Map(roadmapData.nodes.map((node) => [node.id, node]))
    }, [roadmapData?.nodes])

    const nodeStats = useMemo(() => {
        if (!roadmapData?.nodes) return {}
        return roadmapData.nodes.reduce(
            (acc, node) => {
                acc[node.type] = (acc[node.type] || 0) + 1
                return acc
            },
            {} as Record<string, number>,
        )
    }, [roadmapData?.nodes])

    const canvasDimensions = useMemo(() => {
        if (!roadmapData?.nodes?.length) {
            return { width: 1200, height: 800 }
        }

        const maxAbsX = Math.max(...roadmapData.nodes.map((n) => Math.abs(n.position.x)))
        const maxAbsY = Math.max(...roadmapData.nodes.map((n) => Math.abs(n.position.y)))

        const contentExtentX = maxAbsX * SPACING_MULTIPLIER + NODE_HALF_WIDTH
        const contentExtentY = maxAbsY * SPACING_MULTIPLIER + NODE_HALF_HEIGHT

        const BUFFER_PADDING = 300

        const calculatedWidth = contentExtentX * 2 + 2 * BUFFER_PADDING
        const calculatedHeight = contentExtentY * 2 + 2 * BUFFER_PADDING

        const finalWidth = Math.max(1200, calculatedWidth)
        const finalHeight = Math.max(800, calculatedHeight)

        return {
            width: finalWidth,
            height: finalHeight,
        }
    }, [roadmapData?.nodes])

    // Initialize learning session
    useEffect(() => {
        const userId = getUserId()
        if (!userId) {
            showNotification.error("Login Required", "Cannot find the User Id")
            navigate("/login")
            return
        }

        const initLearningSession = async () => {
            try {
                const docRef = doc(db, "roadmaps", id as string)
                const docSnap = await getDoc(docRef)
                if (docSnap.exists()) {
                    const data = docSnap.data() as FirebaseRoadmapData

                    const userProgress = await getUserProgress(id as string, userId)
                    setProgress(userProgress)

                    const nodesWithProgress = data.nodes.map((node) => ({
                        ...node,
                        completed: userProgress.includes(node.id.toString()),
                    }))

                    setRoadmapData({ ...data, nodes: nodesWithProgress })

                    const firstNode = nodesWithProgress.find((node) => node.type === "start") || nodesWithProgress[0]
                    setSelectedNode(firstNode)
                }
            } catch (error) {
                console.error("Error initializing learning session:", error)
            } finally {
                setIsLoading(false)
            }
        }

        if (id && userId) {
            initLearningSession()
        }
    }, [id])

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault()
            const delta = e.deltaY > 0 ? -0.1 : 0.1
            setScale((prev) => Math.max(0.2, Math.min(2, prev + delta)))
        }

        container.addEventListener("wheel", handleWheel, { passive: false })
        return () => container.removeEventListener("wheel", handleWheel)
    }, [])



    const handleMouseDown = useCallback(
        (e: React.MouseEvent) => {
            if (e.button === 0) {
                setIsDragging(true)
                setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y })
                e.preventDefault()
            }
        },
        [panOffset],
    )

    const handleMouseMove = useCallback(
        (e: React.MouseEvent) => {
            if (isDragging) {
                e.preventDefault()
                setPanOffset({
                    x: e.clientX - dragStart.x,
                    y: e.clientY - dragStart.y,
                })
            }
        },
        [isDragging, dragStart],
    )

    const handleMouseUp = useCallback(() => {
        setIsDragging(false)
    }, [])

    const resetView = useCallback(() => {
        setPanOffset({ x: 0, y: 0 })
        setScale(0.8)
    }, [])

    const zoomIn = useCallback(() => {
        setScale((prev) => Math.min(2, prev + 0.2))
    }, [])

    const zoomOut = useCallback(() => {
        setScale((prev) => Math.max(0.2, prev - 0.2))
    }, [])

    const toggleFullscreen = useCallback(() => {
        setIsFullscreen((prev) => !prev)
    }, [])

    const handleNodeClick = useCallback(
        (node: RoadmapNode) => {
            setSelectedNode(selectedNode?.id === node.id ? null : node)
        },
        [selectedNode],
    )

    // Complete a node and move to next
    const completeCurrentNode = async () => {
        const userId = getUserId()
        if (!userId || !selectedNode || !roadmapData) return

        const newProgress = [...new Set([...progress, selectedNode.id.toString()])]
        setProgress(newProgress)

        await updateUserProgress(id as string, userId, newProgress)

        const updatedNodes = roadmapData.nodes.map((node) =>
            node.id === selectedNode.id ? { ...node, completed: true } : node,
        )
        setRoadmapData({ ...roadmapData, nodes: updatedNodes })

        showNotification.success("Progress Saved", `Completed: ${selectedNode.data.label}`)
    }

    // Navigate to next incomplete node
    const navigateToNextNode = () => {
        if (!roadmapData || !selectedNode) return

        // Find connected nodes through edges
        const connectedEdges = roadmapData.edges.filter((edge) => edge.source === selectedNode.id)
        const nextNodes = connectedEdges
            .map((edge) => roadmapData.nodes.find((node) => node.id === edge.target))
            .filter(Boolean)

        // Find first incomplete connected node
        const nextIncompleteNode = nextNodes.find((node) => !progress.includes(node!.id.toString()))

        if (nextIncompleteNode) {
            setSelectedNode(nextIncompleteNode)
        }
    }

    // Save user notes
    const saveNote = () => {
        if (!selectedNode) return
        setUserNotes((prev) => ({
            ...prev,
            [selectedNode.id]: currentNote,
        }))
        setIsEditingNote(false)
        showNotification.success("Note Saved", "Your note has been saved locally")
    }
    const handleCourseGenerate = async (selectedNode: RoadmapNode, userId: string, roadmapId: string) => {
        try {
            const courseDocRef = doc(db, 'learning-content', `${roadmapId}_${selectedNode.id}_course`)
            const courseDoc = await getDoc(courseDocRef)

            let courseData
            if (courseDoc.exists()) {
                courseData = courseDoc.data()
            } else {
                // Call FastAPI to generate content
                const apiResponse = await fetch('http://127.0.0.1:8000/roadmap/api/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        nodeType: 'course',
                        nodeLabel: selectedNode.data.label,
                        nodeDescription: selectedNode.data.description,
                        difficulty: roadmapData?.difficulty.toLowerCase(),
                        learningPath: roadmapData?.title || 'General',
                    }),
                });

                if (apiResponse.ok) {
                    const generated = await apiResponse.json();
                    if (generated.success) {
                        courseData = {
                            nodeId: selectedNode.id,
                            roadmapId,
                            type: 'course',
                            title: selectedNode.data.label,
                            description: selectedNode.data.description,
                            modules: generated.content.map((module: any) => ({
                                ...module,
                                completed: module.completed ?? false,
                            })),
                            createdAt: new Date(),
                            userId,
                        };
                    } else {
                        // Fallback if API generation failed
                        courseData = {
                            nodeId: selectedNode.id,
                            roadmapId,
                            type: 'course',
                            title: selectedNode.data.label,
                            description: selectedNode.data.description,
                            modules: [
                                {
                                    id: '1',
                                    title: 'Introduction',
                                    content: `Welcome to ${selectedNode.data.label}! In this module, you'll learn: ${selectedNode.data.description}`,
                                    completed: false
                                },
                                {
                                    id: '2',
                                    title: 'Core Concepts',
                                    content: `Let's dive deeper into the main concepts of ${selectedNode.data.label}. This will build your foundational understanding.`,
                                    completed: false
                                },
                                {
                                    id: '3',
                                    title: 'Practical Applications',
                                    content: `Now let's see how to apply what you've learned about ${selectedNode.data.label} in real-world scenarios.`,
                                    completed: false
                                }
                            ],
                            createdAt: new Date(),
                            userId
                        };
                    }
                } else {
                    // Fallback on API error
                    courseData = {
                        nodeId: selectedNode.id,
                        roadmapId,
                        type: 'course',
                        title: selectedNode.data.label,
                        description: selectedNode.data.description,
                        modules: [
                            {
                                id: '1',
                                title: 'Introduction',
                                content: `Welcome to ${selectedNode.data.label}! In this module, you'll learn: ${selectedNode.data.description}`,
                                completed: false
                            },
                            {
                                id: '2',
                                title: 'Core Concepts',
                                content: `Let's dive deeper into the main concepts of ${selectedNode.data.label}. This will build your foundational understanding.`,
                                completed: false
                            },
                            {
                                id: '3',
                                title: 'Practical Applications',
                                content: `Now let's see how to apply what you've learned about ${selectedNode.data.label} in real-world scenarios.`,
                                completed: false
                            }
                        ],
                        createdAt: new Date(),
                        userId
                    };
                }
                await setDoc(courseDocRef, courseData);
            }

            return courseData
        } catch (error) {
            console.error('Error handling course:', error)
            throw error
        }
    }

    const handleQuizGenerate = async (selectedNode: RoadmapNode, userId: string, roadmapId: string) => {
        try {
            const quizDocRef = doc(db, 'learning-content', `${roadmapId}_${selectedNode.id}_quiz`)
            const quizDoc = await getDoc(quizDocRef)

            let quizData
            if (quizDoc.exists()) {
                quizData = quizDoc.data()
            } else {
                // Call FastAPI to generate content
                const apiResponse = await fetch('http://127.0.0.1:8000/roadmap/api/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        nodeType: 'quiz',
                        nodeLabel: selectedNode.data.label,
                        nodeDescription: selectedNode.data.description,
                        difficulty: roadmapData?.difficulty.toLowerCase(),
                        learningPath: roadmapData?.title || 'General',
                    }),
                });

                if (apiResponse.ok) {
                    const generated = await apiResponse.json();
                    if (generated.success) {
                        quizData = {
                            nodeId: selectedNode.id,
                            roadmapId,
                            type: 'quiz',
                            title: selectedNode.data.label,
                            description: selectedNode.data.description,
                            questions: generated.content,
                            passingScore: 70,
                            createdAt: new Date(),
                            userId,
                        };
                    } else {
                        // Fallback if API generation failed
                        quizData = {
                            nodeId: selectedNode.id,
                            roadmapId,
                            type: 'quiz',
                            title: selectedNode.data.label,
                            description: selectedNode.data.description,
                            questions: [
                                {
                                    id: '1',
                                    question: `What is the main purpose of ${selectedNode.data.label}?`,
                                    options: [
                                        'To provide foundational knowledge',
                                        'To test understanding',
                                        'To apply concepts practically',
                                        'All of the above'
                                    ],
                                    correctAnswer: 3,
                                    explanation: 'Learning encompasses understanding, testing, and practical application.'
                                },
                                {
                                    id: '2',
                                    question: `Which approach is most effective for mastering ${selectedNode.data.label}?`,
                                    options: [
                                        'Reading only',
                                        'Practice only',
                                        'Theory and practice combined',
                                        'Memorization'
                                    ],
                                    correctAnswer: 2,
                                    explanation: 'Combining theoretical knowledge with practical application leads to deeper understanding.'
                                }
                            ],
                            passingScore: 70,
                            createdAt: new Date(),
                            userId
                        };
                    }
                } else {
                    // Fallback on API error
                    quizData = {
                        nodeId: selectedNode.id,
                        roadmapId,
                        type: 'quiz',
                        title: selectedNode.data.label,
                        description: selectedNode.data.description,
                        questions: [
                            {
                                id: '1',
                                question: `What is the main purpose of ${selectedNode.data.label}?`,
                                options: [
                                    'To provide foundational knowledge',
                                    'To test understanding',
                                    'To apply concepts practically',
                                    'All of the above'
                                ],
                                correctAnswer: 3,
                                explanation: 'Learning encompasses understanding, testing, and practical application.'
                            },
                            {
                                id: '2',
                                question: `Which approach is most effective for mastering ${selectedNode.data.label}?`,
                                options: [
                                    'Reading only',
                                    'Practice only',
                                    'Theory and practice combined',
                                    'Memorization'
                                ],
                                correctAnswer: 2,
                                explanation: 'Combining theoretical knowledge with practical application leads to deeper understanding.'
                            }
                        ],
                        passingScore: 70,
                        createdAt: new Date(),
                        userId
                    };
                }
                await setDoc(quizDocRef, quizData);
            }

            return quizData
        } catch (error) {
            console.error('Error handling quiz:', error)
            throw error
        }
    }

    const handleProjectGenerate = async (selectedNode: RoadmapNode, userId: string, roadmapId: string) => {
        try {
            const projectDocRef = doc(db, 'learning-content', `${roadmapId}_${selectedNode.id}_project`)
            const projectDoc = await getDoc(projectDocRef)

            let projectData
            if (projectDoc.exists()) {
                projectData = projectDoc.data()
            } else {
                // Call FastAPI to generate content
                const apiResponse = await fetch('http://127.0.0.1:8000/roadmap/api/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        nodeType: 'project',
                        nodeLabel: selectedNode.data.label,
                        nodeDescription: selectedNode.data.description,
                        difficulty: roadmapData?.difficulty.toLowerCase(),
                        learningPath: roadmapData?.title || 'General',
                    }),
                });

                if (apiResponse.ok) {
                    const generated = await apiResponse.json();
                    if (generated.success) {
                        projectData = {
                            nodeId: selectedNode.id,
                            roadmapId,
                            type: 'project',
                            title: selectedNode.data.label,
                            description: selectedNode.data.description,
                            tasks: generated.content.map((task: any) => ({
                                ...task,
                                completed: task.completed ?? false,
                            })),
                            createdAt: new Date(),
                            userId,
                        };
                    } else {
                        // Fallback if API generation failed
                        projectData = {
                            nodeId: selectedNode.id,
                            roadmapId,
                            type: 'project',
                            title: selectedNode.data.label,
                            description: selectedNode.data.description,
                            tasks: [
                                {
                                    id: '1',
                                    title: 'Project Setup & Planning',
                                    description: `Set up your ${selectedNode.data.label} project structure and create a detailed plan.`,
                                    completed: false
                                },
                                {
                                    id: '2',
                                    title: 'Core Implementation',
                                    description: `Implement the main functionality for ${selectedNode.data.label}.`,
                                    completed: false
                                },
                                {
                                    id: '3',
                                    title: 'Testing & Documentation',
                                    description: `Test your implementation thoroughly and create comprehensive documentation.`,
                                    completed: false
                                },
                                {
                                    id: '4',
                                    title: 'Final Review & Submission',
                                    description: `Review your work, make final improvements, and submit your project.`,
                                    completed: false
                                }
                            ],
                            createdAt: new Date(),
                            userId
                        };
                    }
                } else {
                    // Fallback on API error
                    projectData = {
                        nodeId: selectedNode.id,
                        roadmapId,
                        type: 'project',
                        title: selectedNode.data.label,
                        description: selectedNode.data.description,
                        tasks: [
                            {
                                id: '1',
                                title: 'Project Setup & Planning',
                                description: `Set up your ${selectedNode.data.label} project structure and create a detailed plan.`,
                                completed: false
                            },
                            {
                                id: '2',
                                title: 'Core Implementation',
                                description: `Implement the main functionality for ${selectedNode.data.label}.`,
                                completed: false
                            },
                            {
                                id: '3',
                                title: 'Testing & Documentation',
                                description: `Test your implementation thoroughly and create comprehensive documentation.`,
                                completed: false
                            },
                            {
                                id: '4',
                                title: 'Final Review & Submission',
                                description: `Review your work, make final improvements, and submit your project.`,
                                completed: false
                            }
                        ],
                        createdAt: new Date(),
                        userId
                    };
                }
                await setDoc(projectDocRef, projectData);
            }

            return projectData
        } catch (error) {
            console.error('Error handling project:', error)
            throw error
        }
    }
    const handleConceptsGenerate = async (selectedNode: RoadmapNode, userId: string, roadmapId: string) => {
        try {
            const conceptDocRef = doc(db, 'learning-content', `${roadmapId}_${selectedNode.id}_concept`);
            const conceptDoc = await getDoc(conceptDocRef);

            let conceptData;
            if (conceptDoc.exists()) {
                conceptData = conceptDoc.data();
                console.log('Loaded existing concept data from Firebase:', conceptData);
            } else {
                // Call FastAPI to generate content
                const apiResponse = await fetch('/api/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        nodeType: 'concept',
                        nodeLabel: selectedNode.data.label,
                        nodeDescription: selectedNode.data.description,
                        difficulty: roadmapData?.difficulty.toLowerCase(),
                        learningPath: roadmapData?.title || 'General',
                    }),
                });

                if (apiResponse.ok) {
                    const generated = await apiResponse.json();
                    console.log('API response for concepts:', generated);
                    if (generated.success && Array.isArray(generated.content)) {
                        conceptData = {
                            nodeId: selectedNode.id,
                            roadmapId,
                            type: 'concept',
                            title: selectedNode.data.label,
                            description: selectedNode.data.description,
                            concepts: generated.content.map((concept: any) => ({
                                id: concept.id,
                                title: concept.title,
                                description: concept.description,
                                example: concept.example,
                                completed: concept.completed ?? false,
                            })),
                            createdAt: new Date(),
                            userId,
                        };
                    } else {
                        console.warn('API generation failed or invalid content:', generated.error || 'Content is not an array');
                        conceptData = {
                            nodeId: selectedNode.id,
                            roadmapId,
                            type: 'concept',
                            title: selectedNode.data.label,
                            description: selectedNode.data.description,
                            concepts: [
                                {
                                    id: '1',
                                    title: `Understanding ${selectedNode.data.label}`,
                                    description: `${selectedNode.data.description} This forms the foundation of your learning journey.`,
                                    example: `For example, in ${selectedNode.data.label}, you might encounter scenarios where...`,
                                    completed: false
                                },
                                {
                                    id: '2',
                                    title: `Key Principles`,
                                    description: `The fundamental principles that govern ${selectedNode.data.label} and how they apply in different contexts.`,
                                    example: 'Consider how these principles work in real-world applications.',
                                    completed: false
                                },
                                {
                                    id: '3',
                                    title: 'Best Practices',
                                    description: `Industry-standard approaches and methodologies for ${selectedNode.data.label}.`,
                                    example: 'Professional developers typically follow these patterns when working with this concept.',
                                    completed: false
                                }
                            ],
                            createdAt: new Date(),
                            userId
                        };
                    }
                } else {
                    console.error('API request failed:', apiResponse.status, apiResponse.statusText);
                    conceptData = {
                        nodeId: selectedNode.id,
                        roadmapId,
                        type: 'concept',
                        title: selectedNode.data.label,
                        description: selectedNode.data.description,
                        concepts: [
                            {
                                id: '1',
                                title: `Understanding ${selectedNode.data.label}`,
                                description: `${selectedNode.data.description} This forms the foundation of your learning journey.`,
                                example: `For example, in ${selectedNode.data.label}, you might encounter scenarios where...`,
                                completed: false
                            },
                            {
                                id: '2',
                                title: `Key Principles`,
                                description: `The fundamental principles that govern ${selectedNode.data.label} and how they apply in different contexts.`,
                                example: 'Consider how these principles work in real-world applications.',
                                completed: false
                            },
                            {
                                id: '3',
                                title: 'Best Practices',
                                description: `Industry-standard approaches and methodologies for ${selectedNode.data.label}.`,
                                example: 'Professional developers typically follow these patterns when working with this concept.',
                                completed: false
                            }
                        ],
                        createdAt: new Date(),
                        userId
                    };
                }
                await setDoc(conceptDocRef, conceptData);
                console.log('Saved concept data to Firebase:', conceptData);
            }

            return conceptData;
        } catch (error) {
            console.error('Error handling concept:', error);
            throw error;
        }
    };
    const startCourseSession = async () => {
        if (!selectedNode) return
        const userId = getUserId()
        setCourseLoading(true);
        try {
            const courseData = await handleCourseGenerate(selectedNode, userId!, id as string)
            setLearningSession({
                type: 'course',
                data: courseData,
                isActive: true
            })
        } catch (error) {
            showNotification.error("Error", "Failed to start course session")
        } finally {
            setCourseLoading(false);
        }
    }

    const startQuizSession = async () => {
        if (!selectedNode) return
        const userId = getUserId()
        setCourseLoading(true);
        try {
            const quizData = await handleQuizGenerate(selectedNode, userId!, id as string)
            setLearningSession({
                type: 'quiz',
                data: quizData,
                isActive: true
            })
        } catch (error) {
            showNotification.error("Error", "Failed to start quiz session")
        } finally {
            setCourseLoading(false);
        }
    }

    const startProjectSession = async () => {
        if (!selectedNode) return
        const userId = getUserId()
        setCourseLoading(true);
        try {
            const projectData = await handleProjectGenerate(selectedNode, userId!, id as string)
            setLearningSession({
                type: 'project',
                data: projectData,
                isActive: true
            })
        } catch (error) {
            showNotification.error("Error", "Failed to start project session")
        } finally {
            setCourseLoading(false);
        }
    }

    const startConceptSession = async () => {
        if (!selectedNode) return;
        const userId = getUserId();
        try {
            const conceptData = await handleConceptsGenerate(selectedNode, userId!, id as string);
            console.log('Starting concept session with data:', conceptData);
            setLearningSession({
                type: 'concept',
                data: conceptData,
                isActive: true
            });
        } catch (error) {
            showNotification.error("Error", "Failed to start concept session");
            console.error('Failed to start concept session:', error);
        }
    };

    // Handle session completion with automatic progress saving
    const handleSessionComplete = async () => {
        await completeCurrentNode()
        setLearningSession({
            type: null,
            data: null,
            isActive: false
        })
        // Auto-navigate to next node
        setTimeout(navigateToNextNode, 1000)
    }

    // Close learning session
    const closeLearningSession = () => {
        setLearningSession({
            type: null,
            data: null,
            isActive: false
        })
    }

    // Load note for selected node
    useEffect(() => {
        if (selectedNode) {
            setCurrentNote(userNotes[selectedNode.id] || "")
        }
    }, [selectedNode, userNotes])

    // Don't conditionally return before hooks
    const progressPercentage = roadmapData ? Math.round((progress.length / roadmapData.nodes.length) * 100) : 0;

    useEffect(() => {
        if (roadmapData && progressPercentage === 100) {
            setShowInterviewDialog(true);
        } else {
            setShowInterviewDialog(false);
        }
    }, [progressPercentage, roadmapData]);



    // Render loading and empty states after hooks
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-indigo-600" />
                    <p className="text-gray-600">Preparing your learning journey...</p>
                </div>
            </div>
        );
    }

    if (!roadmapData) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="text-center">
                    <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Learning Complete!</h2>
                    <p className="text-gray-600 mb-4">Congratulations! You've completed this roadmap.</p>
                    <Button onClick={() => navigate("/public/roadmaps")} className="bg-indigo-500 hover:bg-indigo-600">
                        Browse More Roadmaps
                    </Button>
                </div>
            </div>
        );
    }

    const startTheInterview = async () => {
        if (!roadmapData) return;
        setIsInterviewStart(true)
        console.log("RoadmapData: ", roadmapData);
        var requestObject = {
            title: roadmapData.title,
            nodes: roadmapData.nodes
        }

        console.log("Request Object:", requestObject);
        try {
            const apiResponse = await fetch('http://127.0.0.1:8000/roadmap/api/interview-questions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestObject),
            });

            interface LocationState {
                technology?: string
                experienceLevel?: string
                questions?: string
                language?: string
            }

            const data = await apiResponse.json()


            console.log("OLLAMA Response on FRONTEND:", data);
            var interviewData: LocationState = {
                technology: roadmapData.title,
                experienceLevel: "Beginner",
                questions: data,
                language: "eng"
            }
            navigate("/ai/interview", { state: interviewData });

        } catch (error: any) {
            NotificationService.error("Failed to Start the Interview", "Error: " + error.message);
            console.error("Error starting interview:", error);
        }
        setIsInterviewStart(false);
    }


    return (
        <TooltipProvider>
            {/* Interview Dialog when roadmap is completed */}
            {showInterviewDialog && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[100]">
                    <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8">
                        <div className="flex flex-col items-center">
                            <Trophy className="w-16 h-16 text-yellow-500 mb-4" />
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Roadmap Completed!</h2>
                            <p className="text-gray-700 mb-4 text-center">Congratulations! You've completed this roadmap. Would you like to conduct an interview to test your skills?</p>
                            <div className="flex gap-4 mt-2">
                                <Button
                                    disabled={isInterviewStart}
                                    className="bg-indigo-500 hover:bg-indigo-600 text-white"
                                    onClick={() => startTheInterview()}
                                >
                                    {isInterviewStart ? "Starting..." : "Conduct Interview"}
                                </Button>

                                <Button variant="outline" onClick={() => navigate("/jobs")}>
                                    Explore Jobs
                                </Button>
                                <Button variant="outline" onClick={() => setShowInterviewDialog(false)}>
                                    Maybe Later
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {learningSession.isActive && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-lg bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold">
                                    {learningSession.type === 'course' && 'Course Session'}
                                    {learningSession.type === 'quiz' && 'Quiz Session'}
                                    {learningSession.type === 'project' && 'Project Session'}
                                    {learningSession.type === 'concept' && 'Concept Learning'}
                                </h2>
                                <Button variant="ghost" onClick={closeLearningSession}>
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            {learningSession.type === 'course' && (
                                <CourseInterface
                                    courseData={learningSession.data}
                                    onComplete={handleSessionComplete}
                                />
                            )}
                            {learningSession.type === 'quiz' && (
                                <QuizInterface
                                    quizData={learningSession.data}
                                    onComplete={handleSessionComplete}
                                />
                            )}
                            {learningSession.type === 'project' && (
                                <ProjectInterface
                                    projectData={learningSession.data}
                                    onComplete={handleSessionComplete}
                                />
                            )}
                            {learningSession.type === 'concept' && (
                                <ConceptInterface
                                    conceptData={learningSession.data}
                                    onComplete={handleSessionComplete}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
            <div className={`${isFullscreen ? "fixed inset-0 z-50" : "h-screen"} w-full flex flex-col bg-gray-50 pt-18`}>
                <div className="bg-white border-b shadow-sm flex-shrink-0">
                    <div className="p-4">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex flex-row items-center gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Button variant="ghost" size="sm" onClick={() => navigate(`/user/roadmap/${id}`)}>
                                            <ArrowLeft className="w-4 h-4 mr-2" />
                                            Back
                                        </Button>
                                        <h1 className="text-2xl font-bold text-gray-900">{roadmapData.title}</h1>
                                        <Badge variant="secondary" className="text-xs">
                                            Learning Mode
                                        </Badge>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Progress value={progressPercentage} className="w-32" />
                                            <span className="text-sm text-gray-600">{progressPercentage}%</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Workflow className="w-4 h-4" />
                                            <span>
                                                {progress.length} of {roadmapData.nodes.length} completed
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Cable className="w-4 h-4" />
                                            <span>{roadmapData.edges?.length || 0} connections</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap justify-end items-center gap-2 mt-4 md:mt-0">
                                <div className="hidden md:flex items-center gap-1 text-xs text-gray-500 mr-4">
                                    <Move className="w-3 h-3" />
                                    <span>Drag to pan • Scroll to zoom • Click nodes to learn</span>
                                </div>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button onClick={zoomOut} variant="outline" size="sm">
                                            <ZoomOut className="w-4 h-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Zoom Out</TooltipContent>
                                </Tooltip>

                                <span className="text-sm text-gray-600 min-w-[3rem] text-center">{Math.round(scale * 100)}%</span>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button onClick={zoomIn} variant="outline" size="sm">
                                            <ZoomIn className="w-4 h-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Zoom In</TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button onClick={resetView} variant="outline" size="sm">
                                            <RotateCcw className="w-4 h-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Reset View</TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button onClick={toggleFullscreen} variant="outline" size="sm">
                                            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</TooltipContent>
                                </Tooltip>

                                <Button onClick={() => navigate("/")} variant="outline" size="sm">
                                    <Home className="w-4 h-4 mr-2" />
                                    Home
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* Visual Roadmap Canvas */}
                    <div
                        ref={containerRef}
                        className="flex-1 relative bg-gradient-to-br from-gray-50 to-gray-100 select-none overflow-hidden"
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        style={{ touchAction: "none" }}
                    >
                        <div
                            ref={canvasRef}
                            className={`relative w-full h-full ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
                            style={{
                                transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${scale})`,
                                transformOrigin: "center center",
                                transition: isDragging ? "none" : "transform 0.2s ease-out",
                            }}
                        >
                            {/* Grid Background */}
                            <div
                                className="absolute inset-0 opacity-30"
                                style={{
                                    backgroundImage: `radial-gradient(circle, rgba(148, 163, 184, 0.4) 1px, transparent 1px)`,
                                    backgroundSize: `${40 * scale}px ${40 * scale}px`,
                                    backgroundPosition: `${panOffset.x}px ${panOffset.y}px`,
                                }}
                            />

                            {/* SVG for connections */}
                            <svg
                                className="absolute pointer-events-none"
                                style={{
                                    width: `${canvasDimensions.width}px`,
                                    height: `${canvasDimensions.height}px`,
                                    left: "50%",
                                    top: "50%",
                                    transform: "translate(-50%, -50%)",
                                }}
                                viewBox={`0 0 ${canvasDimensions.width} ${canvasDimensions.height}`}
                                preserveAspectRatio="xMidYMid meet"
                            >
                                <defs>
                                    <marker
                                        id="arrowhead"
                                        markerWidth="10"
                                        markerHeight="7"
                                        refX="9"
                                        refY="3.5"
                                        orient="auto"
                                        markerUnits="strokeWidth"
                                    >
                                        <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
                                    </marker>
                                </defs>

                                {roadmapData.edges?.map((edge) => {
                                    const fromNode = nodeMap.get(edge.source)
                                    const toNode = nodeMap.get(edge.target)
                                    if (!fromNode || !toNode) return null

                                    const startX = fromNode.position.x * SPACING_MULTIPLIER + canvasDimensions.width / 2
                                    const startY = fromNode.position.y * SPACING_MULTIPLIER + canvasDimensions.height / 2
                                    const endX = toNode.position.x * SPACING_MULTIPLIER + canvasDimensions.width / 2
                                    const endY = toNode.position.y * SPACING_MULTIPLIER + canvasDimensions.height / 2

                                    const isHighlighted =
                                        selectedNode && (selectedNode.id === edge.source || selectedNode.id === edge.target)

                                    return (
                                        <line
                                            key={edge.id}
                                            x1={startX}
                                            y1={startY}
                                            x2={endX}
                                            y2={endY}
                                            stroke={isHighlighted ? "#3b82f6" : "#64748b"}
                                            strokeWidth={isHighlighted ? "3" : "2"}
                                            markerEnd="url(#arrowhead)"
                                            className="transition-all duration-200"
                                        />
                                    )
                                })}
                            </svg>

                            {roadmapData.nodes?.map((node) => {
                                const config = nodeConfig[node.type] || defaultNodeConfig
                                const Icon = config.icon
                                const isSelected = selectedNode?.id === node.id
                                const isCompleted = progress.includes(node.id.toString())
                                const isConnected =
                                    selectedNode &&
                                    roadmapData.edges?.some(
                                        (edge) =>
                                            (edge.source === selectedNode.id && edge.target === node.id) ||
                                            (edge.target === selectedNode.id && edge.source === node.id),
                                    )

                                return (
                                    <div
                                        key={node.id}
                                        className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-auto"
                                        style={{
                                            left: `calc(50% + ${node.position.x * SPACING_MULTIPLIER}px)`,
                                            top: `calc(50% + ${node.position.y * SPACING_MULTIPLIER}px)`,
                                        }}
                                    >
                                        {isCompleted && (
                                            <div className="absolute inset-0 rounded-lg border-4 border-green-400 animate-pulse -m-1" />
                                        )}

                                        <Card
                                            className={`w-56 p-4 transition-all duration-200 cursor-pointer ${isSelected
                                                ? `${config.bgColor} ${config.borderColor} border-2 shadow-lg scale-105 ring-2 ring-blue-300`
                                                : isConnected
                                                    ? `${config.bgColor} ${config.borderColor} border-2 shadow-md scale-102`
                                                    : isCompleted
                                                        ? `bg-green-50 border-green-200 border-2 shadow-sm hover:shadow-md hover:scale-102`
                                                        : `bg-white border-gray-200 border hover:${config.bgColor} hover:${config.borderColor} hover:border-2 shadow-sm hover:shadow-md hover:scale-102`
                                                }`}
                                            onClick={() => handleNodeClick(node)}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`p-2.5 rounded-lg ${config.color} text-white shadow-sm flex-shrink-0 relative`}>
                                                    <Icon size={16} />
                                                    {isCompleted && (
                                                        <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5">
                                                            <CheckCircle className="w-3 h-3 text-white" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3
                                                        className={`font-semibold text-sm mb-2 leading-tight ${isSelected || isConnected
                                                            ? config.textColor
                                                            : isCompleted
                                                                ? "text-green-700"
                                                                : "text-gray-900"
                                                            }`}
                                                    >
                                                        {node.data.label}
                                                    </h3>
                                                    <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">{node.data.description}</p>
                                                </div>
                                            </div>
                                            <div className="mt-3 flex justify-between items-center">
                                                <Badge
                                                    variant="secondary"
                                                    className={`text-xs px-2 py-1 ${isSelected || isConnected
                                                        ? `${config.textColor} ${config.bgColor}`
                                                        : isCompleted
                                                            ? "text-green-700 bg-green-100"
                                                            : "text-gray-600 bg-gray-100"
                                                        }`}
                                                >
                                                    {node.type}
                                                </Badge>
                                                <div className="text-xs text-gray-400">#{node.id}</div>
                                            </div>
                                        </Card>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {selectedNode && (
                        <div className="w-full md:w-96 bg-white border-l shadow-lg flex-shrink-0 overflow-y-auto absolute bottom-0 left-0 right-0 md:relative md:bottom-auto md:left-auto md:right-auto h-1/2 md:h-auto z-20">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Learning Content</h3>
                                    <div className="flex items-center gap-2">
                                        {progress.includes(selectedNode.id.toString()) && (
                                            <Badge className="bg-green-500 text-white">Completed</Badge>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setSelectedNode(null)}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            <X />
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-3">
                                            {(() => {
                                                const config = nodeConfig[selectedNode.type] || defaultNodeConfig
                                                const Icon = config.icon
                                                return (
                                                    <div className={`p-3 rounded-lg ${config.color} text-white`}>
                                                        <Icon size={20} />
                                                    </div>
                                                )
                                            })()}
                                            <div>
                                                <h4 className="font-semibold text-gray-900">{selectedNode.data.label}</h4>
                                                <Badge variant="secondary" className="text-xs mt-1 capitalize">
                                                    {selectedNode.type}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <Tabs defaultValue="content" className="w-full">
                                        <TabsList className="grid w-full grid-cols-2">
                                            <TabsTrigger value="content">Learn</TabsTrigger>
                                            <TabsTrigger value="notes">Notes</TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="content" className="mt-4 space-y-4">
                                            <div className={`${(nodeConfig[selectedNode.type] || defaultNodeConfig).bgColor} p-4 rounded-lg`}>
                                                <p className="text-sm leading-relaxed">{selectedNode.data.description}</p>
                                            </div>

                                            {/* Type-specific content */}
                                            {selectedNode.type === "project" && (
                                                <div className="space-y-3">
                                                    <h5 className="font-medium text-gray-900">Project Requirements</h5>
                                                    <ul className="text-sm space-y-1 text-gray-600">
                                                        <li>• Implement core functionality</li>
                                                        <li>• Add proper error handling</li>
                                                        <li>• Write documentation</li>
                                                    </ul>
                                                    <Button disabled={courseLoading} onClick={startProjectSession} className="w-full bg-amber-500 hover:bg-amber-600">
                                                        <FolderOpen className="w-4 h-4 mr-2" />
                                                        {courseLoading ? "Generating..." : "Start Project"}
                                                    </Button>
                                                </div>
                                            )}

                                            {selectedNode.type === "quiz" && (
                                                <div className="space-y-3">
                                                    <h5 className="font-medium text-gray-900">Knowledge Check</h5>
                                                    <p className="text-sm text-gray-600">Test your understanding of the concepts covered.</p>
                                                    <Button disabled={courseLoading} onClick={startQuizSession} className="w-full bg-pink-500 hover:bg-pink-600">
                                                        <Sparkles className="w-4 h-4 mr-2" />
                                                        {courseLoading ? "Generating..." : "Take Quiz"}
                                                    </Button>
                                                </div>
                                            )}

                                            {selectedNode.type === "course" && (
                                                <div className="space-y-3">
                                                    <h5 className="font-medium text-gray-900">Learning Objectives</h5>
                                                    <ul className="text-sm space-y-1 text-gray-600">
                                                        <li>• Understand core concepts</li>
                                                        <li>• Apply knowledge practically</li>
                                                        <li>• Complete exercises</li>
                                                    </ul>
                                                    <Button disabled={courseLoading} onClick={startCourseSession} className="w-full bg-blue-500 hover:bg-blue-600">
                                                        <Play className="w-4 h-4 mr-2" />
                                                        {courseLoading ? "Generating..." : "Start Course"}
                                                    </Button>
                                                </div>
                                            )}

                                            {selectedNode.type === "concept" && (
                                                <div className="space-y-3">
                                                    <h5 className="font-medium text-gray-900">Learning Objectives</h5>
                                                    <ul className="text-sm space-y-1 text-gray-600">
                                                        <li>• Understand core concepts</li>
                                                        <li>• Apply knowledge practically</li>
                                                        <li>• Complete exercises</li>
                                                    </ul>
                                                    <Button disabled={courseLoading} onClick={startConceptSession} className="w-full bg-violet-500 hover:bg-violet-600">
                                                        <Play className="w-4 h-4 mr-2" />
                                                        {courseLoading ? "Generating..." : "Start Learning Concepts"}
                                                    </Button>
                                                </div>
                                            )}

                                            {selectedNode.type === "milestone" && (
                                                <div className="space-y-3 text-center">
                                                    <Trophy className="w-12 h-12 text-purple-500 mx-auto" />
                                                    <h5 className="font-medium text-gray-900">Achievement Unlocked!</h5>
                                                    <p className="text-sm text-gray-600">
                                                        You've reached an important milestone in your learning journey.
                                                    </p>
                                                </div>
                                            )}
                                        </TabsContent>

                                        <TabsContent value="notes" className="mt-4 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h5 className="font-medium text-gray-900">Your Notes</h5>
                                                <Button size="sm" variant="outline" onClick={() => setIsEditingNote(!isEditingNote)}>
                                                    {isEditingNote ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                                                </Button>
                                            </div>

                                            {isEditingNote ? (
                                                <div className="space-y-3">
                                                    <Textarea
                                                        value={currentNote}
                                                        onChange={(e) => setCurrentNote(e.target.value)}
                                                        placeholder="Write your notes here..."
                                                        className="min-h-[120px]"
                                                    />
                                                    <div className="flex gap-2">
                                                        <Button size="sm" onClick={saveNote}>
                                                            <Save className="w-4 h-4 mr-2" />
                                                            Save Note
                                                        </Button>
                                                        <Button size="sm" variant="outline" onClick={() => setIsEditingNote(false)}>
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="bg-gray-50 p-4 rounded-lg min-h-[120px]">
                                                    {currentNote ? (
                                                        <p className="text-gray-700 whitespace-pre-wrap text-sm">{currentNote}</p>
                                                    ) : (
                                                        <p className="text-gray-500 italic text-sm">
                                                            No notes yet. Click edit to add your thoughts.
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </TabsContent>
                                    </Tabs>

                                    <div className="pt-4 border-t space-y-3">
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={completeCurrentNode}
                                                className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                                                disabled={progress.includes(selectedNode.id.toString())}
                                            >
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                {progress.includes(selectedNode.id.toString()) ? "Completed" : "Mark Complete"}
                                            </Button>
                                            <Button onClick={navigateToNextNode} variant="outline" className="flex-1 bg-transparent">
                                                <SkipForward className="w-4 h-4 mr-2" />
                                                Next Node
                                            </Button>
                                        </div>

                                        <div className="text-xs text-gray-500 text-center">
                                            Node ID: #{selectedNode.id} • Type: {selectedNode.type}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-white border-t flex-shrink-0">
                    <div className="p-4">
                        <div className="flex flex-wrap gap-4 justify-center">
                            {Object.entries(nodeConfig).map(([type, config]) => {
                                const Icon = config.icon
                                const count = nodeStats[type] || 0
                                const completedCount = roadmapData.nodes.filter(
                                    (node) => node.type === type && progress.includes(node.id.toString()),
                                ).length

                                if (count === 0) return null

                                return (
                                    <Tooltip key={type}>
                                        <TooltipTrigger asChild>
                                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-help">
                                                <div className={`p-1.5 rounded-full ${config.color} text-white`}>
                                                    <Icon size={12} />
                                                </div>
                                                <div>
                                                    <span className="text-sm font-medium capitalize text-gray-700">{type}</span>
                                                    <span className="text-xs text-gray-500 ml-1">
                                                        ({completedCount}/{count})
                                                    </span>
                                                </div>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{config.description}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </TooltipProvider>
    )
}
