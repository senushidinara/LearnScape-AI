import React, { useState } from 'react';
import { WorldData, Zone, Boss, QuizQuestion, Flashcard } from '../types';
import QuestModal from './QuestModal';
import { SwordIcon, BookIcon, ChestIcon } from './icons';

interface WorldScreenProps {
  worldData: WorldData;
  onBack: () => void;
  onUpdateMastery: (itemId: string, success: boolean) => void;
}

const isReviewDue = (reviewDate: string): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextReview = new Date(reviewDate);
    return nextReview <= today;
}

const ZoneCard: React.FC<{ zone: Zone; onStartQuest: () => void; onOpenTreasure: () => void }> = ({ zone, onStartQuest, onOpenTreasure }) => {
    const questReviewDue = isReviewDue(zone.quest.nextReviewDate);
    const treasureReviewDue = isReviewDue(zone.treasure.nextReviewDate);

    return (
        <div className={`bg-gray-800/50 border border-gray-700 rounded-xl p-6 flex flex-col hover:border-purple-500 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 transform hover:-translate-y-1 relative`}>
            {(questReviewDue || treasureReviewDue) && (
                <div className="absolute top-0 right-0 -mt-2 -mr-2 px-3 py-1 bg-yellow-500 text-black text-xs font-bold rounded-full shadow-lg animate-pulse">
                    Review Due
                </div>
            )}
            <h3 className="text-2xl font-bold" style={{color: zone.themeColor}}>{zone.name}</h3>
            <p className="text-gray-400 mt-2 flex-grow">{zone.description}</p>
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <button onClick={onStartQuest} className={`flex-1 flex items-center justify-center gap-2 font-semibold py-2 px-4 rounded-lg transition-colors ${questReviewDue ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}>
                    <BookIcon className="h-5 w-5" /> {questReviewDue ? 'Review Quest' : 'Start Quest'}
                </button>
                <button onClick={onOpenTreasure} className={`flex-1 flex items-center justify-center gap-2 font-semibold py-2 px-4 rounded-lg transition-colors ${treasureReviewDue ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}>
                    <ChestIcon className="h-5 w-5" /> {treasureReviewDue ? 'Review Treasure' : 'Open Treasure'}
                </button>
            </div>
        </div>
    );
}

const BossBattleCard: React.FC<{ boss: Boss; onStartBattle: () => void }> = ({ boss, onStartBattle }) => (
    <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-red-900/30 border border-red-500 rounded-xl p-8 text-center flex flex-col items-center hover:bg-red-900/50 transition-colors duration-300">
        <h2 className="text-4xl font-extrabold text-red-300">BOSS BATTLE</h2>
        <h3 className="text-3xl font-bold mt-2 text-white">{boss.name}</h3>
        <p className="text-red-200 mt-4 max-w-2xl">{boss.description}</p>
        <p className="text-yellow-400 font-semibold mt-2">Weakness: {boss.weakness}</p>
        <button onClick={onStartBattle} className="mt-8 flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg shadow-red-500/20 transform hover:scale-105 transition-all duration-300">
            <SwordIcon className="h-6 w-6" /> Face The Challenge
        </button>
    </div>
);


const WorldScreen: React.FC<WorldScreenProps> = ({ worldData, onBack, onUpdateMastery }) => {
    const [modalContent, setModalContent] = useState<{ type: 'quest' | 'treasure' | 'battle'; data: QuizQuestion[] | Flashcard; title: string; } | null>(null);

    const handleStartQuest = (zone: Zone) => {
        setModalContent({ type: 'quest', data: [zone.quest], title: `${zone.name} Quest`});
    }

    const handleOpenTreasure = (zone: Zone) => {
        setModalContent({ type: 'treasure', data: zone.treasure, title: `${zone.name} Treasure`});
    }

    const handleStartBattle = (boss: Boss) => {
        setModalContent({ type: 'battle', data: boss.battle, title: `Boss Battle: ${boss.name}`});
    }

    return (
        <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
            <header className="text-center mb-12">
                <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
                    {worldData.worldName}
                </h1>
                <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">{worldData.description}</p>
                 <button onClick={onBack} className="mt-6 text-sm text-purple-400 hover:text-purple-300 transition-colors">
                    &larr; Generate a new world
                </button>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {worldData.zones.map((zone, index) => (
                    <ZoneCard 
                        key={index} 
                        zone={zone}
                        onStartQuest={() => handleStartQuest(zone)}
                        onOpenTreasure={() => handleOpenTreasure(zone)}
                    />
                ))}
                
                <BossBattleCard 
                    boss={worldData.boss} 
                    onStartBattle={() => handleStartBattle(worldData.boss)}
                />
            </div>

            {modalContent && (
                 <QuestModal 
                    type={modalContent.type}
                    data={modalContent.data}
                    title={modalContent.title}
                    onClose={() => setModalContent(null)}
                    onUpdateMastery={onUpdateMastery}
                />
            )}
        </div>
    );
};

export default WorldScreen;
