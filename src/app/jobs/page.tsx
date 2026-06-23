import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";

export default async function JobsPage() {
  const { data: jobs, error } = await supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return <p className="p-8 text-red-500">Error: {error.message}</p>;
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-100 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Jobs</h1>

          <a
            href="/jobs/new"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Add Job
          </a>
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="p-4 text-slate-600">Company</th>
                <th className="p-4 text-slate-600">Position</th>
                <th className="p-4 text-slate-600">Status</th>
                <th className="p-4 text-slate-600">Location</th>
                <th className="p-4 text-slate-600">Notes</th>
              </tr>
            </thead>

            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className="border-b hover:bg-slate-50">
                  <td className="p-4 text-slate-900 font-medium">
                    <a href={`/jobs/${job.id}`} className="text-blue-600 hover:underline">
                        {job.company}
                    </a>
                  </td>
                  <td className="p-4 text-slate-700">
                    {job.position}
                  </td>
                  <td className="p-4 text-slate-700">
                    {job.status}
                  </td>
                  <td className="p-4 text-slate-700">
                    {job.location || "-"}
                  </td>
                  <td className="p-4 text-slate-700">
                    {job.notes || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}