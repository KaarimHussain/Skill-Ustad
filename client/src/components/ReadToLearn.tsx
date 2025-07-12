"use client"
import { Check, ArrowRight, Sparkles, Users, Award, Brain, Code, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { memo } from "react"

// Background elements matching hero theme
const ReadyToLearnBackground = memo(() => (
    <>
        {/* Gradient background matching hero */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-purple-50 to-indigo-100" />

        {/* Light rays effect similar to hero */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[25%] right-[-12%] rotate-[40deg] blur-[55px] flex gap-12">
                <div
                    className="h-[480px] w-[130px] rounded-full bg-white/55 animate-pulse"
                    style={{ animationDuration: "9s", animationDelay: "0.6s" }}
                />
                <div
                    className="h-[680px] w-[170px] rounded-full bg-white/75 animate-pulse"
                    style={{ animationDuration: "12s", animationDelay: "1.4s" }}
                />
                <div
                    className="h-[420px] w-[95px] rounded-full bg-white/65 animate-pulse"
                    style={{ animationDuration: "10s", animationDelay: "0.9s" }}
                />
            </div>
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
            <div
                className="h-full w-full"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.4) 1px, transparent 1px)
          `,
                    backgroundSize: "50px 50px",
                }}
            />
        </div>

        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-indigo-200/30 via-purple-200/20 to-transparent rounded-full blur-3xl animate-pulse pointer-events-none" />
        <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-tl from-purple-200/25 via-blue-200/15 to-transparent rounded-full blur-3xl animate-pulse pointer-events-none"
            style={{ animationDelay: "2s" }}
        />
    </>
))

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
        <section className="relative py-20 px-4 overflow-hidden">
            <ReadyToLearnBackground />

            <div className="relative z-10 max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">Ready to Learn Smarter?</h2>
                    </div>
                    <p className="text-gray-600 text-lg md:text-xl max-w-4xl mx-auto leading-relaxed">
                        Skill-Ustad brings you AI-powered learning, real projects, and mentor guidance — all in one place.
                        <br />
                        Whether you're starting fresh or leveling up, your journey begins here.
                    </p>
                </div>

                {/* Key Points Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
                    {keyPoints.map((point, index) => (
                        <div
                            key={point.text}
                            className="flex items-center gap-4 p-4 rounded-xl bg-white/70 backdrop-blur-sm border border-white/60 hover:bg-white/80 hover:border-white/80 transition-all duration-300 group hover:shadow-lg hover:shadow-indigo-100/50"
                            style={{
                                boxShadow: "0 4px 20px rgba(99, 102, 241, 0.08)",
                            }}
                        >
                            <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                                <point.icon className="w-5 h-5 text-green-600" />
                            </div>
                            <span className="text-gray-900 font-medium">{point.text}</span>
                        </div>
                    ))}
                </div>

                {/* Stats Row */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-16">
                    {finalStats.map((stat, index) => (
                        <div key={stat.label} className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">{stat.number}</div>
                            <div className="text-gray-600 text-sm">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Main CTA Card */}
                <Card
                    className=" mb-12"
                    style={{
                        boxShadow: "0 20px 60px rgba(99, 102, 241, 0.15)",
                    }}
                >
                    <CardContent className="p-8 md:p-12 text-center relative overflow-hidden">
                        {/* Background gradient overlay */}
                        <div className="absolute"></div>

                        <div className="relative z-10 max-w-3xl mx-auto">
                            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Your Future Self Will Thank You</h3>
                            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                                Don't let another year pass wondering "what if." Join thousands of learners who've already transformed
                                their careers. Your success story starts with a single click.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                                <Button
                                    size="lg"
                                    className="bg-indigo-500 hover:bg-indigo-600 text-white text-xl px-10 py-6 rounded hover:shadow-indigo-500/25 transform hover:-translate-y-1 transition-all duration-300 group"
                                >
                                    Start Learning Now
                                    <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-2 border-gray-300 text-gray-700 hover:bg-white hover:text-gray-900 hover:border-gray-400 text-xl px-10 py-6 rounded bg-white/60 backdrop-blur-sm hover:scale-105 transition-all duration-300"
                                >
                                    Join Skill-Ustad Free
                                </Button>
                            </div>

                            {/* Trust Indicators */}
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-gray-600 text-sm">
                                <div className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-green-600" />
                                    <span>No credit card required</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-green-600" />
                                    <span>Start learning immediately</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-green-600" />
                                    <span>Cancel anytime</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Final Social Proof */}
                <div className="text-center">
                    <div className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl p-8 mb-8">
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                            <div className="flex items-center gap-3">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4, 5, 6].map((i) => (
                                        <div
                                            key={i}
                                            className="w-8 h-8 rounded-full bg-indigo-500 border-2 border-white shadow-lg"
                                        />
                                    ))}
                                </div>
                                <div className="text-left">
                                    <div className="font-bold text-gray-900">Join 50,000+ learners worldwide</div>
                                    <div className="text-sm text-gray-600">Growing community of achievers</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                                <div className="text-left">
                                    <div className="font-bold text-gray-900">2,847 people joined this week</div>
                                    <div className="text-sm text-gray-600">Join them today</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Final Tagline */}
                    <div className="pt-8 border-t border-gray-200">
                        <p className="text-gray-500 text-sm">
                            © 2024 Skill-Ustad. Empowering learners worldwide to build their future, one skill at a time.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
