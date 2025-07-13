import { useEffect, useState } from 'react';

interface ConversationCircleProps {
    isListening: boolean;
    isGenerating: boolean;
    isSpeaking: boolean;
}

export const ConversationCircle = ({ isListening, isGenerating, isSpeaking }: ConversationCircleProps) => {
    const [animationState, setAnimationState] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');

    useEffect(() => {
        if (isListening) {
            setAnimationState('listening');
        } else if (isGenerating) {
            setAnimationState('thinking');
        } else if (isSpeaking) {
            setAnimationState('speaking');
        } else {
            setAnimationState('idle');
        }
    }, [isListening, isGenerating, isSpeaking]);

    const getCircleClasses = () => {
        const baseClasses = "w-48 h-48 rounded-full transition-all duration-500 ease-in-out";

        switch (animationState) {
            case 'listening':
                return `${baseClasses} bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 animate-pulse scale-110 shadow-2xl shadow-blue-500/30`;
            case 'thinking':
                return `${baseClasses} bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 animate-spin-slow scale-105 shadow-2xl shadow-orange-500/30`;
            case 'speaking':
                return `${baseClasses} bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 animate-bounce scale-110 shadow-2xl shadow-green-500/30`;
            default:
                return `${baseClasses} bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 shadow-xl shadow-purple-500/20`;
        }
    };

    const getInnerCircleClasses = () => {
        const baseClasses = "absolute inset-4 rounded-full transition-all duration-300";

        switch (animationState) {
            case 'listening':
                return `${baseClasses} bg-gradient-to-br from-blue-300/80 via-purple-400/80 to-pink-400/80 animate-pulse`;
            case 'thinking':
                return `${baseClasses} bg-gradient-to-br from-amber-300/80 via-orange-400/80 to-red-400/80`;
            case 'speaking':
                return `${baseClasses} bg-gradient-to-br from-green-300/80 via-emerald-400/80 to-teal-400/80 animate-pulse`;
            default:
                return `${baseClasses} bg-gradient-to-br from-purple-300/80 via-pink-400/80 to-red-400/80`;
        }
    };

    const getStatusText = () => {
        switch (animationState) {
            case 'listening':
                return 'Listening...';
            case 'thinking':
                return 'Thinking...';
            case 'speaking':
                return 'Speaking...';
            default:
                return 'Ready to chat';
        }
    };

    return (
        <div className="flex flex-col items-center space-y-6">
            <div className="relative">
                <div className={getCircleClasses()}>
                    <div className={getInnerCircleClasses()} />

                    {/* Animated dots inside circle */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex space-x-1">
                            {[0, 1, 2].map((i) => (
                                <div
                                    key={i}
                                    className={`w-2 h-2 rounded-full bg-white/60 ${animationState !== 'idle'
                                            ? `animate-bounce`
                                            : ''
                                        }`}
                                    style={{
                                        animationDelay: `${i * 0.2}s`,
                                        animationDuration: '1s'
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Outer ring animation */}
                {animationState !== 'idle' && (
                    <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping" />
                )}
            </div>

            <div className="text-center">
                <p className="text-lg font-medium text-foreground mb-1">{getStatusText()}</p>
                <p className="text-sm text-muted-foreground">
                    {animationState === 'idle' ? 'Tap the microphone to start' : ''}
                </p>
            </div>
        </div>
    );
};