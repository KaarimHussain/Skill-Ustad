"use client"

import { Tabs, TabsContent } from "@radix-ui/react-tabs"
import { Code, Bold, Italic, ImageIcon, List, Quote, Eye, Link } from "lucide-react"
import { useState } from "react"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"

export function RichContent({ content }: { content: string }) {

    const [isCopied, setIsCopied] = useState(false);

    const copyToClipboard = async (text: string) => {
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 1500)
        try {
            await navigator.clipboard.writeText(text)
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea')
            textArea.value = text
            document.body.appendChild(textArea)
            textArea.select()
            document.execCommand('copy')
            document.body.removeChild(textArea)
        }
    }

    const renderContent = (text: string) => {
        // Split content by code blocks
        const parts = text.split(/(```[\s\S]*?```|`[^`]+`)/g)

        return parts.map((part, index) => {
            // Handle multi-line code blocks
            if (part.startsWith("```") && part.endsWith("```")) {
                const lines = part.slice(3, -3).split("\n")
                const language = lines[0].trim()
                const code = lines.slice(1).join("\n")

                return (
                    <div key={index} className="my-4 w-full overflow-hidden">
                        <div className="bg-muted rounded-t-lg px-2 sm:px-4 py-2 border-b">
                            <div className="flex items-center justify-between">
                                <span className="text-xs sm:text-sm font-medium text-muted-foreground truncate mr-2">
                                    {language || "Code"}
                                </span>
                                <Button
                                    variant={isCopied ? "default" : "outline"}
                                    size="sm"
                                    className={`h-6 px-3 flex-shrink-0 cursor-pointer ${isCopied ? "bg-green-100 hover:bg-green-200 text-green-700 border border-green-700" : "bg-zinc-200"}`}
                                    onClick={() => copyToClipboard(code)}
                                >
                                    <Code className="h-3 w-3 mr-1" />
                                    <span className="hidden sm:inline">{isCopied ? "Copied" : "Copy"}</span>
                                </Button>
                            </div>
                        </div>
                        <div className="bg-card border border-t-0 rounded-b-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <pre className="p-2 sm:p-4 m-0 min-w-0">
                                    <code className="text-xs sm:text-sm font-mono text-foreground block whitespace-pre-wrap break-all sm:break-words">
                                        {code}
                                    </code>
                                </pre>
                            </div>
                        </div>
                    </div>
                )
            }

            // Handle inline code
            if (part.startsWith("`") && part.endsWith("`")) {
                return (
                    <code
                        key={index}
                        className="bg-muted px-1.5 py-0.5 rounded text-xs sm:text-sm font-mono break-all sm:break-words inline-block max-w-full"
                    >
                        {part.slice(1, -1)}
                    </code>
                )
            }

            // Handle regular text with markdown-like formatting
            return (
                <span key={index} className="whitespace-pre-wrap break-words">
                    {part.split(/(\*\*[^*]+\*\*|\*[^*]+\*|##[^\n]+|#[^\n]+|\[[^\]]+\]\([^)]+\))/g).map((segment, segIndex) => {
                        if (segment.startsWith("**") && segment.endsWith("**")) {
                            return (
                                <strong key={segIndex} className="break-words">
                                    {segment.slice(2, -2)}
                                </strong>
                            )
                        }
                        if (segment.startsWith("*") && segment.endsWith("*")) {
                            return (
                                <em key={segIndex} className="break-words">
                                    {segment.slice(1, -1)}
                                </em>
                            )
                        }
                        if (segment.startsWith("## ")) {
                            return (
                                <h3 key={segIndex} className="text-base sm:text-lg font-semibold mt-4 sm:mt-6 mb-2 sm:mb-3 break-words">
                                    {segment.slice(3)}
                                </h3>
                            )
                        }
                        if (segment.startsWith("# ")) {
                            return (
                                <h2 key={segIndex} className="text-lg sm:text-xl font-bold mt-4 sm:mt-6 mb-3 sm:mb-4 break-words">
                                    {segment.slice(2)}
                                </h2>
                            )
                        }
                        if (segment.match(/^\[[^\]]+\]\([^)]+\)$/)) {
                            const linkMatch = segment.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
                            if (linkMatch) {
                                const [, linkText, linkUrl] = linkMatch
                                return (
                                    <a
                                        key={segIndex}
                                        href={linkUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 underline decoration-1 underline-offset-2 hover:decoration-2 transition-all duration-200 break-words"
                                    >
                                        {linkText}
                                    </a>
                                )
                            }
                        }
                        return segment
                    })}
                </span>
            )
        })
    }

    return (
        <div className="prose prose-sm max-w-none text-foreground leading-relaxed w-full overflow-hidden min-w-0">
            {renderContent(content)}
        </div>
    )
}

export function RichTextEditor({
    value,
    onChange,
    placeholder,
}: {
    value: string
    onChange: (value: string) => void
    placeholder: string
}) {
    const [isPreview, setIsPreview] = useState(false)

    const insertText = (before: string, after = "") => {
        const textarea = document.querySelector("textarea") as HTMLTextAreaElement
        if (!textarea) return

        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const selectedText = value.substring(start, end)
        const newText = value.substring(0, start) + before + selectedText + after + value.substring(end)

        onChange(newText)

        // Reset cursor position
        setTimeout(() => {
            textarea.focus()
            textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length)
        }, 0)
    }

    const insertCodeBlock = () => {
        insertText("\n```javascript\n", "\n```\n")
    }

    const insertImage = () => {
        insertText("![Image description](", ")")
    }

    return (
        <div className="space-y-3">
            {/* Formatting Toolbar */}
            <div className="flex items-center space-x-1 p-2 bg-muted/50 rounded-lg border overflow-x-auto">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => insertText("**", "**")}
                    className="h-8 px-2 flex-shrink-0"
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => insertText("*", "*")}
                    className="h-8 px-2 flex-shrink-0"
                >
                    <Italic className="h-4 w-4" />
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={insertCodeBlock} className="h-8 px-2 flex-shrink-0">
                    <Code className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => insertText("`", "`")}
                    className="h-8 px-2 flex-shrink-0"
                >
                    <span className="text-xs font-mono">{`</>`}</span>
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => insertText("[Link text](", ")")}
                    className="h-8 px-2 flex-shrink-0"
                >
                    <Link className="h-4 w-4" />
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={insertImage} className="h-8 px-2 flex-shrink-0">
                    <ImageIcon className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => insertText("- ", "")}
                    className="h-8 px-2 flex-shrink-0"
                >
                    <List className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => insertText("> ", "")}
                    className="h-8 px-2 flex-shrink-0"
                >
                    <Quote className="h-4 w-4" />
                </Button>

                <div className="flex-1" />

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsPreview(!isPreview)}
                    className="h-8 px-2 sm:px-3 flex-shrink-0"
                >
                    <Eye className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">{isPreview ? "Edit" : "Preview"}</span>
                </Button>
            </div>

            {/* Editor/Preview */}
            <Tabs value={isPreview ? "preview" : "edit"} className="w-full">
                <TabsContent value="edit" className="mt-0">
                    <Textarea
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="min-h-[200px] font-mono text-sm"
                    />
                </TabsContent>
                <TabsContent value="preview" className="mt-0">
                    <div className="min-h-[200px] p-2 sm:p-4 border rounded-md bg-card overflow-hidden">
                        {value ? (
                            <RichContent content={value} />
                        ) : (
                            <p className="text-muted-foreground italic">Nothing to preview yet...</p>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
