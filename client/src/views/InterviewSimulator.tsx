import { useEffect, useState } from 'react';

interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export default function VoiceInterview() {
    const userTechnology = "JavaScript";
    const userExperienceLevel = "Beginner";

    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [isListening, setIsListening] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const systemPrompt = `
        You are a technical interviewer with 15+ years of experience.
        You are interviewing a candidate skilled in ${userTechnology}, with ${userExperienceLevel} experience.

        🛑 Ask one question at a time.
        🛑 Wait for user input before continuing.
        🛑 Never simulate or answer for the user.
            `.trim();
        setChatHistory([{ role: 'system', content: systemPrompt }]);
    }, []);

    const speakWithEdgeTTS = async (text: string, lang: 'en' | 'ur' = 'en') => {
        try {
            // Python backend that returns Audio File for the provided text using an Speech Model
            const res = await fetch("http://127.0.0.1:8000/speak", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text, lang })
            });

            if (!res.ok) throw new Error("TTS failed");

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const audio = new Audio(url);
            await audio.play();
        } catch (err) {
            console.error("TTS playback failed:", err);
        }
    };

    const handleSend = async (userText: string) => {
        const updatedChat: any = [...chatHistory, { role: 'user', content: userText }];
        setChatHistory(updatedChat);
        setIsLoading(true);

        try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${import.meta.env.VITE_OPEN_ROUTER_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "mistralai/mixtral-8x7b-instruct",
                    messages: updatedChat
                })
            });

            const data = await response.json();
            const aiMessage = data.choices?.[0]?.message?.content || "AI didn't respond.";
            const finalChat: any = [...updatedChat, { role: 'assistant', content: aiMessage }];
            setChatHistory(finalChat);
            speakWithEdgeTTS(aiMessage, 'en');
        } catch (err) {
            console.error("Error:", err);
        }

        setIsLoading(false);
    };

    const handleVoiceInput = () => {
        const recognition = new ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)();
        recognition.lang = 'en-US';
        recognition.interimResults = true;
        let finalTranscript = '';
        let silenceTimer: NodeJS.Timeout;

        recognition.onstart = () => setIsListening(true);
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

        const resetSilenceTimer = () => {
            if (silenceTimer) clearTimeout(silenceTimer);
            silenceTimer = setTimeout(() => {
                recognition.stop();
                setIsListening(false);
                handleSend(finalTranscript.trim());
                finalTranscript = '';
            }, 3000); // 2 seconds of silence
        };

        recognition.onresult = (event: any) => {
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript + ' ';
                } else {
                    interimTranscript += transcript;
                }
            }
            resetSilenceTimer();
        };

        recognition.start();
        resetSilenceTimer();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-indigo-200 flex flex-col items-center justify-center p-6">
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-radial from-indigo-50 via-indigo-100 to-white opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 via-transparent to-indigo-100/20" />
            </div>
            <div className="relative w-36 h-36">
                <button
                    onClick={handleVoiceInput}
                    className={`w-36 h-36 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg flex items-center justify-center text-white text-4xl transition-all duration-200 ease-in-out ${isListening ? 'animate-ping' : ''}`}
                >
                    🎤
                </button>
                {isLoading && <div className="absolute -bottom-6 text-sm text-gray-600">AI is thinking...</div>}
            </div>

            {/* Hidden Chat History (for review later) */}
            <div className="hidden">
                {chatHistory
                    .filter(msg => msg.role !== 'system')
                    .map((msg, i) => (
                        <p key={i}><strong>{msg.role}:</strong> {msg.content}</p>
                    ))}
            </div>
        </div>
    );
}