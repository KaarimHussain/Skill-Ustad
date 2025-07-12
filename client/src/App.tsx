import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './views/Home'
import Login from './views/Login'
import Signup from './views/Signup'
import OTPVerification from './views/OTPVerification'

function App() {
  return (
    <Router>
      <Navbar />
      {/*  */}
      <Routes>
        <Route path='/' element={<Home />} />
        {/* Auth */}
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/otp' element={<OTPVerification />} />
        {/*  */}
      </Routes>
      {/*  */}
      <Footer />
    </Router>
  )
}

export default App
