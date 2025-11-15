import { Mood, DailyQuest } from "./types";

export const MOOD_OPTIONS: { id: Mood; label: string; color: string }[] = [
  { id: 'motivated', label: 'Motivated', color: 'bg-green-500 hover:bg-green-600' },
  { id: 'stressed', label: 'Stressed', color: 'bg-yellow-500 hover:bg-yellow-600' },
  { id: 'sleepy', label: 'Sleepy', color: 'bg-blue-500 hover:bg-blue-600' },
  { id: 'overwhelmed', label: 'Overwhelmed', color: 'bg-purple-500 hover:bg-purple-600' },
];

export const LOADING_MESSAGES: string[] = [
  "Analyzing quantum note structures...",
  "Forging knowledge crystals...",
  "Erecting the Chrono Canyon...",
  "Simulating the Derivative Minotaur...",
  "Rendering Cell City...",
  "Calibrating difficulty to your mood...",
  "Spawning misconception-based enemies...",
  "Hiding treasure chests with flashcards...",
  "Almost there... the world is taking shape!",
];

// Spaced Repetition System intervals in days
export const SRS_INTERVALS = [1, 2, 7, 14, 30, 90, 180];

// --- Gamification Constants ---

export const XP_PER_SUCCESS = 15;
export const XP_PER_FAILURE = 5;
export const XP_FOR_BOSS_BATTLE_VICTORY = 75;

// XP required to get from level N to N+1
export const getXpToNextLevel = (level: number): number => {
    return Math.floor(50 * Math.pow(level, 2) + 50 * level);
};

type DailyQuestDefinition = Omit<DailyQuest, 'progress' | 'completed'>;

export const ALL_DAILY_QUESTS: DailyQuestDefinition[] = [
  { id: 'dq1', description: 'Complete 3 review sessions', target: 3, reward: 50, type: 'review' },
  { id: 'dq2', description: 'Answer 2 quests correctly', target: 2, reward: 30, type: 'master_quest'},
  { id: 'dq3', description: 'Attempt the boss battle', target: 1, reward: 60, type: 'attempt_boss' },
  { id: 'dq4', description: 'Study 1 treasure flashcard', target: 1, reward: 25, type: 'master_treasure' },
];