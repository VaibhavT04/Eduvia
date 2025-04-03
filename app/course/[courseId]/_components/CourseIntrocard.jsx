import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Progress } from '@/components/ui/progress'

function CourseIntrocard({course}) {
  const [parsedCourseLayout, setParsedCourseLayout] = useState(null);
  
  useEffect(() => {
    if (course?.courseLayout) {
      try {
        // If courseLayout is a string, parse it
        const layout = typeof course.courseLayout === 'string' 
          ? JSON.parse(course.courseLayout) 
          : course.courseLayout;
        
        setParsedCourseLayout(layout);
        console.log("Parsed course layout:", layout);
        
        // Log the structure to help debug
        console.log("Course layout structure:", {
          hasTitle: !!layout.course_title,
          hasSummary: !!layout.summary,
          keys: Object.keys(layout),
          titleValue: layout.course_title,
          summaryValue: layout.summary
        });
      } catch (error) {
        console.error("Error parsing course layout:", error);
      }
    } else {
      console.log("No courseLayout data available:", course);
    }
  }, [course]);
  
  // Extract title and summary with fallbacks
  const courseTitle = parsedCourseLayout?.course_title || 
                     parsedCourseLayout?.title || 
                     parsedCourseLayout?.courseTitle || 
                     course?.topic || 
                     'Course Title';
  
  const courseSummary = parsedCourseLayout?.summary || 
                       parsedCourseLayout?.courseSummary || 
                       parsedCourseLayout?.description || 
                       'No summary available';
  
  return (
    <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow">
        <Image src={'/knowledge.png'} alt='Knowledge icon' width={70} height={70}/>
        <div>
            <h2 className='font-bold text-2xl'>{courseTitle}</h2>
            <p className="text-gray-600 mt-2">{courseSummary}</p>
            <Progress className='mt-4'/>

            <h2 className='mt-4 text-lg text-primary'>Total Chapters: {course?.courseLayout?.chapters?.length}</h2>
        </div>
    </div>
  )
}

export default CourseIntrocard