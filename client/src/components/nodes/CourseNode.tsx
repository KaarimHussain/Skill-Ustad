// components/nodes/CourseNode.tsx
export default function CourseNode({ data }: any) {
    return (
        <div className="bg-blue-100 border border-blue-500 rounded px-4 py-2 shadow">
            <strong>📘 {data.label}</strong>
            <p className="text-xs text-gray-600">{data.description}</p>
        </div>
    );
}