
import React from 'react';
import { QuizState } from '../types';
import { QUESTIONS } from '../constants';

interface ResultViewProps {
  state: QuizState;
  onRestart: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ state, onRestart }) => {
  const correctCount = state.userAnswers.reduce((acc, ans, idx) => {
    return acc + (ans === QUESTIONS[idx].correctAnswer ? 1 : 0);
  }, 0);

  const percentage = Math.round((correctCount / QUESTIONS.length) * 100);

  return (
    <div className="flex flex-col items-center py-12 animate-fadeIn h-full">
      <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Quiz Completed!</h1>
      <p className="text-slate-500 mb-12">Here's how you performed</p>

      {/* Score Card */}
      <div className="w-full bg-slate-50 rounded-3xl p-8 mb-8 text-center border border-slate-100">
        <div className="text-5xl font-black text-indigo-600 mb-2">{percentage}%</div>
        <p className="text-slate-600 font-medium">You scored {correctCount} out of {QUESTIONS.length}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 w-full mb-12 px-2">
        <div className="bg-white p-5 rounded-3xl border-2 border-slate-50 text-center">
          <div className="text-green-500 font-bold text-xl">{correctCount}</div>
          <div className="text-xs text-slate-400 uppercase tracking-wider">Correct</div>
        </div>
        <div className="bg-white p-5 rounded-3xl border-2 border-slate-50 text-center">
          <div className="text-red-500 font-bold text-xl">{QUESTIONS.length - correctCount}</div>
          <div className="text-xs text-slate-400 uppercase tracking-wider">Incorrect</div>
        </div>
      </div>

      {/* Encouragement Message */}
      <div className="px-6 text-center mb-12">
        <p className="text-slate-600 leading-relaxed italic">
          {percentage >= 80 
            ? "Excellent performance! You have a deep understanding of the Mahajanapada period."
            : percentage >= 50 
            ? "Good job! You know the basics well, but there's room for improvement in specific areas."
            : "Keep studying! The Mahajanapada era is complex. Try the Practice mode for better insights."}
        </p>
      </div>

      <div className="w-full space-y-4 px-4 mt-auto">
        <button 
          onClick={onRestart}
          className="w-full py-4 rounded-3xl font-bold bg-indigo-600 text-white shadow-indigo-100 shadow-xl hover:bg-indigo-700 transition-all"
        >
          Back to Setup
        </button>
      </div>
    </div>
  );
};

export default ResultView;
