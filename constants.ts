
import { Mood } from "./types";

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
