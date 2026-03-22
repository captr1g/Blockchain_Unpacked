import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, CheckCircle2, XCircle, ArrowRight, RefreshCw, Trophy } from 'lucide-react';

import { QUIZZES } from '../data/quizzes';

const BG = '#11131d';
const SURFACE = '#1d1f2a';
const SURFACE_H = '#282934';
const AMBER = '#f59e0b';
const ROSE = '#fb7185';
const EMERALD = '#4ade80';
const SKY = '#38bdf8';
const PURPLE = '#a78bfa';
const TEXT = '#f1f5f9';
const MUTED = '#64748b';

export default function Quiz({ sectionId, title = "Knowledge Check" }) {
    const questions = QUIZZES[sectionId];
    
    const [currentIdx, setCurrentIdx] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    if (!questions || questions.length === 0) return null;

    const currentQuestion = questions[currentIdx];
    const isCorrect = selectedOption === currentQuestion.correctIndex;

    const handleOptionSelect = (idx) => {
        if (isAnswered) return;
        setSelectedOption(idx);
        setIsAnswered(true);
        if (idx === currentQuestion.correctIndex) {
            setScore(prev => prev + 1);
        }
    };

    const handleNext = () => {
        if (currentIdx < questions.length - 1) {
            setCurrentIdx(prev => prev + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            setIsFinished(true);
        }
    };

    const handleRestart = () => {
        setCurrentIdx(0);
        setSelectedOption(null);
        setIsAnswered(false);
        setScore(0);
        setIsFinished(false);
    };

    return (
        <div className="mt-16 border-t pt-12" style={{ borderColor: 'rgba(83,68,52,0.3)' }}>
            <div className="flex items-center space-x-3 mb-8">
                <BrainCircuit className="w-8 h-8" style={{ color: PURPLE }} />
                <h2 className="text-3xl font-black tracking-tighter" style={{ color: TEXT }}>{title}</h2>
            </div>

            <div className="max-w-3xl mx-auto p-6 md:p-10 border" style={{ backgroundColor: SURFACE, borderColor: 'rgba(83,68,52,0.3)' }}>
                <AnimatePresence mode="wait">
                    {!isFinished ? (
                        <motion.div
                            key={currentIdx}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-sm" style={{ backgroundColor: PURPLE + '20', color: PURPLE }}>
                                    Question {currentIdx + 1} of {questions.length}
                                </span>
                                <span className="text-sm font-terminal" style={{ color: MUTED }}>Score: {score}</span>
                            </div>

                            {/* Progress bar */}
                            <div className="w-full h-1 mb-8" style={{ backgroundColor: BG }}>
                                <motion.div 
                                    className="h-full" 
                                    style={{ backgroundColor: PURPLE }} 
                                    initial={{ width: ((currentIdx) / questions.length) * 100 + '%' }}
                                    animate={{ width: ((currentIdx + 1) / questions.length) * 100 + '%' }}
                                />
                            </div>

                            <h3 className="text-xl md:text-2xl font-bold mb-8 leading-snug" style={{ color: TEXT }}>
                                {currentQuestion.question}
                            </h3>

                            <div className="space-y-4 mb-8">
                                {currentQuestion.options.map((opt, idx) => {
                                    let btnStyle = { backgroundColor: BG, borderColor: 'rgba(83,68,52,0.3)', color: MUTED };
                                    
                                    if (isAnswered) {
                                        if (idx === currentQuestion.correctIndex) {
                                            btnStyle = { backgroundColor: EMERALD + '15', borderColor: EMERALD, color: EMERALD };
                                        } else if (idx === selectedOption) {
                                            btnStyle = { backgroundColor: ROSE + '15', borderColor: ROSE, color: ROSE };
                                        }
                                    } else if (selectedOption === idx) {
                                        btnStyle = { backgroundColor: PURPLE + '20', borderColor: PURPLE, color: TEXT };
                                    }

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => handleOptionSelect(idx)}
                                            disabled={isAnswered}
                                            className="w-full text-left p-4 border transition-all flex items-center justify-between group"
                                            style={btnStyle}
                                        >
                                            <span className="font-medium">{opt}</span>
                                            {isAnswered && idx === currentQuestion.correctIndex && <CheckCircle2 className="w-5 h-5" style={{ color: EMERALD }} />}
                                            {isAnswered && idx === selectedOption && idx !== currentQuestion.correctIndex && <XCircle className="w-5 h-5" style={{ color: ROSE }} />}
                                        </button>
                                    );
                                })}
                            </div>

                            <AnimatePresence>
                                {isAnswered && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mb-8 p-5 border-l-4"
                                        style={{ backgroundColor: BG, borderColor: isCorrect ? EMERALD : ROSE }}
                                    >
                                        <h4 className="font-bold text-sm uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: isCorrect ? EMERALD : ROSE }}>
                                            {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                            {isCorrect ? 'Correct!' : 'Incorrect'}
                                        </h4>
                                        <p className="text-sm" style={{ color: TEXT }}>{currentQuestion.explanation}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="flex justify-end">
                                <button
                                    onClick={handleNext}
                                    disabled={!isAnswered}
                                    className="px-6 py-3 font-bold text-sm flex items-center gap-2 transition-all disabled:opacity-30"
                                    style={{ backgroundColor: isAnswered ? PURPLE : BG, color: isAnswered ? BG : MUTED }}
                                >
                                    {currentIdx < questions.length - 1 ? 'Next Question' : 'View Results'} <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-10"
                        >
                            <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: PURPLE + '20' }}>
                                <Trophy className="w-10 h-10" style={{ color: PURPLE }} />
                            </div>
                            <h3 className="text-3xl font-black tracking-tighter mb-4" style={{ color: TEXT }}>Quiz Complete!</h3>
                            
                            <div className="inline-block p-6 mb-8 border" style={{ backgroundColor: BG, borderColor: 'rgba(83,68,52,0.3)' }}>
                                <p className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: MUTED }}>Your Score</p>
                                <p className="text-5xl font-terminal font-black" style={{ color: score === questions.length ? EMERALD : score > questions.length / 2 ? AMBER : ROSE }}>
                                    {score} <span className="text-2xl" style={{ color: MUTED }}>/ {questions.length}</span>
                                </p>
                            </div>

                            <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: MUTED }}>
                                {score === questions.length 
                                    ? "Perfect score! You've mastered this topic." 
                                    : score >= questions.length / 2 
                                        ? "Good job! You have a solid understanding, but there's room to grow." 
                                        : "Keep learning! Review the material and try again."}
                            </p>

                            <button
                                onClick={handleRestart}
                                className="px-6 py-3 font-bold text-sm flex items-center justify-center gap-2 mx-auto transition-all"
                                style={{ backgroundColor: SURFACE_H, color: TEXT, border: '1px solid rgba(83,68,52,0.3)' }}
                            >
                                <RefreshCw className="w-4 h-4" /> Retake Quiz
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
