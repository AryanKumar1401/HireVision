"use client"
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";

const LoginPage = () => {

    const [companyName, setCompanyName] = useState("");
    const [adminName, setAdminName] = useState("");
    const [email, setAdminEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const router = useRouter();
    const supabase = createClientComponentClient();

    const generateCompanyId = () => {
        return Math.floor(Math.random() * 900000) + 100000;
    }

    //this handles the sign up form submission
    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const {data, error: signUpError } = await supabase.auth.signUp({
            email, 
            password, 
            options: {
                data: {
                    admin_name: adminName,
                    company_name: companyName, 
                },
            },
        });

        if(signUpError) {
            setError(signUpError.message);
            setLoading(false);
            return;
        }

        const companyId = generateCompanyId();

         // Insert the company record into your "companies" table.
    const { error: dbError } = await supabase.from("companies").insert([
        {
          company_id: companyId,
          company_name: companyName,
          admin_name: adminName,
          // Optionally, store the user's ID from the signup.
          user_id: data?.user?.id,
        },
      ]);
  
      if (dbError) {
        setError(dbError.message);
        setLoading(false);
        return;
      }
  
      // Redirect upon successful sign up.
      router.push("/companies/dashboard");
      setLoading(false);

    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
          <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
            <h1 className="text-2xl font-bold mb-6 text-center">Company Sign Up</h1>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label htmlFor="companyName" className="block text-gray-700">
                  Company Name
                </label>
                <input
                  id="companyName"
                  type="text"
                  placeholder="Your Company Name"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="adminName" className="block text-gray-700">
                  Admin Name
                </label>
                <input
                  id="adminName"
                  type="text"
                  placeholder="Admin Name"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-700">
                  Admin Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="your-email@example.com"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  value={email}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-gray-700">
                  Admin Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
                disabled={loading}
              >
                {loading ? "Signing up..." : "Sign Up"}
              </button>
            </form>
          </div>
        </div>
      );
};

export default LoginPage;