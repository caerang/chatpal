
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message } from '../types';
import { AI_SYSTEM_PROMPT } from '../constants';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const CORRECTION_DELIMITER = '✨ A better way to say that:';

interface AiResponse {
    conversationResponse: string;
    correction: string | null;
}

const parseAiResponse = (responseText: string): AiResponse => {
    const parts = responseText.split(CORRECTION_DELIMITER);
    if (parts.length > 1) {
        return {
            conversationResponse: parts[0].trim(),
            correction: parts.slice(1).join(CORRECTION_DELIMITER).trim(),
        };
    }
    return {
        conversationResponse: responseText.trim(),
        correction: null,
    };
};


export const getAiResponse = async (userMessage: string, history: Message[]): Promise<AiResponse> => {
    try {
        if (!process.env.API_KEY) {
            // Simulate a delay and provide a mock response if API key is missing
            await new Promise(resolve => setTimeout(resolve, 1000));
            if (userMessage.toLowerCase().includes("hello")) {
                return { conversationResponse: "Hello there! How are you doing today? 😊", correction: null };
            }
            return {
                conversationResponse: "That sounds interesting! Tell me more.",
                correction: "A better way to say that: 'That sounds very interesting! Could you tell me more about it?'"
            };
        }
        
        // We don't need to pass the whole history for this stateless MVP,
        // but passing the user's message is essential.
        const prompt = `User's message: "${userMessage}"`;
        
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-preview-04-17',
            contents: prompt,
            config: {
                systemInstruction: AI_SYSTEM_PROMPT
            }
        });

        const text = response.text;
        return parseAiResponse(text);
        
    } catch (error) {
        console.error("Error fetching AI response:", error);
        return {
            conversationResponse: "I'm having a little trouble thinking right now. Please try again in a moment.",
            correction: null
        };
    }
};
