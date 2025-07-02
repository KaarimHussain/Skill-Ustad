"use client"

import { Check, ArrowRight, Sparkles, Users, Award, Brain, Code, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const keyPoints = [
    {
        text: "Learn job-ready skills",
        icon: Target,
    },
    {
        text: "Personalized AI learning",
        icon: Brain,
    },
    {
        text: "Real-world projects & mentorship",
        icon: Code,
    },
    {
        text: "Industry-recognized certificates",
        icon: Award,
    },
    {
        text: "Lifetime access to content",
        icon: Check,
    },
    {
        text: "Active community support",
        icon: Users,
    },
]

const finalStats = [
    { number: "50,000+", label: "Happy Learners" },
    { number: "92%", label: "Success Rate" },
    { number: "40+", label: "Expert Mentors" },
]

export default function ReadyToLearn() {
    return (
        <section className="bg-gradient-to-br from-black via-zinc-900 to-black py-20 px-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
                    style={{ animationDelay: "2s" }}
                ></div>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">Ready to Learn Smarter?</h2>
                    </div>
                    <p className="text-zinc-300 text-lg md:text-xl max-w-4xl mx-auto leading-relaxed">
                        Skill Smoker brings you AI-powered learning, real projects, and mentor guidance — all in one place.
                        <br />
                        Whether you're starting fresh or leveling up, your journey begins here.
                    </p>
                </div>

                {/* Key Points Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
                    {keyPoints.map((point) => (
                        <div
                            key={point.text}
                            className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-700/50 hover:bg-zinc-800/50 hover:border-zinc-600/50 transition-all duration-300 group"
                        >
                            <div className="p-2 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors">
                                <point.icon className="w-5 h-5 text-green-400" />
                            </div>
                            <span className="text-white font-medium">{point.text}</span>
                        </div>
                    ))}
                </div>

                {/* Stats Row */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-16">
                    {finalStats.map((stat) => (
                        <div key={stat.label} className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.number}</div>
                            <div className="text-zinc-400 text-sm">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Main CTA Card */}
                <Card className="bg-gradient-to-r from-zinc-900 to-zinc-800 border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-300 mb-12">
                    <CardContent className="p-8 md:p-12 text-center">
                        <div className="max-w-3xl mx-auto">
                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Your Future Self Will Thank You</h3>
                            <p className="text-zinc-300 text-lg mb-8 leading-relaxed">
                                Don't let another year pass wondering "what if." Join thousands of learners who've already transformed
                                their careers. Your success story starts with a single click.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                                <Button
                                    size="lg"
                                    className="bg-indigo-500 hover:bg-indigo-600 cursor-pointer text-white text-lg px-8 py-4"
                                >
                                    Start Learning Now
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </div>

                            {/* Trust Indicators */}
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-zinc-400 text-sm">
                                <div className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-green-400" />
                                    <span>No credit card required</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-green-400" />
                                    <span>Start learning immediately</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-green-400" />
                                    <span>Cancel anytime</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Final Social Proof */}
                <div className="text-center">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-zinc-400">
                        <div className="flex items-center gap-3">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div
                                        key={i}
                                        className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 border-2 border-black"
                                    />
                                ))}
                            </div>
                            <span className="text-sm">Join 50,000+ learners worldwide</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-sm">2,847 people joined this week</span>
                        </div>
                    </div>

                    
                </div>
            </div>
        </section>
    )
}
