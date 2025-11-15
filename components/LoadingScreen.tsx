
import React, { useState, useEffect } from 'react';
import { LOADING_MESSAGES } from '../constants';

const LoadingScreen: React.FC = () => {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((prevIndex) => (prevIndex + 1) % LOADING_MESSAGES.length);
        }, 2500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center z-50">
            <div className="relative flex items-center justify-center">
                <div className="absolute h-24 w-24 md:h-32 md:w-32 rounded-full border-4 border-purple-500/30 animate-spin-slow"></div>
                <div className="absolute h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-t-indigo-500 border-l-indigo-500 border-b-transparent border-r-transparent animate-spin"></div>
                <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
                    AI
                </div>
            </div>
            <div className="mt-12 text-center px-4">
                <h2 className="text-2xl font-bold text-gray-200">Generating Your LearnScape...</h2>
                <p className="mt-2 text-lg text-gray-400 transition-opacity duration-500">{LOADING_MESSAGES[messageIndex]}</p>
            </div>
        </div>
    );
};

export default LoadingScreen;
