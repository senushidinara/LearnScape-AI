import React from 'react';
import { WorldData, QuizQuestion, Flashcard } from '../types';
import { LibraryIcon } from './icons';
import { MasteryStars } from './WorldScreen';

interface KnowledgeCompendiumCardProps {
    onClick: () => void;
}

export const KnowledgeCompendiumCard: React.FC<KnowledgeCompendiumCardProps> = ({ onClick }) => (
    <div 
        className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 flex flex-col hover:border-teal-500 hover:shadow-2xl hover:shadow-teal-500/10 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
        onClick={onClick}
    >
        <div className="flex items-center gap-3 mb-4">
            <LibraryIcon className="h-8 w-8 text-teal-400" />
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500">Knowledge Compendium</h3>
        </div>
        <p className="text-gray-400 mt-2 flex-grow">
            Your personal, auto-generated study guide. Review all your discovered concepts and track your mastery at any time.
        </p>
        <div className="mt-6">
            <div className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white text-center font-bold py-3 px-4 rounded-lg shadow-lg shadow-teal-500/20">
                Open Compendium
            </div>
        </div>
    </div>
);

interface KnowledgeCompendiumModalProps {
    worldData: WorldData;
    maxMasteryLevel: number;
    onClose: () => void;
    onReviewItem: (item: QuizQuestion | Flashcard, zoneName: string) => void;
}

const CompendiumItem: React.FC<{ item: QuizQuestion | Flashcard; type: 'Quest' | 'Treasure'; zoneName: string; maxMasteryLevel: number; onReviewItem: (item: QuizQuestion | Flashcard, zoneName: string) => void }> = ({ item, type, zoneName, maxMasteryLevel, onReviewItem }) => {
    const isQuest = 'question' in item;
    const title = isQuest ? (item as QuizQuestion).question : (item as Flashcard).term;
    const description = isQuest ? (item as QuizQuestion).explanation : (item as Flashcard).definition;

    return (
        <div className="bg-gray-900/50 p-4 rounded-lg">
            <div className="flex justify-between items-start gap-4">
                <div className="flex-grow">
                    <p className="text-sm font-bold text-purple-400">{type}</p>
                    <p className="font-semibold text-white mt-1">{title}</p>
                    <p className="text-sm text-gray-400 mt-2">{description}</p>
                </div>
                <div className="flex-shrink-0 w-32 text-right">
                     <button onClick={() => onReviewItem(item, zoneName)} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-3 rounded-md text-sm transition-colors">
                        Review Now
                    </button>
                    <p className="text-xs text-gray-500 mt-2">
                        Next: {new Date(item.nextReviewDate).toLocaleDateString()}
                    </p>
                </div>
            </div>
            <div className="mt-3">
                <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-gray-400">Mastery</span>
                    <MasteryStars level={item.masteryLevel} maxLevel={maxMasteryLevel} starClassName="h-3 w-3" />
                </div>
            </div>
        </div>
    );
};

export const KnowledgeCompendiumModal: React.FC<KnowledgeCompendiumModalProps> = ({ worldData, maxMasteryLevel, onClose, onReviewItem }) => {
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div 
                className="bg-gray-800 rounded-2xl shadow-2xl shadow-purple-500/20 border border-gray-700 w-full max-w-4xl h-[90vh] flex flex-col p-6 md:p-8 transform transition-all duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-start mb-6 flex-shrink-0">
                    <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500">Knowledge Compendium</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl">&times;</button>
                </div>
                <div className="overflow-y-auto space-y-8 pr-4 -mr-4">
                    {worldData.zones.map(zone => (
                        <details key={zone.name} open className="group">
                            <summary className="text-2xl font-bold list-none cursor-pointer" style={{color: zone.themeColor}}>
                                <span className="group-open:rotate-90 inline-block transition-transform mr-2">&gt;</span>
                                {zone.name}
                            </summary>
                            <div className="pl-6 mt-4 space-y-4 border-l-2 border-gray-700">
                               <CompendiumItem item={zone.quest} type="Quest" zoneName={zone.name} maxMasteryLevel={maxMasteryLevel} onReviewItem={onReviewItem} />
                               <CompendiumItem item={zone.treasure} type="Treasure" zoneName={zone.name} maxMasteryLevel={maxMasteryLevel} onReviewItem={onReviewItem} />
                            </div>
                        </details>
                    ))}
                </div>
            </div>
        </div>
    );
};
