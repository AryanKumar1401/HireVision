import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/utils/auth";

interface RoleSwitchModalProps {
  currentRole: "candidate" | "recruiter";
  targetRole: "candidate" | "recruiter";
  targetPath: string;
  onClose: () => void;
}

const RoleSwitchModal = ({
  currentRole,
  targetRole,
  targetPath,
  onClose,
}: RoleSwitchModalProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        transition={{ type: "spring", bounce: 0.25 }}
        className="bg-[#0f0f0f]/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/50 max-w-md w-full mx-auto overflow-hidden border border-white/[0.06]"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/[0.04] bg-gradient-to-r from-amber-500/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
              <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white tracking-tight">
              Different Role Required
            </h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <p className="text-neutral-300 leading-relaxed">
            You&apos;re currently signed in as a{" "}
            <span className="font-semibold text-amber-400 capitalize">
              {currentRole}
            </span>
            . This page is for {targetRole} users. You need to log out before
            accessing this section.
          </p>

          <div className="flex flex-col gap-3">
            <motion.button
              onClick={handleLogout}
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white text-center text-sm font-medium rounded-xl transition-all shadow-lg shadow-amber-500/25 disabled:opacity-70 disabled:cursor-not-allowed"
              whileHover={{ scale: isLoading ? 1 : 1.01 }}
              whileTap={{ scale: isLoading ? 1 : 0.99 }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Logging out...
                </span>
              ) : (
                "Log Out"
              )}
            </motion.button>

            <motion.button
              onClick={onClose}
              className="w-full py-3 bg-white/[0.04] hover:bg-white/[0.08] text-white text-center text-sm font-medium rounded-xl border border-white/[0.06] transition-all"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              Cancel
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RoleSwitchModal;
