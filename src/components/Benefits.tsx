"use client"

import { Brain, Target, Code, Users, TrendingUp, Award, BookOpen, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Benefits() {
    return (
        <section className="bg-black min-h-screen w-full flex flex-col items-center justify-center py-20 px-4">
            <div className="max-w-7xl mx-auto w-full">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="font-bold text-5xl md:text-6xl text-white mb-4">Built Different — Here's How</h1>
                    <p className="text-zinc-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                        Skill Smoker blends AI with hands-on learning to help you master real skills—faster, smarter, better
                    </p>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-8 gap-4 md:gap-6 auto-rows-[200px]">
                    {/* AI-Powered Learning - Large Card */}
                    <div className="md:col-span-3 lg:col-span-3 md:row-span-2 bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-700/50 rounded-2xl p-6 group hover:border-zinc-600/50 transition-all duration-300 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-2xl"></div>
                        <div className="relative z-10 h-full flex flex-col">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-blue-500/20 rounded-lg">
                                    <Brain className="w-6 h-6 text-blue-400" />
                                </div>
                                <h3 className="text-2xl font-semibold text-white">AI-Powered Learning</h3>
                            </div>
                            <p className="text-zinc-400 text-base leading-relaxed mb-6 flex-1">
                                Personalized paths, instant answers & feedback with AI to lead you to the success you deserve. Get
                                real-time assistance and adaptive learning.
                            </p>
                            <div className="flex items-center text-blue-400 text-sm font-medium group-hover:text-blue-300 transition-colors">
                                Learn more <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </div>

                    {/* Skill-Focused Tracks */}
                    <div className="md:col-span-3 lg:col-span-2 bg-zinc-900 border border-zinc-700/50 rounded-2xl p-6 group hover:border-zinc-600/50 transition-all duration-300 relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-green-500/20 to-transparent rounded-full blur-xl"></div>
                        <div className="relative z-10 h-full flex flex-col">
                            <div className="p-2 bg-green-500/20 rounded-lg w-fit mb-4">
                                <Target className="w-6 h-6 text-green-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-3">Skill-Focused Tracks</h3>
                            <p className="text-zinc-400 text-sm leading-relaxed flex-1">
                                Structured learning paths designed around specific skills and career goals.
                            </p>
                        </div>
                    </div>

                    {/* Mentor Access */}
                    <div className="md:col-span-3 lg:col-span-3 bg-zinc-900 border border-zinc-700/50 rounded-2xl p-6 group hover:border-zinc-600/50 transition-all duration-300 relative overflow-hidden">
                        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full blur-xl"></div>
                        <div className="relative z-10 h-full flex flex-col">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-purple-500/20 rounded-lg">
                                    <Users className="w-6 h-6 text-purple-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-white">Expert Mentor Access</h3>
                            </div>
                            <p className="text-zinc-400 text-sm leading-relaxed mb-4 flex-1">
                                Get guidance from industry professionals who've been where you want to go.
                            </p>
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 border-2 border-zinc-900"
                                    />
                                ))}
                                <div className="w-8 h-8 rounded-full bg-zinc-700 border-2 border-zinc-900 flex items-center justify-center">
                                    <span className="text-xs text-zinc-300">+50</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Smart Projects */}
                    <div className="md:col-span-3 lg:col-span-2 md:row-span-2 bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-700/50 rounded-2xl p-6 group hover:border-zinc-600/50 transition-all duration-300 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-500/5 to-transparent"></div>
                        <div className="relative z-10 h-full flex flex-col">
                            <div className="p-2 bg-orange-500/20 rounded-lg w-fit mb-4">
                                <Code className="w-6 h-6 text-orange-400" />
                            </div>
                            <h3 className="text-2xl font-semibold text-white mb-4">Smart Projects</h3>
                            <p className="text-zinc-400 text-base leading-relaxed mb-6 flex-1">
                                Build real-world projects that adapt to your skill level and career goals. Each project is designed to
                                challenge and grow your abilities.
                            </p>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-zinc-300">
                                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                                    Portfolio-ready projects
                                </div>
                                <div className="flex items-center gap-2 text-sm text-zinc-300">
                                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                                    Industry-standard tools
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Progress Tracking */}
                    <div className="md:col-span-6 lg:col-span-3 bg-zinc-900 border border-zinc-700/50 rounded-2xl p-6 group hover:border-zinc-600/50 transition-all duration-300 relative overflow-hidden">
                        <div className="absolute -top-5 -right-5 w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-full blur-lg"></div>
                        <div className="relative z-10 h-full flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-cyan-500/20 rounded-lg">
                                        <TrendingUp className="w-6 h-6 text-cyan-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white">Progress You Can See</h3>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-cyan-400">87%</div>
                                    <div className="text-xs text-zinc-400">Completion</div>
                                </div>
                            </div>
                            <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                                Track your learning journey with detailed analytics and milestone celebrations.
                            </p>
                            <div className="w-full bg-zinc-800 rounded-full h-2">
                                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full w-[87%]"></div>
                            </div>
                        </div>
                    </div>

                    {/* Certificates */}
                    <div className="md:col-span-3 lg:col-span-3 bg-zinc-900 border border-zinc-700/50 rounded-2xl p-6 group hover:border-zinc-600/50 transition-all duration-300 relative overflow-hidden">
                        <div className="absolute -bottom-5 -right-5 w-16 h-16 bg-gradient-to-tl from-yellow-500/20 to-transparent rounded-full blur-lg"></div>
                        <div className="relative z-10 h-full flex flex-col">
                            <div className="p-2 bg-yellow-500/20 rounded-lg w-fit mb-4">
                                <Award className="w-6 h-6 text-yellow-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-3">Industry Certificates</h3>
                            <p className="text-zinc-400 text-sm leading-relaxed flex-1">
                                Earn recognized certifications that employers actually value.
                            </p>
                        </div>
                    </div>

                    {/* Community Learning */}
                    <div className="md:col-span-3 lg:col-span-3 bg-zinc-900 border border-zinc-700/50 rounded-2xl p-6 group hover:border-zinc-600/50 transition-all duration-300 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/5 to-transparent"></div>
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-indigo-500/20 rounded-lg">
                                        <BookOpen className="w-6 h-6 text-indigo-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white">Community Learning</h3>
                                </div>
                                <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                                    Learn alongside thousands of motivated students in our active community.
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                className="w-fit bg-transparent border-zinc-600 text-zinc-300 hover:bg-zinc-800 hover:text-white hover:border-zinc-500"
                            >
                                Join Community
                            </Button>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center mt-16">
                    <Button
                        size="lg"
                        className="bg-white text-black hover:bg-gray-100 text-lg px-10 py-4 rounded-xl font-semibold"
                    >
                        Start Your Journey Today
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                </div>
            </div>
        </section>
    )
}
