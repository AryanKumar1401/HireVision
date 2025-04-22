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

  const handleSwitchRole = async () => {
    setIsLoading(true);
    try {
      // Create Supabase client
      const supabase = createClient();

      // Sign out the current user
      await supabase.auth.signOut();

      // Redirect to the appropriate signup page based on target role
      if (targetRole === "recruiter") {
        router.push("/recruiters/signup");
      } else {
        router.push("/signup");
      }
    } catch (error) {
      console.error("Error switching role:", error);
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", bounce: 0.25 }}
        className="bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-auto overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-gray-700">
          <h3 className="text-xl font-semibold text-white">
            Role Switch Required
          </h3>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-gray-300">
            You're currently signed in as a{" "}
            <span className="font-medium text-blue-400 capitalize">
              {currentRole}
            </span>
            . To access this {targetRole} page, you'll need to sign up with a{" "}
            {targetRole} account.
          </p>

          <div className="flex flex-col gap-4 pt-2">
            <button
              onClick={handleSwitchRole}
              disabled={isLoading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-center text-sm rounded-md transition-colors disabled:opacity-70"
            >
              {isLoading ? "Logging out..." : `Switch Role and Continue`}
            </button>

            <button
              onClick={onClose}
              className="w-full py-2.5 border border-gray-600 text-white text-center text-sm rounded-md hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RoleSwitchModal;
