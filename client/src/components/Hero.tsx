"use client";
import { ArrowUpRight, Sparkle } from "lucide-react";
import style from "../css/Hero.module.css";
import { GridPattern } from "./magicui/grid-pattern";
import { Link } from "react-router-dom";

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
                <div className={`${style.heroTip} ps-1 py-1 pe-3 mb-4 flex-wrap justify-center`}>
                    <div className="bg-white px-3 sm:mb-0 me-3 rounded-full text-black text-sm sm:text-base">
                        Learn Fast
                    </div>
                    <span className="text-white/95 text-sm sm:text-base text-center">
                        Build skills that make you money 💸
                    </span>
                </div>

                {/* Main Heading */}
                <div className="text-white text-center">
                    <h1 className="font-semibold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight mb-3">
                        Master In-Demand Skills.
                    </h1>
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

                    <Link to={"/"} className={`${style.heroButtonSecondary} ${style.heroButton} group w-full sm:w-auto cursor-pointer`}>
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
