import React, { useState } from 'react';
import { QuizQuestion, Flashcard } from '../types';

interface QuestModalProps {
  type: 'quest' | 'treasure' | 'battle';
  data: QuizQuestion[] | Flashcard;
  title: string;
  onClose: () => void;
  onUpdateMastery: (itemId: string, success: boolean) => void;
}

const QuestContent: React.FC<{ questions: QuizQuestion[], onUpdateMastery: (itemId: string, success: boolean) => void }> = ({ questions, onUpdateMastery }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);

    const question = questions[currentQuestionIndex];
    const isCorrect = selectedOption === question.correctAnswer;
    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    const handleOptionSelect = (option: string) => {
        if (showFeedback) return;
        const correct = option === question.correctAnswer;
        setSelectedOption(option);
        setShowFeedback(true);
        onUpdateMastery(question.id, correct);
    };

    const handleNext = () => {
        if (!isLastQuestion) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOption(null);
            setShowFeedback(false);
        } else {
             // You could add a completion state here
        }
    };
    
    return (
        <div>
            <p className="text-gray-400 mb-2">Question {currentQuestionIndex + 1} of {questions.length}</p>
            <h3 className="text-2xl font-semibold text-white mb-6">{question.question}</h3>
            <div className="space-y-3">
                {question.options.map((option, index) => {
                    const isSelected = selectedOption === option;
                    let buttonClass = "w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ";
                    if (showFeedback) {
                        if (option === question.correctAnswer) {
                            buttonClass += "bg-green-500/20 border-green-500 text-white";
                        } else if (isSelected && !isCorrect) {
                            buttonClass += "bg-red-500/20 border-red-500 text-white";
                        } else {
                             buttonClass += "bg-gray-700 border-gray-600 text-gray-300";
                        }
                    } else {
                        buttonClass += "bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-purple-500 text-gray-200";
                    }
                    return (
                        <button key={index} onClick={() => handleOptionSelect(option)} className={buttonClass}>
                            {option}
                        </button>
                    )
                })}
            </div>

            {showFeedback && (
                <div className={`mt-6 p-4 rounded-lg ${isCorrect ? 'bg-green-900/50' : 'bg-red-900/50'}`}>
                    <h4 className="font-bold text-lg">{isCorrect ? 'Correct!' : 'Not Quite!'}</h4>
                    <p className="mt-1">{question.explanation}</p>
                    {!isLastQuestion && 
                        <button onClick={handleNext} className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
                            Next Question
                        </button>
                    }
                </div>
            )}
        </div>
    );
};

const TreasureContent: React.FC<{ flashcard: Flashcard, onUpdateMastery: (itemId: string, success: boolean) => void, onClose: () => void }> = ({ flashcard, onUpdateMastery, onClose }) => {
    const handleReview = (success: boolean) => {
        onUpdateMastery(flashcard.id, success);
        onClose();
    };
    
    return (
        <div>
            <div className="text-center">
                <div className="p-6 bg-yellow-900/30 border-2 border-yellow-500 rounded-lg">
                    <h3 className="text-2xl font-bold text-yellow-300">{flashcard.term}</h3>
                    <hr className="my-4 border-yellow-700"/>
                    <p className="text-lg text-yellow-200">{flashcard.definition}</p>
                </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
                <button onClick={() => handleReview(true)} className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg font-bold transition-colors">
                    I Remembered
                </button>
                <button onClick={() => handleReview(false)} className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-lg font-bold transition-colors">
                    Needs Review
                </button>
            </div>
        </div>
    );
};

const QuestModal: React.FC<QuestModalProps> = ({ type, data, title, onClose, onUpdateMastery }) => {
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div 
                className="bg-gray-800 rounded-2xl shadow-2xl shadow-purple-500/20 border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 transform transition-all duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-start mb-6">
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">{title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>
                
                {(type === 'quest' || type === 'battle') && <QuestContent questions={data as QuizQuestion[]} onUpdateMastery={onUpdateMastery} />}
                {type === 'treasure' && <TreasureContent flashcard={data as Flashcard} onUpdateMastery={onUpdateMastery} onClose={onClose} />}
            </div>
        </div>
    );
};

export default QuestModal;
