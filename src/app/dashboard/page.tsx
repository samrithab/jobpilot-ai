import Navbar from "@/components/Navbar";
import StatCard from "@/components/StatCard";
import { supabase } from "@/lib/supabase";

export default async function DashboardPage() {
  const { data: jobs, error } = await supabase.from("jobs").select("*");

  if (error) {
    return <p className="p-8 text-red-500">Error: {error.message}</p>;
  }

  const totalJobs = jobs.length;
  const appliedJobs = jobs.filter((job) => job.status === "Applied").length;
  const interviewingJobs = jobs.filter((job) =>
    ["Interviewing", "Recruiter Screen", "Technical Interview", "Final Interview"].includes(
      job.status
    )
  ).length;
  const offers = jobs.filter((job) => job.status === "Offer").length;

  const analyzedJobs = jobs.filter((job) => job.match_score !== null);
  const averageFit =
    analyzedJobs.length > 0
      ? Math.round(
          analyzedJobs.reduce((sum, job) => sum + job.match_score, 0) /
            analyzedJobs.length
        )
      : null;

  const highestMatch = analyzedJobs.length
    ? analyzedJobs.reduce((best, job) =>
        job.match_score > best.match_score ? job : best
      )
    : null;

  const jobsNeedingWork = analyzedJobs.filter(
    (job) => job.match_score < 70
  ).length;

  const tailoredJobs = jobs.filter((job) =>
    ["Tailored", "Resume Tailored"].includes(job.status)
  ).length;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-100 p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-2">
            Track applications, AI fit scores, and resume optimization progress.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard title="Total Jobs" value={totalJobs.toString()} />
          <StatCard title="Applied" value={appliedJobs.toString()} />
          <StatCard title="Interviewing" value={interviewingJobs.toString()} />
          <StatCard title="Offers" value={offers.toString()} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <StatCard
            title="Average Fit"
            value={averageFit !== null ? `${averageFit}%` : "-"}
          />
          <StatCard
            title="Highest Match"
            value={
              highestMatch
                ? `${highestMatch.company} · ${highestMatch.match_score}%`
                : "-"
            }
          />
          <StatCard
            title="Needs Resume Work"
            value={jobsNeedingWork.toString()}
          />
          <StatCard
            title="Tailored Applications"
            value={tailoredJobs.toString()}
          />
        </div>

        <div className="mt-8 bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            AI Insights
          </h2>

          {analyzedJobs.length === 0 ? (
            <p className="text-slate-600">
              No AI analyses yet. Open a job, paste the job description, and run
              Analyze Job Fit.
            </p>
          ) : (
            <div className="space-y-3">
              <InsightRow
                label="Analyzed Jobs"
                value={`${analyzedJobs.length} of ${totalJobs}`}
              />
              <InsightRow
                label="Average Resume Fit"
                value={`${averageFit}% across analyzed jobs`}
              />
              <InsightRow
                label="Best Opportunity"
                value={
                  highestMatch
                    ? `${highestMatch.company} — ${highestMatch.position} (${highestMatch.match_score}%)`
                    : "-"
                }
              />
              <InsightRow
                label="Jobs Below 70%"
                value={`${jobsNeedingWork} need stronger resume alignment`}
              />
            </div>
          )}
        </div>
      </main>
    </>
  );
}

function InsightRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-slate-100 py-3">
      <span className="text-slate-600">{label}</span>
      <span className="font-medium text-slate-900 text-right">{value}</span>
    </div>
  );
}