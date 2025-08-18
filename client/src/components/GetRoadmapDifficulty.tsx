import type { FirebaseRoadmapDto } from "@/dtos/firebase.roadmap";

export default function GetRoadmapDifficulty(roadmap: FirebaseRoadmapDto) {
    const diff = roadmap.difficulty;
    return diff || "Medium"
}