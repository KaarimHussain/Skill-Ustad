import { useEffect, useState } from 'react';

interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export default function InterviewSimulator() {
    const userTechnology = "ASP .NET Core";
    const userExperienceLevel = "Intermediate";

    const [customQuestions, setCustomQuestions] = useState<string>('');
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [voiceEnabled, setVoiceEnabled] = useState(true);

    // Load local .txt file on mount
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch("/Interview-Questions.txt");
                const text = await response.text();
                setCustomQuestions(text);
            } catch (err) {
                console.error("Failed to load custom questions file", err);
            }
        };

        fetchQuestions();
    }, []);

    // Initialize system prompt after loading questions
    useEffect(() => {
        if (!customQuestions || chatHistory.length > 0) return;

        setChatHistory([
            {
                role: "system",
                content: `
You are a technical interviewer with 15+ years of experience.
You are interviewing a candidate skilled in ${userTechnology}, with ${userExperienceLevel} experience.

🛑 Ask one question at a time.
🛑 Wait for user input before continuing.
🛑 Never simulate or answer for the user.

Here is the list of recruiter-provided questions:
${customQuestions}
        `.trim()
            }
        ]);
    }, [customQuestions]);

    const speakWithMurf = async (text: string) => {
        try {
            const res = await fetch("http://localhost:5018/api/interview/murf/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(text)
            });

            if (!res.ok) {
                throw new Error("TTS failed");
            }

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            console.log("Murf URL:", url)
            const audio = new Audio(url);
            await audio.play();
            audio.onended = () => console.log("TTS ended");
        } catch (error) {
            console.error("Murf voice playback failed:", error);
        }
    };

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const updatedChat: ChatMessage[] = [...chatHistory, { role: "user", content: inputValue }];
        setChatHistory(updatedChat);
        setInputValue('');
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
            setChatHistory([...updatedChat, { role: "assistant", content: aiMessage }]);

            if (voiceEnabled) {
                speakWithMurf(aiMessage); // 🔊 Play AI voice using your backend
            }
        } catch (err) {
            console.error("Error:", err);
            setChatHistory([...updatedChat, { role: "assistant", content: "Something went wrong." }]);
        }

        setIsLoading(false);
    };

    return (
        <div className="w-full h-screen flex flex-col items-center justify-center px-4 py-8 text-center bg-gray-50">
            <h1 className="text-2xl font-semibold mb-4">💬 Interview Simulator</h1>

            <div className="w-full max-w-2xl h-[70vh] overflow-y-auto bg-white border border-gray-300 rounded-md p-4 text-left space-y-3">
                {chatHistory
                    .filter((msg) => msg.role !== "system")
                    .map((msg, idx) => (
                        <div key={idx} className={`p-2 rounded ${msg.role === "user" ? "bg-indigo-50 text-right ml-auto" : "bg-gray-100 text-left mr-auto"}`}>
                            <span className="block text-sm whitespace-pre-wrap">{msg.content}</span>
                        </div>
                    ))}
                {isLoading && <div className="text-sm text-gray-500 italic">AI is thinking...</div>}
            </div>

            <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className="text-sm text-indigo-500 underline mt-2"
            >
                {voiceEnabled ? "🔇 Disable Voice" : "🔊 Enable Voice"}
            </button>

            <div className="w-full max-w-2xl flex mt-4 gap-2">
                <textarea
                    rows={2}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your answer..."
                    className="flex-grow p-3 border border-gray-300 rounded-md resize-none text-sm"
                />
                <button
                    onClick={handleSend}
                    disabled={isLoading}
                    className="px-5 py-3 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition text-sm"
                >
                    Send
                </button>
            </div>
        </div>
    );
}
