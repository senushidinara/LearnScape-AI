import { GoogleGenAI, Type } from "@google/genai";
import { WorldData, Mood, UserAnalytics } from '../types';

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

const interactiveChallengeSchema = {
    type: Type.OBJECT,
    properties: {
        type: { type: Type.STRING, description: "The type of challenge. Currently, only 'math-plot' is supported." },
        title: { type: Type.STRING, description: "A catchy title for the challenge, e.g., 'Graph the Derivative!'." },
        description: { type: Type.STRING, description: "A short description of the visualization." },
        data: { type: Type.STRING, description: "A string containing valid SVG data for the visualization. The SVG should be complete, scalable (using viewBox), and styled with strokes and fills that are visible on a dark background (e.g., white, light blue)." }
    },
    required: ["type", "title", "description", "data"]
};

const conceptMapNodeSchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING, description: "A unique, simple ID for the concept node (e.g., 'topic1')."},
        label: { type: Type.STRING, description: "The name of the concept."},
        x: { type: Type.INTEGER, description: "A horizontal coordinate for positioning, from 0 to 100."},
        y: { type: Type.INTEGER, description: "A vertical coordinate for positioning, from 0 to 100."}
    },
    required: ["id", "label", "x", "y"]
};

const conceptMapEdgeSchema = {
    type: Type.OBJECT,
    properties: {
        from: { type: Type.STRING, description: "The ID of the source concept node."},
        to: { type: Type.STRING, description: "The ID of the target concept node."},
        label: { type: Type.STRING, description: "Optional label for the relationship (e.g., 'leads to', 'is part of')."}
    },
    required: ["from", "to"]
};

const conceptMapSchema = {
    type: Type.OBJECT,
    properties: {
        nodes: { type: Type.ARRAY, items: conceptMapNodeSchema },
        edges: { type: Type.ARRAY, items: conceptMapEdgeSchema }
    },
    required: ["nodes", "edges"]
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
                    interactiveChallenge: { ...interactiveChallengeSchema, description: "An optional, Wolfram-style interactive visualization. Only include this if the zone's topic is highly visual, like a math function or chemical structure."}
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
        },
        conceptMap: conceptMapSchema
    },
    required: ["worldName", "description", "zones", "boss", "conceptMap"]
};

export const generateWorld = async (notes: string, mood: Mood, analytics?: UserAnalytics): Promise<WorldData> => {
    const today = new Date().toISOString().split('T')[0];
    const moodInstruction = `
        The student's current mood is: ${mood}.
        - If 'motivated', make the challenges harder and the descriptions more epic.
        - If 'stressed' or 'overwhelmed', make the questions easier, the world more calming, and add encouraging messages.
        - If 'sleepy', keep sessions short and focused with clearer, simpler questions.
    `;

    let analyticsInstruction = '';
    if (analytics) {
        const questAccuracy = analytics.questAttempts > 0 ? (analytics.questSuccesses / analytics.questAttempts) * 100 : 100;
        const bossAccuracy = analytics.bossAttempts > 0 ? (analytics.bossSuccesses / analytics.bossAttempts) * 100 : 100;
        
        let stylePreference = 'balanced';
        if(analytics.questAttempts > analytics.treasureAttempts + 2) stylePreference = 'quizzes and challenges';
        if(analytics.treasureAttempts > analytics.questAttempts + 2) stylePreference = 'flashcards and direct review';

        analyticsInstruction = `
        ADAPTATION PHASE:
        The user has played in this world before. Here is their performance data:
        - Quest Accuracy: ${questAccuracy.toFixed(0)}%
        - Boss Question Accuracy: ${bossAccuracy.toFixed(0)}%
        - Preferred Activity Style: The user seems to prefer ${stylePreference}.

        Based on this data, regenerate the world with the following adaptations:
        - If overall accuracy is low (below 60%), simplify the concepts in the questions and make explanations clearer.
        - If overall accuracy is high (above 85%), increase the complexity and depth of the questions.
        - Tailor the content type to their preferred style. If they like quizzes, make more zones have complex quests. If they like flashcards, make the 'treasure' component more detailed and valuable.
        - The world should feel like a new, evolved version of the previous one, not a completely different topic. Maintain the core concepts from the original notes.
        `;
    }
    
    const prompt = `
        You are LearnScape AI, a game designer that transforms educational notes into an exciting, personalized 3D learning game world.
        Your task is to analyze the user's notes, identify key concepts, and generate a complete game world structure as a JSON object.

        ${moodInstruction}
        ${analyticsInstruction}

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
        3.  **Special Challenge:** If a zone covers a topic with a strong visual element, like a mathematical function (e.g., 'y = x^2'), chemical formula, or biological process, add an 'interactiveChallenge'. For 'math-plot' types, you MUST generate a complete, valid SVG string in the 'data' field that plots the function. The SVG must have a viewBox and use light-colored strokes for visibility on a dark UI. For example, for a note about 'f(x) = x^2', you could create a plot of a parabola. If no visual element is obvious, omit the 'interactiveChallenge' for that zone.
        4.  Identify the most challenging or foundational concept and create a 'Boss Battle' for it. The boss's attacks are a series of 3 tough multiple-choice questions.
        5.  Generate a concept map of the key ideas. It should have between 5 and 8 nodes. Nodes need an id, label, and x/y coordinates for a balanced 2D layout (from 0 to 100). Edges connect nodes using their IDs.
        6.  Ensure the entire output strictly adheres to the provided JSON schema. Do not add any extra text or explanations outside the JSON structure.
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