import React from 'react';
import { UsersIcon } from './icons';

export const MultiplayerArenaCard: React.FC = () => {
    return (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 flex flex-col hover:border-cyan-500 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 transform hover:-translate-y-1 relative">
            <div className="flex items-center gap-3 mb-4">
                <UsersIcon className="h-8 w-8 text-cyan-400" />
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-500">Multiplayer Arena</h3>
            </div>
            
            <p className="text-gray-400 mt-2 flex-grow">Team up with friends to conquer challenges and earn group rewards. Learning is better together!</p>
            
            <div className="mt-6 border-t-2 border-dashed border-gray-700 pt-4 space-y-3">
                <h4 className="font-bold text-lg text-cyan-300">Co-op Activities:</h4>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                    <li>Team Quizzes</li>
                    <li>Synchronous Boss Fights</li>
                    <li>Group Study Streaks</li>
                </ul>
            </div>
            
            <div className="mt-6">
                <button 
                    disabled 
                    className="w-full bg-gradient-to-r from-cyan-600 to-sky-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-cyan-500/20 opacity-50 cursor-not-allowed"
                    title="Coming Soon!"
                >
                    Join Arena (Coming Soon!)
                </button>
            </div>
        </div>
    );
};
