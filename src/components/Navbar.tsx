export default function Navbar() {
  return (
    <nav className="bg-slate-900 text-white px-6 py-4 flex justify-between">
      <h1 className="font-bold text-xl">
        JobPilot AI
      </h1>

      <div className="flex gap-4">
        <a href="/">Home</a>
        <a href="/dashboard">Dashboard</a>
        <a href="/jobs">Jobs</a>
        <a href="/jobs/new">Add Job</a>
        <a href="/profile">Profile</a>
      </div>
    </nav>
  );
}