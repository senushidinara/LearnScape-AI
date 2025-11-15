import { GoogleGenAI, Type } from "@google/genai";
import { WorldData, Mood } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const quizQuestionSchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING, description: "A unique identifier for this question, e.g., 'concept-a1b2'."},
        question: { type: Type.STRING },
        options: { type: Type.ARRAY, items: { type: Type.STRING } },
        correctAnswer: { type: Type.STRING },
        explanation: { type: Type.STRING, description: "A brief explanation for the correct answer."},
        masteryLevel: { type: Type.INTEGER, description: "Initial mastery level, always 0."},
        nextReviewDate: { type: Type.STRING, description: "Initial review date, always today's date in YYYY-MM-DD format."}
    },
    required: ["id", "question", "options", "correctAnswer", "explanation", "masteryLevel", "nextReviewDate"]
};

const flashcardSchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING, description: "A unique identifier for this flashcard, e.g., 'term-c3d4'."},
        term: { type: Type.STRING, description: "A key term from the notes."},
        definition: { type: Type.STRING, description: "A concise definition."},
        masteryLevel: { type: Type.INTEGER, description: "Initial mastery level, always 0."},
        nextReviewDate: { type: Type.STRING, description: "Initial review date, always today's date in YYYY-MM-DD format."}
    },
    required: ["id", "term", "definition", "masteryLevel", "nextReviewDate"]
};

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        worldName: { type: Type.STRING, description: "A cool, epic name for the learning world, like 'The Quantum Realm of Biology'."},
        description: { type: Type.STRING, description: "A short, exciting overview of the world."},
        zones: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "Themed name for a zone, e.g., 'Forest of Physics'."},
                    description: { type: Type.STRING, description: "Brief, engaging description of this zone."},
                    themeColor: { type: Type.STRING, description: "A hex color code (e.g. #FF5733) that fits the zone's theme."},
                    quest: quizQuestionSchema,
                    treasure: flashcardSchema,
                },
                required: ["name", "description", "themeColor", "quest", "treasure"]
            }
        },
        boss: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING, description: "A creative boss name based on a weak topic, e.g. 'The Chloroplast Dragon'."},
                description: { type: Type.STRING, description: "A dramatic description of the boss."},
                weakness: { type: Type.STRING, description: "The core concept the student struggles with, which is the boss's weakness."},
                battle: {
                    type: Type.ARRAY,
                    items: quizQuestionSchema
                }
            },
            required: ["name", "description", "weakness", "battle"]
        }
    },
    required: ["worldName", "description", "zones", "boss"]
};

export const generateWorld = async (notes: string, mood: Mood): Promise<WorldData> => {
    const today = new Date().toISOString().split('T')[0];
    const moodInstruction = `
        The student's current mood is: ${mood}.
        - If 'motivated', make the challenges harder and the descriptions more epic.
        - If 'stressed' or 'overwhelmed', make the questions easier, the world more calming, and add encouraging messages.
        - If 'sleepy', keep sessions short and focused with clearer, simpler questions.
    `;
    
    const prompt = `
        You are LearnScape AI, a game designer that transforms educational notes into an exciting, personalized 3D learning game world.
        Your task is to analyze the user's notes, identify key concepts, and generate a complete game world structure as a JSON object.

        ${moodInstruction}

        Today's date is ${today}. Use this for all initial 'nextReviewDate' fields.
        All 'masteryLevel' fields must be initialized to 0.
        All 'id' fields must be a short, unique, random alphanumeric string.

        Here are the user's notes:
        ---
        ${notes}
        ---

        Based on these notes, please generate the game world.
        1.  Create a grand name and description for the entire world.
        2.  Identify 3-4 main topics and turn them into themed 'zones'. Each zone needs a quest (a multiple-choice question) and a treasure (a flashcard).
        3.  Identify the most challenging or foundational concept and create a 'Boss Battle' for it. The boss's attacks are a series of 3 tough multiple-choice questions.
        4.  Ensure the entire output strictly adheres to the provided JSON schema. Do not add any extra text or explanations outside the JSON structure.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const parsedData = JSON.parse(jsonText);
        
        return parsedData as WorldData;

    } catch(error) {
        console.error("Error generating world with Gemini:", error);
        throw new Error("Failed to parse world data from AI response.");
    }
};
