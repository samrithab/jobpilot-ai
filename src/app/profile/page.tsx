"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const [profileId, setProfileId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [skills, setSkills] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") {
        alert(error.message);
      }

      if (data) {
        setProfileId(data.id);
        setName(data.name || "");
        setTargetRole(data.target_role || "");
        setSkills(data.skills || "");
        setResumeText(data.resume_text || "");
      }

      setIsLoading(false);
    }

    loadProfile();
  }, []);

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    setIsSaving(true);

    const profileData = {
      name,
      target_role: targetRole,
      skills,
      resume_text: resumeText,
    };

    let result;

    if (profileId) {
      result = await supabase
        .from("profiles")
        .update(profileData)
        .eq("id", profileId);
    } else {
      result = await supabase
        .from("profiles")
        .insert(profileData)
        .select()
        .single();

      if (result.data) {
        setProfileId(result.data.id);
      }
    }

    setIsSaving(false);

    if (result.error) {
      alert(result.error.message);
      return;
    }

    alert("Profile saved!");
  }

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-slate-100 p-8">
          <p className="text-slate-700">Loading profile...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-100 p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Resume Profile
          </h1>

          <p className="text-slate-500 mb-6">
            Save your resume so JobPilot AI can compare it against job descriptions.
          </p>

          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="block mb-2 font-medium text-slate-800">
                Name
              </label>
              <input
                className="w-full border border-slate-300 rounded-lg p-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Samritha Balamoni"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-slate-800">
                Target Role
              </label>
              <input
                className="w-full border border-slate-300 rounded-lg p-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="Full Stack Software Engineer"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-slate-800">
                Skills
              </label>
              <textarea
                className="w-full border border-slate-300 rounded-lg p-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="Flutter, Next.js, TypeScript, AWS..."
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-slate-800">
                Resume Text
              </label>
              <textarea
                className="w-full border border-slate-300 rounded-lg p-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={10}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume here..."
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg p-3 font-medium transition-colors"
            >
              {isSaving ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}