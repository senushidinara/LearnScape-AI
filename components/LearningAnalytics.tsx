import React from 'react';
import { UserAnalytics } from '../types';
import { BrainCircuitIcon } from './icons';

interface LearningAnalyticsCardProps {
    analytics: UserAnalytics;
    onAdapt: () => void;
}

export const LearningAnalyticsCard: React.FC<LearningAnalyticsCardProps> = ({ analytics, onAdapt }) => {
    const { questAttempts, questSuccesses, treasureAttempts, bossAttempts } = analytics;
    
    const questAccuracy = questAttempts > 0 ? (questSuccesses / questAttempts) * 100 : 0;
    const totalAttempts = questAttempts + treasureAttempts + bossAttempts;

    if (totalAttempts < 3) {
        return (
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center text-center">
                <BrainCircuitIcon className="h-10 w-10 text-indigo-400 mb-4" />
                <h3 className="text-xl font-bold text-indigo-300">Learning Style Analysis</h3>
                <p className="text-gray-400 mt-2">Engage with more activities in this world to unlock your learning style report and adapt your journey!</p>
            </div>
        );
    }
    
    const preferredActivity = questAttempts >= treasureAttempts ? 'Quests & Challenges' : 'Flashcards & Review';

    return (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 flex flex-col hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-4">
                <BrainCircuitIcon className="h-8 w-8 text-indigo-400" />
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Your Learning Style</h3>
            </div>
            <div className="space-y-3 text-gray-300">
                <div className="flex justify-between">
                    <span>Quest Accuracy:</span>
                    <span className="font-bold">{questAccuracy.toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                    <span>Preferred Activity:</span>
                    <span className="font-bold">{preferredActivity}</span>
                </div>
                <p className="text-sm text-gray-400 pt-2">The AI has analyzed your interactions to understand how you learn best.</p>
            </div>
            <button
                onClick={onAdapt}
                className="mt-6 w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-indigo-500/20 transform hover:scale-105 transition-all duration-300"
            >
                Adapt World to My Style
            </button>
        </div>
    );
};
