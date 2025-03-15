"use client"
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
    const [formData, setFormData] = useState({
        studyType: '',
        topic: '',
        difficultyLevel: ''
    });
    const [error, setError] = useState('');
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleUserInput = (fieldName, fieldValue) => {
        setError(''); // Clear any existing errors
        setFormData(prev => {
            const updatedData = { ...prev, [fieldName]: fieldValue };
            console.log(`Updated ${fieldName}:`, fieldValue);
            console.log("Current Form Data:", updatedData);
            return updatedData;
        });
    };

    const validateStep = () => {
        if (step === 0 && !formData.studyType) {
            setError('Please select a study type to continue');
            return false;
        }
        return true;
    };

    const handleNext = () => {
        if (validateStep()) {
            setStep(step + 1);
        }
    };

    const GenerateCourseOutline = async () => {
        if (!formData.studyType || !formData.topic || !formData.difficultyLevel) {
            setError('Please fill in all required fields before generating the course outline.');
            return;
        }

        const courseId = uuidv4();
        setLoading(true);
        setError('');

        try {
            const result = await axios.post('/api/generate-course-outline', {
                courseId,
                ...formData,
                createdBy: user?.primaryEmailAddress?.emailAddress,
            });

            console.log("API Response:", result.data?.result?.resp);
            router.replace('/dashboard');
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to generate course outline';
            setError(errorMessage);
            console.error("Error generating course outline:", errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center p-5 md:px-24 lg:px-36 mt-20">
            <h2 className="font-bold text-3xl text-primary">Start Building Your Personal Study Material</h2>
            <p className="text-gray-500">Fill all details in order to generate study material for your next project</p>

            {error && (
                <div className="w-full mt-4 p-4 text-red-500 bg-red-50 rounded-md border border-red-200">
                    {error}
                </div>
            )}

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
                ) : (
                    <div className="invisible">
                        <Button variant="outline">Previous</Button>
                    </div>
                )}
                
                {step === 0 ? (
                    <Button onClick={handleNext}>Next</Button>
                ) : (
                    <Button 
                        onClick={GenerateCourseOutline} 
                        disabled={loading}
                        className={loading ? 'cursor-not-allowed' : ''}
                    >
                        {loading && <Loader className='animate-spin mr-2' />}
                        {loading ? 'Generating...' : 'Generate'}
                    </Button>
                )}
            </div>
        </div>
    );
}

export default Create;
