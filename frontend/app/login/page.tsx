"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser } from "@/store/slices/authSlice";

export default function SignInPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      router.push("/candidates/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--surface-dark)] relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 mesh-gradient pointer-events-none" />
      <div className="fixed inset-0 grid-pattern pointer-events-none opacity-40" />
      
      {/* Decorative elements */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[var(--accent-primary)]/8 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-[var(--accent-tertiary)]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="glass-card rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Link 
              href="/" 
              className="w-10 h-10 rounded-xl bg-[var(--surface-elevated)] hover:bg-white/5 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all border border-[var(--border-subtle)]"
            >
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </Link>
            <div className="flex-1 text-center pr-10">
              <span className="text-[var(--text-muted)] text-xs font-mono tracking-wider uppercase">Welcome back</span>
              <h2 className="text-2xl font-semibold text-[var(--text-primary)]">Sign In</h2>
            </div>
        </div>

        {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm"
            >
            {error}
            </motion.div>
        )}

          <form onSubmit={handleSignIn} className="space-y-5">
          <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
                className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] text-[var(--text-primary)] px-4 py-3 focus:outline-none focus:border-[var(--accent-primary)]/50 focus:ring-1 focus:ring-[var(--accent-primary)]/30 transition-all placeholder:text-[var(--text-muted)]"
                placeholder="you@example.com"
            />
          </div>

          <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Password
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                  className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] text-[var(--text-primary)] px-4 py-3 pr-12 focus:outline-none focus:border-[var(--accent-primary)]/50 focus:ring-1 focus:ring-[var(--accent-primary)]/30 transition-all placeholder:text-[var(--text-muted)]"
                  placeholder="••••••••"
              />
              <button
                type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
              className="w-full btn-accent py-3.5 rounded-xl text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-[var(--surface-dark)] border-t-transparent rounded-full"
                  />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
          </button>
        </form>

          <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
          Don't have an account?{" "}
            <Link href="/signup" className="text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] font-medium transition-colors">
            Sign up
          </Link>
        </p>

          <div className="mt-8 pt-6 border-t border-[var(--border-subtle)]">
            <p className="text-center text-sm text-[var(--text-muted)]">
            Are you a recruiter?{" "}
              <Link href="/recruiters/login" className="text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] font-medium transition-colors">
              Sign in as Recruiter
            </Link>
          </p>
        </div>
      </div>

        {/* Branding */}
        <p className="mt-6 text-center text-xs text-[var(--text-muted)]">
          Powered by <span className="text-[var(--accent-primary)]">HireVision</span>
        </p>
      </motion.div>
    </div>
  );
}
