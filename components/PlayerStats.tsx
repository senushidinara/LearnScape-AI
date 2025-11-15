import React from 'react';
import { PlayerState, DailyQuest } from '../types';

export const PlayerStatsBar: React.FC<{ playerState: PlayerState }> = ({ playerState }) => {
    const { level, xp, xpToNextLevel } = playerState;
    const xpPercentage = xpToNextLevel > 0 ? (xp / xpToNextLevel) * 100 : 0;

    return (
        <div className="w-full max-w-xs bg-gray-800/50 border border-gray-700 rounded-xl p-4 shadow-lg">
            <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-lg text-white">Level {level}</span>
                <span className="text-sm font-medium text-gray-400">{xp} / {xpToNextLevel} XP</span>
            </div>
            <div className="w-full bg-gray-900/50 rounded-full h-2.5">
                <div 
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${xpPercentage}%`}}
                ></div>
            </div>
        </div>
    );
};

export const DailyQuestsCard: React.FC<{ quests: DailyQuest[] }> = ({ quests }) => {
    return (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 flex flex-col hover:border-purple-500 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 transform hover:-translate-y-1">
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500 mb-4">Daily Quests</h3>
            <div className="space-y-4">
                {quests.length > 0 ? quests.map(quest => {
                    const progressPercentage = quest.target > 0 ? (quest.progress / quest.target) * 100 : 0;
                    return (
                        <div key={quest.id}>
                            <p className={`text-gray-300 ${quest.completed ? 'line-through text-gray-500' : ''}`}>{quest.description}</p>
                            <div className="flex items-center gap-3 mt-2">
                                <div className="w-full bg-gray-700 rounded-full h-2 flex-grow">
                                    <div 
                                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                        style={{width: `${progressPercentage}%`}}
                                    ></div>
                                </div>
                                <span className="text-sm font-semibold text-gray-400">{quest.progress}/{quest.target}</span>
                            </div>
                            {quest.completed && (
                                <p className="text-right text-sm font-bold text-yellow-400 mt-1">+ {quest.reward} XP</p>
                            )}
                        </div>
                    )
                }) : (
                    <p className="text-gray-500 text-center py-4">No daily quests available.</p>
                )}
            </div>
        </div>
    );
};
