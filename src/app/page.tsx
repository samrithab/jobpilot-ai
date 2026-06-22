import Navbar from "@/components/Navbar";
export default function Home() {
  return (
    <>
          <Navbar />
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <div className="max-w-3xl text-center">
        <p className="text-blue-400 font-semibold mb-4">
          JobPilot AI
        </p>

        <h1 className="text-5xl font-bold mb-6">
          Track jobs. Tailor resumes. Land interviews.
        </h1>

        <p className="text-slate-300 text-lg mb-8">
          An AI-powered job application tracker that helps you organize
          applications and improve your resume for every role.
        </p>

        <div className="flex gap-4 justify-center">
          <a
            href="/dashboard"
            className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg"
          >
            Dashboard
          </a>

          <a
            href="/login"
            className="border border-slate-600 px-6 py-3 rounded-lg"
          >
            Login
          </a>
        </div>
      </div>
    </main>
    </>
  );
}