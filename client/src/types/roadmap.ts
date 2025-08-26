import type { Timestamp } from "firebase/firestore";
import { BookOpen, BrainCircuit, CheckCircle, FolderOpen, Footprints, Play, Sparkles, Tag, Target } from "lucide-react";


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
export interface RoadmapNode {
    id: string;
    type: keyof typeof nodeConfig;
    position: { x: number; y: number };
    data: {
        label: string;
        description: string;
    };
}

export interface RoadmapEdge {
    id: string;
    source: string;
    target: string;
}

export interface DisplayRoadmapData {
    id: string; // you’ll want this since you’re returning doc.id
    title: string;
    nodes: RoadmapNode[];
    edges: RoadmapEdge[];
    difficulty: string;
    userId: string;
    visibility: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface RoadmapProgress {
    roadmapId: string;          // Reference to original roadmap
    userId: string;             // User who owns this progress
    progress: string[];         // Array of completed node IDs
    startedAt: Timestamp;       // When user started this roadmap
    lastUpdated: Timestamp;     // Last update timestamp
    currentStep?: string;       // Optional: Currently active node
}