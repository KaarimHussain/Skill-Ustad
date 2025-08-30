"use client";
import { ArrowUpRight, Building2, Users, Lightbulb } from "lucide-react";
import style from "@/css/Hero.module.css";
import { GridPattern } from "@/components/magicui/grid-pattern";
import { Link } from "react-router-dom";
import { Announcement, AnnouncementTag, AnnouncementTitle } from "@/components/ui/kibo-ui/announcement";

export default function CompanyHome() {
    return (
        <div className="min-h-[100vh] w-full relative overflow-hidden bg-black/30">
            {/* Animated Grid Background */}
            <GridPattern x={-1} y={-1} height={70} width={70} />

            {/* Light Path Effects (same as user panel) */}
            <div className={style.lightPathContainer}>
                <div className={style.lightPath1}></div>
                <div className={style.lightPath2}></div>
                <div className={style.lightPath3}></div>
            </div>

            <main className={`${style.heroSection} px-4 sm:px-6`}>
                {/* Announcement Tip */}
                <Announcement className="cursor-pointer" variant={"secondary"}>
                    <AnnouncementTag>For Companies</AnnouncementTag>
                    <AnnouncementTitle>
                        Empower your team with future-ready skills 🚀
                    </AnnouncementTitle>
                </Announcement>

                {/* Main Heading */}
                <div className="text-white text-center flex flex-col items-center">
                    <h1 className="lg:text-7xl md:text-5xl sm:text-3xl text-4xl font-bold lg:my-5 md:my-4 sm:my-2 my-2 text-black flex flex-col sm:flex-row items-center justify-center gap-1 text-nowrap">
                        <div className="font-2">Scale With </div>
                        <span className="bg-indigo-500 rounded-full md:px-7 md:py-4 sm:px-4 sm:py-2 px-3 py-1 text-white lg:text-6xl md:text-5xl sm:text-3xl text-4xl font-2">Skilled Talent</span>
                    </h1>
                    <span className="bg-indigo-500 rounded-2xl px-4 py-2 sm:px-6 sm:py-3 text-xl sm:text-3xl font-light inline-block text-white">
                        Train. Hire. Grow.
                    </span>
                </div>

                {/* Subtitles */}
                <div className="my-5 px-2 sm:px-4">
                    <div className="max-w-[700px] mx-auto text-center">
                        <p className="text-white text-base sm:text-lg mb-2 leading-relaxed">
                            Skill-Ustad helps companies build high-performing teams through AI-powered learning, skill assessments, and access to a vetted talent pool.
                        </p>
                        <p className="flex flex-wrap gap-2 items-center justify-center mt-3">
                            <span className="inline-block rounded-full px-3 py-1 text-sm font-medium bg-indigo-800/20 text-white border border-indigo-500 shadow-sm whitespace-nowrap">
                                Upskill employees
                            </span>
                            <span className="inline-block rounded-full px-3 py-1 text-sm font-medium bg-indigo-800/20 text-white border border-indigo-500 shadow-sm whitespace-nowrap">
                                Hire faster
                            </span>
                            <span className="inline-block rounded-full px-3 py-1 text-sm font-medium bg-indigo-800/20 text-white border border-indigo-500 shadow-sm whitespace-nowrap">
                                Close skill gaps
                            </span>
                        </p>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-center w-full px-4">
                    <Link
                        to="/company/register"
                        className={`${style.heroButtonPrimary} ${style.heroButton} group w-full sm:w-auto cursor-pointer`}
                    >
                        Get Started
                        <div className="icon-arrow transition-transform duration-300">
                            <ArrowUpRight size={20} />
                        </div>
                    </Link>

                    <Link
                        to="/companies/talent-hub"
                        className={`${style.heroButtonSecondary} ${style.heroButton} group w-full sm:w-auto cursor-pointer flex items-center gap-1`}
                    >
                        <div className="icon-sparkle transition-transform duration-300 group-hover:rotate-12">
                            <Users size={20} />
                        </div>
                        Explore Talent
                    </Link>
                </div>

                {/* Optional: Icons Row for Visual Interest */}
                <div className="flex items-center justify-center gap-8 mt-12 text-white/70">
                    <div className="flex items-center gap-2 text-sm">
                        <Building2 size={18} />
                        <span>For Enterprises</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Lightbulb size={18} />
                        <span>Innovation-Driven</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Users size={18} />
                        <span>Talent Pipeline</span>
                    </div>
                </div>
            </main>
        </div>
    );
}