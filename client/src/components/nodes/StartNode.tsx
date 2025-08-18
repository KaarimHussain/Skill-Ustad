// components/nodes/StartNode.tsx
export default function StartNode({ data }: any) {
    return (
        <div className="bg-green-100 border border-green-500 rounded px-4 py-2 shadow">
            <strong>🚀 {data.label}</strong>
            <p className="text-xs text-gray-600">{data.description}</p>
        </div>
    );
}