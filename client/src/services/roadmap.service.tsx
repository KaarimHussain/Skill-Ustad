import { getDocs, collection, query, where, orderBy, deleteDoc, doc, addDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import AuthService from "./auth.service";
import axios from "axios";
import type { RoadmapData } from "@/views/Mentor/CreateRoadmap";
import type { DisplayRoadmapData } from "@/types/roadmap";

export default class RoadmapService {

    static async fetchAll() {
        const snapshot = await getDocs(collection(db, "roadmaps"));
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    static async getCurrentUserRoadmapData(): Promise<DisplayRoadmapData[]> {
        const userId = AuthService.getAuthenticatedUserId();
        if (!userId) return [];

        const roadmapRef = collection(db, "roadmaps");
        const q = query(roadmapRef, where("userId", "==", userId), orderBy("createdAt", "asc"));
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as DisplayRoadmapData[];
    }
    // Method where response is been coming from
    static async getRoadmapDifficulty(data: any[]): Promise<string> {
        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/lms/ai/roadmap-difficulty",
                {
                    data
                }
            );
            console.log("Difficulty response:", response.data);
            // Return just the difficulty string, not the entire response object
            return response.data.difficulty;
        } catch (error: any) {
            console.error("Error fetching roadmap difficulty:", error);
            throw new Error(
                error?.response?.data?.message || "Failed to fetch roadmap difficulty"
            );
        }
    }
    static async deleteRoadmap(id: string): Promise<boolean> {
        try {
            const docRef = doc(db, "roadmaps", id);
            await deleteDoc(docRef);
            return true;
        } catch (error) {
            console.error("Error deleting roadmap:", error);
            return false;
        }
    }
    static async saveRoadmap(roadmapData: RoadmapData & { id?: string }): Promise<string> {
        try {
            const userId = AuthService.getAuthenticatedUserId();
            if (!userId) throw new Error("User not authenticated");

            if (roadmapData.id) {
                const docRef = doc(db, "roadmaps", roadmapData.id);
                await updateDoc(docRef, {
                    ...roadmapData,
                    updatedAt: serverTimestamp()
                });
                return roadmapData.id;
            } else {
                const { id, ...dataWithoutId } = roadmapData; // remove id
                const docRef = await addDoc(collection(db, "roadmaps"), {
                    ...dataWithoutId,
                    userId,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                });
                return docRef.id;
            }
        } catch (error) {
            console.error("Error saving roadmap:", error);
            throw error;
        }
    }
}

