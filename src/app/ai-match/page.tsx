"use client";

import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { toast } from "sonner";

export default function AIMatchPage() {
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleAnalyze() {
    setIsLoading(true);
    setResult(null);

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .limit(1)
      .single();

    if (error || !profile) {
      toast.error("Please save your resume profile first.");
      setIsLoading(false);
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

    setIsLoading(false);

    if (!response.ok) {
      toast.error(data.error || "Something went wrong.");
      return;
    }

    setResult(data.result);
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-100 p-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            AI Resume Match
          </h1>

          <p className="text-slate-600 mb-8">
            Paste a job description and let JobPilot AI analyze how well your resume matches.
          </p>

          <div className="bg-white rounded-xl shadow p-6">
            <label className="block text-lg font-semibold text-slate-800 mb-3">
              Job Description
            </label>

            <textarea
              rows={18}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-4 text-slate-900 placeholder:text-slate-400"
              placeholder="Paste the entire job description here..."
            />

            <button
              onClick={handleAnalyze}
              disabled={isLoading || !jobDescription}
              className="mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg font-medium"
            >
              {isLoading ? "Analyzing..." : "Analyze Match"}
            </button>
          </div>

          {result && (
            <div className="mt-8 bg-white rounded-xl shadow p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Match Score: {result.matchScore}%
              </h2>

              <Section title="Strengths" items={result.strengths} />
              <Section title="Missing Skills" items={result.missingSkills} />
              <Section title="Resume Suggestions" items={result.resumeSuggestions} />
              <Section title="Interview Questions" items={result.interviewQuestions} />
            </div>
          )}
        </div>
      </main>
    </>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <ul className="list-disc list-inside text-slate-700 space-y-1">
        {items?.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}