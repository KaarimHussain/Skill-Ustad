import { useState, useCallback } from 'react';

interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

interface UseOpenRouterProps {
    apiKey: string;
    model?: string;
}

export const useOpenRouter = ({ apiKey, model = "mistralai/mixtral-8x7b-instruct" }: UseOpenRouterProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateResponse = useCallback(async (messages: Message[]): Promise<string> => {
        if (!apiKey) {
            throw new Error('OpenRouter API key is required');
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model,
                    messages,
                    temperature: 0.7,
                    max_tokens: 1000
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            if (!data.choices || !data.choices[0] || !data.choices[0].message) {
                throw new Error('Invalid response format from OpenRouter API');
            }

            return data.choices[0].message.content;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [apiKey, model]);

    return {
        generateResponse,
        isLoading,
        error
    };
};