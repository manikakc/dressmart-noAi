import { TbBrandMeta } from 'react-icons/tb'
import {IoLogoInstagram } from 'react-icons/io'

const Topbar = () => {
  return (
    < div className= 'bg-[#b7b1ed] text-shadow-white'>
        <div className='container mx-auto flex justify-between items-center py-3 px-4'>
            <div className='hidden md:flex items-center space-x-4'>
                <a href='#' className='hover:text-shadow-gray-300'>
                <TbBrandMeta className= 'h-5 w-5'/>
                </a>
                <a href='#' className='hover:text-shadow-gray-300'>
                <IoLogoInstagram className= 'h-5 w-5'/>
                </a>
            </div>
            <div className='text-sm text-center flex-grow'>
                <span>Fast and reliable shipping!</span>
            </div>
        </div>
      
    </div>
  )
}

export default Topbar