
import React, { useState, useCallback, useEffect } from 'react';
import { WorldData, Mood, PlayerState, DailyQuest, UserAnalytics } from './types';
import { generateWorld } from './services/geminiService';
import UploadScreen from './components/UploadScreen';
import LoadingScreen from './components/LoadingScreen';
import WorldScreen from './components/WorldScreen';
import { SRS_INTERVALS, getXpToNextLevel, XP_PER_SUCCESS, XP_PER_FAILURE, ALL_DAILY_QUESTS } from './constants';

type GameState = 'upload' | 'loading' | 'world';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('upload');
  const [worldHistory, setWorldHistory] = useState<WorldData[]>([]);
  const [currentWorldIndex, setCurrentWorldIndex] = useState(-1);
  const [error, setError] = useState<string | null>(null);
  
  const [playerState, setPlayerState] = useState<PlayerState>({
    level: 1,
    xp: 0,
    xpToNextLevel: getXpToNextLevel(1),
  });
  const [dailyQuests, setDailyQuests] = useState<DailyQuest[]>([]);
  const [showLevelUp, setShowLevelUp] = useState(false);

  const [userAnalytics, setUserAnalytics] = useState<UserAnalytics>({
    questAttempts: 0,
    questSuccesses: 0,
    treasureAttempts: 0,
    bossAttempts: 0,
    bossSuccesses: 0,
  });
  const [currentMood, setCurrentMood] = useState<Mood>('motivated');

  const currentWorld = worldHistory[currentWorldIndex] ?? null;

  useEffect(() => {
    // Re-generate quests when a new world is created
    if (currentWorld) {
        const quests = ALL_DAILY_QUESTS.slice(0, 3).map(q => ({...q, progress: 0, completed: false}));
        setDailyQuests(quests);
    }
  }, [currentWorld]);

  const addXp = useCallback((amount: number) => {
    setPlayerState(prev => {
        let newXp = prev.xp + amount;
        let newLevel = prev.level;
        let newXpToNextLevel = prev.xpToNextLevel;

        if (newXp >= newXpToNextLevel) {
            newLevel++;
            newXp -= newXpToNextLevel;
            newXpToNextLevel = getXpToNextLevel(newLevel);
            setShowLevelUp(true);
            setTimeout(() => setShowLevelUp(false), 3000);
        }

        return { level: newLevel, xp: newXp, xpToNextLevel: newXpToNextLevel };
    });
  }, []);

  const handleGenerateWorld = useCallback(async (notes: string, mood: Mood) => {
    if (!notes.trim()) {
      setError('Please enter some notes to generate a world.');
      return;
    }
    setCurrentMood(mood);
    setError(null);
    setGameState('loading');
    try {
      const data = await generateWorld(notes, mood);
      const worldWithNotes: WorldData = { ...data, sourceNotes: notes };
      
      const newHistory = worldHistory.slice(0, currentWorldIndex + 1);
      newHistory.push(worldWithNotes);
      setWorldHistory(newHistory);
      setCurrentWorldIndex(newHistory.length - 1);

      setGameState('world');
    } catch (e) {
      console.error(e);
      setError('Failed to generate the learning world. The AI might be overwhelmed. Please try again with simpler notes.');
      setGameState('upload');
    }
  }, [worldHistory, currentWorldIndex]);

  const handleAdaptWorld = useCallback(async () => {
    if (!currentWorld) return;
    setGameState('loading');
    setError(null);
    try {
      const data = await generateWorld(currentWorld.sourceNotes, currentMood, userAnalytics);
      const adaptedWorldWithNotes: WorldData = { ...data, sourceNotes: currentWorld.sourceNotes };

      const newHistory = [...worldHistory];
      newHistory[currentWorldIndex] = adaptedWorldWithNotes;
      setWorldHistory(newHistory);
      
      setGameState('world');
    } catch (e) {
      console.error(e);
      setError('Failed to adapt the learning world. The AI might be having a moment. Please try again.');
      setGameState('world');
    }
  }, [currentWorld, currentMood, userAnalytics, worldHistory, currentWorldIndex]);


  const handleGoToUpload = () => setGameState('upload');
  const handleBackToWorld = () => setGameState('world');
  
  const handleCancelGeneration = () => {
    if (currentWorldIndex > -1) {
        setGameState('world');
    } else {
        setGameState('upload');
    }
  };

  const handlePreviousWorld = () => {
    if (currentWorldIndex > 0) {
        setCurrentWorldIndex(currentWorldIndex - 1);
    }
  };

  const handleNextWorld = () => {
      if (currentWorldIndex < worldHistory.length - 1) {
          setCurrentWorldIndex(currentWorldIndex + 1);
      }
  };


  const updateDailyQuests = useCallback((type: 'review' | 'master_quest' | 'master_treasure' | 'attempt_boss', success: boolean) => {
    setDailyQuests(prevQuests => 
        prevQuests.map(quest => {
            if (quest.completed) return quest;
            let progress = quest.progress;
            if (quest.type === 'review') progress++;
            if (quest.type === 'attempt_boss' && type === 'attempt_boss') progress++;
            if (quest.type === 'master_quest' && type === 'master_quest' && success) progress++;
            if (quest.type === 'master_treasure' && type === 'master_treasure') progress++;
            if (progress > quest.target) progress = quest.target;
            const wasCompleted = quest.completed;
            const isCompleted = progress >= quest.target;
            if (isCompleted && !wasCompleted) {
                addXp(quest.reward);
            }
            return { ...quest, progress, completed: isCompleted };
        })
    );
  }, [addXp]);

  const handleUpdateMastery = useCallback((itemId: string, success: boolean, itemType: 'quest' | 'treasure' | 'boss_question') => {
    addXp(success ? XP_PER_SUCCESS : XP_PER_FAILURE);
    
    setUserAnalytics(prev => {
        const newAnalytics = {...prev};
        if (itemType === 'quest') {
            newAnalytics.questAttempts++;
            if (success) newAnalytics.questSuccesses++;
        } else if (itemType === 'treasure') {
            newAnalytics.treasureAttempts++;
        } else if (itemType === 'boss_question') {
            newAnalytics.bossAttempts++;
            if (success) newAnalytics.bossSuccesses++;
        }
        return newAnalytics;
    });

    if (itemType === 'quest') updateDailyQuests('master_quest', success);
    else if (itemType === 'treasure') updateDailyQuests('master_treasure', success);
    updateDailyQuests('review', success);

    setWorldHistory(prevHistory => {
        const newHistory = [...prevHistory];
        const worldToUpdate = JSON.parse(JSON.stringify(newHistory[currentWorldIndex]));
        
        let itemFound = false;
        
        const updateItem = (item: any) => {
            if (item.id === itemId) {
                itemFound = true;
                const currentLevel = item.masteryLevel;
                let newLevel: number;
                if (success) newLevel = Math.min(currentLevel + 1, SRS_INTERVALS.length - 1);
                else newLevel = Math.max(currentLevel - 1, 0);
                item.masteryLevel = newLevel;
                const daysToAdd = SRS_INTERVALS[newLevel];
                const newReviewDate = new Date();
                newReviewDate.setDate(newReviewDate.getDate() + daysToAdd);
                item.nextReviewDate = newReviewDate.toISOString().split('T')[0];
            }
        };

        worldToUpdate.zones.forEach((zone: any) => {
            if (zone.quest.id === itemId) updateItem(zone.quest);
            if (zone.treasure.id === itemId) updateItem(zone.treasure);
        });
        worldToUpdate.boss.battle.forEach((question: any) => {
            if (question.id === itemId) updateItem(question);
        });

        if(itemFound) {
            newHistory[currentWorldIndex] = worldToUpdate;
            return newHistory;
        }
        return prevHistory;
    });
  }, [addXp, updateDailyQuests, currentWorldIndex]);

  const handleAttemptBoss = useCallback(() => {
    updateDailyQuests('attempt_boss', true);
  }, [updateDailyQuests]);

  const renderContent = () => {
    switch (gameState) {
      case 'loading':
        return <LoadingScreen onCancel={handleCancelGeneration} />;
      case 'world':
        return currentWorld ? <WorldScreen 
            worldData={currentWorld} 
            onNewWorld={handleGoToUpload}
            onPreviousWorld={handlePreviousWorld}
            onNextWorld={handleNextWorld}
            canGoPrevious={currentWorldIndex > 0}
            canGoNext={currentWorldIndex < worldHistory.length - 1}
            onUpdateMastery={handleUpdateMastery}
            onAttemptBoss={handleAttemptBoss}
            maxMasteryLevel={SRS_INTERVALS.length} 
            playerState={playerState}
            dailyQuests={dailyQuests}
            userAnalytics={userAnalytics}
            onAdaptWorld={handleAdaptWorld}
        /> : <LoadingScreen onCancel={handleCancelGeneration} />;
      case 'upload':
      default:
        return <UploadScreen onGenerate={handleGenerateWorld} error={error} onBackToWorld={currentWorldIndex > -1 ? handleBackToWorld : undefined} />;
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans antialiased">
      {renderContent()}
      {showLevelUp && (
        <div className="fixed top-5 right-5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold py-3 px-6 rounded-lg shadow-2xl animate-bounce z-50">
            Level Up! You are now Level {playerState.level}!
        </div>
      )}
    </div>
  );
};

export default App;
