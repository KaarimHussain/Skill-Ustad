"use client"

import type React from "react"

import { useState, useCallback, useMemo, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input, RoadmapInput } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    DoorClosed as ToolCase,
    Plus,
    Link,
    Type,
    Download,
    ZoomIn,
    ZoomOut,
    RotateCcw,
    X,
    Trash2,
    Tag,
    Footprints,
    Sparkles,
    BrainCircuit,
    FolderOpen,
    BookOpen,
    Target,
    CheckCircle,
    Play,
    Upload,
    Copy,
} from "lucide-react"
import AuthService from "@/services/auth.service"
import { useLocation, useNavigate } from "react-router-dom"
import { Switch } from "@/components/ui/switch"
import RoadmapService from "@/services/roadmap.service"
import NotificationService from "@/components/Notification"

// Types
interface RoadmapNode {
    id: string
    type: keyof typeof nodeConfig
    position: { x: number; y: number }
    data: {
        label: string
        description: string
    }
}

interface RoadmapEdge {
    id: string
    source: string
    target: string
}

export interface RoadmapData {
    id?: string
    title: string
    nodes: RoadmapNode[]
    edges: RoadmapEdge[]
    difficulty: string
    userId: string
    visibility: string
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

const defaultNodeConfig = nodeConfig.milestone

// Constants
const SPACING_MULTIPLIER = 1.5
const NODE_HALF_WIDTH = 112
const NODE_HALF_HEIGHT = 60

export default function CreateRoadmap() {
    const location = useLocation()
    const state = location.state as { roadmapData: RoadmapData }
    // State management
    const [roadmapData, setRoadmapData] = useState<RoadmapData>(
        state?.roadmapData || {
            title: "My Learning Roadmap",
            nodes: [],
            edges: [],
            difficulty: "Easy",
            userId: "",
            visibility: "public",
        },
    )

    const [roadmapId, setRoadmapId] = useState<string | null>(null)
    const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null)
    const [highlightedNode, setHighlightedNode] = useState<string | null>(null)
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
    const [scale, setScale] = useState(0.8)
    const [isConnecting, setIsConnecting] = useState(false)
    const [connectionStart, setConnectionStart] = useState<string | null>(null)
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const [isDraggingNode, setIsDraggingNode] = useState(false)
    const [draggedNode, setDraggedNode] = useState<string | null>(null)
    const [hoveredNode, setHoveredNode] = useState<string | null>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [editingNode, setEditingNode] = useState<RoadmapNode | null>(null)
    const [isSaving, setIsSaving] = useState(false)

    const [isDataSheetOpen, setIsDataSheetOpen] = useState(false)
    const [jsonText, setJsonText] = useState("")
    const [jsonError, setJsonError] = useState<string | null>(null)

    // Sanitize a string to remove control chars and limit length
    const sanitizeString = (s: unknown, max = 500): string => {
        if (typeof s !== "string") return ""
        // remove control chars, trim, clamp length
        return s
            .replace(/[\u0000-\u001F\u007F]/g, "")
            .trim()
            .slice(0, max)
    }

    // Ensure a finite number and clamp to a reasonable range to avoid extreme positions
    const clampNumber = (n: unknown, min = -5000, max = 5000): number => {
        const num = typeof n === "number" && Number.isFinite(n) ? n : 0
        return Math.min(max, Math.max(min, num))
    }

    const generateNodeId = () => `node-${Date.now()}-${Math.floor(Math.random() * 100000)}`
    const generateEdgeId = () => `edge-${Date.now()}-${Math.floor(Math.random() * 100000)}`

    const sanitizeNode = (raw: any): RoadmapNode | null => {
        if (!raw || typeof raw !== "object") return null
        const allowedTypes = Object.keys(nodeConfig) as Array<keyof typeof nodeConfig>
        const type = allowedTypes.includes(raw.type) ? (raw.type as keyof typeof nodeConfig) : "milestone"
        const id = typeof raw.id === "string" && raw.id.length > 0 ? sanitizeString(raw.id, 64) : generateNodeId()
        const position = {
            x: clampNumber(raw?.position?.x),
            y: clampNumber(raw?.position?.y),
        }
        const data = {
            label: sanitizeString(raw?.data?.label, 120),
            description: sanitizeString(raw?.data?.description, 1000),
        }
        return { id, type, position, data }
    }

    const validateAndNormalizeRoadmap = (raw: any): RoadmapData => {
        // Base defaults
        let title = sanitizeString(raw?.title ?? roadmapData.title, 120)
        if (!title) title = "My Learning Roadmap"

        const difficultyOptions = ["Easy", "Medium", "Hard"] as const
        const difficulty = difficultyOptions.includes(raw?.difficulty) ? raw.difficulty : roadmapData.difficulty || "Easy"

        const vis =
            raw?.visibility === "private" || raw?.visibility === "public"
                ? raw.visibility
                : roadmapData.visibility || "public"

        // Nodes
        const MAX_NODES = 200
        const nodesInput: any[] = Array.isArray(raw?.nodes) ? raw.nodes.slice(0, MAX_NODES) : []
        const nodesSanitized = nodesInput.map(sanitizeNode).filter(Boolean) as RoadmapNode[]

        // Ensure unique node IDs
        const seenNodeIds = new Set<string>()
        const nodes: RoadmapNode[] = nodesSanitized.map((n) => {
            let nid = n.id
            if (seenNodeIds.has(nid)) {
                nid = generateNodeId()
            }
            seenNodeIds.add(nid)
            return { ...n, id: nid }
        })

        const nodeIdSet = new Set(nodes.map((n) => n.id))

        // Edges
        const MAX_EDGES = 1000
        const edgesInput: any[] = Array.isArray(raw?.edges) ? raw.edges.slice(0, MAX_EDGES) : []
        const dedupeKey = (s: string, t: string) => `${s}→${t}`
        const seenEdges = new Set<string>()
        const edges: RoadmapEdge[] = []

        for (const e of edgesInput) {
            const source = typeof e?.source === "string" ? sanitizeString(e.source, 64) : ""
            const target = typeof e?.target === "string" ? sanitizeString(e.target, 64) : ""
            if (!source || !target) continue
            if (source === target) continue // no self-loop
            if (!nodeIdSet.has(source) || !nodeIdSet.has(target)) continue // must reference valid nodes
            const key = dedupeKey(source, target)
            if (seenEdges.has(key)) continue
            seenEdges.add(key)
            const id = typeof e?.id === "string" && e.id ? sanitizeString(e.id, 64) : generateEdgeId()
            edges.push({ id, source, target })
        }

        // Preserve current id and authenticated userId; do NOT allow override from JSON
        const currentId = roadmapData.id
        const currentUserId = AuthService.getAuthenticatedUserId() || roadmapData.userId || ""

        return {
            id: currentId,
            title,
            nodes,
            edges,
            difficulty,
            userId: currentUserId,
            visibility: vis,
        }
    }

    const exportRoadmapJson = () => {
        // Exclude userId for safer sharing
        const { userId: _omitUserId, ...rest } = roadmapData
        const dataStr = JSON.stringify(rest, null, 2)
        const dataBlob = new Blob([dataStr], { type: "application/json" })
        const url = URL.createObjectURL(dataBlob)
        const link = document.createElement("a")
        link.href = url
        link.download = `${roadmapData.title.replace(/\s+/g, "_")}_roadmap.json`
        link.click()
        URL.revokeObjectURL(url)
    }

    const applyRoadmapJson = () => {
        setJsonError(null)
        try {
            const maxChars = 200_000 // ~200KB limit for safety
            if (jsonText.length > maxChars) {
                setJsonError("JSON too large. Please reduce the dataset size and try again.")
                return
            }
            const parsed = JSON.parse(jsonText)
            const normalized = validateAndNormalizeRoadmap(parsed)
            setRoadmapData(normalized)
            setIsDataSheetOpen(false)
        } catch {
            setJsonError("Invalid JSON. Please check the format and try again.")
        }
    }

    const buildAIPrompt = (data: RoadmapData) => {

        if (roadmapData.title == null) {
            NotificationService.info("Roadmap Title Required", "Kindly provide the roadmap title to get the information of the roadmap that you want to generate")
            return "";
        }

        const allowedTypes = Object.keys(nodeConfig).join(", ")
        const difficultyOptions = ["Easy", "Medium", "Hard"].join(", ")

        const example = {
            title: roadmapData.title,
            difficulty: "Medium",
            visibility: "public",
            nodes: [
                {
                    id: "node-1",
                    type: "start",
                    position: { x: 0, y: 0 },
                    data: { label: "Kickoff", description: "Starting point of the journey" },
                },
                {
                    id: "node-2",
                    type: "milestone",
                    position: { x: 200, y: 0 },
                    data: { label: "Core Concepts", description: "Learn fundamental ideas" },
                },
                {
                    id: "node-3",
                    type: "end",
                    position: { x: 400, y: 0 },
                    data: { label: "Finish", description: "End goal achieved" },
                },
            ],
            edges: [
                { id: "edge-1", source: "node-1", target: "node-2" },
                { id: "edge-2", source: "node-2", target: "node-3" },
            ],
        }

        return [
            "You are generating a JSON dataset for a learning roadmap.",
            "Output JSON ONLY with no markdown code fences.",
            "Schema:",
            `- title: string (<=120 chars)`,
            `- difficulty: one of [${difficultyOptions}]`,
            `- visibility: "public" | "private"`,
            `- nodes: array of { id: string, type: one of [${allowedTypes}], position: { x: number, y: number }, data: { label: string (<=120 chars), description: string (<=1000 chars) } }`,
            `- edges: array of { id: string, source: string (node id), target: string (node id) }`,
            "",
            "Rules for high-quality data:",
            "- Provide 8 to 20 nodes with meaningful, concise labels and helpful descriptions.",
            "- Use allowed types only; ensure there's a logical flow from a 'start' to an 'end' node if applicable.",
            '- For node positions, set the starting node position.x to 0, and for each subsequent node increment position.x by 200 to evenly space nodes. position.y can be any small value (e.g., 0 to 10) for layout clarity.',
            "- Edges must reference existing node ids, no duplicates, and no self-loops.",
            "- Ensure a sensible, mostly acyclic structure suitable for a learning path.",
            "- Do not include userId. Do not include any fields beyond the schema.",
            "",
            "Use this title and difficulty as inspiration (you may adjust to fit your dataset):",
            `- title: "${data.title || "My Learning Roadmap"}"`,
            `- difficulty: "${data.difficulty || "Easy"}"`,
            "",
            "Return a single JSON object. Example structure:",
            JSON.stringify(example, null, 2),
        ].join("\n")
    }

    const copyAIPrompt = async () => {
        const prompt = buildAIPrompt(roadmapData)
        try {
            await navigator.clipboard.writeText(prompt)
            NotificationService.success("Successfully Copied Prompt for AI Data Generation")
            setIsCopiedPrompt(true)
        } catch {
            // Fallback for older browsers
            const ta = document.createElement("textarea")
            ta.value = prompt
            ta.style.position = "fixed"
            ta.style.opacity = "0"
            document.body.appendChild(ta)
            ta.select()
            try {
                document.execCommand("copy")
                NotificationService.success("Successfully Copied Prompt for AI Data Generation")
                setIsCopiedPrompt(true)
            } catch {
                NotificationService.error("Unable to copy prompt. Please select and copy manually.")
            } finally {
                document.body.removeChild(ta)

                setTimeout(() => {
                    setIsCopiedPrompt(false)
                }, 1500)
            }
        } finally {
            setTimeout(() => {
                setIsCopiedPrompt(false)
            }, 1500)
        }
    }

    // Copy Prompt State
    const [isCopiedPrompt, setIsCopiedPrompt] = useState(false);

    // Edge Connection
    const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null)
    const [isEdgeSelected, setIsEdgeSelected] = useState<boolean>(false)

    const navigate = useNavigate()

    // Form states for node creation/editing
    const [nodeForm, setNodeForm] = useState({
        label: "",
        description: "",
        type: "milestone" as keyof typeof nodeConfig,
    })

    const containerRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLDivElement>(null)
    const [, setNodeDragStart] = useState({ x: 0, y: 0 })

    // Memoized calculations
    const nodeMap = useMemo(() => {
        return new Map(roadmapData.nodes.map((node) => [node.id, node]))
    }, [roadmapData.nodes])

    const canvasDimensions = useMemo(() => {
        if (!roadmapData.nodes.length) {
            return { width: 1200, height: 800 }
        }

        const maxAbsX = Math.max(...roadmapData.nodes.map((n) => Math.abs(n.position.x)))
        const maxAbsY = Math.max(...roadmapData.nodes.map((n) => Math.abs(n.position.y)))

        const contentExtentX = maxAbsX * SPACING_MULTIPLIER + NODE_HALF_WIDTH
        const contentExtentY = maxAbsY * SPACING_MULTIPLIER + NODE_HALF_HEIGHT

        const BUFFER_PADDING = 300

        const calculatedWidth = contentExtentX * 2 + 2 * BUFFER_PADDING
        const calculatedHeight = contentExtentY * 2 + 2 * BUFFER_PADDING

        return {
            width: Math.max(calculatedWidth, 1200),
            height: Math.max(calculatedHeight, 800),
        }
    }, [roadmapData.nodes])

    // Event handlers for pan and zoom
    const handleMouseDown = useCallback(
        (e: React.MouseEvent) => {
            if (e.target === containerRef.current || e.target === canvasRef.current) {
                setIsDragging(true)
                setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y })
            }
        },
        [panOffset],
    )

    const handleMouseMove = useCallback(
        (e: React.MouseEvent) => {
            if (isDragging) {
                setPanOffset({
                    x: e.clientX - dragStart.x,
                    y: e.clientY - dragStart.y,
                })
            }
            if (isDraggingNode && draggedNode) {
                const rect = containerRef.current?.getBoundingClientRect()
                if (rect) {
                    const x = (e.clientX - rect.left - rect.width / 2 - panOffset.x) / scale / SPACING_MULTIPLIER
                    const y = (e.clientY - rect.top - rect.height / 2 - panOffset.y) / scale / SPACING_MULTIPLIER

                    setRoadmapData((prev) => ({
                        ...prev,
                        nodes: prev.nodes.map((node) => (node.id === draggedNode ? { ...node, position: { x, y } } : node)),
                    }))
                }
            }
        },
        [isDragging, dragStart, isDraggingNode, draggedNode, panOffset, scale],
    )

    const handleMouseUp = useCallback(() => {
        setIsDragging(false)
        setIsDraggingNode(false)
        setDraggedNode(null)
    }, [])

    const handleWheel = useCallback((e: React.WheelEvent) => {
        e.preventDefault()
        const delta = e.deltaY > 0 ? -0.1 : 0.1
        setScale((prev) => Math.max(0.2, Math.min(2, prev + delta)))
    }, [])

    const handleNodeMouseDown = useCallback(
        (e: React.MouseEvent, nodeId: string) => {
            e.stopPropagation()
            if (!isConnecting) {
                setIsDraggingNode(true)
                setDraggedNode(nodeId)
                const rect = containerRef.current?.getBoundingClientRect()
                if (rect) {
                    setNodeDragStart({
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top,
                    })
                }
            }
        },
        [isConnecting],
    )

    const handleCanvasClick = useCallback(
        (e: React.MouseEvent) => {
            // Only deselect if clicking directly on canvas (not on nodes or other elements)
            if (e.target === containerRef.current || e.target === canvasRef.current) {
                setHighlightedNode(null)
                setSelectedNode(null)
                setSelectedEdgeId(null)
                // Also cancel connection mode if active
                if (isConnecting) {
                    setIsConnecting(false)
                    setConnectionStart(null)
                }
            }
        },
        [isConnecting],
    )
    // Node operations
    const addNode = useCallback(() => {
        if (!nodeForm.label.trim()) return

        const newNode: RoadmapNode = {
            id: `node-${Date.now()}`,
            type: nodeForm.type,
            position: {
                x: Math.random() * 200 - 100,
                y: Math.random() * 200 - 100,
            },
            data: {
                label: nodeForm.label,
                description: nodeForm.description,
            },
        }

        setRoadmapData((prev) => ({
            ...prev,
            nodes: [...prev.nodes, newNode],
        }))

        setNodeForm({ label: "", description: "", type: "milestone" })
    }, [nodeForm])

    const updateNode = useCallback((nodeId: string, updates: Partial<RoadmapNode>) => {
        setRoadmapData((prev) => ({
            ...prev,
            nodes: prev.nodes.map((node) => (node.id === nodeId ? { ...node, ...updates } : node)),
        }))
    }, [])

    const deleteNode = useCallback((nodeId: string) => {
        setRoadmapData((prev) => ({
            ...prev,
            nodes: prev.nodes.filter((node) => node.id !== nodeId),
            edges: prev.edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
        }))
        setSelectedNode(null)
        setEditingNode(null)
        setIsEditModalOpen(false)
    }, [])

    // Connection operations
    const startConnection = useCallback((nodeId: string) => {
        setIsConnecting(true)
        setConnectionStart(nodeId)
    }, [])

    const completeConnection = useCallback(
        (targetNodeId: string) => {
            if (connectionStart && connectionStart !== targetNodeId) {
                const newEdge: RoadmapEdge = {
                    id: `edge-${Date.now()}`,
                    source: connectionStart,
                    target: targetNodeId,
                }

                setRoadmapData((prev) => ({
                    ...prev,
                    edges: [...prev.edges, newEdge],
                }))
            }

            setIsConnecting(false)
            setConnectionStart(null)
        },
        [connectionStart],
    )

    const handleNodeClick = useCallback(
        (node: RoadmapNode) => {
            if (isConnecting) {
                completeConnection(node.id)
            } else if (!isDraggingNode) {
                // Two-stage selection: first click highlights, second click opens edit modal
                if (highlightedNode === node.id) {
                    // Second click on same node - open edit modal
                    setEditingNode(node)
                    setNodeForm({
                        label: node.data.label,
                        description: node.data.description,
                        type: node.type,
                    })
                    setIsEditModalOpen(true)
                    setHighlightedNode(null) // Clear highlight after opening modal
                } else {
                    // First click - highlight the node
                    setHighlightedNode(node.id)
                    setSelectedNode(node)
                }
            }
        },
        [isConnecting, completeConnection, isDraggingNode, highlightedNode],
    )

    const handleNodeDoubleClick = useCallback(
        (node: RoadmapNode) => {
            if (!isConnecting) {
                startConnection(node.id)
                setIsSheetOpen(false)
            }
        },
        [isConnecting, startConnection],
    )

    // Canvas controls
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

    const setMentorId = () => {
        const mentorId = AuthService.getAuthenticatedUserId()
        if (!mentorId) {
            navigate("/login")
            return
        }
        setRoadmapData((prev) => ({
            ...prev,
            userId: mentorId,
        }))
    }

    const toggleVisibility = () => {
        const roadmapVisibility = roadmapData.visibility

        setRoadmapData((prev) => ({
            ...prev,
            visibility: roadmapVisibility == "public" ? "private" : "public",
        }))
    }

    const saveRoadmap = async () => {
        setIsSaving(true)
        try {
            const dataToSave = {
                ...roadmapData,
                id: roadmapId || roadmapData.id || undefined,
            }

            const id = await RoadmapService.saveRoadmap(dataToSave)

            if (!dataToSave.id) {
                setRoadmapId(id)
                setRoadmapData((prev) => ({ ...prev, id }))
            }

            console.log("Roadmap saved successfully:", id)
        } catch (err) {
            console.error("Error saving roadmap:", err)
        } finally {
            setIsSaving(false)
        }
    }

    const onRemoveConnection = () => {
        if (selectedEdgeId) {
            // Remove the edge from roadmapData.edges array
            setRoadmapData((prev) => ({
                ...prev,
                edges: prev.edges.filter((edge) => edge.id !== selectedEdgeId),
            }))
            setIsEdgeSelected(false)
            // Clear the selected edge and close modal
            setSelectedEdgeId(null)
        }
    }

    const onCancelRemoveConnection = () => {
        // Simply clear the selected edge to close the modal
        setIsEdgeSelected(false)
        setSelectedEdgeId(null)
    }

    const handleEdgeConnectionClick = (edgeId: string) => {
        setSelectedEdgeId(edgeId)
        setIsEdgeSelected(true)
    }

    // Call it inside useEffect
    useEffect(() => {
        setMentorId()
    }, [])

    return (
        <TooltipProvider>
            <main className="min-h-screen w-full relative overflow-hidden bg-gray-50">
                {/* Canvas Container */}
                <div
                    ref={containerRef}
                    className="w-full h-screen relative cursor-grab active:cursor-grabbing"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onWheel={handleWheel}
                    onClick={handleCanvasClick} // Added click handler for deselection
                >
                    <div
                        ref={canvasRef}
                        className="absolute inset-0"
                        style={{
                            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${scale})`,
                            transformOrigin: "center center",
                        }}
                    >
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
                                    markerWidth="30"
                                    markerHeight="15"
                                    refX="9"
                                    refY="3.5"
                                    orient="auto"
                                    markerUnits="strokeWidth"
                                >
                                    <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
                                </marker>
                            </defs>

                            {roadmapData.edges.map((edge) => {
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
                                    <Tooltip key={edge.id}>
                                        <TooltipTrigger asChild>
                                            <line
                                                // key={edge.id} // key removed from here as it's already on Tooltip
                                                x1={startX}
                                                y1={startY}
                                                x2={endX}
                                                y2={endY}
                                                stroke={isHighlighted ? "#3b82f6" : "#64748b"}
                                                strokeWidth={isHighlighted ? "5" : "4"}
                                                markerEnd="url(#arrowhead)"
                                                className="transition-all duration-200 cursor-pointer hover:stroke-red-500"
                                                style={{ pointerEvents: "stroke" }}
                                                onClick={() => handleEdgeConnectionClick(edge.id)}
                                            />
                                        </TooltipTrigger>
                                        <TooltipContent side="top" className="bg-red-600 text-white border-red-700">
                                            <div className="flex items-center gap-2">
                                                <Trash2 size={14} />
                                                <p>Click to delete connection</p>
                                            </div>
                                        </TooltipContent>
                                    </Tooltip>
                                )
                            })}
                        </svg>

                        {/* Nodes */}
                        {roadmapData.nodes.map((node) => {
                            const config = nodeConfig[node.type] || defaultNodeConfig
                            const Icon = config.icon
                            const isSelected = selectedNode?.id === node.id
                            const isHighlighted = highlightedNode === node.id
                            const isConnected =
                                selectedNode &&
                                roadmapData.edges.some(
                                    (edge) =>
                                        (edge.source === selectedNode.id && edge.target === node.id) ||
                                        (edge.target === selectedNode.id && edge.source === node.id),
                                )
                            const isHovered = hoveredNode === node.id

                            return (
                                <div
                                    key={node.id}
                                    className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-auto group"
                                    style={{
                                        left: `calc(50% + ${node.position.x * SPACING_MULTIPLIER}px)`,
                                        top: `calc(50% + ${node.position.y * SPACING_MULTIPLIER}px)`,
                                    }}
                                    onMouseEnter={() => setHoveredNode(node.id)}
                                    onMouseLeave={() => setHoveredNode(null)}
                                >
                                    {isHovered && (
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            className="absolute -top-2 -right-2 z-20 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                deleteNode(node.id)
                                            }}
                                        >
                                            <X size={12} />
                                        </Button>
                                    )}

                                    <Card
                                        className={`w-56 p-4 transition-all duration-200 cursor-pointer select-none ${isHighlighted
                                            ? `${config.bgColor} ${config.borderColor} border-2 shadow-lg scale-105 ring-2 ring-blue-400`
                                            : isSelected
                                                ? `${config.bgColor} ${config.borderColor} border-2 shadow-lg scale-105 ring-2 ring-blue-300`
                                                : isConnected
                                                    ? `${config.bgColor} ${config.borderColor} border-2 shadow-md scale-102`
                                                    : `bg-white border-gray-200 border hover:${config.bgColor} hover:${config.borderColor} hover:border-2 shadow-sm hover:shadow-md hover:scale-102`
                                            } ${isConnecting && connectionStart !== node.id ? "ring-2 ring-green-300" : ""}`}
                                        onClick={() => handleNodeClick(node)}
                                        onDoubleClick={() => handleNodeDoubleClick(node)}
                                        onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`p-2.5 rounded-lg ${config.color} text-white shadow-sm flex-shrink-0`}>
                                                <Icon size={16} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3
                                                    className={`font-semibold text-sm mb-2 leading-tight ${isHighlighted || isSelected || isConnected ? config.textColor : "text-gray-900"
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
                                                className={`text-xs px-2 py-1 ${isHighlighted || isSelected || isConnected
                                                    ? `${config.textColor} ${config.bgColor}`
                                                    : "text-gray-600 bg-gray-100"
                                                    }`}
                                            >
                                                {node.type}
                                            </Badge>
                                            <div className="text-xs text-gray-400">#{node.id.slice(-4)}</div>
                                        </div>
                                    </Card>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Roadmap Title and Controls - RESPONSIVE SECTION */}
                <div className={`fixed top-20 left-0 md:w-auto w-full z-21 px-2 sm:px-4 hidden md:block`}>
                    <Card className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg p-3 sm:p-6 mx-auto max-w-7xl">
                        <div className="space-y-3 sm:space-y-4">
                            {/* Title Section */}
                            <div>
                                <Label htmlFor="roadmapTitle" className="text-sm font-medium text-gray-700">
                                    Roadmap Title
                                </Label>
                                <RoadmapInput
                                    id="roadmapTitle"
                                    value={roadmapData.title}
                                    onChange={(e) => setRoadmapData((prev) => ({ ...prev, title: e.target.value }))}
                                    className="text-base sm:text-lg font-semibold bg-transparent border-gray-200 focus:border-blue-300 focus:ring-blue-200 px-3 py-2 max-w-2xl"
                                    placeholder="Enter your roadmap title..."
                                />
                            </div>

                            {/* Controls Row - Responsive Layout */}
                            <div className="flex flex-col gap-4">
                                {/* Mobile: Stack everything vertically, Desktop: Horizontal layout */}
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                    {/* Controls Section */}
                                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 flex-1">
                                        {/* Visibility Control */}
                                        <div className="flex items-center justify-between sm:justify-start gap-3 min-w-0">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <div className="p-1.5 bg-blue-50 rounded-md flex-shrink-0">
                                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                        />
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                        />
                                                    </svg>
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <Label htmlFor="roadmapVisibility" className="text-sm font-medium text-gray-700 truncate">
                                                        Visibility
                                                    </Label>
                                                    <span className="text-xs text-gray-500 capitalize truncate">{roadmapData.visibility}</span>
                                                </div>
                                            </div>
                                            <Switch
                                                id="roadmapVisibility"
                                                checked={roadmapData.visibility === "public"}
                                                onCheckedChange={toggleVisibility}
                                                className="data-[state=checked]:bg-blue-600 flex-shrink-0"
                                            />
                                        </div>

                                        {/* Difficulty Control */}
                                        <div className="flex items-center justify-between sm:justify-start gap-3 min-w-0">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <div className="p-1.5 bg-purple-50 rounded-md flex-shrink-0">
                                                    <svg
                                                        className="w-4 h-4 text-purple-600"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M13 10V3L4 14h7v7l9-11h-7z"
                                                        />
                                                    </svg>
                                                </div>
                                                <Label htmlFor="roadmapDifficulty" className="text-sm font-medium text-gray-700 truncate">
                                                    Difficulty
                                                </Label>
                                            </div>
                                            <Select
                                                value={roadmapData.difficulty}
                                                onValueChange={(value) =>
                                                    setRoadmapData((prev) => ({
                                                        ...prev,
                                                        difficulty: value as "Easy" | "Medium" | "Hard",
                                                    }))
                                                }
                                            >
                                                <SelectTrigger
                                                    id="roadmapDifficulty"
                                                    className="w-[100px] sm:w-[120px] h-9 border-gray-200 focus:border-purple-300 focus:ring-purple-200 flex-shrink-0"
                                                >
                                                    <SelectValue placeholder="Select" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Easy">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                            Easy
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="Medium">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                                            Medium
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="Hard">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                                            Hard
                                                        </div>
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Tools Sheet */}
                                        <div className="flex items-center justify-between sm:justify-start gap-3 min-w-0">
                                            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                                                <SheetTrigger asChild>
                                                    <Button className="bg-indigo-500 hover:bg-indigo-600 cursor-pointer flex items-center gap-2 px-4 h-9">
                                                        <div className="p-1 bg-white/20 rounded-sm">
                                                            <ToolCase className="w-4 h-4 text-white" />
                                                        </div>
                                                        <span>Tools</span>
                                                    </Button>
                                                </SheetTrigger>
                                            </Sheet>
                                        </div>

                                        <div className="flex items-center justify-between sm:justify-start gap-3 min-w-0">
                                            <Button onClick={() => {
                                                setIsDataSheetOpen(true)
                                                if (isDataSheetOpen) {
                                                    // Pre-fill with current roadmap (without userId)
                                                    const { userId: _omitUserId, ...rest } = roadmapData
                                                    setJsonText(JSON.stringify(rest, null, 2))
                                                    setJsonError(null)
                                                }
                                            }} className="bg-gray-800 hover:bg-gray-900 cursor-pointer flex items-center gap-2 px-4 h-9 text-white">
                                                <div className="p-1 bg-white/20 rounded-sm">
                                                    <Download className="w-4 h-4 text-white" />
                                                </div>
                                                <span>Data</span>
                                            </Button>
                                        </div>
                                    </div>
                                    {/* Canvas Controls and Save Button Row */}
                                    <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-3 xs:gap-4">
                                        {/* Canvas Controls */}
                                        <div className="flex gap-2 justify-center xs:justify-start">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={zoomIn}
                                                        className="h-9 w-9 p-0 flex-shrink-0 bg-transparent"
                                                    >
                                                        <ZoomIn size={16} />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent side="top">
                                                    <p>Zoom In</p>
                                                </TooltipContent>
                                            </Tooltip>

                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={zoomOut}
                                                        className="h-9 w-9 p-0 flex-shrink-0 bg-transparent"
                                                    >
                                                        <ZoomOut size={16} />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent side="top">
                                                    <p>Zoom Out</p>
                                                </TooltipContent>
                                            </Tooltip>

                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={resetView}
                                                        className="h-9 w-9 p-0 flex-shrink-0 bg-transparent"
                                                    >
                                                        <RotateCcw size={16} />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent side="top">
                                                    <p>Reset View</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                        {/* Save Button */}
                                        <Button
                                            onClick={saveRoadmap}
                                            disabled={isSaving}
                                            className="bg-indigo-500 hover:bg-indigo-600 cursor-pointer disabled:bg-indigo-300 w-full xs:w-auto px-6 h-9 flex-shrink-0"
                                        >
                                            {isSaving ? "Saving..." : "Save"}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Mobile Controls Button */}
                <div className="fixed top-20 left-4 z-21 md:hidden flex gap-2">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                size="sm"
                                className="bg-indigo-500 hover:bg-indigo-600 cursor-pointer flex items-center gap-2 px-3 h-9"
                            >
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                                    />
                                </svg>
                                <span>Controls</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="top" className="h-auto max-h-[80vh] overflow-y-auto p-3">
                            <SheetHeader>
                                <SheetTitle>Roadmap Controls</SheetTitle>
                            </SheetHeader>
                            <div className="space-y-4 mt-4">
                                {/* Title Section */}
                                <div>
                                    <Label htmlFor="mobileRoadmapTitle" className="text-sm font-medium text-gray-700">
                                        Roadmap Title
                                    </Label>
                                    <RoadmapInput
                                        id="mobileRoadmapTitle"
                                        value={roadmapData.title}
                                        onChange={(e) => setRoadmapData((prev) => ({ ...prev, title: e.target.value }))}
                                        className="text-base font-semibold bg-transparent border-gray-200 focus:border-blue-300 focus:ring-blue-200 px-3 py-2 w-full"
                                        placeholder="Enter your roadmap title..."
                                    />
                                </div>

                                {/* Visibility Control */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-blue-50 rounded-md">
                                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-gray-700">Visibility</Label>
                                            <p className="text-xs text-gray-500 capitalize">{roadmapData.visibility}</p>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={roadmapData.visibility === "public"}
                                        onCheckedChange={toggleVisibility}
                                        className="data-[state=checked]:bg-blue-600"
                                    />
                                </div>

                                {/* Difficulty Control */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-purple-50 rounded-md">
                                            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M13 10V3L4 14h7v7l9-11h-7z"
                                                />
                                            </svg>
                                        </div>
                                        <Label className="text-sm font-medium text-gray-700">Difficulty</Label>
                                    </div>
                                    <Select
                                        value={roadmapData.difficulty}
                                        onValueChange={(value) =>
                                            setRoadmapData((prev) => ({
                                                ...prev,
                                                difficulty: value as "Easy" | "Medium" | "Hard",
                                            }))
                                        }
                                    >
                                        <SelectTrigger className="w-full h-9 border-gray-200 focus:border-purple-300 focus:ring-purple-200">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Easy">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                    Easy
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="Medium">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                                    Medium
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="Hard">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                                    Hard
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Canvas Controls */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">Canvas Controls</Label>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline" onClick={zoomIn} className="flex-1 bg-transparent">
                                            <ZoomIn size={16} className="mr-2" />
                                            Zoom In
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={zoomOut} className="flex-1 bg-transparent">
                                            <ZoomOut size={16} className="mr-2" />
                                            Zoom Out
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={resetView} className="flex-1 bg-transparent">
                                            <RotateCcw size={16} className="mr-2" />
                                            Reset
                                        </Button>
                                    </div>
                                </div>

                                {/* Save Button */}
                                <Button
                                    onClick={saveRoadmap}
                                    disabled={isSaving}
                                    className="w-full bg-indigo-500 hover:bg-indigo-600 cursor-pointer disabled:bg-indigo-300"
                                >
                                    {isSaving ? "Saving..." : "Save Roadmap"}
                                </Button>
                            </div>
                        </SheetContent>
                    </Sheet>

                    {/* Floating Action Button with Tools */}
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetTrigger asChild>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        onClick={() => setIsSheetOpen(true)}
                                        size="sm"
                                        className="bg-indigo-500 hover:bg-indigo-600 cursor-pointer flex items-center gap-2 px-3 h-9"
                                    >
                                        Tools
                                        <ToolCase size={24} />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="left" className="bg-gray-900 text-white">
                                    <p>Open Roadmap Tools</p>
                                </TooltipContent>
                            </Tooltip>
                        </SheetTrigger>

                        <SheetContent className="w-96 mt-18 h-[calc(100vh-4.5rem)] overflow-y-auto bg-white border-l border-gray-200 px-5 py-5">
                            <SheetHeader className="pb-6 border-b border-gray-100">
                                <SheetTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
                                    <div className="p-2 bg-indigo-100 rounded-lg">
                                        <ToolCase size={20} className="text-indigo-600" />
                                    </div>
                                    Roadmap Tools
                                </SheetTitle>
                            </SheetHeader>

                            <div className="py-6 space-y-8">
                                {/* Node Creation Tools */}
                                <div className="space-y-5">
                                    <div className="flex items-center gap-3 pb-2">
                                        <div className="p-2 bg-emerald-50 rounded-lg">
                                            <Plus size={18} className="text-emerald-600" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900">Create New Node</h3>
                                    </div>

                                    <div className="space-y-4 pl-1">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium text-gray-700">Title</Label>
                                            <Input
                                                value={nodeForm.label}
                                                onChange={(e) => setNodeForm((prev) => ({ ...prev, label: e.target.value }))}
                                                placeholder="Enter node title..."
                                                className="h-10 border-gray-200 focus:border-emerald-300 focus:ring-emerald-200"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium text-gray-700">Description</Label>
                                            <Textarea
                                                value={nodeForm.description}
                                                onChange={(e) => setNodeForm((prev) => ({ ...prev, description: e.target.value }))}
                                                placeholder="Describe this node..."
                                                rows={3}
                                                className="border-gray-200 focus:border-emerald-300 focus:ring-emerald-200 resize-none"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="nodeType" className="text-sm font-medium text-gray-700 mb-2 block">
                                                Category
                                            </Label>
                                            <Select
                                                value={nodeForm.type}
                                                onValueChange={(value: keyof typeof nodeConfig) => setNodeForm({ ...nodeForm, type: value })}
                                            >
                                                <SelectTrigger className="h-10 w-full border-gray-200 focus:border-indigo-300 focus:ring-indigo-200">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.entries(nodeConfig).map(([key, config]) => {
                                                        const Icon = config.icon
                                                        return (
                                                            <SelectItem key={key} value={key}>
                                                                <div className="flex items-center gap-2">
                                                                    <Icon size={16} />
                                                                    <span className="capitalize">{key}</span>
                                                                </div>
                                                            </SelectItem>
                                                        )
                                                    })}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <Button
                                            onClick={addNode}
                                            disabled={!nodeForm.label.trim()}
                                            className="w-full h-10 bg-emerald-500 hover:bg-emerald-600 text-white font-medium"
                                        >
                                            <Plus size={16} className="mr-2" />
                                            Add Node
                                        </Button>
                                    </div>
                                </div>

                                <Separator className="bg-gray-200" />

                                {/* Statistics */}
                                <div className="space-y-5">
                                    <div className="flex items-center gap-3 pb-2">
                                        <div className="p-2 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                                            <Type size={18} className="text-purple-600" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900">Roadmap Stats</h3>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 pl-1">
                                        <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg text-center">
                                            <div className="text-2xl font-bold text-blue-600">{roadmapData.nodes.length}</div>
                                            <div className="text-xs text-blue-500 font-medium">Nodes</div>
                                        </div>
                                        <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg text-center">
                                            <div className="text-2xl font-bold text-green-600">{roadmapData.edges.length}</div>
                                            <div className="text-xs text-green-500 font-medium">Connections</div>
                                        </div>
                                    </div>
                                </div>

                                <Separator className="bg-gray-200" />

                                {/* Export Tools */}
                                <div className="space-y-5">
                                    <div className="flex items-center gap-3 pb-2">
                                        <div className="p-2 bg-purple-50 rounded-lg">
                                            <Download size={18} className="text-purple-600" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900">Export Options</h3>
                                    </div>

                                    <div className="space-y-3 pl-1">
                                        <Button
                                            variant="outline"
                                            className="w-full h-10 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-blue-300 bg-transparent"
                                            onClick={exportRoadmapJson}
                                        >
                                            <Download size={16} className="mr-2" />
                                            Export JSON
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="w-full h-10 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 bg-transparent"
                                            onClick={() => setIsDataSheetOpen(true)}
                                        >
                                            <Upload size={16} className="mr-2" />
                                            Import JSON
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Connection Mode Indicator */}
                {isConnecting && (
                    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 mb-5 z-30">
                        <Card className="p-4 bg-green-50 border-green-300">
                            <p className="text-green-700 font-medium">Connection Mode Active</p>
                            <p className="text-sm text-green-600">Click on a target node to create connection</p>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                    setIsConnecting(false)
                                    setConnectionStart(null)
                                }}
                                className="mt-2"
                            >
                                Cancel
                            </Button>
                        </Card>
                    </div>
                )}

                {/* Floating Connection Panel on Bottom Left */}
                <div className="fixed bottom-6 left-6 z-30">
                    <Card className="p-4 bg-white/95 backdrop-blur-sm border shadow-lg">
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                                <Link size={16} className="text-blue-600" />
                                <span className="font-medium text-sm">Quick Connect</span>
                            </div>

                            {highlightedNode ? (
                                <div className="space-y-2">
                                    <p className="text-xs text-gray-600">
                                        Node selected: {roadmapData.nodes.find((n) => n.id === highlightedNode)?.data.label}
                                    </p>
                                    <Button
                                        onClick={() => {
                                            if (highlightedNode) {
                                                startConnection(highlightedNode)
                                                setHighlightedNode(null)
                                            }
                                        }}
                                        size="sm"
                                        className="w-full bg-blue-600 hover:bg-blue-700"
                                    >
                                        <Link size={14} className="mr-2" />
                                        Start Connection
                                    </Button>
                                </div>
                            ) : (
                                <p className="text-xs text-gray-500">Click a node to select it for connection</p>
                            )}
                        </div>
                    </Card>
                </div>

                {roadmapData.nodes.length === 0 && (
                    <div className="fixed bottom-30 left-1/2 transform -translate-x-1/2 z-20 px-4 w-full max-w-md">
                        <Card className="p-6 bg-white/95 backdrop-blur-sm border-gray-300 w-full">
                            <div>
                                <h3 className="text-xl md:text-2xl font-semibold text-gray-900">Getting Started</h3>
                                <p className="text-zinc-500 mb-1">Hint's and Tip's</p>
                            </div>
                            <div className="space-y-2 text-sm text-gray-600">
                                <p>• Click the tools button to add your first node</p>
                                <p>• Double-click any node to start connecting</p>
                                <p>• Click a node to edit it instantly</p>
                                <p>• Drag nodes to reposition them</p>
                                <p>• Hover over nodes to see delete option</p>
                                <p>• Click on a Connection to delete them</p>
                            </div>
                        </Card>
                    </div>
                )}

                <Dialog open={isDataSheetOpen} onOpenChange={setIsDataSheetOpen}>
                    <DialogContent className="sm:max-w-4xl overflow-y-auto max-h-[80vh]">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Download size={18} />
                                Import/Export Roadmap Data
                            </DialogTitle>
                            <DialogDescription>
                                You can import a roadmap from a JSON file or export your current roadmap.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="jsonInput" className="text-sm font-medium text-gray-700">
                                    JSON Data
                                </Label>
                                <Textarea
                                    id="jsonInput"
                                    value={jsonText}
                                    onChange={(e) => {
                                        if (jsonError) setJsonError(null)
                                        setJsonText(e.target.value)
                                    }}
                                    placeholder="Paste your JSON data here..."
                                    rows={10}
                                    className="border-gray-200 focus:border-blue-300 focus:ring-blue-200 resize-none"
                                />
                                {jsonError && <p className="text-red-500 text-sm">{jsonError}</p>}
                            </div>

                            <div className="flex gap-2 pt-4 justify-end">
                                <Button variant="outline" onClick={() => setIsDataSheetOpen(false)}>
                                    Cancel
                                </Button>
                                <Button disabled={isCopiedPrompt} variant="outline" onClick={copyAIPrompt} className="bg-transparent">
                                    <Copy size={16} className="mr-2" />
                                    {isCopiedPrompt ? "Copied" : "Copy AI Prompt"}
                                </Button>
                                <Button
                                    onClick={applyRoadmapJson}
                                    disabled={!jsonText.trim() || !!jsonError}
                                    className="bg-indigo-500 hover:bg-indigo-600"
                                >
                                    Import
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={exportRoadmapJson}
                                    className="border-purple-200 text-purple-700 hover:bg-purple-50 bg-transparent"
                                >
                                    <Download size={16} className="mr-2" />
                                    Export
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                <Dialog open={isEdgeSelected} onOpenChange={(isOpen) => !isOpen && onCancelRemoveConnection()}>
                    <DialogContent className="sm:max-w-md border-red-200">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-red-800">
                                <Trash2 className="h-5 w-5 text-red-600" />
                                Delete Connection
                            </DialogTitle>
                            <DialogDescription className="text-red-700">
                                Are you sure you want to remove this connection? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>

                        <DialogFooter className="flex gap-2 sm:gap-2">
                            <Button
                                onClick={onCancelRemoveConnection}
                                size="sm"
                                variant="outline"
                                className="flex-1 h-9 border-gray-300 bg-transparent"
                            >
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                            </Button>

                            <Button onClick={onRemoveConnection} size="sm" variant="destructive" className="flex-1 h-9">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Node Editing Dialog */}
                <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Type size={18} />
                                Edit Node
                            </DialogTitle>
                        </DialogHeader>

                        {editingNode && (
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">Title</Label>
                                    <Input
                                        value={nodeForm.label}
                                        onChange={(e) => {
                                            setNodeForm((prev) => ({ ...prev, label: e.target.value }))
                                            updateNode(editingNode.id, {
                                                data: { ...editingNode.data, label: e.target.value },
                                            })
                                        }}
                                        className="h-10 border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">Description</Label>
                                    <Textarea
                                        value={nodeForm.description}
                                        onChange={(e) => {
                                            setNodeForm((prev) => ({ ...prev, description: e.target.value }))
                                            updateNode(editingNode.id, {
                                                data: { ...editingNode.data, description: e.target.value },
                                            })
                                        }}
                                        rows={3}
                                        className="border-gray-200 focus:border-blue-300 focus:ring-blue-200 resize-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="nodeType" className="text-sm font-medium text-gray-700 mb-2 block">
                                        Category
                                    </Label>
                                    <Select
                                        value={nodeForm.type}
                                        onValueChange={(value: keyof typeof nodeConfig) => {
                                            setNodeForm((prev) => ({ ...prev, type: value }))
                                            updateNode(editingNode.id, { type: value })
                                        }}
                                    >
                                        <SelectTrigger className="h-10 w-full border-gray-200 focus:border-blue-300 focus:ring-blue-200">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(nodeConfig).map(([key, config]) => {
                                                const Icon = config.icon
                                                return (
                                                    <SelectItem key={key} value={key}>
                                                        <div className="flex items-center gap-2">
                                                            <Icon size={16} />
                                                            <span className="capitalize">{key}</span>
                                                        </div>
                                                    </SelectItem>
                                                )
                                            })}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex gap-2 pt-4">
                                    <Button variant="outline" onClick={() => setIsEditModalOpen(false)} className="flex-1">
                                        Close
                                    </Button>
                                    <Button variant="destructive" onClick={() => deleteNode(editingNode.id)} className="flex-1">
                                        <Trash2 size={16} className="mr-2" />
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </main>
        </TooltipProvider>
    )
}
