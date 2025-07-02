// SmoothScroll.jsx
import { useEffect } from 'react'
import Lenis from '@studio-freight/lenis'

export default function SmoothScroll() {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth af
            smoothWheel: true,
        })

        const raf = (time: number) => {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)

        return () => {
            lenis.destroy()
        }
    }, [])

    return null
}
