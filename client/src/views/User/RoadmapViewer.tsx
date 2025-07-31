"use client"

import type React from "react"

import { useParams } from "react-router-dom"
import { useEffect, useState, useRef, useCallback } from "react"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, BookOpen, Target, FolderOpen, CheckCircle, Loader2, Move, Puzzle, BrainCircuit, Tag, Footprints } from "lucide-react"

// Type definitions
interface NodeData {
    label: string
    description: string
}

interface RoadmapNode {
    id: number
    data: NodeData
    type: "start" | "course" | "milestone" | "project" | "concept" | "topic" | "step" | "end"
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
}

const nodeConfig = {
    start: {
        icon: Play,
        color: "bg-emerald-500",
        textColor: "text-emerald-700",
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-300",
    },
    course: {
        icon: BookOpen,
        color: "bg-blue-500",
        textColor: "text-blue-700",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-300",
    },
    milestone: {
        icon: Target,
        color: "bg-purple-500",
        textColor: "text-purple-700",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-300",
    },
    project: {
        icon: FolderOpen,
        color: "bg-amber-500",
        textColor: "text-amber-700",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-300",
    },
    concept: {
        icon: BrainCircuit, // Represents understanding, core principles, theory
        color: "bg-violet-500",
        textColor: "text-violet-700",
        bgColor: "bg-violet-50",
        borderColor: "border-violet-300",
    },
    topic: {
        icon: Tag, // Represents a labeled area or category
        color: "bg-cyan-500",
        textColor: "text-cyan-700",
        bgColor: "bg-cyan-50",
        borderColor: "border-cyan-300",
    },
    step: {
        icon: Footprints, // Represents a labeled area or category
        color: "bg-teal-500",
        textColor: "text-teal-700",
        bgColor: "bg-teal-50",
        borderColor: "border-teal-300",
    },
    end: {
        icon: CheckCircle,
        color: "bg-rose-500",
        textColor: "text-rose-700",
        bgColor: "bg-rose-50",
        borderColor: "border-rose-300",
    },
}

const defaultNodeConfig = {
    icon: Puzzle, // Represents a "misc", "unknown", or "to-be-solved" piece
    color: "bg-indigo-500",
    textColor: "text-indigo-700",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-300",
}

export default function RoadmapViewer() {
    const { id } = useParams()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [roadmapData, setRoadmapData] = useState<FirebaseRoadmapData | null>(null)
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
    const [scale, setScale] = useState(1)

    const containerRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const fetchRoadmap = async () => {
            try {
                const docRef = doc(db, "roadmaps", id!)
                const docSnap = await getDoc(docRef)

                if (docSnap.exists()) {
                    const data = docSnap.data() as FirebaseRoadmapData
                    setRoadmapData(data)
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

    // Add passive event listener fix
    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault()
            e.stopPropagation()
            const delta = e.deltaY > 0 ? -0.1 : 0.1
            setScale((prev) => Math.max(0.3, Math.min(2, prev + delta)))
        }

        const handleTouchMove = (e: TouchEvent) => {
            e.preventDefault()
            e.stopPropagation()
        }

        // Add event listeners with passive: false to allow preventDefault
        container.addEventListener("wheel", handleWheel, { passive: false })
        container.addEventListener("touchmove", handleTouchMove, { passive: false })

        return () => {
            container.removeEventListener("wheel", handleWheel)
            container.removeEventListener("touchmove", handleTouchMove)
        }
    }, [])

    // Pan functionality
    const handleMouseDown = useCallback(
        (e: React.MouseEvent) => {
            if (e.button === 0) {
                setIsDragging(true)
                setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y })
                e.preventDefault()
                e.stopPropagation()
            }
        },
        [panOffset],
    )

    const handleMouseMove = useCallback(
        (e: React.MouseEvent) => {
            if (isDragging) {
                e.preventDefault()
                e.stopPropagation()
                setPanOffset({
                    x: e.clientX - dragStart.x,
                    y: e.clientY - dragStart.y,
                })
            }
        },
        [isDragging, dragStart],
    )

    const handleMouseUp = useCallback((e: React.MouseEvent) => {
        setIsDragging(false)
        e.preventDefault()
        e.stopPropagation()
    }, [])

    // Touch events for mobile
    const handleTouchStart = useCallback(
        (e: React.TouchEvent) => {
            if (e.touches.length === 1) {
                const touch = e.touches[0]
                setIsDragging(true)
                setDragStart({ x: touch.clientX - panOffset.x, y: touch.clientY - panOffset.y })
                e.preventDefault()
                e.stopPropagation()
            }
        },
        [panOffset],
    )

    const handleTouchMove = useCallback(
        (e: React.TouchEvent) => {
            if (isDragging && e.touches.length === 1) {
                const touch = e.touches[0]
                e.preventDefault()
                e.stopPropagation()
                setPanOffset({
                    x: touch.clientX - dragStart.x,
                    y: touch.clientY - dragStart.y,
                })
            }
        },
        [isDragging, dragStart],
    )

    const handleTouchEnd = useCallback((e: React.TouchEvent) => {
        setIsDragging(false)
        e.preventDefault()
        e.stopPropagation()
    }, [])

    const resetView = () => {
        setPanOffset({ x: 0, y: 0 })
        setScale(1)
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin mr-2" />
                <span>Loading roadmap...</span>
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center mt-20">
                <div className="text-red-500 font-medium text-xl mb-4">{error}</div>
                <Button onClick={() => window.history.back()} variant="outline">
                    Go Back
                </Button>
            </div>
        )
    }

    if (!roadmapData) {
        return <div className="text-center mt-20">No roadmap data found.</div>
    }

    const nodeMap = new Map(roadmapData.nodes.map((node) => [node.id, node]))

    // Calculate spacing multiplier to spread out nodes
    const spacingMultiplier = 1.6
    const offsetX = 200
    const offsetY = 150

    // Calculate canvas dimensions based on node positions
    const canvasWidth = 2400
    const canvasHeight = 1800

    return (
        <div className="h-screen w-full flex flex-col bg-gray-50">
            {/* Header */}
            <div className="p-4 mt-18 bg-white border-b shadow-sm flex-shrink-0">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">{roadmapData.title}</h1>
                        <p className="text-sm text-gray-600">
                            {roadmapData.nodes?.length || 0} nodes • {roadmapData.edges?.length || 0} connections
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Move className="w-3 h-3" />
                            Drag to pan • Scroll to zoom
                        </div>
                        <Button onClick={resetView} variant="outline" size="sm">
                            Reset View
                        </Button>
                    </div>
                </div>
            </div>

            {/* Canvas - Fixed height to avoid Lenis conflicts */}
            <div
                ref={containerRef}
                className="flex-1 relative bg-gray-100 select-none"
                style={{
                    height: "calc(100vh - 140px)",
                    overflow: "hidden",
                    touchAction: "none", // Prevent default touch behaviors
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <div
                    ref={canvasRef}
                    className={`relative w-full h-full ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
                    style={{
                        transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${scale})`,
                        transformOrigin: "center center",
                        transition: isDragging ? "none" : "transform 0.2s ease-out",
                        backgroundImage: `radial-gradient(circle, rgba(148, 163, 184, 0.3) 1px, transparent 1px)`,
                        backgroundSize: `${30 * scale}px ${30 * scale}px`,
                        backgroundPosition: `${panOffset.x}px ${panOffset.y}px`,
                    }}
                >
                    {/* SVG for connections - Fixed positioning and sizing */}
                    <svg
                        className="absolute pointer-events-none"
                        style={{
                            width: `${canvasWidth}px`,
                            height: `${canvasHeight}px`,
                            left: "50%",
                            top: "50%",
                            transform: "translate(-50%, -50%)",
                        }}
                        viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
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

                            // Calculate positions within the SVG coordinate system
                            const startX = fromNode.position.x * spacingMultiplier + offsetX + canvasWidth / 2
                            const startY = fromNode.position.y * spacingMultiplier + offsetY + canvasHeight / 2
                            const endX = toNode.position.x * spacingMultiplier + offsetX + canvasWidth / 2
                            const endY = toNode.position.y * spacingMultiplier + offsetY + canvasHeight / 2

                            return (
                                <line
                                    key={edge.id}
                                    x1={startX}
                                    y1={startY}
                                    x2={endX}
                                    y2={endY}
                                    stroke="#64748b"
                                    strokeWidth="2"
                                    markerEnd="url(#arrowhead)"
                                    className="hover:stroke-blue-500 transition-colors duration-200"
                                />
                            )
                        })}
                    </svg>

                    {/* Nodes */}
                    {roadmapData.nodes?.map((node) => {
                        const config = nodeConfig[node.type] || defaultNodeConfig
                        const Icon = config.icon

                        return (
                            <div
                                key={node.id}
                                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-auto"
                                style={{
                                    left: `calc(50% + ${node.position.x * spacingMultiplier + offsetX}px)`,
                                    top: `calc(50% + ${node.position.y * spacingMultiplier + offsetY}px)`,
                                }}
                            >
                                <Card
                                    className={`w-48 p-3 ${config.bgColor} ${config.borderColor} border-2 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2 rounded-full ${config.color} text-white shadow-sm flex-shrink-0`}>
                                            <Icon size={14} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className={`font-semibold text-sm ${config.textColor} mb-1 leading-tight`}>
                                                {node.data.label}
                                            </h3>
                                            <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{node.data.description}</p>
                                        </div>
                                    </div>
                                    <div className="mt-2 flex justify-between items-center">
                                        <Badge variant="secondary" className={`text-xs ${config.textColor} ${config.bgColor} px-2 py-0.5`}>
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

            {/* Legend */}
            <div className="p-4 bg-white border-t flex-shrink-0">
                <div className="flex flex-wrap gap-4 justify-center">
                    {Object.entries(nodeConfig).map(([type, config]) => {
                        const Icon = config.icon
                        const count = roadmapData.nodes?.filter((n) => n.type === type).length || 0
                        return (
                            <div key={type} className="flex items-center gap-2">
                                <div className={`p-1.5 rounded-full ${config.color} text-white`}>
                                    <Icon size={12} />
                                </div>
                                <div>
                                    <span className="text-sm font-medium capitalize text-gray-700">{type}</span>
                                    <span className="text-xs text-gray-500 ml-1">({count})</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
