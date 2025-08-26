import { getDocs, collection, query, where, orderBy, deleteDoc, doc, addDoc, serverTimestamp, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import AuthService from "./auth.service";
import axios from "axios";
import type { RoadmapData } from "@/views/Mentor/CreateRoadmap";
import type { DisplayRoadmapData } from "@/types/roadmap";
import { cacheManager, CACHE_KEYS, CACHE_DURATIONS } from "@/utils/cache";

export default class RoadmapService {

    static async fetchAll() {
        const snapshot = await getDocs(collection(db, "roadmaps"));
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    static async getCurrentUserRoadmapData(useCache: boolean = true): Promise<DisplayRoadmapData[]> {
        const userId = AuthService.getAuthenticatedUserId();
        if (!userId) return [];

        const cacheKey = CACHE_KEYS.USER_ROADMAPS(userId);

        // Check cache first if enabled
        if (useCache) {
            const cachedData = cacheManager.get<DisplayRoadmapData[]>(cacheKey);
            if (cachedData) {
                console.log("✅ Roadmap data loaded from cache");
                return cachedData;
            }
        }

        console.log("🔄 Fetching roadmap data from Firebase");
        const roadmapRef = collection(db, "roadmaps");
        const q = query(roadmapRef, where("userId", "==", userId), orderBy("createdAt", "asc"));
        const snapshot = await getDocs(q);

        const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as DisplayRoadmapData[];

        // Cache the data
        cacheManager.set(cacheKey, data, CACHE_DURATIONS.ROADMAPS);
        console.log("💾 Roadmap data cached");

        return data;
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

            // Invalidate cache after deletion
            const userId = AuthService.getAuthenticatedUserId();
            if (userId) {
                cacheManager.invalidate(CACHE_KEYS.USER_ROADMAPS(userId));
                cacheManager.invalidate(CACHE_KEYS.USER_PROGRESS(userId));
                console.log("🗑️ Cache invalidated after roadmap deletion");
            }

            return true;
        } catch (error) {
            console.error("Error deleting roadmap:", error);
            return false;
        }
    }
    static async saveRoadmap(roadmapData: RoadmapData & { id?: string }): Promise<string> {
        try {
            const userId = AuthService.getAuthenticatedUserId()
            if (!userId) throw new Error("User not authenticated")

            let roadmapId: string;

            if (roadmapData.id) {
                const docRef = doc(db, "roadmaps", roadmapData.id)
                await updateDoc(docRef, {
                    ...roadmapData,
                    updatedAt: serverTimestamp(),
                })
                roadmapId = roadmapData.id;
            } else {
                const { id, ...dataWithoutId } = roadmapData // remove id
                const docRef = await addDoc(collection(db, "roadmaps"), {
                    ...dataWithoutId,
                    userId,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                })
                roadmapId = docRef.id;
            }

            // Invalidate cache after saving
            cacheManager.invalidate(CACHE_KEYS.USER_ROADMAPS(userId));
            console.log("🗑️ Cache invalidated after roadmap save");

            return roadmapId;
        } catch (error) {
            console.error("Error saving roadmap:", error)
            throw error
        }
    }

    static async getCurrentUserProgressData(useCache: boolean = true): Promise<any[]> {
        const userId = AuthService.getAuthenticatedUserId();
        if (!userId) return [];

        const cacheKey = CACHE_KEYS.USER_PROGRESS(userId);

        // Check cache first if enabled
        if (useCache) {
            const cachedData = cacheManager.get<any[]>(cacheKey);
            if (cachedData) {
                console.log("✅ Progress data loaded from cache");
                return cachedData;
            }
        }

        try {
            console.log("🔄 Fetching progress data from Firebase");
            const progressRef = collection(db, "roadmap-progress");
            const q = query(progressRef, where("userId", "==", userId), orderBy("lastUpdated", "desc"));
            const snapshot = await getDocs(q);

            const progressData = [];

            for (const progressDoc of snapshot.docs) {
                const progressInfo = progressDoc.data();

                // Fetch the corresponding roadmap data
                const roadmapDoc = await getDoc(doc(db, "roadmaps", progressInfo.roadmapId));

                if (roadmapDoc.exists()) {
                    const roadmapData = roadmapDoc.data();
                    const totalNodes = roadmapData.nodes?.length || 0;
                    const completedNodes = progressInfo.progress?.length || 0;
                    const progressPercentage = totalNodes > 0 ? Math.round((completedNodes / totalNodes) * 100) : 0;

                    progressData.push({
                        id: progressDoc.id,
                        roadmapId: progressInfo.roadmapId,
                        roadmapTitle: roadmapData.title,
                        roadmapDifficulty: roadmapData.difficulty,
                        progress: progressInfo.progress || [],
                        completedNodes,
                        totalNodes,
                        progressPercentage,
                        startedAt: progressInfo.startedAt,
                        lastUpdated: progressInfo.lastUpdated,
                    });
                }
            }

            // Cache the data
            cacheManager.set(cacheKey, progressData, CACHE_DURATIONS.PROGRESS);
            console.log("💾 Progress data cached");

            return progressData;
        } catch (error) {
            console.error("Error fetching progress data:", error);
            return [];
        }
    }
}

