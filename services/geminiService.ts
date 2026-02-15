import { GoogleGenAI } from "@google/genai";

export const getFinancialAdvice = async (
  query: string,
  financialContext: string
): Promise<string> => {
  // 1. Try process.env (injected via vite define)
  let apiKey = process.env.API_KEY;

  // 2. Fallback: Try standard Vite env vars (import.meta.env)
  // This handles cases where Vercel exposes VITE_API_KEY directly
  if (!apiKey) {
    try {
      // @ts-ignore
      if (typeof import.meta !== 'undefined' && import.meta.env) {
        // @ts-ignore
        apiKey = import.meta.env.VITE_API_KEY || import.meta.env.API_KEY;
      }
    } catch (e) {
      console.warn("Error accessing import.meta.env", e);
    }
  }

  if (!apiKey) {
    return "দুঃখিত, এআই পরিষেবা ব্যবহারের জন্য API Key পাওয়া যায়নি। অনুগ্রহ করে Vercel এর Settings > Environment Variables এ 'VITE_API_KEY' নামে আপনার Gemini API Key টি সেভ করুন এবং রি-ডিপ্লয় (Redeploy) করুন।";
  }

  try {
    // Initialize client ONLY when needed using the retrieved key
    const ai = new GoogleGenAI({ apiKey });
    
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

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "দুঃখিত, আমি উত্তরটি তৈরি করতে পারিনি।";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "দুঃখিত, একটি ত্রুটি ঘটেছে। সম্ভবত API Key টি সঠিক নয় বা কোটা শেষ হয়ে গেছে।";
  }
};