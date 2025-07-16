"use client"

import {
  Mic,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Square,
  Shield,
  AlertTriangle,
  FileText,
  CheckCircle,
  XCircle,
  Camera,
} from "lucide-react"
import { useEffect, useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ChatMessage {
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
}

interface SecurityEvent {
  type: "tab_blur" | "window_blur" | "fullscreen_exit" | "prohibited_key" | "right_click" | "focus_loss"
  timestamp: Date
  duration?: number
  details?: string
}

interface InterviewReport {
  candidate: {
    technology: string
    experienceLevel: string
    interviewDuration: number
    totalQuestions: number
    totalResponses: number
  }
  performance: {
    strengths: string[]
    weaknesses: string[]
    technicalKnowledge: number
    communicationSkills: number
    problemSolvingAbility: number
    overallScore: number
    grade: string
  }
  security: {
    securityScore: number
    violations: SecurityEvent[]
    trustworthiness: string
    behaviorAnalysis: string
  }
  recommendations: string[]
  summary: string
  timestamp: Date
}

type InterviewState = "idle" | "listening" | "processing" | "speaking" | "error" | "security_warning" | "completed"

export default function VoiceInterviewSimulator() {
  const userTechnology = "JavaScript"
  const userExperienceLevel = "Beginner"

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
  const [currentState, setCurrentState] = useState<InterviewState>("idle")
  const [chatVisibility, setChatVisibility] = useState(false)
  const [currentTranscript, setCurrentTranscript] = useState("")
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [interviewStarted, setInterviewStarted] = useState(false)
  const [interviewCompleted, setInterviewCompleted] = useState(false)
  const [audioQueue, setAudioQueue] = useState<string[]>([])
  const [isProcessingAudio, setIsProcessingAudio] = useState(false)
  const [interviewStartTime, setInterviewStartTime] = useState<Date | null>(null)
  const [questionCount, setQuestionCount] = useState(0)
  const [showReport, setShowReport] = useState(false)
  const [interviewReport, setInterviewReport] = useState<InterviewReport | null>(null)

  // Security state (without video/camera)
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([])
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [tabBlurCount, setTabBlurCount] = useState(0)
  const [windowBlurCount, setWindowBlurCount] = useState(0)
  const [securityScore, setSecurityScore] = useState(100)
  const [showSecurityWarning, setShowSecurityWarning] = useState(false)
  const [focusLossCount, setFocusLossCount] = useState(0)

  // Refs for managing audio, speech recognition, and security
  const recognitionRef = useRef<any>(null)
  const currentAudioRef = useRef<HTMLAudioElement | null>(null)
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const isUserSpeakingRef = useRef(false)
  const audioQueueRef = useRef<string[]>([])
  const tabBlurTimerRef = useRef<NodeJS.Timeout | null>(null)
  const windowBlurTimerRef = useRef<NodeJS.Timeout | null>(null)
  const audioProcessingRef = useRef(false)

  // Face Capture
  const [captureCount, setCaptureCount] = useState<number>(0);
  const [captureList, setCaptureList] = useState<string[]>([]);
  let stream: MediaStream | undefined;
  let video: HTMLVideoElement | undefined;

  // Initialize system prompt with strict interview focus and completion detection
  useEffect(() => {
    const systemPrompt = `You are a professional technical interviewer conducting a ${userTechnology} interview for a ${userExperienceLevel} level position.

    STRICT INTERVIEW PROTOCOL:
    🎯 INTERVIEW SCOPE: Only discuss ${userTechnology} technical topics, programming concepts, and directly related technologies
    🚫 FORBIDDEN TOPICS: Personal life, weather, general conversation, non-technical subjects, explanations of basic concepts unless asked
    🎤 VOICE OPTIMIZED: Keep responses under 50 words, speak naturally as a human interviewer would
    📝 QUESTION FLOW: Ask ONE focused technical question, wait for complete answer, provide brief feedback (2-3 words), then next question
      
    INTERVIEW STRUCTURE:
    1. Brief professional greeting (10 seconds max)
    2. Start with fundamental ${userTechnology} concepts (3-4 questions)
    3. Progress to intermediate topics based on responses (3-4 questions)
    4. Ask practical coding scenarios (2-3 questions)
    5. Conclude with final assessment
      
    COMPLETION CRITERIA:
    - After 8-10 questions, conclude with: "Thank you for your time. This completes our technical interview. Please wait for your detailed report."
    - NEVER exceed 12 questions total
    - If candidate struggles significantly, conclude earlier with supportive feedback
      
    RESPONSE RULES:
    - Never explain answers or provide tutorials
    - If candidate goes off-topic, redirect: "Let's focus on ${userTechnology}. [Next question]"
    - For unclear answers: "Can you be more specific about [technical aspect]?"
    - Keep feedback minimal: "Good", "I see", "Let's continue"
    - Never simulate candidate responses
    - Maintain professional interviewer tone throughout
      
    Begin with: "Hello, I'm conducting your ${userTechnology} technical interview today. Let's start with: What is the difference between let, const, and var in JavaScript?"`

    setChatHistory([
      {
        role: "system",
        content: systemPrompt,
        timestamp: new Date(),
      },
    ])
  }, [userTechnology, userExperienceLevel])

  // Generate comprehensive interview report
  const generateInterviewReport = useCallback(async (): Promise<InterviewReport> => {
    const interviewDuration = interviewStartTime ? Date.now() - interviewStartTime.getTime() : 0
    const userResponses = chatHistory.filter((msg) => msg.role === "user")
    const assistantMessages = chatHistory.filter((msg) => msg.role === "assistant")

    // Analyze responses using AI
    const analysisPrompt = `Analyze this technical interview conversation and provide a detailed assessment:

INTERVIEW DATA:
Technology: ${userTechnology}
Experience Level: ${userExperienceLevel}
Duration: ${Math.round(interviewDuration / 60000)} minutes
Questions Asked: ${questionCount}
User Responses: ${userResponses.length}

SECURITY METRICS:
Security Score: ${securityScore}%
Tab Switches: ${tabBlurCount}
Window Focus Loss: ${windowBlurCount}
Total Security Events: ${securityEvents.length}

CONVERSATION:
${chatHistory
        .filter((msg) => msg.role !== "system")
        .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
        .join("\n")}

Please provide a JSON response with this exact structure:
{
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2", "weakness3"],
  "technicalKnowledge": 85,
  "communicationSkills": 78,
  "problemSolvingAbility": 82,
  "overallScore": 81,
  "recommendations": ["recommendation1", "recommendation2", "recommendation3"],
  "summary": "Detailed 2-3 sentence summary of performance",
  "behaviorAnalysis": "Analysis of candidate behavior during interview based on security events"
}

Scores should be 0-100. Be specific and constructive in feedback.`

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_OPEN_ROUTER_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mistralai/mixtral-8x7b-instruct",
          messages: [{ role: "user", content: analysisPrompt }],
          max_tokens: 800,
          temperature: 0.3,
        }),
      })

      const data = await response.json()
      const analysisResult = JSON.parse(data.choices?.[0]?.message?.content || "{}")

      // Calculate security trustworthiness
      const getTrustworthiness = (score: number) => {
        if (score >= 90) return "Highly Trustworthy"
        if (score >= 75) return "Trustworthy"
        if (score >= 60) return "Moderately Trustworthy"
        if (score >= 40) return "Low Trustworthiness"
        return "Untrustworthy"
      }

      // Calculate grade
      const getGrade = (score: number) => {
        if (score >= 90) return "A+"
        if (score >= 85) return "A"
        if (score >= 80) return "A-"
        if (score >= 75) return "B+"
        if (score >= 70) return "B"
        if (score >= 65) return "B-"
        if (score >= 60) return "C+"
        if (score >= 55) return "C"
        if (score >= 50) return "C-"
        return "F"
      }

      const report: InterviewReport = {
        candidate: {
          technology: userTechnology,
          experienceLevel: userExperienceLevel,
          interviewDuration: Math.round(interviewDuration / 60000),
          totalQuestions: questionCount,
          totalResponses: userResponses.length,
        },
        performance: {
          strengths: analysisResult.strengths || ["Participated in interview", "Attempted to answer questions"],
          weaknesses: analysisResult.weaknesses || ["Limited technical knowledge", "Needs more practice"],
          technicalKnowledge: analysisResult.technicalKnowledge || 60,
          communicationSkills: analysisResult.communicationSkills || 65,
          problemSolvingAbility: analysisResult.problemSolvingAbility || 60,
          overallScore: analysisResult.overallScore || 62,
          grade: getGrade(analysisResult.overallScore || 62),
        },
        security: {
          securityScore,
          violations: securityEvents,
          trustworthiness: getTrustworthiness(securityScore),
          behaviorAnalysis:
            analysisResult.behaviorAnalysis ||
            "Candidate maintained focus throughout the interview with minimal distractions.",
        },
        recommendations: analysisResult.recommendations || [
          "Practice more technical concepts",
          "Improve communication clarity",
          "Study practical coding examples",
        ],
        summary:
          analysisResult.summary ||
          `Candidate demonstrated ${userExperienceLevel} level understanding of ${userTechnology} with room for improvement in technical depth and practical application.`,
        timestamp: new Date(),
      }

      return report
    } catch (error) {
      console.error("Failed to generate AI analysis:", error)

      // Fallback report generation
      const fallbackScore = Math.max(40, Math.min(85, 60 + userResponses.length * 3 - securityEvents.length * 5))

      return {
        candidate: {
          technology: userTechnology,
          experienceLevel: userExperienceLevel,
          interviewDuration: Math.round(interviewDuration / 60000),
          totalQuestions: questionCount,
          totalResponses: userResponses.length,
        },
        performance: {
          strengths: ["Participated actively", "Attempted all questions", "Maintained engagement"],
          weaknesses: ["Technical depth needs improvement", "Could be more specific in answers"],
          technicalKnowledge: fallbackScore,
          communicationSkills: Math.min(fallbackScore + 10, 90),
          problemSolvingAbility: Math.max(fallbackScore - 5, 30),
          overallScore: fallbackScore,
          grade: fallbackScore >= 80 ? "B+" : fallbackScore >= 70 ? "B" : fallbackScore >= 60 ? "C+" : "C",
        },
        security: {
          securityScore,
          violations: securityEvents,
          trustworthiness: securityScore >= 80 ? "Trustworthy" : "Moderately Trustworthy",
          behaviorAnalysis: "Standard interview behavior observed with some focus variations.",
        },
        recommendations: [
          `Study ${userTechnology} fundamentals more deeply`,
          "Practice explaining technical concepts clearly",
          "Work on practical coding exercises",
        ],
        summary: `Candidate showed ${userExperienceLevel} level knowledge in ${userTechnology} interview with potential for growth.`,
        timestamp: new Date(),
      }
    }
  }, [
    chatHistory,
    userTechnology,
    userExperienceLevel,
    interviewStartTime,
    questionCount,
    securityScore,
    securityEvents,
    tabBlurCount,
    windowBlurCount,
  ])

  // Enhanced audio management with proper cleanup
  const stopCurrentAudio = useCallback(() => {
    console.log("Stopping current audio...")

    if (currentAudioRef.current) {
      try {
        currentAudioRef.current.pause()
        currentAudioRef.current.currentTime = 0

        // Remove all event listeners
        const audio = currentAudioRef.current
        audio.onended = null
        audio.onerror = null
        audio.onloadstart = null
        audio.oncanplay = null

        // Revoke object URL if it exists
        if (audio.src && audio.src.startsWith("blob:")) {
          URL.revokeObjectURL(audio.src)
        }

        currentAudioRef.current = null
      } catch (error) {
        console.log("Error stopping audio:", error)
      }
    }

    // Clear processing flags
    audioProcessingRef.current = false
    setIsProcessingAudio(false)

    // Clear audio queue
    audioQueueRef.current = []
    setAudioQueue([])
  }, [])

  // Complete interview and generate report
  const completeInterview = useCallback(async () => {
    setCurrentState("processing")
    stopCurrentAudio()
    stopListening()

    try {
      const report = await generateInterviewReport()
      setInterviewReport(report)
      setInterviewCompleted(true)
      setShowReport(true)
      setCurrentState("completed")
    } catch (error) {
      console.error("Failed to generate report:", error)
      setCurrentState("error")
    }
  }, [generateInterviewReport, stopCurrentAudio])

  // Security event logger (without video/camera events)
  const logSecurityEvent = useCallback((event: SecurityEvent) => {
    setSecurityEvents((prev) => [...prev, event])

    // Update security score based on event type
    let scoreDeduction = 0
    switch (event.type) {
      case "tab_blur":
        scoreDeduction = event.duration && event.duration > 5000 ? 15 : 5
        break
      case "window_blur":
        scoreDeduction = event.duration && event.duration > 3000 ? 10 : 3
        break
      case "fullscreen_exit":
        scoreDeduction = 20
        break
      case "prohibited_key":
        scoreDeduction = 8
        break
      case "right_click":
        scoreDeduction = 3
        break
      case "focus_loss":
        scoreDeduction = 5
        break
    }

    setSecurityScore((prev) => Math.max(0, prev - scoreDeduction))

    if (scoreDeduction > 10) {
      setShowSecurityWarning(true)
      setTimeout(() => setShowSecurityWarning(false), 5000)
    }
  }, [])

  // Security event handlers (without video/camera monitoring)
  useEffect(() => {
    if (interviewCompleted) return

    // Tab visibility change detection
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const startTime = Date.now()
        tabBlurTimerRef.current = setTimeout(() => {
          const duration = Date.now() - startTime
          setTabBlurCount((prev) => prev + 1)
          logSecurityEvent({
            type: "tab_blur",
            timestamp: new Date(),
            duration,
            details: `Tab inactive for ${Math.round(duration / 1000)} seconds`,
          })
        }, 5000) // Flag after 5 seconds
      } else {
        if (tabBlurTimerRef.current) {
          clearTimeout(tabBlurTimerRef.current)
        }
      }
    }

    // Window focus/blur detection
    const handleWindowBlur = () => {
      const startTime = Date.now()
      setFocusLossCount((prev) => prev + 1)
      windowBlurTimerRef.current = setTimeout(() => {
        const duration = Date.now() - startTime
        setWindowBlurCount((prev) => prev + 1)
        logSecurityEvent({
          type: "window_blur",
          timestamp: new Date(),
          duration,
          details: `Window lost focus for ${Math.round(duration / 1000)} seconds`,
        })
      }, 3000) // Flag after 3 seconds
    }

    const handleWindowFocus = () => {
      if (windowBlurTimerRef.current) {
        clearTimeout(windowBlurTimerRef.current)
      }
    }

    // Fullscreen change detection
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement
      setIsFullscreen(isCurrentlyFullscreen)

      if (!isCurrentlyFullscreen && interviewStarted && !interviewCompleted) {
        logSecurityEvent({
          type: "fullscreen_exit",
          timestamp: new Date(),
          details: "User exited fullscreen mode",
        })
      }
    }

    // Disable right-click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      logSecurityEvent({
        type: "right_click",
        timestamp: new Date(),
        details: "Right-click attempted",
      })
    }

    // Disable prohibited keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      const prohibitedKeys = [
        { ctrl: true, key: "c" }, // Copy
        { ctrl: true, key: "v" }, // Paste
        { ctrl: true, key: "u" }, // View source
        { ctrl: true, key: "i" }, // Developer tools
        { ctrl: true, key: "s" }, // Save
        { ctrl: true, key: "a" }, // Select all
        { ctrl: true, key: "f" }, // Find
        { ctrl: true, key: "h" }, // History
        { ctrl: true, key: "j" }, // Downloads
        { ctrl: true, key: "k" }, // Search
        { ctrl: true, key: "l" }, // Address bar
        { ctrl: true, key: "n" }, // New window
        { ctrl: true, key: "r" }, // Refresh
        { ctrl: true, key: "t" }, // New tab
        { ctrl: true, key: "w" }, // Close tab
        { key: "F12" }, // Developer tools
        { alt: true, key: "Tab" }, // Alt+Tab
        { ctrl: true, shift: true, key: "I" }, // Developer tools
        { ctrl: true, shift: true, key: "J" }, // Console
        { ctrl: true, shift: true, key: "C" }, // Inspector
      ]

      const isProhibited = prohibitedKeys.some((combo) => {
        if (combo.ctrl && !e.ctrlKey) return false
        if (combo.alt && !e.altKey) return false
        if (combo.shift && !e.shiftKey) return false
        return combo.key.toLowerCase() === e.key.toLowerCase()
      })

      if (isProhibited) {
        e.preventDefault()
        logSecurityEvent({
          type: "prohibited_key",
          timestamp: new Date(),
          details: `Prohibited key combination: ${e.ctrlKey ? "Ctrl+" : ""}${e.altKey ? "Alt+" : ""}${e.shiftKey ? "Shift+" : ""}${e.key}`,
        })
      }
    }

    // Add event listeners
    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("blur", handleWindowBlur)
    window.addEventListener("focus", handleWindowFocus)
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    document.addEventListener("contextmenu", handleContextMenu)
    document.addEventListener("keydown", handleKeyDown)

    // Cleanup
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("blur", handleWindowBlur)
      window.removeEventListener("focus", handleWindowFocus)
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
      document.removeEventListener("contextmenu", handleContextMenu)
      document.removeEventListener("keydown", handleKeyDown)

      if (tabBlurTimerRef.current) clearTimeout(tabBlurTimerRef.current)
      if (windowBlurTimerRef.current) clearTimeout(windowBlurTimerRef.current)
    }
  }, [interviewStarted, interviewCompleted, logSecurityEvent])

  // Enter fullscreen mode
  const enterFullscreen = useCallback(() => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen()
    }
  }, [])

  // Improved audio queue processing
  const processAudioQueue = useCallback(async () => {
    if (audioProcessingRef.current || audioQueueRef.current.length === 0 || interviewCompleted) {
      return
    }

    audioProcessingRef.current = true
    setIsProcessingAudio(true)

    const nextAudio = audioQueueRef.current.shift()
    setAudioQueue([...audioQueueRef.current])

    if (nextAudio) {
      try {
        await speakWithEdgeTTS(nextAudio, "en", true)
      } catch (error) {
        console.error("Error processing audio queue:", error)
      }
    }

    audioProcessingRef.current = false
    setIsProcessingAudio(false)

    // Process next item in queue after a small delay
    if (audioQueueRef.current.length > 0 && !interviewCompleted) {
      setTimeout(() => processAudioQueue(), 200)
    }
  }, [interviewCompleted])

  // Enhanced speech recognition
  const initializeSpeechRecognition = useCallback(() => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      setCurrentState("error")
      return null
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = "en-US"
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setCurrentState("listening")
      isUserSpeakingRef.current = true
    }

    recognition.onresult = (event: any) => {
      let interimTranscript = ""
      let finalTranscript = ""

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " "
        } else {
          interimTranscript += transcript
        }
      }

      const displayTranscript = finalTranscript || interimTranscript
      setCurrentTranscript(displayTranscript)

      if (finalTranscript.trim()) {
        resetSilenceTimer(finalTranscript.trim())
      }
    }

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error)
      if (event.error !== "aborted" && event.error !== "no-speech") {
        setCurrentState("error")
      }
    }

    recognition.onend = () => {
      if (isUserSpeakingRef.current && currentState === "listening" && !interviewCompleted) {
        setTimeout(() => {
          if (currentState === "listening" && recognitionRef.current && !interviewCompleted) {
            try {
              recognitionRef.current.start()
            } catch (error) {
              console.error("Failed to restart recognition:", error)
            }
          }
        }, 100)
      }
    }

    return recognition
  }, [currentState, interviewCompleted])

  // Enhanced silence detection
  const resetSilenceTimer = useCallback((transcript: string) => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
    }

    // Dynamic timeout based on transcript length
    const baseTimeout = 3000 // 3 seconds base
    const lengthMultiplier = Math.min(transcript.length / 50, 3) // Up to 3x for long sentences
    const dynamicTimeout = baseTimeout + lengthMultiplier * 1000

    silenceTimerRef.current = setTimeout(() => {
      if (transcript && transcript.length > 5) {
        handleSubmitTranscript(transcript)
      }
    }, dynamicTimeout)
  }, [])

  // WORKING Edge TTS (simplified but robust)
  const speakWithEdgeTTS = useCallback(
    async (text: string, lang: "en" | "ur" = "en", skipQueue = false) => {
      if (!isAudioEnabled || interviewCompleted) return

      if (!skipQueue) {
        audioQueueRef.current.push(text)
        setAudioQueue([...audioQueueRef.current])
        if (!audioProcessingRef.current) {
          processAudioQueue()
        }
        return
      }

      try {
        // Stop any current audio
        stopCurrentAudio()

        // Small delay to ensure cleanup
        await new Promise((resolve) => setTimeout(resolve, 100))

        setCurrentState("speaking")
        console.log("Starting Edge TTS request...")

        const response = await fetch("http://127.0.0.1:8000/speak", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text,
            lang,
            voice_type: "andrew",
          }),
        })

        if (!response.ok) {
          throw new Error(`Edge TTS failed: ${response.status}`)
        }

        const blob = await response.blob()
        if (blob.size === 0) {
          throw new Error("Received empty audio blob")
        }

        console.log("Audio blob received, creating audio element...")

        const audioUrl = URL.createObjectURL(blob)
        const audio = new Audio(audioUrl)

        // Store reference
        currentAudioRef.current = audio

        // Simple promise-based playback
        await new Promise<void>((resolve, reject) => {
          audio.onended = () => {
            console.log("Audio ended successfully")
            URL.revokeObjectURL(audioUrl)
            if (currentAudioRef.current === audio) {
              currentAudioRef.current = null
            }
            setCurrentState("idle")
            resolve()
          }

          audio.onerror = (error) => {
            console.error("Audio error:", error)
            URL.revokeObjectURL(audioUrl)
            if (currentAudioRef.current === audio) {
              currentAudioRef.current = null
            }
            reject(error)
          }

          // Start playback
          audio.play().catch(reject)
        })

        // Check for interview completion
        if (
          text.toLowerCase().includes("this completes our technical interview") ||
          text.toLowerCase().includes("thank you for your time")
        ) {
          setTimeout(() => completeInterview(), 2000)
          return
        }

        // Auto-start listening
        if (interviewStarted && !interviewCompleted) {
          setTimeout(startListening, 500)
        }
      } catch (error) {
        console.error("Edge TTS error:", error)
        setCurrentState("error")
        if (currentAudioRef.current) {
          currentAudioRef.current = null
        }
      }
    },
    [isAudioEnabled, interviewStarted, interviewCompleted, stopCurrentAudio, processAudioQueue, completeInterview],
  )

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      isUserSpeakingRef.current = false
      recognitionRef.current.stop()
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
    }
    setCurrentTranscript("")
    if (currentState === "listening") {
      setCurrentState("idle")
    }
  }, [currentState])

  // Enhanced transcript submission
  const handleSubmitTranscript = useCallback(
    async (transcript: string) => {
      if (!transcript.trim() || transcript.length < 3 || interviewCompleted) return

      stopListening()
      setCurrentTranscript("")
      setCurrentState("processing")

      const userMessage: ChatMessage = {
        role: "user",
        content: transcript.trim(),
        timestamp: new Date(),
      }

      const updatedChat = [...chatHistory, userMessage]
      setChatHistory(updatedChat)

      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPEN_ROUTER_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "mistralai/mixtral-8x7b-instruct",
            messages: updatedChat.map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
            max_tokens: 100,
            temperature: 0.6,
            top_p: 0.9,
          }),
        })

        if (!response.ok) throw new Error("API request failed")

        const data = await response.json()
        const aiMessage = data.choices?.[0]?.message?.content || "Could you please repeat that?"

        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: aiMessage,
          timestamp: new Date(),
        }

        const finalChat = [...updatedChat, assistantMessage]
        setChatHistory(finalChat)

        // Count questions
        if (aiMessage.includes("?")) {
          setQuestionCount((prev) => prev + 1)
        }

        await speakWithEdgeTTS(aiMessage, "en")
      } catch (error) {
        console.error("Error processing request:", error)
        setCurrentState("error")
        const errorMessage = "I'm having technical difficulties. Please try again."
        await speakWithEdgeTTS(errorMessage, "en")
      }
    },
    [chatHistory, speakWithEdgeTTS, stopListening, interviewCompleted],
  )

  // Enhanced listening controls
  const startListening = useCallback(() => {
    if (interviewCompleted) return

    if (currentState === "speaking") {
      stopCurrentAudio()
    }

    if (!recognitionRef.current) {
      recognitionRef.current = initializeSpeechRecognition()
    }

    if (recognitionRef.current && currentState !== "listening") {
      try {
        recognitionRef.current.start()
        isUserSpeakingRef.current = true
      } catch (error) {
        console.error("Failed to start recognition:", error)
        setCurrentState("error")
      }
    }
  }, [currentState, initializeSpeechRecognition, stopCurrentAudio, interviewCompleted])

  // Start interview with security features (no video/camera)
  const startInterview = useCallback(async () => {
    // Enter fullscreen mode for security
    enterFullscreen()

    setInterviewStarted(true)
    setInterviewStartTime(new Date())
    const welcomeMessage = "Hello, I Hope you are doing fine! so let's start your Interview of " + userTechnology

    const assistantMessage: ChatMessage = {
      role: "assistant",
      content: welcomeMessage,
      timestamp: new Date(),
    }

    setChatHistory((prev) => [...prev, assistantMessage])
    setQuestionCount(1)
    await speakWithEdgeTTS(welcomeMessage, "en")
  }, [speakWithEdgeTTS, enterFullscreen, userTechnology])

  // Toggle audio
  const toggleAudio = useCallback(() => {
    setIsAudioEnabled(!isAudioEnabled)
    if (isAudioEnabled && currentState === "speaking") {
      stopCurrentAudio()
    }
  }, [isAudioEnabled, currentState, stopCurrentAudio])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current)
      }
      stopCurrentAudio()
    }
  }, [stopCurrentAudio])

  const getStateColor = (state: InterviewState) => {
    switch (state) {
      case "listening":
        return "from-green-400 to-green-600"
      case "processing":
        return "from-yellow-400 to-yellow-600"
      case "speaking":
        return "from-blue-400 to-blue-600"
      case "error":
        return "from-red-400 to-red-600"
      case "security_warning":
        return "from-orange-400 to-orange-600"
      case "completed":
        return "from-purple-400 to-purple-600"
      default:
        return "from-purple-500 to-pink-500"
    }
  }

  const getStateText = (state: InterviewState) => {
    switch (state) {
      case "listening":
        return "Listening... (speak naturally)"
      case "processing":
        return "Processing your response..."
      case "speaking":
        return "Interviewer speaking..."
      case "error":
        return "Audio system error - check backend"
      case "security_warning":
        return "Security violation detected"
      case "completed":
        return "Interview completed - View report"
      default:
        return interviewStarted ? "Tap to speak" : "Start Secure Interview"
    }
  }

  const getSecurityScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  // Enhanced Report component with security analysis
  const InterviewReportComponent = ({ report }: { report: InterviewReport }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <FileText className="w-6 h-6 mr-2" />
              Technical Interview Report
            </h2>
            <Button variant="outline" onClick={() => setShowReport(false)} className="text-gray-600">
              Close
            </Button>
          </div>

          {/* Candidate Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card className="p-4">
              <h3 className="font-semibold text-lg mb-3 text-gray-800">Candidate Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Technology:</span>
                  <span className="font-medium">{report.candidate.technology}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Experience Level:</span>
                  <span className="font-medium">{report.candidate.experienceLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{report.candidate.interviewDuration} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Questions Asked:</span>
                  <span className="font-medium">{report.candidate.totalQuestions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Responses Given:</span>
                  <span className="font-medium">{report.candidate.totalResponses}</span>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold text-lg mb-3 text-gray-800">Security Assessment</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Security Score:</span>
                  <span className={`font-medium ${getSecurityScoreColor(report.security.securityScore)}`}>
                    {report.security.securityScore}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Violations:</span>
                  <span className="font-medium">{report.security.violations.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tab Switches:</span>
                  <span className="font-medium">{tabBlurCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Focus Loss:</span>
                  <span className="font-medium">{focusLossCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trustworthiness:</span>
                  <span className="font-medium">{report.security.trustworthiness}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Performance Scores */}
          <Card className="p-4 mb-6">
            <h3 className="font-semibold text-lg mb-4 text-gray-800">Performance Assessment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{report.performance.technicalKnowledge}</div>
                <div className="text-sm text-gray-600">Technical Knowledge</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{report.performance.communicationSkills}</div>
                <div className="text-sm text-gray-600">Communication</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{report.performance.problemSolvingAbility}</div>
                <div className="text-sm text-gray-600">Problem Solving</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">{report.performance.overallScore}</div>
                <div className="text-sm text-gray-600">Overall Score</div>
                <div className="text-lg font-semibold text-indigo-600">{report.performance.grade}</div>
              </div>
            </div>
          </Card>

          {/* Strengths and Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card className="p-4">
              <h3 className="font-semibold text-lg mb-3 text-green-700 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Strengths
              </h3>
              <ul className="space-y-2">
                {report.performance.strengths.map((strength, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    {strength}
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold text-lg mb-3 text-red-700 flex items-center">
                <XCircle className="w-5 h-5 mr-2" />
                Areas for Improvement
              </h3>
              <ul className="space-y-2">
                {report.performance.weaknesses.map((weakness, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    {weakness}
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Behavior Analysis */}
          <Card className="p-4 mb-6">
            <h3 className="font-semibold text-lg mb-3 text-gray-800">Behavior Analysis</h3>
            <p className="text-gray-700 leading-relaxed">{report.security.behaviorAnalysis}</p>
          </Card>

          {/* Recommendations */}
          <Card className="p-4 mb-6">
            <h3 className="font-semibold text-lg mb-3 text-gray-800">Recommendations</h3>
            <ul className="space-y-2">
              {report.recommendations.map((recommendation, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-start">
                  <span className="text-blue-500 mr-2">→</span>
                  {recommendation}
                </li>
              ))}
            </ul>
          </Card>

          {/* Summary */}
          <Card className="p-4 mb-6">
            <h3 className="font-semibold text-lg mb-3 text-gray-800">Interview Summary</h3>
            <p className="text-gray-700 leading-relaxed">{report.summary}</p>
          </Card>

          {/* Security Violations (if any) */}
          {report.security.violations.length > 0 && (
            <Card className="p-4">
              <h3 className="font-semibold text-lg mb-3 text-red-700">Security Violations</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {report.security.violations.map((violation, index) => (
                  <div key={index} className="text-sm text-gray-700 p-2 bg-red-50 rounded">
                    <div className="flex justify-between">
                      <span className="font-medium capitalize">{violation.type.replace("_", " ")}</span>
                      <span className="text-xs text-gray-500">{violation.timestamp.toLocaleTimeString()}</span>
                    </div>
                    {violation.details && <div className="text-xs text-gray-600 mt-1">{violation.details}</div>}
                  </div>
                ))}
              </div>
            </Card>
          )}

          <div className="flex gap-2 flex-wrap">
            {captureList.map((item, index) => (
              <Card key={index} className="rounded-lg">
                <img src={item} className="h-[100px] w-[100px] object-cover" alt={`capture-${index}`} />
              </Card>
            ))}
          </div>

          <div className="text-center text-xs text-gray-500 mt-6">
            Report generated on {report.timestamp.toLocaleString()}
          </div>
        </div>
      </Card>
    </div>
  )


  async function setupCamera() {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video = document.createElement("video");
      video.srcObject = stream;
      await video.play();
    } catch (error) {
      console.error("Failed to setup camera:", error);
    }
  }

  async function takePhoto() {
    if (!video) return;

    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    if (!canvas) {
      console.error("Canvas element not found");
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      console.error("Failed to get canvas context");
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to Base64 or Blob
    const imageData = canvas.toDataURL("image/jpeg");
    setCaptureList(prev => [...prev, imageData]);

    console.log("Photo taken");
  }

  useEffect(() => {
    setupCamera();
    // Take photos at random intervals
    setInterval(() => {
      const randomChance = Math.random();
      if (isUserSpeakingRef) {
        if (captureCount <= 8) {
          if (randomChance < 0.2) { // 20% chance every 10s
            takePhoto();
            setCaptureCount(prev => prev + 1)
          }
        }
      }
    }, 10000);
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col items-center justify-center p-6 relative">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-blue-50 via-indigo-50 to-white opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-indigo-100/20" />
      </div>

      {/* Security Warning */}
      {showSecurityWarning && (
        <Alert className="fixed top-25 left-1/2 transform -translate-x-1/2 z-40 bg-orange-50 border-orange-200">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-orange-800">
            Security violation detected! Please follow interview guidelines.
          </AlertDescription>
        </Alert>
      )}

      {/* Enhanced Controls with Security Info */}
      <div className="fixed top-20 right-4 flex gap-2 z-10">
        <Badge variant="outline" className={`bg-white/80`}>
          <Camera className="w-3 h-3 mr-1" />
          Capture Count: {captureCount}
        </Badge>
        <Badge variant="outline" className={`${getSecurityScoreColor(securityScore)} bg-white/80`}>
          <Shield className="w-3 h-3 mr-1" />
          Security: {securityScore}%
        </Badge>
        <Button variant="outline" size="sm" onClick={toggleAudio} className="bg-white/80 backdrop-blur-sm">
          {isAudioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setChatVisibility(!chatVisibility)}
          className="bg-white/80 backdrop-blur-sm"
        >
          {chatVisibility ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </Button>
        {interviewCompleted && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowReport(true)}
            className="bg-white/80 backdrop-blur-sm"
          >
            <FileText className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Security Status Panel */}
      <div className="fixed top-20 left-4 flex flex-col gap-2 z-10">
        {isFullscreen && (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Fullscreen: Active
          </Badge>
        )}
        {(tabBlurCount > 0 || windowBlurCount > 0) && (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            Focus Lost: {focusLossCount}x
          </Badge>
        )}
        {interviewStarted && !interviewCompleted && (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Questions: {questionCount}
          </Badge>
        )}
      </div>

      {/* Main Interface */}
      <div className="flex flex-col items-center space-y-6">
        {/* Enhanced Status Badge */}
        <Badge variant="secondary" className="px-6 py-3 text-sm font-medium bg-white/90 backdrop-blur-sm shadow-lg">
          {getStateText(currentState)}
        </Badge>

        {/* Current Transcript with better styling */}
        {currentTranscript && !interviewCompleted && (
          <Card className="p-4 max-w-lg bg-white/90 backdrop-blur-sm shadow-lg border-l-4 border-blue-500">
            <p className="text-sm text-gray-700 italic font-medium">"{currentTranscript}"</p>
          </Card>
        )}

        {/* Enhanced Main Button */}
        <div className="relative">
          <button
            onClick={
              interviewCompleted
                ? () => setShowReport(true)
                : interviewStarted
                  ? currentState === "listening"
                    ? stopListening
                    : startListening
                  : startInterview
            }
            disabled={currentState === "processing"}
            className={`w-36 h-36 rounded-full bg-gradient-to-br ${getStateColor(currentState)} shadow-2xl flex items-center justify-center text-white text-4xl transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed ${currentState === "listening" ? "animate-pulse" : ""
              }`}
          >
            {interviewCompleted ? (
              <FileText className="w-10 h-10" />
            ) : currentState === "listening" ? (
              <Square className="w-10 h-10" />
            ) : currentState === "speaking" ? (
              <Volume2 className="w-10 h-10" />
            ) : currentState === "processing" ? (
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
            ) : (
              <Mic className="w-10 h-10" />
            )}
          </button>

          {/* Enhanced pulse animation */}
          {currentState === "listening" && (
            <>
              <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20"></div>
              <div className="absolute inset-0 rounded-full bg-green-300 animate-pulse opacity-30"></div>
            </>
          )}
        </div>

        {/* Enhanced Action Buttons */}
        {interviewStarted && !interviewCompleted && (
          <div className="flex gap-3">
            {currentState === "speaking" && (
              <Button
                onClick={stopCurrentAudio}
                variant="outline"
                size="sm"
                className="bg-white/90 backdrop-blur-sm shadow-lg"
              >
                <Square className="w-4 h-4 mr-2" />
                Stop Speaking
              </Button>
            )}
            {currentState === "error" && (
              <Button
                onClick={() => {
                  setCurrentState("idle")
                  if (interviewStarted) {
                    setTimeout(startListening, 500)
                  }
                }}
                variant="outline"
                size="sm"
                className="bg-white/90 backdrop-blur-sm shadow-lg"
              >
                Retry
              </Button>
            )}
            <Button
              onClick={completeInterview}
              variant="outline"
              size="sm"
              className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
            >
              End Interview
            </Button>
          </div>
        )}

        {/* Audio Queue Indicator */}
        {audioQueue.length > 0 && !interviewCompleted && (
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            Audio Queue: {audioQueue.length}
          </Badge>
        )}
      </div>

      {/* Enhanced Chat History */}
      {chatVisibility && !showReport && (
        <Card className="fixed bottom-4 left-4 right-4 max-h-96 overflow-y-auto bg-white/95 backdrop-blur-sm p-4 shadow-xl z-40">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-800">Interview Transcript</h3>
            <div className="flex gap-2">
              <Badge variant="secondary">{chatHistory.filter((msg) => msg.role !== "system").length} messages</Badge>
              <Badge variant="outline" className={getSecurityScoreColor(securityScore)}>
                Security: {securityScore}%
              </Badge>
            </div>
          </div>
          <div className="space-y-3">
            {chatHistory
              .filter((msg) => msg.role !== "system")
              .map((msg, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg transition-all ${msg.role === "user"
                    ? "bg-blue-100 ml-8 border-l-4 border-blue-500"
                    : "bg-gray-100 mr-8 border-l-4 border-gray-500"
                    }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-sm capitalize text-gray-600">
                      {msg.role === "user" ? "You" : "Interviewer"}
                    </span>
                    <span className="text-xs text-gray-400">{msg.timestamp.toLocaleTimeString()}</span>
                  </div>
                  <p className="text-sm text-gray-800">{msg.content}</p>
                </div>
              ))}
          </div>
        </Card>
      )}

      {/* Interview Report */}
      {showReport && interviewReport && <InterviewReportComponent report={interviewReport} />}

      {/* Enhanced Instructions */}
      {!interviewStarted && (
        <Card className="mt-8 p-6 max-w-lg bg-white/90 backdrop-blur-sm shadow-xl">
          <h3 className="font-semibold mb-3 text-gray-800 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Secure Technical Interview
          </h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Interview will be conducted in fullscreen mode</li>
            <li>• Tab switching and shortcuts are monitored</li>
            <li>• Right-click and copy/paste are disabled</li>
            <li>• Focus changes are tracked for security</li>
            <li>• Comprehensive report generated at completion</li>
            <li>• Interview automatically ends after 8-12 questions</li>
          </ul>
        </Card>
      )}

      {/* Side for Displaying and capturing users face */}
      <canvas id="canvas" style={{ display: "none" }}></canvas>
    </div>
  )
}
