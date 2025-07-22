import { useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Lenis from '@studio-freight/lenis'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'

import Home from './views/Home'
import Login from './views/Login'
import Signup from './views/Signup'
import OTPVerification from './views/OTPVerification'
import VoiceInterviewSimulator from './views/InterviewSimulator'
import ToolsView from './views/AI/Tools'

function App() {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // custom easing
      smoothWheel: true,
      syncTouch: false,
      orientation: 'vertical',
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    lenisRef.current = lenis

    return () => {
      lenis.destroy()
    }
  }, [])

  return (
    <Router>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/otp" element={<OTPVerification />} />
        <Route path="/ai/interview" element={<VoiceInterviewSimulator />} />
        <Route path="/ai/tools" element={<ToolsView />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App
