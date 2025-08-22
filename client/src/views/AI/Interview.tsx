"use client"

import { useState } from "react"
import InterviewStaging from "@/components/interview/interview-staging"
import MainInterviewSimulator from "@/components/interview/main-interview-simulator"
import InterviewReport from "@/components/interview/interview-report"

interface InterviewConfig {
    questionsFile: File | null
    language: string
    experienceLevel: string
    technology: string
    estimatedDuration: number
    questionCount: number
}

export default function Interview() {
    const [currentPhase, setCurrentPhase] = useState<"staging" | "interview" | "report">("staging")
    const [interviewConfig, setInterviewConfig] = useState<InterviewConfig | null>(null)
    const [interviewResults, setInterviewResults] = useState<any>(null)

    const handleStartInterview = (config: InterviewConfig) => {
        setInterviewConfig(config)
        setCurrentPhase("interview")
    }

    const handleInterviewComplete = (results: any) => {
        setInterviewResults(results)
        setCurrentPhase("report")
    }

    const handleExitInterview = () => {
        setCurrentPhase("staging")
        setInterviewConfig(null)
    }

    const handleBackToStaging = () => {
        setCurrentPhase("staging")
        setInterviewConfig(null)
        setInterviewResults(null)
    }

    return (
        <div>
            {currentPhase === "staging" && <InterviewStaging onStartInterview={handleStartInterview} />}

            {currentPhase === "interview" && interviewConfig && (
                <MainInterviewSimulator
                    config={interviewConfig}
                    onComplete={handleInterviewComplete}
                    onExit={handleExitInterview}
                />
            )}

            {currentPhase === "report" && interviewConfig && interviewResults && (
                <InterviewReport config={interviewConfig} results={interviewResults} onBackToStaging={handleBackToStaging} />
            )}
        </div>
    )
}
