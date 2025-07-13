import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Settings, Trash2, Loader2, ArrowLeft } from 'lucide-react';
import { VoiceRecorder } from './VoiceRecorder';
import { MessageBubble } from './MessageBubble';
import { ApiKeyDialog } from './ApiKeyDialog';
import { ConversationCircle } from './ConversationCircle';
import { useOpenRouter } from '@/hooks/useOpenRouter';
import { useElevenLabs } from '@/hooks/useElevenLabs';
import { useToast } from '@/hooks/use-toast';

interface Message {
    id: string;
    content: string;
    isUser: boolean;
    timestamp: Date;
}

interface ApiKeys {
    openRouterKey: string;
    elevenLabsKey: string;
}

const SYSTEM_PROMPT = {
    role: 'system' as const,
    content: 'You are a helpful AI assistant in a voice conversation. Keep your responses natural, conversational, and concise - as if speaking to someone in person. Avoid overly long explanations unless specifically asked.'
};

export const ConversationInterface = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isListening, setIsListening] = useState(false);
    const [apiKeys, setApiKeys] = useState<ApiKeys>({ openRouterKey: '', elevenLabsKey: '' });
    const [showApiDialog, setShowApiDialog] = useState(false);
    const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);
    const [isInConversationMode, setIsInConversationMode] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    // Initialize API hooks
    const { generateResponse, isLoading: isGenerating, error: openRouterError } = useOpenRouter({
        apiKey: apiKeys.openRouterKey
    });

    const { synthesizeAndPlay, stopAudio, isPlaying, isLoading: isSynthesizing, error: elevenLabsError } = useElevenLabs({
        apiKey: apiKeys.elevenLabsKey
    });

    // Load API keys from localStorage on mount
    useEffect(() => {
        const savedKeys = localStorage.getItem('voice-ai-keys');
        if (savedKeys) {
            try {
                const keys = JSON.parse(savedKeys);
                setApiKeys(keys);
            } catch (error) {
                console.error('Failed to load saved API keys:', error);
            }
        } else {
            setShowApiDialog(true);
        }
    }, []);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Show errors as toasts
    useEffect(() => {
        if (openRouterError) {
            toast({
                title: 'OpenRouter Error',
                description: openRouterError,
                variant: 'destructive'
            });
        }
    }, [openRouterError, toast]);

    useEffect(() => {
        if (elevenLabsError) {
            toast({
                title: 'ElevenLabs Error',
                description: elevenLabsError,
                variant: 'destructive'
            });
        }
    }, [elevenLabsError, toast]);

    const handleApiKeySave = (keys: ApiKeys) => {
        setApiKeys(keys);
        localStorage.setItem('voice-ai-keys', JSON.stringify(keys));
        toast({
            title: 'API Keys Saved',
            description: 'Your API keys have been saved locally.'
        });
    };

    const handleTranscript = async (transcript: string) => {
        if (!transcript.trim()) return;

        // Enter conversation mode on first message
        if (messages.length === 0) {
            setIsInConversationMode(true);
        }

        // Add user message
        const userMessage: Message = {
            id: Date.now().toString(),
            content: transcript,
            isUser: true,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setIsListening(false);

        try {
            // Generate AI response
            const conversationHistory = messages.map(msg => ({
                role: msg.isUser ? 'user' as const : 'assistant' as const,
                content: msg.content
            }));

            const response = await generateResponse([
                SYSTEM_PROMPT,
                ...conversationHistory,
                { role: 'user', content: transcript }
            ]);

            // Add AI message
            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: response,
                isUser: false,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMessage]);

            // Auto-play AI response
            setTimeout(() => {
                handlePlayAudio(aiMessage.id, response);
            }, 500);

        } catch (error) {
            console.error('Failed to generate response:', error);
            toast({
                title: 'Failed to generate response',
                description: error instanceof Error ? error.message : 'Unknown error occurred',
                variant: 'destructive'
            });
        }
    };

    const handlePlayAudio = async (messageId: string, text: string) => {
        try {
            setCurrentPlayingId(messageId);
            await synthesizeAndPlay(text);
        } catch (error) {
            console.error('Failed to play audio:', error);
        } finally {
            setCurrentPlayingId(null);
        }
    };

    const handleStopAudio = () => {
        stopAudio();
        setCurrentPlayingId(null);
    };

    const clearConversation = () => {
        setMessages([]);
        stopAudio();
        setCurrentPlayingId(null);
        setIsInConversationMode(false);
        toast({
            title: 'Conversation cleared',
            description: 'All messages have been removed.'
        });
    };

    const exitConversationMode = () => {
        setIsInConversationMode(false);
        stopAudio();
        setCurrentPlayingId(null);
        setIsListening(false);
    };

    const canStartConversation = apiKeys.openRouterKey && apiKeys.elevenLabsKey;

    return (
        <div className="flex flex-col h-screen bg-white mt-15">
            {isInConversationMode ? (
                // Conversation Mode - Dark screen with animated circle
                <div className="flex-1 flex flex-col">
                    {/* Minimal header with back button */}
                    <div className="flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={exitConversationMode}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Chat
                        </Button>

                        <div className="flex items-center space-x-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearConversation}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Conversation Circle Area */}
                    <div className="flex-1 flex items-center justify-center bg-black/95 relative">
                        <ConversationCircle
                            isListening={isListening}
                            isGenerating={isGenerating}
                            isSpeaking={isPlaying}
                        />
                    </div>

                    {/* Voice Recorder */}
                    <div className="p-6 bg-black/80 backdrop-blur-sm">
                        <div className="max-w-md mx-auto">
                            <VoiceRecorder
                                onTranscript={handleTranscript}
                                isListening={isListening}
                                onToggleListening={() => setIsListening(!isListening)}
                                disabled={!canStartConversation || isGenerating || isSynthesizing}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                // Chat Mode - Traditional chat interface
                <>
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-border/50 bg-gradient-card/50 backdrop-blur-sm">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                                <div className="w-4 h-4 rounded-full bg-primary-foreground animate-pulse-glow" />
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold text-foreground">Voice AI Assistant</h1>
                                <p className="text-sm text-muted-foreground">
                                    {canStartConversation ? 'Ready to chat' : 'Configure API keys to start'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearConversation}
                                disabled={messages.length === 0}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowApiDialog(true)}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                <Settings className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <ScrollArea className="flex-1 px-4">
                        <div className="py-6 space-y-6 max-w-4xl mx-auto">
                            {messages.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 rounded-full bg-gradient-primary/20 flex items-center justify-center mx-auto mb-6">
                                        <div className="w-8 h-8 rounded-full bg-gradient-primary animate-pulse-glow" />
                                    </div>
                                    <h2 className="text-2xl font-semibold text-foreground mb-2">
                                        Start a conversation
                                    </h2>
                                    <p className="text-muted-foreground max-w-md mx-auto">
                                        {canStartConversation
                                            ? "Tap the microphone below to begin speaking with your AI assistant."
                                            : "Configure your API keys in settings to get started."}
                                    </p>
                                </div>
                            ) : (
                                messages.map((message) => (
                                    <MessageBubble
                                        key={message.id}
                                        message={message.content}
                                        isUser={message.isUser}
                                        timestamp={message.timestamp}
                                        isPlaying={currentPlayingId === message.id}
                                        onPlayAudio={!message.isUser ? () => handlePlayAudio(message.id, message.content) : undefined}
                                        onStopAudio={!message.isUser ? handleStopAudio : undefined}
                                    />
                                ))
                            )}

                            {/* Loading indicator */}
                            {(isGenerating || isSynthesizing) && (
                                <div className="flex items-center justify-center py-4">
                                    <div className="flex items-center space-x-2 text-muted-foreground">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span className="text-sm">
                                            {isGenerating ? 'Thinking...' : 'Speaking...'}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>
                    </ScrollArea>

                    {/* Voice Recorder */}
                    <div className="p-6 border-t border-border/50 bg-gradient-card/30 backdrop-blur-sm">
                        <div className="max-w-md mx-auto">
                            <VoiceRecorder
                                onTranscript={handleTranscript}
                                isListening={isListening}
                                onToggleListening={() => setIsListening(!isListening)}
                                disabled={!canStartConversation || isGenerating || isSynthesizing}
                            />
                        </div>
                    </div>
                </>
            )}

            {/* API Key Dialog */}
            <ApiKeyDialog
                open={showApiDialog}
                onOpenChange={setShowApiDialog}
                onSave={handleApiKeySave}
                currentKeys={apiKeys}
            />
        </div>
    );
};