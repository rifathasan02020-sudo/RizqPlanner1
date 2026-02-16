
import { GoogleGenAI } from "@google/genai";

export const getFinancialAdvice = async (
  query: string,
  financialContext: string
): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return "দুঃখিত, এপিআই কি (API Key) সেটআপ করা নেই।";
    }

    const ai = new GoogleGenAI({ apiKey });
    // Using gemini-flash-lite-latest for the fastest possible response
    const model = 'gemini-flash-lite-latest';
    
    const prompt = `
      You are an expert financial advisor named "Rizq Advisor". 
      
      IMPORTANT INSTRUCTION:
      - Always start your response with the greeting "আসসালামু আলাইকুম" (Assalamu Alaikum). 
      - Do NOT use "Namaskar" or other greetings.
      
      Answer the user's question in Bengali (Bangla).
      Keep the answer very concise (max 3-4 sentences) and highly actionable.
      
      User's Financial Context Summary:
      ${financialContext}
      
      User Question: ${query}
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "দুঃখিত, আমি উত্তরটি তৈরি করতে পারিনি।";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "দুঃখিত, পরামর্শ লোড করার সময় একটি কারিগরি ত্রুটি ঘটেছে। দয়া করে আবার চেষ্টা করুন।";
  }
};
