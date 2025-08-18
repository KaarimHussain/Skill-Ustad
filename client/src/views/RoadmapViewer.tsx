"use client"

import type React from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState, useRef, useCallback, useMemo } from "react"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore" // Import updateDoc
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
    Info,
    ArrowLeft,
    Maximize2,
    Minimize2,
    Cable,
    Workflow,
    Sparkles,
    X,
} from "lucide-react"
import DifficultyBadge from "@/components/DifficultyBadge"

// Type definitions
interface NodeData {
    label: string
    description: string
}

interface RoadmapNode {
    id: number
    data: NodeData
    type: "start" | "course" | "milestone" | "project" | "concept" | "topic" | "step" | "end" | "quiz" // Added quiz type
    position: {
        x: number
        y: number
    }
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
    visibility: "public" | "private" // Explicitly define as 'public' or 'private'
    difficulty: "Easy" | "Medium" | "Hard"
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

// Define constants for node dimensions and spacing
const NODE_WIDTH = 224 // w-56 in Tailwind CSS
const NODE_HEIGHT = 128 // Approximate height of the card
const NODE_HALF_WIDTH = NODE_WIDTH / 2
const NODE_HALF_HEIGHT = NODE_HEIGHT / 2
const SPACING_MULTIPLIER = 2.0 // This is already used in node positioning

export default function RoadmapViewer() {
    const { id } = useParams()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [roadmapData, setRoadmapData] = useState<FirebaseRoadmapData | null>(null)
    const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null)
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
    const [scale, setScale] = useState(0.8)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [difficulty, setDifficulty] = useState("");
    const navigate = useNavigate();


    const containerRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLDivElement>(null)

    // Memoized calculations for better performance
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

    // Dynamically calculate canvas dimensions to ensure all nodes and connections are visible
    const canvasDimensions = useMemo(() => {
        if (!roadmapData?.nodes?.length) {
            // Default dimensions if no nodes
            return { width: 1200, height: 800 }
        }

        // Find the maximum absolute coordinate value among all nodes
        const maxAbsX = Math.max(...roadmapData.nodes.map((n) => Math.abs(n.position.x)))
        const maxAbsY = Math.max(...roadmapData.nodes.map((n) => Math.abs(n.position.y)))

        // Calculate the required content size based on max extent + node dimensions + padding
        const contentExtentX = maxAbsX * SPACING_MULTIPLIER + NODE_HALF_WIDTH
        const contentExtentY = maxAbsY * SPACING_MULTIPLIER + NODE_HALF_HEIGHT

        // Add a generous buffer for connections and overall view
        const BUFFER_PADDING = 300 // Padding on each side

        const calculatedWidth = contentExtentX * 2 + 2 * BUFFER_PADDING
        const calculatedHeight = contentExtentY * 2 + 2 * BUFFER_PADDING

        // Ensure minimum size
        const finalWidth = Math.max(1200, calculatedWidth)
        const finalHeight = Math.max(800, calculatedHeight)

        return {
            width: finalWidth,
            height: finalHeight,
        }
    }, [roadmapData?.nodes])

    useEffect(() => {
        const fetchRoadmap = async () => {
            try {
                setLoading(true)
                const docRef = doc(db, "roadmaps", id!)
                const docSnap = await getDoc(docRef)

                if (docSnap.exists()) {
                    const data = docSnap.data() as FirebaseRoadmapData
                    // Ensure visibility defaults to 'public' if not present in data
                    setRoadmapData({ ...data, visibility: data.visibility || "public" })
                    setDifficulty(data.difficulty);
                    console.log("Roadmap loaded:", data)
                } else {
                    setError("Roadmap not found.")
                }
            } catch (err) {
                setError("Failed to load roadmap.")
                console.error("Error:", err)
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            fetchRoadmap()
        }
    }, [id])

    // Optimized wheel handler
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

    // Pan functionality with better performance
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

    // Touch events for mobile
    const handleTouchStart = useCallback(
        (e: React.TouchEvent) => {
            if (e.touches.length === 1) {
                const touch = e.touches[0]
                setIsDragging(true)
                setDragStart({ x: touch.clientX - panOffset.x, y: touch.clientY - panOffset.y })
            }
        },
        [panOffset],
    )

    const handleTouchMove = useCallback(
        (e: React.TouchEvent) => {
            if (isDragging && e.touches.length === 1) {
                const touch = e.touches[0]
                setPanOffset({
                    x: touch.clientX - dragStart.x,
                    y: touch.clientY - dragStart.y,
                })
            }
        },
        [isDragging, dragStart],
    )

    const handleTouchEnd = useCallback(() => {
        setIsDragging(false)
    }, [])

    // Control functions
    const resetView = useCallback(() => {
        setPanOffset({ x: 0, y: 0 })
        setScale(0.8)
        setSelectedNode(null)
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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-indigo-600" />
                    <p className="text-gray-600">Loading your roadmap...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="text-center max-w-md mx-auto p-8">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Info className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Roadmap Not Found</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <Button onClick={() => window.history.back()} variant="outline" className="mr-2">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Go Back
                    </Button>
                </div>
            </div>
        )
    }

    if (!roadmapData) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <p className="text-gray-600">No roadmap data available.</p>
            </div>
        )
    }

    return (
        <TooltipProvider>
            <div className={`${isFullscreen ? "fixed inset-0 z-50" : "h-screen"} w-full flex flex-col bg-gray-50`}>
                {/* Enhanced Header */}
                <div className="bg-white border-b shadow-sm flex-shrink-0 mt-18">
                    <div className="p-4">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-2xl font-bold text-gray-900">{roadmapData.title}</h1>
                                    <Badge variant="secondary" className="text-xs">
                                        {roadmapData.nodes?.length || 0} steps
                                    </Badge>
                                </div>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <Workflow className="w-4 h-4" />
                                        <span>{roadmapData.nodes.length || 0} Nodes</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Cable className="w-4 h-4" />
                                        <span>{roadmapData.edges?.length || 0} connections</span>
                                    </div>
                                    <DifficultyBadge difficulty={difficulty || "Medium"} />
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="flex flex-wrap justify-end items-center gap-2 mt-4 md:mt-0">
                                <div className="hidden md:flex items-center gap-1 text-xs text-gray-500 mr-4">
                                    <Move className="w-3 h-3" />
                                    <span>Drag to pan • Scroll to zoom • Click nodes for details</span>
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
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Canvas */}
                    <div
                        ref={containerRef}
                        className="flex-1 relative bg-gradient-to-br from-gray-50 to-gray-100 select-none overflow-hidden"
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
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
                                    transform: "translate(-50%, -50%)", // Center the SVG within its parent
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
                                    <filter id="glow">
                                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                        <feMerge>
                                            <feMergeNode in="coloredBlur" />
                                            <feMergeNode in="SourceGraphic" />
                                        </feMerge>
                                    </filter>
                                </defs>

                                {roadmapData.edges?.map((edge) => {
                                    const fromNode = nodeMap.get(edge.source)
                                    const toNode = nodeMap.get(edge.target)
                                    if (!fromNode || !toNode) return null

                                    // Calculate SVG coordinates relative to the center of the dynamically sized canvas
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

                            {/* Nodes */}
                            {roadmapData.nodes?.map((node) => {
                                const config = nodeConfig[node.type] || defaultNodeConfig
                                const Icon = config.icon
                                const isSelected = selectedNode?.id === node.id
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
                                            // Position nodes relative to the center of the canvas
                                            left: `calc(50% + ${node.position.x * SPACING_MULTIPLIER}px)`,
                                            top: `calc(50% + ${node.position.y * SPACING_MULTIPLIER}px)`,
                                        }}
                                    >
                                        <Card
                                            className={`w-56 p-4 transition-all duration-200 cursor-pointer ${isSelected
                                                ? `${config.bgColor} ${config.borderColor} border-2 shadow-lg scale-105 ring-2 ring-blue-300`
                                                : isConnected
                                                    ? `${config.bgColor} ${config.borderColor} border-2 shadow-md scale-102`
                                                    : `bg-white border-gray-200 border hover:${config.bgColor} hover:${config.borderColor} hover:border-2 shadow-sm hover:shadow-md hover:scale-102`
                                                }`}
                                            onClick={() => handleNodeClick(node)}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`p-2.5 rounded-lg ${config.color} text-white shadow-sm flex-shrink-0`}>
                                                    <Icon size={16} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3
                                                        className={`font-semibold text-sm mb-2 leading-tight ${isSelected || isConnected ? config.textColor : "text-gray-900"
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

                    {/* Side Panel for Selected Node */}
                    {selectedNode && (
                        <div className="w-full md:w-80 bg-white border-l shadow-lg flex-shrink-0 overflow-y-auto absolute bottom-0 left-0 right-0 md:relative md:bottom-auto md:left-auto md:right-auto h-1/2 md:h-auto z-20">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Node Details</h3>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSelectedNode(null)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <X />
                                    </Button>
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
                                                <Badge variant="secondary" className="text-xs mt-1">
                                                    {selectedNode.type}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h5 className="font-medium text-gray-900 mb-2">Description</h5>
                                        <p className="text-sm text-gray-600 leading-relaxed">{selectedNode.data.description}</p>
                                    </div>

                                    <div>
                                        <h5 className="font-medium text-gray-900 mb-2">Type Information</h5>
                                        <p className="text-sm text-gray-600">
                                            {(nodeConfig[selectedNode.type] || defaultNodeConfig).description}
                                        </p>
                                    </div>

                                    <div className="my-3">
                                        <Button
                                            className="bg-indigo-500 hover:bg-indigo-600 text-white w-full cursor-pointer"
                                            onClick={() => {
                                                // Navigate to course generation page with node data
                                                navigate(`/user/course-generator`, {
                                                    state: {
                                                        nodeData: selectedNode,
                                                        roadmapTitle: roadmapData.title,
                                                        roadmapId: id,
                                                    },
                                                })
                                            }}
                                        >
                                            <Sparkles className="w-4 h-4 mr-2" />
                                            Generate Course
                                        </Button>
                                    </div>

                                    <div className="pt-4 border-t">
                                        <div className="text-xs text-gray-500">Node ID: #{selectedNode.id}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Enhanced Legend */}
                <div className="bg-white border-t flex-shrink-0">
                    <div className="p-4">
                        <div className="flex flex-wrap gap-4 justify-center">
                            {Object.entries(nodeConfig).map(([type, config]) => {
                                const Icon = config.icon
                                const count = nodeStats[type] || 0

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
                                                    <span className="text-xs text-gray-500 ml-1">({count})</span>
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
