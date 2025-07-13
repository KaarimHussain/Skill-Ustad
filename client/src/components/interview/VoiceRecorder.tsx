import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Square } from 'lucide-react';
import { cn } from '@/lib/utils';

// Speech Recognition types
declare global {
    interface Window {
        webkitSpeechRecognition: any;
        SpeechRecognition: any;
    }
}

interface VoiceRecorderProps {
    onTranscript: (text: string) => void;
    isListening: boolean;
    onToggleListening: () => void;
    disabled?: boolean;
}

export const VoiceRecorder = ({
    onTranscript,
    isListening,
    onToggleListening,
    disabled = false
}: VoiceRecorderProps) => {
    const [audioLevel, setAudioLevel] = useState(0);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animationRef = useRef<number>(0);

    const startListening = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // Set up audio analysis for visual feedback
            audioContextRef.current = new AudioContext();
            analyserRef.current = audioContextRef.current.createAnalyser();
            const source = audioContextRef.current.createMediaStreamSource(stream);
            source.connect(analyserRef.current);

            analyserRef.current.fftSize = 256;
            const bufferLength = analyserRef.current.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            const updateAudioLevel = () => {
                if (analyserRef.current && isListening) {
                    analyserRef.current.getByteFrequencyData(dataArray);
                    const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
                    setAudioLevel(Math.min(average / 128, 1));
                    animationRef.current = requestAnimationFrame(updateAudioLevel);
                }
            };

            updateAudioLevel();

            // Set up speech recognition
            if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
                const recognition = new SpeechRecognition();

                recognition.continuous = true;
                recognition.interimResults = true;
                recognition.lang = 'en-US';

                recognition.onresult = (event: any) => {
                    let finalTranscript = '';
                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        if (event.results[i].isFinal) {
                            finalTranscript += event.results[i][0].transcript;
                        }
                    }

                    if (finalTranscript) {
                        onTranscript(finalTranscript.trim());
                    }
                };

                recognition.onerror = (event: any) => {
                    console.error('Speech recognition error:', event.error);
                };

                recognition.start();

                // Store reference for cleanup
                mediaRecorderRef.current = { stop: () => recognition.stop() } as any;
            }

        } catch (error) {
            console.error('Error accessing microphone:', error);
        }
    };

    const stopListening = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }

        if (audioContextRef.current) {
            audioContextRef.current.close();
        }

        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }

        setAudioLevel(0);
    };

    useEffect(() => {
        if (isListening) {
            startListening();
        } else {
            stopListening();
        }

        return () => {
            stopListening();
        };
    }, [isListening]);

    const waveElements = Array.from({ length: 5 }, (_, i) => (
        <div
            key={i}
            className={cn(
                "w-1 bg-gradient-primary rounded-full transition-all duration-100",
                isListening ? "animate-voice-wave" : "h-2"
            )}
            style={{
                height: isListening ? `${Math.max(8, audioLevel * 40 + Math.random() * 20)}px` : '8px',
                animationDelay: `${i * 0.1}s`,
            }}
        />
    ));

    return (
        <div className="flex flex-col items-center space-y-6">
            {/* Voice Wave Visualization */}
            <div className="flex items-center justify-center space-x-1 h-12">
                {waveElements}
            </div>

            {/* Recording Button */}
            <Button
                onClick={onToggleListening}
                disabled={disabled}
                size="lg"
                className={cn(
                    "relative w-20 h-20 rounded-full transition-all duration-300",
                    isListening
                        ? "bg-gradient-primary shadow-glow animate-pulse-glow"
                        : "bg-secondary hover:bg-accent"
                )}
            >
                {isListening ? (
                    <Square className="w-8 h-8" />
                ) : (
                    <Mic className="w-8 h-8" />
                )}

                {/* Glow effect when listening */}
                {isListening && (
                    <div className="absolute inset-0 rounded-full bg-gradient-glow opacity-50 animate-pulse-glow" />
                )}
            </Button>

            <p className="text-sm text-muted-foreground">
                {isListening ? "Listening... Tap to stop" : "Tap to speak"}
            </p>
        </div>
    );
};