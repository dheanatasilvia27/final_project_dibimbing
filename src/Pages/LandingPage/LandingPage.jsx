import React from 'react'
import Navbar from '../../Components/Navbar/Navbar'
import Home from '../../Components/Home/Home'
import Main from '../../Components/Main/Main'
import Footer from '../../Components/Footer/Footer'
import '../../app.css';




const LandingPage = () => {
  return (
    <div>
      <Navbar />
      <Home />
      <Main />
      <Footer />
      
    </div>
  )
}

export default LandingPage