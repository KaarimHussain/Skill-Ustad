"use client"

import { useState, useEffect, useCallback } from "react"
import LessonService, { type CourseData } from "@/services/lesson.service"

interface CacheData {
    courses: CourseData[]
    timestamp: number
    expiresIn: number
}

const CACHE_KEY = "courses_cache"
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

export function useCachedCourses() {
    const [courses, setCourses] = useState<CourseData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Check if cache is valid
    const isCacheValid = useCallback((cacheData: CacheData): boolean => {
        const now = Date.now()
        return now - cacheData.timestamp < cacheData.expiresIn
    }, [])

    // Get cached data from localStorage
    const getCachedData = useCallback((): CacheData | null => {
        try {
            const cached = localStorage.getItem(CACHE_KEY)
            if (!cached) return null

            const cacheData: CacheData = JSON.parse(cached)
            return isCacheValid(cacheData) ? cacheData : null
        } catch (error) {
            console.error("Error reading cache:", error)
            return null
        }
    }, [isCacheValid])

    // Save data to cache
    const setCachedData = useCallback((courses: CourseData[]) => {
        try {
            const cacheData: CacheData = {
                courses,
                timestamp: Date.now(),
                expiresIn: CACHE_DURATION,
            }
            localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))
        } catch (error) {
            console.error("Error saving to cache:", error)
        }
    }, [])

    // Fetch courses with caching
    const fetchCourses = useCallback(
        async (forceRefresh = false) => {
            try {
                setLoading(true)
                setError(null)

                // Check cache first (unless force refresh)
                if (!forceRefresh) {
                    const cachedData = getCachedData()
                    if (cachedData) {
                        console.log("[v0] Using cached courses data")
                        setCourses(cachedData.courses)
                        setLoading(false)
                        return cachedData.courses
                    }
                }

                console.log("[v0] Fetching fresh courses from database")

                // Fetch from database
                const coursesData = await LessonService.getAllCourses()

                // Update state and cache
                setCourses(coursesData)
                setCachedData(coursesData)

                return coursesData
            } catch (err) {
                console.error("Error fetching courses:", err)
                setError("Failed to load courses. Please try again.")
                return []
            } finally {
                setLoading(false)
            }
        },
        [getCachedData, setCachedData],
    )

    // Clear cache manually
    const clearCache = useCallback(() => {
        try {
            localStorage.removeItem(CACHE_KEY)
            console.log("[v0] Courses cache cleared")
        } catch (error) {
            console.error("Error clearing cache:", error)
        }
    }, [])

    // Refresh data (force fetch)
    const refreshCourses = useCallback(() => {
        return fetchCourses(true)
    }, [fetchCourses])

    // Initial fetch on mount
    useEffect(() => {
        fetchCourses()
    }, [fetchCourses])

    return {
        courses,
        loading,
        error,
        refreshCourses,
        clearCache,
        fetchCourses,
    }
}