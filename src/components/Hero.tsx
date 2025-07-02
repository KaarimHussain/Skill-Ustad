import clsx from "clsx";
import style from "../css/Hero.module.css";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export default function HeroComponent() {
    return (
        <main className="relative min-h-[100vh] w-full flex items-center justify-center overflow-hidden bg-zinc-900">
            <BackgroundBall />
            <div className={clsx("flex gap-1 flex-col items-center justify-center z-70", style.mainTextFade)}>
                {/* Tops Notification */}
                <span className="flex gap-3 items-center" >
                    <div className="h-[3px] w-[20px] bg-gradient-to-r from-zinc-200 to-zinc-600"></div>
                    <small className="text-sm flex gap-2 items-center">
                        <span className="text-zinc-500">
                            Skill-Ustad New Tool Launched
                        </span>
                        <div className="h-[20px] w-[2px] bg-zinc-600"></div>
                        <span className="text-zinc-100 font-medium hover:text-zinc-300 cursor-pointer hover:underline">
                            Discover whats new!
                        </span>
                    </small>
                    <div className="h-[3px] w-[20px] bg-gradient-to-l from-zinc-200 to-zinc-600"></div>
                </span>
                {/*  */}
                {/* Hero Title */}
                {/* TODO: Add randomize text*/}
                <h1 className="font-extralight text-7xl text-white">
                    Your Future, One <span className="text-indigo-400 italic font-semibold">Skill</span> Away
                </h1>
                {/*  */}
                {/* Text Description */}
                <p className="text-zinc-400 mt-3">We don't just teach, we empower you to build your future — faster.</p>
                {/*  */}
                <div className="my-10 flex items-center justify-center gap-5">
                    <Button className="bg-indigo-500 hover:bg-indigo-600 text-xl lg:py-[30px] rounded-2xl px-30 text-white hover:transform-[translateY(-5px)] cursor-pointer" style={{ padding: "30px 30px" }}>
                        Get Started
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                            <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 0 0 1.06 0l7.22-7.22v5.69a.75.75 0 0 0 1.5 0v-7.5a.75.75 0 0 0-.75-.75h-7.5a.75.75 0 0 0 0 1.5h5.69l-7.22 7.22a.75.75 0 0 0 0 1.06Z" clipRule="evenodd" />
                        </svg>
                    </Button>
                    <Button className="bg-zinc-200 hover:bg-zinc-400 text-xl lg:py-[30px] rounded-2xl px-30 text-black hover:transform-[translateY(-5px)] cursor-pointer" style={{ padding: "30px 30px" }}>
                        Explore Courses
                    </Button>
                </div>
            </div>
        </main>
    );
}

function BackgroundBall() {

    const [offset, setOffset] = useState(100);

    useEffect(() => {
        const handleScroll = () => {
            // Smooth parallax by limiting effect
            const scrollY = window.scrollY;
            setOffset(scrollY * 0.1); // 10% of scroll speed
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    return (
        <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
                transform: `translateY(${offset}px)`,
                transition: "transform 0.1s ease-out",
            }}
        >
            <div className={style.ballOuter}>
                <div className="aspect-square w-[70vw] rounded-full bg-black shadow-2xl"></div>
            </div>
        </div>
    );
}