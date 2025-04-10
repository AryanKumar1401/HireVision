"use client";
import { useState } from "react";
import { createClient } from "@/utils/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RecruiterSignUpPage() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          app_metadata: {
            // Store roles in app_metadata
            roles: ["recruiter"],
          },
        },
      },
    });
    console.log("supabase signup data", data);
    if (error) {
      setError(error.message);
    } else {
      // After successful signup, update user metadata to include the 'recruiter' role
      try {
        const { data: userResponse, error: userError } =
          await supabase.auth.getUser();
        if (userError) {
          console.error("Error getting user after signup:", userError);
          setError(userError.message);
          setLoading(false);
          return;
        }

        const user = userResponse.user;
        if (user) {
          const { error: profileError } = await supabase
            .from("recruiter_profiles")
            .insert({
              id: user.id,
              email: user.email, // Use email from auth.user
            });
        }

        // if (user) {
        //   const { error: metadataError } = await supabase.auth.updateUser({
        //     data: {
        //       roles: ["recruiter"],
        //     },
        //   });

        //   if (metadataError) {
        //     console.error("Error updating user metadata:", metadataError);
        //     setError(metadataError.message);
        //     setLoading(false);
        //     return;
        //   }
        // }

        // Redirect to recruiters page
        console.log(
          "Recruiter signed up successfully and redirecting to /recruiters:",
          data
        );
        router.push("/recruiters");
      } catch (err) {
        console.error("Unexpected error after signup:", err);
        setError("An unexpected error occurred. Please try again.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full p-8 bg-gray-800 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-white text-center mb-8">
          Create Recruiter Account
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 text-red-200 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Confirm Password
            </label>
            <input
              name="confirmPassword"
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
            {loading ? "Creating Account..." : "Create Recruiter Account"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            href="/recruiters/login"
            className="text-blue-400 hover:underline"
          >
            Sign in
          </Link>
        </p>

        <div className="mt-6 pt-6 border-t border-gray-700">
          <p className="text-center text-sm text-gray-400">
            Are you a candidate?{" "}
            <Link href="/signup" className="text-blue-400 hover:underline">
              Sign up as Candidate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
