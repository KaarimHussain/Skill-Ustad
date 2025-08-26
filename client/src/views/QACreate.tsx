"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ArrowLeft, X, Plus, Eye, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { RichTextEditor } from "@/components/QAContent"
import { RichContent } from "@/components/QAContent"
import Logo from "@/components/Logo"
import { useNavigate } from "react-router-dom"
import AuthService from "@/services/auth.service"
import QAService, { type Question } from "@/services/qa.service"
import NotificationService from "@/components/Notification"

export default function QACreate() {
    const navigate = useNavigate()

    // Form state
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [tags, setTags] = useState<string[]>([])
    const [currentTag, setCurrentTag] = useState("")
    const [isPreview, setIsPreview] = useState(false)
    const [errors, setErrors] = useState<{ [key: string]: string }>({})

    // UI state
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isDraftSaving, setIsDraftSaving] = useState(false)

    // User authentication
    const [currentUser, setCurrentUser] = useState<any>(null)
    const userId = AuthService.getAuthenticatedUserId()

    // Check authentication on component mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                if (!userId) {
                    NotificationService.error("Authentication Required", "You must be logged in to ask a question.")
                    navigate("/login")
                    return
                }

                // Get current user data (you might need to implement this in AuthService)
                const userData = AuthService.getAuthenticatedUserData() // Implement this method
                setCurrentUser(userData)
            } catch (error) {
                console.error("Authentication check failed:", error)
                NotificationService.error("Authentication Error", "Failed to verify your login status.")
                navigate("/login")
            }
        }

        checkAuth()
    }, [userId, navigate])

    const handleAddTag = () => {
        const trimmedTag = currentTag.trim().toLowerCase()

        if (!trimmedTag) {
            NotificationService.error("Invalid Tag", "Tag cannot be empty.")
            return
        }

        if (tags.includes(trimmedTag)) {
            NotificationService.error("Duplicate Tag", "This tag has already been added.")
            return
        }

        if (tags.length >= 5) {
            NotificationService.error("Tag Limit Reached", "You can only add up to 5 tags.")
            return
        }

        // Validate tag format (alphanumeric and hyphens only)
        if (!/^[a-z0-9-]+$/.test(trimmedTag)) {
            NotificationService.error("Invalid Tag Format", "Tags can only contain lowercase letters, numbers, and hyphens.")
            return
        }

        if (trimmedTag.length < 2) {
            NotificationService.error("Tag Too Short", "Tags must be at least 2 characters long.")
            return
        }

        if (trimmedTag.length > 25) {
            NotificationService.error("Tag Too Long", "Tags cannot exceed 25 characters.")
            return
        }

        setTags([...tags, trimmedTag])
        setCurrentTag("")

        // Clear tag errors if any
        const newErrors = { ...errors }
        delete newErrors.tags
        setErrors(newErrors)
    }

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter((tag) => tag !== tagToRemove))
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault()
            handleAddTag()
        }
    }

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {}

        // Title validation
        if (!title.trim()) {
            newErrors.title = "Title is required"
        } else if (title.trim().length < 15) {
            newErrors.title = "Title must be at least 15 characters"
        } else if (title.trim().length > 150) {
            newErrors.title = "Title cannot exceed 150 characters"
        }

        // Content validation
        if (!content.trim()) {
            newErrors.content = "Question body is required"
        } else if (content.trim().length < 30) {
            newErrors.content = "Question body must be at least 30 characters"
        } else if (content.trim().length > 10000) {
            newErrors.content = "Question body cannot exceed 10,000 characters"
        }

        // Tags validation
        if (tags.length === 0) {
            newErrors.tags = "At least one tag is required"
        } else if (tags.length > 5) {
            newErrors.tags = "Maximum 5 tags allowed"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const saveDraft = async () => {
        if (!title.trim() && !content.trim() && tags.length === 0) {
            return // Nothing to save
        }

        try {
            setIsDraftSaving(true)

            // Save to localStorage as a simple draft mechanism
            const draftData = {
                title: title.trim(),
                content: content.trim(),
                tags,
                savedAt: new Date().toISOString()
            }

            localStorage.setItem('qa_draft', JSON.stringify(draftData))
            NotificationService.success("Draft Saved", "Your question has been saved as a draft.")
        } catch (error) {
            console.error("Error saving draft:", error)
            NotificationService.error("Save Failed", "Failed to save your draft.")
        } finally {
            setIsDraftSaving(false)
        }
    }

    const loadDraft = () => {
        try {
            const savedDraft = localStorage.getItem('qa_draft')
            if (savedDraft) {
                const draftData = JSON.parse(savedDraft)
                setTitle(draftData.title || "")
                setContent(draftData.content || "")
                setTags(draftData.tags || [])
                NotificationService.success("Draft Loaded", "Your saved draft has been restored.")
            }
        } catch (error) {
            console.error("Error loading draft:", error)
            NotificationService.error("Load Failed", "Failed to load your draft.")
        }
    }

    const handleSubmit = async () => {
        if (!validateForm()) {
            NotificationService.error("Validation Error", "Please fix the errors before submitting.")
            return
        }

        if (!currentUser) {
            NotificationService.error("Authentication Required", "You must be logged in to post a question.")
            navigate("/login")
            return
        }

        const userId = AuthService.getAuthenticatedUserId();
        if (!userId) {
            NotificationService.error("Authentication Required", "You must be logged in to post a question.")
            navigate("/login");
            return
        }
        try {
            setIsSubmitting(true)

            const questionData: Omit<Question, 'id' | 'createdAt'> = {
                title: title.trim(),
                content: content.trim(),
                author: {
                    name: currentUser.name || currentUser.email || "Anonymous User",
                    avatar: currentUser.avatar || "/default-avatar.png",
                    reputation: currentUser.reputation || 0,
                    badges: currentUser.badges || [],
                    joinedDate: currentUser.joinedDate || "Recently",
                    userId: userId
                },
                tags,
                votes: 0,
                views: 0,
                isAnswered: false
            }

            await QAService.addQuestion(questionData)

            // Clear the form and draft
            setTitle("")
            setContent("")
            setTags([])
            setErrors({})
            localStorage.removeItem('qa_draft')

            NotificationService.success(
                "Question Posted!",
                "Your question has been successfully posted and is now visible to the community."
            )

            // Navigate back to Q&A list after a short delay
            setTimeout(() => {
                navigate("/qa")
            }, 2000)

        } catch (error) {
            console.error("Error submitting question:", error)
            NotificationService.error(
                "Submission Failed",
                error instanceof Error ? error.message : "An unexpected error occurred while posting your question."
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    // Load draft on component mount
    useEffect(() => {
        const savedDraft = localStorage.getItem('qa_draft')
        if (savedDraft) {
            try {
                const draftData = JSON.parse(savedDraft)
                const savedAt = new Date(draftData.savedAt)
                const hoursSinceSaved = (Date.now() - savedAt.getTime()) / (1000 * 60 * 60)

                // Only auto-load drafts saved within the last 24 hours
                if (hoursSinceSaved < 24) {
                    // Show notification asking if user wants to load draft
                    setTimeout(() => {
                        if (window.confirm("We found a saved draft. Would you like to restore it?")) {
                            loadDraft()
                        }
                    }, 1000)
                }
            } catch (error) {
                console.error("Error checking draft:", error)
            }
        }
    }, [])

    const suggestedTags = [
        "javascript",
        "react",
        "nextjs",
        "typescript",
        "nodejs",
        "python",
        "css",
        "html",
        "database",
        "authentication",
        "api",
        "deployment",
        "testing",
        "performance",
        "security",
        "firebase",
        "mongodb",
        "express",
        "vue",
        "angular"
    ]

    const clearForm = () => {
        setTitle("")
        setContent("")
        setTags([])
        setErrors({})
        localStorage.removeItem('qa_draft')
        NotificationService.success("Form Cleared", "All fields have been cleared.")
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-card/50 backdrop-blur-sm sticky top-18 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Button onClick={() => navigate("/qa")} className="cursor-pointer" variant="ghost" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Questions
                            </Button>
                            <div className="h-6 w-px bg-border" />
                            <Logo logoOnly />
                            <span className="text-3xl font-light">Ask a Question</span>
                        </div>

                        <div className="flex items-center space-x-3">
                            <Button variant="outline" size="sm" onClick={() => setIsPreview(!isPreview)}>
                                <Eye className="h-4 w-4 mr-2" />
                                {isPreview ? "Edit" : "Preview"}
                            </Button>
                            <Button variant="outline" size="sm" onClick={clearForm}>
                                Clear Form
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-20">
                <div className="max-w-4xl mx-auto">
                    {/* Tips Card */}
                    <Card className="mb-6 border-blue-200 bg-blue-50/50">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center text-blue-800">
                                <AlertCircle className="h-5 w-5 mr-2" />
                                Writing a good question
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <h4 className="font-medium mb-2 text-blue-800">Steps to ask a great question:</h4>
                                    <ul className="space-y-1 text-blue-700">
                                        <li>• Summarize your problem in a one-line title</li>
                                        <li>• Describe your problem in more detail</li>
                                        <li>• Describe what you tried and what you expected</li>
                                        <li>• Add relevant tags to help others find your question</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-medium mb-2 text-blue-800">Tips for better answers:</h4>
                                    <ul className="space-y-1 text-blue-700">
                                        <li>• Include code examples and error messages</li>
                                        <li>• Be specific about your environment and setup</li>
                                        <li>• Show what research you've already done</li>
                                        <li>• Use proper formatting for code blocks</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {!isPreview ? (
                        /* Edit Mode */
                        <div className="space-y-6">
                            {/* Title Section */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Title</CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        Be specific and imagine you're asking a question to another person.
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <Input
                                            placeholder="e.g. How to implement authentication in Next.js 14 with App Router?"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className={errors.title ? "border-red-500" : ""}
                                            maxLength={150}
                                        />
                                        {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>{title.length}/150 characters</span>
                                            {title.length >= 15 && title.length <= 150 && (
                                                <span className="text-green-600 flex items-center">
                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                    Good length
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Body Section */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">What are the details of your problem?</CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        Introduce the problem and expand on what you put in the title. Include code examples, error
                                        messages, and what you've tried.
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <RichTextEditor
                                            value={content}
                                            onChange={setContent}
                                            placeholder="Describe your problem in detail. Include:
• What you're trying to achieve
• What you've tried so far
• Code examples (use ``` for code blocks)
• Error messages you're seeing
• Your environment/setup details"
                                        />
                                        {errors.content && <p className="text-sm text-red-600">{errors.content}</p>}
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>{content.length}/10,000 characters</span>
                                            {content.length >= 30 && content.length <= 10000 && (
                                                <span className="text-green-600 flex items-center">
                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                    Good detail
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Tags Section */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Tags</CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        Add up to 5 tags to describe what your question is about. Start typing to see suggestions.
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {tags.map((tag) => (
                                                <Badge key={tag} variant="secondary" className="text-sm px-3 py-1">
                                                    {tag}
                                                    <button onClick={() => handleRemoveTag(tag)} className="ml-2 hover:text-red-600">
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>

                                        <div className="flex space-x-2">
                                            <Input
                                                placeholder="Add a tag (e.g. javascript, react, nextjs)"
                                                value={currentTag}
                                                onChange={(e) => setCurrentTag(e.target.value)}
                                                onKeyPress={handleKeyPress}
                                                disabled={tags.length >= 5}
                                                className={errors.tags ? "border-red-500" : ""}
                                                maxLength={25}
                                            />
                                            <Button onClick={handleAddTag} disabled={!currentTag.trim() || tags.length >= 5} size="sm">
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        {errors.tags && <p className="text-sm text-red-600">{errors.tags}</p>}

                                        <div className="text-xs text-muted-foreground">{tags.length}/5 tags used</div>

                                        {/* Suggested Tags */}
                                        <div>
                                            <Label className="text-sm font-medium">Popular tags:</Label>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {suggestedTags
                                                    .filter((tag) => !tags.includes(tag))
                                                    .slice(0, 12)
                                                    .map((tag) => (
                                                        <Button
                                                            key={tag}
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-7 text-xs bg-transparent"
                                                            onClick={() => {
                                                                if (tags.length < 5) {
                                                                    setTags([...tags, tag])
                                                                } else {
                                                                    NotificationService.error("Tag Limit", "You can only add up to 5 tags.")
                                                                }
                                                            }}
                                                            disabled={tags.length >= 5}
                                                        >
                                                            {tag}
                                                        </Button>
                                                    ))}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        /* Preview Mode */
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Question Preview</CardTitle>
                                <p className="text-sm text-muted-foreground">This is how your question will appear to other users.</p>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {/* Preview Title */}
                                    <div>
                                        <h2 className="text-2xl font-bold text-foreground mb-2">
                                            {title || "Your question title will appear here"}
                                        </h2>
                                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                            <span>Asked just now</span>
                                            <span>Viewed 0 times</span>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Preview Content */}
                                    <div>
                                        {content ? (
                                            <RichContent content={content} />
                                        ) : (
                                            <p className="text-muted-foreground italic">Your question details will appear here...</p>
                                        )}
                                    </div>

                                    {/* Preview Tags */}
                                    {tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {tags.map((tag) => (
                                                <Badge key={tag} variant="secondary" className="text-xs">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between mt-8 p-6 bg-card/50 rounded-lg border">
                        <div className="text-sm text-muted-foreground">
                            By posting your question, you agree to our terms of service and community guidelines.
                        </div>
                        <div className="flex items-center space-x-3">
                            <Button
                                variant="outline"
                                onClick={saveDraft}
                                disabled={isDraftSaving || isSubmitting}
                                className="cursor-pointer"
                            >
                                {isDraftSaving ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    "Save Draft"
                                )}
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                className="bg-indigo-500 hover:bg-indigo-600 cursor-pointer"
                                disabled={isSubmitting || !title.trim() || !content.trim() || tags.length === 0}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Posting...
                                    </>
                                ) : (
                                    "Post Your Question"
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Validation Summary */}
                    {Object.keys(errors).length > 0 && (
                        <Alert className="mt-4 border-red-200 bg-red-50">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                Please fix the following issues before posting:
                                <ul className="mt-2 list-disc list-inside">
                                    {Object.values(errors).map((error, index) => (
                                        <li key={index} className="text-sm">
                                            {error}
                                        </li>
                                    ))}
                                </ul>
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
            </div>
        </div>
    )
}