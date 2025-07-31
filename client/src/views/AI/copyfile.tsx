import { useEffect, useState, useRef } from "react"
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
import { CardContent, CardHeader } from "@/components/ui/card"
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
    Send,
    Bot,
    ArrowLeft,
} from "lucide-react"

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface BotConfig {
  id: string;
  name: string;
  personality: string;
  tone: string;
  strictness: number;
  instructions: string;
  knowledgeBase: string;
  theme: string;
  model: string;
  prompt: string;
  enableMemory: boolean;
  enableTools: boolean;
}

const OPENROUTER_API_KEY = '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';

export default function ChatbotBuilder() {
    const [currentView, setCurrentView] = useState<'builder' | 'chat'>('builder')
    const [prompt, setPrompt] = useState("")
    const [apiKey, setApiKey] = useState("")
    const [showApiKey, setShowApiKey] = useState(false)
    const [model, setModel] = useState("mistralai/mixtral-8x7b-instruct")
    const [personality, setPersonality] = useState("helpful")
    const [enableMemory, setEnableMemory] = useState(true)
    const [enableTools, setEnableTools] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)
    const [isEnhancing, setIsEnhancing] = useState(false)
    const [generatedBot, setGeneratedBot] = useState<BotConfig | null>(null)
    
    // Chat functionality states
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
    const [currentMessage, setCurrentMessage] = useState('')
    const [isChatGenerating, setIsChatGenerating] = useState(false)
    const chatEndRef = useRef<HTMLDivElement>(null)

    const handleGenerate = async () => {
        if (!prompt.trim() || !apiKey.trim()) {
            alert("Please enter a prompt and your Gemini API key.")
            return
        }
        setIsGenerating(true)

        try {
            // Simulate chatbot generation based on prompt
            const botConfig: BotConfig = {
                id: Date.now().toString(),
                name: extractBotName(prompt) || "AI Assistant",
                personality: personality,
                tone: personality === "formal" ? "professional" : personality === "creative" ? "playful" : "friendly",
                strictness: 50,
                instructions: generateInstructions(prompt, personality),
                knowledgeBase: extractKnowledgeBase(prompt),
                theme: "dark",
                model: model,
                prompt: prompt,
                enableMemory: enableMemory,
                enableTools: enableTools
            }

            // Store in memory (simulating localStorage)
            setGeneratedBot(botConfig)
            
            // Initialize chat with welcome message
            setChatMessages([{
                role: 'assistant',
                content: `Hello! I'm ${botConfig.name}. How can I help you today?`,
                timestamp: Date.now()
            }])

            // Switch to chat view
            setCurrentView('chat')
        } catch (error) {
            console.error("Failed to generate chatbot:", error)
            alert("Failed to generate chatbot. Please try again.")
        } finally {
            setIsGenerating(false)
        }
    }

    const handleEnhancePrompt = async () => {
        if (!prompt.trim()) return
        setIsEnhancing(true)

        try {
            // Simulate prompt enhancement
            const enhancedPrompt = enhancePromptLogic(prompt)
            setPrompt(enhancedPrompt)
        } catch (error) {
            console.error("Failed to enhance prompt:", error)
            alert("Failed to enhance prompt. Please try again.")
        } finally {
            setIsEnhancing(false)
        }
    }

    const sendMessage = async () => {
        if (!currentMessage.trim() || !generatedBot) return

        const userMessage: ChatMessage = {
            role: 'user',
            content: currentMessage,
            timestamp: Date.now()
        }

        setChatMessages(prev => [...prev, userMessage])
        setCurrentMessage('')
        setIsChatGenerating(true)

        try {
            const systemPrompt = `You are ${generatedBot.name}. ${generatedBot.instructions}

Personality: ${generatedBot.personality}
Tone: ${generatedBot.tone}
Strictness Level: ${generatedBot.strictness}%

${generatedBot.knowledgeBase ? `Knowledge Base:\n${generatedBot.knowledgeBase}` : ''}

Please respond in character according to these settings.`

            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'AI Chatbot Creator'
                },
                body: JSON.stringify({
                    model: generatedBot.model,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: currentMessage }
                    ],
                    temperature: 0.7,
                    max_tokens: 500
                })
            })

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`)
            }

            const data = await response.json()
            const assistantMessage: ChatMessage = {
                role: 'assistant',
                content: data.choices[0].message.content,
                timestamp: Date.now()
            }

            setChatMessages(prev => [...prev, assistantMessage])
        } catch (error) {
            console.error('Error sending message:', error)
            const errorMessage: ChatMessage = {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.',
                timestamp: Date.now()
            }
            setChatMessages(prev => [...prev, errorMessage])
        } finally {
            setIsChatGenerating(false)
        }
    }

    // Auto-scroll chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [chatMessages])

    // Helper functions
    const extractBotName = (prompt: string): string => {
        const nameMatch = prompt.match(/(?:called|named|name is)\s+([A-Za-z\s]+)/i)
        if (nameMatch) return nameMatch[1].trim()
        
        if (prompt.toLowerCase().includes('customer support')) return 'Support Assistant'
        if (prompt.toLowerCase().includes('sales')) return 'Sales Assistant'
        if (prompt.toLowerCase().includes('faq')) return 'FAQ Bot'
        if (prompt.toLowerCase().includes('lead')) return 'Lead Qualifier'
        
        return 'AI Assistant'
    }

    const generateInstructions = (prompt: string, personality: string): string => {
        let base = `You are a helpful AI assistant created based on this description: ${prompt}`
        
        switch (personality) {
            case 'formal':
                base += ' Always maintain a professional and formal tone in your responses.'
                break
            case 'friendly':
                base += ' Be warm, friendly, and approachable in your interactions.'
                break
            case 'creative':
                base += ' Be creative, playful, and think outside the box in your responses.'
                break
            default:
                base += ' Be helpful and professional while remaining approachable.'
        }
        
        return base
    }

    const extractKnowledgeBase = (prompt: string): string => {
        // Extract any specific knowledge or context from the prompt
        if (prompt.toLowerCase().includes('product catalog')) {
            return 'Access to product catalog and inventory information.'
        }
        if (prompt.toLowerCase().includes('order management')) {
            return 'Access to order tracking and management systems.'
        }
        if (prompt.toLowerCase().includes('healthcare')) {
            return 'Knowledge of healthcare services, appointments, and general medical information.'
        }
        return ''
    }

    const enhancePromptLogic = (originalPrompt: string): string => {
        const enhancements = [
            'Consider adding specific use cases and scenarios.',
            'Include details about the target audience.',
            'Specify the tone and personality preferences.',
            'Mention any integrations or data sources needed.',
            'Define success metrics and KPIs.'
        ]
        
        return originalPrompt + '\n\nEnhanced considerations:\n' + 
               enhancements.map(e => `• ${e}`).join('\n')
    }

    const examplePrompts = [
        "Create a customer support chatbot for an e-commerce platform that can handle order inquiries, product questions, and return requests with a friendly, professional tone.",
        "Build a lead qualification chatbot for a SaaS company that asks relevant questions to identify potential customers and schedules demos.",
        "Design a FAQ chatbot for a healthcare clinic that can answer common questions about services, appointments, and insurance coverage.",
        "Develop a restaurant reservation chatbot that can check availability, make bookings, and provide menu information.",
    ]

    const characterCount = prompt.length
    const maxCharacters = 3000

    if (currentView === 'chat' && generatedBot) {
        return (
            <div className="h-screen flex flex-col bg-background text-foreground">
                <Card className="h-full flex flex-col border-0 rounded-none bg-transparent">
                    {/* Header */}
                    <CardHeader className="bg-indigo-600 text-white p-4 flex-shrink-0">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Bot className="h-6 w-6" />
                                <div>
                                    <h2 className="font-semibold">{generatedBot.name}</h2>
                                    <p className="text-xs opacity-80">{generatedBot.personality} • {generatedBot.tone}</p>
                                </div>
                            </div>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setCurrentView('builder')}
                                className="text-white hover:bg-indigo-700"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Builder
                            </Button>
                        </div>
                    </CardHeader>

                    {/* Chat Area */}
                    <CardContent className="flex-1 overflow-hidden p-0">
                        <div className="h-full flex flex-col">
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {chatMessages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[85%] p-3 rounded-2xl ${
                                                message.role === 'user'
                                                    ? 'bg-indigo-600 text-white ml-4'
                                                    : 'bg-gray-100 text-gray-800 mr-4'
                                            }`}
                                        >
                                            <div className="text-sm">{message.content}</div>
                                            <div className="text-xs opacity-60 mt-1">
                                                {new Date(message.timestamp).toLocaleTimeString([], { 
                                                    hour: '2-digit', 
                                                    minute: '2-digit' 
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                
                                {isChatGenerating && (
                                    <div className="flex justify-start">
                                        <div className="bg-gray-100 text-gray-800 p-3 rounded-2xl mr-4">
                                            <div className="flex gap-1">
                                                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                                                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="border-t p-4 flex-shrink-0">
                                <div className="flex gap-2">
                                    <Input
                                        value={currentMessage}
                                        onChange={(e) => setCurrentMessage(e.target.value)}
                                        placeholder="Type your message..."
                                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                                        disabled={isChatGenerating}
                                        className="flex-1"
                                    />
                                    <Button 
                                        onClick={sendMessage} 
                                        disabled={isChatGenerating || !currentMessage.trim()}
                                        size="icon"
                                        className="bg-indigo-600 hover:bg-indigo-700"
                                    >
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-20">
            <div className="container mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center flex-col gap-3 mb-6">
                        <div className="p-3">
                            <Bot className="h-15 w-15 text-indigo-600" />
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
                                                Enter your API key to power your chatbot generation.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="api-key" className="text-sm font-medium text-slate-700 mb-2 block">
                                                API Key
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    id="api-key"
                                                    type={showApiKey ? "text" : "password"}
                                                    placeholder="sk-or-v1-..."
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
                                                    Using OpenRouter for AI model access. Get your API key:
                                                    <Button
                                                        variant="link"
                                                        className="p-0 h-auto text-indigo-600 hover:text-indigo-800 mt-2"
                                                        onClick={() => window.open("https://openrouter.ai/keys", "_blank")}
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
                                                <SelectItem value="mistralai/mixtral-8x7b-instruct">Mixtral 8x7B (Recommended)</SelectItem>
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
                                            onClick={() => setPrompt(`Create a ${template.label.toLowerCase()} chatbot that can help users with their inquiries and provide excellent service.`)}
                                        >
                                            {template.label}
                                        </Badge>
                                    ))}
                                </div>
                            </Card>

                                {/* AI Benefits */}
                                <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
                                <h4 className="font-semibold text-indigo-800 mb-3">Why AI Chatbots?</h4>
                                <ul className="space-y-2 text-sm text-indigo-700">
                                    <li className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 flex-shrink-0" />
                                        <span>24/7 availability for customer support</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 flex-shrink-0" />
                                        <span>Instant responses to common queries</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 flex-shrink-0" />
                                        <span>Scalable solution for growing businesses</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 flex-shrink-0" />
                                        <span>Customizable personality and tone</span>
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
    
   