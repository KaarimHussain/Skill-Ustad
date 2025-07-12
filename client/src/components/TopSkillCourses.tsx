"use client"
import { Code, Palette, TrendingUp, Brain, DollarSign, BarChart3, ArrowRight, Clock, Users, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { memo } from "react"

// Background elements matching hero theme
const CoursesBackground = memo(() => (
    <>
        {/* Gradient background matching hero */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-100 via-purple-50 to-white" />

        {/* Light rays effect similar to hero */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[20%] right-[-10%] rotate-[45deg] blur-[60px] flex gap-10">
                <div
                    className="h-[500px] w-[120px] rounded-full bg-white/60 animate-pulse"
                    style={{ animationDuration: "9s", animationDelay: "0.3s" }}
                />
                <div
                    className="h-[700px] w-[180px] rounded-full bg-white/80 animate-pulse"
                    style={{ animationDuration: "11s", animationDelay: "1.5s" }}
                />
                <div
                    className="h-[400px] w-[90px] rounded-full bg-white/70 animate-pulse"
                    style={{ animationDuration: "8s", animationDelay: "0.8s" }}
                />
            </div>
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.025]">
            <div
                className="h-full w-full"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.4) 1px, transparent 1px)
          `,
                    backgroundSize: "40px 40px",
                }}
            />
        </div>

        {/* Floating orbs */}
        <div className="absolute top-1/3 left-1/5 w-[35vw] h-[35vw] max-w-[350px] max-h-[350px] rounded-full bg-gradient-to-br from-purple-200/40 via-indigo-200/30 to-transparent opacity-70 blur-3xl animate-pulse pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/5 w-[25vw] h-[25vw] max-w-[250px] max-h-[250px] rounded-full bg-gradient-to-tl from-blue-200/30 via-cyan-200/20 to-transparent opacity-50 blur-2xl animate-pulse pointer-events-none" />
    </>
))

const skillCourses = [
    {
        title: "Web Development",
        description: "Learn full-stack development using modern tools like React, Node.js & more.",
        icon: Code,
        color: "from-blue-500/20 to-cyan-500/20",
        iconColor: "text-blue-600",
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
        iconColor: "text-purple-600",
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
        iconColor: "text-green-600",
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
        iconColor: "text-orange-600",
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
        iconColor: "text-yellow-600",
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
        iconColor: "text-cyan-600",
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
        <section className="relative py-20 px-4 overflow-hidden">
            <CoursesBackground />

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Explore Skill Courses</h2>
                    <p className="text-gray-600 text-lg md:text-xl max-w-4xl mx-auto leading-relaxed">
                        Whether you're into code, design, or strategy — we've got you covered. Start with a skill that matches your
                        goals.
                    </p>
                </div>

                {/* Courses Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {skillCourses.map((course) => (
                        <Card
                            key={course.title}
                            className={`bg-white/70 backdrop-blur-sm border border-white/60 ${course.borderColor} transition-all duration-300 group hover:transform hover:-translate-y-1 relative overflow-hidden hover:shadow-xl hover:shadow-indigo-100/50`}
                            style={{
                                boxShadow: "0 8px 32px rgba(99, 102, 241, 0.1)",
                            }}
                        >
                            {/* Popular Badge */}
                            {course.popular && (
                                <div className="absolute top-4 right-4 z-10">
                                    <Badge className="bg-indigo-500/20 text-indigo-700 border-indigo-500/30 text-xs">Most Popular</Badge>
                                </div>
                            )}
                            {/* Background Gradient */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${course.color} opacity-50`}></div>
                            <CardContent className="p-6 relative z-10">
                                {/* Icon and Title */}
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-white/60 backdrop-blur-sm rounded-xl">
                                        <course.icon className={`w-8 h-8 ${course.iconColor}`} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-gray-800 transition-colors">
                                            {course.title}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                <span className="text-sm text-gray-700">{course.rating}</span>
                                            </div>
                                            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                                            <span className="text-sm text-gray-600">{course.level}</span>
                                        </div>
                                    </div>
                                </div>
                                {/* Description */}
                                <p className="text-gray-700 text-sm leading-relaxed mb-6">{course.description}</p>
                                {/* Course Stats */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4 text-gray-600" />
                                        <span className="text-sm text-gray-700">{course.students} students</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-gray-600" />
                                        <span className="text-sm text-gray-700">{course.duration}</span>
                                    </div>
                                </div>
                                {/* Projects Badge */}
                                <div className="flex items-center justify-between mb-6">
                                    <Badge variant="outline" className="border-gray-400 text-gray-700 bg-white/50">
                                        {course.projects} Real Projects
                                    </Badge>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-gray-900">Free</div>
                                        <div className="text-xs text-gray-600">Get started today</div>
                                    </div>
                                </div>
                                {/* CTA Button */}
                                <Button
                                    className="w-full bg-white/50 hover:bg-white/70 text-gray-900 border border-gray-300 hover:border-gray-400 backdrop-blur-sm group-hover:bg-white/60 transition-all duration-200"
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
                    <div className=" p-8 md:p-12 mb-8 transition-all duration-300">
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Can't Find What You're Looking For?</h3>
                        <p className="text-gray-600 text-lg mb-6 max-w-2xl mx-auto">
                            We have 50+ specialized courses covering everything from blockchain to game development. Explore our full
                            catalog to find your perfect match.
                        </p>
                        <Button
                            size="lg"
                            className="bg-indigo-500 hover:bg-indigo-600 text-white text-lg px-8 py-4"
                        >
                            View All Courses
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </div>
                    {/* Additional Stats */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-gray-600">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-sm">New courses added weekly</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="border-gray-400 text-gray-600 bg-white/50 text-xs">
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
