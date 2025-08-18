// Type definition for the parsed response
interface ChatbotPrompt {
    use_case: string;
    description: string;
    prompts: string[];
}

class GeminiService {
    private static readonly GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY
    private static MODEL = "gemini-1.5-flash"
    private static readonly BASE_URL =
        `https://generativelanguage.googleapis.com/v1beta/models/${this.MODEL}:generateContent?key=${this.GEMINI_KEY}`

    private static readonly BRAIN_URL = import.meta.env.VITE_PYTHON_SERVER_URL

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

    public static async GeminiGenerateExamples() {
        console.log(this.BRAIN_URL);

        try {
            const response = await fetch(this.BRAIN_URL + "/ai/generate-example", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data = await response.json()
            console.log("Received data:", data)

            if (data && data.example_response) {
                return data.example_response
            } else {
                console.error("No example response found", data)
                return "⚠️ No response from Gemini."
            }
        } catch (error: any) {
            console.error("Gemini API error:", error)
            return "❌ Error while contacting Gemini API. :" + error.message
        }
    }

    public static parseExampleResponse(text: string): ChatbotPrompt[] {
        try {
            // Clean the response by removing markdown code fences and extra whitespace
            const cleanedText = text
                .replace(/```json\n|\n```/g, '') // Remove ```json and ```
                .replace(/^\s+|\s+$/g, '') // Trim whitespace
                .replace(/\n\s+/g, '') // Remove indentation

            // Parse the cleaned text into JSON
            const parsedData = JSON.parse(cleanedText)

            // Validate the structure of the parsed data
            if (Array.isArray(parsedData)) {
                return parsedData.map((item: any) => ({
                    use_case: item.use_case || '',
                    description: item.description || '',
                    prompts: Array.isArray(item.prompts) ? item.prompts : []
                })) as ChatbotPrompt[]
            } else if (parsedData.chatbot_prompt_lists && Array.isArray(parsedData.chatbot_prompt_lists)) {
                return parsedData.chatbot_prompt_lists.map((item: any) => ({
                    use_case: item.use_case || '',
                    description: item.description || '',
                    prompts: Array.isArray(item.prompts) ? item.prompts : []
                })) as ChatbotPrompt[]
            } else {
                throw new Error("Invalid response format")
            }
        } catch (error) {
            console.error("Error parsing example response:", error)
            return []
        }
    }
}

export default GeminiService