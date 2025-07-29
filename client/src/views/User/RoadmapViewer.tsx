import { useParams } from "react-router-dom";

export default function RoadmapViewer() {
    const { id } = useParams();

    return (
        <div className="min-h-screen p-10 flex items-center justify-center">
            <h1 className="text-2xl font-bold text-center">Roadmap ID: {id}</h1>
            {/* You'll load from Firebase and render in React Flow later */}
        </div>
    );
}
