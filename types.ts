
export enum QuizMode {
  EXAM = 'EXAM',
  PRACTICE = 'PRACTICE'
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface QuizState {
  currentQuestionIndex: number;
  userAnswers: (number | null)[];
  markedForReview: boolean[];
  mode: QuizMode;
  startTime: number | null;
  duration: number; // in minutes
  isFinished: boolean;
}

export type ViewState = 'SETUP' | 'QUIZ' | 'RESULTS';
