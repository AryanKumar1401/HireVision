"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CandidatesRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Preserve query parameters (like ?code=xxx for interview invites)
    const params = searchParams.toString();
    const destination = params
      ? `/candidates/dashboard?${params}`
      : "/candidates/dashboard";

    router.replace(destination);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--surface-dark)]">
      <div className="w-10 h-10 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin" />
      <p className="text-[var(--text-muted)] mt-4 font-medium">Redirecting...</p>
    </div>
  );
}
