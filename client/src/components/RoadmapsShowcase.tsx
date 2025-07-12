"use client"
import {
    Code,
    Palette,
    TrendingUp,
    Brain,
    BarChart3,
    ArrowRight,
    Clock,
    Users,
    Star,
    Bot,
    User,
    CheckCircle,
    Play,
    BookOpen,
    Target,
    Zap,
    Award,
    MapPin,
    Route,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { memo } from "react"

// Background elements matching hero theme
const RoadmapBackground = memo(() => (
    <>
        {/* Gradient background matching hero */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-100 via-indigo-50 to-white" />

        {/* Light rays effect similar to hero */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[15%] left-[-8%] rotate-[-25deg] blur-[50px] flex gap-10">
                <div
                    className="h-[450px] w-[110px] rounded-full bg-white/50 animate-pulse"
                    style={{ animationDuration: "8s", animationDelay: "0.4s" }}
                />
                <div
                    className="h-[650px] w-[160px] rounded-full bg-white/70 animate-pulse"
                    style={{ animationDuration: "11s", animationDelay: "1.3s" }}
                />
                <div
                    className="h-[380px] w-[85px] rounded-full bg-white/60 animate-pulse"
                    style={{ animationDuration: "9s", animationDelay: "0.7s" }}
                />
            </div>
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.025]">
            <div
                className="h-full w-full"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.3) 1px, transparent 1px)
          `,
                    backgroundSize: "45px 45px",
                }}
            />
        </div>

        {/* Floating orbs */}
        <div className="absolute top-1/4 right-1/3 w-[38vw] h-[38vw] max-w-[380px] max-h-[380px] rounded-full bg-gradient-to-br from-indigo-200/35 via-purple-200/25 to-transparent opacity-65 blur-3xl animate-pulse pointer-events-none" />
        <div className="absolute bottom-1/3 left-1/4 w-[28vw] h-[28vw] max-w-[280px] max-h-[280px] rounded-full bg-gradient-to-tl from-purple-200/25 via-blue-200/20 to-transparent opacity-45 blur-2xl animate-pulse pointer-events-none" />
    </>
))

const roadmaps = [
    {
        title: "Full-Stack Developer",
        description: "Complete roadmap from basics to advanced full-stack development",
        icon: Code,
        color: "from-blue-500/20 to-cyan-500/20",
        iconColor: "text-blue-600",
        borderColor: "hover:border-blue-500/50",
        createdBy: "AI",
        duration: "6-8 months",
        steps: 12,
        difficulty: "Beginner to Advanced",
        followers: "15.2k",
        rating: 4.9,
        tags: ["React", "Node.js", "MongoDB", "JavaScript"],
        popular: true,
    },
    {
        title: "UI/UX Designer",
        description: "Design thinking to portfolio creation for aspiring designers",
        icon: Palette,
        color: "from-purple-500/20 to-pink-500/20",
        iconColor: "text-purple-600",
        borderColor: "hover:border-purple-500/50",
        createdBy: "Professional",
        duration: "4-6 months",
        steps: 10,
        difficulty: "Beginner to Pro",
        followers: "12.8k",
        rating: 4.8,
        tags: ["Figma", "Design Systems", "User Research", "Prototyping"],
        popular: false,
    },
    {
        title: "Data Scientist",
        description: "From statistics to machine learning and AI implementation",
        icon: BarChart3,
        color: "from-green-500/20 to-emerald-500/20",
        iconColor: "text-green-600",
        borderColor: "hover:border-green-500/50",
        createdBy: "Professional",
        duration: "8-12 months",
        steps: 15,
        difficulty: "Intermediate to Expert",
        followers: "18.5k",
        rating: 4.9,
        tags: ["Python", "Machine Learning", "Statistics", "SQL"],
        popular: true,
    },
    {
        title: "Digital Marketer",
        description: "Master SEO, social media, and data-driven marketing strategies",
        icon: TrendingUp,
        color: "from-orange-500/20 to-red-500/20",
        iconColor: "text-orange-600",
        borderColor: "hover:border-orange-500/50",
        createdBy: "AI",
        duration: "3-5 months",
        steps: 8,
        difficulty: "Beginner to Advanced",
        followers: "9.7k",
        rating: 4.7,
        tags: ["SEO", "Google Ads", "Analytics", "Content Marketing"],
        popular: false,
    },
    {
        title: "Product Manager",
        description: "Strategic thinking to product launch for future PMs",
        icon: Target,
        color: "from-indigo-500/20 to-purple-500/20",
        iconColor: "text-indigo-600",
        borderColor: "hover:border-indigo-500/50",
        createdBy: "Professional",
        duration: "5-7 months",
        steps: 11,
        difficulty: "Intermediate to Advanced",
        followers: "11.3k",
        rating: 4.8,
        tags: ["Strategy", "Analytics", "User Stories", "Agile"],
        popular: false,
    },
    {
        title: "AI/ML Engineer",
        description: "Deep learning, neural networks, and AI system deployment",
        icon: Brain,
        color: "from-cyan-500/20 to-blue-500/20",
        iconColor: "text-cyan-600",
        borderColor: "hover:border-cyan-500/50",
        createdBy: "AI",
        duration: "10-14 months",
        steps: 18,
        difficulty: "Advanced to Expert",
        followers: "22.1k",
        rating: 4.9,
        tags: ["TensorFlow", "PyTorch", "Deep Learning", "MLOps"],
        popular: true,
    },
]

const roadmapStats = [
    {
        number: "500+",
        label: "Career Roadmaps",
        icon: Route,
        description: "Covering all major professions",
        color: "blue",
    },
    {
        number: "150k+",
        label: "Active Followers",
        icon: Users,
        description: "Learning from our roadmaps",
        color: "green",
    },
    {
        number: "AI + Expert",
        label: "Dual Creation",
        icon: Zap,
        description: "AI precision meets human expertise",
        color: "purple",
    },
    {
        number: "95%",
        label: "Success Rate",
        icon: Award,
        description: "Users who complete roadmaps get hired",
        color: "yellow",
    },
]

export default function RoadmapShowcase() {
    return (
        <section className="relative py-24 px-4 overflow-hidden">
            <RoadmapBackground />

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-white/40 rounded-full px-4 py-2 mb-6">
                        <MapPin className="w-4 h-4 text-indigo-600" />
                        <span className="text-sm font-medium text-gray-700">Career Navigation</span>
                    </div>
                    <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                        Follow{" "}
                        <span className="bg-indigo-500 bg-clip-text text-transparent">
                            Career Roadmaps
                        </span>
                    </h2>
                    <p className="text-gray-600 text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed mb-8">
                        Discover step-by-step career paths created by AI and industry professionals. From beginner to expert, we'll
                        guide your journey.
                    </p>

                    {/* Feature highlights */}
                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-white/40 rounded-full px-4 py-2">
                            <Bot className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-gray-700">AI-Generated Paths</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-white/40 rounded-full px-4 py-2">
                            <User className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-medium text-gray-700">Expert-Curated Routes</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-white/40 rounded-full px-4 py-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-gray-700">Step-by-Step Guidance</span>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                    {roadmapStats.map((stat, index) => (
                        <Card
                            key={stat.label}
                            className="bg-white/70 backdrop-blur-sm border border-white/60 hover:bg-white/80 hover:border-white/80 transition-all duration-300 group hover:scale-105 hover:shadow-xl hover:shadow-indigo-100/50 relative overflow-hidden"
                            style={{
                                boxShadow: "0 8px 32px rgba(99, 102, 241, 0.1)",
                            }}
                        >
                            <div
                                className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${stat.color === "blue"
                                    ? "from-blue-200/30"
                                    : stat.color === "green"
                                        ? "from-green-200/30"
                                        : stat.color === "purple"
                                            ? "from-purple-200/30"
                                            : "from-yellow-200/30"
                                    } to-transparent rounded-full blur-xl`}
                            ></div>
                            <CardContent className="p-6 text-center relative z-10">
                                <div
                                    className={`p-3 ${stat.color === "blue"
                                        ? "bg-blue-100"
                                        : stat.color === "green"
                                            ? "bg-green-100"
                                            : stat.color === "purple"
                                                ? "bg-purple-100"
                                                : "bg-yellow-100"
                                        } rounded-2xl w-fit mx-auto mb-4 group-hover:scale-110 transition-transform`}
                                >
                                    <stat.icon
                                        className={`w-6 h-6 ${stat.color === "blue"
                                            ? "text-blue-600"
                                            : stat.color === "green"
                                                ? "text-green-600"
                                                : stat.color === "purple"
                                                    ? "text-purple-600"
                                                    : "text-yellow-600"
                                            }`}
                                    />
                                </div>
                                <div className="text-2xl font-bold text-gray-900 mb-2">{stat.number}</div>
                                <div className="text-lg font-semibold text-gray-700 mb-1">{stat.label}</div>
                                <div className="text-sm text-gray-500">{stat.description}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Roadmaps Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    {roadmaps.map((roadmap, index) => (
                        <Card
                            key={roadmap.title}
                            className={`bg-white/70 backdrop-blur-sm border border-white/60 ${roadmap.borderColor} transition-all duration-300 group hover:bg-white/80 hover:border-white/80 hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-100/50 relative overflow-hidden`}
                            style={{
                                boxShadow: "0 12px 40px rgba(99, 102, 241, 0.1)",
                            }}
                        >
                            {/* Popular Badge */}
                            {roadmap.popular && (
                                <div className="absolute top-4 right-4 z-20">
                                    <Badge className="bg-indigo-500/20 text-indigo-700 border-indigo-500/30 text-xs">Trending</Badge>
                                </div>
                            )}

                            {/* Background Gradient */}
                            <div
                                className={`absolute inset-0 bg-gradient-to-br ${roadmap.color} opacity-60 group-hover:opacity-80 transition-opacity`}
                            ></div>

                            <CardContent className="p-8 relative z-10">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                                            <roadmap.icon className={`w-8 h-8 ${roadmap.iconColor}`} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors mb-1">
                                                {roadmap.title}
                                            </h3>
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                    <span className="text-sm font-semibold text-gray-700">{roadmap.rating}</span>
                                                </div>
                                                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                                <span className="text-sm text-gray-600 font-medium">{roadmap.followers} followers</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Creator Badge */}
                                <div className="flex items-center gap-2 mb-4">
                                    {roadmap.createdBy === "AI" ? (
                                        <div className="flex items-center gap-2 bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-xs font-semibold">
                                            <Bot className="w-3 h-3" />
                                            AI Generated
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 bg-purple-100 text-purple-700 rounded-full px-3 py-1 text-xs font-semibold">
                                            <User className="w-3 h-3" />
                                            Expert Curated
                                        </div>
                                    )}
                                    <Badge variant="outline" className="border-gray-300 text-gray-600 bg-white/60 text-xs">
                                        {roadmap.difficulty}
                                    </Badge>
                                </div>

                                {/* Description */}
                                <p className="text-gray-700 text-base leading-relaxed mb-6 font-medium">{roadmap.description}</p>

                                {/* Roadmap Stats */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/60 rounded-lg">
                                            <Clock className="w-4 h-4 text-gray-600" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-gray-900">{roadmap.duration}</div>
                                            <div className="text-xs text-gray-600">timeline</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/60 rounded-lg">
                                            <MapPin className="w-4 h-4 text-gray-600" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-gray-900">{roadmap.steps} steps</div>
                                            <div className="text-xs text-gray-600">milestones</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mb-8">
                                    {roadmap.tags.slice(0, 3).map((tag, tagIndex) => (
                                        <Badge
                                            key={tagIndex}
                                            variant="outline"
                                            className="border-gray-300 text-gray-600 bg-white/50 text-xs px-2 py-1"
                                        >
                                            {tag}
                                        </Badge>
                                    ))}
                                    {roadmap.tags.length > 3 && (
                                        <Badge variant="outline" className="border-gray-300 text-gray-600 bg-white/50 text-xs px-2 py-1">
                                            +{roadmap.tags.length - 3}
                                        </Badge>
                                    )}
                                </div>

                                {/* CTA Buttons */}
                                <div className="flex gap-3">
                                    <Button className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 rounded hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-200/50">
                                        <Play className="w-4 h-4 mr-2" />
                                        Start Journey
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="bg-white/60 border-gray-300 text-gray-700 hover:bg-white hover:text-gray-900 hover:border-gray-400 px-4 py-3 rounded font-bold hover:scale-105 transition-all duration-300"
                                    >
                                        Preview
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* How It Works Section */}
                <div className="bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-sm rounded-3xl p-12 md:p-16 border border-white/60 relative overflow-hidden hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-300 mb-16">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-50/50 to-purple-50/30 rounded-3xl"></div>
                    <div className="relative z-10">
                        <div className="text-center mb-12">
                            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">How Roadmaps Work</h3>
                            <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
                                Our intelligent system creates personalized learning paths that adapt to your pace and goals
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="p-6 bg-blue-100 rounded-2xl w-fit mx-auto mb-6">
                                    <Target className="w-12 h-12 text-blue-600" />
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 mb-3">Choose Your Path</h4>
                                <p className="text-gray-600 leading-relaxed">
                                    Select from AI-generated or expert-curated roadmaps tailored to your career goals
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="p-6 bg-purple-100 rounded-2xl w-fit mx-auto mb-6">
                                    <BookOpen className="w-12 h-12 text-purple-600" />
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 mb-3">Follow Step-by-Step</h4>
                                <p className="text-gray-600 leading-relaxed">
                                    Complete milestones with curated resources, projects, and assessments
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="p-6 bg-green-100 rounded-2xl w-fit mx-auto mb-6">
                                    <Award className="w-12 h-12 text-green-600" />
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 mb-3">Achieve Your Goal</h4>
                                <p className="text-gray-600 leading-relaxed">
                                    Land your dream job with a portfolio and skills that employers value
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom CTA Section */}
                <div className="text-center">
                    <div className="bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-sm rounded-3xl p-12 md:p-16 border border-white/60 relative overflow-hidden hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-300 mb-12">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-50/60 to-purple-50/40 rounded-3xl"></div>
                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 rounded-full px-4 py-2 mb-6 font-semibold">
                                <Route className="w-4 h-4" />
                                <span className="text-sm">500+ Career Paths Available</span>
                            </div>
                            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Ready to Start Your Journey?</h3>
                            <p className="text-gray-600 text-xl mb-10 max-w-3xl mx-auto leading-relaxed">
                                Join thousands of learners who are following structured roadmaps to achieve their career goals. Your
                                personalized path awaits.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                                <Button
                                    size="lg"
                                    className="bg-indigo-500 hover:bg-indigo-600 text-white text-xl px-12 py-6 font-bold hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-200/50"
                                >
                                    Explore All Roadmaps
                                    <ArrowRight className="ml-3 w-6 h-6" />
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-2 border-gray-300 text-gray-700 hover:bg-white hover:text-gray-900 hover:border-gray-400 text-xl px-12 py-6 rounded font-bold bg-white/50 backdrop-blur-sm hover:scale-105 transition-all duration-300"
                                >
                                    Create Custom Roadmap
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Additional Features */}
                    <div className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl p-8">
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                                <div className="text-left">
                                    <div className="font-bold text-gray-900">New roadmaps added weekly</div>
                                    <div className="text-sm text-gray-600">Stay updated with industry trends</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge
                                    variant="outline"
                                    className="border-2 border-blue-300 text-blue-700 bg-blue-50 font-bold px-4 py-2"
                                >
                                    100% Free Access
                                </Badge>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="text-2xl">🎯</div>
                                <div className="text-left">
                                    <div className="font-bold text-gray-900">Personalized recommendations</div>
                                    <div className="text-sm text-gray-600">AI matches you with perfect paths</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
