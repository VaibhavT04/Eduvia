'use client'
import { Button } from '@/components/ui/button';
import SelectOption from './_components/SelectOption';
import React, { useState } from 'react';
import TopicInput from './_components/TopicInput';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs';
import { Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';

function Create() {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({  // ✅ FIX: Ensure it's an object
        studyType: '',
        topic: '',
        difficultyLevel: ''
    });
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // ✅ FIX: Properly update state
    const handleUserInput = (fieldName, fieldValue) => {
        setFormData(prev => {
            const updatedData = { ...prev, [fieldName]: fieldValue };
            console.log(`Updated ${fieldName}:`, fieldValue); // ✅ Debugging log
            console.log("Current Form Data:", updatedData);
            return updatedData;
        });
    };

    // ✅ Final Fix: Ensure all values exist before sending request
    const GenerateCourseOutline = async () => {
        const courseId = uuidv4();
        setLoading(true);

        console.log("Final formData before sending request:", formData); // ✅ Debugging log

        // ✅ Check if any field is missing
        if (!formData.studyType || !formData.topic || !formData.difficultyLevel) {
            console.error("Error: Missing required fields", formData);
            alert("Please fill in all required fields before generating the course outline.");
            setLoading(false);
            return;
        }

        try {
            const result = await axios.post('/api/generate-course-outline', {
                courseId,
                ...formData,
                createdBy: user?.primaryEmailAddress?.emailAddress,
            });

            console.log("API Response:", result.data?.result?.resp);
            router.replace('/dashboard');
        } catch (error) {
            console.error("Error generating course outline:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center p-5 md:px-24 lg:px-36 mt-20">
            <h2 className="font-bold text-3xl text-primary">Start Building Your Personal Study Material</h2>
            <p className="text-gray-500">Fill all details in order to generate study material for your next project</p>

            <div className='mt-10'>
                {step === 0 ? (
                    <SelectOption selectedStudyType={(value) => handleUserInput('studyType', value)} />
                ) : (
                    <TopicInput
                        setTopic={(value) => handleUserInput('topic', value)}
                        setDifficultyLevel={(value) => handleUserInput('difficultyLevel', value)}
                    />
                )}
            </div>

            <div className="flex justify-between w-full mt-32">
                {step !== 0 ? (
                    <Button variant="outline" onClick={() => setStep(step - 1)}>Previous</Button>
                ) : '-'}
                
                {step === 0 ? (
                    <Button onClick={() => setStep(step + 1)}>Next</Button>
                ) : (
                    <Button onClick={GenerateCourseOutline} disabled={loading}>
                        {loading ? <Loader className='animate-spin mr-2' /> : null}
                        {loading ? 'Generating...' : 'Generate'}
                    </Button>
                )}
            </div>
        </div>
    );
}

export default Create;
