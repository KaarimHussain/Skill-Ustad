"use client"

import type React from "react"
import { HeaderSection } from "@/components/HeaderTitle"
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect"
import { motion } from "framer-motion"

type StatCardProps = {
    title: string
    colors?: number[][]
}

export default function TrustedByLearners() {
    return (
        <section id="trusted-by-learners" aria-labelledby="trusted-by-learners-title" className="w-full  py-10 md:py-20 min-h-screen"
        >
            <div className="container mx-auto">
                {/* IMPORTANT: Do not modify HeaderSection component itself per the user's request */}
                <HeaderSection
                    title="Trusted by Learners Worldwide"
                    description="Join a community of learners who advance their careers with Skill Ustad."
                    highlightText="TRUSTED"
                    variant="dark"
                />
            </div>

            {/* Cards Grid */}
            <div className="container mx-auto max-w-6xl px-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    <StatCard title="10,000+ Learners" />
                    <StatCard title="500+ Courses" />
                    <StatCard title="4.9★ Avg. Rating" />
                </div>
            </div>
        </section>
    )
}

function StatCard({ title, colors }: StatCardProps) {
    // Indigo-focused palette only (no purple), matching white theme
    const indigoColors = colors ?? [
        [99, 102, 241], // Indigo 500
        [79, 70, 229], // Indigo 600
        [165, 180, 252], // Indigo 300
    ]

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="group relative overflow-hidden border border-border bg-card/50 h-[30rem] flex items-center flex-col justify-center"
            role="article"
        >
            {/* Hover reveal layer */}
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <CanvasRevealEffect
                    animationSpeed={0.6}
                    showGradient={false}
                    containerClassName="h-full w-full bg-primary/5"
                    colors={indigoColors}
                />
            </div>

            {/* Content */}
            <div className="relative z-10 p-8 md:p-10 flex flex-col items-center text-center">
                <div className="overflow-hidden">
                    <p className="text-balance text-4xl font-extralight text-foreground transition-all duration-500 group-hover:-translate-y-1 group-hover:text-primary text-nowrap">
                        {title}
                    </p>
                    <div className="mt-4 h-0.5 w-0 bg-primary transition-all duration-500 group-hover:w-full mx-auto" />
                </div>
            </div>

            {/* Focus ring and hover ring */}
            <div className="pointer-events-none absolute inset-0 ring-1 ring-border transition-[ring-color] duration-500 group-hover:ring-primary/50" />
        </motion.div>
    )
}
