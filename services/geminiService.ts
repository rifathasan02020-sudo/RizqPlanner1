import { GoogleGenAI } from "@google/genai";

let client: GoogleGenAI | null = null;

try {
  // Check for API Key safely to avoid "process is not defined" crash
  // @ts-ignore
  const apiKey = (typeof process !== 'undefined' && process.env?.API_KEY) 
    // @ts-ignore
    || (typeof import.meta !== 'undefined' && import.meta.env?.API_KEY);

  if (apiKey) {
    client = new GoogleGenAI({ apiKey });
  }
} catch (error) {
  console.warn("Gemini Client Init Failed (AI features will be disabled):", error);
}

export const getFinancialAdvice = async (
  query: string,
  financialContext: string
): Promise<string> => {
  if (!client) {
    return "দুঃখিত, এআই পরিষেবা বর্তমানে উপলব্ধ নয়। (API Key Missing or Invalid)";
  }

  try {
    const model = 'gemini-3-flash-preview';
    const prompt = `
      You are an expert financial advisor named "Rizq Advisor". 
      Answer the user's question in Bengali (Bangla).
      Use the Hind Siliguri font style in your mind (clean, professional).
      Keep the answer concise, helpful, and motivating.
      
      User's Financial Context Summary:
      ${financialContext}
      
      User Question: ${query}
    `;

    const response = await client.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "দুঃখিত, আমি উত্তরটি তৈরি করতে পারিনি।";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "একটি ত্রুটি ঘটেছে। দয়া করে আবার চেষ্টা করুন।";
  }
};