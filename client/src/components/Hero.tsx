"use client";
import { ArrowUpRight, Sparkle } from "lucide-react";
import style from "../css/Hero.module.css";
import { GridPattern } from "./magicui/grid-pattern";
import { Link } from "react-router-dom";
import { Announcement, AnnouncementTag, AnnouncementTitle } from "./ui/kibo-ui/announcement";

export default function HeroComponent() {
    return (
        <div className="min-h-[100vh] w-full relative overflow-hidden bg-black/30">
            <GridPattern x={-1} y={-1} height={70} width={70} />

            <div className={style.lightPathContainer}>
                <div className={style.lightPath1}></div>
                <div className={style.lightPath2}></div>
                <div className={style.lightPath3}></div>
            </div>

            <main className={`${style.heroSection} px-4 sm:px-6`}>
                {/* Hero Tip */}

                <Announcement className="cursor-pointer" variant={"secondary"}>
                    <AnnouncementTag>Learn Fast</AnnouncementTag>
                    <AnnouncementTitle>
                        Build skills that make you money 💸
                    </AnnouncementTitle>
                </Announcement>

                {/* Main Heading */}
                <div className="text-white text-center flex flex-col items-center">
                    <h1 className="lg:text-7xl md:text-5xl sm:text-3xl text-4xl font-bold lg:my-5 md:my-4 sm:my-2 my-2 text-black flex items-center justify-center gap-1 text-nowrap"><div className="font-2">Master In-Demand </div>
                        <span className="bg-indigo-500 rounded-full md:px-7 md:py-4 sm:px-4 sm:py-2 px-3 py-1 text-white lg:text-6xl md:text-5xl sm:text-3xl text-4xl font-2">Skills</span></h1>
                    <span className="bg-indigo-500 rounded-2xl px-4 py-2 sm:px-6 sm:py-3 text-xl sm:text-3xl font-light inline-block">
                        Build. Launch. Grow.
                    </span>
                </div>

                {/* Subtitles */}
                <div className="my-5 px-2 sm:px-4">
                    <div className="max-w-[700px] mx-auto text-center">
                        <p className="text-white text-base sm:text-lg mb-2 leading-relaxed">
                            Skill-Ustad is your AI-powered skill-building platform — learn, create, and grow with project-based courses designed for real-world results.
                        </p>
                        <p className="flex gap-2 items-center justify-center">
                            <span className="inline-block rounded-full px-3 py-1 text-sm font-medium bg-indigo-800/20 text-white border border-indigo-500 shadow-sm">
                                Start free.
                            </span>
                            <span className="inline-block rounded-full px-3 py-1 text-sm font-medium bg-indigo-800/20 text-white border border-indigo-500 shadow-sm">Build fast.</span>
                            <span className="inline-block rounded-full px-3 py-1 text-sm font-medium bg-indigo-800/20 text-white border border-indigo-500 shadow-sm">Upskill for the future.</span>
                        </p>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-center w-full px-4">
                    <Link to={"/signup"} className={`${style.heroButtonPrimary} ${style.heroButton} group w-full sm:w-auto cursor-pointer`}>
                        Start Learning — It’s Free
                        <div className="icon-arrow transition-transform duration-300">
                            <ArrowUpRight size={20} />
                        </div>
                    </Link>

                    <Link to={"/public/roadmaps"} className={`${style.heroButtonSecondary} ${style.heroButton} group w-full sm:w-auto cursor-pointer`}>
                        <div className="icon-sparkle transition-transform duration-300 group-hover:rotate-12">
                            <Sparkle size={20} />
                        </div>
                        Browse Roadmaps
                    </Link>
                </div>

            </main>
        </div>
    );
}
