import { HeaderSection } from "./HeaderTitle";
import { Route, Brain, Users } from "lucide-react";
import {  BookOpen, BadgeCheck, Share2 } from "lucide-react";

const features = [
    {
        title: "Roadmap Builder",
        coverImage: "/images/Roadmap.png",
        description: "Create and customize your personal learning roadmap to achieve your goals efficiently and effectively.",
        icon: Route
    },
    {
        title: "AI Interview Simulator",
        coverImage: "/images/AI-Interview-Simulator.png",
        description: "Sharpen your interview skills with realistic, AI-driven mock interviews and instant feedback.",
        icon: Brain
    },
    {
        title: "Community",
        coverImage: "/images/community.png",
        description: "Connect, collaborate, and grow with a supportive network of learners and professionals.",
        icon: Users
    },
    {
        title: "Course Generation",
        coverImage: "/images/course-generation.png",
        description: "Generate tailored courses based on your interests and career objectives.",
        icon: BookOpen
    },
    {
        title: "Real-Time Collaboration",
        coverImage: "/images/real-time-collaboration.png",
        description: "Work together with peers in real-time on projects, assignments, and study sessions.",
        icon: Share2
    },
    {
        title: "Certification's",
        coverImage: "/images/certifications.png",
        description: "Earn recognized certifications to validate your skills and boost your career prospects.",
        icon: BadgeCheck
    },
]

export default function ProductFeatures() {
    return (
        <div className="min-h-screen w-full py-10 md:py-20 container px-5 md:px-10 lg:px-20 mx-auto">
            <HeaderSection title="Features that we provide" description="Explore the unique features of our product." highlightText="Features" variant="dark" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-10">
                {features.map((data, index) => (
                    <DotCard
                        key={index}
                        title={data.title}
                        description={data.description}
                        icon={data.icon}
                    />
                ))}
            </div>
        </div>
    );
};


export function DotCard({
    title,
    description,
    icon: Icon
}: {
    title: string;
    description: string;
    icon: any
}) {
    return (
        <div className="relative mx-auto w-full px-4 sm:px-6 md:px-8 dark:border-zinc-800 group">
            <div className="absolute top-4 left-0 -z-0 h-px w-full bg-zinc-400 sm:top-6 md:top-8 dark:bg-zinc-700 group-hover:bg-indigo-500 transition-colors duration-300" />
            <div className="absolute bottom-4 left-0 z-0 h-px w-full bg-zinc-400 sm:bottom-6 md:bottom-8 dark:bg-zinc-700 group-hover:bg-indigo-500 transition-colors duration-300" />
            <div className="relative w-full border-x border-zinc-400 dark:border-zinc-700 group-hover:border-indigo-500 transition-colors duration-300">
                <div className="absolute z-0 grid h-full w-full items-center">
                    <section className="absolute z-0 grid h-full w-full grid-cols-2 place-content-between">
                        <div className="bg-primary my-4 size-1 -translate-x-[2.5px] rounded-full outline-8 outline-gray-50 sm:my-6 md:my-8 dark:outline-gray-950 group-hover:bg-indigo-500" />
                        <div className="bg-primary my-4 size-1 translate-x-[2.5px] place-self-end rounded-full outline-8 outline-gray-50 sm:my-6 md:my-8 dark:outline-gray-950 group-hover:bg-indigo-500" />
                        <div className="bg-primary my-4 size-1 -translate-x-[2.5px] rounded-full outline-8 outline-gray-50 sm:my-6 md:my-8 dark:outline-gray-950 group-hover:bg-indigo-500" />
                        <div className="bg-primary my-4 size-1 translate-x-[2.5px] place-self-end rounded-full outline-8 outline-gray-50 sm:my-6 md:my-8 dark:outline-gray-950 group-hover:bg-indigo-500" />
                    </section>
                </div>
                <div className="relative z-20 mx-auto py-8">
                    <div className="p-6">
                        <div className="mb-4 flex items-center justify-start">
                            <Icon className="h-8 w-8 text-gray-600 dark:text-gray-400 group-hover:text-indigo-500 transition-colors duration-300" />
                        </div>
                        <h3 className="mb-1 text-2xl font-extralight text-gray-900 dark:text-gray-100 group-hover:text-indigo-500 transition-colors duration-300">
                            {title}
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300">
                            {description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}