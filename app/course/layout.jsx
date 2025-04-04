import React from 'react'
import DashboardHeader from '../dashboard/_components/DashboardHeader'

function CourseViewLayout({children}) {
  return (
    <div>
        <DashboardHeader />
        <div className='mt-10 mx-10 md:mx-36 lg:px-60'>
            {children}
        </div>
    </div>
  )
}

export default CourseViewLayout