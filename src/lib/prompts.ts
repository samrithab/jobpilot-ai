export function buildMatchPrompt({
  targetRole,
  skills,
  resumeText,
  jobDescription,
}: {
  targetRole: string;
  skills: string;
  resumeText: string;
  jobDescription: string;
}) {
  return `
You are an experienced technical recruiter.

Compare this candidate with the job.

Candidate Target Role:
${targetRole}

Candidate Skills:
${skills}

Candidate Resume:
${resumeText}

Job Description:
${jobDescription}

Return ONLY valid JSON.

Do not fabricate experience.
Only suggest resume improvements that are supported by the candidate's resume.
If a skill is missing, label it as an evidence gap or skill to learn.
Do not tell the candidate to claim skills they do not have.

{
  "matchScore": number,
  "strengths": [],
  "partialEvidence": [],
  "evidenceGaps": [],
  "resumeSuggestions": [],
  "skillsToLearn": [],
  "interviewQuestions": []
}
`;
}