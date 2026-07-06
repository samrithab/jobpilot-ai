import { getOpenAIClient } from "./openai";
import { buildMatchPrompt } from "./prompts";
import type { MatchResult } from "./types";

type AnalyzeJobRequest = {
  resumeText?: string;
  skills?: string;
  targetRole?: string;
  jobDescription?: string;
};

export const handler = async (event: any) => {
  const startTime = Date.now();

  try {
    console.log("AI analysis request started");

    const body: AnalyzeJobRequest =
      typeof event.body === "string" ? JSON.parse(event.body) : event;

    const { resumeText, skills = "", targetRole = "", jobDescription } = body;

    if (!resumeText || !jobDescription) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Resume text and job description are required.",
        }),
      };
    }

    const prompt = buildMatchPrompt({
      targetRole,
      skills,
      resumeText,
      jobDescription,
    });

    const openai = await getOpenAIClient();

    const response = await openai.responses.create({
      model: "gpt-5.5",
      input: prompt,
    });

    const rawText = response.output_text;
    const result: MatchResult = JSON.parse(rawText);

    console.log("AI analysis succeeded", {
      latencyMs: Date.now() - startTime,
      matchScore: result.matchScore,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ result }),
    };
  } catch (error) {
    console.error("AI analysis failed", {
      error,
      latencyMs: Date.now() - startTime,
    });

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Something went wrong while analyzing the job match.",
      }),
    };
  }
};