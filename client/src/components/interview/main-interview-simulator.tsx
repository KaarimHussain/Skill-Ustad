"use client"
import { useState, useRef, useCallback, useEffect } from "react"
import {
    Mic,
    Volume2,
    VolumeX,
    Square,
    Play,
    Pause,
    Loader2,
    AlertTriangle,
    Eye,
    EyeOff,
    MessageSquare,
    Clock,
    Shield,
    Camera,
    Activity,
    FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getLanguageConfig, getUIText } from "@/utils/language-config"

interface InterviewConfig {
    questionsFile: File | null
    language: string
    experienceLevel: string
    technology: string
    estimatedDuration: number
    questionCount: number
}

interface ChatMessage {
    role: "user" | "assistant"
    content: string
    timestamp: Date
}

interface SecurityEvent {
    type: "tab_blur" | "window_blur" | "fullscreen_exit" | "prohibited_key" | "right_click" | "focus_loss"
    timestamp: Date
    duration?: number
    details?: string
}

interface CaptureData {
    image: string
    timestamp: Date
    timing: "start" | "middle" | "end"
    index: number
}

type InterviewState = "idle" | "listening" | "processing" | "speaking" | "error" | "completed"

interface MainInterviewSimulatorProps {
    config: InterviewConfig
    onComplete: (results: any) => void
    onExit: () => void
}

export default function MainInterviewSimulator({ config, onComplete, onExit }: MainInterviewSimulatorProps) {
    // Core state
    const [currentState, setCurrentState] = useState<InterviewState>("idle")
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
    const [currentTranscript, setCurrentTranscript] = useState("")
    const [speechBuffer, setSpeechBuffer] = useState("")
    const [pauseCount, setPauseCount] = useState(0)
    const [isUserCurrentlySpeaking, setIsUserCurrentlySpeaking] = useState(false)

    // Interview progress
    const [interviewStarted, setInterviewStarted] = useState(false)
    const [interviewCompleted, setInterviewCompleted] = useState(false)
    const [questionCount, setQuestionCount] = useState(0)
    const [interviewStartTime, setInterviewStartTime] = useState<Date | null>(null)

    // Audio and speech
    const [isAudioEnabled, setIsAudioEnabled] = useState(true)
    const [audioQueue, setAudioQueue] = useState<string[]>([])
    const [isProcessingAudio, setIsProcessingAudio] = useState(false)

    // Security monitoring
    const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([])
    const [securityScore, setSecurityScore] = useState(100)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [showSecurityWarning, setShowSecurityWarning] = useState(false)
    const [tabBlurCount, setTabBlurCount] = useState(0)
    const [windowBlurCount, setWindowBlurCount] = useState(0)
    const [focusLossCount, setFocusLossCount] = useState(0)

    // Camera and monitoring
    const [captureCount, setCaptureCount] = useState(0)
    const [cameraInitialized, setCameraInitialized] = useState(false)
    const [captureList, setCaptureList] = useState<CaptureData[]>([])
    const [nextCaptureTime, setNextCaptureTime] = useState<number | null>(null)

    // UI state
    const [showTranscript, setShowTranscript] = useState(false)
    const [connectionError, setConnectionError] = useState(false)

    // Refs
    const recognitionRef = useRef<any>(null)
    const currentAudioRef = useRef<HTMLAudioElement | null>(null)
    const pauseTimerRef = useRef<NodeJS.Timeout | null>(null)
    const speechBufferRef = useRef("")
    const streamRef = useRef<MediaStream | null>(null)
    const videoRef = useRef<HTMLVideoElement | null>(null)
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const tabBlurTimerRef = useRef<NodeJS.Timeout | null>(null)
    const windowBlurTimerRef = useRef<NodeJS.Timeout | null>(null)
    const captureIntervalRef = useRef<NodeJS.Timeout | null>(null)

    const languageConfig = getLanguageConfig(config.language)
    const t = (key: string) => getUIText(config.language, key as any)

    // Get questions from uploaded file
    const getQuestions = useCallback(async (): Promise<string> => {
        if (!config.questionsFile) return ""

        try {
            const content = await config.questionsFile.text()
            return content
        } catch (error) {
            console.error("Failed to read questions file:", error)
            return ""
        }
    }, [config.questionsFile])

    // Initialize speech recognition
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
        recognition.lang = languageConfig.speechLang
        recognition.maxAlternatives = 1

        if (config.language === "roman-urdu") {
            // For Roman Urdu, we use English speech recognition but with specific settings
            recognition.lang = "en-US"
            // Add custom grammar or vocabulary hints if supported
            if (recognition.grammars) {
                const grammar = new (window as any).SpeechGrammarList()
                // Add common Roman Urdu words that might be recognized as English
                const romanUrduHints = "aap | hai | kar | ke | mein | se | ko | ki | ka | ye | wo | kya | kaise | kahan | kab"
                grammar.addFromString(`#JSGF V1.0; grammar romanUrdu; public <romanUrdu> = ${romanUrduHints};`, 1)
                recognition.grammars = grammar
            }
        }

        recognition.onstart = () => {
            setCurrentState("listening")
            setConnectionError(false)
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
            }
        }

        recognition.onend = () => {
            if (currentState === "listening" && !interviewCompleted) {
                setTimeout(() => {
                    if (recognitionRef.current && !interviewCompleted) {
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
    }, [languageConfig, config.language, currentState, interviewCompleted])

    // Reset pause timer for speech detection
    const resetPauseTimer = useCallback(() => {
        if (pauseTimerRef.current) {
            clearTimeout(pauseTimerRef.current)
        }

        setPauseCount(0)
        setIsUserCurrentlySpeaking(true)

        pauseTimerRef.current = setTimeout(() => {
            setIsUserCurrentlySpeaking(false)

            let pauseSeconds = 0
            const pauseInterval = setInterval(() => {
                pauseSeconds++
                setPauseCount(pauseSeconds)

                if (pauseSeconds >= 4) {
                    clearInterval(pauseInterval)

                    if (speechBufferRef.current.trim().length > 5) {
                        const finalSpeech = speechBufferRef.current.trim()

                        speechBufferRef.current = ""
                        setSpeechBuffer("")
                        setPauseCount(0)
                        setCurrentTranscript("")

                        handleSubmitTranscript(finalSpeech)
                    }
                }
            }, 1000)
        }, 4000)
    }, [])

    // Handle transcript submission
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
                // Simulate AI response (replace with actual AI service)
                await new Promise((resolve) => setTimeout(resolve, 1000))

                const aiResponse = `Thank you for your response. Let me ask you another question about ${config.technology}...`

                const assistantMessage: ChatMessage = {
                    role: "assistant",
                    content: aiResponse,
                    timestamp: new Date(),
                }

                const finalChat = [...updatedChat, assistantMessage]
                setChatHistory(finalChat)
                setQuestionCount((prev) => prev + 1)

                await speakText(aiResponse)
            } catch (error) {
                console.error("Error processing request:", error)
                setCurrentState("error")
                setConnectionError(true)
            }
        },
        [chatHistory, interviewCompleted, config.technology],
    )

    // Text-to-speech function
    const speakText = useCallback(
        async (text: string) => {
            if (!isAudioEnabled || interviewCompleted) return

            setCurrentState("speaking")

            try {
                // Use Web Speech API for TTS
                const utterance = new SpeechSynthesisUtterance(text)
                utterance.lang = languageConfig.ttsLang
                utterance.rate = 0.9
                utterance.pitch = 1

                if (config.language === "roman-urdu") {
                    // For Roman Urdu, try to find Urdu voice or fallback to English
                    const voices = speechSynthesis.getVoices()
                    const urduVoice =
                        voices.find((voice) => voice.lang.startsWith("ur")) || voices.find((voice) => voice.lang.startsWith("en"))
                    if (urduVoice) {
                        utterance.voice = urduVoice
                    }
                    utterance.rate = 0.8 // Slightly slower for Roman Urdu
                } else if (config.language === "hindi") {
                    // For Hindi, find Hindi voice
                    const voices = speechSynthesis.getVoices()
                    const hindiVoice = voices.find((voice) => voice.lang.startsWith("hi"))
                    if (hindiVoice) {
                        utterance.voice = hindiVoice
                    }
                    utterance.rate = 0.85 // Slightly slower for Hindi
                }

                utterance.onend = () => {
                    setCurrentState("idle")
                    if (interviewStarted && !interviewCompleted) {
                        setTimeout(startListening, 500)
                    }
                }

                utterance.onerror = () => {
                    setCurrentState("error")
                    setConnectionError(true)
                }

                speechSynthesis.speak(utterance)
            } catch (error) {
                console.error("TTS error:", error)
                setCurrentState("error")
                setConnectionError(true)
            }
        },
        [isAudioEnabled, interviewCompleted, languageConfig, config.language, interviewStarted],
    )

    // Start listening
    const startListening = useCallback(() => {
        if (interviewCompleted) return

        if (!recognitionRef.current) {
            recognitionRef.current = initializeSpeechRecognition()
        }

        if (recognitionRef.current && currentState !== "listening") {
            try {
                speechBufferRef.current = ""
                setSpeechBuffer("")
                setPauseCount(0)
                setConnectionError(false)

                recognitionRef.current.start()
            } catch (error) {
                console.error("Failed to start recognition:", error)
                setCurrentState("error")
                setConnectionError(true)
            }
        }
    }, [currentState, initializeSpeechRecognition, interviewCompleted])

    // Stop listening
    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop()
        }

        if (pauseTimerRef.current) {
            clearTimeout(pauseTimerRef.current)
        }

        speechBufferRef.current = ""
        setSpeechBuffer("")
        setCurrentTranscript("")
        setPauseCount(0)
        setIsUserCurrentlySpeaking(false)

        if (currentState === "listening") {
            setCurrentState("idle")
        }
    }, [currentState])

    const setupCamera = useCallback(async () => {
        if (cameraInitialized || !interviewStarted) return

        try {
            console.log("Setting up camera...")
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
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
                const photoData: CaptureData = {
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

    const scheduleRandomCapture = useCallback(() => {
        if (!interviewStarted || interviewCompleted || captureCount >= 8) return

        // Random interval between 30-90 seconds
        const randomInterval = Math.random() * 60000 + 30000
        setNextCaptureTime(Date.now() + randomInterval)

        if (captureIntervalRef.current) {
            clearTimeout(captureIntervalRef.current)
        }

        captureIntervalRef.current = setTimeout(() => {
            if (interviewStarted && !interviewCompleted && captureCount < 8) {
                takePhoto("middle")
                scheduleRandomCapture() // Schedule next random capture
            }
        }, randomInterval)
    }, [interviewStarted, interviewCompleted, captureCount, takePhoto])

    const logSecurityEvent = useCallback((event: SecurityEvent) => {
        setSecurityEvents((prev) => [...prev, event])

        let scoreDeduction = 0
        switch (event.type) {
            case "tab_blur":
                scoreDeduction = event.duration && event.duration > 5000 ? 15 : 5
                setTabBlurCount((prev) => prev + 1)
                break
            case "window_blur":
                scoreDeduction = event.duration && event.duration > 3000 ? 10 : 3
                setWindowBlurCount((prev) => prev + 1)
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
                setFocusLossCount((prev) => prev + 1)
                break
        }

        setSecurityScore((prev) => Math.max(0, prev - scoreDeduction))

        if (scoreDeduction > 10) {
            setShowSecurityWarning(true)
            setTimeout(() => setShowSecurityWarning(false), 5000)
        }
    }, [])

    // Enter fullscreen
    const enterFullscreen = useCallback(() => {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen()
        }
    }, [])

    // Start interview
    const startInterview = useCallback(async () => {
        enterFullscreen()
        setInterviewStarted(true)
        setInterviewStartTime(new Date())

        await setupCamera()

        setTimeout(() => scheduleRandomCapture(), 30000) // First random capture after 30 seconds

        const questions = await getQuestions()
        const welcomeMessage = `Welcome to your ${config.technology} interview. I'll be asking you questions based on your ${config.experienceLevel} experience level. Let's begin with the first question.`

        const assistantMessage: ChatMessage = {
            role: "assistant",
            content: welcomeMessage,
            timestamp: new Date(),
        }

        setChatHistory([assistantMessage])
        setQuestionCount(1)
        await speakText(welcomeMessage)
    }, [config, enterFullscreen, setupCamera, getQuestions, speakText, scheduleRandomCapture])

    // Complete interview
    const completeInterview = useCallback(() => {
        setInterviewCompleted(true)
        setCurrentState("completed")
        stopListening()

        if (cameraInitialized) {
            takePhoto("end")
        }

        // Cleanup camera
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

        // Generate results and call onComplete
        const results = {
            chatHistory,
            securityEvents,
            securityScore,
            questionCount,
            duration: interviewStartTime ? Date.now() - interviewStartTime.getTime() : 0,
            captureCount,
            captureList,
            tabBlurCount,
            windowBlurCount,
            focusLossCount,
        }

        onComplete(results)
    }, [
        chatHistory,
        securityEvents,
        securityScore,
        questionCount,
        interviewStartTime,
        captureCount,
        captureList,
        tabBlurCount,
        windowBlurCount,
        focusLossCount,
        onComplete,
        stopListening,
        cameraInitialized,
        takePhoto,
    ])

    useEffect(() => {
        if (interviewCompleted) return

        const handleVisibilityChange = () => {
            if (document.hidden) {
                const startTime = Date.now()
                tabBlurTimerRef.current = setTimeout(() => {
                    const duration = Date.now() - startTime
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
            windowBlurTimerRef.current = setTimeout(() => {
                const duration = Date.now() - startTime
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

            if (!isCurrentlyFullscreen && interviewStarted) {
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
    }, [interviewStarted, interviewCompleted, logSecurityEvent])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop()
            }
            if (pauseTimerRef.current) {
                clearTimeout(pauseTimerRef.current)
            }
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop())
            }
            if (captureIntervalRef.current) {
                clearTimeout(captureIntervalRef.current)
            }
        }
    }, [])

    // Helper functions
    const getStateColor = () => {
        switch (currentState) {
            case "listening":
                return "bg-green-500"
            case "processing":
                return "bg-yellow-500"
            case "speaking":
                return "bg-blue-500"
            case "error":
                return "bg-red-500"
            case "completed":
                return "bg-purple-500"
            default:
                return "bg-gray-500"
        }
    }

    const getStateText = () => {
        switch (currentState) {
            case "listening":
                return isUserCurrentlySpeaking
                    ? `${t("speaking")} ${pauseCount > 0 ? `(${t("pauseDetected")} ${pauseCount}s)` : ""}`
                    : t("listening")
            case "processing":
                return t("processing")
            case "speaking":
                return t("speaking")
            case "error":
                return connectionError ? t("connectionError") : t("systemError")
            case "completed":
                return t("interviewComplete")
            default:
                return interviewStarted ? t("ready") : t("startInterview")
        }
    }

    const getSecurityScoreColor = (score: number) => {
        if (score >= 80) return "text-green-600"
        if (score >= 60) return "text-yellow-600"
        return "text-red-600"
    }

    return (
        <TooltipProvider>
            <div className="min-h-screen bg-background relative" dir={languageConfig.rtl ? "rtl" : "ltr"}>
                {/* Security Warning */}
                {showSecurityWarning && (
                    <Alert className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-destructive/10 border-destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{t("securityViolation")}</AlertDescription>
                    </Alert>
                )}

                {/* Header Controls */}
                <div className="fixed top-4 right-4 flex gap-2 z-40">
                    <Badge variant="outline" className={`bg-background/90 ${getSecurityScoreColor(securityScore)}`}>
                        <Shield className="w-3 h-3 mr-1" />
                        Security: {securityScore}%
                    </Badge>

                    {cameraInitialized && (
                        <Badge variant="outline" className="bg-background/90 text-purple-600">
                            <Camera className="w-3 h-3 mr-1" />
                            Photos: {captureCount}
                        </Badge>
                    )}

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                                className="bg-background/90"
                            >
                                {isAudioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>{isAudioEnabled ? t("disableAudio") : t("enableAudio")}</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowTranscript(!showTranscript)}
                                className="bg-background/90"
                            >
                                {showTranscript ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>{showTranscript ? t("hideTranscript") : t("showTranscript")}</TooltipContent>
                    </Tooltip>

                    {interviewStarted && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={onExit}
                                    className="bg-background/90 text-destructive border-destructive"
                                >
                                    Exit
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>{t("exitInterview")}</TooltipContent>
                        </Tooltip>
                    )}
                </div>

                {/* Status Panel */}
                <div className="fixed top-4 left-4 flex flex-col gap-2 z-40">
                    {isFullscreen && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                            {t("fullscreenActive")}
                        </Badge>
                    )}
                    {interviewStarted && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                            <MessageSquare className="w-3 h-3 mr-1" />
                            {t("question")} {questionCount}
                        </Badge>
                    )}
                    {(tabBlurCount > 0 || windowBlurCount > 0 || focusLossCount > 0) && (
                        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-300">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            {t("focusLost")} {focusLossCount}x
                        </Badge>
                    )}
                    {nextCaptureTime && (
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300">
                            <Clock className="w-3 h-3 mr-1" />
                            {t("nextPhoto")} {Math.max(0, Math.ceil((nextCaptureTime - Date.now()) / 1000))}s
                        </Badge>
                    )}
                </div>

                {/* Main Interface */}
                <div className="flex flex-col items-center justify-center min-h-screen p-8">
                    {/* Status Display */}
                    <Card className="mb-8 bg-card/95 backdrop-blur">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div
                                    className={`w-4 h-4 rounded-full ${getStateColor()} ${currentState === "listening" ? "animate-pulse" : ""}`}
                                />
                                <span className="font-medium">{getStateText()}</span>
                                {connectionError && <AlertTriangle className="w-4 h-4 text-destructive" />}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Speech Buffer Display */}
                    {speechBuffer && (
                        <Card className="mb-8 max-w-2xl bg-card/95 backdrop-blur">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <Mic className="w-5 h-5 text-primary mt-1" />
                                    <div>
                                        <p className="font-medium mb-2">{t("yourResponse")}</p>
                                        <p className="text-muted-foreground italic">"{speechBuffer}"</p>
                                        {pauseCount > 0 && (
                                            <div className="mt-2 text-sm text-orange-600">
                                                <Clock className="w-3 h-3 inline mr-1" />
                                                {t("pauseDetected")} {pauseCount}s ({t("processingIn")} {4 - pauseCount}s)
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Current Transcript */}
                    {currentTranscript && !speechBuffer && (
                        <Card className="mb-8 max-w-lg bg-card/95 backdrop-blur">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <Activity className="w-5 h-5 text-blue-500 mt-1" />
                                    <div>
                                        <p className="font-medium mb-2">{t("liveTranscript")}</p>
                                        <p className="text-muted-foreground italic">"{currentTranscript}"</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Main Action Button */}
                    <div className="relative mb-8">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={
                                        interviewCompleted
                                            ? completeInterview
                                            : connectionError
                                                ? () => setConnectionError(false)
                                                : interviewStarted
                                                    ? currentState === "listening"
                                                        ? stopListening
                                                        : startListening
                                                    : startInterview
                                    }
                                    disabled={currentState === "processing" || currentState === "speaking"}
                                    className={`w-32 h-32 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center text-4xl transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${currentState === "listening" ? "animate-pulse" : ""
                                        }`}
                                >
                                    {interviewCompleted ? (
                                        <FileText className="w-12 h-12" />
                                    ) : connectionError ? (
                                        <AlertTriangle className="w-12 h-12" />
                                    ) : currentState === "listening" ? (
                                        <Square className="w-12 h-12" />
                                    ) : currentState === "speaking" ? (
                                        <Volume2 className="w-12 h-12" />
                                    ) : currentState === "processing" ? (
                                        <Loader2 className="w-12 h-12 animate-spin" />
                                    ) : interviewStarted ? (
                                        <Mic className="w-12 h-12" />
                                    ) : (
                                        <Play className="w-12 h-12" />
                                    )}
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>
                                {interviewCompleted
                                    ? t("completeInterview")
                                    : connectionError
                                        ? t("retryConnection")
                                        : interviewStarted
                                            ? currentState === "listening"
                                                ? t("stopListening")
                                                : t("startListening")
                                            : t("beginInterview")}
                            </TooltipContent>
                        </Tooltip>
                    </div>

                    {/* Action Buttons */}
                    {interviewStarted && !interviewCompleted && (
                        <div className="flex gap-4">
                            {currentState === "speaking" && (
                                <Button onClick={() => speechSynthesis.cancel()} variant="outline" size="sm">
                                    <Pause className="w-4 h-4 mr-2" />
                                    {t("stopSpeaking")}
                                </Button>
                            )}

                            <Button
                                onClick={completeInterview}
                                variant="outline"
                                size="sm"
                                className="text-destructive border-destructive bg-transparent"
                            >
                                <Square className="w-4 h-4 mr-2" />
                                {t("endInterview")}
                            </Button>
                        </div>
                    )}
                </div>

                {/* Transcript Panel */}
                {showTranscript && (
                    <Card className="fixed bottom-4 left-4 right-4 md:left-4 md:right-auto md:w-96 max-h-80 overflow-y-auto bg-card/95 backdrop-blur z-30">
                        <CardContent className="p-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-medium flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4" />
                                    {t("transcript")}
                                </h3>
                                <Badge variant="secondary" className="text-xs">
                                    {chatHistory.length} {t("messages")}
                                </Badge>
                            </div>
                            <div className="space-y-3">
                                {chatHistory.map((msg, i) => (
                                    <div
                                        key={i}
                                        className={`p-3 rounded-lg ${msg.role === "user" ? "bg-primary/10 ml-4" : "bg-muted mr-4"}`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-xs font-medium capitalize">
                                                {msg.role === "user" ? t("you") : t("interviewer")}
                                            </span>
                                            <span className="text-xs text-muted-foreground">{msg.timestamp.toLocaleTimeString()}</span>
                                        </div>
                                        <p className="text-sm">{msg.content}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Hidden canvas for camera captures */}
                <canvas ref={canvasRef} className="hidden" />
            </div>
        </TooltipProvider>
    )
}
