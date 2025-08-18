export default function FormatDate(timestamp: any) {
    if (!timestamp) return "Recently"

    try {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        })
    } catch {
        return "Recently"
    }
}