"use client"
import type React from "react"
import { ArrowRight, BarChart2, User, Users } from "lucide-react"

/* ------------------------------------------------------------------ */
/*  1.  NEW BENTO GRID COMPONENT (paste your creation here)           */
/* ------------------------------------------------------------------ */
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Code, Layers, Zap } from "lucide-react"
import { HeaderSection } from "./HeaderTitle"

interface BentoGridItemProps {
    title: string
    description: string
    icon: React.ReactNode
    className?: string
    size?: "small" | "medium" | "large"
}

const BentoGridItem = ({
    title,
    description,
    icon,
    className,
}: BentoGridItemProps) => {
    const variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring" as const, damping: 25 },
        },
    }

    return (
        <motion.div
            variants={variants}
            className={cn(
                "group border-indigo-100 bg-background hover:border-indigo-300 relative flex h-full cursor-pointer flex-col justify-between overflow-hidden rounded-xl border px-6 pt-6 pb-10 shadow-md transition-all duration-500",
                className
            )}
        >
            <div className="absolute top-0 -right-1/2 z-0 size-full cursor-pointer bg-[linear-gradient(to_right,#3d16165e_1px,transparent_1px),linear-gradient(to_bottom,#3d16165e_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-[size:24px_24px]" />
            <div className="text-indigo-100 group-hover:text-indigo-200 absolute right-1 bottom-3 scale-[6] transition-all duration-700 group-hover:scale-[6.2]">
                {icon}
            </div>

            <div className="relative z-10 flex h-full flex-col justify-between">
                <div>
                    <div className="bg-indigo-100 text-indigo-600 shadow-indigo-100 group-hover:bg-indigo-200 group-hover:shadow-indigo-200 mb-4 flex h-12 w-12 items-center justify-center rounded-full shadow transition-all duration-500">
                        {icon}
                    </div>
                    <h3 className="mb-2 text-xl font-semibold tracking-tight">{title}</h3>
                    <p className="text-muted-foreground text-sm">{description}</p>
                </div>
                <div className="text-indigo-600 mt-4 flex items-center text-sm">
                    <span className="mr-1">Learn more</span>
                    <ArrowRight className="size-4 transition-all duration-500 group-hover:translate-x-2" />
                </div>
            </div>
            <div className="from-indigo-500 to-indigo-300 absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r blur-2xl transition-all duration-500 group-hover:blur-lg" />
        </motion.div>
    )
}

const items = [
    {
        title: "AI-Powered Learning",
        description: "Personalized paths and instant feedback with AI.",
        icon: <Zap className="size-6" />, // Zap for AI/automation
        size: "large" as const,
    },
    {
        title: "Skill-Focused Tracks",
        description: "Structured paths for your career goals.",
        icon: <Layers className="size-6" />, // Layers for tracks/structure
        size: "small" as const,
    },
    {
        title: "Expert Mentor Access",
        description: "Guidance from industry professionals.",
        icon: <User className="size-6" />, // User for mentors
        size: "medium" as const,
    },
    {
        title: "Smart Projects",
        description: "Build real-world, adaptive projects.",
        icon: <Code className="size-6" />, // Code for projects
        size: "medium" as const,
    },
    {
        title: "Progress You Can See",
        description: "Track your journey with analytics.",
        icon: <BarChart2 className="size-6" />, // BarChart2 for progress
        size: "small" as const,
    },
    {
        title: "Community Learning",
        description: "Learn with a motivated community.",
        icon: <Users className="size-6" />, // Users for community
        size: "large" as const,
    },
]

const BentoGrid1 = () => {
    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.12,
                delayChildren: 0.1,
            },
        },
    }

    return (
        <div className="mx-auto max-w-6xl px-4 py-12">
            <motion.div
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {items.map((item, i) => (
                    <BentoGridItem
                        key={i}
                        title={item.title}
                        description={item.description}
                        icon={item.icon}
                        size={item.size}
                        className={cn(
                            item.size === "large"
                                ? "col-span-4"
                                : item.size === "medium"
                                    ? "col-span-3"
                                    : "col-span-2",
                            "h-full"
                        )}
                    />
                ))}
            </motion.div>
        </div>
    )
}
/* ------------------------------------------------------------------ */
/*  3.  MAIN EXPORTED SECTION                                         */
/* ------------------------------------------------------------------ */
export default function Benefits() {
    return (
        <section className="relative min-h-screen w-full flex flex-col items-center justify-center py-20 px-4 overflow-hidden"
        >
            <div className="relative z-20 max-w-7xl mx-auto w-full">
                {/* Header */}
                <HeaderSection
                    title="Why Choose Our Platform?"
                    description="Empower your learning journey with features designed for success."
                    highlightText="Benefits"
                    variant="dark"
                />

                {/* NEW BENTO GRID */}
                <BentoGrid1 />
            </div>

            {/* Bottom gradient fade for next section */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        </section>
    )
}