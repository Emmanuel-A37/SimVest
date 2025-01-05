import React from 'react'
import HowItWorks from './components/home/howitworks'
import Features from './components/home/Features'
import Hero from './components/home/Hero'
import Footer from './components/home/Footer'
import Header from './components/home/Header'

const page = () => {
  return (
    <div className='overflow-x-hidden'>
        <Header />
        <Hero />
        <Features />
        <HowItWorks />
        <Footer />
    </div>
  )
}

export default page