interface CourseSection {
    id: string
    title: string
    content: string
    duration: string
    type: "theory" | "practical" | "quiz" | "project"
}

export interface GeneratedCourse {
    title: string
    description: string
    difficulty: "Beginner" | "Intermediate" | "Advanced"
    estimatedDuration: string
    learningObjectives: string[]
    prerequisites: string[]
    sections: CourseSection[]
    resources: {
        videos: { title: string; url: string; duration: string }[]
        articles: { title: string; url: string; readTime: string }[]
        tools: { name: string; description: string; url: string }[]
    }
    projects: {
        title: string
        description: string
        difficulty: string
        estimatedTime: string
    }[]
}

export default class CourseGeneratorService {
    private static readonly API_ENDPOINT = "http://127.0.0.1:8000/lms/ai/generate-course"
    // Prevent duplicate requests
    private static activeRequests = new Map<string, Promise<GeneratedCourse>>()

    static async generateCourse(nodeData: any, roadmapContext: any): Promise<GeneratedCourse> {
        // Create a unique key for this request
        const requestKey = `${nodeData.data.label}_${roadmapContext.roadmapTitle}`

        // Check if we already have an active request for this course
        if (this.activeRequests.has(requestKey)) {
            console.log("🔄 Reusing existing request for:", nodeData.data.label)
            return this.activeRequests.get(requestKey)!
        }

        console.log("🚀 Starting new course generation for:", nodeData.data.label)
        console.log("API Endpoint:", this.API_ENDPOINT)

        const requestPromise = this.performCourseGeneration(nodeData, roadmapContext)

        // Store the promise to prevent duplicates
        this.activeRequests.set(requestKey, requestPromise)

        try {
            const result = await requestPromise
            console.log("Final Course Response: ", result);

            return result
        } finally {
            // Clean up the active request
            this.activeRequests.delete(requestKey)
        }
    }

    private static async performCourseGeneration(nodeData: any, roadmapContext: any): Promise<GeneratedCourse> {
        try {
            const requestBody = {
                nodeTitle: nodeData.data.label,
                nodeDescription: nodeData.data.description || "Learn this important topic",
                nodeType: nodeData.type || "skill",
                roadmapTitle: roadmapContext.roadmapTitle || "Learning Roadmap",
                roadmapId: roadmapContext.roadmapId || "default",
            }

            console.log("📤 Sending request:", requestBody)

            // Increased timeout to 5 minutes to match backend
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 300000) // 5 minutes

            const response = await fetch(this.API_ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
                signal: controller.signal,
            })

            clearTimeout(timeoutId)

            console.log("📥 Response status:", response.status)
            console.log("📥 Response ok:", response.ok)

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`)
            }

            const aiGeneratedCourse = await response.json()
            console.log("✅ AI Generated Course:", aiGeneratedCourse)

            // Check if this looks like AI data or fallback data
            if (
                aiGeneratedCourse.title.startsWith("Master ") &&
                aiGeneratedCourse.description.includes("A comprehensive course designed to help you understand and master")
            ) {
                console.warn("⚠️ Received fallback data, not AI generated!")
            } else {
                console.log("🎉 Successfully received AI-generated course!")
            }

            return aiGeneratedCourse
        } catch (error: any) {
            if (error.name === "AbortError") {
                console.error("⏰ Request timed out after 5 minutes")
            } else {
                console.error("❌ Course generation error:", error)
            }
            console.log("🔄 Falling back to mock data...")

            // Return mock data for development
            return this.getMockCourse(nodeData)
        }
    }

    private static getMockCourse(nodeData: any): GeneratedCourse {
        console.log("📋 Using mock course data")
        return {
            title: `Master ${nodeData.data.label}`,
            description: `A comprehensive course designed to help you understand and master ${nodeData.data.label}. ${nodeData.data.description}`,
            difficulty: "Intermediate",
            estimatedDuration: "4-6 hours",
            learningObjectives: [
                `Understand the core concepts of ${nodeData.data.label}`,
                "Apply practical techniques and best practices",
                "Build real-world projects using these skills",
                "Troubleshoot common issues and challenges",
            ],
            prerequisites: [
                "Basic programming knowledge",
                "Familiarity with development tools",
                "Understanding of fundamental concepts",
            ],
            sections: [
                {
                    id: "1",
                    title: "Introduction and Fundamentals",
                    content: `Welcome to the ${nodeData.data.label} course! In this section, we'll cover the fundamental concepts and principles that form the foundation of ${nodeData.data.label}. You'll learn about the core terminology, key concepts, and why ${nodeData.data.label} is important in modern development.`,
                    duration: "45 minutes",
                    type: "theory",
                },
                {
                    id: "2",
                    title: "Hands-on Practice",
                    content: `Now that you understand the basics, let's dive into practical implementation. We'll work through real examples and build something tangible using ${nodeData.data.label}. This hands-on approach will help solidify your understanding.`,
                    duration: "90 minutes",
                    type: "practical",
                },
                {
                    id: "3",
                    title: "Advanced Techniques",
                    content: `Take your skills to the next level with advanced techniques and best practices. Learn how professionals use ${nodeData.data.label} in production environments and discover optimization strategies.`,
                    duration: "60 minutes",
                    type: "theory",
                },
                {
                    id: "4",
                    title: "Final Project",
                    content: `Apply everything you've learned by building a comprehensive project. This capstone project will demonstrate your mastery of ${nodeData.data.label} and serve as a portfolio piece.`,
                    duration: "120 minutes",
                    type: "project",
                },
            ],
            resources: {
                videos: [
                    {
                        title: `${nodeData.data.label} Fundamentals Explained`,
                        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                        duration: "15:30",
                    },
                    {
                        title: `Building with ${nodeData.data.label} - Step by Step`,
                        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                        duration: "22:45",
                    },
                    {
                        title: `Advanced ${nodeData.data.label} Techniques`,
                        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                        duration: "18:20",
                    },
                ],
                articles: [
                    {
                        title: `The Complete Guide to ${nodeData.data.label}`,
                        url: "#",
                        readTime: "12 min read",
                    },
                    {
                        title: `Best Practices for ${nodeData.data.label}`,
                        url: "#",
                        readTime: "8 min read",
                    },
                ],
                tools: [
                    {
                        name: "Development Environment",
                        description: "Recommended setup for working with this technology",
                        url: "#",
                    },
                    {
                        name: "Testing Framework",
                        description: "Tools for testing your implementations",
                        url: "#",
                    },
                ],
            },
            projects: [
                {
                    title: `Build a ${nodeData.data.label} Application`,
                    description: "Create a fully functional application that demonstrates your understanding",
                    difficulty: "Intermediate",
                    estimatedTime: "2-3 hours",
                },
            ],
        }
    }
}
