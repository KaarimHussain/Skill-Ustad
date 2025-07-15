import { useState, useCallback, useRef } from 'react';

interface UseElevenLabsProps {
    apiKey: string;
    voiceId?: string;
    model?: string;
}

export const useElevenLabs = ({
    apiKey,
    voiceId = "TX3LPaxmHKxFdv7VOQHJ", // Liam voice (male, calming)
    model = "eleven_multilingual_v2"
}: UseElevenLabsProps) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const chunkText = (text: string, maxLength: number = 200): string[] => {
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const chunks: string[] = [];
        let currentChunk = '';

        for (const sentence of sentences) {
            const trimmedSentence = sentence.trim();
            if (currentChunk.length + trimmedSentence.length + 1 <= maxLength) {
                currentChunk += (currentChunk ? '. ' : '') + trimmedSentence;
            } else {
                if (currentChunk) {
                    chunks.push(currentChunk + '.');
                }
                currentChunk = trimmedSentence;
            }
        }

        if (currentChunk) {
            chunks.push(currentChunk + '.');
        }

        return chunks.length > 0 ? chunks : [text];
    };

    const synthesizeChunk = async (chunk: string): Promise<HTMLAudioElement> => {
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
            method: 'POST',
            headers: {
                'Accept': 'audio/mpeg',
                'Content-Type': 'application/json',
                'xi-api-key': apiKey
            },
            body: JSON.stringify({
                text: chunk,
                model_id: model,
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75,
                    style: 0.0,
                    use_speaker_boost: true
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail?.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        return new Audio(audioUrl);
    };

    const synthesizeAndPlay = useCallback(async (text: string): Promise<void> => {
        if (!apiKey) {
            throw new Error('ElevenLabs API key is required');
        }

        if (!text.trim()) {
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Stop any currently playing audio
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }

            const chunks = chunkText(text);
            let isFirstChunk = true;

            for (const chunk of chunks) {
                // Check if we should stop (user might have stopped playback)
                if (!audioRef.current && !isFirstChunk) break;

                const audio = await synthesizeChunk(chunk);
                audioRef.current = audio;

                // Set up event handlers
                audio.onplay = () => {
                    if (isFirstChunk) {
                        setIsPlaying(true);
                        setIsLoading(false);
                    }
                };

                audio.onerror = () => {
                    setIsPlaying(false);
                    setError('Failed to play audio');
                    URL.revokeObjectURL(audio.src);
                };

                // Play the chunk and wait for it to finish
                await new Promise<void>((resolve, reject) => {
                    audio.onended = () => {
                        URL.revokeObjectURL(audio.src);
                        resolve();
                    };
                    audio.onerror = () => {
                        URL.revokeObjectURL(audio.src);
                        reject(new Error('Audio playback failed'));
                    };
                    audio.play().catch(reject);
                });

                isFirstChunk = false;
            }

            setIsPlaying(false);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
            setError(errorMessage);
            setIsPlaying(false);
            throw new Error(errorMessage);
        } finally {
            if (isLoading) setIsLoading(false);
        }
    }, [apiKey, voiceId, model]);

    const stopAudio = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
            setIsPlaying(false);
        }
    }, []);

    return {
        synthesizeAndPlay,
        stopAudio,
        isPlaying,
        isLoading,
        error
    };
};