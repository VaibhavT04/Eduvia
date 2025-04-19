'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';

export default function QuizPage({ params }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    fetchQuiz();
  }, []);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/study-type', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: params.courseId,
          studyType: 'quiz',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch quiz');
      }

      const data = await response.json();
      setQuiz(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer) => {
    if (selectedAnswers[currentQuestionIndex] !== undefined) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: answer,
    }));

    if (answer === quiz[currentQuestionIndex].correctAnswer) {
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="mt-4">Loading quiz...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={fetchQuiz}>Retry</Button>
      </div>
    );
  }

  if (showResults) {
    const percentage = Math.round((score / quiz.length) * 100);
    return (
      <div className="container mx-auto max-w-2xl p-4">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Quiz Results</h2>
          <p className="text-lg mb-2">
            You scored {score} out of {quiz.length} questions
          </p>
          <p className="text-xl font-semibold mb-4">{percentage}%</p>
          <div className="flex gap-4">
            <Button onClick={handleRetry}>Try Again</Button>
            <Button variant="outline" onClick={() => router.push(`/course/${params.courseId}`)}>
              Back to Course
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const currentQuestion = quiz[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.length) * 100;
  const isAnswered = selectedAnswers[currentQuestionIndex] !== undefined;

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">
            Question {currentQuestionIndex + 1} of {quiz.length}
          </span>
          <Button
            variant="ghost"
            onClick={() => router.push(`/course/${params.courseId}`)}
          >
            Exit Quiz
          </Button>
        </div>
        <Progress value={progress} className="w-full" />
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">{currentQuestion.question}</h2>
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswers[currentQuestionIndex] === option;
            const isCorrect = currentQuestion.correctAnswer === option;
            let buttonVariant = "outline";
            
            if (isAnswered) {
              if (isSelected && isCorrect) buttonVariant = "success";
              else if (isSelected && !isCorrect) buttonVariant = "destructive";
              else if (isCorrect) buttonVariant = "success";
            }

            return (
              <Button
                key={index}
                variant={isSelected ? buttonVariant : "outline"}
                className="w-full justify-start text-left"
                onClick={() => handleAnswerSelect(option)}
                disabled={isAnswered}
              >
                {option}
              </Button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="font-medium">Explanation:</p>
            <p className="text-gray-600">{currentQuestion.explanation}</p>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleNext}
            disabled={!isAnswered}
          >
            {currentQuestionIndex === quiz.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </div>
      </Card>
    </div>
  );
} 