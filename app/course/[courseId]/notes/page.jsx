'use client';
import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation';
import axios from 'axios';  
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronLeft } from 'lucide-react';

function ViewNotes() {
    const {courseId} = useParams();
    const [notes, setNotes] = useState([]);
    const [stepCount, setStepCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        GetNotes();
    }, []);

    const GetNotes = async () => {
        try {
            setLoading(true);
            const result = await axios.post('/api/study-type', {
                courseId: courseId,
                studyType: 'notes'
            });
            
            console.log("API Response:", result?.data);
            
            if (result?.data?.success && Array.isArray(result?.data?.data)) {
                setNotes(result.data.data);
            } else {
                setNotes([]);
                console.error("Invalid data format:", result?.data);
            }
        } catch (error) {
            console.error("Error fetching notes:", error);
            setError(error.message || "Failed to load notes");
            setNotes([]);
        } finally {
            setLoading(false);
        }
    }

    const goBackToCourse = () => {
        router.push(`/course/${courseId}`);
    };

    const goBackToDashboard = () => {
        router.push('/dashboard');
    };

    if (loading) {
        return (
            <div>
                <div className="p-4">
                    <Button 
                        variant="ghost" 
                        className="mb-4" 
                        onClick={goBackToDashboard}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Dashboard
                    </Button>
                </div>
                <div className="text-center">Loading notes...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <div className="p-4">
                    <Button 
                        variant="ghost" 
                        className="mb-4" 
                        onClick={goBackToDashboard}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Dashboard
                    </Button>
                </div>
                <div className="text-center">Error: {error}</div>
            </div>
        );
    }

    const formatContent = (content) => {
        if (!content) return '';
        
        // Remove code block markers
        let formattedContent = content.replace(/```(html|javascript|jsx)?\n?/g, '');
        
        // Add proper styling classes
        formattedContent = formattedContent
            .replace(/<h1>/g, '<h1 class="text-3xl font-bold mb-4">')
            .replace(/<h2>/g, '<h2 class="text-2xl font-bold mb-3 mt-6">')
            .replace(/<h3>/g, '<h3 class="text-xl font-semibold mb-2 mt-4">')
            .replace(/<p>/g, '<p class="mb-4 text-gray-700">')
            .replace(/<ul>/g, '<ul class="list-disc pl-6 mb-4 space-y-2">')
            .replace(/<li>/g, '<li class="text-gray-700">');

        return formattedContent;
    };

    return notes&&(
        <div>
            <div className="p-4">
                <div className="flex justify-between items-center">
                    <Button 
                        variant="ghost" 
                        className="mb-4" 
                        onClick={goBackToDashboard}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Dashboard
                    </Button>
                    
                    <Button 
                        variant="ghost" 
                        className="mb-4" 
                        onClick={goBackToCourse}
                    >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Back to Course
                    </Button>
                </div>
            </div>
            
            <div className='flex items-center gap-5 m-10'>
                {stepCount != 0 && <Button variant='outline' size='sm' onClick={()=>setStepCount(stepCount-1)}>Previous</Button>}
                {Array.isArray(notes) && notes.map((item, index) => (
                    <div key={index} className={`w-full h-2 rounded-full 
                    ${index < stepCount ? 'bg-primary' : 'bg-gray-200'}`}>
                        
                    </div>
                ))}
                <Button variant='outline' size='sm' onClick={()=>setStepCount(stepCount+1)}>Next</Button>
            </div>

            <div className='mt-10 p-10 bg-white rounded-lg shadow-md max-w-4xl mx-auto'>
                <div 
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ 
                        __html: formatContent(notes[stepCount]?.notes)
                    }} 
                />
                {notes?.length==stepCount&&<div className='flex items-center gap-10 flex-col justify-center'>

                    <h2>End of Notes</h2>
                    <div className="flex gap-4">
                        <Button onClick={goBackToCourse}>Go to Course</Button>
                        <Button variant="outline" onClick={goBackToDashboard}>Back to Dashboard</Button>
                    </div>
                </div>}
            </div>
        </div>
    )
}

export default ViewNotes