import { useState, useEffect } from "react"
import { collection, getDocs, query, where, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { DisplayRoadmapData } from "@/types/roadmap"
import { cacheManager, CACHE_KEYS, CACHE_DURATIONS } from "@/utils/cache"

export interface PublicRoadmapData extends DisplayRoadmapData {
    authorName?: string
    tags?: string[]
    views?: number
    likes?: number
    isLiked?: boolean
}

export function usePublicRoadmaps() {
    const [roadmaps, setRoadmaps] = useState<PublicRoadmapData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchPublicRoadmaps = async (useCache: boolean = true) => {
        const cacheKey = CACHE_KEYS.PUBLIC_ROADMAPS || "public_roadmaps"

        // Check cache first if enabled
        if (useCache) {
            const cachedData = cacheManager.get<PublicRoadmapData[]>(cacheKey)
            if (cachedData) {
                console.log("✅ Public roadmaps loaded from cache")
                setRoadmaps(cachedData)
                setLoading(false)
                return cachedData
            }
        }

        try {
            setLoading(true)
            setError(null)
            console.log("🔄 Fetching public roadmaps from Firebase")

            const roadmapRef = collection(db, "roadmaps")
            const q = query(
                roadmapRef,
                where("visibility", "==", "Public"),
                orderBy("createdAt", "desc")
            )
            const snapshot = await getDocs(q)

            const data = snapshot.docs.map(doc => {
                const roadmapData = doc.data() as DisplayRoadmapData
                return {
                    ...roadmapData,
                    id: doc.id, // Override any existing id with the document ID
                    // Add mock data for features that might not exist yet
                    authorName: roadmapData.userId || "Anonymous",
                    tags: extractTagsFromRoadmap(roadmapData),
                    views: Math.floor(Math.random() * 1000) + 50, // Mock data
                    likes: Math.floor(Math.random() * 100) + 5, // Mock data
                    isLiked: false
                } as PublicRoadmapData
            })

            // Cache the data
            cacheManager.set(cacheKey, data, CACHE_DURATIONS.ROADMAPS || 300000) // 5 minutes
            console.log("💾 Public roadmaps cached")

            setRoadmaps(data)
            return data
        } catch (err: any) {
            console.error("Error fetching public roadmaps:", err)
            setError(err.message || "Failed to fetch roadmaps")
            return []
        } finally {
            setLoading(false)
        }
    }

    const refreshRoadmaps = async () => {
        const cacheKey = CACHE_KEYS.PUBLIC_ROADMAPS || "public_roadmaps"
        cacheManager.invalidate(cacheKey)
        return await fetchPublicRoadmaps(false)
    }

    const clearCache = () => {
        const cacheKey = CACHE_KEYS.PUBLIC_ROADMAPS || "public_roadmaps"
        cacheManager.invalidate(cacheKey)
        setRoadmaps([])
        fetchPublicRoadmaps(false)
    }

    useEffect(() => {
        fetchPublicRoadmaps()
    }, [])

    return {
        roadmaps,
        loading,
        error,
        refreshRoadmaps,
        clearCache
    }
}

// Helper function to extract tags from roadmap nodes
function extractTagsFromRoadmap(roadmap: DisplayRoadmapData): string[] {
    const tags = new Set<string>()

    // Add difficulty as a tag
    if (roadmap.difficulty) {
        tags.add(roadmap.difficulty.toLowerCase())
    }

    // Extract tags from node types
    roadmap.nodes?.forEach(node => {
        if (node.type) {
            tags.add(node.type)
        }
        // Extract keywords from node labels and descriptions
        const text = `${node.data?.label || ''} ${node.data?.description || ''}`.toLowerCase()
        const keywords = text.match(/\b(javascript|python|react|node|web|mobile|ai|ml|data|backend|frontend|fullstack|database|api|cloud|devops|security|testing|design|ui|ux)\b/g)
        keywords?.forEach(keyword => tags.add(keyword))
    })

    return Array.from(tags).slice(0, 6) // Limit to 6 tags
}