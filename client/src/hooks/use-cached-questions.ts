"use client"

import { useState, useEffect, useCallback } from "react"
import QAService, { type Question } from "@/services/qa.service"

interface QuestionWithStats extends Question {
    answers: number
}

interface CacheData {
    questions: QuestionWithStats[]
    timestamp: number
    expiresIn: number
}

const CACHE_KEY = "qa_questions_cache"
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

export function useCachedQuestions() {
    const [questions, setQuestions] = useState<QuestionWithStats[]>([])
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
    const setCachedData = useCallback((questions: QuestionWithStats[]) => {
        try {
            const cacheData: CacheData = {
                questions,
                timestamp: Date.now(),
                expiresIn: CACHE_DURATION,
            }
            localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))
        } catch (error) {
            console.error("Error saving to cache:", error)
        }
    }, [])

    // Fetch questions with caching
    const fetchQuestions = useCallback(
        async (forceRefresh = false) => {
            try {
                setLoading(true)
                setError(null)

                // Check cache first (unless force refresh)
                if (!forceRefresh) {
                    const cachedData = getCachedData()
                    if (cachedData) {
                        console.log("[v0] Using cached questions data")
                        setQuestions(cachedData.questions)
                        setLoading(false)
                        return cachedData.questions
                    }
                }

                console.log("[v0] Fetching fresh questions from database")

                // Fetch from database
                const questionsData = await QAService.fetchQuestionsWithAnswerCounts()

                // Transform data
                const questionsWithStats = questionsData.map((question) => ({
                    ...question,
                    answers: question.answerCount,
                }))

                // Update state and cache
                setQuestions(questionsWithStats)
                setCachedData(questionsWithStats)

                return questionsWithStats
            } catch (err) {
                console.error("Error fetching questions:", err)
                setError("Failed to load questions. Please try again.")
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
            console.log("[v0] Questions cache cleared")
        } catch (error) {
            console.error("Error clearing cache:", error)
        }
    }, [])

    // Refresh data (force fetch)
    const refreshQuestions = useCallback(() => {
        return fetchQuestions(true)
    }, [fetchQuestions])

    // Initial fetch on mount
    useEffect(() => {
        fetchQuestions()
    }, [fetchQuestions])

    return {
        questions,
        loading,
        error,
        refreshQuestions,
        clearCache,
        fetchQuestions,
    }
}
