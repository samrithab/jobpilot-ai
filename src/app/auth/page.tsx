"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function AuthPage() {
  const router = useRouter();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);

    const result =
      mode === "signin"
        ? await supabase.auth.signInWithPassword({
            email,
            password,
          })
        : await supabase.auth.signUp({
            email,
            password,
          });

    setIsSubmitting(false);

    if (result.error) {
      toast.error(result.error.message);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-start justify-center px-6 pt-20 pb-12">
      <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-20 items-start">
        {/* Left Side */}
        <section>
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

          <p className="text-slate-300 text-xl max-w-2xl mb-12">
            An AI-powered career intelligence platform that helps software
            engineers manage applications, identify resume evidence gaps,
            prepare for interviews, and track their entire job search from one
            place.
          </p>

          <div className="grid sm:grid-cols-2 gap-5">
            <FeatureCard
              icon="📋"
              title="Track Jobs"
              description="Organize every application from saved to offer."
            />

            <FeatureCard
              icon="🤖"
              title="Analyze Fit"
              description="Compare your resume against every job posting."
            />

            <FeatureCard
              icon="📈"
              title="Close Gaps"
              description="Discover missing evidence before applying."
            />

            <FeatureCard
              icon="🎯"
              title="Prepare"
              description="Generate interview questions tailored to each role."
            />
          </div>
        </section>

        {/* Right Side */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8 lg:mt-16">
          <h2 className="text-4xl font-bold text-white mb-2">
            {mode === "signin" ? "Sign in" : "Create account"}
          </h2>

          <p className="text-slate-400 mb-8">
            Access your JobPilot AI workspace.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:bg-blue-400"
            >
              {isSubmitting
                ? "Please wait..."
                : mode === "signin"
                ? "Sign in"
                : "Create account"}
            </button>
          </form>

          <button
            type="button"
            onClick={() =>
              setMode(mode === "signin" ? "signup" : "signin")
            }
            className="mt-6 w-full text-center text-blue-400 hover:underline"
          >
            {mode === "signin"
              ? "Need an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </section>
      </div>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl bg-slate-900 p-5 border border-slate-800">
      <div className="mb-3 text-3xl">{icon}</div>

      <h3 className="font-semibold text-lg">{title}</h3>

      <p className="mt-2 text-sm text-slate-400">
        {description}
      </p>
    </div>
  );
}