import { GoogleGenAI } from "@google/genai";

export const getFinancialAdvice = async (
  query: string,
  financialContext: string
): Promise<string> => {
  // Access key securely
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    return "দুঃখিত, এআই পরিষেবা ব্যবহারের জন্য API Key প্রয়োজন। Vercel এ 'API_KEY' এনভায়রনমেন্ট ভেরিয়েবল সেট করা আছে কিনা যাচাই করুন।";
  }

  try {
    // Initialize client ONLY when needed to prevent startup crashes
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
    return "দুঃখিত, একটি ত্রুটি ঘটেছে। দয়া করে আবার চেষ্টা করুন।";
  }
};