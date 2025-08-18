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