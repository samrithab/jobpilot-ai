import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
        <div className="max-w-4xl text-center">
          <p className="text-blue-400 font-semibold uppercase tracking-wider mb-4">
            JobPilot AI
          </p>

          <h1 className="text-6xl font-bold leading-tight mb-6">
            Track jobs.
            <br />
            Improve your resume.
            <br />
            Land more interviews.
          </h1>

          <p className="text-slate-300 text-xl max-w-3xl mx-auto mb-12">
            An AI-powered career intelligence platform that helps software
            engineers manage applications, identify resume evidence gaps,
            prepare for interviews, and track their entire job search from one
            place.
          </p>

          <div className="grid md:grid-cols-4 gap-4 mb-12">
            <div className="bg-slate-900 rounded-xl p-5">
              <div className="text-3xl mb-2">📋</div>
              <h3 className="font-semibold">Track Jobs</h3>
              <p className="text-sm text-slate-400 mt-2">
                Organize applications through every stage.
              </p>
            </div>

            <div className="bg-slate-900 rounded-xl p-5">
              <div className="text-3xl mb-2">🤖</div>
              <h3 className="font-semibold">Analyze Fit</h3>
              <p className="text-sm text-slate-400 mt-2">
                Compare your master resume against every job posting.
              </p>
            </div>

            <div className="bg-slate-900 rounded-xl p-5">
              <div className="text-3xl mb-2">📈</div>
              <h3 className="font-semibold">Close Gaps</h3>
              <p className="text-sm text-slate-400 mt-2">
                Improve your resume using only evidence you can honestly support.
              </p>
            </div>

            <div className="bg-slate-900 rounded-xl p-5">
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="font-semibold">Prepare</h3>
              <p className="text-sm text-slate-400 mt-2">
                Review AI-generated interview questions before applying.
              </p>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <a
              href="/jobs"
              className="bg-blue-600 hover:bg-blue-700 px-7 py-3 rounded-lg font-medium"
            >
              View Jobs
            </a>

            <a
              href="/jobs/new"
              className="border border-slate-600 hover:border-slate-400 px-7 py-3 rounded-lg font-medium"
            >
              Add Job
            </a>
          </div>
        </div>
      </main>
    </>
  );
}