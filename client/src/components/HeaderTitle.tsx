import { cn } from "@/lib/utils"

const VARIANT_STYLES = {
    dark: {
        bgText: "text-gray-200/10 opacity-10",
        stroke: "#000",
        title: "text-gray-900",
        desc: "text-gray-600",
    },
    light: {
        bgText: "text-gray-900/10 opacity-30",
        stroke: "#fff",
        title: "text-gray-100",
        desc: "text-gray-200",
    },
}

type HeaderSectionProps = {
    title: string
    description: string
    highlightText?: string
    variant?: "dark" | "light"
}

export const HeaderSection = ({
    title,
    description,
    highlightText,
    variant = "light",
}: HeaderSectionProps) => {
    const styles = VARIANT_STYLES[variant]

    return (
        <div className="container mx-auto relative pb-10">
            {highlightText && (
                <div>
                    <h2
                        className={cn(
                            "text-5xl sm:text-6xl md:text-7xl lg:text-8xl absolute -top-6 sm:-top-8 md:-top-10 left-1/2 -translate-x-1/2 whitespace-nowrap font-extrabold text-transparent select-none pointer-events-none text-center uppercase",
                            styles.bgText
                        )}
                        style={{
                            WebkitTextStroke: `2px ${styles.stroke}`,
                        }}
                        aria-hidden="true"
                    >
                        {highlightText}
                    </h2>
                    <div className="border border-indigo-200 my-3 max-w-md mx-auto"></div>
                </div>
            )}

            <div className="text-center relative z-10">
                <div className="animate-fade-in-up">
                    <h1
                        className={cn(
                            "font-bold text-3xl sm:text-4xl md:text-6xl mb-3 sm:mb-4",
                            styles.title
                        )}
                    >
                        {title}
                    </h1>
                    <p
                        className={cn(
                            "text-base sm:text-lg md:text-xl max-w-xs sm:max-w-2xl md:max-w-3xl mx-auto leading-relaxed",
                            styles.desc
                        )}
                    >
                        {description}
                    </p>
                </div>
            </div>
        </div>
    )
}