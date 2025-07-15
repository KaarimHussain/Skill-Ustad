"use client"

import { motion } from "motion/react"

interface StatusIndicatorProps {
    status: 'listening' | 'processing' | 'speaking' | 'ready'
}

const statusConfig = {
    listening: {
        text: "Listening...",
        color: "text-primary",
        bgColor: "bg-secondary/30"
    },
    processing: {
        text: "Processing...",
        color: "text-orange-500",
        bgColor: "bg-orange-50"
    },
    speaking: {
        text: "Speaking...",
        color: "text-green-500",
        bgColor: "bg-green-50"
    },
    ready: {
        text: "Ready",
        color: "text-muted-foreground",
        bgColor: "bg-muted/30"
    }
}

export default function StatusIndicator({ status }: StatusIndicatorProps) {
    const config = statusConfig[status]

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-background"
        >
            <motion.div
                key={status}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className={`
          inline-flex items-center gap-2 px-3 py-1.5 rounded-full
          ${config.bgColor}
          border border-border/50
          backdrop-blur-sm
          transition-all duration-300
          bg-background
        `}
            >
                <motion.div
                    animate={status === 'listening' || status === 'processing' ? {
                        scale: [1, 1.2, 1],
                        opacity: [1, 0.6, 1]
                    } : {}}
                    transition={{
                        duration: 1.5,
                        repeat: status === 'listening' || status === 'processing' ? Infinity : 0,
                        ease: "easeInOut"
                    }}
                    className={`
            w-2 h-2 rounded-full
            ${status === 'listening' ? 'bg-primary' :
                            status === 'processing' ? 'bg-orange-500' :
                                status === 'speaking' ? 'bg-green-500' :
                                    'bg-muted-foreground'}
          `}
                />

                <span className={`
          text-sm font-medium tracking-wide
          ${config.color}
          transition-colors duration-300
        `}>
                    {config.text}
                </span>
            </motion.div>
        </motion.div>
    )
}