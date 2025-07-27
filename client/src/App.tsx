import { useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Lenis from '@studio-freight/lenis'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'

import Home from './views/Home'
import Login from './views/Auth/Login'
import Signup from './views/Auth/Signup'
import OTPVerification from './views/Auth/OTPVerification'
import VoiceInterviewSimulator from './views/InterviewSimulator'
import ToolsView from './views/AI/Tools'
import ForgetPassword from './views/Auth/ForgetPassword'
import UserDashboard from './views/User/Dashboard'
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_KEY_TWO;

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
    <GoogleOAuthProvider clientId={googleClientId}>
      <Router>
        <ScrollToTop />
        <Navbar />
        <Routes>
          {/* Public URL */}
          <Route path="/" element={<Home />} />
          <Route path="/ai/interview" element={<VoiceInterviewSimulator />} />
          <Route path="/ai/tools" element={<ToolsView />} />
          {/* Auth URL */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/otp" element={<OTPVerification />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          {/* LoggedIn User URL */}
          <Route path="/user/dashboard" element={<UserDashboard />} />

          {/* LoggedIn Mentor URL */}
          <Route path="/mentor/dashboard" element={<UserDashboard />} />

          {/* LoggedIn Companies URL */}
        </Routes>
        <Footer />
      </Router>
    </GoogleOAuthProvider>
  )
}

export default App
