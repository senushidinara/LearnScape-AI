
import React, { useState, useMemo } from 'react';
import { WorldData, Zone, Boss, QuizQuestion, Flashcard, PlayerState, DailyQuest, UserAnalytics } from '../types';
import QuestModal from './QuestModal';
import { SwordIcon, BookIcon, ChestIcon, BellIcon, BrainCircuitIcon, StarIcon } from './icons';
import ConceptMapCard from './ConceptMap';
import { PlayerStatsBar, DailyQuestsCard } from './PlayerStats';
import { LearningAnalyticsCard } from './LearningAnalytics';
import { MultiplayerArenaCard } from './Multiplayer';
import { KnowledgeCompendiumCard, KnowledgeCompendiumModal } from './KnowledgeCompendium';

interface WorldScreenProps {
  worldData: WorldData;
  playerState: PlayerState;
  dailyQuests: DailyQuest[];
  userAnalytics: UserAnalytics;
  onNewWorld: () => void;
  onPreviousWorld: () => void;
  onNextWorld: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  onUpdateMastery: (itemId: string, success: boolean, itemType: 'quest' | 'treasure' | 'boss_question') => void;
  onAttemptBoss: () => void;
  onAdaptWorld: () => void;
  maxMasteryLevel: number;
}

const isReviewDue = (reviewDate: string): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextReview = new Date(reviewDate);
    return nextReview <= today;
}

export const MasteryStars: React.FC<{ level: number, maxLevel: number, starClassName?: string }> = ({ level, maxLevel, starClassName = 'h-4 w-4' }) => {
    const totalStars = maxLevel - 1;
    if (totalStars <= 0) return null;

    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: totalStars }).map((_, index) => (
                <StarIcon 
                    key={index}
                    className={`${starClassName} transition-colors duration-300 ${index < level ? 'text-yellow-400' : 'text-gray-600'}`}
                />
            ))}
        </div>
    );
};

const ZoneCard: React.FC<{ zone: Zone; onStartQuest: () => void; onOpenTreasure: () => void; maxMasteryLevel: number }> = ({ zone, onStartQuest, onOpenTreasure, maxMasteryLevel }) => {
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
            
            {zone.interactiveChallenge && (
                <div className="mt-6 border-t-2 border-dashed border-gray-700 pt-4 space-y-3">
                    <div className="flex items-center gap-3">
                        <BrainCircuitIcon className="h-6 w-6 text-indigo-400" />
                        <h4 className="font-bold text-lg text-indigo-300">{zone.interactiveChallenge.title}</h4>
                    </div>
                    <p className="text-sm text-gray-400">{zone.interactiveChallenge.description}</p>
                    <div className="bg-gray-900/50 rounded-lg p-2 aspect-video overflow-hidden border border-gray-700">
                        <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: zone.interactiveChallenge.data }} />
                    </div>
                </div>
            )}

            <div className="mt-6 space-y-4">
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-300">Quest Mastery</span>
                        <MasteryStars level={zone.quest.masteryLevel} maxLevel={maxMasteryLevel} />
                    </div>
                    <button onClick={onStartQuest} className={`w-full flex items-center justify-center gap-2 font-semibold py-2 px-4 rounded-lg transition-colors ${questReviewDue ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}>
                        <BookIcon className="h-5 w-5" /> {questReviewDue ? 'Review Quest' : 'Start Quest'}
                    </button>
                </div>
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-300">Treasure Mastery</span>
                         <MasteryStars level={zone.treasure.masteryLevel} maxLevel={maxMasteryLevel} />
                    </div>
                    <button onClick={onOpenTreasure} className={`w-full flex items-center justify-center gap-2 font-semibold py-2 px-4 rounded-lg transition-colors ${treasureReviewDue ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}>
                        <ChestIcon className="h-5 w-5" /> {treasureReviewDue ? 'Review Treasure' : 'Open Treasure'}
                    </button>
                </div>
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

interface ReviewableItem {
    type: 'quest' | 'treasure';
    item: QuizQuestion | Flashcard;
    zone: Zone;
}

const ReviewHubModal: React.FC<{ items: ReviewableItem[], onStartReview: (item: ReviewableItem) => void, onClose: () => void }> = ({ items, onStartReview, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div 
                className="bg-gray-800 rounded-2xl shadow-2xl shadow-purple-500/20 border border-gray-700 w-full max-w-2xl max-h-[90vh] p-8 transform transition-all duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-start mb-6">
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Review Hub</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>
                {items.length > 0 ? (
                    <div className="space-y-4 overflow-y-auto max-h-[60vh]">
                        {items.map((reviewItem, index) => (
                            <div key={index} className="bg-gray-900/50 p-4 rounded-lg flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-lg">{reviewItem.type === 'quest' ? (reviewItem.item as QuizQuestion).question.substring(0, 50) + '...' : (reviewItem.item as Flashcard).term}</p>
                                    <p className="text-sm text-gray-400">In <span style={{color: reviewItem.zone.themeColor}}>{reviewItem.zone.name}</span></p>
                                </div>
                                <button onClick={() => onStartReview(reviewItem)} className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg">
                                    Review Now
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-400 py-8">No items are due for review. Great job staying on top of your learning!</p>
                )}
            </div>
        </div>
    );
};


const WorldScreen: React.FC<WorldScreenProps> = ({ worldData, playerState, dailyQuests, userAnalytics, onNewWorld, onPreviousWorld, onNextWorld, canGoPrevious, canGoNext, onUpdateMastery, onAttemptBoss, onAdaptWorld, maxMasteryLevel }) => {
    const [modalContent, setModalContent] = useState<{ type: 'quest' | 'treasure' | 'battle'; data: QuizQuestion[] | Flashcard; title: string; } | null>(null);
    const [isReviewHubOpen, setIsReviewHubOpen] = useState(false);
    const [isCompendiumOpen, setIsCompendiumOpen] = useState(false);

    const reviewableItems = useMemo<ReviewableItem[]>(() => {
        const items: ReviewableItem[] = [];
        worldData.zones.forEach(zone => {
            if (isReviewDue(zone.quest.nextReviewDate)) {
                items.push({ type: 'quest', item: zone.quest, zone });
            }
            if (isReviewDue(zone.treasure.nextReviewDate)) {
                items.push({ type: 'treasure', item: zone.treasure, zone });
            }
        });
        return items;
    }, [worldData]);
    
    const handleStartQuest = (zone: Zone) => {
        setModalContent({ type: 'quest', data: [zone.quest], title: `${zone.name} Quest`});
    }

    const handleOpenTreasure = (zone: Zone) => {
        setModalContent({ type: 'treasure', data: zone.treasure, title: `${zone.name} Treasure`});
    }

    const handleStartBattle = (boss: Boss) => {
        setModalContent({ type: 'battle', data: boss.battle, title: `Boss Battle: ${boss.name}`});
    }

    const handleStartReviewFromHub = (reviewItem: ReviewableItem) => {
        setIsReviewHubOpen(false);
        if (reviewItem.type === 'quest') {
            setModalContent({ type: 'quest', data: [reviewItem.item as QuizQuestion], title: `${reviewItem.zone.name} Quest Review` });
        } else {
            setModalContent({ type: 'treasure', data: reviewItem.item as Flashcard, title: `${reviewItem.zone.name} Treasure Review` });
        }
    };

    const handleReviewFromCompendium = (item: QuizQuestion | Flashcard, zoneName: string) => {
        setIsCompendiumOpen(false); // Close compendium first
        if ('question' in item) { // It's a QuizQuestion
            setModalContent({ type: 'quest', data: [item], title: `${zoneName} Quest Review` });
        } else { // It's a Flashcard
            setModalContent({ type: 'treasure', data: item, title: `${zoneName} Treasure Review` });
        }
    };


    const handleSessionComplete = () => {
        if (modalContent?.type === 'battle') {
            onAttemptBoss();
        }
        setModalContent(null);
    };

    return (
        <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
            <header className="mb-12">
                <div className="text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
                        {worldData.worldName}
                    </h1>
                    <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">{worldData.description}</p>
                </div>
                <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-6">
                    <PlayerStatsBar playerState={playerState} />
                    <div className="flex items-center gap-6">
                         <div className="flex items-center justify-center gap-2 bg-gray-800/50 border border-gray-700 px-3 py-1.5 rounded-full">
                            <button onClick={onPreviousWorld} disabled={!canGoPrevious} className="text-xl px-3 py-1 rounded-full hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                                ←
                            </button>
                            <button onClick={onNewWorld} className="text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors px-4 py-1">
                                New World
                            </button>
                            <button onClick={onNextWorld} disabled={!canGoNext} className="text-xl px-3 py-1 rounded-full hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                                →
                            </button>
                        </div>
                        {reviewableItems.length > 0 && (
                            <button onClick={() => setIsReviewHubOpen(true)} className="group flex items-center gap-2 bg-yellow-500/20 text-yellow-300 px-4 py-2 rounded-lg border border-yellow-500 hover:bg-yellow-500/30 transition-colors">
                                <div className="relative">
                                    <BellIcon className="h-6 w-6" />
                                    <div className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-75"></span>
                                        <span className="relative inline-flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500 text-xs font-bold text-black">
                                            {reviewableItems.length}
                                        </span>
                                    </div>
                                </div>
                                <span className="font-semibold">Review Hub</span>
                            </button>
                        )}
                    </div>
                </div>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <DailyQuestsCard quests={dailyQuests} />

                <LearningAnalyticsCard analytics={userAnalytics} onAdapt={onAdaptWorld} />

                <MultiplayerArenaCard />
                
                <KnowledgeCompendiumCard onClick={() => setIsCompendiumOpen(true)} />

                {worldData.zones.map((zone, index) => (
                    <ZoneCard 
                        key={index} 
                        zone={zone}
                        onStartQuest={() => handleStartQuest(zone)}
                        onOpenTreasure={() => handleOpenTreasure(zone)}
                        maxMasteryLevel={maxMasteryLevel}
                    />
                ))}

                {worldData.conceptMap && <ConceptMapCard conceptMap={worldData.conceptMap} />}
                
                <BossBattleCard 
                    boss={worldData.boss} 
                    onStartBattle={() => handleStartBattle(worldData.boss)}
                />
            </div>

            {isReviewHubOpen && (
                <ReviewHubModal 
                    items={reviewableItems}
                    onClose={() => setIsReviewHubOpen(false)}
                    onStartReview={handleStartReviewFromHub}
                />
            )}

            {isCompendiumOpen && (
                <KnowledgeCompendiumModal
                    worldData={worldData}
                    maxMasteryLevel={maxMasteryLevel}
                    onClose={() => setIsCompendiumOpen(false)}
                    onReviewItem={handleReviewFromCompendium}
                />
            )}

            {modalContent && (
                 <QuestModal 
                    type={modalContent.type}
                    data={modalContent.data}
                    title={modalContent.title}
                    onClose={() => setModalContent(null)}
                    onSessionComplete={handleSessionComplete}
                    onUpdateMastery={onUpdateMastery}
                />
            )}
        </div>
    );
};

export default WorldScreen;
