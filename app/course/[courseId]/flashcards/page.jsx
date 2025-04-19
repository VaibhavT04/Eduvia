"use client"
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { ArrowLeft, ArrowRight, RotateCw, ChevronLeft } from 'lucide-react';
import './flashcards.css';

function Flashcards() {
  const { courseId } = useParams();
  const router = useRouter();
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    GetFlashcards();
  }, []);

  const GetFlashcards = async () => {
    try {
      setLoading(true);
      const result = await axios.post('/api/study-type', {
        courseId: courseId,
        studyType: 'Flashcard'
      });

      console.log('Flashcard API Response:', result.data);

      if (!result.data.success) {
        setError(result.data.message || 'Failed to load flashcards');
        setFlashcards([]);
        return;
      }

      if (result.data.content && Array.isArray(result.data.content)) {
        setFlashcards(result.data.content);
        setError(null);
      } else {
        console.error('Invalid content format:', result.data);
        setError('No flashcards available yet. Please generate them first.');
        setFlashcards([]);
      }
    } catch (err) {
      console.error('Error loading flashcards:', err);
      setError('Failed to load flashcards. Please try again.');
      setFlashcards([]);
    } finally {
      setLoading(false);
    }
  };

  const goToNextCard = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const goToPreviousCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const goBackToCourse = () => {
    router.push(`/course/${courseId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin mr-2">
          <RotateCw size={24} />
        </div>
        <p>Loading flashcards...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 max-w-md mx-auto">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={GetFlashcards}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 max-w-md mx-auto">
          <p className="mb-4">No flashcards available. Please generate them first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 relative">
      {/* Back Button */}
      <button
        onClick={goBackToCourse}
        className="absolute top-4 left-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ChevronLeft size={20} />
        <span>Back to Course</span>
      </button>

      <div className="max-w-3xl mx-auto">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="h-2 w-full bg-gray-200 rounded-full">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / flashcards.length) * 100}%` }}
            />
          </div>
          <p className="text-center mt-2 text-gray-600">
            Card {currentIndex + 1} of {flashcards.length}
          </p>
        </div>

        {/* Flashcard */}
        <div
          className="relative perspective-1000 w-full"
          style={{ height: '400px' }}
        >
          <div
            className={`w-full h-full cursor-pointer transition-transform duration-500 transform-style-preserve-3d relative ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
            onClick={flipCard}
          >
            {/* Front of card */}
            <div className="absolute w-full h-full bg-white rounded-xl shadow-lg p-8 backface-hidden">
              <div className="flex items-center justify-center h-full">
                <p className="text-2xl text-center font-semibold">
                  {flashcards[currentIndex]?.front}
                </p>
              </div>
            </div>

            {/* Back of card */}
            <div className="absolute w-full h-full bg-white rounded-xl shadow-lg p-8 backface-hidden rotate-y-180">
              <div className="flex items-center justify-center h-full">
                <p className="text-xl text-center">
                  {flashcards[currentIndex]?.back}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-center items-center gap-6 mt-8">
          <button
            onClick={goToPreviousCard}
            disabled={currentIndex === 0}
            className={`p-3 rounded-full ${
              currentIndex === 0
                ? 'bg-gray-200 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white transition-colors`}
          >
            <ArrowLeft size={24} />
          </button>

          <button
            onClick={flipCard}
            className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
          >
            Flip Card
          </button>

          <button
            onClick={goToNextCard}
            disabled={currentIndex === flashcards.length - 1}
            className={`p-3 rounded-full ${
              currentIndex === flashcards.length - 1
                ? 'bg-gray-200 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white transition-colors`}
          >
            <ArrowRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Flashcards;