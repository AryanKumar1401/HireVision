"use client";
import { useState } from "react";
import { createClient } from "@/utils/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RecruiterLoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      // Check user role after successful sign in
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const roles = user?.user_metadata?.app_metadata?.roles || [];

      if (!roles.includes("recruiter")) {
        // Sign out if not a recruiter
        await supabase.auth.signOut();
        setError(
          "You are not authorized as a recruiter. Please sign in as a candidate instead."
        );
      } else {
        router.push("/recruiters");
        router.refresh(); // Force refresh to update session
      }
    } catch (err) {
      setError("An error occurred during sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full p-8 bg-gray-800 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-white mb-8">
          Recruiter Sign In
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 text-red-200 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 text-white px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 text-white px-3 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-400">
          Don't have a recruiter account?{" "}
          <Link
            href="/recruiters/signup"
            className="text-blue-400 hover:underline"
          >
            Sign up as Recruiter
          </Link>
        </p>

        <div className="mt-6 pt-6 border-t border-gray-700">
          <p className="text-center text-sm text-gray-400">
            Are you a candidate?{" "}
            <Link href="/login" className="text-blue-400 hover:underline">
              Sign in as Candidate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
