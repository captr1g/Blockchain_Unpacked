import { useState, useCallback } from 'react';

/**
 * Quiz Hook — manages quiz state for a single section
 *
 * @param {Array} questions - array from QUIZZES[sectionId]
 * @returns {Object} quiz state and actions
 *
 * UI team consumes:
 * - currentQuestion: the current question object
 * - currentIndex: which question number (0-based)
 * - totalQuestions: how many questions total
 * - selectedAnswer: which option index the user picked (null if not answered)
 * - isCorrect: boolean or null (null if not answered yet)
 * - isComplete: boolean — all questions answered
 * - score: { correct, total }
 * - selectAnswer(index): user picks an option
 * - nextQuestion(): move to next question
 * - resetQuiz(): start over
 */
export function useQuiz(questions) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [isComplete, setIsComplete] = useState(false);

  const currentQuestion = questions[currentIndex] || null;

  const isCorrect = selectedAnswer !== null
    ? selectedAnswer === currentQuestion?.correctIndex
    : null;

  const selectAnswer = useCallback((index) => {
    if (selectedAnswer !== null) return; // already answered
    setSelectedAnswer(index);
    if (index === currentQuestion?.correctIndex) {
      setScore(prev => ({ correct: prev.correct + 1, total: prev.total + 1 }));
    } else {
      setScore(prev => ({ ...prev, total: prev.total + 1 }));
    }
  }, [selectedAnswer, currentQuestion]);

  const nextQuestion = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      setIsComplete(true);
    }
  }, [currentIndex, questions.length]);

  const resetQuiz = useCallback(() => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore({ correct: 0, total: 0 });
    setIsComplete(false);
  }, []);

  return {
    currentQuestion,
    currentIndex,
    totalQuestions: questions.length,
    selectedAnswer,
    isCorrect,
    isComplete,
    score,
    selectAnswer,
    nextQuestion,
    resetQuiz
  };
}
