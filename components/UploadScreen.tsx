
import React, { useState, useCallback } from 'react';
import { Mood } from '../types';
import { MOOD_OPTIONS } from '../constants';
import { BookIcon, UploadIcon } from './icons';

interface UploadScreenProps {
  onGenerate: (notes: string, mood: Mood) => void;
  error: string | null;
}

const UploadScreen: React.FC<UploadScreenProps> = ({ onGenerate, error }) => {
  const [notes, setNotes] = useState('');
  const [selectedMood, setSelectedMood] = useState<Mood>('motivated');
  const [fileName, setFileName] = useState<string>('');

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setNotes(text);
      };
      reader.readAsText(file);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(notes, selectedMood);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-gray-800/50 rounded-2xl shadow-2xl shadow-purple-500/10 p-8 border border-gray-700 space-y-8 transform transition-all duration-500">
        <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
                LearnScape AI
            </h1>
            <p className="mt-2 text-lg text-gray-400">Turn your notes into a personalized learning adventure.</p>
        </div>

        {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-center" role="alert">
                <p>{error}</p>
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="notes" className="text-lg font-semibold text-gray-300 mb-2 block">1. Your Notes</label>
                <div className="relative">
                    <BookIcon className="absolute top-3.5 left-4 h-6 w-6 text-gray-500" />
                    <textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Paste your notes here, or upload a file..."
                        className="w-full h-48 p-4 pl-12 bg-gray-900/70 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none"
                    />
                    <label htmlFor="file-upload" className="absolute bottom-3 right-3 flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-md cursor-pointer transition-colors">
                        <UploadIcon className="h-4 w-4" />
                        <span>{fileName || 'Upload .txt'}</span>
                    </label>
                    <input id="file-upload" type="file" accept=".txt" className="hidden" onChange={handleFileChange} />
                </div>
            </div>

            <div>
                <label className="text-lg font-semibold text-gray-300 mb-3 block">2. How are you feeling?</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {MOOD_OPTIONS.map(({ id, label, color }) => (
                        <button
                            key={id}
                            type="button"
                            onClick={() => setSelectedMood(id)}
                            className={`px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${selectedMood === id ? `ring-2 ring-offset-2 ring-offset-gray-800 ring-white ${color}` : `${color} opacity-70 hover:opacity-100`}`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <button
                    type="submit"
                    className="w-full py-4 text-lg font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg shadow-lg shadow-purple-500/20 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!notes.trim()}
                >
                    Generate World
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default UploadScreen;
