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
  Play,
  Pause,
  Info,
  Clock,
  Users,
  Lock,
  Monitor,
  Headphones,
} from "lucide-react"
import { useEffect, useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import SystemPrompt from "@/constants/system-prompts"
import GeminiService from "@/services/gemini.service"

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
  const userTechnology = "HTML"
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
  const [showInstructions, setShowInstructions] = useState(true)

  // Security state
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([])
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [tabBlurCount, setTabBlurCount] = useState(0)
  const [windowBlurCount, setWindowBlurCount] = useState(0)
  const [securityScore, setSecurityScore] = useState(100)
  const [showSecurityWarning, setShowSecurityWarning] = useState(false)
  const [focusLossCount, setFocusLossCount] = useState(0)

  // Enhanced speech recognition state
  const [speechBuffer, setSpeechBuffer] = useState("")
  const [pauseCount, setPauseCount] = useState(0)
  const [isUserCurrentlySpeaking, setIsUserCurrentlySpeaking] = useState(false)

  // Face capture state
  const [captureCount, setCaptureCount] = useState<number>(0)
  const [captureList, setCaptureList] = useState<
    Array<{
      image: string
      timestamp: Date
      timing: "start" | "middle" | "end"
      index: number
    }>
  >([])
  const [cameraInitialized, setCameraInitialized] = useState(false)
  const [nextCaptureTime, setNextCaptureTime] = useState<number | null>(null)

  // Refs
  const recognitionRef = useRef<any>(null)
  const currentAudioRef = useRef<HTMLAudioElement | null>(null)
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null)
  const isUserSpeakingRef = useRef(false)
  const audioQueueRef = useRef<string[]>([])
  const tabBlurTimerRef = useRef<NodeJS.Timeout | null>(null)
  const windowBlurTimerRef = useRef<NodeJS.Timeout | null>(null)
  const audioProcessingRef = useRef(false)
  const streamRef = useRef<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const speechBufferRef = useRef("")
  const captureIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const systemPrompt = SystemPrompt(userTechnology, userExperienceLevel)

  // Initialize system prompt
  useEffect(() => {
    setChatHistory([
      {
        role: "system",
        content: systemPrompt,
        timestamp: new Date(),
      },
    ])
  }, [userTechnology, userExperienceLevel])

  // Enhanced camera setup - only initialize when interview starts
  const setupCamera = useCallback(async () => {
    if (cameraInitialized || !interviewStarted) return

    try {
      console.log("Setting up camera...")
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
      })

      streamRef.current = stream

      // Create video element if it doesn't exist
      if (!videoRef.current) {
        videoRef.current = document.createElement("video")
        videoRef.current.autoplay = true
        videoRef.current.muted = true
        videoRef.current.playsInline = true
      }

      videoRef.current.srcObject = stream

      // Wait for video to be ready
      await new Promise((resolve) => {
        if (videoRef.current) {
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().then(resolve).catch(console.error)
          }
        }
      })

      setCameraInitialized(true)
      console.log("Camera setup completed")

      // Take first photo after a short delay
      setTimeout(() => takePhoto("start"), 2000)
    } catch (error) {
      console.error("Failed to setup camera:", error)
      // Continue interview even if camera fails
    }
  }, [cameraInitialized, interviewStarted])

  // Enhanced photo capture with better error handling
  const takePhoto = useCallback(
    (timing: "start" | "middle" | "end") => {
      if (!videoRef.current || !cameraInitialized) {
        console.log("Camera not ready for photo capture")
        return
      }

      try {
        // Create canvas if it doesn't exist
        if (!canvasRef.current) {
          canvasRef.current = document.createElement("canvas")
        }

        const canvas = canvasRef.current
        const context = canvas.getContext("2d")
        const video = videoRef.current

        if (!context || !video.videoWidth || !video.videoHeight) {
          console.error("Video not ready or context unavailable")
          return
        }

        // Set canvas dimensions to match video
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        // Draw the current video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        // Convert to base64 image
        const imageData = canvas.toDataURL("image/jpeg", 0.8)

        // Add timestamp and timing info
        const photoData = {
          image: imageData,
          timestamp: new Date(),
          timing: timing,
          index: captureCount + 1,
        }

        setCaptureList((prev) => [...prev, photoData])
        setCaptureCount((prev) => prev + 1)

        console.log(`Photo captured at ${timing} - Total: ${captureCount + 1}`)
      } catch (error) {
        console.error("Error taking photo:", error)
      }
    },
    [cameraInitialized, captureCount],
  )

  // Schedule random middle captures
  const scheduleRandomCapture = useCallback(() => {
    if (!interviewStarted || interviewCompleted || captureCount >= 6) return

    // Random interval between 30-90 seconds
    const randomInterval = Math.random() * 60000 + 30000
    setNextCaptureTime(Date.now() + randomInterval)

    if (captureIntervalRef.current) {
      clearTimeout(captureIntervalRef.current)
    }

    captureIntervalRef.current = setTimeout(() => {
      if (interviewStarted && !interviewCompleted && captureCount < 6) {
        takePhoto("middle")
        scheduleRandomCapture() // Schedule next random capture
      }
    }, randomInterval)
  }, [interviewStarted, interviewCompleted, captureCount, takePhoto])

  // Cleanup camera
  const cleanupCamera = useCallback(() => {
    console.log("Cleaning up camera...")

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
      videoRef.current = null
    }

    if (captureIntervalRef.current) {
      clearTimeout(captureIntervalRef.current)
      captureIntervalRef.current = null
    }

    setCameraInitialized(false)
    setNextCaptureTime(null)
  }, [])

  // Enhanced speech recognition with better pause handling
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
      console.log("Speech recognition started")
      setCurrentState("listening")
      setIsUserCurrentlySpeaking(false)
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

      // Handle speech detection
      if (finalTranscript.trim()) {
        setIsUserCurrentlySpeaking(true)
        speechBufferRef.current += finalTranscript.trim() + " "
        setSpeechBuffer(speechBufferRef.current)
        resetPauseTimer()
      } else if (interimTranscript.trim()) {
        setIsUserCurrentlySpeaking(true)
        resetPauseTimer()
      }
    }

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error)
      if (event.error !== "aborted" && event.error !== "no-speech") {
        setCurrentState("error")
      }
    }

    recognition.onend = () => {
      console.log("Speech recognition ended")
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

  // Enhanced pause detection with 3-4 second delay
  const resetPauseTimer = useCallback(() => {
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current)
    }

    // Reset pause count when user speaks
    setPauseCount(0)
    setIsUserCurrentlySpeaking(true)

    // Set 4-second pause timer
    pauseTimerRef.current = setTimeout(() => {
      setIsUserCurrentlySpeaking(false)

      // Start counting pause seconds
      let pauseSeconds = 0
      const pauseInterval = setInterval(() => {
        pauseSeconds++
        setPauseCount(pauseSeconds)

        // After 4 seconds of silence, process the speech
        if (pauseSeconds >= 4) {
          clearInterval(pauseInterval)

          if (speechBufferRef.current.trim().length > 5) {
            const finalSpeech = speechBufferRef.current.trim()
            console.log("Processing speech after pause:", finalSpeech)

            // Clear buffer and process
            speechBufferRef.current = ""
            setSpeechBuffer("")
            setPauseCount(0)
            setCurrentTranscript("")

            handleSubmitTranscript(finalSpeech)
          }
        }
      }, 1000)

      // Store interval reference for cleanup
      if (silenceTimerRef.current) {
        clearInterval(silenceTimerRef.current as any)
      }
      silenceTimerRef.current = pauseInterval as any
    }, 4000)
  }, [])

  // Enhanced audio management
  const stopCurrentAudio = useCallback(() => {
    console.log("Stopping current audio...")

    if (currentAudioRef.current) {
      try {
        currentAudioRef.current.pause()
        currentAudioRef.current.currentTime = 0

        const audio = currentAudioRef.current
        audio.onended = null
        audio.onerror = null
        audio.onloadstart = null
        audio.oncanplay = null

        if (audio.src && audio.src.startsWith("blob:")) {
          URL.revokeObjectURL(audio.src)
        }

        currentAudioRef.current = null
      } catch (error) {
        console.log("Error stopping audio:", error)
      }
    }

    audioProcessingRef.current = false
    setIsProcessingAudio(false)
    audioQueueRef.current = []
    setAudioQueue([])
  }, [])

  // Process audio queue
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

    if (audioQueueRef.current.length > 0 && !interviewCompleted) {
      setTimeout(() => processAudioQueue(), 200)
    }
  }, [interviewCompleted])

  // Enhanced TTS with proper audio management
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
        stopCurrentAudio()
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

        const audioUrl = URL.createObjectURL(blob)
        const audio = new Audio(audioUrl)
        currentAudioRef.current = audio

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

          audio.play().catch(reject)
        })

        if (
          text.toLowerCase().includes("this completes our technical interview") ||
          text.toLowerCase().includes("thank you for your time")
        ) {
          setTimeout(() => completeInterview(), 2000)
          return
        }

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
    [isAudioEnabled, interviewStarted, interviewCompleted, stopCurrentAudio, processAudioQueue],
  )

  // Start/stop listening controls
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
        // Clear any existing speech buffer
        speechBufferRef.current = ""
        setSpeechBuffer("")
        setPauseCount(0)

        recognitionRef.current.start()
        isUserSpeakingRef.current = true
      } catch (error) {
        console.error("Failed to start recognition:", error)
        setCurrentState("error")
      }
    }
  }, [currentState, initializeSpeechRecognition, stopCurrentAudio, interviewCompleted])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      isUserSpeakingRef.current = false
      recognitionRef.current.stop()
    }

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
      clearInterval(silenceTimerRef.current as any)
    }

    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current)
    }

    // Clear speech buffer
    speechBufferRef.current = ""
    setSpeechBuffer("")
    setCurrentTranscript("")
    setPauseCount(0)
    setIsUserCurrentlySpeaking(false)

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
        // Prepare conversation for Gemini with proper system context
        const conversationHistory = updatedChat.filter((msg) => msg.role !== "system")

        // Create a comprehensive context that includes the system prompt and conversation
        const contextualPrompt = `${systemPrompt}

CURRENT CONVERSATION CONTEXT:
${conversationHistory.map((msg, index) => `${index + 1}. ${msg.role.toUpperCase()}: ${msg.content}`).join("\n")}

INSTRUCTIONS FOR NEXT RESPONSE:
- You are continuing an ongoing interview, NOT starting a new one
- Review the conversation above to understand what has been discussed
- Ask the next logical question based on the candidate's previous responses
- Do not repeat questions or restart the interview
- Build upon previous answers and dive deeper into topics
- If this is question ${questionCount + 1}, make it appropriately challenging
- Keep the conversation flowing naturally

Please provide your next interview question or response:`

        // Send only the current user message with full context
        const geminiFormatted = [
          {
            role: "user",
            parts: [{ text: contextualPrompt }],
          },
        ]

        const aiMessage = await GeminiService.GeminiGenerateText(geminiFormatted, "")

        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: aiMessage,
          timestamp: new Date(),
        }

        const finalChat = [...updatedChat, assistantMessage]
        setChatHistory(finalChat)

        // Count questions more accurately
        if (
          aiMessage.includes("?") &&
          !aiMessage.toLowerCase().includes("hello") &&
          !aiMessage.toLowerCase().includes("thanks for coming")
        ) {
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
    [chatHistory, speakWithEdgeTTS, stopListening, interviewCompleted, systemPrompt, questionCount],
  )

  // Security event logger
  const logSecurityEvent = useCallback((event: SecurityEvent) => {
    setSecurityEvents((prev) => [...prev, event])

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

  // Security monitoring
  useEffect(() => {
    if (interviewCompleted) return

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
        }, 5000)
      } else {
        if (tabBlurTimerRef.current) {
          clearTimeout(tabBlurTimerRef.current)
        }
      }
    }

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
      }, 3000)
    }

    const handleWindowFocus = () => {
      if (windowBlurTimerRef.current) {
        clearTimeout(windowBlurTimerRef.current)
      }
    }

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

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      logSecurityEvent({
        type: "right_click",
        timestamp: new Date(),
        details: "Right-click attempted",
      })
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      const prohibitedKeys = [
        { ctrl: true, key: "c" },
        { ctrl: true, key: "v" },
        { ctrl: true, key: "u" },
        { ctrl: true, key: "i" },
        { ctrl: true, key: "s" },
        { ctrl: true, key: "a" },
        { ctrl: true, key: "f" },
        { ctrl: true, key: "h" },
        { ctrl: true, key: "j" },
        { ctrl: true, key: "k" },
        { ctrl: true, key: "l" },
        { ctrl: true, key: "n" },
        { ctrl: true, key: "r" },
        { ctrl: true, key: "t" },
        { ctrl: true, key: "w" },
        { key: "F12" },
        { alt: true, key: "Tab" },
        { ctrl: true, shift: true, key: "I" },
        { ctrl: true, shift: true, key: "J" },
        { ctrl: true, shift: true, key: "C" },
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

    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("blur", handleWindowBlur)
    window.addEventListener("focus", handleWindowFocus)
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    document.addEventListener("contextmenu", handleContextMenu)
    document.addEventListener("keydown", handleKeyDown)

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
  }, [interviewStarted, interviewCompleted, logSecurityEvent, focusLossCount])

  // Enter fullscreen
  const enterFullscreen = useCallback(() => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen()
    }
  }, [])

  // Generate interview report
  const generateInterviewReport = useCallback(async (): Promise<InterviewReport> => {
    const interviewDuration = interviewStartTime ? Date.now() - interviewStartTime.getTime() : 0
    const userResponses = chatHistory.filter((msg) => msg.role === "user")
    const assistantMessages = chatHistory.filter((msg) => msg.role === "assistant")

    // Create detailed conversation analysis
    const conversationText = chatHistory
      .filter((msg) => msg.role !== "system")
      .map((msg, index) => `${index + 1}. ${msg.role.toUpperCase()}: ${msg.content}`)
      .join("\n")

    const analysisPrompt = `You are an expert technical interviewer analyzing a ${userTechnology} interview for a ${userExperienceLevel} level candidate.

INTERVIEW METRICS:
- Technology: ${userTechnology}
- Experience Level: ${userExperienceLevel}
- Duration: ${Math.round(interviewDuration / 60000)} minutes
- Questions Asked: ${questionCount}
- User Responses: ${userResponses.length}
- Response Rate: ${userResponses.length > 0 ? ((userResponses.length / questionCount) * 100).toFixed(1) : 0}%

SECURITY ASSESSMENT:
- Security Score: ${securityScore}%
- Tab Switches: ${tabBlurCount}
- Window Focus Loss: ${windowBlurCount}
- Total Security Events: ${securityEvents.length}
- Photos Captured: ${captureList.length}

COMPLETE INTERVIEW CONVERSATION:
${conversationText}

IMPORTANT: Respond with ONLY a valid JSON object, no additional text or formatting. Use this exact structure:

{
  "strengths": ["specific strength 1", "specific strength 2", "specific strength 3"],
  "weaknesses": ["specific weakness 1", "specific weakness 2", "specific weakness 3"],
  "technicalKnowledge": 75,
  "communicationSkills": 80,
  "problemSolvingAbility": 70,
  "overallScore": 75,
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"],
  "summary": "Detailed summary of performance",
  "behaviorAnalysis": "Analysis of candidate behavior and professionalism"
}

Analyze the actual conversation and provide realistic scores (0-100) for a ${userExperienceLevel} level candidate.`

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
          max_tokens: 1200,
          temperature: 0.2,
        }),
      })

      const data = await response.json()
      let analysisResult: any = {}

      // Enhanced parsing with better error handling
      try {
        const content = data.choices?.[0]?.message?.content || "{}"
        console.log("Raw AI Response:", content) // Debug log

        // Try to extract JSON from the response if it's wrapped in text
        const jsonMatch = content.match(/\{[\s\S]*\}/)
        const jsonString = jsonMatch ? jsonMatch[0] : content

        analysisResult = JSON.parse(jsonString)
        console.log("Parsed Analysis Result:", analysisResult) // Debug log
      } catch (parseError) {
        console.error("Failed to parse AI analysis:", parseError)
        console.log("Raw content that failed to parse:", data.choices?.[0]?.message?.content)

        // Use fallback analysis
        const baseScore = 50
        analysisResult = {
          strengths: [
            "Participated actively in the interview",
            "Attempted to answer technical questions",
            "Maintained engagement throughout",
          ],
          weaknesses: [
            "Could provide more detailed technical explanations",
            "Some concepts need deeper understanding",
            "Practice with more complex scenarios recommended",
          ],
          technicalKnowledge: baseScore,
          communicationSkills: Math.min(baseScore + 5, 90),
          problemSolvingAbility: Math.max(baseScore - 5, 30),
          overallScore: baseScore,
          recommendations: [
            `Deepen understanding of ${userTechnology} core concepts`,
            "Practice explaining technical concepts more clearly",
            "Work on practical coding exercises and examples",
          ],
          summary: `Candidate demonstrated ${userExperienceLevel} level understanding of ${userTechnology} concepts.`,
          behaviorAnalysis: `Candidate maintained focus during the interview with ${securityEvents.length} security events recorded.`,
        }
      }

      // Validate and provide defaults for all required fields
      const baseScore = 50
      const safeAnalysisResult = {
        strengths: Array.isArray(analysisResult.strengths)
          ? analysisResult.strengths
          : [
            "Participated actively in the interview",
            "Attempted to answer technical questions",
            "Maintained engagement throughout",
          ],
        weaknesses: Array.isArray(analysisResult.weaknesses)
          ? analysisResult.weaknesses
          : [
            "Could provide more detailed technical explanations",
            "Some concepts need deeper understanding",
            "Practice with more complex scenarios recommended",
          ],
        technicalKnowledge:
          typeof analysisResult.technicalKnowledge === "number" ? analysisResult.technicalKnowledge : baseScore,
        communicationSkills:
          typeof analysisResult.communicationSkills === "number"
            ? analysisResult.communicationSkills
            : Math.min(baseScore + 5, 90),
        problemSolvingAbility:
          typeof analysisResult.problemSolvingAbility === "number"
            ? analysisResult.problemSolvingAbility
            : Math.max(baseScore - 5, 30),
        overallScore: typeof analysisResult.overallScore === "number" ? analysisResult.overallScore : baseScore,
        recommendations: Array.isArray(analysisResult.recommendations)
          ? analysisResult.recommendations
          : [
            `Deepen understanding of ${userTechnology} core concepts`,
            "Practice explaining technical concepts more clearly",
            "Work on practical coding exercises and examples",
            "Review fundamental principles and best practices",
          ],
        summary:
          typeof analysisResult.summary === "string"
            ? analysisResult.summary
            : `Candidate demonstrated ${userExperienceLevel} level understanding of ${userTechnology} concepts. Completed ${userResponses.length} responses across ${questionCount} questions in ${Math.round(interviewDuration / 60000)} minutes. ${securityScore >= 80 ? "Maintained excellent interview integrity." : "Some focus issues noted during the session."}`,
        behaviorAnalysis:
          typeof analysisResult.behaviorAnalysis === "string"
            ? analysisResult.behaviorAnalysis
            : `Candidate maintained ${securityScore >= 80 ? "excellent" : securityScore >= 60 ? "good" : "adequate"} focus during the interview with ${securityEvents.length} security events recorded.`,
      }

      const getGrade = (score: number) => {
        if (score >= 90) return "A+"
        if (score >= 80) return "B+"
        if (score >= 70) return "B"
        if (score >= 60) return "C+"
        return "C"
      }

      const getTrustworthiness = (score: number) => {
        if (score >= 80) return "Trustworthy"
        return "Questionable"
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
          strengths: safeAnalysisResult.strengths,
          weaknesses: safeAnalysisResult.weaknesses,
          technicalKnowledge: safeAnalysisResult.technicalKnowledge,
          communicationSkills: safeAnalysisResult.communicationSkills,
          problemSolvingAbility: safeAnalysisResult.problemSolvingAbility,
          overallScore: safeAnalysisResult.overallScore,
          grade: getGrade(safeAnalysisResult.overallScore),
        },
        security: {
          securityScore,
          violations: securityEvents,
          trustworthiness: getTrustworthiness(securityScore),
          behaviorAnalysis: safeAnalysisResult.behaviorAnalysis,
        },
        recommendations: safeAnalysisResult.recommendations,
        summary: safeAnalysisResult.summary,
        timestamp: new Date(),
      }

      return report
    } catch (error) {
      console.error("Failed to generate AI analysis:", error)

      // Enhanced fallback report
      const fallbackScore = Math.max(40, Math.min(85, 55 + userResponses.length * 4 - securityEvents.length * 2))

      return {
        candidate: {
          technology: userTechnology,
          experienceLevel: userExperienceLevel,
          interviewDuration: Math.round(interviewDuration / 60000),
          totalQuestions: questionCount,
          totalResponses: userResponses.length,
        },
        performance: {
          strengths: [
            "Completed the interview process",
            "Engaged with technical questions",
            "Demonstrated basic understanding",
          ],
          weaknesses: [
            "Technical depth could be improved",
            "More specific examples needed",
            "Communication clarity can be enhanced",
          ],
          technicalKnowledge: fallbackScore,
          communicationSkills: Math.min(fallbackScore + 8, 88),
          problemSolvingAbility: Math.max(fallbackScore - 3, 35),
          overallScore: fallbackScore,
          grade: fallbackScore >= 80 ? "B+" : fallbackScore >= 70 ? "B" : fallbackScore >= 60 ? "C+" : "C",
        },
        security: {
          securityScore,
          violations: securityEvents,
          trustworthiness: securityScore >= 80 ? "Trustworthy" : "Moderately Trustworthy",
          behaviorAnalysis: `Interview conducted with ${securityScore}% security compliance. ${securityEvents.length} security events recorded during the session.`,
        },
        recommendations: [
          `Study ${userTechnology} fundamentals more comprehensively`,
          "Practice technical communication skills",
          "Work on real-world coding projects",
          "Review industry best practices and standards",
        ],
        summary: `${userExperienceLevel} level candidate completed ${userTechnology} technical interview with ${userResponses.length} responses. Performance indicates room for growth in technical depth and practical application.`,
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
    captureList.length,
  ])

  // Complete interview
  const completeInterview = useCallback(async () => {
    setCurrentState("processing")
    stopCurrentAudio()
    stopListening()

    // Take final photo
    if (cameraInitialized) {
      takePhoto("end")
    }

    try {
      const report = await generateInterviewReport()
      setInterviewReport(report)
      setInterviewCompleted(true)
      setShowReport(true)
      setCurrentState("completed")

      // Cleanup camera
      cleanupCamera()
    } catch (error) {
      console.error("Failed to generate report:", error)
      setCurrentState("error")
    }
  }, [generateInterviewReport, stopCurrentAudio, stopListening, cameraInitialized, takePhoto, cleanupCamera])

  // Start interview
  const startInterview = useCallback(async () => {
    setShowInstructions(false)
    enterFullscreen()
    setInterviewStarted(true)
    setInterviewStartTime(new Date())

    // Setup camera after interview starts
    await setupCamera()

    // Schedule random captures
    setTimeout(() => scheduleRandomCapture(), 30000) // First random capture after 30 seconds

    const systemInstruction = SystemPrompt(userTechnology, userExperienceLevel)
    const initialUserMessage: ChatMessage = {
      role: "user",
      content: "Please start the interview.",
      timestamp: new Date(),
    }

    setChatHistory([initialUserMessage])

    try {
      const geminiFormatted = [initialUserMessage].map((msg) => ({
        role: "user",
        parts: [{ text: msg.content }],
      }))

      const aiMessage = await GeminiService.GeminiGenerateText(geminiFormatted, systemInstruction)

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: aiMessage,
        timestamp: new Date(),
      }

      setChatHistory((prev) => [...prev, assistantMessage])
      setQuestionCount(1)
      await speakWithEdgeTTS(aiMessage, "en")
    } catch (error) {
      console.error("Error starting interview:", error)
      setCurrentState("error")
    }
  }, [enterFullscreen, userTechnology, userExperienceLevel, speakWithEdgeTTS, setupCamera, scheduleRandomCapture])

  // Toggle audio with proper state management
  const toggleAudio = useCallback(() => {
    const newAudioState = !isAudioEnabled
    setIsAudioEnabled(newAudioState)

    if (!newAudioState && currentState === "speaking") {
      // If disabling audio while speaking, stop current audio
      stopCurrentAudio()
      setCurrentState("idle")

      // Auto-start listening if interview is active
      if (interviewStarted && !interviewCompleted) {
        setTimeout(startListening, 500)
      }
    }
  }, [isAudioEnabled, currentState, stopCurrentAudio, interviewStarted, interviewCompleted, startListening])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current)
        clearInterval(silenceTimerRef.current as any)
      }
      if (pauseTimerRef.current) {
        clearTimeout(pauseTimerRef.current)
      }
      stopCurrentAudio()
      cleanupCamera()
    }
  }, [stopCurrentAudio, cleanupCamera])

  // Helper functions
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
        return isUserCurrentlySpeaking
          ? `Speaking... (${pauseCount > 0 ? `pause ${pauseCount}s` : "continue"})`
          : "Listening... (speak naturally)"
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

  // Enhanced Instructions Component
  const InstructionsModal = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Secure Technical Interview</h2>
            <p className="text-gray-600">AI-Powered Assessment with Advanced Security Monitoring</p>
          </div>

          <div className="space-y-6">
            {/* Interview Details */}
            <Card className="p-4 bg-blue-50 border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
                <Info className="w-5 h-5 mr-2" />
                Interview Details
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-600 font-medium">Technology:</span>
                  <div className="text-gray-700">{userTechnology}</div>
                </div>
                <div>
                  <span className="text-blue-600 font-medium">Level:</span>
                  <div className="text-gray-700">{userExperienceLevel}</div>
                </div>
                <div>
                  <span className="text-blue-600 font-medium">Duration:</span>
                  <div className="text-gray-700">15-25 minutes</div>
                </div>
                <div>
                  <span className="text-blue-600 font-medium">Questions:</span>
                  <div className="text-gray-700">8-12 technical questions</div>
                </div>
              </div>
            </Card>

            {/* Security Guidelines */}
            <Card className="p-4 bg-red-50 border-red-200">
              <h3 className="font-semibold text-red-800 mb-3 flex items-center">
                <Lock className="w-5 h-5 mr-2" />
                Security Guidelines & Monitoring
              </h3>
              <div className="space-y-3 text-sm text-red-700">
                <div className="flex items-start">
                  <Monitor className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Fullscreen Mode:</strong> Interview must be conducted in fullscreen. Exiting fullscreen will
                    be flagged.
                  </div>
                </div>
                <div className="flex items-start">
                  <Eye className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Tab Monitoring:</strong> Switching tabs or losing window focus is tracked and affects your
                    security score.
                  </div>
                </div>
                <div className="flex items-start">
                  <Camera className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Face Monitoring:</strong> Random photos will be taken during the interview for identity
                    verification.
                  </div>
                </div>
                <div className="flex items-start">
                  <XCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Prohibited Actions:</strong> Right-click, copy/paste, developer tools, and keyboard
                    shortcuts are disabled.
                  </div>
                </div>
              </div>
            </Card>

            {/* Technical Requirements */}
            <Card className="p-4 bg-green-50 border-green-200">
              <h3 className="font-semibold text-green-800 mb-3 flex items-center">
                <Headphones className="w-5 h-5 mr-2" />
                Technical Requirements
              </h3>
              <div className="space-y-2 text-sm text-green-700">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                  <span>Microphone access for voice responses</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                  <span>Camera access for identity verification</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                  <span>Stable internet connection</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                  <span>Chrome/Firefox browser (latest version)</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                  <span>Quiet environment for clear audio</span>
                </div>
              </div>
            </Card>

            {/* Interview Process */}
            <Card className="p-4 bg-purple-50 border-purple-200">
              <h3 className="font-semibold text-purple-800 mb-3 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Interview Process
              </h3>
              <div className="space-y-2 text-sm text-purple-700">
                <div className="flex items-start">
                  <span className="bg-purple-200 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                    1
                  </span>
                  <span>Click "Start Interview" to begin in fullscreen mode</span>
                </div>
                <div className="flex items-start">
                  <span className="bg-purple-200 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                    2
                  </span>
                  <span>Listen to questions and respond naturally using your voice</span>
                </div>
                <div className="flex items-start">
                  <span className="bg-purple-200 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                    3
                  </span>
                  <span>Speak clearly and pause for 4 seconds when finished</span>
                </div>
                <div className="flex items-start">
                  <span className="bg-purple-200 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                    4
                  </span>
                  <span>Interview automatically ends after all questions or manual completion</span>
                </div>
                <div className="flex items-start">
                  <span className="bg-purple-200 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                    5
                  </span>
                  <span>Receive detailed performance and security report</span>
                </div>
              </div>
            </Card>

            {/* Warning */}
            <Alert className="bg-orange-50 border-orange-200">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>Important:</strong> Any security violations will be recorded and may affect your final
                assessment. Ensure you're in a private, quiet environment before starting.
              </AlertDescription>
            </Alert>
          </div>

          <div className="flex gap-4 mt-8">
            <Button onClick={() => setShowInstructions(false)} variant="outline" className="flex-1">
              Review Later
            </Button>
            <Button
              onClick={startInterview}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Secure Interview
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )

  // Enhanced Report Component
  const InterviewReportComponent = ({ report }: { report: InterviewReport }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-white">
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
                  <span className="text-gray-600">Photos Taken:</span>
                  <span className="font-medium">{captureCount}</span>
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
                <Progress value={report.performance.technicalKnowledge} className="mt-2" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{report.performance.communicationSkills}</div>
                <div className="text-sm text-gray-600">Communication</div>
                <Progress value={report.performance.communicationSkills} className="mt-2" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{report.performance.problemSolvingAbility}</div>
                <div className="text-sm text-gray-600">Problem Solving</div>
                <Progress value={report.performance.problemSolvingAbility} className="mt-2" />
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">{report.performance.overallScore}</div>
                <div className="text-sm text-gray-600">Overall Score</div>
                <div className="text-lg font-semibold text-indigo-600">{report.performance.grade}</div>
                <Progress value={report.performance.overallScore} className="mt-2" />
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

          {/* Enhanced Face Captures with better layout */}
          {captureList.length > 0 && (
            <Card className="p-4 mb-6">
              <h3 className="font-semibold text-lg mb-3 text-gray-800 flex items-center">
                <Camera className="w-5 h-5 mr-2" />
                Identity Verification Photos ({captureList.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {captureList.map((capture, index) => (
                  <div key={index} className="relative bg-gray-50 rounded-lg p-2">
                    <img
                      src={capture.image || "/placeholder.svg?height=200&width=200"}
                      alt={`Capture ${index + 1}`}
                      className="w-full h-32 object-cover rounded-md border-2 border-gray-200"
                    />
                    <div className="mt-2 text-center">
                      <Badge variant="secondary" className="text-xs">
                        #{capture.index} - {capture.timing}
                      </Badge>
                      <div className="text-xs text-gray-500 mt-1">{capture.timestamp.toLocaleTimeString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Security Violations */}
          {report.security.violations.length > 0 && (
            <Card className="p-4 mb-6">
              <h3 className="font-semibold text-lg mb-3 text-red-700 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Security Violations ({report.security.violations.length})
              </h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {report.security.violations.map((violation, index) => (
                  <div key={index} className="text-sm text-gray-700 p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex justify-between items-start">
                      <span className="font-medium capitalize text-red-700">{violation.type.replace("_", " ")}</span>
                      <span className="text-xs text-gray-500">{violation.timestamp.toLocaleTimeString()}</span>
                    </div>
                    {violation.details && <div className="text-xs text-gray-600 mt-1">{violation.details}</div>}
                  </div>
                ))}
              </div>
            </Card>
          )}

          <div className="text-center text-xs text-gray-500 mt-6">
            Report generated on {report.timestamp.toLocaleString()}
          </div>
        </div>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4 relative">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-blue-50 via-indigo-50 to-white opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-indigo-100/20" />
      </div>

      {/* Instructions Modal */}
      {showInstructions && <InstructionsModal />}

      {/* Security Warning */}
      {showSecurityWarning && (
        <Alert className="fixed top-24 left-1/2 transform -translate-x-1/2 z-40 bg-orange-50 border-orange-200 shadow-lg">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-orange-800">
            Security violation detected! Please follow interview guidelines.
          </AlertDescription>
        </Alert>
      )}

      {/* Enhanced Controls with Security Info */}
      <div className="fixed top-4 right-4 flex flex-col gap-2 z-10">
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-white/80 backdrop-blur-sm">
            <Camera className="w-3 h-3 mr-1" />
            Photos: {captureCount}
          </Badge>
          <Badge variant="outline" className={`${getSecurityScoreColor(securityScore)} bg-white/80 backdrop-blur-sm`}>
            <Shield className="w-3 h-3 mr-1" />
            Security: {securityScore}%
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleAudio}
            className="bg-white/80 backdrop-blur-sm"
            title={isAudioEnabled ? "Disable Audio" : "Enable Audio"}
          >
            {isAudioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setChatVisibility(!chatVisibility)}
            className="bg-white/80 backdrop-blur-sm"
            title={chatVisibility ? "Hide Transcript" : "Show Transcript"}
          >
            {chatVisibility ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
          {interviewCompleted && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowReport(true)}
              className="bg-white/80 backdrop-blur-sm"
              title="View Report"
            >
              <FileText className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Security Status Panel */}
      <div className="fixed top-4 left-4 flex flex-col gap-2 z-10">
        {isFullscreen && (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Monitor className="w-3 h-3 mr-1" />
            Fullscreen: Active
          </Badge>
        )}
        {(tabBlurCount > 0 || windowBlurCount > 0) && (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Focus Lost: {focusLossCount}x
          </Badge>
        )}
        {interviewStarted && !interviewCompleted && (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Users className="w-3 h-3 mr-1" />
            Questions: {questionCount}
          </Badge>
        )}
        {nextCaptureTime && (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            <Clock className="w-3 h-3 mr-1" />
            Next Photo: {Math.max(0, Math.ceil((nextCaptureTime - Date.now()) / 1000))}s
          </Badge>
        )}
      </div>

      {/* Main Interface */}
      <div className="flex flex-col items-center space-y-6 mt-16">
        {/* Enhanced Status Badge */}
        <Card className="px-6 py-3 bg-white/90 backdrop-blur-sm shadow-lg border-l-4 border-blue-500">
          <div className="flex items-center space-x-3">
            <div
              className={`w-3 h-3 rounded-full ${currentState === "listening"
                ? "bg-green-500 animate-pulse"
                : currentState === "speaking"
                  ? "bg-blue-500 animate-pulse"
                  : currentState === "processing"
                    ? "bg-yellow-500 animate-spin"
                    : currentState === "error"
                      ? "bg-red-500"
                      : "bg-gray-400"
                }`}
            />
            <span className="text-sm font-medium text-gray-800">{getStateText(currentState)}</span>
          </div>
        </Card>

        {/* Speech Buffer Display */}
        {speechBuffer && !interviewCompleted && (
          <Card className="p-4 max-w-2xl bg-white/90 backdrop-blur-sm shadow-lg border-l-4 border-green-500">
            <div className="flex items-start space-x-3">
              <Mic className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-gray-700 font-medium mb-1">Your Response:</p>
                <p className="text-sm text-gray-600 italic">"{speechBuffer}"</p>
                {pauseCount > 0 && (
                  <div className="flex items-center mt-2 text-xs text-orange-600">
                    <Clock className="w-3 h-3 mr-1" />
                    Pause detected: {pauseCount}s (processing in {4 - pauseCount}s)
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Current Transcript */}
        {currentTranscript && !speechBuffer && !interviewCompleted && (
          <Card className="p-4 max-w-lg bg-white/90 backdrop-blur-sm shadow-lg border-l-4 border-blue-500">
            <div className="flex items-start space-x-3">
              <Volume2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-700 font-medium mb-1">Live Transcript:</p>
                <p className="text-sm text-gray-600 italic">"{currentTranscript}"</p>
              </div>
            </div>
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
                  : () => setShowInstructions(true)
            }
            disabled={currentState === "processing"}
            className={`w-40 h-40 rounded-full bg-gradient-to-br ${getStateColor(currentState)} shadow-2xl flex items-center justify-center text-white text-4xl transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed ${currentState === "listening" ? "animate-pulse" : ""
              }`}
          >
            {interviewCompleted ? (
              <FileText className="w-12 h-12" />
            ) : currentState === "listening" ? (
              <Square className="w-12 h-12" />
            ) : currentState === "speaking" ? (
              <Volume2 className="w-12 h-12" />
            ) : currentState === "processing" ? (
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            ) : interviewStarted ? (
              <Mic className="w-12 h-12" />
            ) : (
              <Play className="w-12 h-12" />
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
          <div className="flex gap-3 flex-wrap justify-center">
            {currentState === "speaking" && (
              <Button
                onClick={stopCurrentAudio}
                variant="outline"
                size="sm"
                className="bg-white/90 backdrop-blur-sm shadow-lg"
              >
                <Pause className="w-4 h-4 mr-2" />
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
            <Volume2 className="w-3 h-3 mr-1" />
            Audio Queue: {audioQueue.length}
          </Badge>
        )}
      </div>

      {/* Enhanced Chat History - Mobile Responsive */}
      {chatVisibility && !showReport && (
        <Card className="fixed bottom-4 left-4 right-4 md:left-4 md:right-auto md:w-96 max-h-96 overflow-y-auto bg-white/95 backdrop-blur-sm p-4 shadow-xl z-40">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-800">Interview Transcript</h3>
            <div className="flex gap-2">
              <Badge variant="secondary" className="text-xs">
                {chatHistory.filter((msg) => msg.role !== "system").length} messages
              </Badge>
              <Badge variant="outline" className={`${getSecurityScoreColor(securityScore)} text-xs`}>
                Security: {securityScore}%
              </Badge>
            </div>
          </div>
          <Separator className="mb-3" />
          <div className="space-y-3">
            {chatHistory
              .filter((msg) => msg.role !== "system")
              .map((msg, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg transition-all ${msg.role === "user"
                    ? "bg-blue-50 ml-4 border-l-4 border-blue-500"
                    : "bg-gray-50 mr-4 border-l-4 border-gray-500"
                    }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-xs capitalize text-gray-600 flex items-center">
                      {msg.role === "user" ? (
                        <>
                          <Users className="w-3 h-3 mr-1" />
                          You
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3 h-3 mr-1" />
                          Interviewer
                        </>
                      )}
                    </span>
                    <span className="text-xs text-gray-400">{msg.timestamp.toLocaleTimeString()}</span>
                  </div>
                  <p className="text-sm text-gray-800 leading-relaxed">{msg.content}</p>
                </div>
              ))}
          </div>
        </Card>
      )}

      {/* Interview Report */}
      {showReport && interviewReport && <InterviewReportComponent report={interviewReport} />}

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} style={{ display: "none" }} className="hidden" />
    </div>
  )
}
