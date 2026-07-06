"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
      setIsAuthLoading(false);
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsAuthLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setUser(null);
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

        {user && (
          <>
            <Link href="/dashboard" className="hover:text-blue-300 transition">
              Dashboard
            </Link>

            <Link href="/jobs" className="hover:text-blue-300 transition">
              Jobs
            </Link>

            <Link href="/profile" className="hover:text-blue-300 transition">
              Profile
            </Link>
          </>
        )}

        {!isAuthLoading &&
          (user ? (
            <button
              onClick={handleSignOut}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
            >
              Sign Out
            </button>
          ) : (
            <Link
              href="/auth"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
            >
              Sign In
            </Link>
          ))}
      </div>
    </nav>
  );
}