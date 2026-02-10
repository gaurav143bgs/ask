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

    return response.text || "à¤µà¤¿à¤¸à¥à¤¤à¥à¤¤ à¤µà¤¿à¤µà¤°à¤£ à¤à¤ªà¤²à¤¬à¥à¤§ à¤¨à¤¹à¥à¤ à¤¹à¥à¥¤";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "à¤µà¤¿à¤¸à¥à¤¤à¥à¤¤ à¤µà¤¿à¤µà¤°à¤£ à¤ªà¥à¤°à¤¾à¤ªà¥à¤¤ à¤à¤°à¤¨à¥ à¤®à¥à¤ à¤¤à¥à¤°à¥à¤à¤¿ à¤¹à¥à¤à¥¤ à¤à¥à¤ªà¤¯à¤¾ à¤¬à¤¾à¤¦ à¤®à¥à¤ à¤ªà¥à¤¨à¤ à¤ªà¥à¤°à¤¯à¤¾à¤¸ à¤à¤°à¥à¤à¥¤";
  }
}
