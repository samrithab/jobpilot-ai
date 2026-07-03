"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import { MatchResult } from "@/types/ai";

type Tab = "details" | "analysis";

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [activeTab, setActiveTab] = useState<Tab>("details");

  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [status, setStatus] = useState("Saved");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [strengths, setStrengths] = useState<string[]>([]);
  const [partialEvidence, setPartialEvidence] = useState<string[]>([]);
  const [evidenceGaps, setEvidenceGaps] = useState<string[]>([]);
  const [resumeSuggestions, setResumeSuggestions] = useState<string[]>([]);
  const [skillsToLearn, setSkillsToLearn] = useState<string[]>([]);
  const [interviewQuestions, setInterviewQuestions] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    async function fetchJob() {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", jobId)
        .single();

      if (error) {
        alert(error.message);
        setIsLoading(false);
        return;
      }

      setCompany(data.company || "");
      setPosition(data.position || "");
      setJobUrl(data.job_url || "");
      setStatus(data.status || "Saved");
      setLocation(data.location || "");
      setNotes(data.notes || "");
      setJobDescription(data.job_description || "");
      setMatchScore(data.match_score ?? null);
      setStrengths(data.strengths || []);
      setPartialEvidence(data.partial_evidence || []);
      setEvidenceGaps(data.evidence_gaps || []);
      setResumeSuggestions(data.resume_suggestions || []);
      setSkillsToLearn(data.skills_to_learn || []);
      setInterviewQuestions(data.interview_questions || []);

      setIsLoading(false);
    }

    fetchJob();
  }, [jobId]);

  async function handleUpdate(event: React.FormEvent) {
    event.preventDefault();
    setIsSaving(true);

    const { error } = await supabase
      .from("jobs")
      .update({
        company,
        position,
        job_url: jobUrl,
        status,
        location,
        notes,
        job_description: jobDescription,
      })
      .eq("id", jobId);

    setIsSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Job saved!");
  }

  async function handleAnalyzeJob() {
    if (!jobDescription.trim()) {
      alert("Please paste the job description first.");
      return;
    }

    setIsAnalyzing(true);
    setActiveTab("analysis");

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .limit(1)
      .single();

    if (profileError || !profile) {
      alert("Please save your resume profile first.");
      setIsAnalyzing(false);
      return;
    }

    const response = await fetch("/api/ai-match", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resumeText: profile.resume_text,
        skills: profile.skills,
        targetRole: profile.target_role,
        jobDescription,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Something went wrong.");
      setIsAnalyzing(false);
      return;
    }

    const result: MatchResult = data.result;

    const { error: updateError } = await supabase
      .from("jobs")
      .update({
        job_description: jobDescription,
        match_score: result.matchScore,
        strengths: result.strengths,
        partial_evidence: result.partialEvidence,
        evidence_gaps: result.evidenceGaps,
        resume_suggestions: result.resumeSuggestions,
        skills_to_learn: result.skillsToLearn,
        interview_questions: result.interviewQuestions,
      })
      .eq("id", jobId);

    setIsAnalyzing(false);

    if (updateError) {
      alert(updateError.message);
      return;
    }

    setMatchScore(result.matchScore);
    setStrengths(result.strengths);
    setPartialEvidence(result.partialEvidence);
    setEvidenceGaps(result.evidenceGaps);
    setResumeSuggestions(result.resumeSuggestions);
    setSkillsToLearn(result.skillsToLearn);
    setInterviewQuestions(result.interviewQuestions);
  }

  async function handleDelete() {
    const confirmed = confirm("Are you sure you want to delete this job?");
    if (!confirmed) return;

    const { error } = await supabase.from("jobs").delete().eq("id", jobId);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/jobs");
  }

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-slate-100 p-8">
          <p className="text-slate-700">Loading job...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-100 p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white rounded-xl shadow p-8">
            <div className="mb-6">
              <p className="text-sm text-slate-500">Job Application</p>
              <h1 className="text-3xl font-bold text-slate-900">
                {company || "Untitled Company"}
              </h1>
              <p className="text-slate-600 mt-1">
                {position || "Untitled Position"}
              </p>
            </div>

            <div className="flex border-b border-slate-200 mb-6">
              <TabButton
                label="Job Details"
                isActive={activeTab === "details"}
                onClick={() => setActiveTab("details")}
              />
              <TabButton
                label="AI Analysis"
                isActive={activeTab === "analysis"}
                onClick={() => setActiveTab("analysis")}
              />
            </div>

            {activeTab === "details" && (
              <form onSubmit={handleUpdate} className="space-y-4">
                <Input label="Company" value={company} onChange={setCompany} required />
                <Input label="Position" value={position} onChange={setPosition} required />

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-900"
                  >
                    <option>Saved</option>
                    <option>Tailored</option>
                    <option>Applied</option>
                    <option>Recruiter Screen</option>
                    <option>Technical Interview</option>
                    <option>Offer</option>
                    <option>Rejected</option>
                  </select>
                </div>

                <Input label="Location" value={location} onChange={setLocation} />
                <Textarea label="Notes" value={notes} onChange={setNotes} rows={4} />

                <Textarea
                  label="Job Description"
                  value={jobDescription}
                  onChange={setJobDescription}
                  rows={10}
                />

                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium py-3 rounded-lg"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={handleAnalyzeJob}
                  disabled={isAnalyzing || !jobDescription}
                  className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-medium py-3 rounded-lg"
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze Job Fit"}
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  className="w-full border border-red-300 text-red-600 hover:bg-red-50 font-medium py-3 rounded-lg"
                >
                  Delete Job
                </button>
              </form>
            )}

            {activeTab === "analysis" && (
              <div>
                {isAnalyzing && (
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">
                      Analyzing your resume...
                    </h2>

                    <div className="space-y-2 text-slate-600">
                      <p>✓ Reading your master resume</p>
                      <p>✓ Comparing against the job description</p>
                      <p>✓ Finding strong evidence and gaps</p>
                      <p>✓ Generating interview prep</p>
                    </div>
                  </div>
                )}

                {!isAnalyzing && matchScore === null && (
                  <div className="text-center py-10">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                      No AI analysis yet
                    </h2>

                    <p className="text-slate-600">
                      Paste the job description under Job Details and click
                      Analyze Job Fit.
                    </p>
                  </div>
                )}

                {!isAnalyzing && matchScore !== null && (
                  <div>
                    <div className="bg-slate-900 text-white rounded-xl p-6 mb-8">
                      <p className="text-sm text-slate-300 mb-2">
                        Overall Job Fit
                      </p>

                      <div className="flex items-end gap-3">
                        <h2 className="text-5xl font-bold">{matchScore}%</h2>
                        <p className="text-lg font-medium mb-1">
                          {getFitLabel(matchScore)}
                        </p>
                      </div>

                      <p className="text-slate-300 mt-4">
                        This score reflects the evidence currently present in
                        your master resume. JobPilot AI identifies gaps honestly
                        instead of fabricating experience.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <AnalysisCard title="Strong Evidence" items={strengths} />
                      <AnalysisCard title="Partial Evidence" items={partialEvidence} />
                      <AnalysisCard title="Evidence Gaps" items={evidenceGaps} />
                      <AnalysisCard title="Skills to Learn" items={skillsToLearn} />
                    </div>

                    <div className="mt-6 space-y-6">
                      <AnalysisCard
                        title="Resume Optimization"
                        items={resumeSuggestions}
                      />

                      <AnalysisCard
                        title="Interview Questions"
                        items={interviewQuestions}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

function TabButton({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-5 py-3 font-medium border-b-2 ${
        isActive
          ? "border-blue-600 text-blue-600"
          : "border-transparent text-slate-500 hover:text-slate-900"
      }`}
    >
      {label}
    </button>
  );
}

function Input({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-900"
      />
    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
  rows,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-900"
      />
    </div>
  );
}

function getFitLabel(score: number) {
  if (score >= 85) return "Strong Fit";
  if (score >= 70) return "Moderate Fit";
  return "Needs Resume Work";
}

function AnalysisCard({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="border border-slate-200 rounded-xl p-5">
      <h3 className="text-lg font-semibold text-slate-900 mb-3">{title}</h3>

      {items && items.length > 0 ? (
        <ul className="space-y-2 text-slate-700">
          {items.map((item, index) => (
            <li key={index} className="leading-relaxed">
              • {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-slate-500">No items found.</p>
      )}
    </div>
  );
}