"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";
import { toast } from "sonner";

export default function ProfilePage() {
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [skills, setSkills] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");
  const [resumeFileKey, setResumeFileKey] = useState("");
  const [selectedResumeFile, setSelectedResumeFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const user = await getCurrentUser();

      if (!user) {
        router.push("/auth");
        return;
      }

      setUserId(user.id);

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") {
        toast.error(error.message);
      }

      if (data) {
        setProfileId(data.id);
        setName(data.name || "");
        setTargetRole(data.target_role || "");
        setSkills(data.skills || "");
        setResumeText(data.resume_text || "");
        setResumeFileName(data.resume_file_name || "");
        setResumeFileKey(data.resume_file_key || "");
      }

      setIsLoading(false);
    }

    loadProfile();
  }, [router]);

  async function uploadResumeFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    if (resumeFileKey) {
      formData.append("oldResumeFileKey", resumeFileKey);
    }

    const response = await fetch("/api/resume-upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Resume upload failed.");
    }

    return data as {
      resumeFileKey: string;
      resumeFileName: string;
      resumeText: string;
    };
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();

    if (!userId) {
      toast.error("Please sign in first.");
      router.push("/auth");
      return;
    }

    setIsSaving(true);

    try {
      let uploadedFileKey = resumeFileKey;
      let uploadedFileName = resumeFileName;
      let uploadedResumeText = resumeText;

      if (selectedResumeFile) {
        const uploaded = await uploadResumeFile(selectedResumeFile);

        uploadedFileKey = uploaded.resumeFileKey;
        uploadedFileName = uploaded.resumeFileName;
        uploadedResumeText = uploaded.resumeText;

        setResumeText(uploaded.resumeText);
      }

      const profileData = {
        user_id: userId,
        name,
        target_role: targetRole,
        skills,
        resume_text: uploadedResumeText,
        resume_file_key: uploadedFileKey || null,
        resume_file_name: uploadedFileName || null,
        resume_uploaded_at: selectedResumeFile ? new Date().toISOString() : null,
      };

      let result;

      if (profileId) {
        result = await supabase
          .from("profiles")
          .update(profileData)
          .eq("id", profileId)
          .eq("user_id", userId);
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

      if (result.error) {
        throw new Error(result.error.message);
      }

      setResumeFileKey(uploadedFileKey);
      setResumeFileName(uploadedFileName);
      setSelectedResumeFile(null);

      toast.success("Profile saved!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setIsSaving(false);
    }
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
            Save your resume so JobPilot AI can compare it against job
            descriptions.
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
                placeholder="John Doe"
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
                Upload Resume PDF
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setSelectedResumeFile(file);
                }}
                className="w-full border border-slate-300 rounded-lg p-3 text-slate-900"
              />

              {resumeFileName && (
                <p className="text-sm text-slate-500 mt-2">
                  Current uploaded resume: {resumeFileName}
                </p>
              )}

              {selectedResumeFile && (
                <p className="text-sm text-blue-600 mt-2">
                  Selected new resume: {selectedResumeFile.name}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2 font-medium text-slate-800">
                Resume Status
              </label>

              {resumeText ? (
                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                  <p className="font-medium text-green-800">
                    ✅ Resume successfully processed
                  </p>

                  <p className="text-sm text-green-700 mt-2">
                    Your PDF was uploaded, text was extracted, and JobPilot AI
                    will use it automatically when analyzing jobs.
                  </p>

                  {resumeFileName && (
                    <p className="text-sm text-slate-600 mt-3">
                      Current resume: <strong>{resumeFileName}</strong>
                    </p>
                  )}
                </div>
              ) : (
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                  <p className="text-yellow-800">
                    No resume has been processed yet.
                  </p>
                </div>
              )}
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