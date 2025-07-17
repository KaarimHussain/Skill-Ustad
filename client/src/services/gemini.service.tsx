class GeminiService {
    private static readonly GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY
    private static MODEL = "gemini-1.5-flash"
    private static readonly BASE_URL =
        `https://generativelanguage.googleapis.com/v1beta/models/${this.MODEL}:generateContent?key=${this.GEMINI_KEY}`

    public static async GeminiGenerateText(
        chatMessages: { role: string; parts: { text: string }[] }[],
        systemInstruction: string,
    ): Promise<string> {
        try {
            const response = await fetch(GeminiService.BASE_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: chatMessages,
                    systemInstruction: {
                        parts: [{ text: systemInstruction }],
                    },
                }),
            })

            const data = await response.json()

            if (data && data.candidates && data.candidates.length > 0) {
                const text = data.candidates[0].content.parts[0].text
                return text
            } else {
                console.error("No candidates found", data)
                return "⚠️ No response from Gemini."
            }
        } catch (error) {
            console.error("Gemini API error:", error)
            return "❌ Error while contacting Gemini API."
        }
    }
}

export default GeminiService
