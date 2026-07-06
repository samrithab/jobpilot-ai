"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";
import { toast } from "sonner";

export default function NewJobPage() {
  const router = useRouter();

  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [status, setStatus] = useState("Saved");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsSaving(true);

    const user = await getCurrentUser();

    if (!user) {
      router.push("/auth");
      return;
    }

    const { error } = await supabase.from("jobs").insert({
      user_id: user.id,
      company,
      position,
      job_url: jobUrl,
      status,
      location,
      notes,
    });

    setIsSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    router.push("/jobs");
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-100 p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Add New Job
          </h1>

          <p className="text-slate-600 mb-6">
            Save a job opportunity, then analyze it against your master resume.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Company" value={company} onChange={setCompany} placeholder="Stripe" required />
            <Input label="Position" value={position} onChange={setPosition} placeholder="Full Stack Software Engineer" required />
            <Input label="Job URL" value={jobUrl} onChange={setJobUrl} placeholder="https://company.com/careers/job-id" />

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
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
                <option>Final Interview</option>
                <option>Offer</option>
                <option>Rejected</option>
              </select>
            </div>

            <Input label="Location" value={location} onChange={setLocation} placeholder="Toronto / Remote" />

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-900"
                placeholder="Referral submitted, waiting for recruiter..."
                rows={4}
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium py-3 rounded-lg"
            >
              {isSaving ? "Saving..." : "Save Job"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-900 placeholder:text-slate-400"
      />
    </div>
  );
}