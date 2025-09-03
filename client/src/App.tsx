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
import MentorAdditionalInfo from './views/Mentor/AdditionalInfo';
import UserAdditionalInfo from './views/User/AdditionalInfo';
import Community from './views/Communities';
import Notification from './views/Notification';
import Messages from './views/Messages';
import QA from './views/QA';
import QADetails from './views/QADetails';
import QACreate from './views/QACreate';
import UserQA from './views/User/QA';
import QAResponses from './views/QAResponses';
import LearnRoadmap from './views/User/LearnRoadmap';
import Courses from './views/Courses';
import ViewCourse from './views/ViewCourse';
import CompaniesLogin from './views/Auth/CompaniesLogin';
import CompaniesRegister from './views/Auth/CompaniesRegister';
import CompaniesHome from './views/Companies/Home';
import AdminDashboard from './views/Admin/Dashboard';
import AdminNavbar from './components/Admin/Navbar';
import Request from './views/Admin/Request';
import CompanyDashboard from './views/Companies/Dashboard';
import CompanyNavbar from './components/Company/Navbar';
import CompanyApplications from './views/Companies/Applications';
import CompanyJobs from './views/Companies/Jobs';
import CompanyCreateJobs from './views/Companies/CreateJobs';
import CompanyAdditionalInfo from './views/Companies/AdditionalInfo';
import CompanyViewJob from './views/Companies/ViewJob';
import CompanyEditJob from './views/Companies/EditJob';
import Jobs from './views/Jobs';
import JobDetail from './views/JobDetail';
import UserCourse from './views/User/Course';
import UserCreateCourse from './views/User/CreateCourse';
import FindMentor from './views/User/FindMentor';
import FindCompany from './views/User/FindCompany';
import UserMentorDetails from './views/User/MentorDetails';
import UserCompanyDetails from './views/User/CompanyDetails';

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
          <Routes>
            {/* 🌐 Public URLs */}
            <Route path="/ai/interview" element={<><Navbar /><VoiceInterviewSimulator /></>} />
            <Route path="/ai/tools" element={<><Navbar /><ToolsView /></>} />
            <Route path="/ai/chatbot" element={<><Navbar /><ChatbotBuilder /></>} />
            <Route path="/user/roadmap/:id" element={<><Navbar /><RoadmapViewer /></>} />
            <Route path='/public/roadmaps' element={<><Navbar /><Roadmap /></>} />
            <Route path='/community' element={<><Navbar /><Community /></>} />
            <Route path='/notifications' element={<><Navbar /><Notification /></>} />
            <Route path='/messages' element={<><Navbar /><Messages /></>} />
            <Route path='/courses' element={<><Navbar /><Courses /></>} />
            <Route path='/public/view-course' element={<><Navbar /><ViewCourse /></>} />
            <Route path="/qa" element={<><Navbar /><QA /></>} />
            <Route path="/qa/:id" element={<><Navbar /><QADetails /></>} />
            <Route path="/qa-create" element={<><Navbar /><QACreate /></>} />
            <Route path="/qa-responses" element={<><Navbar /><QAResponses /></>} />
            <Route path="/jobs" element={<><Navbar /><Jobs /></>} />
            <Route path="/jobs/:id" element={<><Navbar /><JobDetail /></>} />

            {/* 🔒 Protected URLs */}
            {/* 👤 Auth URLs - public only if NOT logged in */}

            {/* ================================= */}
            {/* Student and Mentor Routes */}
            {/* ================================= */}

            {/* Home Route */}
            <Route path="/" element={<PublicOnlyRoute><><Navbar /><Home /></></PublicOnlyRoute>} />

            {/* Login Route - Students and Mentor */}

            <Route path="/login" element={<PublicOnlyRoute><><Navbar /><Login /></></PublicOnlyRoute>} />

            {/* Signup Route - Students and Mentor */}
            <Route path="/signup" element={<PublicOnlyRoute><><Navbar /><Signup /></></PublicOnlyRoute>} />

            {/* Reset Password Route */}

            <Route path="/reset-password" element={<PublicOnlyRoute><><Navbar /><ResetPassword /></></PublicOnlyRoute>} />

            {/* OTP Verification Route */}

            <Route path="/otp" element={<PublicOnlyRoute><><Navbar /><OTPVerification /></></PublicOnlyRoute>} />

            {/* Forget Password Route */}

            <Route path="/forget-password" element={<PublicOnlyRoute><><Navbar /><ForgetPassword /></></PublicOnlyRoute>} />

            {/* ================================= */}
            {/* Companies Routes */}
            {/* ================================= */}

            {/* Home Route */}
            <Route path='/company' element={<PublicOnlyRoute><><Navbar /><CompaniesHome /></></PublicOnlyRoute>} />

            {/* Login Route */}
            <Route path='/company/login' element={<PublicOnlyRoute><><Navbar /><CompaniesLogin /></></PublicOnlyRoute>} />

            {/* Register Route */}
            <Route path='/company/register' element={<PublicOnlyRoute><><Navbar /><CompaniesRegister /></></PublicOnlyRoute>} />

            <Route element={<ProtectedRoute allowedRoles={["Company"]} />} >
              <Route path="/company/dashboard" element={<><CompanyNavbar /><CompanyDashboard /> </>} />
              <Route path="/company/info" element={<><CompanyNavbar /><CompanyAdditionalInfo /> </>} />
              {/* Jobs */}
              <Route path="/company/jobs" element={<><CompanyNavbar /><CompanyJobs /> </>} />
              <Route path="/company/jobs/:id" element={<><CompanyNavbar /><CompanyViewJob /> </>} />
              <Route path="/company/jobs/:id/edit" element={<><CompanyNavbar /><CompanyEditJob /> </>} />
              <Route path="/company/jobs/create" element={<><CompanyNavbar /><CompanyCreateJobs /> </>} />
              {/* Applicants */}
              <Route path="/company/applications" element={<><CompanyNavbar /><CompanyApplications /> </>} />
            </Route>

            {/* ================================= */}
            {/* Admin Routes */}
            {/* ================================= */}

            <Route element={<ProtectedRoute allowedRoles={["Admin"]} />} >
              <Route path="/admin/dashboard" element={<><AdminNavbar /><AdminDashboard /></>} />
              <Route path="/admin/request" element={<><AdminNavbar /><Request /></>} />
            </Route>

            {/*  */}

            {/* 🧑‍🎓 Student-only route */}
            <Route element={<ProtectedRoute allowedRoles={["Student"]} />}>
              <Route path="/user/dashboard" element={<><Navbar /><UserDashboard /></>} />
              {/* Profile */}
              <Route path="/user/profile" element={<><Navbar /><Profile /></>} />
              <Route path='/user/additional-info' element={<><Navbar /><UserAdditionalInfo /></>} />
              {/* Roadmaps */}
              <Route path="/user/roadmap-gen" element={<><Navbar /><GenerateRoadmap /></>} />
              <Route path="/user/process-roadmap" element={<><Navbar /><RoadmapProcessing /></>} />
              <Route path="/user/learn-roadmap/:id" element={<><Navbar /><LearnRoadmap /></>} />
              {/* Courses */}
              <Route path="/user/course-generator" element={<><Navbar /><CourseGenerator /></>} />
              <Route path="/user/course" element={<><Navbar /><UserCourse /></>} />
              <Route path="/user/create-course" element={<><Navbar /><UserCreateCourse /></>} />
              {/* Quiz */}
              <Route path='/user/quiz' element={<><Navbar /><Quiz /></>} />
              <Route path='/user/quiz-attempt' element={<><Navbar /><UserAttemptQuiz /></>} />
              {/* Q&A */}
              <Route path='/user/qa' element={<><Navbar /><UserQA /></>} />
              {/* Find Mentors & Company */}
              <Route path='/user/find-mentor' element={<><Navbar /><FindMentor /></>} />
              <Route path='/user/find-mentor/:id' element={<><Navbar /><UserMentorDetails /></>} />
              <Route path='/user/find-company' element={<><Navbar /><FindCompany /></>} />
              <Route path='/user/find-company/:id' element={<><Navbar /><UserCompanyDetails /></>} />
            </Route>



            {/* 🧑‍🏫 Mentor-only route */}
            <Route element={<ProtectedRoute allowedRoles={["Mentor"]} />}>
              <Route path="/mentor/dashboard" element={<><Navbar /><MentorDashboard /></>} />
              {/* Profile */}
              <Route path="/mentor/profile" element={<><Navbar /><MentorProfile /></>} />
              <Route path='/mentor/additional-info' element={<><Navbar /><MentorAdditionalInfo /></>} />
              {/* Roadmap */}
              <Route path='/mentor/roadmaps' element={<><Navbar /><MentorRoadmap /></>} />
              <Route path='/mentor/create-roadmap' element={<><Navbar /><CreateRoadmap /></>} />
              {/* Blogs */}
              <Route path='/mentor/blogs' element={<><Navbar /><MentorBlog /></>} />
              {/* Quiz */}
              <Route path='/mentor/quiz' element={<><Navbar /><MentorQuiz /></>} />
              <Route path='/mentor/create-quiz' element={<><Navbar /><CreateQuiz /></>} />
              <Route path='/mentor/edit-quiz' element={<><Navbar /><EditQuiz /></>} />
              <Route path='/mentor/view-quiz' element={<><Navbar /><ViewQuiz /></>} />
              {/* Course */}
              <Route path='/mentor/course' element={<><Navbar /><MentorCourse /></>} />
              <Route path='/mentor/view-course' element={<><Navbar /><MentorViewCourse /></>} />
              <Route path='/mentor/create-course' element={<><Navbar /><MentorGenerateCourse /></>} />
            </Route>

            {/* 404 Not Found Route */}
            <Route path='*' element={<><Navbar /><NotFound /></>} />
          </Routes>
          <Footer />
          <Toaster />
        </AuthProvider>
      </Router>
    </GoogleOAuthProvider>
  )
}

export default App
