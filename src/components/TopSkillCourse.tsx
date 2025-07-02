"use client"

import { Code, Palette, TrendingUp, Brain, DollarSign, BarChart3, ArrowRight, Clock, Users, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const skillCourses = [
    {
        title: "Web Development",
        description: "Learn full-stack development using modern tools like React, Node.js & more.",
        icon: Code,
        color: "from-blue-500/20 to-cyan-500/20",
        iconColor: "text-blue-400",
        borderColor: "hover:border-blue-500/50",
        students: "12,847",
        duration: "16 weeks",
        rating: 4.9,
        level: "Beginner to Advanced",
        projects: 8,
        popular: true,
    },
    {
        title: "UI/UX Design",
        description: "Master design thinking, wireframing & real tools like Figma.",
        icon: Palette,
        color: "from-purple-500/20 to-pink-500/20",
        iconColor: "text-purple-400",
        borderColor: "hover:border-purple-500/50",
        students: "8,932",
        duration: "12 weeks",
        rating: 4.8,
        level: "Beginner to Pro",
        projects: 6,
        popular: false,
    },
    {
        title: "Digital Marketing",
        description: "Learn SEO, ads, content strategy & data-driven growth.",
        icon: TrendingUp,
        color: "from-green-500/20 to-emerald-500/20",
        iconColor: "text-green-400",
        borderColor: "hover:border-green-500/50",
        students: "6,543",
        duration: "10 weeks",
        rating: 4.7,
        level: "Beginner to Expert",
        projects: 5,
        popular: false,
    },
    {
        title: "AI & Machine Learning",
        description: "Build smart apps with Python, ML models & real datasets.",
        icon: Brain,
        color: "from-orange-500/20 to-red-500/20",
        iconColor: "text-orange-400",
        borderColor: "hover:border-orange-500/50",
        students: "9,876",
        duration: "20 weeks",
        rating: 4.9,
        level: "Intermediate to Advanced",
        projects: 10,
        popular: true,
    },
    {
        title: "Freelancing & Monetization",
        description: "Learn how to earn online with your skills.",
        icon: DollarSign,
        color: "from-yellow-500/20 to-amber-500/20",
        iconColor: "text-yellow-400",
        borderColor: "hover:border-yellow-500/50",
        students: "4,321",
        duration: "8 weeks",
        rating: 4.6,
        level: "All Levels",
        projects: 4,
        popular: false,
    },
    {
        title: "Data Science",
        description: "Analyze data, build models & make smarter decisions.",
        icon: BarChart3,
        color: "from-cyan-500/20 to-blue-500/20",
        iconColor: "text-cyan-400",
        borderColor: "hover:border-cyan-500/50",
        students: "7,654",
        duration: "18 weeks",
        rating: 4.8,
        level: "Intermediate to Advanced",
        projects: 7,
        popular: false,
    },
]

export default function TopSkillCourses() {
    return (
        <section className="bg-black py-20 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Explore Skill Courses</h2>
                    <p className="text-zinc-300 text-lg md:text-xl max-w-4xl mx-auto leading-relaxed">
                        Whether you're into code, design, or strategy — we've got you covered. Start with a skill that matches your
                        goals.
                    </p>
                </div>

                {/* Courses Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {skillCourses.map((course) => (
                        <Card
                            key={course.title}
                            className={`bg-gradient-to-br from-zinc-900 to-zinc-800 border-zinc-700/50 ${course.borderColor} transition-all duration-300 group hover:transform hover:-translate-y-1 relative overflow-hidden`}
                        >
                            {/* Popular Badge */}
                            {course.popular && (
                                <div className="absolute top-4 right-4 z-10">
                                    <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 text-xs">Most Popular</Badge>
                                </div>
                            )}

                            {/* Background Gradient */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${course.color} opacity-50`}></div>

                            <CardContent className="p-6 relative z-10">
                                {/* Icon and Title */}
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-black/30 rounded-xl backdrop-blur-sm">
                                        <course.icon className={`w-8 h-8 ${course.iconColor}`} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-white group-hover:text-white/90 transition-colors">
                                            {course.title}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                <span className="text-sm text-zinc-300">{course.rating}</span>
                                            </div>
                                            <div className="w-1 h-1 bg-zinc-500 rounded-full"></div>
                                            <span className="text-sm text-zinc-400">{course.level}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-zinc-300 text-sm leading-relaxed mb-6">{course.description}</p>

                                {/* Course Stats */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4 text-zinc-400" />
                                        <span className="text-sm text-zinc-300">{course.students} students</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-zinc-400" />
                                        <span className="text-sm text-zinc-300">{course.duration}</span>
                                    </div>
                                </div>

                                {/* Projects Badge */}
                                <div className="flex items-center justify-between mb-6">
                                    <Badge variant="outline" className="border-zinc-600 text-zinc-300 bg-transparent">
                                        {course.projects} Real Projects
                                    </Badge>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-white">Free</div>
                                        <div className="text-xs text-zinc-400">Get started today</div>
                                    </div>
                                </div>

                                {/* CTA Button */}
                                <Button
                                    className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 backdrop-blur-sm group-hover:bg-white/15 transition-all duration-200"
                                    variant="outline"
                                >
                                    Start Learning
                                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Bottom CTA Section */}
                <div className="text-center">
                    <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-2xl p-8 md:p-12 border border-zinc-700/50 mb-8">
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Can't Find What You're Looking For?</h3>
                        <p className="text-zinc-300 text-lg mb-6 max-w-2xl mx-auto">
                            We have 50+ specialized courses covering everything from blockchain to game development. Explore our full
                            catalog to find your perfect match.
                        </p>
                        <Button
                            size="lg"
                            className="bg-indigo-500 hover:bg-indigo-600 cursor-pointer text-white text-lg px-8 py-4"
                        >
                            View all Course
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </div>

                    {/* Additional Stats */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-zinc-400">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-sm">New courses added weekly</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="border-zinc-600 text-zinc-400 bg-transparent text-xs">
                                100% Free to Start
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm">⚡ Lifetime access included</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
