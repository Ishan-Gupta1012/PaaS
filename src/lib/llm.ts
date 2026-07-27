import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Sends a prompt to the Gemini LLM and expects a JSON response.
 * @param prompt - The instruction and input content.
 * @returns Parsed JSON object from the model's response.
 */
export async function generateJSON(prompt: string): Promise<any> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in environment variables.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  // Using gemini-1.5-flash for fast and cost-effective text structuring
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const response = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: 'application/json',
    }
  });

  const jsonText = response.response.text();
  if (!jsonText) {
    throw new Error('Received empty response from the LLM.');
  }

  return JSON.parse(jsonText);
}
