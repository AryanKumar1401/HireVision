"use client";
import React, { useState } from "react";
import { createClient } from "@/utils/auth";
import { motion } from "framer-motion";

const supabase = createClient();

interface AddInterviewModalProps {
  onClose: () => void;
  onSuccess: () => void;
  initialCode?: string;
}

export default function AddInterviewModal({ onClose, onSuccess, initialCode }: AddInterviewModalProps) {
  const [inviteCode, setInviteCode] = useState(initialCode || "");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleAddInterview = async () => {
    if (!inviteCode.trim()) {
      setMessage({ type: "error", text: "Please enter an interview code." });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setMessage({ type: "error", text: "You must be logged in to add an interview." });
        return;
      }

      console.log(`🔍 [ADD_INTERVIEW] Checking invite code: ${inviteCode.trim()}`);

      // Check if the invite code exists and is valid
      const { data: invites, error: inviteError } = await supabase
        .from("interview_invites")
        .select("id, email, status, created_at, interview_id, invite_code")
        .eq("invite_code", inviteCode.trim());

      console.log('Supabase invite lookup:', { invites, inviteError });

      if (inviteError) {
        console.error(`❌ [ADD_INTERVIEW] Invite lookup error:`, inviteError);
        setMessage({ type: "error", text: "Error checking invite code. Please try again." });
        return;
      }
      if (!invites || invites.length === 0) {
        setMessage({ type: "error", text: "Invalid interview code. Please check the code and try again." });
        return;
      }
      if (invites.length > 1) {
        setMessage({ type: "error", text: "Duplicate invite codes found. Please contact support." });
        return;
      }
      const invite = invites[0];

      console.log(`✅ [ADD_INTERVIEW] Found invite:`, invite);

      // Check if the invite is still pending (not expired or already used)
      if (invite.status !== "pending") {
        if (invite.status === "expired") {
          setMessage({ type: "error", text: "This interview code has expired. Please contact the recruiter for a new invitation." });
        } else if (invite.status === "accepted") {
          setMessage({ type: "error", text: "This interview code has already been used. Please contact the recruiter if you need access." });
        } else if (invite.status === "completed") {
          setMessage({ type: "error", text: "This interview has already been completed." });
        } else {
          setMessage({ type: "error", text: "This interview code is no longer valid. Please contact the recruiter for assistance." });
        }
        return;
      }

      // Check if the invite is older than 30 days (expired)
      const inviteDate = new Date(invite.created_at);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      if (inviteDate < thirtyDaysAgo) {
        // Update the invite status to expired
        await supabase
          .from("interview_invites")
          .update({ status: "expired" })
          .eq("id", invite.id);
        
        setMessage({ type: "error", text: "This interview code has expired. Please contact the recruiter for a new invitation." });
        return;
      }

      // Check if user already has access to this interview
      const { data: existingAccess } = await supabase
        .from("interview_participants")
        .select("*")
        .eq("interview_id", invite.interview_id)
        .eq("user_id", user.id)
        .single();

      if (existingAccess) {
        setMessage({ type: "error", text: "You already have access to this interview." });
        return;
      }

      // Add user to interview participants
      const { error: participantError } = await supabase
        .from("interview_participants")
        .insert({
          interview_id: invite.interview_id,
          user_id: user.id,
          status: "active",
          joined_at: new Date().toISOString(),
        });

      if (participantError) {
        throw participantError;
      }

      // Update invite status to accepted
      const { error: updateError } = await supabase
        .from("interview_invites")
        .update({ status: "accepted" })
        .eq("id", invite.id);

      if (updateError) {
        console.error("Error updating invite status:", updateError);
      }

      setMessage({ type: "success", text: "Interview added successfully! You can now access it from your dashboard." });
      
      // Close modal after a delay
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);

    } catch (error) {
      console.error("Error adding interview:", error);
      setMessage({ type: "error", text: "Failed to add interview. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gray-800 w-full max-w-md rounded-xl border border-gray-700 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gray-900 px-6 py-4 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Add Interview</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Enter Interview Code</h3>
              <p className="text-gray-400 text-sm mb-4">
                Enter the 6-digit interview code you received in your email invitation.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Interview Code
              </label>
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                maxLength={6}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl font-mono tracking-widest"
              />
            </div>

            {message && (
              <div className={`p-4 rounded-lg ${
                message.type === "success" ? "bg-green-900/50 text-green-300" : "bg-red-900/50 text-red-300"
              }`}>
                {message.text}
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddInterview}
                disabled={isLoading || inviteCode.length !== 6}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                {isLoading && (
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                <span>{isLoading ? "Adding..." : "Add Interview"}</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 