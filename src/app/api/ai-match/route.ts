import { openai } from "@/lib/openai";
import { buildMatchPrompt } from "@/lib/prompts";
import { MatchResult } from "@/types/ai";

export async function POST(request: Request) {
  try {
    const { resumeText, skills, targetRole, jobDescription } =
      await request.json();

    if (!resumeText || !jobDescription) {
      return Response.json(
        { error: "Resume text and job description are required." },
        { status: 400 }
      );
    }

    const prompt = buildMatchPrompt({
      targetRole,
      skills,
      resumeText,
      jobDescription,
    });

    const response = await openai.responses.create({
      model: "gpt-5.5",
      input: prompt,
    });

    const rawText = response.output_text;
    const result: MatchResult = JSON.parse(rawText);

    return Response.json({ result });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Something went wrong while analyzing the job match." },
      { status: 500 }
    );
  }
}