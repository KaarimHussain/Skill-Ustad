import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
    Play,
    LinkIcon,
    Code,
    ImageIcon,
    Plus,
    X,
    Eye,
    GripVertical,
    BookOpen,
    Trophy,
    AlertTriangle,
    Lightbulb,
    Save,
    ChevronUp,
    ChevronDown,
    Upload,
    ArrowLeft,
} from "lucide-react"
import SectionTemplates from "@/components/section-templates"
import NotificationService from "@/components/Notification"
import LessonService from "@/services/lesson.service"
import { Link, useNavigate } from "react-router-dom"

interface CourseSection {
    id: string
    type: "text" | "code" | "video" | "link" | "image" | "reading" | "achievement" | "note" | "tip"
    title: string
    content: string
    language?: string | null
    options?: string[]
    correctAnswer?: number
    duration?: number
}

export default function UserCreateCourse() {
    const navigate = useNavigate();
    const [courseTitle, setCourseTitle] = useState("")
    const [courseDescription, setCourseDescription] = useState("")
    const [sections, setSections] = useState<CourseSection[]>([])
    const [isPreview, setIsPreview] = useState(false)
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
    const [showToc, setShowToc] = useState(false)
    const [lastSaved, setLastSaved] = useState<Date | null>(null)
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const autoSave = () => {
            if (courseTitle || courseDescription || sections.length > 0) {
                const courseData = {
                    title: courseTitle,
                    description: courseDescription,
                    sections: sections,
                    lastSaved: new Date().toISOString(),
                }
                localStorage.setItem("mentor-course-draft", JSON.stringify(courseData))
                setLastSaved(new Date())
            }
        }

        const interval = setInterval(autoSave, 30000) // Auto-save every 30 seconds
        return () => clearInterval(interval)
    }, [courseTitle, courseDescription, sections])

    useEffect(() => {
        const savedDraft = localStorage.getItem("mentor-course-draft")
        if (savedDraft) {
            try {
                const draft = JSON.parse(savedDraft)
                setCourseTitle(draft.title || "")
                setCourseDescription(draft.description || "")
                setSections(draft.sections || [])
                if (draft.lastSaved) {
                    setLastSaved(new Date(draft.lastSaved))
                }
            } catch (error) {
                console.error("Error loading draft:", error)
            }
        }
    }, [])

    const addSection = (type: CourseSection["type"]) => {
        const newSection: CourseSection = {
            id: Date.now().toString(),
            type,
            title: "",
            content: "",
            language: type === "code" ? "javascript" : null,
        }
        setSections([...sections, newSection])
    }

    const addSectionFromTemplate = (template: Omit<CourseSection, "id">) => {
        const newSection: CourseSection = {
            ...template,
            id: Date.now().toString(),
        }
        setSections([...sections, newSection])
    }

    const updateSection = (id: string, field: keyof CourseSection, value: string) => {
        setSections(sections.map((section) => (section.id === id ? { ...section, [field]: value } : section)))
    }

    const removeSection = (id: string) => {
        setSections(sections.filter((section) => section.id !== id))
    }

    const moveSectionUp = (index: number) => {
        if (index > 0) {
            const newSections = [...sections]
            const temp = newSections[index]
            newSections[index] = newSections[index - 1]
            newSections[index - 1] = temp
            setSections(newSections)
        }
    }

    const moveSectionDown = (index: number) => {
        if (index < sections.length - 1) {
            const newSections = [...sections]
            const temp = newSections[index]
            newSections[index] = newSections[index + 1]
            newSections[index + 1] = temp
            setSections(newSections)
        }
    }

    const handleFileUpload = (sectionId: string, file: File) => {
        const blobUrl = URL.createObjectURL(file)
        updateSection(sectionId, "content", blobUrl)
    }

    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedIndex(index)
        e.dataTransfer.effectAllowed = "move"
    }

    const renderSectionEditor = (section: CourseSection, index: number) => {
        const isDragging = draggedIndex === index
        const isDragOver = dragOverIndex === index

        return (
            <Card
                key={section.id}
                className={`mb-4 transition-all duration-200 ${isDragging ? "opacity-50 scale-95" : ""} ${isDragOver ? "ring-2 ring-indigo-500 ring-opacity-50" : ""
                    }`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => {
                    e.preventDefault()
                    setDragOverIndex(index)
                }}
                onDragLeave={() => setDragOverIndex(null)}
                onDrop={(e) => {
                    e.preventDefault()
                    if (draggedIndex !== null && draggedIndex !== index) {
                        const newSections = [...sections]
                        const draggedSection = newSections[draggedIndex]
                        newSections.splice(draggedIndex, 1)
                        newSections.splice(index, 0, draggedSection)
                        setSections(newSections)
                    }
                    setDraggedIndex(null)
                    setDragOverIndex(null)
                }}
                onDragEnd={() => {
                    setDraggedIndex(null)
                    setDragOverIndex(null)
                }}
            >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center gap-2">
                        <div
                            className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
                            onMouseDown={(e) => e.stopPropagation()}
                        >
                            <GripVertical className="w-4 h-4 text-gray-400" />
                        </div>
                        {section.type === "text" && <div className="w-4 h-4 bg-blue-500 rounded" />}
                        {section.type === "code" && <Code className="w-4 h-4 text-green-600" />}
                        {section.type === "video" && <Play className="w-4 h-4 text-red-600" />}
                        {section.type === "link" && <LinkIcon className="w-4 h-4 text-purple-600" />}
                        {section.type === "image" && <ImageIcon className="w-4 h-4 text-orange-600" />}
                        {section.type === "reading" && <BookOpen className="w-4 h-4 text-emerald-600" />}
                        {section.type === "achievement" && <Trophy className="w-4 h-4 text-yellow-600" />}
                        {section.type === "note" && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                        {section.type === "tip" && <Lightbulb className="w-4 h-4 text-cyan-600" />}
                        <Badge variant="outline" className="capitalize">
                            {section.type}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveSectionUp(index)}
                            disabled={index === 0}
                            className="h-8 w-8 p-0"
                        >
                            <ChevronUp className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveSectionDown(index)}
                            disabled={index === sections.length - 1}
                            className="h-8 w-8 p-0"
                        >
                            <ChevronDown className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSection(section.id)}
                            className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Input
                        placeholder="Section title"
                        value={section.title}
                        onChange={(e) => updateSection(section.id, "title", e.target.value)}
                    />
                    {section.type === "code" && (
                        <Input
                            placeholder="Programming language (e.g., javascript, python)"
                            value={section.language || ""}
                            onChange={(e) => updateSection(section.id, "language", e.target.value)}
                        />
                    )}

                    {section.type === "text" && (
                        <Textarea
                            placeholder="Enter your text content here..."
                            value={section.content}
                            onChange={(e) => updateSection(section.id, "content", e.target.value)}
                            rows={6}
                            className="min-h-[120px] resize-y"
                        />
                    )}

                    {section.type === "code" && (
                        <Textarea
                            placeholder="Enter your code here..."
                            value={section.content}
                            onChange={(e) => updateSection(section.id, "content", e.target.value)}
                            rows={6}
                            className="font-mono text-sm bg-gray-900 text-green-400 border-gray-700 placeholder:text-gray-500"
                        />
                    )}

                    {section.type === "video" && (
                        <div className="space-y-2">
                            <Input
                                placeholder="Enter video URL (YouTube, Vimeo, etc.)"
                                value={section.content}
                                onChange={(e) => updateSection(section.id, "content", e.target.value)}
                                className="border-red-200 focus:border-red-500"
                            />
                        </div>
                    )}

                    {section.type === "link" && (
                        <Input
                            placeholder="Enter URL or URL|Display Text"
                            value={section.content}
                            onChange={(e) => updateSection(section.id, "content", e.target.value)}
                            className="border-purple-200 focus:border-purple-500"
                        />
                    )}

                    {section.type === "image" && (
                        <div className="space-y-2">
                            <Input
                                placeholder="Enter image URL"
                                value={section.content}
                                onChange={(e) => updateSection(section.id, "content", e.target.value)}
                                className="border-orange-200 focus:border-orange-500"
                            />
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">or</span>
                                <label className="cursor-pointer">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0]
                                            if (file) handleFileUpload(section.id, file)
                                        }}
                                    />
                                    <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                                        <Upload className="w-4 h-4" />
                                        Upload Image
                                    </Button>
                                </label>
                            </div>
                        </div>
                    )}

                    {section.type === "reading" && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 p-2 bg-emerald-50 rounded-md border border-emerald-200">
                                <BookOpen className="w-4 h-4 text-emerald-600" />
                                <span className="text-sm font-medium text-emerald-800">Required Reading Content</span>
                            </div>
                            <Textarea
                                placeholder="Enter reading material, instructions, or references..."
                                value={section.content}
                                onChange={(e) => updateSection(section.id, "content", e.target.value)}
                                rows={4}
                                className="border-emerald-200 focus:border-emerald-500 bg-emerald-50/30 resize-y"
                            />
                        </div>
                    )}

                    {section.type === "achievement" && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-md border border-yellow-200">
                                <Trophy className="w-4 h-4 text-yellow-600" />
                                <span className="text-sm font-medium text-yellow-800">Achievement Description</span>
                            </div>
                            <Textarea
                                placeholder="Describe what the student will achieve by completing this section..."
                                value={section.content}
                                onChange={(e) => updateSection(section.id, "content", e.target.value)}
                                rows={4}
                                className="border-yellow-200 focus:border-yellow-500 bg-yellow-50/30 resize-y"
                            />
                        </div>
                    )}

                    {section.type === "note" && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 p-2 bg-amber-50 rounded-md border border-amber-200">
                                <AlertTriangle className="w-4 h-4 text-amber-600" />
                                <span className="text-sm font-medium text-amber-800">Important Note</span>
                            </div>
                            <Textarea
                                placeholder="Enter important information, warnings, or key points to remember..."
                                value={section.content}
                                onChange={(e) => updateSection(section.id, "content", e.target.value)}
                                rows={4}
                                className="border-amber-200 focus:border-amber-500 bg-amber-50/30 resize-y"
                            />
                        </div>
                    )}

                    {section.type === "tip" && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 p-2 bg-cyan-50 rounded-md border border-cyan-200">
                                <Lightbulb className="w-4 h-4 text-cyan-600" />
                                <span className="text-sm font-medium text-cyan-800">Pro Tip</span>
                            </div>
                            <Textarea
                                placeholder="Share helpful tips, best practices, or insider knowledge..."
                                value={section.content}
                                onChange={(e) => updateSection(section.id, "content", e.target.value)}
                                rows={4}
                                className="border-cyan-200 focus:border-cyan-500 bg-cyan-50/30 resize-y"
                            />
                        </div>
                    )}
                </CardContent>
            </Card>
        )
    }

    const renderSectionPreview = (section: CourseSection) => {
        return (
            <div key={section.id} className="mb-12 max-w-4xl mx-auto">
                {section.title && (
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-tight">
                        {section.title}
                    </h3>
                )}

                {section.type === "text" && (
                    <div className="prose prose-lg max-w-none">
                        <div className="text-gray-700 leading-relaxed text-base md:text-lg whitespace-pre-wrap font-normal tracking-wide">
                            {section.content || <span className="text-gray-500 italic">No content added yet</span>}
                        </div>
                    </div>
                )}

                {section.type === "code" && section.content && (
                    <div className="relative group w-full">
                        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl border border-gray-700 shadow-2xl overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 bg-gray-800/50 border-b border-gray-700">
                                <div className="flex items-center gap-3">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    </div>
                                    <span className="text-gray-300 text-sm font-medium capitalize">{section.language || "code"}</span>
                                </div>
                                <button
                                    onClick={() => navigator.clipboard.writeText(section.content)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-400 hover:text-white text-xs px-2 py-1 rounded bg-gray-700 hover:bg-gray-600"
                                >
                                    Copy
                                </button>
                            </div>

                            <div className="p-4 overflow-x-auto">
                                <pre className="text-sm md:text-base leading-relaxed">
                                    <code className="text-gray-100 font-mono whitespace-pre-wrap break-words">{section.content}</code>
                                </pre>
                            </div>

                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>
                        </div>
                    </div>
                )}

                {section.type === "video" && section.content && (
                    <div className="w-full">
                        <div className="aspect-video bg-gray-100 rounded-xl shadow-lg overflow-hidden">
                            {section.content.includes("youtube.com") || section.content.includes("youtu.be") ? (
                                <iframe
                                    src={section.content.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")}
                                    className="w-full h-full"
                                    allowFullScreen
                                />
                            ) : section.content.startsWith("blob:") ? (
                                <video src={section.content} controls className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-center p-8">
                                    <div>
                                        <Play className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
                                        <p className="text-gray-600 text-lg font-medium">Video: {section.content}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {section.type === "link" && section.content && (
                    <div className="border border-indigo-200 rounded-xl p-6 bg-gradient-to-r from-indigo-50 to-blue-50 shadow-sm">
                        <div className="flex items-start gap-3">
                            <LinkIcon className="w-6 h-6 text-indigo-600 mt-1 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                {section.content.includes("|") ? (
                                    <div>
                                        <a
                                            href={section.content.split("|")[0].trim()}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-indigo-600 hover:text-indigo-800 font-semibold text-lg md:text-xl block mb-2 break-words"
                                        >
                                            {section.content.split("|")[1]?.trim() || section.content.split("|")[0].trim()}
                                        </a>
                                        <p className="text-gray-600 text-sm md:text-base break-all">{section.content.split("|")[0].trim()}</p>
                                    </div>
                                ) : (
                                    <a
                                        href={section.content}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-indigo-600 hover:text-indigo-800 font-semibold text-lg md:text-xl break-words"
                                    >
                                        {section.content}
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {section.type === "image" && section.content && (
                    <div className="w-full">
                        <div className="rounded-xl overflow-hidden shadow-lg bg-white">
                            <img
                                src={section.content || "/placeholder.svg"}
                                alt={section.title || "Course image"}
                                className="w-full h-auto object-cover"
                            />
                        </div>
                    </div>
                )}

                {section.type === "reading" && section.content && (
                    <div className="border border-emerald-200 rounded-xl p-6 md:p-8 bg-gradient-to-r from-emerald-50 to-green-50 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-emerald-100 rounded-lg">
                                <BookOpen className="w-6 h-6 text-emerald-600" />
                            </div>
                            <span className="font-bold text-emerald-800 text-lg md:text-xl">Required Reading</span>
                        </div>
                        <div className="text-gray-700 leading-relaxed text-base md:text-lg whitespace-pre-wrap font-normal tracking-wide">
                            {section.content}
                        </div>
                    </div>
                )}

                {section.type === "achievement" && section.content && (
                    <div className="border border-yellow-200 rounded-xl p-6 md:p-8 bg-gradient-to-r from-yellow-50 via-orange-50 to-amber-50 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <Trophy className="w-6 h-6 text-yellow-600" />
                            </div>
                            <span className="font-bold text-yellow-800 text-lg md:text-xl">Achievement Unlock</span>
                        </div>
                        <div className="text-gray-700 leading-relaxed text-base md:text-lg whitespace-pre-wrap font-normal tracking-wide mb-6">
                            {section.content}
                        </div>
                        <div className="pt-6 border-t border-yellow-200">
                            <div className="flex items-center gap-2 text-yellow-700">
                                <span className="text-2xl">🏆</span>
                                <p className="font-medium text-base md:text-lg">Complete this section to earn your achievement!</p>
                            </div>
                        </div>
                    </div>
                )}

                {section.type === "note" && section.content && (
                    <div className="border border-amber-200 rounded-xl p-6 md:p-8 bg-gradient-to-r from-amber-50 to-yellow-50 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-amber-100 rounded-lg">
                                <AlertTriangle className="w-6 h-6 text-amber-600" />
                            </div>
                            <span className="font-bold text-amber-800 text-lg md:text-xl">Important Note</span>
                        </div>
                        <div className="text-gray-700 leading-relaxed text-base md:text-lg whitespace-pre-wrap font-normal tracking-wide">
                            {section.content}
                        </div>
                    </div>
                )}

                {section.type === "tip" && section.content && (
                    <div className="border border-cyan-200 rounded-xl p-6 md:p-8 bg-gradient-to-r from-cyan-50 to-blue-50 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-cyan-100 rounded-lg">
                                <Lightbulb className="w-6 h-6 text-cyan-600" />
                            </div>
                            <span className="font-bold text-cyan-800 text-lg md:text-xl">Pro Tip</span>
                        </div>
                        <div className="text-gray-700 leading-relaxed text-base md:text-lg whitespace-pre-wrap font-normal tracking-wide">
                            {section.content}
                        </div>
                    </div>
                )}
            </div>
        )
    }

    const saveCourse = async () => {
        setIsSaving(true);

        // Validate course data
        if (!courseTitle.trim()) {
            NotificationService.error("Course title is required");
            setIsSaving(false);
            return;
        }

        if (!courseDescription.trim()) {
            NotificationService.error("Course description is required");
            setIsSaving(false);
            return;
        }

        if (sections.length === 0) {
            NotificationService.error("At least one section is required");
            setIsSaving(false);
            return;
        }

        // Validate each section
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];

            if (!section.title.trim()) {
                NotificationService.error(`Section ${i + 1} title is required`);
                setIsSaving(false);
                return;
            }

            if (!section.content.trim()) {
                NotificationService.error(`Section ${i + 1} content is required`);
                setIsSaving(false);
                return;
            }

            if (section.type === "code" && !section.language?.trim()) {
                NotificationService.error(`Section ${i + 1} programming language is required for code sections`);
                setIsSaving(false);
                return;
            }
        }

        const courseData = {
            title: courseTitle,
            description: courseDescription,
            sections: sections,
            totalSections: sections.length,
            createdAt: new Date().toISOString(),
        }

        try {
            localStorage.removeItem("mentor-course-draft")
            await LessonService.saveCourse(courseData)
            NotificationService.success("Course saved successfully!")
            navigate("/user/course");
            return
        } catch (error) {
            console.error("Error saving course:", error)
            NotificationService.error("Failed to save course. Please try again.")
        } finally {
            setIsSaving(false);
        }
    }

    const TableOfContents = () => (
        <div className="sticky top-4 bg-white border rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-3">Table of Contents</h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
                {sections.map((section, index) => (
                    <div
                        key={section.id}
                        className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer text-sm"
                        onClick={() => {
                            const element = document.getElementById(`section-${section.id}`)
                            element?.scrollIntoView({ behavior: "smooth" })
                        }}
                    >
                        <span className="text-gray-400 text-xs">{index + 1}</span>
                        <span className="truncate">{section.title || `${section.type} section`}</span>
                    </div>
                ))}
            </div>
        </div>
    )

    if (isPreview) {
        return (
            <div className="min-h-screen bg-white">
                <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-700/40 via-indigo-900/10 to-indigo-500/10"></div>
                    <div className="absolute inset-0">
                        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-900/40 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
                    </div>
                    <div className="relative px-4 sm:px-6 lg:px-8 pt-30 pb-20">
                        <div className="max-w-4xl mx-auto text-center">
                            <h1 className={"text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-6"}>
                                {courseTitle || "Course Title"}
                            </h1>
                            <p className="text-lg sm:text-xl text-black/90 max-w-2xl mx-auto mb-8">
                                {courseDescription || "Course description goes here"}
                            </p>
                            <div className="flex items-center justify-center gap-4">
                                <Button onClick={() => setIsPreview(false)} className="bg-white text-indigo-600 hover:bg-gray-100">
                                    Back to Editor
                                </Button>
                                <Button
                                    onClick={() => setShowToc(!showToc)}
                                    variant="outline"
                                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                                >
                                    {showToc ? "Hide" : "Show"} Table of Contents
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex gap-8">
                        {showToc && (
                            <div className="w-64 flex-shrink-0">
                                <TableOfContents />
                            </div>
                        )}

                        <div className="flex-1">
                            {sections.map((section) => (
                                <div key={section.id} id={`section-${section.id}`}>
                                    {renderSectionPreview(section)}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-18 bg-gray-50">
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="mb-2">
                        <Link to="/mentor/course">
                            <Button variant={"outline"} className="cursor-pointer"><ArrowLeft /> Go Back</Button>
                        </Link>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Course Generator</h1>
                            <p className="text-gray-600 mt-1">Create engaging courses for Skill Ustad</p>
                            {lastSaved && (
                                <p className="text-xs text-green-600 mt-1">Auto-saved at {lastSaved.toLocaleTimeString()}</p>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <Button onClick={() => setIsPreview(true)} className="bg-indigo-600 hover:bg-indigo-700">
                                <Eye className="w-4 h-4 mr-2" />
                                Preview Course
                            </Button>
                            <Button disabled={isSaving} variant="outline" onClick={saveCourse} className="cursor-pointer bg-transparent">
                                <Save className="w-4 h-4 mr-2" />
                                {isSaving ? "Saving..." : "Save Course"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Course Settings</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
                                    <Input
                                        placeholder="Enter course title"
                                        value={courseTitle}
                                        onChange={(e) => setCourseTitle(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Course Description</label>
                                    <Textarea
                                        placeholder="Brief description of your course"
                                        value={courseDescription}
                                        onChange={(e) => setCourseDescription(e.target.value)}
                                        rows={3}
                                    />
                                </div>

                                <div className="pt-4 border-t">
                                    <h4 className="font-medium text-gray-900 mb-3">Add Content Section</h4>
                                    <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => addSection("text")}
                                            className="flex items-center gap-1"
                                        >
                                            <div className="w-3 h-3 bg-blue-500 rounded" />
                                            Text
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => addSection("code")}
                                            className="flex items-center gap-1"
                                        >
                                            <Code className="w-3 h-3 text-green-600" />
                                            Code
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => addSection("video")}
                                            className="flex items-center gap-1"
                                        >
                                            <Play className="w-3 h-3 text-red-600" />
                                            Video
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => addSection("link")}
                                            className="flex items-center gap-1"
                                        >
                                            <LinkIcon className="w-3 h-3 text-purple-600" />
                                            Link
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => addSection("image")}
                                            className="flex items-center gap-1"
                                        >
                                            <ImageIcon className="w-3 h-3 text-orange-600" />
                                            Image
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => addSection("reading")}
                                            className="flex items-center gap-1"
                                        >
                                            <BookOpen className="w-3 h-3 text-emerald-600" />
                                            Reading
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => addSection("achievement")}
                                            className="flex items-center gap-1"
                                        >
                                            <Trophy className="w-3 h-3 text-yellow-600" />
                                            Achievement
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => addSection("note")}
                                            className="flex items-center gap-1"
                                        >
                                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                                            Note
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => addSection("tip")}
                                            className="flex items-center gap-1"
                                        >
                                            <Lightbulb className="w-3 h-3 text-cyan-600" />
                                            Tip
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <SectionTemplates onUseTemplate={addSectionFromTemplate} currentSection={sections[sections.length - 1]} />
                    </div>

                    <div className="lg:col-span-4">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-gray-900">Course Content</h2>
                                <Badge variant="secondary">{sections.length} sections</Badge>
                            </div>

                            {sections.length === 0 ? (
                                <Card>
                                    <CardContent className="py-12 text-center">
                                        <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No content sections yet</h3>
                                        <p className="text-gray-600 mb-4">Start building your course by adding content sections</p>
                                        <Button onClick={() => addSection("text")} className="bg-indigo-600 hover:bg-indigo-700">
                                            Add Your First Section
                                        </Button>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="space-y-4">{sections.map((section, index) => renderSectionEditor(section, index))}</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}