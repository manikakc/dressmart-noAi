import React from 'react'
import heroImg from "../../assets/website.banner.jpg"
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
   <section className='relative mb-10'>
    <img src={heroImg} 
    alt="Dressmart" 
    className='w-full h-[550px] md:h-[500px] lg:h-[600px] object-cover '/>
    <div className='absolute inset-0 bg-black flex items-center justify-center' style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
      <div className='text-center text-amber-100  p-6'>
        <h1 className='text-4xl md:text-7xl font-medium tracking-tighter uppercase mb-4'>
          Fashion <br/>and <br/> Style
        </h1>
        <p className='mb-3'>
          Explore our outfits with fast shipping.
        </p>
        <Link 
        to="collections/all"
        className="bg-[#cb5f5f] text-amber-100 px-5 py-2 rounded-sm text-lg"
        >
          Shop Now
        </Link>
      </div>
     
    </div>
   </section>
  )
}

export default Hero
