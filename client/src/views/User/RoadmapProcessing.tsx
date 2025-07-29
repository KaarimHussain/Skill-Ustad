import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { roadmapTemplates } from "@/data/roadmapTemplates";

export default function RoadmapProcessing() {
    const location = useLocation();
    const navigate = useNavigate();
    const prompt = location.state?.prompt?.toLowerCase() || "";
    const [error, setError] = useState<string | null>(null);
    const [hasGenerated, setHasGenerated] = useState(false);

    useEffect(() => {
        if (!prompt || hasGenerated) return;

        setHasGenerated(true); // ✅ prevents duplicate calls

        const generateAndSaveRoadmap = async () => {
            try {
                const matchingKey = Object.keys(roadmapTemplates).find((key) =>
                    prompt.includes(key)
                );

                let nodes: any[] = [];
                let edges: any[] = [];

                if (matchingKey) {
                    // Static template match ✅
                    const template = roadmapTemplates[matchingKey];
                    nodes = template.nodes;
                    edges = template.edges;
                } else {
                    // 🧠 No match? Use Gemini fallback
                    const res = await fetch(`${import.meta.env.VITE_PYTHON_SERVER_URL}/gen-ai/api/generate-roadmap`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ prompt }),
                    });

                    const aiData = await res.json();
                    nodes = aiData.nodes;
                    edges = aiData.edges;
                }

                // ✨ Fill node descriptions
                const filledNodes = await Promise.all(
                    nodes.map(async (node) => {
                        try {
                            const res = await fetch(`${import.meta.env.VITE_PYTHON_SERVER_URL}/gen-ai/api/description`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ label: node.data.label, context: prompt }),
                            });
                            const data = await res.json();
                            return {
                                ...node,
                                data: {
                                    ...node.data,
                                    description: data.description || "",
                                },
                            };
                        } catch {
                            return node;
                        }
                    })
                );

                const roadmap = {
                    title: prompt,
                    nodes: filledNodes,
                    edges,
                    createdAt: serverTimestamp(),
                };

                const docRef = await addDoc(collection(db, "roadmaps"), roadmap);
                navigate(`/user/roadmap/${docRef.id}`);
            } catch (err: any) {
                console.error("Roadmap gen error:", err);
                setError("Something went wrong while generating your roadmap.");
            }
        };

        generateAndSaveRoadmap();
    }, [prompt, hasGenerated]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            {error ? (
                <div className="text-red-500 text-lg font-semibold">{error}</div>
            ) : (
                <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border-4 border-indigo-300 border-t-indigo-600 rounded-full animate-spin"></div>
                    <span className="text-lg text-gray-700 font-medium">
                        Generating your roadmap...
                    </span>
                </div>
            )}
        </div>
    );
}
