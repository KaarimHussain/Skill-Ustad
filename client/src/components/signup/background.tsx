import { memo } from "react"

export const SignupBackground = memo(() => (
    <>
        {/* Solid light background instead of gradient */}
        <div className="absolute inset-0 bg-gray-50" />
        {/* Subtle geometric pattern overlay */}
        <div className="absolute inset-0 opacity-[0.04]">
            <div
                className="h-full w-full"
                style={{
                    backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.1) 2px, transparent 2px),
            radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.1) 1px, transparent 1px),
            linear-gradient(rgba(99, 102, 241, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.05) 1px, transparent 1px)
          `,
                    backgroundSize: "60px 60px, 40px 40px, 20px 20px, 20px 20px",
                    backgroundPosition: "0 0, 30px 30px, 0 0, 0 0",
                }}
            />
        </div>
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-[0.02]">
            <div
                className="h-full w-full"
                style={{
                    backgroundImage: `
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 2px,
              rgba(0, 0, 0, 0.01) 2px,
              rgba(0, 0, 0, 0.01) 4px
            )
          `,
                }}
            />
        </div>
        {/* Muted floating shapes */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-100/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-100/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/3 w-32 h-32 bg-blue-100/10 rounded-full blur-2xl" />
        {/* Subtle decorative elements */}
        <div className="absolute top-20 left-20 w-1 h-1 bg-gray-300 rounded-full opacity-40" />
        <div className="absolute top-40 right-32 w-0.5 h-0.5 bg-gray-400 rounded-full opacity-30" />
        <div className="absolute bottom-32 left-40 w-1 h-1 bg-gray-300 rounded-full opacity-35" />
        <div className="absolute bottom-20 right-20 w-1.5 h-1.5 bg-gray-400 rounded-full opacity-25" />
        {/* Subtle corner accents */}
        <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-gray-200/50 rounded-tl-3xl" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-gray-200/50 rounded-br-3xl" />
    </>
))

SignupBackground.displayName = "SignupBackground"
