"use client"
import Image from 'next/image'
import React from 'react'
import { useUser } from '@clerk/nextjs'

function WelcomeBanner() {
    const { user } = useUser();

  return (
    <div className='p-5 bg-primary w-full text-white rounded-lg flex items-center gap-5'>
      <Image src={'/laptop.png'} alt='laptop' width={100} height={100}/>
      <div>
        <h2 className='font-bold text-3xl'>Hello, {user?.fullName}</h2>
        <p>Welcome back, its time to get back and start learning</p>
      </div>
    </div>
  )
}

export default WelcomeBanner
