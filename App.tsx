import React, { useState, useCallback } from 'react';
import { WorldData, Mood } from './types';
import { generateWorld } from './services/geminiService';
import UploadScreen from './components/UploadScreen';
import LoadingScreen from './components/LoadingScreen';
import WorldScreen from './components/WorldScreen';

type GameState = 'upload' | 'loading' | 'world';

// Spaced Repetition System intervals in days
const SRS_INTERVALS = [1, 2, 7, 14, 30, 90, 180];

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('upload');
  const [worldData, setWorldData] = useState<WorldData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateWorld = useCallback(async (notes: string, mood: Mood) => {
    if (!notes.trim()) {
      setError('Please enter some notes to generate a world.');
      return;
    }
    setError(null);
    setGameState('loading');
    try {
      const data = await generateWorld(notes, mood);
      setWorldData(data);
      setGameState('world');
    } catch (e) {
      console.error(e);
      setError('Failed to generate the learning world. The AI might be overwhelmed. Please try again with simpler notes.');
      setGameState('upload');
    }
  }, []);

  const handleBackToUpload = () => {
    setWorldData(null);
    setGameState('upload');
  };

  const handleUpdateMastery = useCallback((itemId: string, success: boolean) => {
    setWorldData(prevData => {
      if (!prevData) return null;
      
      const newWorldData = JSON.parse(JSON.stringify(prevData));

      let itemFound = false;
      
      const updateItem = (item: any) => {
        if (item.id === itemId) {
          itemFound = true;
          const currentLevel = item.masteryLevel;
          let newLevel: number;

          if (success) {
            newLevel = Math.min(currentLevel + 1, SRS_INTERVALS.length - 1);
          } else {
            newLevel = Math.max(currentLevel - 1, 0);
          }
          
          item.masteryLevel = newLevel;
          
          const daysToAdd = SRS_INTERVALS[newLevel];
          const newReviewDate = new Date();
          newReviewDate.setDate(newReviewDate.getDate() + daysToAdd);
          item.nextReviewDate = newReviewDate.toISOString().split('T')[0];
        }
      };

      newWorldData.zones.forEach((zone: any) => {
        updateItem(zone.quest);
        updateItem(zone.treasure);
      });

      newWorldData.boss.battle.forEach((question: any) => {
        updateItem(question);
      });

      if(itemFound) {
        return newWorldData;
      }
      return prevData;
    });
  }, []);

  const renderContent = () => {
    switch (gameState) {
      case 'loading':
        return <LoadingScreen />;
      case 'world':
        return worldData ? <WorldScreen worldData={worldData} onBack={handleBackToUpload} onUpdateMastery={handleUpdateMastery} /> : <LoadingScreen />;
      case 'upload':
      default:
        return <UploadScreen onGenerate={handleGenerateWorld} error={error} />;
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans antialiased">
      {renderContent()}
    </div>
  );
};

export default App;
