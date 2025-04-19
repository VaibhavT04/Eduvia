"use client"
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { ChevronLeft, RotateCw, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function QuizPage() {
  const { courseId } = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setQuiz([]);
        return;
      }

      if (result.data.content && Array.isArray(result.data.content)) {
        setQuiz(result.data.content);
        setError(null);
      } else {
        console.error('Invalid content format:', result.data);
        setError('No quiz available yet. Please generate it first.');
        setQuiz([]);
      }
    } catch (err) {
      console.error('Error loading quiz:', err);
      setError('Failed to load quiz. Please try again.');
      setQuiz([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer) => {
    // Prevent selecting if already answered
    if (selectedAnswers[currentQuestionIndex] !== undefined) return;

    const isCorrect = answer === quiz[currentQuestionIndex].correctAnswer;
    
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: answer,
    }));

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex === quiz.length - 1) {
      setShowResults(true);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setScore(0);
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
          <Button onClick={getQuiz}>Retry Loading</Button>
        </div>
      </div>
    );
  }

  if (quiz.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 max-w-md mx-auto">
          <p className="mb-4">No quiz available. Please generate it first.</p>
          <Button onClick={goBackToCourse}>Back to Course</Button>
        </div>
      </div>
    );
  }

  if (showResults) {
    const percentage = Math.round((score / quiz.length) * 100);
    const getGrade = (percentage) => {
      if (percentage >= 90) return 'Excellent!';
      if (percentage >= 80) return 'Very Good!';
      if (percentage >= 70) return 'Good!';
      if (percentage >= 60) return 'Fair';
      return 'Keep Practicing';
    };

    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Quiz Results</h2>
            <div className="mb-6">
              <Progress value={percentage} className="h-3 mb-2" />
              <p className="text-lg mb-2">
                You scored {score} out of {quiz.length} questions
              </p>
              <p className="text-3xl font-bold text-primary mb-2">{percentage}%</p>
              <p className="text-xl text-gray-600">{getGrade(percentage)}</p>
            </div>
            <div className="flex gap-4">
              <Button onClick={handleRetry} className="bg-primary">Try Again</Button>
              <Button variant="outline" onClick={goBackToCourse}>
                Back to Course
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.length) * 100;
  const isAnswered = selectedAnswers[currentQuestionIndex] !== undefined;
  const selectedAnswer = selectedAnswers[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 relative">
      <button
        onClick={goBackToCourse}
        className="absolute top-4 left-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ChevronLeft size={20} />
        <span>Back to Course</span>
      </button>

      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {quiz.length}
            </span>
            <span className="text-sm font-medium">Score: {score}/{quiz.length}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">{currentQuestion.question}</h2>
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = currentQuestion.correctAnswer === option;
              
              let buttonStyle = "w-full justify-start text-left relative pl-12";
              let variant = "outline";
              
              if (isAnswered) {
                if (isCorrect) {
                  buttonStyle += " border-green-500 text-green-700";
                  variant = "outline";
                } else if (isSelected && !isCorrect) {
                  buttonStyle += " border-red-500 text-red-700";
                  variant = "outline";
                }
              }

              return (
                <div key={index} className="relative">
                  <Button
                    variant={variant}
                    className={buttonStyle}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={isAnswered}
                  >
                    {option}
                    {isAnswered && isCorrect && (
                      <Check className="absolute left-4 h-4 w-4 text-green-500" />
                    )}
                    {isAnswered && isSelected && !isCorrect && (
                      <X className="absolute left-4 h-4 w-4 text-red-500" />
                    )}
                  </Button>
                </div>
              );
            })}
          </div>

          {isAnswered && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
              <p className="font-medium text-gray-900">Explanation:</p>
              <p className="mt-2 text-gray-600">{currentQuestion.explanation}</p>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleNext}
              disabled={!isAnswered}
              className="bg-primary"
            >
              {currentQuestionIndex === quiz.length - 1 ? 'Show Results' : 'Next Question'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
} 