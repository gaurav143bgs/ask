import React, { useState } from 'react';
import { QuizMode } from '../types';

interface SetupViewProps {
  onStart: (mode: QuizMode, duration: number) => void;
}

const SetupView: React.FC<SetupViewProps> = ({ onStart }) => {
  const [selectedMode, setSelectedMode] = useState<QuizMode | null>(null);
  const [duration, setDuration] = useState<number>(50);

  const handleStart = () => {
    if (selectedMode) {
      onStart(selectedMode, duration);
    }
  };

  return (
    <div className="flex flex-col items-center pt-8 pb-12 animate-fadeIn">
      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-700 rounded-3xl flex items-center justify-center shadow-lg mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M12 14l9-5-9-5-9 5 9 5z" />
          <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h.105M3 10a7 7 0 1014 0 7 7 0 00-14 0z" />
        </svg>
      </div>

      <h1 className="text-2xl font-bold text-center text-slate-800 leading-snug px-4">
        'Geography (भूगोल) - सामान्य परिचय एवं ब्रह्मांड @vikasNCERT'
      </h1>
      <p className="text-slate-500 mt-2 mb-8 italic">Geography Image Based MCQ - 50 Questions</p>

      <div className="w-full space-y-4 px-4 mb-8">
        <button 
          onClick={() => setSelectedMode(QuizMode.EXAM)}
          className={`w-full flex items-center p-5 rounded-3xl border-2 transition-all duration-200 ${selectedMode === QuizMode.EXAM ? 'border-indigo-500 bg-indigo-50 shadow-md' : 'border-slate-100 bg-white hover:border-slate-200'}`}
        >
          <div className="w-14 h-14 bg-pink-100 rounded-2xl flex items-center justify-center mr-4">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
             </svg>
          </div>
          <div className="text-left">
            <h3 className="font-bold text-slate-800 text-lg">Exam Mode</h3>
            <p className="text-sm text-slate-500">Fixed time, full results at the end</p>
          </div>
        </button>

        <button 
          onClick={() => setSelectedMode(QuizMode.PRACTICE)}
          className={`w-full flex items-center p-5 rounded-3xl border-2 transition-all duration-200 ${selectedMode === QuizMode.PRACTICE ? 'border-sky-500 bg-sky-50 shadow-md' : 'border-slate-100 bg-white hover:border-slate-200'}`}
        >
          <div className="w-14 h-14 bg-sky-100 rounded-2xl flex items-center justify-center mr-4">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
          </div>
          <div className="text-left">
            <h3 className="font-bold text-slate-800 text-lg">Practice Mode</h3>
            <p className="text-sm text-slate-500">AI explanations after every answer</p>
          </div>
        </button>
      </div>

      <div className="w-full px-6 mb-8">
        <label className="flex items-center text-slate-700 font-semibold mb-3">
          Timer (minutes)
        </label>
        <div className="relative">
          <input 
            type="number" 
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
            className="w-full p-4 rounded-2xl border-2 border-slate-100 bg-white text-slate-800 focus:outline-none focus:border-indigo-300"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none">Min</span>
        </div>
      </div>

      <div className="w-full px-4 mt-auto">
        <button 
          disabled={!selectedMode}
          onClick={handleStart}
          className={`w-full py-4 rounded-3xl font-bold flex items-center justify-center transition-all ${selectedMode ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
        >
          Start Geography Quiz
        </button>
      </div>
    </div>
  );
};

export default SetupView;
