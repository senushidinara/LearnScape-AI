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

export interface InteractiveChallenge {
  type: 'math-plot';
  title: string;
  description: string;
  data: string; // SVG data as a string
}

export interface Zone {
  name: string;
  description: string;
  themeColor: string;
  quest: QuizQuestion;
  treasure: Flashcard;
  interactiveChallenge?: InteractiveChallenge;
}

export interface Boss {
  name: string;
  description: string;
  weakness: string;
  battle: QuizQuestion[];
}

export interface ConceptMapNode {
  id: string;
  label: string;
  x: number;
  y: number;
}

export interface ConceptMapEdge {
  from: string;
  to: string;
  label?: string;
}

export interface ConceptMap {
  nodes: ConceptMapNode[];
  edges: ConceptMapEdge[];
}

export interface WorldData {
  worldName: string;
  description: string;
  zones: Zone[];
  boss: Boss;
  conceptMap: ConceptMap;
  sourceNotes: string;
}

export interface PlayerState {
  level: number;
  xp: number;
  xpToNextLevel: number;
}

export interface DailyQuest {
  id:string;
  description: string;
  target: number;
  progress: number;
  completed: boolean;
  reward: number; // XP
  type: 'review' | 'master_treasure' | 'attempt_boss' | 'master_quest';
}

export interface UserAnalytics {
  questAttempts: number;
  questSuccesses: number;
  treasureAttempts: number;
  bossAttempts: number;
  bossSuccesses: number;
}
