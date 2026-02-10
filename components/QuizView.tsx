import React, { useState, useEffect, useRef } from 'react';
import { QuizState, QuizMode } from '../types';
import { QUESTIONS } from '../constants';
import { getDetailedExplanation } from '../services/geminiService';

interface QuizViewProps {
  state: QuizState;
  onAnswer: (qIdx: number, aIdx: number) => void;
  onToggleMark: (qIdx: number) => void;
  onFinish: () => void;
  setQuestionIndex: (index: number) => void;
}

const QuizView: React.FC<QuizViewProps> = ({ state, onAnswer, onToggleMark, onFinish, setQuestionIndex }) => {
  const [timeLeft, setTimeLeft] = useState(state.duration * 60);
  const [loadingExplanation, setLoadingExplanation] = useState(false);
  const [detailedExplanation, setDetailedExplanation] = useState<string | null>(null);
  const paletteRef = useRef<HTMLDivElement>(null);

  const currentQuestion = QUESTIONS[state.currentQuestionIndex];
  const userAnswer = state.userAnswers[state.currentQuestionIndex];
  const isMarked = state.markedForReview[state.currentQuestionIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onFinish]);

  useEffect(() => {
    const activeBtn = paletteRef.current?.querySelector(`[data-index="${state.currentQuestionIndex}"]`);
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [state.currentQuestionIndex]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleOptionClick = async (idx: number) => {
    if (state.mode === QuizMode.PRACTICE && userAnswer !== null) return;
    onAnswer(state.currentQuestionIndex, idx);

    if (state.mode === QuizMode.PRACTICE) {
      setLoadingExplanation(true);
      const expl = await getDetailedExplanation(currentQuestion.question, currentQuestion.options[currentQuestion.correctAnswer]);
      setDetailedExplanation(expl);
      setLoadingExplanation(false);
    }
  };

  const nextQuestion = () => {
    setDetailedExplanation(null);
    if (state.currentQuestionIndex < QUESTIONS.length - 1) {
      setQuestionIndex(state.currentQuestionIndex + 1);
    } else {
      onFinish();
    }
  };

  const prevQuestion = () => {
    setDetailedExplanation(null);
    if (state.currentQuestionIndex > 0) {
      setQuestionIndex(state.currentQuestionIndex - 1);
    }
  };

  const progress = ((state.currentQuestionIndex + 1) / QUESTIONS.length) * 100;

  return (
    <div className="flex flex-col h-full animate-fadeIn relative">
      <div className="flex justify-between items-center mb-3">
        <div className="text-slate-400 text-xs font-bold uppercase tracking-widest">
          Geography Quiz
        </div>
        <div className={`px-4 py-1.5 rounded-full font-mono font-bold text-sm ${timeLeft < 60 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-700'}`}>
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="w-full h-1.5 bg-slate-100 rounded-full mb-4 overflow-hidden">
        <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      {/* Dynamic Palette */}
      <div ref={paletteRef} className="flex overflow-x-auto gap-2 pb-4 mb-4 no-scrollbar -mx-2 px-2 scroll-smooth">
        {QUESTIONS.map((_, idx) => {
          const isAns = state.userAnswers[idx] !== null;
          const isM = state.markedForReview[idx];
          const isCurr = state.currentQuestionIndex === idx;

          let colorClass = 'bg-red-500 text-white'; // Default (Red)
          if (isAns) {
            colorClass = 'bg-green-500 text-white'; // Answered (Green)
          } else if (isM) {
            colorClass = 'bg-yellow-400 text-white'; // Marked but no answer (Yellow)
          }

          return (
            <button
              key={idx}
              data-index={idx}
              onClick={() => {
                setQuestionIndex(idx);
                setDetailedExplanation(null);
              }}
              className={`flex-shrink-0 w-10 h-10 rounded-xl font-bold transition-all duration-200 flex items-center justify-center text-sm border-2 shadow-sm ${colorClass} ${isCurr ? 'border-black ring-4 ring-indigo-100 scale-110' : 'border-transparent'}`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      <div className="flex justify-between items-start mb-4">
        <h2 className="text-lg font-bold text-slate-800 leading-relaxed pr-8">
          <span className="text-indigo-500 mr-2">Q{state.currentQuestionIndex + 1}.</span>
          {currentQuestion.question}
        </h2>
        <button 
          onClick={() => onToggleMark(state.currentQuestionIndex)}
          className={`p-2 rounded-xl transition-all ${isMarked ? 'bg-amber-100 text-amber-600 scale-110' : 'bg-slate-50 text-slate-300 hover:text-slate-400'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isMarked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-4 pr-1">
        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            let bgColor = 'bg-white';
            let borderColor = 'border-slate-100';
            let textColor = 'text-slate-700';

            if (userAnswer === idx) {
              if (state.mode === QuizMode.PRACTICE) {
                if (idx === currentQuestion.correctAnswer) {
                  bgColor = 'bg-green-50';
                  borderColor = 'border-green-500';
                  textColor = 'text-green-700';
                } else {
                  bgColor = 'bg-red-50';
                  borderColor = 'border-red-500';
                  textColor = 'text-red-700';
                }
              } else {
                bgColor = 'bg-indigo-50';
                borderColor = 'border-indigo-500';
                textColor = 'text-indigo-700';
              }
            } else if (state.mode === QuizMode.PRACTICE && userAnswer !== null && idx === currentQuestion.correctAnswer) {
              bgColor = 'bg-green-50';
              borderColor = 'border-green-500';
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 flex items-center ${bgColor} ${borderColor} ${textColor} hover:shadow-md group`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 font-bold shrink-0 transition-colors ${userAnswer === idx ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className="text-[15px] font-medium leading-tight">{option}</span>
              </button>
            );
          })}
        </div>

        {state.mode === QuizMode.PRACTICE && userAnswer !== null && (
          <div className="mt-6 p-5 bg-slate-50 rounded-3xl border border-slate-200 animate-slideUp">
            <h4 className="font-bold text-slate-800 mb-2 flex items-center text-sm">AI Insight</h4>
            <div className="text-slate-600 text-sm leading-relaxed italic">
              {loadingExplanation ? "Analyzing..." : (detailedExplanation || currentQuestion.explanation)}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 pb-2">
        <div className="flex gap-3 mb-3">
          <button onClick={prevQuestion} disabled={state.currentQuestionIndex === 0} className="flex-1 py-4 rounded-2xl font-bold bg-white text-slate-700 border-2 border-slate-100 disabled:opacity-50">Previous</button>
          <button onClick={nextQuestion} className="flex-1 py-4 rounded-2xl font-bold bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700">
            {state.currentQuestionIndex === QUESTIONS.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
        <button onClick={() => onToggleMark(state.currentQuestionIndex)} className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center border-2 transition-all ${isMarked ? 'bg-amber-50 border-amber-300 text-amber-700' : 'bg-white border-slate-100 text-slate-500'}`}>
          {isMarked ? "Unmark Review" : "Mark for Review"}
        </button>
      </div>
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
    </div>
  );
};

export default QuizView;