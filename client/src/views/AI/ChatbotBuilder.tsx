import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
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
    Upload,
    Download,
    MessageCircle,
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
    const [currentView, setCurrentView] = useState<'builder' | 'chat' | 'creator'>('builder')
    const [activeTab, setActiveTab] = useState<'config' | 'preview' | 'download'>('config')
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

    // File upload states
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isDragOver, setIsDragOver] = useState(false)

    // Example prompts
    const [examples] = useState<string[]>([
        'A customer support bot for an e-commerce store',
        'A coding tutor that explains programming concepts',
        'A creative writing assistant',
        'A personal fitness coach bot',
        'A travel guide for popular destinations'
    ])

    // Advanced bot config for creator mode
    const [botConfig, setBotConfig] = useState<BotConfig>({
        id: '',
        name: 'My AI Assistant',
        personality: 'helpful',
        tone: 'friendly',
        strictness: 50,
        instructions: 'You are a helpful AI assistant. Be concise and accurate in your responses.',
        knowledgeBase: '',
        theme: 'dark',
        model: 'mistralai/mixtral-8x7b-instruct',
        prompt: '',
        enableMemory: true,
        enableTools: false
    })

    // Chat functionality states
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
    const [currentMessage, setCurrentMessage] = useState('')
    const [isChatGenerating, setIsChatGenerating] = useState(false)
    const chatEndRef = useRef<HTMLDivElement>(null)

    // Initialize chat messages when botConfig changes
    useEffect(() => {
        if (botConfig.name) {
            setChatMessages([{
                role: 'assistant',
                content: `Hello! I'm ${botConfig.name}. How can I help you today?`,
                timestamp: Date.now()
            }])
        }
    }, [botConfig.name])

    const handleGenerate = async () => {
        if (!prompt.trim() || !apiKey.trim()) {
            alert("Please enter a prompt and your API key.")
            return
        }
        setIsGenerating(true)

        try {
            // Generate chatbot based on prompt
            const newBotConfig: BotConfig = {
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

            setGeneratedBot(newBotConfig)
            setBotConfig(newBotConfig)

            // Initialize chat with welcome message
            setChatMessages([{
                role: 'assistant',
                content: `Hello! I'm ${newBotConfig.name}. How can I help you today?`,
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
            const enhancedPrompt = enhancePromptLogic(prompt)
            setPrompt(enhancedPrompt)
        } catch (error) {
            console.error("Failed to enhance prompt:", error)
            alert("Failed to enhance prompt. Please try again.")
        } finally {
            setIsEnhancing(false)
        }
    }

    const handleFileUpload = (files: FileList | null) => {
        if (!files) return

        const file = files[0]
        const maxSize = 5 * 1024 * 1024 // 5MB

        if (file.size > maxSize) {
            alert("File too large. Please upload a file smaller than 5MB")
            return
        }

        const reader = new FileReader()
        reader.onload = (e) => {
            const content = e.target?.result as string
            setBotConfig(prev => ({
                ...prev,
                knowledgeBase: prev.knowledgeBase + '\n\n' + content
            }))
            alert(`Added ${file.name} to knowledge base`)
        }

        if (file.type.includes('text') || file.name.endsWith('.json')) {
            reader.readAsText(file)
        } else {
            alert("Unsupported file type. Please upload .txt, .json, or other text files")
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
        handleFileUpload(e.dataTransfer.files)
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
    }

    const sendMessage = async () => {
        if (!currentMessage.trim() || !botConfig) return

        const userMessage: ChatMessage = {
            role: 'user',
            content: currentMessage,
            timestamp: Date.now()
        }

        setChatMessages(prev => [...prev, userMessage])
        setCurrentMessage('')
        setIsChatGenerating(true)

        try {
            const systemPrompt = `You are ${botConfig.name}. ${botConfig.instructions}

Personality: ${botConfig.personality}
Tone: ${botConfig.tone}
Strictness Level: ${botConfig.strictness}%

${botConfig.knowledgeBase ? `Knowledge Base:\n${botConfig.knowledgeBase}` : ''}

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
                    model: botConfig.model,
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

    const generateStandaloneChatbot = () => {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${botConfig.name} - AI Chatbot</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        :root {
            --primary: ${botConfig.theme === 'light' ? '263 70% 50%' : botConfig.theme === 'blue' ? '213 75% 55%' : botConfig.theme === 'purple' ? '280 75% 55%' : '222.2 84% 4.9%'};
            --primary-foreground: ${botConfig.theme === 'light' ? '0 0% 98%' : botConfig.theme === 'blue' ? '220 26% 14%' : botConfig.theme === 'purple' ? '270 26% 14%' : '210 40% 98%'};
            --background: ${botConfig.theme === 'light' ? '0 0% 100%' : botConfig.theme === 'blue' ? '220 26% 14%' : botConfig.theme === 'purple' ? '270 26% 14%' : '222.2 84% 4.9%'};
            --foreground: ${botConfig.theme === 'light' ? '222.2 84% 4.9%' : botConfig.theme === 'blue' ? '213 31% 91%' : botConfig.theme === 'purple' ? '280 31% 91%' : '210 40% 98%'};
            --muted: ${botConfig.theme === 'light' ? '210 40% 96%' : botConfig.theme === 'blue' ? '220 13% 22%' : botConfig.theme === 'purple' ? '270 13% 22%' : '217.2 32.6% 17.5%'};
            --muted-foreground: ${botConfig.theme === 'light' ? '215.4 16.3% 46.9%' : botConfig.theme === 'blue' ? '213 19% 65%' : botConfig.theme === 'purple' ? '280 19% 65%' : '215 20.2% 65.1%'};
            --border: ${botConfig.theme === 'light' ? '214.3 31.8% 91.4%' : botConfig.theme === 'blue' ? '220 13% 22%' : botConfig.theme === 'purple' ? '270 13% 22%' : '217.2 32.6% 17.5%'};
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: hsl(var(--background));
            color: hsl(var(--foreground));
            height: 100vh;
            display: flex;
            flex-direction: column;
        }
        
        .header {
            background: hsl(var(--primary));
            color: hsl(var(--primary-foreground));
            padding: 1rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        
        .header h2 { font-size: 1.125rem; font-weight: 600; }
        .header p { font-size: 0.75rem; opacity: 0.8; }
        
        .chat-container {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        
        .api-key-input {
            margin: 1rem;
            padding: 1rem;
            background: hsl(var(--muted));
            border-radius: 0.5rem;
        }
        
        .api-key-input label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
        }
        
        .api-key-input input {
            width: 100%;
            padding: 0.5rem;
            border: 1px solid hsl(var(--border));
            border-radius: 0.25rem;
            background: hsl(var(--background));
            color: hsl(var(--foreground));
            margin-bottom: 0.5rem;
        }
        
        .api-key-input small {
            color: hsl(var(--muted-foreground));
        }
        
        .api-key-input a {
            color: hsl(var(--primary));
            text-decoration: underline;
        }
        
        .messages {
            flex: 1;
            overflow-y: auto;
            padding: 1rem;
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        
        .message {
            display: flex;
            max-width: 85%;
        }
        
        .message.user { align-self: flex-end; }
        .message.assistant { align-self: flex-start; }
        
        .message-content {
            padding: 0.75rem;
            border-radius: 1rem;
            font-size: 0.875rem;
        }
        
        .message.user .message-content {
            background: hsl(var(--primary));
            color: hsl(var(--primary-foreground));
        }
        
        .message.assistant .message-content {
            background: hsl(var(--muted));
            color: hsl(var(--muted-foreground));
        }
        
        .message-time {
            font-size: 0.75rem;
            opacity: 0.6;
            margin-top: 0.25rem;
        }
        
        .input-area {
            border-top: 1px solid hsl(var(--border));
            padding: 1rem;
            display: flex;
            gap: 0.5rem;
        }
        
        .input-field {
            flex: 1;
            padding: 0.75rem;
            border: 1px solid hsl(var(--border));
            border-radius: 0.5rem;
            background: hsl(var(--background));
            color: hsl(var(--foreground));
            outline: none;
        }
        
        .send-button {
            padding: 0.75rem;
            background: hsl(var(--primary));
            color: hsl(var(--primary-foreground));
            border: none;
            border-radius: 0.5rem;
            cursor: pointer;
            min-width: 44px;
        }
        
        .send-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        
        .loading {
            display: flex;
            gap: 0.25rem;
            padding: 0.75rem;
        }
        
        .loading-dot {
            width: 0.5rem;
            height: 0.5rem;
            background: currentColor;
            border-radius: 50%;
            animation: bounce 1.4s ease-in-out infinite both;
        }
        
        .loading-dot:nth-child(1) { animation-delay: -0.32s; }
        .loading-dot:nth-child(2) { animation-delay: -0.16s; }
        
        @keyframes bounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
        }
    </style>
</head>
<body>
    <div class="header">
        <div>
            <h2>${botConfig.name}</h2>
            <p>${botConfig.personality} • ${botConfig.tone}</p>
        </div>
    </div>
    
    <div class="chat-container">
        <div class="api-key-input">
            <label for="apiKey">Enter your OpenRouter API Key:</label>
            <input type="password" id="apiKey" placeholder="sk-or-v1-..." />
            <small>Get your free API key from <a href="https://openrouter.ai" target="_blank">openrouter.ai</a></small>
        </div>
        
        <div class="messages" id="messages">
            <div class="message assistant">
                <div class="message-content">
                    Hello! I'm ${botConfig.name}. How can I help you today?
                    <div class="message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
            </div>
        </div>
        
        <div class="input-area">
            <input type="text" class="input-field" id="messageInput" placeholder="Type your message..." />
            <button class="send-button" id="sendButton">➤</button>
        </div>
    </div>
    
    <script>
        const botConfig = ${JSON.stringify(botConfig)};
        const messagesContainer = document.getElementById('messages');
        const messageInput = document.getElementById('messageInput');
        const sendButton = document.getElementById('sendButton');
        const apiKeyInput = document.getElementById('apiKey');
        
        let isGenerating = false;
        
        function addMessage(role, content) {
            const messageDiv = document.createElement('div');
            messageDiv.className = \`message \${role}\`;
            
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            messageDiv.innerHTML = \`
                <div class="message-content">
                    \${content}
                    <div class="message-time">\${time}</div>
                </div>
            \`;
            
            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
        
        function showLoading() {
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'message assistant';
            loadingDiv.id = 'loading-message';
            loadingDiv.innerHTML = \`
                <div class="message-content">
                    <div class="loading">
                        <div class="loading-dot"></div>
                        <div class="loading-dot"></div>
                        <div class="loading-dot"></div>
                    </div>
                </div>
            \`;
            messagesContainer.appendChild(loadingDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
        
        function hideLoading() {
            const loadingMessage = document.getElementById('loading-message');
            if (loadingMessage) {
                loadingMessage.remove();
            }
        }
        
        async function sendMessage() {
            const message = messageInput.value.trim();
            const apiKey = apiKeyInput.value.trim();
            
            if (!message || isGenerating) return;
            if (!apiKey) {
                alert('Please enter your OpenRouter API key first!');
                apiKeyInput.focus();
                return;
            }
            
            addMessage('user', message);
            messageInput.value = '';
            isGenerating = true;
            sendButton.disabled = true;
            
            showLoading();
            
            try {
                const systemPrompt = \`You are \${botConfig.name}. \${botConfig.instructions}

Personality: \${botConfig.personality}
Tone: \${botConfig.tone}
Strictness Level: \${botConfig.strictness}%

\${botConfig.knowledgeBase ? \`Knowledge Base:\\n\${botConfig.knowledgeBase}\` : ''}

Please respond in character according to these settings.\`;
                
                const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': \`Bearer \${apiKey}\`,
                        'Content-Type': 'application/json',
                        'HTTP-Referer': window.location.origin,
                        'X-Title': 'Custom AI Chatbot'
                    },
                    body: JSON.stringify({
                        model: botConfig.model,
                        messages: [
                            { role: 'system', content: systemPrompt },
                            { role: 'user', content: message }
                        ],
                        temperature: 0.7,
                        max_tokens: 500
                    })
                });
                
                hideLoading();
                
                if (!response.ok) {
                    throw new Error(\`API Error: \${response.status}\`);
                }
                
                const data = await response.json();
                addMessage('assistant', data.choices[0].message.content);
            } catch (error) {
                hideLoading();
                console.error('Error:', error);
                addMessage('assistant', 'Sorry, I encountered an error. Please check your API key and try again.');
            } finally {
                isGenerating = false;
                sendButton.disabled = false;
                messageInput.focus();
            }
        }
        
        sendButton.addEventListener('click', sendMessage);
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        
        // Save API key to localStorage
        apiKeyInput.addEventListener('input', () => {
            localStorage.setItem('openrouter-api-key', apiKeyInput.value);
        });
        
        // Load saved API key
        const savedApiKey = localStorage.getItem('openrouter-api-key');
        if (savedApiKey) {
            apiKeyInput.value = savedApiKey;
        }
    </script>
</body>
</html>`
    }

    const createChatbot = () => {
        const timestamp = Date.now()
        const botId = btoa(JSON.stringify({ ...botConfig, timestamp })).replace(/[^a-zA-Z0-9]/g, '').slice(0, 16)
        setBotConfig(prev => ({ ...prev, id: botId }))

        setActiveTab('preview')
        alert("Chatbot created successfully! You can now test it and download the standalone file")
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

    // Chat Interface View
    if (currentView === 'chat' && (generatedBot || botConfig.id)) {
        const activeBotConfig = generatedBot || botConfig
        return (
            <div className="h-screen flex flex-col bg-background text-foreground">
                <Card className="h-full flex flex-col border-0 rounded-none bg-transparent">
                    {/* Header */}
                    <CardHeader className="bg-indigo-500 text-white p-4 flex-shrink-0">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Bot className="h-6 w-6" />
                                <div>
                                    <h2 className="font-semibold">{activeBotConfig.name}</h2>
                                    <p className="text-xs opacity-80">{activeBotConfig.personality} • {activeBotConfig.tone}</p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setCurrentView(currentView === 'chat' && generatedBot ? 'builder' : 'creator')}
                                className="text-white hover:bg-indigo-500"
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
                                            className={`max-w-[85%] p-3 rounded-2xl ${message.role === 'user'
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

    // Advanced Creator View
    if (currentView === 'creator') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-25 px-5">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center items-center gap-3 mb-4">
                            <Bot className="h-12 w-12 text-indigo-500" />
                            <h1 className="text-4xl md:text-6xl font-bold text-indigo-500">
                                Advanced AI Chatbot Creator
                            </h1>
                        </div>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            Create custom AI assistants with advanced configuration and download as standalone files
                        </p>
                        <Button
                            variant="outline"
                            onClick={() => setCurrentView('builder')}
                            className="mt-4"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Simple Builder
                        </Button>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex justify-center mb-8">
                        <div className="bg-white/80 backdrop-blur-sm p-2 flex rounded-lg border border-indigo-200 shadow-lg">
                            <Button
                                variant={activeTab === 'config' ? 'default' : 'ghost'}
                                onClick={() => setActiveTab('config')}
                                className={`flex items-center gap-2 ${activeTab === 'config' ? 'bg-indigo-500 hover:bg-indigo-600 text-white' : ''}`}
                            >
                                <Settings className="h-4 w-4" />
                                Configure
                            </Button>
                            <Button
                                variant={activeTab === 'preview' ? 'default' : 'ghost'}
                                onClick={() => setActiveTab('preview')}
                                className={`flex items-center gap-2 ${activeTab === 'preview' ? 'bg-indigo-500 hover:bg-indigo-600 text-white' : ''}`}
                            >
                                <MessageCircle className="h-4 w-4" />
                                Preview
                            </Button>
                            <Button
                                variant={activeTab === 'download' ? 'default' : 'ghost'}
                                onClick={() => setActiveTab('download')}
                                className={`flex items-center gap-2 ${activeTab === 'download' ? 'bg-indigo-500 hover:bg-indigo-600 text-white' : ''}`}
                            >
                                <Download className="h-4 w-4" />
                                Download
                            </Button>
                        </div>
                    </div>

                    {/* Configuration Panel */}
                    {activeTab === 'config' && (
                        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-indigo-200">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-indigo-600" />
                                    Advanced Bot Configuration
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Basic Settings */}
                                    <div className="space-y-4">
                                        <div>
                                            <Label className="text-sm font-medium mb-2 block">Bot Name</Label>
                                            <Input
                                                value={botConfig.name}
                                                onChange={(e) => setBotConfig(prev => ({ ...prev, name: e.target.value }))}
                                                placeholder="My AI Assistant"
                                                className="border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                        </div>

                                        <div>
                                            <Label className="text-sm font-medium mb-2 block">Personality</Label>
                                            <Select
                                                value={botConfig.personality}
                                                onValueChange={(value) => setBotConfig(prev => ({ ...prev, personality: value }))}
                                            >
                                                <SelectTrigger className="border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="helpful">Helpful</SelectItem>
                                                    <SelectItem value="professional">Professional</SelectItem>
                                                    <SelectItem value="casual">Casual</SelectItem>
                                                    <SelectItem value="expert">Expert</SelectItem>
                                                    <SelectItem value="supportive">Supportive</SelectItem>
                                                    <SelectItem value="creative">Creative</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label className="text-sm font-medium mb-2 block">Tone</Label>
                                            <Select
                                                value={botConfig.tone}
                                                onValueChange={(value) => setBotConfig(prev => ({ ...prev, tone: value }))}
                                            >
                                                <SelectTrigger className="border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="friendly">Friendly</SelectItem>
                                                    <SelectItem value="formal">Formal</SelectItem>
                                                    <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                                                    <SelectItem value="calm">Calm</SelectItem>
                                                    <SelectItem value="witty">Witty</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label className="text-sm font-medium mb-2 block">
                                                Strictness Level: {botConfig.strictness}%
                                            </Label>
                                            <Slider
                                                value={botConfig.strictness}
                                                onValueChange={(value: number) => {
                                                    setBotConfig(prev => ({
                                                        ...prev,
                                                        strictness: value
                                                    }));
                                                }}
                                                max={100}
                                                step={1}
                                                className="w-full"
                                            />
                                            <p className="text-xs text-slate-500 mt-1">
                                                How strictly the AI follows instructions
                                            </p>
                                        </div>
                                    </div>

                                    {/* Advanced Settings */}
                                    <div className="space-y-4">
                                        <div>
                                            <Label className="text-sm font-medium mb-2 block">AI Model</Label>
                                            <Select
                                                value={botConfig.model}
                                                onValueChange={(value) => setBotConfig(prev => ({ ...prev, model: value }))}
                                            >
                                                <SelectTrigger className="border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="mistralai/mixtral-8x7b-instruct">Mixtral 8x7B (Fast)</SelectItem>
                                                    <SelectItem value="openchat/openchat-7b">OpenChat 7B (Free)</SelectItem>
                                                    <SelectItem value="nousresearch/nous-hermes-llama2-13b">Nous Hermes 13B</SelectItem>
                                                    <SelectItem value="mistralai/mistral-7b-instruct">Mistral 7B</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label className="text-sm font-medium mb-2 block">Theme</Label>
                                            <Select
                                                value={botConfig.theme}
                                                onValueChange={(value) => setBotConfig(prev => ({ ...prev, theme: value }))}
                                            >
                                                <SelectTrigger className="border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="dark">Dark</SelectItem>
                                                    <SelectItem value="light">Light</SelectItem>
                                                    <SelectItem value="blue">Blue</SelectItem>
                                                    <SelectItem value="purple">Purple</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* File Upload */}
                                        <div>
                                            <Label className="text-sm font-medium mb-2 block">Knowledge Base (Optional)</Label>
                                            <div
                                                className={`p-6 text-center cursor-pointer border-2 border-dashed rounded-lg transition-colors ${isDragOver
                                                    ? 'border-indigo-500 bg-indigo-50'
                                                    : 'border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50'
                                                    }`}
                                                onDrop={handleDrop}
                                                onDragOver={handleDragOver}
                                                onDragLeave={handleDragLeave}
                                                onClick={() => fileInputRef.current?.click()}
                                            >
                                                <Upload className="h-8 w-8 mx-auto mb-2 text-indigo-500" />
                                                <p className="text-sm text-slate-600">
                                                    Drop files here or click to upload
                                                </p>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    Supports .txt, .json (max 5MB)
                                                </p>
                                            </div>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                className="hidden"
                                                accept=".txt,.json,.md"
                                                onChange={(e) => handleFileUpload(e.target.files)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Custom Instructions */}
                                <div>
                                    <Label className="text-sm font-medium mb-2 block">Custom Instructions</Label>
                                    <Textarea
                                        value={botConfig.instructions}
                                        onChange={(e) => setBotConfig(prev => ({ ...prev, instructions: e.target.value }))}
                                        placeholder="Define how your AI should behave, what it knows, and how it should respond..."
                                        className="min-h-[100px] border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>

                                {/* Knowledge Base Display */}
                                {botConfig.knowledgeBase && (
                                    <div>
                                        <Label className="text-sm font-medium mb-2 block">Current Knowledge Base</Label>
                                        <Textarea
                                            value={botConfig.knowledgeBase}
                                            onChange={(e) => setBotConfig(prev => ({ ...prev, knowledgeBase: e.target.value }))}
                                            className="min-h-[100px] border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500"
                                            placeholder="Knowledge base content will appear here..."
                                        />
                                    </div>
                                )}

                                <Button onClick={createChatbot} className="bg-indigo-600 hover:bg-indigo-700 text-white w-full">
                                    <Bot className="h-4 w-4 mr-2" />
                                    Create My AI Chatbot
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {/* Chat Preview */}
                    {activeTab === 'preview' && (
                        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-indigo-200">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MessageCircle className="h-5 w-5 text-indigo-600" />
                                    Chat Preview - {botConfig.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-96 overflow-y-auto mb-4 space-y-4 p-4 bg-slate-50 rounded-lg border border-indigo-200">
                                    {chatMessages.map((message, index) => (
                                        <div
                                            key={index}
                                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[80%] p-3 rounded-2xl ${message.role === 'user'
                                                    ? 'bg-indigo-600 text-white ml-4'
                                                    : 'bg-white text-slate-700 mr-4 border border-indigo-200'
                                                    }`}
                                            >
                                                {message.content}
                                            </div>
                                        </div>
                                    ))}
                                    {isChatGenerating && (
                                        <div className="flex justify-start">
                                            <div className="bg-white text-slate-700 p-3 rounded-2xl mr-4 border border-indigo-200">
                                                <div className="flex gap-1">
                                                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
                                                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Input
                                        value={currentMessage}
                                        onChange={(e) => setCurrentMessage(e.target.value)}
                                        placeholder="Type your message..."
                                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                        disabled={isChatGenerating}
                                        className="flex-1 border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    <Button onClick={sendMessage} disabled={isChatGenerating || !currentMessage.trim()} className="bg-indigo-600 hover:bg-indigo-700">
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="mt-4 text-center">
                                    <Button onClick={() => setCurrentView('chat')} variant="outline" className="border-indigo-200 text-indigo-600 hover:bg-indigo-50">
                                        <MessageSquare className="h-4 w-4 mr-2" />
                                        Open Full Chat Interface
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Download Tab */}
                    {activeTab === 'download' && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <h3 className="text-lg font-semibold mb-2">Download Your Chatbot!</h3>
                                <p className="text-slate-600">Get a standalone HTML file with your custom AI chatbot configuration.</p>
                            </div>

                            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-indigo-200 p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-indigo-100 rounded-lg">
                                        <Download className="h-5 w-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium">Standalone Chatbot File</h4>
                                        <p className="text-sm text-slate-600">Complete HTML file with your AI configuration</p>
                                    </div>
                                </div>

                                <Button
                                    className="w-full mb-4 bg-indigo-600 hover:bg-indigo-700 text-white"
                                    onClick={() => {
                                        const htmlContent = generateStandaloneChatbot()
                                        const blob = new Blob([htmlContent], { type: 'text/html' })
                                        const url = URL.createObjectURL(blob)
                                        const a = document.createElement('a')
                                        a.href = url
                                        a.download = `${botConfig.name.toLowerCase().replace(/\s+/g, '-')}-chatbot.html`
                                        a.click()
                                        URL.revokeObjectURL(url)
                                        alert("Downloaded! Your chatbot HTML file has been downloaded")
                                    }}
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    Download Chatbot HTML
                                </Button>

                                <div className="text-xs text-slate-500">
                                    File includes: HTML structure, CSS styling, JavaScript functionality, and your AI configuration
                                </div>
                            </Card>

                            <Card className="bg-orange-50 border-orange-200 p-6">
                                <h4 className="font-medium text-orange-700 mb-3 flex items-center gap-2">
                                    🔑 Setup Instructions
                                </h4>
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <strong>Step 1:</strong> Get your free OpenRouter API key
                                        <ul className="ml-4 mt-1 space-y-1 text-slate-600">
                                            <li>• Visit <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">openrouter.ai</a></li>
                                            <li>• Sign up for a free account</li>
                                            <li>• Go to "Keys" section in your dashboard</li>
                                            <li>• Create a new API key (starts with "sk-or-v1-")</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <strong>Step 2:</strong> Use your chatbot
                                        <ul className="ml-4 mt-1 space-y-1 text-slate-600">
                                            <li>• Open the downloaded HTML file in any browser</li>
                                            <li>• Enter your OpenRouter API key in the input field</li>
                                            <li>• Start chatting with your custom AI!</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <strong>Step 3:</strong> Deploy (optional)
                                        <ul className="ml-4 mt-1 space-y-1 text-slate-600">
                                            <li>• Upload the HTML file to any web hosting service</li>
                                            <li>• Share the URL with others</li>
                                            <li>• Works on GitHub Pages, Netlify, Vercel, etc.</li>
                                        </ul>
                                    </div>
                                </div>
                            </Card>

                            <Card className="bg-green-50 border-green-200 p-4">
                                <h4 className="font-medium text-green-700 mb-2">✨ What you get</h4>
                                <ul className="text-sm text-slate-600 space-y-1">
                                    <li>• Complete standalone chatbot with your AI configuration</li>
                                    <li>• No dependencies - works offline after API key setup</li>
                                    <li>• Fully customizable HTML/CSS/JavaScript</li>
                                    <li>• Free to use with OpenRouter's free tier</li>
                                    <li>• Can be deployed anywhere or used locally</li>
                                </ul>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    // Simple Builder View (Original)
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
                    <Button
                        onClick={() => setCurrentView('creator')}
                        variant="outline"
                        className="mt-4 border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                    >
                        <Settings className="h-4 w-4 mr-2" />
                        Advanced Creator Mode
                    </Button>
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
                                                    placeholder="Purpose:
You are a dedicated study assistant helping the user study a specific subject. You strictly stay within the academic scope and avoid unrelated discussions unless prompted.
Act as my study assistant focused only on [Subject]; start by greeting me, then ask what topic I need help with, and assist by explaining concepts, giving quizzes, or guiding through problems—stay on-topic, be concise, supportive, and avoid unrelated conversation.
"
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
                                            {examples.map((example: string, index: number) => (
                                                <Card key={index} className="p-4 mb-3">
                                                    <p className="text-sm text-slate-700 leading-relaxed">{example}</p>
                                                    <div className="flex items-center justify-between mt-3">
                                                        <Badge variant="outline" className="text-xs">
                                                            Example {index + 1}
                                                        </Badge>
                                                        <Copy className="w-4 h-4 text-slate-400 cursor-pointer" />
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
