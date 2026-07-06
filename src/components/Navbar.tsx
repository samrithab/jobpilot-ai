"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const router = useRouter();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/auth");
  }

  return (
    <nav className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center">
      <Link
        href="/dashboard"
        className="font-bold text-xl hover:text-blue-300 transition"
      >
        JobPilot AI
      </Link>

      <div className="flex items-center gap-6">
        <Link href="/" className="hover:text-blue-300 transition">
          Home
        </Link>

        <Link href="/dashboard" className="hover:text-blue-300 transition">
          Dashboard
        </Link>

        <Link href="/jobs" className="hover:text-blue-300 transition">
          Jobs
        </Link>

        {/* <Link href="/jobs/new" className="hover:text-blue-300 transition">
          Add Job
        </Link> */}

        <Link href="/profile" className="hover:text-blue-300 transition">
          Profile
        </Link>

        <button
          onClick={handleSignOut}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
}