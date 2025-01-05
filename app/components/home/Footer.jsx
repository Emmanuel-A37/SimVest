import  Link  from 'next/link'
import { FaFacebook, FaTwitter, FaGithub } from 'react-icons/fa'
import React from 'react'

const Footer = () => {
  return (
    <div className='bg-white flex max-md:flex-col flex-row-reverse justify-center items-center max-md:gap-6 py-5 md:justify-between md:px-5 ' >
        <div className='flex flex-row gap-6'>
            <Link href="#" className="text-gray-400 hover:text-gray-500"><FaFacebook className='text-2xl'/></Link>
            <Link href="#" className="text-gray-400 hover:text-gray-500"><FaTwitter className='text-2xl'/></Link>
            <Link href="#" className="text-gray-400 hover:text-gray-500"><FaGithub className='text-2xl' /></Link>
        </div>
        <div>
            <p className=" text-gray-400">
                &copy; 2023 InvestSim, Inc. All rights reserved.
            </p>
        </div>
    </div>
  )
}

export default Footer