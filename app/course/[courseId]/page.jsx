"use client"
import DashboardHeader from '@/app/dashboard/_components/DashboardHeader';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react' 
import StudyMaterialSection from './_components/StudyMaterialSection';
import axios from 'axios';
import CourseIntrocard from './_components/CourseIntrocard';

function Course() {
    const {courseId} = useParams(); 
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(()=>{
        GetCourse();
    },[courseId])

    const GetCourse = async () => {
        try {
            setLoading(true);
            const result = await axios.get('/api/courses?courseId='+courseId);
            console.log("Course API response:", result.data);
            
            if (result.data.success) {
                setCourse(result.data.result);
            } else {
                setError(result.data.message || "Failed to load course");
            }
        } catch (error) {
            console.error("Error fetching course:", error);
            setError(error.response?.data?.message || "Failed to load course");
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div>
                <DashboardHeader/>
                <div className="mt-10 mx-10 md:mx-36 lg:px-60">
                    <p>Loading course...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <DashboardHeader/>
                <div className="mt-10 mx-10 md:mx-36 lg:px-60">
                    <p className="text-red-500">Error: {error}</p>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div>
                <DashboardHeader/>
                <div className="mt-10 mx-10 md:mx-36 lg:px-60">
                    <p>Course not found</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <DashboardHeader/>
            <div className='mt-10 mx-10 md:mx-36 lg:px-60'>
                {/* Course Intro */}
                <CourseIntrocard course={course}/>

                {/* Study Material Options */}

                <StudyMaterialSection courseId={courseId}/>

                {/* Chapter lists */}
            </div>
        </div>
    )
}

export default Course;