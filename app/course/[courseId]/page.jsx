"use client"
import DashboardHeader from '@/app/dashboard/_components/DashboardHeader';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react' 
import StudyMaterialSection from './_components/StudyMaterialSection';
import axios from 'axios';
import CourseIntrocard from './_components/CourseIntrocard';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

function Course() {
    const {courseId} = useParams(); 
    const router = useRouter();
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

    const handleBackToDashboard = () => {
        router.push('/dashboard');
    };

    if (loading) {
        return (
            <div>
                <DashboardHeader/>
                <div className="mt-10 mx-10 md:mx-36 lg:px-60">
                    <Button 
                        variant="ghost" 
                        className="mb-4" 
                        onClick={handleBackToDashboard}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Dashboard
                    </Button>
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
                    <Button 
                        variant="ghost" 
                        className="mb-4" 
                        onClick={handleBackToDashboard}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Dashboard
                    </Button>
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
                    <Button 
                        variant="ghost" 
                        className="mb-4" 
                        onClick={handleBackToDashboard}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Dashboard
                    </Button>
                    <p>Course not found</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className='mt-10 mx-10 md:mx-36 lg:px-60'>
                {/* Back button */}
                <Button 
                    variant="ghost" 
                    className="mb-4" 
                    onClick={handleBackToDashboard}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                </Button>
                
                {/* Course Intro */}
                <CourseIntrocard course={course}/>

                {/* Study Material Options */}
                <StudyMaterialSection courseId={courseId} course={course}/>

                {/* Chapter lists */}
            </div>
        </div>
    )
}

export default Course;