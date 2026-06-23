"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";

export default function NewJobPage() {
  const router = useRouter();

  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("Saved");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsSaving(true);

    const { error } = await supabase.from("jobs").insert({
      company,
      position,
      status,
      location,
      notes,
    });

    setIsSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-100 p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-6">
            Add New Job
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Company
              </label>
              <input
                value={company}
                onChange={(event) => setCompany(event.target.value)}
                className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-900"
                placeholder="Google"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Position
              </label>
              <input
                value={position}
                onChange={(event) => setPosition(event.target.value)}
                className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-900"
                placeholder="Software Engineer Intern"
                required
              />
            </div>

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
                <option>Applied</option>
                <option>Interviewing</option>
                <option>Offer</option>
                <option>Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Location
              </label>
              <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-900"
                placeholder="Remote"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Notes
              </label>
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