import './App.css'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import SmoothScroll from './components/SmoothScroll'
import Home from './views/Home'

function App() {
  return (
    <>
      <SmoothScroll />
      <Navbar />
      <Home />
      <Footer />
    </>
  )
}

export default App
