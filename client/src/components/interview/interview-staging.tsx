"use client"

import type React from "react"
import { useState, useCallback } from "react"
import {
    Upload,
    FileText,
    CheckCircle,
    AlertCircle,
    Globe,
    User,
    Settings,
    ArrowRight,
    Shield,
    Target,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface InterviewConfig {
    questionsFile: File | null
    language: string
    experienceLevel: string
    technology: string
    estimatedDuration: number
    questionCount: number
}

interface ValidationResult {
    isValid: boolean
    errors: string[]
    warnings: string[]
    questionCount: number
    estimatedDuration: number
}

interface InterviewStagingProps {
    onStartInterview: (config: InterviewConfig) => void
}

export default function InterviewStaging({ onStartInterview }: InterviewStagingProps) {
    const [config, setConfig] = useState<InterviewConfig>({
        questionsFile: null,
        language: "",
        experienceLevel: "",
        technology: "",
        estimatedDuration: 0,
        questionCount: 0,
    })

    const [validation, setValidation] = useState<ValidationResult | null>(null)
    const [isValidating, setIsValidating] = useState(false)
    const [dragActive, setDragActive] = useState(false)

    // Validate questions file
    const validateQuestionsFile = useCallback(async (file: File): Promise<ValidationResult> => {
        const result: ValidationResult = {
            isValid: false,
            errors: [],
            warnings: [],
            questionCount: 0,
            estimatedDuration: 0,
        }

        // Check file type
        if (file.type !== "text/plain") {
            result.errors.push("Please upload a .txt file containing your questions")
            return result
        }

        // Check file size (max 1MB)
        if (file.size > 1024 * 1024) {
            result.errors.push("File size must be less than 1MB")
            return result
        }

        try {
            const content = await file.text()
            const lines = content.split("\n").filter((line) => line.trim().length > 0)

            // Count questions (lines that contain question marks or start with numbers)
            const questions = lines.filter((line) => line.includes("?") || /^\d+\.?\s/.test(line.trim()))

            result.questionCount = questions.length

            if (questions.length === 0) {
                result.errors.push(
                    'No questions found in the file. Please ensure questions end with "?" or start with numbers.',
                )
                return result
            }

            if (questions.length < 3) {
                result.warnings.push("Very few questions detected. Consider adding more for a comprehensive interview.")
            }

            if (questions.length > 20) {
                result.warnings.push("Many questions detected. Interview may take longer than expected.")
            }

            // Estimate duration (2-3 minutes per question)
            result.estimatedDuration = Math.ceil(questions.length * 2.5)

            // Check for very short questions
            const shortQuestions = questions.filter((q) => q.trim().length < 20)
            if (shortQuestions.length > questions.length * 0.3) {
                result.warnings.push("Some questions appear very short. Consider adding more detail.")
            }

            result.isValid = result.errors.length === 0
            return result
        } catch (error) {
            result.errors.push("Unable to read file content. Please ensure it's a valid text file.")
            return result
        }
    }, [])

    // Handle file upload
    const handleFileUpload = useCallback(
        async (file: File) => {
            setIsValidating(true)

            try {
                const validationResult = await validateQuestionsFile(file)
                setValidation(validationResult)

                if (validationResult.isValid) {
                    setConfig((prev) => ({
                        ...prev,
                        questionsFile: file,
                        questionCount: validationResult.questionCount,
                        estimatedDuration: validationResult.estimatedDuration,
                    }))
                }
            } catch (error) {
                setValidation({
                    isValid: false,
                    errors: ["Failed to validate file. Please try again."],
                    warnings: [],
                    questionCount: 0,
                    estimatedDuration: 0,
                })
            } finally {
                setIsValidating(false)
            }
        },
        [validateQuestionsFile],
    )

    // Handle drag and drop
    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }, [])

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault()
            e.stopPropagation()
            setDragActive(false)

            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFileUpload(e.dataTransfer.files[0])
            }
        },
        [handleFileUpload],
    )

    // Handle file input change
    const handleFileInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0])
            }
        },
        [handleFileUpload],
    )

    // Check if form is complete
    const isFormComplete =
        config.questionsFile && validation?.isValid && config.language && config.experienceLevel && config.technology

    // Handle start interview
    const handleStartInterview = () => {
        if (isFormComplete) {
            onStartInterview(config)
        }
    }

    return (
        <TooltipProvider>
            <div className="min-h-screen bg-background">
                {/* Header */}
                <header className="border-b border-border bg-card">
                    <div className="max-w-4xl mx-auto px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                                    <Shield className="w-6 h-6 text-primary-foreground" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-serif font-bold text-foreground">Interview Simulator</h1>
                                    <p className="text-sm text-muted-foreground">Professional Interview Practice</p>
                                </div>
                            </div>
                            <Badge variant="secondary" className="bg-muted">
                                Setup Phase
                            </Badge>
                        </div>
                    </div>
                </header>

                <main className="max-w-4xl mx-auto px-6 py-8">
                    <div className="space-y-8">
                        {/* Progress Indicator */}
                        <div className="flex items-center justify-center gap-4 mb-8">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                                    1
                                </div>
                                <span className="text-sm font-medium">Setup</span>
                            </div>
                            <div className="w-12 h-px bg-border"></div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                                    2
                                </div>
                                <span className="text-sm text-muted-foreground">Interview</span>
                            </div>
                            <div className="w-12 h-px bg-border"></div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                                    3
                                </div>
                                <span className="text-sm text-muted-foreground">Report</span>
                            </div>
                        </div>

                        {/* File Upload Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 font-serif">
                                    <Upload className="w-5 h-5 text-primary" />
                                    Upload Interview Questions
                                </CardTitle>
                                <CardDescription>
                                    Upload a .txt file containing your interview questions. Each question should be on a separate line.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div
                                    className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
                                            ? "border-primary bg-primary/5"
                                            : validation?.isValid
                                                ? "border-green-300 bg-green-50"
                                                : "border-border bg-muted/30"
                                        }`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                >
                                    <input
                                        type="file"
                                        accept=".txt"
                                        onChange={handleFileInputChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        disabled={isValidating}
                                    />

                                    {isValidating ? (
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                            <p className="text-sm text-muted-foreground">Validating questions...</p>
                                        </div>
                                    ) : config.questionsFile && validation?.isValid ? (
                                        <div className="flex flex-col items-center gap-3">
                                            <CheckCircle className="w-12 h-12 text-green-600" />
                                            <div>
                                                <p className="font-medium text-foreground">{config.questionsFile.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {validation.questionCount} questions • ~{validation.estimatedDuration} minutes
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-3">
                                            <FileText className="w-12 h-12 text-muted-foreground" />
                                            <div>
                                                <p className="font-medium text-foreground">Drop your questions file here</p>
                                                <p className="text-sm text-muted-foreground">or click to browse (.txt files only)</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Validation Results */}
                                {validation && (
                                    <div className="mt-4 space-y-2">
                                        {validation.errors.map((error, index) => (
                                            <Alert key={index} variant="destructive">
                                                <AlertCircle className="h-4 w-4" />
                                                <AlertDescription>{error}</AlertDescription>
                                            </Alert>
                                        ))}
                                        {validation.warnings.map((warning, index) => (
                                            <Alert key={index}>
                                                <AlertCircle className="h-4 w-4" />
                                                <AlertDescription>{warning}</AlertDescription>
                                            </Alert>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Configuration Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Language Selection */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 font-serif">
                                        <Globe className="w-5 h-5 text-primary" />
                                        Interview Language
                                    </CardTitle>
                                    <CardDescription>Select the language for your interview session</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Select
                                        value={config.language}
                                        onValueChange={(value) => setConfig((prev) => ({ ...prev, language: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose language" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="english">🇺🇸 English</SelectItem>
                                            <SelectItem value="hindi">🇮🇳 Hindi (हिंदी)</SelectItem>
                                            <SelectItem value="roman-urdu">🇵🇰 Roman Urdu (رومن اردو)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </CardContent>
                            </Card>

                            {/* Experience Level */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 font-serif">
                                        <User className="w-5 h-5 text-primary" />
                                        Experience Level
                                    </CardTitle>
                                    <CardDescription>Your current experience level</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Select
                                        value={config.experienceLevel}
                                        onValueChange={(value) => setConfig((prev) => ({ ...prev, experienceLevel: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                                            <SelectItem value="mid">Mid Level (2-5 years)</SelectItem>
                                            <SelectItem value="senior">Senior Level (5+ years)</SelectItem>
                                            <SelectItem value="lead">Lead/Principal (8+ years)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Technology Focus */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 font-serif">
                                    <Target className="w-5 h-5 text-primary" />
                                    Technology Focus
                                </CardTitle>
                                <CardDescription>Primary technology or domain for this interview</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Select
                                    value={config.technology}
                                    onValueChange={(value) => setConfig((prev) => ({ ...prev, technology: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select technology" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="javascript">JavaScript</SelectItem>
                                        <SelectItem value="python">Python</SelectItem>
                                        <SelectItem value="java">Java</SelectItem>
                                        <SelectItem value="react">React</SelectItem>
                                        <SelectItem value="nodejs">Node.js</SelectItem>
                                        <SelectItem value="angular">Angular</SelectItem>
                                        <SelectItem value="vue">Vue.js</SelectItem>
                                        <SelectItem value="php">PHP</SelectItem>
                                        <SelectItem value="csharp">C#</SelectItem>
                                        <SelectItem value="golang">Go</SelectItem>
                                        <SelectItem value="rust">Rust</SelectItem>
                                        <SelectItem value="general">General Programming</SelectItem>
                                    </SelectContent>
                                </Select>
                            </CardContent>
                        </Card>

                        {/* Interview Summary */}
                        {isFormComplete && (
                            <Card className="bg-card border-primary/20">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 font-serif text-primary">
                                        <Settings className="w-5 h-5" />
                                        Interview Summary
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-primary">{config.questionCount}</div>
                                            <div className="text-sm text-muted-foreground">Questions</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-primary">~{config.estimatedDuration}m</div>
                                            <div className="text-sm text-muted-foreground">Duration</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-primary capitalize">{config.language}</div>
                                            <div className="text-sm text-muted-foreground">Language</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-primary capitalize">{config.technology}</div>
                                            <div className="text-sm text-muted-foreground">Technology</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Start Interview Button */}
                        <div className="flex justify-center pt-6">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        onClick={handleStartInterview}
                                        disabled={!isFormComplete}
                                        size="lg"
                                        className="px-8 py-3 text-lg font-semibold"
                                    >
                                        Start Secure Interview
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    {!isFormComplete
                                        ? "Please complete all required fields to start the interview"
                                        : "Begin your AI-powered interview session"}
                                </TooltipContent>
                            </Tooltip>
                        </div>

                        {/* Security Notice */}
                        <Alert className="bg-muted border-primary/20">
                            <Shield className="h-4 w-4 text-primary" />
                            <AlertDescription>
                                <strong>Security Notice:</strong> This interview will be conducted in fullscreen mode with advanced
                                monitoring. Camera access will be required for identity verification, and all activities will be logged
                                for assessment purposes.
                            </AlertDescription>
                        </Alert>
                    </div>
                </main>
            </div>
        </TooltipProvider>
    )
}
