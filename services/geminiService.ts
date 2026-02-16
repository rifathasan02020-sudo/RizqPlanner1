import { GoogleGenAI } from "@google/genai";

export const getFinancialAdvice = async (
  query: string,
  financialContext: string
): Promise<string> => {
  // Fix: Initialize with process.env.API_KEY directly using a named parameter as per @google/genai guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    // Fix: Use 'gemini-3-flash-preview' for basic text tasks and summarize reasoning
    const model = 'gemini-3-flash-preview';
    
    const prompt = `
      You are an expert financial advisor named "Rizq Advisor". 
      
      IMPORTANT INSTRUCTION:
      - Always start your response with the greeting "আসসালামু আলাইকুম" (Assalamu Alaikum). 
      - Do NOT use "Namaskar" or other greetings.
      
      Answer the user's question in Bengali (Bangla).
      Use the Hind Siliguri font style in your mind (clean, professional).
      Keep the answer concise, helpful, and motivating.
      
      User's Financial Context Summary:
      ${financialContext}
      
      User Question: ${query}
    `;

    // Fix: Always use ai.models.generateContent with both model name and prompt
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    // Fix: Access the .text property directly instead of calling it as a method
    return response.text || "দুঃখিত, আমি উত্তরটি তৈরি করতে পারিনি।";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "দুঃখিত, একটি ত্রুটি ঘটেছে। সম্ভবত API Key টি সঠিক নয় বা কোটা শেষ হয়ে গেছে।";
  }
};