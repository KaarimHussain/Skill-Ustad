import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import AuthService from "./auth.service";
import axios from "axios";

export default class RoadmapService {

    private static readonly lmsUrl = import.meta.env.VITE_LMSTUDIOS_URL;

    static async fetchAll() {
        const snapshot = await getDocs(collection(db, "roadmaps"));
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    static async getCurrentUserRoadmapData() {
        const userId = AuthService.getAuthenticatedUserId();
        if (!userId) return [];

        const roadmapRef = collection(db, "roadmaps");
        const q = query(roadmapRef, where("userId", "==", userId));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    static async getRoadmapDifficulty(prompt: string, data: any[]): Promise<string> {
        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/lms/ai/roadmap-difficulty", // assuming you're proxying through Vite or using full URL like http://localhost:8000
                {
                    prompt,
                    data
                }
            );
            console.log("Difficulty response:", response.data);
            return response.data.difficulty;
        } catch (error: any) {
            console.error("Error fetching roadmap difficulty:", error);
            throw new Error(
                error?.response?.data?.message || "Failed to fetch roadmap difficulty"
            );
        }
    }


}
