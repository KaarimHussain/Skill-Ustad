// Core
import { useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from '@/context/AuthContext';
// Libraries
import Lenis from '@studio-freight/lenis'
// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Home from './views/Home';
import Login from './views/Auth/Login';
import Signup from './views/Auth/Signup';
import OTPVerification from './views/Auth/OTPVerification';
import VoiceInterviewSimulator from './views/AI/InterviewSimulator';
import ToolsView from './views/AI/Tools';
import ForgetPassword from './views/Auth/ForgetPassword';
import UserDashboard from './views/User/Dashboard';
// Routes
import ProtectedRoute from '@/routes/ProtectedRoute';
import PublicOnlyRoute from '@/routes/PublicOnlyRoute';
import ChatbotBuilder from './views/AI/ChatbotBuilder';
import GenerateRoadmap from './views/User/GenerateRoadmap';
import RoadmapProcessing from './views/User/RoadmapProcessing';
import RoadmapViewer from './views/RoadmapViewer';
import Profile from './views/User/Profile';
import Roadmap from './views/Roadmap';
import CourseGenerator from './views/User/CourseGenerator';
import { Toaster } from 'sonner';
import ResetPassword from './views/Auth/ResetPassword';
import NotFound from './views/404';
import Quiz from './views/User/Quiz';
import MentorDashboard from './views/Mentor/Dashboard';
import AddtionalInfo from './views/Mentor/AdditionalInfo';
import MentorProfile from './views/Mentor/Profile';
import CreateRoadmap from './views/Mentor/CreateRoadmap';
import MentorRoadmap from './views/Mentor/Roadmap';
import MentorBlog from './views/Mentor/Blog';
import MentorQuiz from './views/Mentor/Quiz';
import CreateQuiz from './views/Mentor/QuizCreation';
import EditQuiz from './views/Mentor/EditQuiz';
import ViewQuiz from './views/Mentor/ViewQuiz';
import UserAttemptQuiz from './views/User/QuizAttempt';
import MentorGenerateCourse from './views/Mentor/CreateCourse';
import MentorCourse from './views/Mentor/Course';
import MentorViewCourse from './views/Mentor/ViewCourse';

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
        <AuthProvider>
          <ScrollToTop />
          <Navbar />
          <Routes>
            {/* 🌐 Public URLs */}
            <Route path="/ai/interview" element={<VoiceInterviewSimulator />} />
            <Route path="/ai/tools" element={<ToolsView />} />
            <Route path="/ai/chatbot" element={<ChatbotBuilder />} />
            <Route path="/user/roadmap/:id" element={<RoadmapViewer />} />
            <Route path='/public/roadmaps' element={<Roadmap />} />

            {/* 🔒 Protected URLs */}

            {/* 👤 Auth URLs - public only if NOT logged in */}

            <Route path="/" element={
              <PublicOnlyRoute>
                <Home />
              </PublicOnlyRoute>}
            />

            <Route
              path="/login"
              element={
                <PublicOnlyRoute>
                  <Login />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicOnlyRoute>
                  <Signup />
                </PublicOnlyRoute>
              }
            />

            <Route
              path="/reset-password"
              element={
                <PublicOnlyRoute>
                  <ResetPassword />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/otp"
              element={
                <PublicOnlyRoute>
                  <OTPVerification />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/forget-password"
              element={
                <PublicOnlyRoute>
                  <ForgetPassword />
                </PublicOnlyRoute>
              }
            />

            {/* 🧑‍🎓 Student-only route */}
            <Route element={<ProtectedRoute allowedRoles={["Student"]} />}>
              <Route path="/user/dashboard" element={<UserDashboard />} />
              {/* Profile */}
              <Route path="/user/profile" element={<Profile />} />
              <Route path='/user/additional-info' element={<AddtionalInfo />} />
              {/* Roadmaps */}
              <Route path="/user/roadmap-gen" element={<GenerateRoadmap />} />
              <Route path="/user/process-roadmap" element={<RoadmapProcessing />} />
              {/* Courses */}
              <Route path="/user/course-generator" element={<CourseGenerator />} />
              {/* Quiz */}
              <Route path='/user/quiz' element={<Quiz />} />
              <Route path='/user/quiz-attempt' element={<UserAttemptQuiz />} />
            </Route>

            {/* 🧑‍🏫 Mentor-only route */}
            <Route element={<ProtectedRoute allowedRoles={["Mentor"]} />}>
              <Route path="/mentor/dashboard" element={<MentorDashboard />} />
              {/* Profile */}
              <Route path="/mentor/profile" element={<MentorProfile />} />
              <Route path='/mentor/additional-info' element={<AddtionalInfo />} />
              {/* Roadmap */}
              <Route path='/mentor/roadmaps' element={<MentorRoadmap />} />
              <Route path='/mentor/create-roadmap' element={<CreateRoadmap />} />
              {/* Blogs */}
              <Route path='/mentor/blogs' element={<MentorBlog />} />
              {/* Quiz */}
              <Route path='/mentor/quiz' element={<MentorQuiz />} />
              <Route path='/mentor/create-quiz' element={<CreateQuiz />} />
              <Route path='/mentor/edit-quiz' element={<EditQuiz />} />
              <Route path='/mentor/view-quiz' element={<ViewQuiz />} />
              {/* Course */}
              <Route path='/mentor/course' element={<MentorCourse />} />
              <Route path='/mentor/view-course' element={<MentorViewCourse />} />
              <Route path='/mentor/create-course' element={<MentorGenerateCourse />} />
            </Route>

            {/* 404 Not Found Route */}
            <Route path='*' element={<NotFound />} />
          </Routes>
          <Footer />
          <Toaster />
        </AuthProvider>
      </Router>
    </GoogleOAuthProvider>
  )
}

export default App
