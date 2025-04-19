"use client"
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { ChevronLeft, RotateCw } from 'lucide-react';

function Quiz() {
  const { courseId } = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);

  useEffect(() => {
    getQuiz();
  }, []);

  const getQuiz = async () => {
    try {
      setLoading(true);
      const result = await axios.post('/api/study-type', {
        courseId: courseId,
        studyType: 'Quiz'
      });

      console.log('Quiz API Response:', result.data);

      if (!result.data.success) {
        setError(result.data.message || 'Failed to load quiz');
        return;
      }

      if (result.data.content && Array.isArray(result.data.content)) {
        setQuiz(result.data.content);
        setError(null);
      } else {
        setError('No quiz available yet. Please generate one first.');
      }
    } catch (err) {
      console.error('Error loading quiz:', err);
      setError('Failed to load quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer) => {
    if (answeredQuestions.includes(currentQuestion)) return;
    setSelectedAnswer(answer);
    
    // Check if answer is correct and update score
    if (answer === quiz[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    
    setAnsweredQuestions([...answeredQuestions, currentQuestion]);
  };

  const goToNextQuestion = () => {
    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowResults(true);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(null);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResults(false);
    setAnsweredQuestions([]);
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
        <p>Loading quiz...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 max-w-md mx-auto">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={getQuiz}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  if (quiz.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 max-w-md mx-auto">
          <p className="mb-4">No quiz available. Please generate one first.</p>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-6">Quiz Results</h2>
          <div className="text-center mb-8">
            <p className="text-2xl mb-2">Your Score:</p>
            <p className="text-4xl font-bold text-blue-600">{score} / {quiz.length}</p>
            <p className="text-lg mt-2 text-gray-600">
              ({Math.round((score / quiz.length) * 100)}%)
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <button
              onClick={restartQuiz}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={goBackToCourse}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Back to Course
            </button>
          </div>
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
              style={{ width: `${((currentQuestion + 1) / quiz.length) * 100}%` }}
            />
          </div>
          <p className="text-center mt-2 text-gray-600">
            Question {currentQuestion + 1} of {quiz.length}
          </p>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-xl font-semibold mb-6">
            {quiz[currentQuestion].question}
          </h2>
          <div className="space-y-4">
            {quiz[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                className={`w-full text-left p-4 rounded-lg transition-colors ${
                  selectedAnswer === option
                    ? answeredQuestions.includes(currentQuestion)
                      ? option === quiz[currentQuestion].correctAnswer
                        ? 'bg-green-100 border-2 border-green-500'
                        : 'bg-red-100 border-2 border-red-500'
                      : 'bg-blue-100 border-2 border-blue-500'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                disabled={answeredQuestions.includes(currentQuestion)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={goToPreviousQuestion}
            disabled={currentQuestion === 0}
            className={`px-6 py-2 rounded-lg ${
              currentQuestion === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white transition-colors`}
          >
            Previous
          </button>
          
          <div className="text-center">
            <p className="text-lg font-semibold">
              Score: {score} / {answeredQuestions.length}
            </p>
          </div>

          <button
            onClick={goToNextQuestion}
            disabled={!answeredQuestions.includes(currentQuestion)}
            className={`px-6 py-2 rounded-lg ${
              !answeredQuestions.includes(currentQuestion)
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white transition-colors`}
          >
            {currentQuestion === quiz.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Quiz; 