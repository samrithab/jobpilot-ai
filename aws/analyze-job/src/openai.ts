import OpenAI from "openai";
import { getOpenAIKey } from "./secrets";

let cachedClient: OpenAI | null = null;

export async function getOpenAIClient() {
  if (cachedClient) return cachedClient;

  const apiKey = await getOpenAIKey();

  cachedClient = new OpenAI({
    apiKey,
  });

  return cachedClient;
}