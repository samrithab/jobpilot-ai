export interface MatchResult {
  matchScore: number;
  strengths: string[];
  partialEvidence: string[];
  evidenceGaps: string[];
  resumeSuggestions: string[];
  skillsToLearn: string[];
  interviewQuestions: string[];
}