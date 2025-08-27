import NotificationService from "@/components/Notification"
import type { CourseSection } from "@/services/lesson.service"
import LessonService from "@/services/lesson.service"
import { AlertTriangle, BookOpen, Lightbulb, LinkIcon, Play, Trophy } from "lucide-react"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

export default function ViewCourse() {
    const location = useLocation();
    const { id } = location.state as { id: string };
    const navigate = useNavigate();
    const [courseTitle, setCourseTitle] = useState("")
    const [courseDescription, setCourseDescription] = useState("")
    const [sections, setSections] = useState<CourseSection[]>([])

    const fetchData = async () => {
        console.log("ID: ",id);

        if (!id) return navigate("/");
        try {
            const data = await LessonService.getCourseItsID(id);
            console.log("Data: ", data);
            if (data == null) return navigate("/");
            setCourseTitle(data.title);
            setCourseDescription(data.description);
            setSections(data.sections);

        } catch (error) {
            NotificationService.error("Failed to fetch the Course Data");
        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    const renderSectionPreview = (section: CourseSection) => {
        return (
            <div key={section.id} className="mb-12 max-w-4xl mx-auto">
                {section.title && (
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-tight">
                        {section.title}
                    </h3>
                )}

                {section.type === "text" && (
                    <div className="prose prose-lg max-w-none">
                        <div className="text-gray-700 leading-relaxed text-base md:text-lg whitespace-pre-wrap font-normal tracking-wide">
                            {section.content || <span className="text-gray-500 italic">No content added yet</span>}
                        </div>
                    </div>
                )}

                {section.type === "code" && section.content && (
                    <div className="relative group w-full">
                        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl border border-gray-700 shadow-2xl overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 bg-gray-800/50 border-b border-gray-700">
                                <div className="flex items-center gap-3">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    </div>
                                    <span className="text-gray-300 text-sm font-medium capitalize">{section.language || "code"}</span>
                                </div>
                                <button
                                    onClick={() => navigator.clipboard.writeText(section.content)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-400 hover:text-white text-xs px-2 py-1 rounded bg-gray-700 hover:bg-gray-600"
                                >
                                    Copy
                                </button>
                            </div>

                            <div className="p-4 overflow-x-auto">
                                <pre className="text-sm md:text-base leading-relaxed">
                                    <code className="text-gray-100 font-mono whitespace-pre-wrap break-words">{section.content}</code>
                                </pre>
                            </div>

                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>
                        </div>
                    </div>
                )}

                {section.type === "video" && section.content && (
                    <div className="w-full">
                        <div className="aspect-video bg-gray-100 rounded-xl shadow-lg overflow-hidden">
                            {section.content.includes("youtube.com") || section.content.includes("youtu.be") ? (
                                <iframe
                                    src={section.content.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")}
                                    className="w-full h-full"
                                    allowFullScreen
                                />
                            ) : section.content.startsWith("blob:") ? (
                                <video src={section.content} controls className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-center p-8">
                                    <div>
                                        <Play className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
                                        <p className="text-gray-600 text-lg font-medium">Video: {section.content}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {section.type === "link" && section.content && (
                    <div className="border border-indigo-200 rounded-xl p-6 bg-gradient-to-r from-indigo-50 to-blue-50 shadow-sm">
                        <div className="flex items-start gap-3">
                            <LinkIcon className="w-6 h-6 text-indigo-600 mt-1 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                {section.content.includes("|") ? (
                                    <div>
                                        <a
                                            href={section.content.split("|")[0].trim()}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-indigo-600 hover:text-indigo-800 font-semibold text-lg md:text-xl block mb-2 break-words"
                                        >
                                            {section.content.split("|")[1]?.trim() || section.content.split("|")[0].trim()}
                                        </a>
                                        <p className="text-gray-600 text-sm md:text-base break-all">{section.content.split("|")[0].trim()}</p>
                                    </div>
                                ) : (
                                    <a
                                        href={section.content}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-indigo-600 hover:text-indigo-800 font-semibold text-lg md:text-xl break-words"
                                    >
                                        {section.content}
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {section.type === "image" && section.content && (
                    <div className="w-full">
                        <div className="rounded-xl overflow-hidden shadow-lg bg-white">
                            <img
                                src={section.content || "/placeholder.svg"}
                                alt={section.title || "Course image"}
                                className="w-full h-auto object-cover"
                            />
                        </div>
                    </div>
                )}

                {section.type === "reading" && section.content && (
                    <div className="border border-emerald-200 rounded-xl p-6 md:p-8 bg-gradient-to-r from-emerald-50 to-green-50 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-emerald-100 rounded-lg">
                                <BookOpen className="w-6 h-6 text-emerald-600" />
                            </div>
                            <span className="font-bold text-emerald-800 text-lg md:text-xl">Required Reading</span>
                        </div>
                        <div className="text-gray-700 leading-relaxed text-base md:text-lg whitespace-pre-wrap font-normal tracking-wide">
                            {section.content}
                        </div>
                    </div>
                )}

                {section.type === "achievement" && section.content && (
                    <div className="border border-yellow-200 rounded-xl p-6 md:p-8 bg-gradient-to-r from-yellow-50 via-orange-50 to-amber-50 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <Trophy className="w-6 h-6 text-yellow-600" />
                            </div>
                            <span className="font-bold text-yellow-800 text-lg md:text-xl">Achievement Unlock</span>
                        </div>
                        <div className="text-gray-700 leading-relaxed text-base md:text-lg whitespace-pre-wrap font-normal tracking-wide mb-6">
                            {section.content}
                        </div>
                        <div className="pt-6 border-t border-yellow-200">
                            <div className="flex items-center gap-2 text-yellow-700">
                                <span className="text-2xl">🏆</span>
                                <p className="font-medium text-base md:text-lg">Complete this section to earn your achievement!</p>
                            </div>
                        </div>
                    </div>
                )}

                {section.type === "note" && section.content && (
                    <div className="border border-amber-200 rounded-xl p-6 md:p-8 bg-gradient-to-r from-amber-50 to-yellow-50 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-amber-100 rounded-lg">
                                <AlertTriangle className="w-6 h-6 text-amber-600" />
                            </div>
                            <span className="font-bold text-amber-800 text-lg md:text-xl">Important Note</span>
                        </div>
                        <div className="text-gray-700 leading-relaxed text-base md:text-lg whitespace-pre-wrap font-normal tracking-wide">
                            {section.content}
                        </div>
                    </div>
                )}

                {section.type === "tip" && section.content && (
                    <div className="border border-cyan-200 rounded-xl p-6 md:p-8 bg-gradient-to-r from-cyan-50 to-blue-50 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-cyan-100 rounded-lg">
                                <Lightbulb className="w-6 h-6 text-cyan-600" />
                            </div>
                            <span className="font-bold text-cyan-800 text-lg md:text-xl">Pro Tip</span>
                        </div>
                        <div className="text-gray-700 leading-relaxed text-base md:text-lg whitespace-pre-wrap font-normal tracking-wide">
                            {section.content}
                        </div>
                    </div>
                )}
            </div>
        )
    }

    return (
        <>
            <div className="min-h-screen bg-white">
                <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-700/40 via-indigo-900/10 to-indigo-500/10"></div>
                    <div className="absolute inset-0">
                        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-900/40 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
                    </div>
                    <div className="relative px-4 sm:px-6 lg:px-8 pt-30 pb-20">
                        <div className="max-w-4xl mx-auto text-center">
                            <h1 className={"text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-6"}>
                                {courseTitle || "Course Title"}
                            </h1>
                            <p className="text-lg sm:text-xl text-black/90 max-w-2xl mx-auto mb-8">
                                {courseDescription || "Course description goes here"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex gap-8">
                        <div className="flex-1">
                            {sections.map((section) => (
                                <div key={section.id} id={`section-${section.id}`}>
                                    {renderSectionPreview(section)}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}