export const roadmapTemplates: Record<string, any> = {
    "web development": {
        nodes: [
            {
                id: "1",
                type: "topic",
                data: { label: "HTML Basics", description: "" },
                position: { x: 100, y: 100 },
            },
            {
                id: "2",
                type: "topic",
                data: { label: "CSS Fundamentals", description: "" },
                position: { x: 300, y: 100 },
            },
            {
                id: "3",
                type: "project",
                data: { label: "Build a portfolio", description: "" },
                position: { x: 500, y: 100 },
            },
        ],
        edges: [
            { id: "e1-2", source: "1", target: "2" },
            { id: "e2-3", source: "2", target: "3" },
        ],
    },

    "data science": {
        nodes: [
            {
                id: "1",
                type: "topic",
                data: { label: "Learn Python", description: "" },
                position: { x: 100, y: 100 },
            },
            {
                id: "2",
                type: "topic",
                data: { label: "NumPy & Pandas", description: "" },
                position: { x: 300, y: 100 },
            },
        ],
        edges: [
            { id: "e1-2", source: "1", target: "2" },
        ],
    },
};