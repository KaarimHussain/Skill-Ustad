"use client"

import { useState } from "react"

export default function Profile() {
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const [response, setResponse] = useState("")

    const requestData = {
        nodeTitle: "Variables in Python",
        nodeDescription: "Learn how to use variables, data types, and assignments.",
        nodeType: "topic",
        roadmapTitle: "Python Beginner Roadmap",
        roadmapId: "roadmap123"
    }

    const sendData = async () => {
        setLoading(true)
        setResponse("")

        try {
            const OLLAMA_ENDPOINT = "http://127.0.0.1:8000/lms/ai/generate-course"

            const res = await fetch(OLLAMA_ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
            })

            const data = await res.json()
            console.log(data)
            setResponse(data || "No response received.")
        } catch (err) {
            console.error("Error:", err)
            setResponse("Something went wrong.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full flex flex-col items-center p-6 gap-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold">Profile Page</h1>

            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="px-3 py-2 border border-zinc-400 rounded-2xl w-full max-w-md"
                placeholder="How can I help you today?"
            />

            <button
                onClick={sendData}
                className="px-6 py-3 rounded bg-indigo-500 hover:bg-indigo-600 text-white font-semibold disabled:opacity-50"
                disabled={loading || !input.trim()}
            >
                {loading ? "Loading..." : "Fetch Data"}
            </button>

            {response && (
                <div className="mt-4 p-4 bg-zinc-100 rounded w-full max-w-2xl text-zinc-800">
                    <strong>Response:</strong>
                    <p>{response}</p>
                </div>
            )}
        </div>
    )
}
