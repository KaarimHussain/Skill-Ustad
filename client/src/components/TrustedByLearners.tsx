"use client"

import { Star, Users, Award, TrendingUp, Quote, CheckCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { memo } from "react"


const testimonials = [
    {
        name: "Sarah Chen",
        role: "Frontend Developer at Google",
        image: "/placeholder.svg?height=60&width=60",
        content:
            "Skill-Ustad's AI-powered learning completely transformed my career. I went from zero coding knowledge to landing my dream job at Google in just 8 months.",
        rating: 5,
        course: "Full-Stack Web Development",
        salary: "$120k → $180k",
    },
    {
        name: "Marcus Rodriguez",
        role: "Data Scientist at Netflix",
        image: "/placeholder.svg?height=60&width=60",
        content:
            "The personalized learning paths and real-world projects made all the difference. I'm now working on ML models that millions of people use daily.",
        rating: 5,
        course: "AI & Machine Learning",
        salary: "$85k → $165k",
    },
    {
        name: "Emily Johnson",
        role: "UX Designer at Airbnb",
        image: "/placeholder.svg?height=60&width=60",
        content:
            "The mentor support and community feedback helped me build a portfolio that stood out. Got 3 job offers within 2 weeks of completing the course!",
        rating: 5,
        course: "UI/UX Design",
        salary: "$60k → $140k",
    },
    {
        name: "David Kim",
        role: "Mobile Developer at Spotify",
        image: "/placeholder.svg?height=60&width=60",
        content:
            "Best investment I've made in my career. The hands-on projects and industry connections opened doors I never thought possible.",
        rating: 5,
        course: "Mobile Development",
        salary: "$70k → $155k",
    },
]

const stats = [
    {
        number: "50,000+",
        label: "Active Learners",
        icon: Users,
        description: "Students actively learning and growing",
        color: "blue",
    },
    {
        number: "92%",
        label: "Completion Rate",
        icon: TrendingUp,
        description: "Students who finish their courses",
        color: "green",
    },
    {
        number: "40+",
        label: "Expert Mentors",
        icon: Award,
        description: "Industry professionals guiding you",
        color: "purple",
    },
    {
        number: "4.9/5",
        label: "Average Rating",
        icon: Star,
        description: "Based on 12,000+ reviews",
        color: "yellow",
    },
]

// Background elements matching hero theme
const TestimonialsBackground = memo(() => (
    <>
        {/* Gradient background matching hero */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-purple-50 to-indigo-100" />

        {/* Light rays effect similar to hero */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[10%] left-[-5%] rotate-[-35deg] blur-[50px] flex gap-8">
                <div
                    className="h-[400px] w-[80px] rounded-full bg-white/50 animate-pulse"
                    style={{ animationDuration: "8s", animationDelay: "0.5s" }}
                />
                <div
                    className="h-[600px] w-[150px] rounded-full bg-white/70 animate-pulse"
                    style={{ animationDuration: "12s", animationDelay: "1.2s" }}
                />
                <div
                    className="h-[350px] w-[60px] rounded-full bg-white/60 animate-pulse"
                    style={{ animationDuration: "9s", animationDelay: "0.8s" }}
                />
            </div>
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
            <div
                className="h-full w-full"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(99, 102, 241, 0.3) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(99, 102, 241, 0.3) 1px, transparent 1px)
                    `,
                    backgroundSize: "60px 60px",
                }}
            />
        </div>

        {/* Floating orbs */}
        <div className="absolute top-1/4 right-1/4 w-[40vw] h-[40vw] max-w-[400px] max-h-[400px] rounded-full bg-gradient-to-br from-indigo-200/30 via-purple-200/20 to-transparent opacity-60 blur-3xl animate-pulse pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-[30vw] h-[30vw] max-w-[300px] max-h-[300px] rounded-full bg-gradient-to-tr from-purple-200/20 via-blue-200/15 to-transparent opacity-40 blur-2xl animate-pulse pointer-events-none" />
    </>
))

export default function TrustedByLearners() {
    return (
        <section className="relative py-24 px-4 overflow-hidden">
            <TestimonialsBackground />

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-white/40 rounded-full px-4 py-2 mb-6">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-gray-700">Trusted by Industry Leaders</span>
                    </div>
                    <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                        Trusted by{" "}
                        <span className="bg-indigo-500 bg-clip-text text-transparent">
                            50,000+
                        </span>{" "}
                        Learners
                    </h2>
                    <p className="text-gray-600 text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed">
                        Join thousands of successful graduates who've transformed their careers with Skill-Ustad
                    </p>
                </div>

                {/* Enhanced Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
                    {stats.map((stat) => (
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
                            <CardContent className="p-8 text-center relative z-10">
                                <div
                                    className={`p-4 ${stat.color === "blue"
                                        ? "bg-blue-100"
                                        : stat.color === "green"
                                            ? "bg-green-100"
                                            : stat.color === "purple"
                                                ? "bg-purple-100"
                                                : "bg-yellow-100"
                                        } rounded-2xl w-fit mx-auto mb-6 group-hover:scale-110 transition-transform`}
                                >
                                    <stat.icon
                                        className={`w-8 h-8 ${stat.color === "blue"
                                            ? "text-blue-600"
                                            : stat.color === "green"
                                                ? "text-green-600"
                                                : stat.color === "purple"
                                                    ? "text-purple-600"
                                                    : "text-yellow-600"
                                            }`}
                                    />
                                </div>
                                <div className="text-4xl font-bold text-gray-900 mb-3">{stat.number}</div>
                                <div className="text-xl font-semibold text-gray-700 mb-2">{stat.label}</div>
                                <div className="text-sm text-gray-500">{stat.description}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Enhanced Testimonials Grid */}
                <div className="grid md:grid-cols-2 gap-8 mb-24">
                    {testimonials.map((testimonial) => (
                        <Card
                            key={testimonial.name}
                            className="bg-white/70 backdrop-blur-sm border border-white/60 hover:bg-white/80 hover:border-white/80 transition-all duration-300 group relative overflow-hidden hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-100/50"
                            style={{
                                boxShadow: "0 12px 40px rgba(99, 102, 241, 0.15)",
                            }}
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-200/20 to-transparent rounded-full blur-2xl"></div>
                            <CardContent className="p-8 relative z-10">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-1">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                                        {testimonial.salary}
                                    </div>
                                </div>

                                <Quote className="w-10 h-10 text-indigo-400/60 mb-6" />
                                <p className="text-gray-700 text-lg leading-relaxed mb-8 font-medium">"{testimonial.content}"</p>

                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <img
                                            src={testimonial.image || "/placeholder.svg"}
                                            alt={testimonial.name}
                                            className="w-16 h-16 rounded-full bg-gray-200 ring-4 ring-white shadow-lg"
                                        />
                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                            <CheckCircle className="w-3 h-3 text-white" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-bold text-gray-900 text-lg">{testimonial.name}</div>
                                        <div className="text-gray-600 font-medium">{testimonial.role}</div>
                                        <div className="text-indigo-600 text-sm font-semibold mt-1 bg-indigo-50 px-2 py-1 rounded-md inline-block">
                                            {testimonial.course}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

            </div>
        </section>
    )
}