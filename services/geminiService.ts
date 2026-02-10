import { GoogleGenAI } from "@google/genai";

export async function getDetailedExplanation(question: string, correctAnswer: string): Promise<string> {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are an expert Geography tutor. Provide a detailed, concise explanation in Hindi for the following question and correct answer related to Physical Geography and Cosmology. 
      Question: ${question}
      Correct Answer: ${correctAnswer}
      Format: Scientific context and explanation. Keep it under 100 words.`,
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });

    return response.text || "विस्तृत विवरण उपलब्ध नहीं है।";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "विस्तृत विवरण प्राप्त करने में त्रुटि हुई। कृपया बाद में पुनः प्रयास करें।";
  }
}
