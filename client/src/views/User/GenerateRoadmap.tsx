"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
    Send,
    Sparkles,
    Target,
    Code,
    Palette,
    TrendingUp,
    Brain,
    DollarSign,
    BarChart3,
    Zap,
    Clock,
    ArrowRight,
    Mic,
    MicOff,
    Plus,
    Volume2,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

const popularSkills = [
    { name: "Web Development", icon: Code, color: "bg-blue-500/10 text-blue-600 border-blue-200 hover:bg-blue-500/20" },
    {
        name: "UI/UX Design",
        icon: Palette,
        color: "bg-purple-500/10 text-purple-600 border-purple-200 hover:bg-purple-500/20",
    },
    {
        name: "Digital Marketing",
        icon: TrendingUp,
        color: "bg-green-500/10 text-green-600 border-green-200 hover:bg-green-500/20",
    },
    {
        name: "AI & Machine Learning",
        icon: Brain,
        color: "bg-orange-500/10 text-orange-600 border-orange-200 hover:bg-orange-500/20",
    },
    { name: "Data Science", icon: BarChart3, color: "bg-cyan-500/10 text-cyan-600 border-cyan-200 hover:bg-cyan-500/20" },
    {
        name: "Freelancing",
        icon: DollarSign,
        color: "bg-yellow-500/10 text-yellow-600 border-yellow-200 hover:bg-yellow-500/20",
    },
]

const recentSearches: string[] = []

const quickPrompts = [
    "Full-stack developer",
    "Digital marketing",
    "UI/UX design career",
    "Data science",
    "Mobile app development",
    "Cybersecurity expert",
]

export default function GenerateRoadmap() {
    const [inputValue, setInputValue] = useState("")
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)
    const [isListening, setIsListening] = useState(false)
    const [transcript, setTranscript] = useState("")
    const [voiceError, setVoiceError] = useState("")

    const inputRef = useRef<HTMLInputElement>(null)
    const recognitionRef = useRef<any>(null)
    const navigate = useNavigate()

    useEffect(() => {
        // Auto-focus input on mount
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }, [])

    // Initialize speech recognition
    const initializeSpeechRecognition = useCallback(() => {
        if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
            setVoiceError("Speech recognition not supported in this browser")
            return null
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        const recognition = new SpeechRecognition()

        recognition.continuous = false
        recognition.interimResults = true
        recognition.lang = "en-US"
        recognition.maxAlternatives = 1

        recognition.onstart = () => {
            setIsListening(true)
            setVoiceError("")
            setTranscript("")
        }

        recognition.onresult = (event: any) => {
            let interimTranscript = ""
            let finalTranscript = ""

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript
                if (event.results[i].isFinal) {
                    finalTranscript += transcript
                } else {
                    interimTranscript += transcript
                }
            }

            const currentTranscript = finalTranscript || interimTranscript
            setTranscript(currentTranscript)

            if (finalTranscript) {
                setInputValue(finalTranscript.trim())
                setIsListening(false)
            }
        }

        recognition.onerror = (event: any) => {
            console.error("Speech recognition error:", event.error)
            setIsListening(false)
            setVoiceError(`Voice recognition error: ${event.error}`)
        }

        recognition.onend = () => {
            setIsListening(false)
            if (transcript.trim()) {
                setInputValue(transcript.trim())
            }
        }

        return recognition
    }, [transcript])

    // Start voice recognition
    const startVoiceRecognition = useCallback(() => {
        if (!recognitionRef.current) {
            recognitionRef.current = initializeSpeechRecognition()
        }

        if (recognitionRef.current && !isListening) {
            try {
                recognitionRef.current.start()
            } catch (error) {
                console.error("Failed to start voice recognition:", error)
                setVoiceError("Failed to start voice recognition")
            }
        }
    }, [initializeSpeechRecognition, isListening])

    // Stop voice recognition
    const stopVoiceRecognition = useCallback(() => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop()
        }
    }, [isListening])

    // Toggle voice recognition
    const toggleVoiceRecognition = useCallback(() => {
        if (isListening) {
            stopVoiceRecognition()
        } else {
            startVoiceRecognition()
        }
    }, [isListening, startVoiceRecognition, stopVoiceRecognition])

    const handleSubmit = (value?: string) => {
        const skillToGenerate = value || inputValue
        if (skillToGenerate.trim()) {
            setIsGenerating(true)
            console.log("Generating roadmap for:", skillToGenerate)
            // 🔥 Redirect after short delay with state
            setTimeout(() => {
                navigate("/user/process-roadmap", {
                    state: { prompt: skillToGenerate },
                })
            }, 500)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSubmit()
        }
    }

    const handleSkillClick = (skill: string) => {
        setInputValue(skill)
        handleSubmit(skill)
    }

    const handleQuickPrompt = (prompt: string) => {
        setInputValue(`I want to become a ${prompt}`)
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop()
            }
        }
    }, [])

    return (
        <TooltipProvider>
            <div className="min-h-screen w-full bg-white">
                <div className="relative overflow-hidden min-h-screen">
                    {/* Enhanced Background */}
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-700/40 via-indigo-900/10 to-indigo-500/10"></div>
                    <div className="absolute inset-0">
                        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-900/40 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
                    </div>

                    <div className="relative px-4 sm:px-6 lg:px-8 py-20 min-h-screen flex flex-col">
                        {/* Header Section */}
                        <div className="flex-1 flex items-center justify-center">
                            <div className="max-w-4xl mx-auto text-center">
                                {/* Main Title */}
                                <div className="mb-8">
                                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6 hover:bg-white/20 transition-all duration-300">
                                        <Sparkles className="w-4 h-4 mr-2 text-indigo-400" />
                                        <span className="text-sm font-medium text-black">AI-Powered Learning Paths</span>
                                    </div>
                                    <h1 className="font-bold text-4xl sm:text-5xl lg:text-6xl text-gray-900 mb-4">
                                        Which skill do you{" "}
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 animate-gradient">
                                            desire?
                                        </span>
                                    </h1>
                                    <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                                        Tell us what you want to learn, and we'll create a personalized roadmap just for you
                                    </p>
                                </div>

                                {/* Popular Skills */}
                                <div className="mb-8">
                                    <h3 className="text-sm font-medium text-gray-700 mb-4">Popular Skills</h3>
                                    <div className="flex flex-wrap justify-center gap-3">
                                        {popularSkills.map((skill) => (
                                            <Badge
                                                key={skill.name}
                                                className={`${skill.color} cursor-pointer transition-all duration-300 hover:scale-105 border px-4 py-2 text-sm font-medium`}
                                                onClick={() => handleSkillClick(skill.name)}
                                            >
                                                <skill.icon className="w-4 h-4 mr-2" />
                                                {skill.name}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                {/* Optimized Quick Prompts */}
                                <div className="mb-8">
                                    <h3 className="text-sm font-medium text-gray-700 mb-4">Quick Start</h3>
                                    <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
                                        {quickPrompts.map((prompt, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleQuickPrompt(prompt)}
                                                className="inline-flex items-center px-3 py-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-105 group text-sm"
                                            >
                                                <span className="text-gray-700 group-hover:text-gray-900 mr-1">{prompt}</span>
                                                <ArrowRight className="w-3 h-3 text-indigo-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Input Section */}
                        <div className="relative">
                            <div className="max-w-4xl mx-auto">
                                {/* Recent Searches */}
                                {showSuggestions && !inputValue && (
                                    <div className="mb-4 bg-white/90 backdrop-blur-xl rounded-2xl border border-white/50 shadow-2xl p-4">
                                        <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Searches</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {recentSearches.map((search, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => handleQuickPrompt(search)}
                                                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors duration-200"
                                                >
                                                    <Clock className="w-3 h-3 inline mr-1" />
                                                    {search}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Voice Recognition Status */}
                                {isListening && (
                                    <div className="mb-4 bg-gradient-to-r from-green-50 to-emerald-50 backdrop-blur-xl rounded-2xl border border-green-200 shadow-lg p-4">
                                        <div className="flex items-center justify-center">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                                <Volume2 className="w-5 h-5 text-green-600 animate-pulse" />
                                                <span className="text-sm font-medium text-green-700">
                                                    Listening... {transcript && `"${transcript}"`}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Voice Error */}
                                {voiceError && (
                                    <div className="mb-4 bg-red-50 backdrop-blur-xl rounded-2xl border border-red-200 shadow-lg p-4">
                                        <div className="flex items-center justify-center">
                                            <span className="text-sm text-red-600">{voiceError}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Main Input Container */}
                                <div className="relative">
                                    <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl border border-white/50 shadow-2xl hover:shadow-3xl transition-all duration-300">
                                        <div className="flex items-end gap-4">
                                            {/* Input Field */}
                                            <div className="flex-1 relative">
                                                <input
                                                    ref={inputRef}
                                                    type="text"
                                                    value={inputValue}
                                                    onChange={(e) => setInputValue(e.target.value)}
                                                    onKeyPress={handleKeyPress}
                                                    onFocus={() => setShowSuggestions(true)}
                                                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                                    placeholder="Describe the skill you want to master..."
                                                    className="w-full bg-transparent text-gray-900 placeholder-gray-500 text-lg border-0 outline-0 resize-none min-h-[60px] py-4 px-0"
                                                    disabled={isGenerating || isListening}
                                                />
                                                {inputValue && (
                                                    <div className="absolute right-0 top-4">
                                                        <span className="text-xs text-gray-400">{inputValue.length}/500</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-2">
                                                {/* Voice Recognition Button */}
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={toggleVoiceRecognition}
                                                            className={`h-12 w-12 rounded-xl transition-all duration-200 ${isListening
                                                                ? "bg-green-100 hover:bg-green-200 text-green-600"
                                                                : "hover:bg-gray-100 text-gray-600"
                                                                }`}
                                                            disabled={isGenerating}
                                                        >
                                                            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{isListening ? "Stop voice recognition" : "Start voice recognition"}</p>
                                                    </TooltipContent>
                                                </Tooltip>

                                                {/* Generate Button */}
                                                <Button
                                                    onClick={() => handleSubmit()}
                                                    disabled={!inputValue.trim() || isGenerating || isListening}
                                                    className="h-12 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isGenerating ? (
                                                        <>
                                                            <div className="w-5 h-5 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                            Generating...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Send className="w-5 h-5 mr-2" />
                                                            Generate
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Input Footer */}
                                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Zap className="w-3 h-3" />
                                                    AI-powered
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Target className="w-3 h-3" />
                                                    Personalized
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Mic className="w-3 h-3" />
                                                    Voice enabled
                                                </span>
                                            </div>
                                            <div className="text-xs text-gray-400">Press Enter to generate • Click mic for voice input</div>
                                        </div>
                                    </div>

                                    {/* Floating Action Button for Mobile */}
                                    <div className="sm:hidden fixed bottom-6 right-6">
                                        <Button
                                            size="icon"
                                            className="h-14 w-14 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-2xl hover:shadow-3xl transition-all duration-300"
                                            onClick={() => inputRef.current?.focus()}
                                        >
                                            <Plus className="w-6 h-6" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </TooltipProvider>
    )
}
