import { GoogleGenAI } from "@google/genai";

let client: GoogleGenAI | null = null;

if (process.env.API_KEY) {
  client = new GoogleGenAI({ apiKey: process.env.API_KEY });
}

export const getFinancialAdvice = async (
  query: string,
  financialContext: string
): Promise<string> => {
  if (!client) {
    return "দুঃখিত, এআই পরিষেবা বর্তমানে উপলব্ধ নয়। দয়া করে পরে আবার চেষ্টা করুন বা নিশ্চিত করুন যে API কী কনফিগার করা হয়েছে।";
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
