export type Mood = 'motivated' | 'stressed' | 'sleepy' | 'overwhelmed';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  masteryLevel: number;
  nextReviewDate: string; // ISO date string
}

export interface Flashcard {
  id: string;
  term: string;
  definition: string;
  masteryLevel: number;
  nextReviewDate: string; // ISO date string
}

export interface Zone {
  name: string;
  description: string;
  themeColor: string;
  quest: QuizQuestion;
  treasure: Flashcard;
}

export interface Boss {
  name: string;
  description: string;
  weakness: string;
  battle: QuizQuestion[];
}

export interface WorldData {
  worldName: string;
  description: string;
  zones: Zone[];
  boss: Boss;
}
