import { cn } from '@/lib/utils';
import { Bot, User, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MessageBubbleProps {
    message: string;
    isUser: boolean;
    timestamp: Date;
    isPlaying?: boolean;
    onPlayAudio?: () => void;
    onStopAudio?: () => void;
}

export const MessageBubble = ({
    message,
    isUser,
    timestamp,
    isPlaying = false,
    onPlayAudio,
    onStopAudio
}: MessageBubbleProps) => {
    return (
        <div
            className={cn(
                "flex items-start space-x-3 animate-fade-in-up",
                isUser ? "flex-row-reverse space-x-reverse" : "flex-row"
            )}
        >
            {/* Avatar */}
            <div
                className={cn(
                    "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
                    isUser
                        ? "bg-gradient-primary shadow-button"
                        : "bg-gradient-card border border-border"
                )}
            >
                {isUser ? (
                    <User className="w-5 h-5 text-primary-foreground" />
                ) : (
                    <Bot className="w-5 h-5 text-foreground" />
                )}
            </div>

            {/* Message Content */}
            <div
                className={cn(
                    "flex-1 max-w-[80%] rounded-2xl px-4 py-3 shadow-card transition-all duration-300",
                    isUser
                        ? "bg-message-user border border-border"
                        : "bg-message-ai border border-border"
                )}
            >
                <p className="text-foreground leading-relaxed">{message}</p>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50">
                    <span className="text-xs text-muted-foreground">
                        {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>

                    {/* Audio Control for AI messages */}
                    {!isUser && (onPlayAudio || onStopAudio) && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={isPlaying ? onStopAudio : onPlayAudio}
                            className="h-8 w-8 p-0 hover:bg-accent/50"
                        >
                            {isPlaying ? (
                                <VolumeX className="w-4 h-4" />
                            ) : (
                                <Volume2 className="w-4 h-4" />
                            )}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};