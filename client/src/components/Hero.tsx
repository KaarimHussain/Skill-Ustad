"use client"

import { Button } from "@/components/ui/button"
import { GradientBars } from "@/components/ui/gradient-bars"
import { TextReveal } from "@/components/ui/text-reveal"

export function Hero() {
    return (
        <section
            aria-label="Hero"
            className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden"
        >
            <div className="mx-auto max-w-7xl px-6 sm:px-8">
                {/* Background */}
                <GradientBars
                    colors={[
                        "#6366f1", // indigo-500
                        "transparent", // indigo-900
                    ]}
                />
                <header className="relative z-10">
                    {/* Announcement pill */}
                    <div className="flex justify-center">
                        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1.5 text-xs text-muted-foreground">
                            <span className="h-2 w-2 rounded-full bg-primary" />
                            Learn faster with AI guidance
                        </span>
                    </div>

                    {/* Headline */}
                    <div className="mx-auto mt-6 max-w-3xl text-center">
                        <h1 className="text-pretty font-sans text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                            <TextReveal from="bottom" duration={1}>
                                Master job‑ready skills
                            </TextReveal>
                            <TextReveal from="bottom" duration={1.1}>
                                and build a portfolio that hires.
                            </TextReveal>
                        </h1>

                        {/* Subheadline */}
                        <p className="mt-5 text-balance text-base leading-relaxed text-gray-900 dark:text-gray-100 sm:text-lg drop-shadow-sm">
                            Project-based learning paths with checkpoints, feedback, and real outcomes. Guided by AI. Built for
                            momentum. Designed to get you hired.
                        </p>

                        {/* Mini brand line */}
                        <div className="mt-6 flex justify-center">
                            <span className="rounded-full bg-indigo-500/90 px-4 py-2 text-sm font-medium text-white shadow-md backdrop-blur">
                                Build. Launch. Grow.
                            </span>
                        </div>

                        {/* CTAs */}
                        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                            <Button className="bg-indigo-500 hover:bg-indigo-600 w-full sm:w-auto" size="lg">
                                Get Started
                            </Button>
                            <Button variant="secondary" className="w-full sm:w-auto" size="lg">
                                Browse roadmaps
                            </Button>
                        </div>
                    </div>
                </header>
            </div>
        </section>
    )
}

export default Hero
