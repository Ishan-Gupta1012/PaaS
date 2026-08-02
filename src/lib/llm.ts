/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { withTimeout } from './utils/timeout';

// Load .env.local manually for standalone scripts compatibility
function loadEnvLocal() {
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      content.split('\n').forEach(line => {
        const match = line.match(/^\s*([^#=]+)\s*=\s*(.*)$/);
        if (match) {
          const key = match[1].trim();
          let val = match[2].trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      });
    }
  } catch {
    // Ignore error
  }
}
loadEnvLocal();

const CANDIDATE_MODELS = [
  'gemini-3.5-flash',
  'gemini-3.6-flash',
  'gemini-flash-latest'
];

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
  let lastError: any = null;

  for (const modelName of CANDIDATE_MODELS) {
    let attempts = 0;
    const maxAttempts = 2;

    while (attempts < maxAttempts) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const response = await withTimeout(
          model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: 'application/json',
            }
          }),
          30000,
          `Gemini API Call (${modelName})`
        );

        const jsonText = response.response.text();
        if (!jsonText) {
          throw new Error('Received empty response from the LLM.');
        }

        return JSON.parse(jsonText);
      } catch (error: any) {
        lastError = error;
        const errMsg = error.message || '';

        // If it's a 429 (Rate Limit/Quota exceeded)
        if (errMsg.includes('429') || errMsg.includes('Quota exceeded') || errMsg.includes('Too Many Requests')) {
          attempts++;
          const delaySec = 3 * attempts;
          console.warn(`[Rate Limit 429] Model "${modelName}" hit rate limit. Waiting ${delaySec}s before retry (Attempt ${attempts}/${maxAttempts})...`);
          await wait(delaySec * 1000);
          continue;
        }

        // If it's a 503 (Service Unavailable/High demand)
        if (errMsg.includes('503') || errMsg.includes('Service Unavailable') || errMsg.includes('experiencing high demand')) {
          attempts++;
          console.warn(`[Service 503] Model "${modelName}" busy. Waiting 2s before retry (Attempt ${attempts}/${maxAttempts})...`);
          await wait(2000);
          continue;
        }

        // For other errors (like 404), switch to the next model
        console.warn(`[Model Fallback] Model "${modelName}" failed with error:`, errMsg);
        break;
      }
    }

    if (attempts >= maxAttempts) {
      throw lastError;
    }
  }

  throw new Error(`All LLM models in fallback chain failed. Last error: ${lastError?.message || lastError}`);
}
