import type { Timestamp } from "firebase/firestore";

export interface FirebaseRoadmapDto {
    createdAt: Timestamp,
    edges: any[],
    id: string,
    nodes: any[],
    title: string,
    userId: string,
    visibility: string,
    difficulty: string
}

// Individual progress item for a completed node
export interface NodeProgress {
    nodeId: number;
    completedAt: Timestamp;
    status: "completed" | "in-progress" | "skipped";
    // Optional fields for additional tracking
    timeSpent?: number; // in minutes
    score?: number; // for quizzes or assessments
    notes?: string; // user notes
}

// Main roadmap progress document structure
export interface RoadmapProgress {
    roadmapId: string;
    userId: string;
    progress: NodeProgress[];
    startedAt: Timestamp;
    lastUpdated: Timestamp;
    // Optional additional fields
    completionPercentage?: number;
    currentNodeId?: number; // track where user currently is
    isCompleted?: boolean;
    completedAt?: Timestamp; // when entire roadmap was completed
}