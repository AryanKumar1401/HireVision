"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

const LoginPage = () => {
  const [companyName, setCompanyName] = useState("");
  const [adminName, setAdminName] = useState("");
  const [email, setAdminEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const supabase = createClientComponentClient();

  const generateCompanyId = () => Math.floor(Math.random() * 900000) + 100000;

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const companyId = generateCompanyId();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          admin_name: adminName,
          company_name: companyName,
          company_number: companyId,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }


    const { error: dbError } = await supabase.from("companies").insert([
      {
        company_name: companyName,
        admin_name: adminName,
        admin_email: email,
        company_number: companyId,
        user_id: data.user?.id, // Link to auth user
      },
    ]);

    if (dbError) {
      setError(dbError.message);
      setLoading(false);
      return;
    }

    router.push("/companies/dashboard");
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-purple-900 to-blue-900">
      {/* Floating Animated Blobs */}
      <motion.div
        initial={{ opacity: 0.7, x: -100, y: -100 }}
        animate={{ x: [-100, 100, -100], y: [-100, 50, -100] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-40 h-40 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70"
      />
      <motion.div
        initial={{ opacity: 0.6, x: 200, y: 50 }}
        animate={{ x: [200, -50, 200], y: [50, -100, 50] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-32 h-32 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70"
      />
      <motion.div
        initial={{ opacity: 0.65, x: -150, y: 300 }}
        animate={{ x: [-150, 50, -150], y: [300, 250, 300] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-48 h-48 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70"
      />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-start min-h-screen px-4 py-16">
        {/* Separate Large Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white">
            Join the Hiring Revolution
          </h1>
          <p className="mt-4 text-2xl text-indigo-200">
            Hire better talent, faster &amp; simpler.
          </p>
        </div>

        {/* Sign Up Form Container */}
        <div className="max-w-md w-full p-8 bg-gray-800 rounded-xl shadow-lg">
          <div className="flex items-center mb-6">
            <Link href="/" className="text-gray-300 hover:text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
            <h2 className="text-2xl font-bold text-white flex-1 pl-3">
              Company Sign Up
            </h2>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900/50 text-red-200 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Company Name
              </label>
              <input
                name="companyName"
                type="text"
                required
                placeholder="Your Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 text-white px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">
                Admin Name
              </label>
              <input
                name="adminName"
                type="text"
                required
                placeholder="Admin Name"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 text-white px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">
                Admin Email
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="your-email@example.com"
                value={email}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 text-white px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">
                Admin Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 text-white px-3 py-2 pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                        clipRule="evenodd"
                      />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-center text-sm text-gray-400">
              Already have a company account?{" "}
              <Link
                href="/companies/signin"
                className="text-blue-400 hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
