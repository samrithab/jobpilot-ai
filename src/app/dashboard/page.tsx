import Navbar from "@/components/Navbar";
import StatCard from "@/components/StatCard";

export default function DashboardPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-100 p-8">
        <h1 className="text-4xl font-bold mb-8 text-slate-900">
          Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Jobs"
            value="24"
          />

          <StatCard
            title="Applied"
            value="10"
          />

          <StatCard
            title="Interviewing"
            value="5"
          />

          <StatCard
            title="Offers"
            value="1"
          />
        </div>

        <div className="mt-8 bg-white rounded-xl p-6 shadow">
            <h2 className="text-xl font-semibold mb-4 text-slate-900">
                Recent Applications
            </h2>

            <p className="text-slate-500">
                No applications yet.
            </p>
        </div>

      </main>
    </>
  );
}