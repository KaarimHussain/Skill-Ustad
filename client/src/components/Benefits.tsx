"use client"
import type React from "react"
import { Brain, Target, Code, Users, TrendingUp, Award, BookOpen, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { memo } from "react"

// Memoized background elements matching hero theme
const BackgroundElements = memo(() => (
    <>
        {/* Gradient background matching hero */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-100 via-indigo-50 to-white" />

        {/* Light rays effect similar to hero */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] rotate-[35deg] blur-[40px] flex gap-8">
                <div
                    className="h-[600px] w-[100px] rounded-full bg-white/40 animate-pulse"
                    style={{ animationDuration: "7s", animationDelay: "0.7s" }}
                />
                <div
                    className="h-[800px] w-[200px] rounded-full bg-white/60 animate-pulse"
                    style={{ animationDuration: "10s", animationDelay: "1s" }}
                />
                <div
                    className="h-[500px] w-[70px] rounded-full bg-white/60 animate-pulse"
                    style={{ animationDuration: "12s", animationDelay: "0.2s" }}
                />
            </div>
        </div>

        {/* Grid pattern for continuity */}
        <div className="absolute inset-0 opacity-[0.03]">
            <div
                className="h-full w-full"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.2) 1px, transparent 1px)
          `,
                    backgroundSize: "50px 50px",
                }}
            />
        </div>

        {/* Subtle floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 8 }, (_, i) => (
                <div
                    key={i}
                    className="absolute bg-indigo-400 rounded-full opacity-10 animate-pulse"
                    style={{
                        width: `${Math.random() * 4 + 3}px`,
                        height: `${Math.random() * 4 + 3}px`,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 5}s`,
                        animationDuration: `${Math.random() * 3 + 2}s`,
                    }}
                />
            ))}
        </div>

        {/* Subtle orb continuation from hero */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full bg-gradient-to-br from-indigo-200/20 via-purple-200/10 to-transparent opacity-50 blur-3xl animate-pulse" />
        </div>
    </>
))

// Memoized benefit card component with white theme
const BenefitCard = memo(
    ({
        className,
        children,
        delay = 0,
    }: {
        className: string
        children: React.ReactNode
        delay?: number
    }) => (
        <div
            className={`${className} bg-white/70 backdrop-blur-sm border border-white/60 rounded-2xl p-6 group hover:bg-white/80 hover:border-white/80 transition-all duration-300 relative overflow-hidden hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-100/50 opacity-0 translate-y-8 animate-fade-in-up`}
            style={{
                animationDelay: `${delay}ms`,
                animationFillMode: "forwards",
                boxShadow: "0 8px 32px rgba(99, 102, 241, 0.1)",
            }}
        >
            <div className="relative z-10 h-full flex flex-col">{children}</div>
        </div>
    ),
)

export default function Benefits() {
    return (
        <section className="relative min-h-screen w-full flex flex-col items-center justify-center py-20 px-4 overflow-hidden">
            <BackgroundElements />
            <div className="relative z-10 max-w-7xl mx-auto w-full">
                {/* Header */}
                <div className="text-center mb-16">
                    <div
                        className="opacity-0 translate-y-8 animate-fade-in-up"
                        style={{ animationDelay: "200ms", animationFillMode: "forwards" }}
                    >
                        <h1 className="font-bold text-5xl md:text-6xl text-gray-900 mb-4">Built Different — Here's How</h1>
                        <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                            Skill-Ustad blends AI with hands-on learning to help you master real skills—faster, smarter, better
                        </p>
                    </div>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-8 gap-4 md:gap-6 auto-rows-[200px]">
                    {/* AI-Powered Learning - Large Card */}
                    <BenefitCard className="md:col-span-3 lg:col-span-3 md:row-span-2" delay={400}>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-transparent rounded-full blur-2xl"></div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                                <Brain className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-semibold text-gray-900">AI-Powered Learning</h3>
                        </div>
                        <p className="text-gray-600 text-base leading-relaxed mb-6 flex-1">
                            Personalized paths, instant answers & feedback with AI to lead you to the success you deserve. Get
                            real-time assistance and adaptive learning.
                        </p>
                        <div className="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700 transition-colors cursor-pointer">
                            Learn more <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </BenefitCard>

                    {/* Skill-Focused Tracks */}
                    <BenefitCard className="md:col-span-3 lg:col-span-2" delay={500}>
                        <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-green-200/40 to-transparent rounded-full blur-xl"></div>
                        <div className="p-2 bg-green-100 rounded-lg w-fit mb-4 group-hover:bg-green-200 transition-colors">
                            <Target className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Skill-Focused Tracks</h3>
                        <p className="text-gray-600 text-sm leading-relaxed flex-1">
                            Structured learning paths designed around specific skills and career goals.
                        </p>
                    </BenefitCard>

                    {/* Mentor Access */}
                    <BenefitCard className="md:col-span-3 lg:col-span-3" delay={600}>
                        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-gradient-to-tr from-purple-200/20 to-transparent rounded-full blur-xl"></div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                                <Users className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">Expert Mentor Access</h3>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">
                            Get guidance from industry professionals who've been where you want to go.
                        </p>
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 border-2 border-white group-hover:scale-110 transition-transform"
                                />
                            ))}
                            <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="text-xs text-gray-600">+50</span>
                            </div>
                        </div>
                    </BenefitCard>

                    {/* Smart Projects */}
                    <BenefitCard className="md:col-span-3 lg:col-span-2 md:row-span-2" delay={700}>
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-100/20 to-transparent"></div>
                        <div className="p-2 bg-orange-100 rounded-lg w-fit mb-4 group-hover:bg-orange-200 transition-colors">
                            <Code className="w-6 h-6 text-orange-600" />
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Smart Projects</h3>
                        <p className="text-gray-600 text-base leading-relaxed mb-6 flex-1">
                            Build real-world projects that adapt to your skill level and career goals. Each project is designed to
                            challenge and grow your abilities.
                        </p>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                                Portfolio-ready projects
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                                Industry-standard tools
                            </div>
                        </div>
                    </BenefitCard>

                    {/* Progress Tracking */}
                    <BenefitCard className="md:col-span-6 lg:col-span-3" delay={800}>
                        <div className="absolute -top-5 -right-5 w-16 h-16 bg-gradient-to-br from-cyan-200/40 to-transparent rounded-full blur-lg"></div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-cyan-100 rounded-lg group-hover:bg-cyan-200 transition-colors">
                                    <TrendingUp className="w-6 h-6 text-cyan-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900">Progress You Can See</h3>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-cyan-600">87%</div>
                                <div className="text-xs text-gray-500">Completion</div>
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">
                            Track your learning journey with detailed analytics and milestone celebrations.
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-1000 group-hover:w-[95%] w-[87%]"></div>
                        </div>
                    </BenefitCard>

                    {/* Certificates */}
                    <BenefitCard className="md:col-span-3 lg:col-span-3" delay={900}>
                        <div className="absolute -bottom-5 -right-5 w-16 h-16 bg-gradient-to-tl from-yellow-200/40 to-transparent rounded-full blur-lg"></div>
                        <div className="p-2 bg-yellow-100 rounded-lg w-fit mb-4 group-hover:bg-yellow-200 transition-colors">
                            <Award className="w-6 h-6 text-yellow-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Industry Certificates</h3>
                        <p className="text-gray-600 text-sm leading-relaxed flex-1">
                            Earn recognized certifications that employers actually value.
                        </p>
                    </BenefitCard>

                    {/* Community Learning */}
                    <BenefitCard className="md:col-span-3 lg:col-span-3" delay={1000}>
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-100/20 to-transparent"></div>
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                                    <BookOpen className="w-6 h-6 text-indigo-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900">Community Learning</h3>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                Learn alongside thousands of motivated students in our active community.
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            className="w-fit bg-white/50 border-gray-300 text-gray-700 hover:bg-white hover:text-gray-900 hover:border-gray-400 hover:scale-105 transition-all duration-200"
                        >
                            Join Community
                        </Button>
                    </BenefitCard>
                </div>

                {/* CTA Section */}
                <div
                    className="text-center mt-16 opacity-0 translate-y-8 animate-fade-in-up"
                    style={{ animationDelay: "1200ms", animationFillMode: "forwards" }}
                >
                    <Button
                        size="lg"
                        className="group bg-indigo-500 hover:bg-indigo-600 text-white text-lg px-10 py-4 rounded font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-indigo-200/50"
                    >
                        Start Your Journey Today
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>

            {/* Bottom gradient fade for next section */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        </section>
    )
}
