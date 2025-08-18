// Get roadmap color scheme
export default function getRoadmapColorScheme(index: number) {
    const schemes = [
        {
            color: "from-blue-500/20 to-cyan-500/20",
            iconColor: "text-blue-600",
            borderColor: "hover:border-blue-500/50",
            bgColor: "bg-blue-50",
        },
        {
            color: "from-purple-500/20 to-pink-500/20",
            iconColor: "text-purple-600",
            borderColor: "hover:border-purple-500/50",
            bgColor: "bg-purple-50",
        },
        {
            color: "from-green-500/20 to-emerald-500/20",
            iconColor: "text-green-600",
            borderColor: "hover:border-green-500/50",
            bgColor: "bg-green-50",
        },
        {
            color: "from-orange-500/20 to-red-500/20",
            iconColor: "text-orange-600",
            borderColor: "hover:border-orange-500/50",
            bgColor: "bg-orange-50",
        },
        {
            color: "from-yellow-500/20 to-amber-500/20",
            iconColor: "text-yellow-600",
            borderColor: "hover:border-yellow-500/50",
            bgColor: "bg-yellow-50",
        },
    ]
    return schemes[index % schemes.length]
}