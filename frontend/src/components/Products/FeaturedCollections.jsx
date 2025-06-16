import React from 'react'
import { Link } from 'react-router-dom'
import featured from "../../assets/featured.jpg"

const FeaturedCollections = () => {
  return (
    <section className='py-16 px-4 lg:px-0'>
        <div className='container mx-auto flex flex-col-reverse lg:flex-row items-center bg-[#b7b1ed] rounded-3xl'>
          {/* left content */}
          <div className='lg:w-1/2 p-8 text-center lg:text-left'>
            <h2 className='text-lg font-semibold text-gray-700'>
                Comfort with Styling
            </h2>
            <h2 className='text-4xl lg:text-5xl font-bold mb-6'>
                Make classy everyday life
            </h2>
            <p className='text-lg text-gray-600 mb-6'>
                Discover high-quality, comfortable clothing that effortlessly blends fashion and function. Designed to look and feel great everyday.
            </p>
            <Link to="/collections/all" className='bg-black text-white px-6 py-3 rounded-lg text-lg hover:bg-gray-800'>
            Shop Now
            </Link>
          </div>
          {/* right content */}
         <div className="lg:w-1/2 max-h-[350px] overflow-hidden rounded-lg lg:rounded-tr-3xl lg:rounded-br-3xl">
  <img 
    src={featured} 
    alt="featured collection"
    className="w-full h-full object-cover"
  />
</div>

        </div>

    </section>
  )
}

export default FeaturedCollections
