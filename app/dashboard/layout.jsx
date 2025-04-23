"use client"
import React from 'react'
import SideBar from './_components/SideBar'
import DashboardHeader from './_components/DashboardHeader'
import { CourseCountContext } from '../_context/CourseCountContext'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useUser } from '@clerk/nextjs'

function DashboardLayout({children}) {
  const [totalCourse, setTotalCourse] = useState(0);
  const { user } = useUser();

  // Initialize course count when user loads
  useEffect(() => {
    if (user) {
      const fetchCourseCount = async () => {
        try {
          const result = await axios.post("/api/courses", 
            { createdBy: user?.primaryEmailAddress?.emailAddress });
          
          if (result.data.success) {
            setTotalCourse(result.data.result?.length || 0);
          }
        } catch (error) {
          console.error("Error fetching course count:", error);
        }
      };
      
      fetchCourseCount();
    }
  }, [user]);

  return (
    <CourseCountContext.Provider value={{totalCourse, setTotalCourse}}>
    <div>
        <div className='md:w-64 hidden md:block fixed'>
            <SideBar/>
        </div>
        <div className='md:ml-64'>
            <DashboardHeader/>
            <div className='p-10'>
                {children}
            </div>
        </div>
    </div>
    </CourseCountContext.Provider>
  )
}

export default DashboardLayout
