"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";
import { toast } from "sonner";

export default function JobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadJobs() {
      const user = await getCurrentUser();

      if (!user) {
        router.push("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        toast.error(error.message);
      } else {
        setJobs(data || []);
      }

      setIsLoading(false);
    }

    loadJobs();
  }, [router]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-slate-100 p-8">
          <p>Loading jobs...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-100 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Jobs</h1>
            <p className="text-slate-600 mt-2">
              Track applications and view AI fit insights at a glance.
            </p>
          </div>

          <Link
            href="/jobs/new"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Add Job
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="p-4 text-slate-600">Company</th>
                <th className="p-4 text-slate-600">Position</th>
                <th className="p-4 text-slate-600">Status</th>
                <th className="p-4 text-slate-600">AI Fit</th>
                <th className="p-4 text-slate-600">Location</th>
                <th className="p-4 text-slate-600">Job Link</th>
                <th className="p-4 text-slate-600">Notes</th>
              </tr>
            </thead>

            <tbody>
              {jobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No jobs yet. Add your first job to start tracking applications.
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.id} className="border-b hover:bg-slate-50">
                    <td className="p-4 text-slate-900 font-medium">
                      <Link href={`/jobs/${job.id}`} className="text-blue-600 hover:underline">
                        {job.company}
                      </Link>
                    </td>

                    <td className="p-4 text-slate-700">{job.position}</td>
                    <td className="p-4"><StatusBadge status={job.status} /></td>
                    <td className="p-4"><FitBadge score={job.match_score} /></td>
                    <td className="p-4 text-slate-700">{job.location || "-"}</td>

                    <td className="p-4">
                      {job.job_url ? (
                        <a href={job.job_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          View Posting
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>

                    <td className="p-4 text-slate-700 max-w-xs truncate">
                      {job.notes || "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}

function FitBadge({ score }: { score: number | null }) {
  if (score === null || score === undefined) {
    return <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">Not analyzed</span>;
  }

  let styles = "bg-red-100 text-red-700";
  let label = "Needs work";

  if (score >= 85) {
    styles = "bg-green-100 text-green-700";
    label = "Strong fit";
  } else if (score >= 70) {
    styles = "bg-yellow-100 text-yellow-700";
    label = "Moderate fit";
  }

  return <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${styles}`}>{score}% · {label}</span>;
}

function StatusBadge({ status }: { status: string }) {
  let styles = "bg-slate-100 text-slate-700";

  if (status === "Applied") styles = "bg-blue-100 text-blue-700";
  else if (["Interviewing", "Recruiter Screen", "Technical Interview"].includes(status)) styles = "bg-purple-100 text-purple-700";
  else if (status === "Offer") styles = "bg-green-100 text-green-700";
  else if (status === "Rejected") styles = "bg-red-100 text-red-700";
  else if (["Tailored", "Resume Tailored"].includes(status)) styles = "bg-yellow-100 text-yellow-700";

  return <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${styles}`}>{status}</span>;
}