import React, { useState } from 'react';
import SetupView from './components/SetupView';
import QuizView from './components/QuizView';
import ResultView from './components/ResultView';
import { ViewState, QuizMode, QuizState } from './types';
import { QUESTIONS } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('SETUP');
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    userAnswers: new Array(QUESTIONS.length).fill(null),
    markedForReview: new Array(QUESTIONS.length).fill(false),
    mode: QuizMode.EXAM,
    startTime: null,
    duration: 50,
    isFinished: false
  });

  const handleStartQuiz = (mode: QuizMode, duration: number) => {
    setQuizState({
      currentQuestionIndex: 0,
      userAnswers: new Array(QUESTIONS.length).fill(null),
      markedForReview: new Array(QUESTIONS.length).fill(false),
      mode,
      duration,
      startTime: Date.now(),
      isFinished: false
    });
    setView('QUIZ');
  };

  const handleAnswer = (questionIndex: number, answerIndex: number) => {
    const newUserAnswers = [...quizState.userAnswers];
    newUserAnswers[questionIndex] = answerIndex;
    setQuizState(prev => ({ ...prev, userAnswers: newUserAnswers }));
  };

  const handleToggleMark = (index: number) => {
    const newMarked = [...quizState.markedForReview];
    newMarked[index] = !newMarked[index];
    setQuizState(prev => ({ ...prev, markedForReview: newMarked }));
  };

  const handleFinish = () => {
    setQuizState(prev => ({ ...prev, isFinished: true }));
    setView('RESULTS');
  };

  const handleReset = () => {
    setView('SETUP');
  };

  const setQuestionIndex = (index: number) => {
    setQuizState(prev => ({ ...prev, currentQuestionIndex: index }));
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white/95 backdrop-blur-md shadow-2xl relative flex flex-col sm:my-8 sm:rounded-[3rem] sm:min-h-[850px] transition-all duration-500">
      {/* Subtle top gradient bar */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 pointer-events-none sm:rounded-t-[3rem]"></div>
      
      <div className="flex-1 z-10 p-4 flex flex-col h-full overflow-hidden">
        {view === 'SETUP' && (
          <SetupView onStart={handleStartQuiz} />
        )}
        {view === 'QUIZ' && (
          <QuizView 
            state={quizState} 
            onAnswer={handleAnswer} 
            onToggleMark={handleToggleMark}
            onFinish={handleFinish}
            setQuestionIndex={setQuestionIndex}
          />
        )}
        {view === 'RESULTS' && (
          <ResultView state={quizState} onRestart={handleReset} />
        )}
      </div>
    </div>
  );
};

export default App;