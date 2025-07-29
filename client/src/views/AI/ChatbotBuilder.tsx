"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Settings,
    Sparkles,
    MessageSquare,
    Zap,
    Key,
    ExternalLink,
    Info,
    Wand2,
    Copy,
    Eye,
    EyeOff,
    HelpCircle,
    Lightbulb,
} from "lucide-react"
import GeminiService from "@/services/gemini.service"

export default function ChatbotBuilder() {
    const [prompt, setPrompt] = useState("")
    const [apiKey, setApiKey] = useState("")
    const [showApiKey, setShowApiKey] = useState(false)
    const [model, setModel] = useState("google/gemini-pro")
    const [personality, setPersonality] = useState("helpful")
    const [enableMemory, setEnableMemory] = useState(true)
    const [enableTools, setEnableTools] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)
    const [isEnhancing, setIsEnhancing] = useState(false)

    const handleGenerate = async () => {
        if (!prompt.trim() || !apiKey.trim()) {
            alert("Please enter a prompt and your Gemini API key.")
            return
        }
        setIsGenerating(true)
    }

    const handleEnhancePrompt = async () => {
        if (!prompt.trim()) return
        setIsEnhancing(true)

        try {
            const response = await fetch("http://localhost:3001/api/enhance-prompt", {
                // Point to Node.js server
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt }),
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const { enhancedPrompt } = await response.json()
            setPrompt(enhancedPrompt)
        } catch (error) {
            console.error("Failed to enhance prompt:", error)
            alert("Failed to enhance prompt. Please try again.")
        } finally {
            setIsEnhancing(false)
        }
    }

    const examplePrompts = [
        "Create a customer support chatbot for an e-commerce platform that can handle order inquiries, product questions, and return requests with a friendly, professional tone.",
        "Build a lead qualification chatbot for a SaaS company that asks relevant questions to identify potential customers and schedules demos.",
        "Design a FAQ chatbot for a healthcare clinic that can answer common questions about services, appointments, and insurance coverage.",
        "Develop a restaurant reservation chatbot that can check availability, make bookings, and provide menu information.",
    ]

    const testExampleGen = async () => {
        try {
            const exampleResponses = await GeminiService.GeminiGenerateExamples()
            const formattedResponses = GeminiService.parseExampleResponse(exampleResponses)
            console.log("Example Responses:", formattedResponses)
        } catch (error) {
            console.error("Error generating examples:", error)
            alert("Failed to generate example prompts. Please try again.")
        }
    }

    useEffect(() => {
        testExampleGen()
    }, [])

    const characterCount = prompt.length
    const maxCharacters = 3000

    return (
        <div className="min-h-screen main-container py-20">
            <div className="container mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center flex-col gap-3 mb-6">
                        <div className="p-3">
                            <img src="" className="aspect-square h-15" alt="Chatbot Logo" />
                        </div>
                        <h1 className="text-5xl md:text-5xl font-bold text-black">Chatbot Builder</h1>
                    </div>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Describe your ideal chatbot and we'll help you build it with advanced AI capabilities
                    </p>
                </div>
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-4 gap-8">
                        {/* Main Input Area */}
                        <div className="lg:col-span-3">
                            <div className="space-y-6">
                                {/* API Key Section */}
                                <Card className="p-6 border-2 border-amber-200 bg-amber-50/50 backdrop-blur-sm shadow-lg">
                                    <div className="flex items-start gap-3 mb-4">
                                        <Key className="w-5 h-5 text-amber-600 mt-0.5" />
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-amber-800 mb-2">API Configuration</h3>
                                            <p className="text-sm text-amber-700 mb-4">
                                                Enter your Gemini API key to power your chatbot generation.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="api-key" className="text-sm font-medium text-slate-700 mb-2 block">
                                                Gemini API Key
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    id="api-key"
                                                    type={showApiKey ? "text" : "password"}
                                                    placeholder="AIzaSy..."
                                                    value={apiKey}
                                                    onChange={(e) => setApiKey(e.target.value)}
                                                    className="pr-10 border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                                    onClick={() => setShowApiKey(!showApiKey)}
                                                >
                                                    {showApiKey ? (
                                                        <EyeOff className="w-4 h-4 text-slate-500" />
                                                    ) : (
                                                        <Eye className="w-4 h-4 text-slate-500" />
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <Alert className="border-indigo-200 bg-indigo-50">
                                                <Info className="w-4 h-4 text-indigo-600" />
                                                <AlertDescription className="text-sm text-indigo-700">
                                                    {"New to Gemini? Get your API key in 2 minutes:"}
                                                    <div className="mt-2 space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-4 h-4 bg-indigo-600 text-white rounded-full text-xs flex items-center justify-center font-bold">
                                                                {"1"}
                                                            </span>
                                                            <span>Visit Google AI Studio</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-4 h-4 bg-indigo-600 text-white rounded-full text-xs flex items-center justify-center font-bold">
                                                                {"2"}
                                                            </span>
                                                            <span>Create API key in "Get API key" section</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-4 h-4 bg-indigo-600 text-white rounded-full text-xs flex items-center justify-center font-bold">
                                                                {"3"}
                                                            </span>
                                                            <span>Copy and paste it here</span>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="link"
                                                        className="p-0 h-auto text-indigo-600 hover:text-indigo-800 mt-2"
                                                        onClick={() => window.open("https://aistudio.google.com/app/apikey", "_blank")}
                                                    >
                                                        Get API Key <ExternalLink className="w-3 h-3 ml-1" />
                                                    </Button>
                                                </AlertDescription>
                                            </Alert>
                                        </div>
                                    </div>
                                </Card>
                                {/* Enhanced Prompt Input */}
                                <Card className="p-6 border-2 border-indigo-200 bg-white/80 backdrop-blur-sm shadow-lg">
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <Label htmlFor="chatbot-prompt" className="text-lg font-semibold text-slate-800">
                                                Describe your chatbot
                                            </Label>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleEnhancePrompt}
                                                disabled={!prompt.trim() || isEnhancing}
                                                className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 bg-transparent"
                                            >
                                                {isEnhancing ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-3 w-3 border-2 border-indigo-600 border-t-transparent mr-2" />
                                                        Enhancing...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Wand2 className="w-3 h-3 mr-2" />
                                                        Enhance Prompt
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                        <p className="text-sm text-slate-600 mb-4">
                                            Be specific about the chatbot's purpose, personality, and capabilities. The more detail you
                                            provide, the better your chatbot will be.
                                        </p>
                                    </div>
                                    <Tabs defaultValue="write" className="w-full">
                                        <TabsList className="grid w-full grid-cols-2 mb-4">
                                            <TabsTrigger value="write" className="flex items-center gap-2">
                                                <MessageSquare className="w-4 h-4" />
                                                Write Prompt
                                            </TabsTrigger>
                                            <TabsTrigger value="examples" className="flex items-center gap-2">
                                                <Lightbulb className="w-4 h-4" />
                                                Examples
                                            </TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="write" className="space-y-4">
                                            <div className="relative">
                                                <Textarea
                                                    id="chatbot-prompt"
                                                    placeholder="I want to build a customer support chatbot for my e-commerce store. It should be friendly, knowledgeable about our products, and able to help with order tracking, returns, and general inquiries. The chatbot should have access to our product catalog and order management system..."
                                                    value={prompt}
                                                    onChange={(e) => setPrompt(e.target.value)}
                                                    className="min-h-[250px] text-base leading-relaxed border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500 resize-none pr-20"
                                                    maxLength={maxCharacters}
                                                />
                                                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                                                    <Badge variant="secondary" className="text-xs">
                                                        {characterCount}/{maxCharacters}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <HelpCircle className="w-4 h-4" />
                                                <span>
                                                    {" "}
                                                    <strong>Pro tip:</strong> Include specific use cases, tone preferences, and any integrations
                                                    you need.
                                                </span>
                                            </div>
                                        </TabsContent>
                                        <TabsContent value="examples" className="space-y-3">
                                            <p className="text-sm text-slate-600 mb-4">
                                                Click any example below to use it as a starting point:
                                            </p>
                                            {examplePrompts.map((example, index) => (
                                                <Card
                                                    key={index}
                                                    className="p-4 cursor-pointer hover:bg-indigo-50 transition-colors border-indigo-100 hover:border-indigo-200"
                                                    onClick={() => setPrompt(example)}
                                                >
                                                    <p className="text-sm text-slate-700 leading-relaxed">{example}</p>
                                                    <div className="flex items-center justify-between mt-3">
                                                        <Badge variant="outline" className="text-xs">
                                                            Example {index + 1}
                                                        </Badge>
                                                        <Copy className="w-4 h-4 text-slate-400" />
                                                    </div>
                                                </Card>
                                            ))}
                                        </TabsContent>
                                    </Tabs>
                                    <div className="mt-6 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Sparkles className="w-4 h-4 text-indigo-600" />
                                            <span className="text-sm text-slate-600">AI Powered Generation</span>
                                        </div>
                                        <Button
                                            onClick={handleGenerate}
                                            disabled={!prompt.trim() || !apiKey.trim() || isGenerating}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2 font-medium"
                                        >
                                            {isGenerating ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                                                    Generating...
                                                </>
                                            ) : (
                                                <>
                                                    <Zap className="w-4 h-4 mr-2" />
                                                    Generate Chatbot
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </Card>
                            </div>
                        </div>
                        {/* Settings Panel */}
                        <div className="space-y-6">
                            <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg">
                                <div className="flex items-center gap-2 mb-4">
                                    <Settings className="w-5 h-5 text-indigo-600" />
                                    <h3 className="font-semibold text-slate-800">Configuration</h3>
                                </div>
                                <div className="space-y-6">
                                    {/* Model Selection */}
                                    <div>
                                        <Label className="text-sm font-medium text-slate-700 mb-2 block">AI Model</Label>
                                        <Select value={model} onValueChange={setModel}>
                                            <SelectTrigger className="border-slate-200">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="google/gemini-pro">Gemini Pro (Recommended)</SelectItem>
                                                <SelectItem value="openai/gpt-4o">GPT-4o</SelectItem>
                                                <SelectItem value="openai/gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                                                <SelectItem value="anthropic/claude-3-haiku">Claude 3 Haiku</SelectItem>
                                                <SelectItem value="meta-llama/llama-3-8b-instruct">Llama 3 8B</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <p className="text-xs text-slate-500 mt-1">Select the AI model for generation</p>
                                    </div>
                                    {/* Personality */}
                                    <div>
                                        <Label className="text-sm font-medium text-slate-700 mb-2 block">Personality</Label>
                                        <Select value={personality} onValueChange={setPersonality}>
                                            <SelectTrigger className="border-slate-200">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="helpful">Helpful & Professional</SelectItem>
                                                <SelectItem value="friendly">Friendly & Casual</SelectItem>
                                                <SelectItem value="formal">Formal & Business</SelectItem>
                                                <SelectItem value="creative">Creative & Playful</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Separator />
                                    {/* Advanced Options */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label className="text-sm font-medium text-slate-700">Conversation Memory</Label>
                                                <p className="text-xs text-slate-500 mt-1">Remember previous messages</p>
                                            </div>
                                            <Switch checked={enableMemory} onCheckedChange={setEnableMemory} />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label className="text-sm font-medium text-slate-700">External Tools</Label>
                                                <p className="text-xs text-slate-500 mt-1">Access to APIs and databases</p>
                                            </div>
                                            <Switch checked={enableTools} onCheckedChange={setEnableTools} />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                            {/* Quick Templates */}
                            <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg">
                                <div className="flex items-center gap-2 mb-4">
                                    <MessageSquare className="w-5 h-5 text-indigo-600" />
                                    <h3 className="font-semibold text-slate-800">Quick Templates</h3>
                                </div>
                                <div className="space-y-2">
                                    {[
                                        { label: "Customer Support", color: "bg-blue-100 text-blue-800" },
                                        { label: "Sales Assistant", color: "bg-green-100 text-green-800" },
                                        { label: "FAQ Bot", color: "bg-purple-100 text-purple-800" },
                                        { label: "Lead Qualifier", color: "bg-orange-100 text-orange-800" },
                                    ].map((template) => (
                                        <Badge
                                            key={template.label}
                                            variant="secondary"
                                            className={`${template.color} cursor-pointer hover:opacity-80 transition-opacity w-full justify-start py-2`}
                                            onClick={() => setPrompt(`Create a ${template.label.toLowerCase()} chatbot that...`)}
                                        >
                                            {template.label}
                                        </Badge>
                                    ))}
                                </div>
                            </Card>
                            {/* Gemini Benefits */}
                            <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
                                <h4 className="font-semibold text-indigo-800 mb-3">Why Gemini?</h4>
                                <ul className="space-y-2 text-sm text-indigo-700">
                                    <li className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 flex-shrink-0" />
                                        <span>Powerful multimodal capabilities</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 flex-shrink-0" />
                                        <span>Optimized for various tasks</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 flex-shrink-0" />
                                        <span>Scalable and reliable infrastructure</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 flex-shrink-0" />
                                        <span>Continuous improvements and new features</span>
                                    </li>
                                </ul>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
