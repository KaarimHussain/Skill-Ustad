"use client"

import type React from "react"

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
  Upload,
  HelpCircle,
  Loader2,
  Settings,
  Zap,
  Star,
  Target,
  Brain,
  MessageSquare,
  Activity,
} from "lucide-react"
import { useEffect, useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import SystemPrompt from "@/constants/system-prompts"
import GeminiService from "@/services/gemini.service"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLocation } from "react-router-dom"

interface LocationState {
  technology?: string
  experienceLevel?: string
  questions?: string
  language?: string
}

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

  // Get location state for parameters
  const location = useLocation()
  const locationState = (location?.state as LocationState) || {}

  const [userTechnology,] = useState(locationState.technology || "HTML")
  const [userExperienceLevel,] = useState(locationState.experienceLevel || "Beginner")
  const [locationQuestions,] = useState(locationState.questions || "")
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

  // Custom questions state
  const [customQuestions, setCustomQuestions] = useState("")
  const [useCustomQuestions, setUseCustomQuestions] = useState(false)
  const [questionsFile, setQuestionsFile] = useState<File | null>(null)

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
  const [connectionError, setConnectionError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

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
  const [lang, setLang] = useState("eng");

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

  // Initialize questions from location state on component mount
  useEffect(() => {
    if (locationQuestions && locationQuestions.trim()) {
      setCustomQuestions(locationQuestions)
      setUseCustomQuestions(true)
    }
  }, [locationQuestions])



  // Handle file upload for custom questions
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "text/plain") {
      setQuestionsFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setCustomQuestions(content)
        setUseCustomQuestions(true)
      }
      reader.readAsText(file)
    }
  }, [])

  // Get system prompt with custom questions
  const getSystemPrompt = useCallback(() => {
    const questionsToUse = locationQuestions;

    return SystemPrompt(userTechnology, userExperienceLevel, questionsToUse, lang)
  }, [userTechnology, userExperienceLevel, useCustomQuestions, customQuestions])

  // Initialize system prompt
  useEffect(() => {
    setChatHistory([
      {
        role: "system",
        content: getSystemPrompt(),
        timestamp: new Date(),
      },
    ])
  }, [getSystemPrompt])

  // Enhanced camera setup - only initialize when interview starts
  const [cameraError, setCameraError] = useState(false)
  const [cameraRetryCount, setCameraRetryCount] = useState(0)

  // Enhanced photo capture with better error handling
  const takePhoto = useCallback(
    (timing: "start" | "middle" | "end") => {
      if (!videoRef.current || !cameraInitialized) {
        console.log("Camera not ready for photo capture")
        setCameraError(true)
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
          setCameraError(true)
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
        setCameraError(false)
        console.log(`Photo captured at ${timing} - Total: ${captureCount + 1}`)
      } catch (error) {
        setCameraError(true)
        console.error("Error taking photo:", error)
      }
    },
    [cameraInitialized, captureCount],
  )

  const setupCamera = useCallback(async (retry = 0) => {
    if (cameraInitialized || !interviewStarted) return
    try {
      setCameraError(false)
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
      await new Promise((resolve, reject) => {
        if (videoRef.current) {
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().then(resolve).catch(reject)
          }
        } else {
          reject()
        }
      })
      setCameraInitialized(true)
      setCameraError(false)
      setCameraRetryCount(0)
      console.log("Camera setup completed")
      setTimeout(() => takePhoto("start"), 2000)
    } catch (error) {
      console.error("Failed to setup camera:", error)
      setCameraError(true)
      setCameraRetryCount(retry)
      // Retry up to 2 times
      if (retry < 2) {
        setTimeout(() => setupCamera(retry + 1), 1500)
      }
    }
  }, [cameraInitialized, interviewStarted, takePhoto])



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
      setConnectionError(true)
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
      setConnectionError(false)
      setRetryCount(0)
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
        setConnectionError(true)
        setRetryCount((prev) => prev + 1)
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
              setConnectionError(true)
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
        await speakWithEdgeTTS(nextAudio, lang, true)
      } catch (error) {
        console.error("Error processing audio queue:", error)
        setConnectionError(true)
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
    async (text: string, lang: string, skipQueue = false) => {
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

        const response = await fetch("http://127.0.0.1:8000/tts/speak", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text,
            lang,
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
            setConnectionError(true)
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
        setConnectionError(true)
        if (currentAudioRef.current) {
          currentAudioRef.current = null
        }
      }
    },
    [isAudioEnabled, interviewStarted, interviewCompleted, stopCurrentAudio, processAudioQueue],
  )

  // Start/stop listening controls with better error handling
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
        setConnectionError(false)

        recognitionRef.current.start()
        isUserSpeakingRef.current = true
      } catch (error) {
        console.error("Failed to start recognition:", error)
        setCurrentState("error")
        setConnectionError(true)
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
        const contextualPrompt = `${getSystemPrompt()}

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
- And make sure to respond in ${lang == "hin" ? "Hindi" : "English"} Language!

Please provide your next interview question or response:`

        // Send only the current user message with full context
        const geminiFormatted = [
          {
            role: "user",
            parts: [{ text: contextualPrompt }],
          },
        ]
        const systemPrompt = getSystemPrompt();
        const aiMessage = await GeminiService.GeminiGenerateText(geminiFormatted, systemPrompt)

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

        await speakWithEdgeTTS(aiMessage, lang)
      } catch (error) {
        console.error("Error processing request:", error)
        setCurrentState("error")
        setConnectionError(true)
        const errorMessage = "I'm having technical difficulties. Please try again."
        await speakWithEdgeTTS(errorMessage, lang)
      }
    },
    [chatHistory, speakWithEdgeTTS, stopListening, interviewCompleted, getSystemPrompt, questionCount],
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
    setChatVisibility(true)
    // Always setup camera on interview start
    await setupCamera()
    // Schedule random captures
    setTimeout(() => scheduleRandomCapture(), 30000) // First random capture after 30 seconds
    const systemInstruction = getSystemPrompt()
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
      await speakWithEdgeTTS(aiMessage, lang)
    } catch (error) {
      console.error("Error starting interview:", error)
      setCurrentState("error")
      setConnectionError(true)
    }
  }, [enterFullscreen, getSystemPrompt, speakWithEdgeTTS, setupCamera, scheduleRandomCapture])

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

  // Retry connection
  const retryConnection = useCallback(() => {
    setConnectionError(false)
    setRetryCount(0)
    setCurrentState("idle")

    if (interviewStarted && !interviewCompleted) {
      setTimeout(startListening, 1000)
    }
  }, [interviewStarted, interviewCompleted, startListening])

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
        return "from-emerald-400 via-green-500 to-teal-600"
      case "processing":
        return "from-amber-400 via-yellow-500 to-orange-600"
      case "speaking":
        return "from-blue-400 via-indigo-500 to-purple-600"
      case "error":
        return "from-red-400 via-rose-500 to-pink-600"
      case "security_warning":
        return "from-orange-400 via-red-500 to-pink-600"
      case "completed":
        return "from-purple-400 via-violet-500 to-indigo-600"
      default:
        return "from-indigo-500 via-purple-600 to-pink-600"
    }
  }

  const getStateText = (state: InterviewState) => {
    switch (state) {
      case "listening":
        return isUserCurrentlySpeaking
          ? `Speaking... ${pauseCount > 0 ? `(pause ${pauseCount}s)` : "(continue)"}`
          : "Listening... (speak naturally)"
      case "processing":
        return "Processing your response..."
      case "speaking":
        return "Interviewer speaking..."
      case "error":
        return connectionError
          ? `Connection error (attempt ${retryCount + 1}) - Tap to retry`
          : "Audio system error - check backend"
      case "security_warning":
        return "Security violation detected"
      case "completed":
        return "Interview completed - View report"
      default:
        return interviewStarted ? "Tap to speak" : "Start Secure Interview"
    }
  }

  const getSecurityScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600"
    if (score >= 60) return "text-amber-600"
    return "text-red-600"
  }

  // Check if main button should be disabled
  const isMainButtonDisabled = () => {
    return (
      currentState === "processing" ||
      (currentState === "speaking" && isProcessingAudio) ||
      (currentState === "error" && !connectionError)
    )
  }

  // Enhanced Instructions Component with Custom Questions
  const InstructionsModal = () => (
    <div className="fixed inset-0 bg-gradient-to-br from-black/70 via-indigo-900/30 to-purple-900/50 backdrop-blur-md flex items-center justify-center py-20 px-5 z-50">
      <Card className="w-full max-w-4xl max-h-[95vh] overflow-y-auto bg-white/95 backdrop-blur-sm shadow-2xl border-0 rounded-2xl">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
              Secure Technical Interview
            </h2>
            <p className="text-gray-600 text-lg">AI-Powered Assessment with Advanced Security Monitoring</p>
          </div>

          <div className="space-y-8">
            {/* Custom Questions Section */}
            <Card className="p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-indigo-200 shadow-lg rounded-xl">
              <h3 className="font-bold text-indigo-800 mb-4 flex items-center text-lg">
                <Settings className="w-6 h-6 mr-3" />
                Custom Interview Questions
                <Badge className="ml-3 bg-indigo-100 text-indigo-700 border-indigo-300">Recommended</Badge>
              </h3>

              <div className="space-y-2">
                <Label htmlFor="language" className="text-sm font-medium text-gray-700">
                  Select Interview Language
                </Label>
                <Select value={lang} onValueChange={(val) => setLang(val)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eng">English</SelectItem>
                    <SelectItem value="hin">Hindi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <p className="text-indigo-700 text-sm leading-relaxed">
                  Upload your own questions file or paste questions below to personalize your interview experience. If
                  no custom questions are provided, we'll use our comprehensive default question set.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label htmlFor="questions-file" className="text-sm font-medium text-indigo-800">
                      Upload Questions File (.txt)
                    </Label>
                    <div className="relative">
                      <input
                        id="questions-file"
                        type="file"
                        accept=".txt"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("questions-file")?.click()}
                        className="w-full border-indigo-300 text-indigo-700 hover:bg-indigo-50 transition-all duration-200"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {questionsFile ? questionsFile.name : "Choose File"}
                      </Button>
                    </div>
                    {questionsFile && (
                      <div className="flex items-center text-sm text-green-600">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        File uploaded successfully
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="custom-questions" className="text-sm font-medium text-indigo-800">
                      Or Paste Questions Here
                    </Label>
                    <Textarea
                      id="custom-questions"
                      placeholder="1. Your first question here...&#10;2. Your second question here...&#10;3. And so on..."
                      value={customQuestions}
                      onChange={(e) => {
                        setCustomQuestions(e.target.value)
                        setUseCustomQuestions(e.target.value.trim().length > 0)
                      }}
                      className="min-h-[120px] border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500 resize-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/60 rounded-lg border border-indigo-200">
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-3 ${useCustomQuestions ? "bg-green-500" : "bg-gray-400"}`}
                    />
                    <span className="text-sm font-medium text-indigo-800">
                      {useCustomQuestions ? "Using Custom Questions" : "Using Default Questions"}
                    </span>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-4 h-4 text-indigo-600" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Custom questions allow you to tailor the interview to specific topics or skills you want to
                          assess.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </Card>

            {/* Interview Details */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-lg rounded-xl">
              <h3 className="font-bold text-blue-800 mb-4 flex items-center text-lg">
                <Info className="w-6 h-6 mr-3" />
                Interview Details
              </h3>
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Target className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="text-blue-600 font-medium">Technology:</span>
                    <div className="ml-2 text-gray-700 font-semibold">{userTechnology}</div>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="text-blue-600 font-medium">Level:</span>
                    <div className="ml-2 text-gray-700 font-semibold">{userExperienceLevel}</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="text-blue-600 font-medium">Duration:</span>
                    <div className="ml-2 text-gray-700 font-semibold">15-25 minutes</div>
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="text-blue-600 font-medium">Questions:</span>
                    <div className="ml-2 text-gray-700 font-semibold">8-12 questions</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Security Guidelines */}
            <Card className="p-6 bg-gradient-to-br from-red-50 to-orange-50 border-red-200 shadow-lg rounded-xl">
              <h3 className="font-bold text-red-800 mb-4 flex items-center text-lg">
                <Lock className="w-6 h-6 mr-3" />
                Security Guidelines & Monitoring
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-red-700">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Monitor className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-red-600" />
                    <div>
                      <strong className="text-red-800">Fullscreen Mode:</strong> Interview must be conducted in
                      fullscreen. Exiting will be flagged.
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Eye className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-red-600" />
                    <div>
                      <strong className="text-red-800">Tab Monitoring:</strong> Switching tabs or losing focus is
                      tracked and affects your security score.
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Camera className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-red-600" />
                    <div>
                      <strong className="text-red-800">Face Monitoring:</strong> Random photos taken during interview
                      for identity verification.
                    </div>
                  </div>
                  <div className="flex items-start">
                    <XCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-red-600" />
                    <div>
                      <strong className="text-red-800">Prohibited Actions:</strong> Right-click, copy/paste, developer
                      tools disabled.
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Technical Requirements */}
            <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-lg rounded-xl">
              <h3 className="font-bold text-green-800 mb-4 flex items-center text-lg">
                <Headphones className="w-6 h-6 mr-3" />
                Technical Requirements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-green-700">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-3 text-green-600" />
                    <span>Microphone access for voice responses</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-3 text-green-600" />
                    <span>Camera access for identity verification</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-3 text-green-600" />
                    <span>Stable internet connection</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-3 text-green-600" />
                    <span>Chrome/Firefox browser (latest version)</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-3 text-green-600" />
                    <span>Quiet environment for clear audio</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-3 text-green-600" />
                    <span>Distraction-free workspace setup</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Interview Process */}
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200 shadow-lg rounded-xl">
              <h3 className="font-bold text-purple-800 mb-4 flex items-center text-lg">
                <Activity className="w-6 h-6 mr-3" />
                Interview Process
              </h3>
              <div className="space-y-4 text-sm text-purple-700">
                {[
                  "Click 'Start Interview' to begin in fullscreen mode",
                  "Listen to questions and respond naturally using your voice",
                  "Speak clearly and pause for 4 seconds when finished",
                  "Interview automatically ends after all questions or manual completion",
                  "Receive detailed performance and security report",
                ].map((step, index) => (
                  <div key={index} className="flex items-start">
                    <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-0.5 shadow-md">
                      {index + 1}
                    </div>
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Warning */}
            <Alert className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-300 shadow-lg rounded-xl">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <AlertDescription className="text-orange-800 font-medium">
                <strong>Important:</strong> Any security violations will be recorded and may affect your final
                assessment. Ensure you're in a private, quiet environment before starting.
              </AlertDescription>
            </Alert>
          </div>

          <div className="flex gap-4 mt-8">
            <Button
              onClick={() => setShowInstructions(false)}
              variant="outline"
              className="flex-1 border-gray-300 hover:bg-gray-50 transition-all duration-200"
            >
              <Settings className="w-4 h-4 mr-2" />
              Review Later
            </Button>
            <Button
              onClick={startInterview}
              className="flex-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
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
    <div className="fixed inset-0 bg-gradient-to-br from-black/70 via-indigo-900/30 to-purple-900/50 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-6xl max-h-[95vh] overflow-y-auto bg-white/95 backdrop-blur-sm shadow-2xl border-0 rounded-2xl">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center">
              <FileText className="w-8 h-8 mr-3 text-indigo-600" />
              Technical Interview Report
            </h2>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() => setShowReport(false)}
                    className="text-gray-600 hover:bg-gray-50 transition-all duration-200"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Close
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Close the report and return to main interface</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Candidate Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-lg rounded-xl">
              <h3 className="font-bold text-lg mb-4 text-blue-800 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Candidate Information
              </h3>
              <div className="space-y-3 text-sm">
                {[
                  { label: "Technology", value: report.candidate.technology, icon: Target },
                  { label: "Experience Level", value: report.candidate.experienceLevel, icon: Star },
                  { label: "Duration", value: `${report.candidate.interviewDuration} minutes`, icon: Clock },
                  { label: "Questions Asked", value: report.candidate.totalQuestions, icon: MessageSquare },
                  { label: "Responses Given", value: report.candidate.totalResponses, icon: Brain },
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
                    <span className="text-blue-700 flex items-center">
                      <item.icon className="w-4 h-4 mr-2" />
                      {item.label}:
                    </span>
                    <span className="font-semibold text-blue-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-red-50 to-orange-50 border-red-200 shadow-lg rounded-xl">
              <h3 className="font-bold text-lg mb-4 text-red-800 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Security Assessment
              </h3>
              <div className="space-y-3 text-sm">
                {[
                  {
                    label: "Security Score",
                    value: `${report.security.securityScore}%`,
                    color: getSecurityScoreColor(report.security.securityScore),
                  },
                  { label: "Violations", value: report.security.violations.length, color: "text-red-700" },
                  { label: "Tab Switches", value: tabBlurCount, color: "text-orange-700" },
                  { label: "Focus Loss", value: focusLossCount, color: "text-yellow-700" },
                  { label: "Photos Taken", value: captureCount, color: "text-green-700" },
                  { label: "Trustworthiness", value: report.security.trustworthiness, color: "text-blue-700" },
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
                    <span className="text-red-700 flex items-center">
                      <Activity className="w-4 h-4 mr-2" />
                      {item.label}:
                    </span>
                    <span className={`font-semibold ${item.color}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Performance Scores */}
          <Card className="p-6 mb-8 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200 shadow-lg rounded-xl">
            <h3 className="font-bold text-lg mb-6 text-purple-800 flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              Performance Assessment
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {[
                {
                  label: "Technical Knowledge",
                  value: report.performance.technicalKnowledge,
                  color: "text-blue-600",
                  bgColor: "from-blue-500 to-blue-600",
                },
                {
                  label: "Communication",
                  value: report.performance.communicationSkills,
                  color: "text-green-600",
                  bgColor: "from-green-500 to-green-600",
                },
                {
                  label: "Problem Solving",
                  value: report.performance.problemSolvingAbility,
                  color: "text-purple-600",
                  bgColor: "from-purple-500 to-purple-600",
                },
                {
                  label: "Overall Score",
                  value: report.performance.overallScore,
                  color: "text-indigo-600",
                  bgColor: "from-indigo-500 to-indigo-600",
                  grade: report.performance.grade,
                },
              ].map((metric, index) => (
                <div key={index} className="text-center p-4 bg-white/60 rounded-xl shadow-md">
                  <div className={`text-3xl font-bold ${metric.color} mb-2`}>{metric.value}</div>
                  <div className="text-sm text-gray-600 mb-3">{metric.label}</div>
                  {metric.grade && <div className={`text-lg font-bold ${metric.color} mb-2`}>{metric.grade}</div>}
                  <div className="relative w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`absolute top-0 left-0 h-2 rounded-full bg-gradient-to-r ${metric.bgColor} transition-all duration-1000 ease-out`}
                      style={{ width: `${metric.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Strengths and Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-lg rounded-xl">
              <h3 className="font-bold text-lg mb-4 text-green-800 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Strengths
              </h3>
              <ul className="space-y-3">
                {report.performance.strengths.map((strength, index) => (
                  <li key={index} className="text-sm text-green-700 flex items-start p-3 bg-white/60 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2 flex-shrink-0" />
                    <span className="leading-relaxed">{strength}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-red-50 to-orange-50 border-red-200 shadow-lg rounded-xl">
              <h3 className="font-bold text-lg mb-4 text-red-800 flex items-center">
                <XCircle className="w-5 h-5 mr-2" />
                Areas for Improvement
              </h3>
              <ul className="space-y-3">
                {report.performance.weaknesses.map((weakness, index) => (
                  <li key={index} className="text-sm text-red-700 flex items-start p-3 bg-white/60 rounded-lg">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2 flex-shrink-0" />
                    <span className="leading-relaxed">{weakness}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Behavior Analysis */}
          <Card className="p-6 mb-8 bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200 shadow-lg rounded-xl">
            <h3 className="font-bold text-lg mb-4 text-gray-800 flex items-center">
              <Brain className="w-5 h-5 mr-2" />
              Behavior Analysis
            </h3>
            <p className="text-gray-700 leading-relaxed p-4 bg-white/60 rounded-lg">
              {report.security.behaviorAnalysis}
            </p>
          </Card>

          {/* Recommendations */}
          <Card className="p-6 mb-8 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200 shadow-lg rounded-xl">
            <h3 className="font-bold text-lg mb-4 text-indigo-800 flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Recommendations
            </h3>
            <ul className="space-y-3">
              {report.recommendations.map((recommendation, index) => (
                <li key={index} className="text-sm text-indigo-700 flex items-start p-3 bg-white/60 rounded-lg">
                  <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">
                    {index + 1}
                  </div>
                  <span className="leading-relaxed">{recommendation}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Summary */}
          <Card className="p-6 mb-8 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 shadow-lg rounded-xl">
            <h3 className="font-bold text-lg mb-4 text-yellow-800 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Interview Summary
            </h3>
            <p className="text-yellow-700 leading-relaxed p-4 bg-white/60 rounded-lg">{report.summary}</p>
          </Card>

          {/* Enhanced Face Captures with better layout */}
          {cameraError && (
            <Card className="p-6 mb-8 bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200 shadow-lg rounded-xl">
              <h3 className="font-bold text-lg mb-4 text-pink-800 flex items-center">
                <Camera className="w-5 h-5 mr-2" />
                Camera Error
              </h3>
              <div className="text-pink-700">Camera access failed or no images captured. Please check permissions and retry.</div>
              <div className="mt-2 text-xs text-pink-600">Tried {cameraRetryCount + 1} times.</div>
            </Card>
          )}
          {captureList.length > 0 && !cameraError && (
            <Card className="p-6 mb-8 bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200 shadow-lg rounded-xl">
              <h3 className="font-bold text-lg mb-4 text-pink-800 flex items-center">
                <Camera className="w-5 h-5 mr-2" />
                Identity Verification Photos ({captureList.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {captureList.map((capture, index) => (
                  <div key={index} className="relative bg-white/60 rounded-xl p-4 shadow-md">
                    <img
                      src={capture.image || "/placeholder.svg?height=200&width=200"}
                      alt={`Capture ${index + 1}`}
                      className="w-full h-40 object-cover rounded-lg border-2 border-pink-200 shadow-sm"
                    />
                    <div className="mt-3 text-center">
                      <Badge variant="secondary" className="text-xs bg-pink-100 text-pink-800 border-pink-300">
                        #{capture.index} - {capture.timing}
                      </Badge>
                      <div className="text-xs text-pink-600 mt-2 font-medium">
                        {capture.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Security Violations */}
          {report.security.violations.length > 0 && (
            <Card className="p-6 mb-8 bg-gradient-to-br from-red-50 to-orange-50 border-red-200 shadow-lg rounded-xl">
              <h3 className="font-bold text-lg mb-4 text-red-800 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Security Violations ({report.security.violations.length})
              </h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {report.security.violations.map((violation, index) => (
                  <div
                    key={index}
                    className="text-sm text-red-700 p-4 bg-white/60 rounded-lg border border-red-200 shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold capitalize text-red-800 flex items-center">
                        <XCircle className="w-4 h-4 mr-2" />
                        {violation.type.replace("_", " ")}
                      </span>
                      <span className="text-xs text-red-500 bg-red-100 px-2 py-1 rounded-full">
                        {violation.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    {violation.details && (
                      <div className="text-xs text-red-600 bg-red-50 p-2 rounded mt-2">{violation.details}</div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          <div className="text-center text-xs text-gray-500 mt-8 p-4 bg-gray-50 rounded-lg">
            <Clock className="w-4 h-4 inline mr-2" />
            Report generated on {report.timestamp.toLocaleString()}
          </div>
        </div>
      </Card>
    </div>
  )

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-100 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Enhanced Background Effects with Spectral Gradient */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial from-indigo-100/60 via-purple-50/40 to-pink-50/20" />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-200/30 via-purple-200/20 to-pink-200/30" />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5" />

          {/* Animated gradient orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-pink-400/15 to-indigo-600/15 rounded-full blur-2xl animate-pulse delay-2000" />
        </div>

        {/* Instructions Modal */}
        {showInstructions && <InstructionsModal />}

        {/* Enhanced Security Warning */}
        {showSecurityWarning && (
          <Alert className="fixed top-24 left-1/2 transform -translate-x-1/2 z-40 bg-gradient-to-r from-orange-50 to-red-50 border-orange-300 shadow-xl rounded-xl backdrop-blur-sm">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <AlertDescription className="text-orange-800 font-medium">
              <strong>Security violation detected!</strong> Please follow interview guidelines to maintain assessment
              integrity.
            </AlertDescription>
          </Alert>
        )}

        {/* Enhanced Controls with Tooltips */}
        <div className="fixed top-23 right-4 flex flex-col gap-3 z-10">
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="bg-white/90 backdrop-blur-sm shadow-lg border-purple-200">
                    <Camera className="w-3 h-3 mr-1 text-purple-600" />
                    Photos: {captureCount}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Identity verification photos captured</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge
                    variant="outline"
                    className={`${getSecurityScoreColor(securityScore)} bg-white/90 backdrop-blur-sm shadow-lg border-purple-200`}
                  >
                    <Shield className="w-3 h-3 mr-1" />
                    Security: {securityScore}%
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Current security compliance score</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleAudio}
                    className="bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white/95 transition-all duration-200"
                  >
                    {isAudioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isAudioEnabled ? "Disable Audio" : "Enable Audio"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setChatVisibility(!chatVisibility)}
                    className="bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white/95 transition-all duration-200"
                  >
                    {chatVisibility ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{chatVisibility ? "Hide Transcript" : "Show Transcript"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {interviewCompleted && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowReport(true)}
                      className="bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white/95 transition-all duration-200"
                    >
                      <FileText className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View Detailed Report</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>

        {/* Enhanced Security Status Panel */}
        <div className="fixed top-23 left-4 flex flex-col gap-2 z-10">
          {isFullscreen && (
            <Badge
              variant="outline"
              className="bg-green-50/90 text-green-700 border-green-300 backdrop-blur-sm shadow-lg"
            >
              <Monitor className="w-3 h-3 mr-1" />
              Fullscreen: Active
            </Badge>
          )}
          {(tabBlurCount > 0 || windowBlurCount > 0) && (
            <Badge
              variant="outline"
              className="bg-orange-50/90 text-orange-700 border-orange-300 backdrop-blur-sm shadow-lg"
            >
              <AlertTriangle className="w-3 h-3 mr-1" />
              Focus Lost: {focusLossCount}x
            </Badge>
          )}
          {interviewStarted && !interviewCompleted && (
            <Badge variant="outline" className="bg-blue-50/90 text-blue-700 border-blue-300 backdrop-blur-sm shadow-lg">
              <MessageSquare className="w-3 h-3 mr-1" />
              Questions: {questionCount}
            </Badge>
          )}
          {nextCaptureTime && (
            <Badge
              variant="outline"
              className="bg-purple-50/90 text-purple-700 border-purple-300 backdrop-blur-sm shadow-lg"
            >
              <Clock className="w-3 h-3 mr-1" />
              Next Photo: {Math.max(0, Math.ceil((nextCaptureTime - Date.now()) / 1000))}s
            </Badge>
          )}
        </div>

        {/* Main Interface */}
        <div className="flex flex-col items-center space-y-8 mt-16">
          {/* Enhanced Status Badge */}
          <Card className="px-8 py-4 bg-white/95 backdrop-blur-md shadow-xl border-0 rounded-2xl">
            <div className="flex items-center space-x-4">
              <div
                className={`w-4 h-4 rounded-full shadow-lg ${currentState === "listening"
                  ? "bg-gradient-to-r from-emerald-400 to-green-500 animate-pulse"
                  : currentState === "speaking"
                    ? "bg-gradient-to-r from-blue-400 to-indigo-500 animate-pulse"
                    : currentState === "processing"
                      ? "bg-gradient-to-r from-amber-400 to-yellow-500 animate-spin"
                      : currentState === "error"
                        ? "bg-gradient-to-r from-red-400 to-rose-500"
                        : "bg-gradient-to-r from-gray-400 to-gray-500"
                  }`}
              />
              <span className="text-sm font-semibold text-gray-800">{getStateText(currentState)}</span>
              {connectionError && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Connection issue detected. Click main button to retry.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </Card>

          {/* Speech Buffer Display */}
          {speechBuffer && !interviewCompleted && (
            <Card className="p-6 max-w-2xl bg-white/95 backdrop-blur-md shadow-xl border-0 rounded-2xl">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                  <Mic className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700 font-semibold mb-2 flex items-center">
                    <Activity className="w-4 h-4 mr-2" />
                    Your Response:
                  </p>
                  <p className="text-sm text-gray-600 italic leading-relaxed">"{speechBuffer}"</p>
                  {pauseCount > 0 && (
                    <div className="flex items-center mt-3 text-xs text-orange-600 bg-orange-50 px-3 py-2 rounded-lg">
                      <Clock className="w-3 h-3 mr-2" />
                      Pause detected: {pauseCount}s (processing in {4 - pauseCount}s)
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Current Transcript */}
          {currentTranscript && !speechBuffer && !interviewCompleted && (
            <Card className="p-6 max-w-lg bg-white/95 backdrop-blur-md shadow-xl border-0 rounded-2xl">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                  <Volume2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-700 font-semibold mb-2 flex items-center">
                    <Brain className="w-4 h-4 mr-2" />
                    Live Transcript:
                  </p>
                  <p className="text-sm text-gray-600 italic leading-relaxed">"{currentTranscript}"</p>
                </div>
              </div>
            </Card>
          )}

          {/* Enhanced Main Button */}
          <div className="relative">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={
                      interviewCompleted
                        ? () => setShowReport(true)
                        : connectionError
                          ? retryConnection
                          : interviewStarted
                            ? currentState === "listening"
                              ? stopListening
                              : startListening
                            : () => setShowInstructions(true)
                    }
                    disabled={isMainButtonDisabled()}
                    className={`w-48 h-48 rounded-full bg-gradient-to-br ${getStateColor(currentState)} shadow-2xl flex items-center justify-center text-white text-5xl transition-all duration-500 ease-in-out hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${currentState === "listening" ? "animate-pulse" : ""
                      } ${connectionError ? "ring-4 ring-orange-300 ring-opacity-50" : ""}`}
                  >
                    {interviewCompleted ? (
                      <FileText className="w-16 h-16" />
                    ) : connectionError ? (
                      <AlertTriangle className="w-16 h-16" />
                    ) : currentState === "listening" ? (
                      <Square className="w-16 h-16" />
                    ) : currentState === "speaking" ? (
                      <Volume2 className="w-16 h-16" />
                    ) : currentState === "processing" ? (
                      <Loader2 className="w-16 h-16 animate-spin" />
                    ) : interviewStarted ? (
                      <Mic className="w-16 h-16" />
                    ) : (
                      <Play className="w-16 h-16" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {interviewCompleted
                      ? "View detailed interview report"
                      : connectionError
                        ? "Retry connection"
                        : interviewStarted
                          ? currentState === "listening"
                            ? "Stop listening and process response"
                            : "Start voice recognition"
                          : "Begin secure interview"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Enhanced pulse animation */}
            {currentState === "listening" && (
              <>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 animate-ping opacity-20"></div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-300 to-green-400 animate-pulse opacity-30"></div>
              </>
            )}

            {connectionError && (
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-400 to-red-500 animate-pulse opacity-20"></div>
            )}
          </div>

          {/* Enhanced Action Buttons */}
          {interviewStarted && !interviewCompleted && (
            <div className="flex gap-4 flex-wrap justify-center">
              {currentState === "speaking" && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={stopCurrentAudio}
                        variant="outline"
                        size="sm"
                        className="bg-white/95 backdrop-blur-md shadow-lg hover:bg-white transition-all duration-200 border-gray-200"
                      >
                        <Pause className="w-4 h-4 mr-2" />
                        Stop Speaking
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Stop current audio playback</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={completeInterview}
                      variant="outline"
                      size="sm"
                      className="bg-red-50/95 text-red-700 border-red-200 hover:bg-red-100 backdrop-blur-md shadow-lg transition-all duration-200"
                    >
                      <Square className="w-4 h-4 mr-2" />
                      End Interview
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Complete interview and generate report</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}

          {/* Audio Queue Indicator */}
          {audioQueue.length > 0 && !interviewCompleted && (
            <Badge variant="outline" className="bg-blue-50/95 text-blue-700 border-blue-200 backdrop-blur-sm shadow-lg">
              <Volume2 className="w-3 h-3 mr-1" />
              Audio Queue: {audioQueue.length}
            </Badge>
          )}
        </div>

        {/* Enhanced Chat History - Mobile Responsive */}
        {chatVisibility && !showReport && (
          <Card className="fixed bottom-4 left-4 right-4 md:left-4 md:right-auto md:w-96 max-h-96 overflow-y-auto bg-white/98 backdrop-blur-md p-6 shadow-2xl z-40 border-0 rounded-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Interview Transcript
              </h3>
              <div className="flex gap-2">
                <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                  {chatHistory.filter((msg) => msg.role !== "system").length} messages
                </Badge>
                <Badge variant="outline" className={`${getSecurityScoreColor(securityScore)} text-xs border-gray-300`}>
                  Security: {securityScore}%
                </Badge>
              </div>
            </div>
            <Separator className="mb-4" />
            <div className="space-y-4">
              {chatHistory
                .filter((msg) => msg.role !== "system")
                .map((msg, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-xl transition-all duration-200 ${msg.role === "user"
                      ? "bg-gradient-to-r from-blue-50 to-indigo-50 ml-4 border-l-4 border-blue-500 shadow-sm"
                      : "bg-gradient-to-r from-gray-50 to-slate-50 mr-4 border-l-4 border-gray-500 shadow-sm"
                      }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-xs capitalize text-gray-600 flex items-center">
                        {msg.role === "user" ? (
                          <>
                            <Users className="w-3 h-3 mr-1" />
                            You
                          </>
                        ) : (
                          <>
                            <Brain className="w-3 h-3 mr-1" />
                            Interviewer
                          </>
                        )}
                      </span>
                      <span className="text-xs text-gray-400 bg-white/60 px-2 py-1 rounded-full">
                        {msg.timestamp.toLocaleTimeString()}
                      </span>
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
    </TooltipProvider>
  )
}
