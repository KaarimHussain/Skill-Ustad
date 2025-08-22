"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Save,
    Plus,
    Trash2,
    BookOpen,
    Code,
    Play,
    LinkIcon,
    ImageIcon,
    Trophy,
    AlertTriangle,
    Lightbulb,
} from "lucide-react"

interface CourseSection {
    id: string
    type: "text" | "code" | "video" | "link" | "image" | "reading" | "achievement" | "note" | "tip"
    title: string
    content: string
    language?: string | null
}

interface SectionTemplate {
    id: string
    name: string
    description: string
    section: Omit<CourseSection, "id">
    createdAt: string
}

interface SectionTemplatesProps {
    onUseTemplate: (template: Omit<CourseSection, "id">) => void
    currentSection?: CourseSection
    onSaveAsTemplate?: (section: CourseSection, name: string, description: string) => void
}

export default function SectionTemplates({ onUseTemplate, currentSection, onSaveAsTemplate }: SectionTemplatesProps) {
    const [templates, setTemplates] = useState<SectionTemplate[]>([
        {
            id: "1",
            name: "Lesson Intro",
            description: "Standard lesson introduction template",
            section: {
                type: "text",
                title: "Lesson Introduction",
                content:
                    "<h2>Welcome to this lesson!</h2><p>In this lesson, you will learn:</p><ul><li>Key concept 1</li><li>Key concept 2</li><li>Key concept 3</li></ul><p>Let's get started!</p>",
            },
            createdAt: new Date().toISOString(),
        },
        {
            id: "2",
            name: "Code Example",
            description: "Basic code example with explanation",
            section: {
                type: "code",
                title: "Code Example",
                content: '// Your code example here\nfunction example() {\n  console.log("Hello, World!");\n}',
                language: "javascript",
            },
            createdAt: new Date().toISOString(),
        },
        {
            id: "3",
            name: "Lesson Summary",
            description: "Standard lesson summary template",
            section: {
                type: "text",
                title: "Lesson Summary",
                content:
                    "<h2>What we covered</h2><p>In this lesson, we explored:</p><ul><li>Summary point 1</li><li>Summary point 2</li><li>Summary point 3</li></ul><p><strong>Next steps:</strong> Practice what you've learned and move on to the next lesson!</p>",
            },
            createdAt: new Date().toISOString(),
        },
    ])

    const [showSaveDialog, setShowSaveDialog] = useState(false)
    const [templateName, setTemplateName] = useState("")
    const [templateDescription, setTemplateDescription] = useState("")

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "text":
                return <div className="w-4 h-4 bg-blue-500 rounded" />
            case "code":
                return <Code className="w-4 h-4 text-green-600" />
            case "video":
                return <Play className="w-4 h-4 text-red-600" />
            case "link":
                return <LinkIcon className="w-4 h-4 text-purple-600" />
            case "image":
                return <ImageIcon className="w-4 h-4 text-orange-600" />
            case "reading":
                return <BookOpen className="w-4 h-4 text-emerald-600" />
            case "achievement":
                return <Trophy className="w-4 h-4 text-yellow-600" />
            case "note":
                return <AlertTriangle className="w-4 h-4 text-amber-600" />
            case "tip":
                return <Lightbulb className="w-4 h-4 text-cyan-600" />
            default:
                return <div className="w-4 h-4 bg-gray-500 rounded" />
        }
    }

    const handleSaveTemplate = () => {
        if (!currentSection || !templateName.trim()) return

        const newTemplate: SectionTemplate = {
            id: Date.now().toString(),
            name: templateName.trim(),
            description: templateDescription.trim(),
            section: {
                type: currentSection.type,
                title: currentSection.title,
                content: currentSection.content,
                language: currentSection.language,
            },
            createdAt: new Date().toISOString(),
        }

        setTemplates([...templates, newTemplate])
        setShowSaveDialog(false)
        setTemplateName("")
        setTemplateDescription("")

        if (onSaveAsTemplate) {
            onSaveAsTemplate(currentSection, templateName, templateDescription)
        }
    }

    const deleteTemplate = (id: string) => {
        setTemplates(templates.filter((t) => t.id !== id))
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Section Templates</CardTitle>
                    {currentSection && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowSaveDialog(true)}
                            className="flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            Save as Template
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                {showSaveDialog && (
                    <Card className="border-dashed">
                        <CardContent className="pt-4 space-y-3">
                            <Input
                                placeholder="Template name"
                                value={templateName}
                                onChange={(e) => setTemplateName(e.target.value)}
                            />
                            <Input
                                placeholder="Template description"
                                value={templateDescription}
                                onChange={(e) => setTemplateDescription(e.target.value)}
                            />
                            <div className="flex gap-2">
                                <Button size="sm" onClick={handleSaveTemplate} disabled={!templateName.trim()}>
                                    Save Template
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => setShowSaveDialog(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="space-y-2 max-h-64 overflow-y-auto">
                    {templates.map((template) => (
                        <div
                            key={template.id}
                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                            <div className="flex items-center gap-3 flex-1">
                                {getTypeIcon(template.section.type)}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium text-sm truncate">{template.name}</p>
                                        <Badge variant="outline" className="text-xs capitalize">
                                            {template.section.type}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground truncate">{template.description}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onUseTemplate(template.section)}
                                    className="h-8 w-8 p-0"
                                >
                                    <Plus className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => deleteTemplate(template.id)}
                                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
