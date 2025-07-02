"use client"

import { Star, Users, Award, TrendingUp, Quote, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const testimonials = [
    {
        name: "Sarah Chen",
        role: "Frontend Developer at Google",
        image: "/placeholder.svg?height=60&width=60",
        content:
            "Skill Smoker's AI-powered learning completely transformed my career. I went from zero coding knowledge to landing my dream job at Google in just 8 months.",
        rating: 5,
        course: "Full-Stack Web Development",
    },
    {
        name: "Marcus Rodriguez",
        role: "Data Scientist at Netflix",
        image: "/placeholder.svg?height=60&width=60",
        content:
            "The personalized learning paths and real-world projects made all the difference. I'm now working on ML models that millions of people use daily.",
        rating: 5,
        course: "AI & Machine Learning",
    },
    {
        name: "Emily Johnson",
        role: "UX Designer at Airbnb",
        image: "/placeholder.svg?height=60&width=60",
        content:
            "The mentor support and community feedback helped me build a portfolio that stood out. Got 3 job offers within 2 weeks of completing the course!",
        rating: 5,
        course: "UI/UX Design",
    },
    {
        name: "David Kim",
        role: "Mobile Developer at Spotify",
        image: "/placeholder.svg?height=60&width=60",
        content:
            "Best investment I've made in my career. The hands-on projects and industry connections opened doors I never thought possible.",
        rating: 5,
        course: "Mobile Development",
    },
]

const stats = [
    {
        number: "50,000+",
        label: "Active Learners",
        icon: Users,
        description: "Students actively learning and growing",
    },
    {
        number: "92%",
        label: "Completion Rate",
        icon: TrendingUp,
        description: "Students who finish their courses",
    },
    {
        number: "40+",
        label: "Expert Mentors",
        icon: Award,
        description: "Industry professionals guiding you",
    },
    {
        number: "4.9/5",
        label: "Average Rating",
        icon: Star,
        description: "Based on 12,000+ reviews",
    },
]

const companies = [
    { name: "Google", logo: "/placeholder.svg?height=40&width=120" },
    { name: "Netflix", logo: "/placeholder.svg?height=40&width=120" },
    { name: "Airbnb", logo: "/placeholder.svg?height=40&width=120" },
    { name: "Spotify", logo: "/placeholder.svg?height=40&width=120" },
    { name: "Microsoft", logo: "/placeholder.svg?height=40&width=120" },
    { name: "Tesla", logo: "/placeholder.svg?height=40&width=120" },
]

export default function TrustedByLearners() {
    return (
        <section className="bg-black py-20 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Trusted by <span className="text-indigo-400">50,000+</span> Learners
                    </h2>
                    <p className="text-zinc-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                        Join thousands of successful graduates who've transformed their careers with Skill Smoker
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                    {stats.map((stat) => (
                        <Card
                            key={stat.label}
                            className="bg-zinc-900 border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-300 group"
                        >
                            <CardContent className="p-6 text-center">
                                <div className="p-3 bg-indigo-500/20 rounded-full w-fit mx-auto mb-4 group-hover:bg-indigo-500/30 transition-colors">
                                    <stat.icon className="w-6 h-6 text-indigo-400" />
                                </div>
                                <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                                <div className="text-lg font-semibold text-zinc-300 mb-1">{stat.label}</div>
                                <div className="text-sm text-zinc-400">{stat.description}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Testimonials Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-20">
                    {testimonials.map((testimonial) => (
                        <Card
                            key={testimonial.name}
                            className="bg-gradient-to-br from-zinc-900 to-zinc-800 border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-300 group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full blur-2xl"></div>
                            <CardContent className="p-6 relative z-10">
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <Quote className="w-8 h-8 text-indigo-400/50 mb-4" />
                                <p className="text-zinc-300 text-base leading-relaxed mb-6">"{testimonial.content}"</p>
                                <div className="flex items-center gap-4">
                                    <img
                                        src={testimonial.image || "/placeholder.svg"}
                                        alt={testimonial.name}
                                        className="w-12 h-12 rounded-full bg-zinc-700"
                                    />
                                    <div>
                                        <div className="font-semibold text-white">{testimonial.name}</div>
                                        <div className="text-sm text-zinc-400">{testimonial.role}</div>
                                        <div className="text-xs text-indigo-400 mt-1">{testimonial.course}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Companies Section */}
                <div className="text-center mb-16">
                    <h3 className="text-2xl font-semibold text-white mb-8">Our graduates work at top companies worldwide</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
                        {companies.map((company) => (
                            <div
                                key={company.name}
                                className="flex items-center justify-center p-4 rounded-lg bg-zinc-900/50 hover:bg-zinc-800/50 transition-colors group"
                            >
                                <img
                                    src={company.logo || "/placeholder.svg"}
                                    alt={company.name}
                                    className="h-8 opacity-60 group-hover:opacity-100 transition-opacity filter grayscale group-hover:grayscale-0"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Success Stories CTA */}
                <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-2xl p-8 md:p-12 text-center border border-zinc-700/50">
                    <div className="max-w-3xl mx-auto">
                        <h3 className="text-3xl font-bold text-white mb-4">Ready to Write Your Success Story?</h3>
                        <p className="text-zinc-300 text-lg mb-8 leading-relaxed">
                            Join thousands of learners who've already transformed their careers. Your journey to success starts with a
                            single step.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Button
                                size="lg"
                                className="bg-indigo-500 hover:bg-indigo-600 cursor-pointer text-white text-lg px-8 py-4"
                            >
                                Start Your Journey
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Community Proof */}
                <div className="mt-16 text-center">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-zinc-400">
                        <div className="flex items-center gap-2">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div
                                        key={i}
                                        className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 border-2 border-black"
                                    />
                                ))}
                            </div>
                            <span className="text-sm">Join 50,000+ active learners</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-sm">1,247 people learning right now</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
