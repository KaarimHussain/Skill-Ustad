import { Announcement, AnnouncementTag, AnnouncementTitle } from "@/components/ui/kibo-ui/announcement";
import { ArrowRight, ArrowUpRightIcon, Bot, Briefcase, Code } from "lucide-react";
import { memo } from "react";
import { Link } from "react-router-dom";

function ToolsView() {
    const tools = [
        {
            title: "Static Website Builder",
            description: "Create stunning websites in minutes. No coding required.",
            icon: Code,
            gradient: "from-blue-100 to-indigo-200",
            accentColor: "text-blue-600",
            bgGradient: "from-blue-50 to-indigo-100",
            category: "Development",
            isPopular: true,
            size: "medium",
            link: "/ai/web-builder",
        },
        {
            title: "Custom Chatbot Builder",
            description: "Build intelligent chatbots that understand your business.",
            icon: Bot,
            gradient: "from-purple-100 to-indigo-200",
            accentColor: "text-purple-600",
            bgGradient: "from-purple-50 to-indigo-100",
            category: "AI Assistant",
            isPopular: false,
            size: "medium",
            link: "/ai/chatbot",
        },
        {
            title: "Interview Simulator",
            description: "Practice real-time mock interviews with AI tailored to your field.",
            icon: Briefcase, // make sure to import this or use your own
            gradient: "from-emerald-100 to-teal-200",
            accentColor: "text-emerald-600",
            bgGradient: "from-emerald-50 to-teal-100",
            category: "Career",
            isPopular: true,
            size: "medium",
            link: "/ai/interview",
        },
    ];

    return (
        <>
            <div className="min-h-screen w-full pt-32 pb-20 bg-conic-180 from-indigo-200 via-indigo-50 to-indigo-200 px-5 flex justify-center items-center">
                <div className="flex flex-col gap-2 items-center">
                    <Announcement className="cursor-pointer">
                        <AnnouncementTag>Latest update</AnnouncementTag>
                        <AnnouncementTitle>
                            New feature added
                            <ArrowUpRightIcon className="shrink-0 text-muted-foreground" size={16} />
                        </AnnouncementTitle>
                    </Announcement>
                    <h1 className="text-7xl font-bold text-black text-center">
                        Build Smarter, Learn Faster <br /> Your Free {" "}
                        <span className="bg-indigo-400 hover:bg-indigo-500 cursor-pointer transition-all px-4 rounded-2xl text-6xl text-white">AI</span>
                        {" "}
                        Toolkit
                    </h1>
                    <p className="text-black/90 text-center">
                        Skill-Ustad's AI Tools Hub gives you instant access to free,<br /> no-code tools that help you build with the power of AI.
                    </p>
                    {/* Bento Grid Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-20 mb-10">
                        {tools.map((tool, index) => {
                            const IconComponent = tool.icon
                            const gridSpan =
                                tool.size === "large" ? "lg:col-span-2" : tool.size === "medium" ? "lg:col-span-1" : "lg:col-span-1"
                            const heightClass =
                                tool.size === "large" ? "lg:row-span-2" : tool.size === "small" ? "lg:row-span-1" : "lg:row-span-1"

                            return (
                                <Link to={tool.link} className="no-underline" key={index}>
                                    <div
                                        key={index}
                                        className={`group relative overflow-hidden rounded-3xl bg-white/95 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 cursor-pointer ${gridSpan} ${heightClass} p-8 flex flex-col justify-between min-h-[280px]`}
                                    >
                                        {/* Card Background Pattern */}
                                        <div className="absolute inset-0 opacity-30">
                                            <div
                                                className="absolute inset-0"
                                                style={{
                                                    backgroundImage: `
                          radial-gradient(circle at 20px 20px, rgba(99, 102, 241, 0.1) 1px, transparent 1px),
                          radial-gradient(circle at 80px 80px, rgba(139, 92, 246, 0.08) 1px, transparent 1px)
                        `,
                                                    backgroundSize: "100px 100px, 160px 160px",
                                                }}
                                            />
                                        </div>

                                        {/* Subtle Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-gray-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        {/* Background Gradient */}
                                        <div
                                            className={`absolute inset-0 bg-gradient-to-br ${tool.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                                        />

                                        {/* Decorative Corner Elements */}
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-gray-100/20 to-transparent rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-gray-100/15 to-transparent rounded-full translate-y-12 -translate-x-12 group-hover:scale-110 transition-transform duration-700" />

                                        {/* Content */}
                                        <div className="relative z-10 flex flex-col h-full">
                                            {/* Header */}
                                            <div className="flex items-start justify-between mb-6">
                                                <div
                                                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg relative overflow-hidden`}
                                                >
                                                    {/* Icon Background Pattern */}
                                                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                                                    <IconComponent className={`w-7 h-7 ${tool.accentColor} relative z-10`} />
                                                </div>

                                                {/* Badges */}
                                                <div className="flex flex-col gap-2 items-end">
                                                    {tool.isPopular && (
                                                        <div className="px-3 py-1 bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-800 rounded-full text-xs font-medium border border-yellow-200 shadow-sm">
                                                            Popular
                                                        </div>
                                                    )}
                                                    <div className="px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-600 rounded-full text-xs font-medium border border-gray-200 shadow-sm">
                                                        {tool.category}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Title and Description */}
                                            <div className="flex-1 mb-6">
                                                <h3
                                                    className={`text-xl lg:text-2xl font-bold text-gray-900 mb-3 group-hover:${tool.accentColor} transition-colors`}
                                                >
                                                    {tool.title}
                                                </h3>
                                                <p className="text-gray-600 leading-relaxed text-sm lg:text-base">{tool.description}</p>
                                            </div>

                                            {/* Action */}
                                            <div className="flex items-center justify-between">
                                                <button
                                                    className={`inline-flex items-center gap-2 ${tool.accentColor} font-medium text-sm group-hover:gap-3 transition-all duration-300`}
                                                >
                                                    <span>Launch Tool</span>
                                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </button>

                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center group-hover:from-gray-200 group-hover:to-gray-100 transition-all duration-300 shadow-sm">
                                                    <ArrowUpRightIcon className="w-4 h-4 text-gray-600" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Large Card Decorative Element */}
                                        {tool.size === "large" && (
                                            <div className="absolute top-8 right-8 w-24 h-24 rounded-full bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        )}
                                    </div>
                                </Link>
                            )
                        })}


                    </div>
                </div>
            </div>
        </>
    );
}

export default memo(ToolsView);