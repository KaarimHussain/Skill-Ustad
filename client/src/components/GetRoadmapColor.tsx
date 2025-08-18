import { Code, BarChart3, TrendingUp, Palette, Brain, Target, DollarSign } from "lucide-react"

// Get roadmap category icon
export default function GetRoadmapIcon(title: string) {
    const titleLower = title.toLowerCase()
    if (titleLower.includes("web") || titleLower.includes("frontend") || titleLower.includes("backend")) return Code
    if (titleLower.includes("design") || titleLower.includes("ui") || titleLower.includes("ux")) return Palette
    if (titleLower.includes("data") || titleLower.includes("analytics")) return BarChart3
    if (titleLower.includes("ai") || titleLower.includes("machine") || titleLower.includes("ml")) return Brain
    if (titleLower.includes("marketing") || titleLower.includes("seo")) return TrendingUp
    if (titleLower.includes("business") || titleLower.includes("freelance")) return DollarSign
    return Target
}