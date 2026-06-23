import Navbar from "@/components/Navbar";
import StatCard from "@/components/StatCard";
import { supabase } from "@/lib/supabase";

export default async function DashboardPage() {
  const { data: jobs, error } = await supabase
    .from("jobs")
    .select("*");

  if (error) {
    return <p className="p-8 text-red-500">Error: {error.message}</p>;
  }

  const totalJobs = jobs.length;
  const appliedJobs = jobs.filter((job) => job.status === "Applied").length;
  const interviewingJobs = jobs.filter((job) => job.status === "Interviewing").length;
  const offers = jobs.filter((job) => job.status === "Offer").length;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-100 p-8">
        <h1 className="text-4xl font-bold mb-8 text-slate-900">
          Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard title="Total Jobs" value={totalJobs.toString()} />
          <StatCard title="Applied" value={appliedJobs.toString()} />
          <StatCard title="Interviewing" value={interviewingJobs.toString()} />
          <StatCard title="Offers" value={offers.toString()} />
        </div>
      </main>
    </>
  );
}