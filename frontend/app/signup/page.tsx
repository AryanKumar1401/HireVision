"use client";
import { useState } from "react";
import { createClient } from "@/utils/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpPage() {
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
          roles: ["candidate"], 
        },
      },
    });

    if (error) {
      setError(error.message);
    } else {
      // After successful signup, update user metadata to include the 'candidate' role
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
          const { error: metadataError } = await supabase.auth.updateUser({
            data: {
              roles: ["candidate"],
            },
          });

          if (metadataError) {
            console.error("Error updating user metadata:", metadataError);
            setError(metadataError.message);
            setLoading(false);
            return;
          }
        }

        // Check user roles and redirect accordingly
        const roles = user?.app_metadata?.roles || ["candidate"];
        console.log("User roles:", roles);

        if (roles.includes("recruiter")) {
          console.log("Redirecting to recruiter dashboard");
          router.push("/recruiters");
        } else {
          router.push("/candidates");
        }
      } catch (err) {
        console.error("Unexpected error after signup:", err);
        setError("An unexpected error occurred. Please try again.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-black text-center mb-8">
          Create Account
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-600 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              className="mt-1 block w-full rounded-md border text-black border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              className="mt-1 block w-full rounded-md border text-black border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              name="confirmPassword"
              type="password"
              required
              className="mt-1 block w-full rounded-md border text-black border-gray-300 px-3 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
