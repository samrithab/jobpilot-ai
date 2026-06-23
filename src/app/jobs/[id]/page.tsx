"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const jobId = params.id as string;

  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("Saved");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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
      setStatus(data.status || "Saved");
      setLocation(data.location || "");
      setNotes(data.notes || "");
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
        status,
        location,
        notes,
      })
      .eq("id", jobId);

    setIsSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/jobs");
  }

  async function handleDelete() {
    const confirmed = confirm("Are you sure you want to delete this job?");

    if (!confirmed) return;

    const { error } = await supabase
      .from("jobs")
      .delete()
      .eq("id", jobId);

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
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-6">
            Edit Job
          </h1>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Company
              </label>
              <input
                value={company}
                onChange={(event) => setCompany(event.target.value)}
                className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-900"
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
                rows={4}
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium py-3 rounded-lg"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="w-full border border-red-300 text-red-600 hover:bg-red-50 font-medium py-3 rounded-lg"
            >
              Delete Job
            </button>
          </form>
        </div>
      </main>
    </>
  );
}