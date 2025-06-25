"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/auth";
import { getBackendUrl } from "@/utils/env";
import { motion, AnimatePresence } from "framer-motion";

const supabase = createClient();

interface InterviewQuestion {
  id: string;
  question: string;
  order: number;
}

interface CandidateInvite {
  id: string;
  email: string;
  invite_code: string;
  status: "pending" | "accepted" | "completed";
  created_at: string;
}

interface NewInterviewProps {
  onClose: () => void;
  recruiterId: string;
  companyNumber: string;
}

export default function NewInterview({ onClose, recruiterId, companyNumber }: NewInterviewProps) {
  const [step, setStep] = useState<"questions" | "invite" | "review">("questions");
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteEmails, setInviteEmails] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [interviewTitle, setInterviewTitle] = useState("");
  const [interviewDescription, setInterviewDescription] = useState("");

  // Generate a 6-digit invite code
  const generateInviteCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Add a new question
  const addQuestion = () => {
    if (newQuestion.trim()) {
      const question: InterviewQuestion = {
        id: Date.now().toString(),
        question: newQuestion.trim(),
        order: questions.length,
      };
      setQuestions([...questions, question]);
      setNewQuestion("");
    }
  };

  // Remove a question
  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  // Reorder questions
  const moveQuestion = (id: string, direction: "up" | "down") => {
    const index = questions.findIndex(q => q.id === id);
    if (index === -1) return;

    const newQuestions = [...questions];
    if (direction === "up" && index > 0) {
      [newQuestions[index], newQuestions[index - 1]] = [newQuestions[index - 1], newQuestions[index]];
    } else if (direction === "down" && index < questions.length - 1) {
      [newQuestions[index], newQuestions[index + 1]] = [newQuestions[index + 1], newQuestions[index]];
    }

    // Update order numbers
    newQuestions.forEach((q, i) => {
      q.order = i;
    });

    setQuestions(newQuestions);
  };

  // Add email to invite list
  const addEmail = () => {
    const email = inviteEmail.trim();
    if (email && !inviteEmails.includes(email)) {
      setInviteEmails([...inviteEmails, email]);
      setInviteEmail("");
    }
  };

  // Remove email from invite list
  const removeEmail = (email: string) => {
    setInviteEmails(inviteEmails.filter(e => e !== email));
  };

  // Create the interview and send invites
  const createInterview = async () => {
    if (!interviewTitle.trim() || questions.length === 0) {
      setMessage({ type: "error", text: "Please provide a title and at least one question." });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      // Create interview record
      const { data: interview, error: interviewError } = await supabase
        .from("interview")
        .insert({
          recruiter_id: recruiterId,
          created_at: new Date().toISOString(),
          // title: interviewTitle, // Uncomment if you add this column
          // description: interviewDescription, // Uncomment if you add this column
        })
        .select()
        .single();

      if (interviewError) throw interviewError;

      // Insert questions
      const questionsToInsert = questions.map(q => ({
        interview_id: interview.id,
        question: q.question,
        // order: q.order, // Only if you add this column
        // company_number: companyNumber, // If you want to associate with company
      }));

      const { error: questionsError } = await supabase
        .from("interview_questions")
        .insert(questionsToInsert);

      if (questionsError) throw questionsError;

      // Send invites to candidates
      await Promise.all(
        inviteEmails.map(email => {
          const inviteCode = generateInviteCode();
          return supabase.from('candidate_invites').insert({
            interview_id: interview.id,
            email,
            invite_code: Number(inviteCode),
            status: 'pending',
            created_st: new Date().toISOString(),
          });
        })
      );

      setMessage({ type: "success", text: "Interview created successfully! Invites have been sent to candidates." });
      
      // Close modal after a delay
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (error) {
      console.error("Error creating interview:", error);
      console.log(error);
      setMessage({ type: "error", text: "Failed to create interview. Please try again." });
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
        className="bg-gray-800 w-full max-w-4xl max-h-[90vh] rounded-xl border border-gray-700 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gray-900 px-6 py-4 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Create New Interview</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Progress Steps */}
          <div className="flex justify-center mt-4">
            <div className="flex space-x-4">
              {["questions", "invite", "review"].map((stepName, index) => (
                <div key={stepName} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step === stepName
                        ? "bg-blue-600 text-white"
                        : step === "questions" && index === 0
                        ? "bg-blue-600 text-white"
                        : step === "invite" && index <= 1
                        ? "bg-blue-600 text-white"
                        : step === "review" && index <= 2
                        ? "bg-blue-600 text-white"
                        : "bg-gray-600 text-gray-300"
                    }`}
                  >
                    {index + 1}
                  </div>
                  {index < 2 && (
                    <div
                      className={`w-12 h-1 mx-2 ${
                        step === "invite" && index === 0
                          ? "bg-blue-600"
                          : step === "review" && index <= 1
                          ? "bg-blue-600"
                          : "bg-gray-600"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <AnimatePresence mode="wait">
            {step === "questions" && (
              <motion.div
                key="questions"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Interview Title
                  </label>
                  <input
                    type="text"
                    value={interviewTitle}
                    onChange={(e) => setInterviewTitle(e.target.value)}
                    placeholder="e.g., Frontend Developer Assessment"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={interviewDescription}
                    onChange={(e) => setInterviewDescription(e.target.value)}
                    placeholder="Brief description of the interview..."
                    rows={3}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-4">
                    Interview Questions ({questions.length})
                  </label>
                  
                  <div className="space-y-3 mb-4">
                    {questions.map((question, index) => (
                      <div key={question.id} className="flex items-center space-x-2 bg-gray-700 rounded-lg p-3">
                        <span className="text-gray-400 text-sm font-medium min-w-[30px]">
                          {index + 1}.
                        </span>
                        <span className="flex-1 text-white">{question.question}</span>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => moveQuestion(question.id, "up")}
                            disabled={index === 0}
                            className="p-1 text-gray-400 hover:text-white disabled:opacity-50"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => moveQuestion(question.id, "down")}
                            disabled={index === questions.length - 1}
                            className="p-1 text-gray-400 hover:text-white disabled:opacity-50"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => removeQuestion(question.id)}
                            className="p-1 text-red-400 hover:text-red-300"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addQuestion()}
                      placeholder="Enter a new question..."
                      className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={addQuestion}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setStep("invite")}
                    disabled={questions.length === 0}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    Next: Invite Candidates
                  </button>
                </div>
              </motion.div>
            )}

            {step === "invite" && (
              <motion.div
                key="invite"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Invite Candidates</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Enter email addresses of candidates you'd like to invite. Each candidate will receive a unique 6-digit code to access the interview.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Candidate Email
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addEmail()}
                      placeholder="candidate@example.com"
                      className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={addEmail}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {inviteEmails.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Invited Candidates ({inviteEmails.length})
                    </label>
                    <div className="space-y-2">
                      {inviteEmails.map((email, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                          <span className="text-white">{email}</span>
                          <button
                            onClick={() => removeEmail(email)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between space-x-3 pt-4">
                  <button
                    onClick={() => setStep("questions")}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep("review")}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Next: Review & Create
                  </button>
                </div>
              </motion.div>
            )}

            {step === "review" && (
              <motion.div
                key="review"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">Review Interview Details</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                      <div className="bg-gray-700 rounded-lg p-3">
                        <span className="text-white">{interviewTitle}</span>
                      </div>
                    </div>

                    {interviewDescription && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                        <div className="bg-gray-700 rounded-lg p-3">
                          <span className="text-white">{interviewDescription}</span>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Questions ({questions.length})
                      </label>
                      <div className="bg-gray-700 rounded-lg p-3 max-h-40 overflow-y-auto">
                        {questions.map((question, index) => (
                          <div key={question.id} className="text-white mb-2">
                            <span className="text-gray-400">{index + 1}. </span>
                            {question.question}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Invited Candidates ({inviteEmails.length})
                    </label>
                    <div className="bg-gray-700 rounded-lg p-3 max-h-40 overflow-y-auto">
                      {inviteEmails.length > 0 ? (
                        inviteEmails.map((email, index) => (
                          <div key={index} className="text-white mb-1">
                            {email}
                          </div>
                        ))
                      ) : (
                        <span className="text-gray-400">No candidates invited</span>
                      )}
                    </div>
                  </div>
                </div>

                {message && (
                  <div className={`p-4 rounded-lg ${
                    message.type === "success" ? "bg-green-900/50 text-green-300" : "bg-red-900/50 text-red-300"
                  }`}>
                    {message.text}
                  </div>
                )}

                <div className="flex justify-between space-x-3 pt-4">
                  <button
                    onClick={() => setStep("invite")}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={createInterview}
                    disabled={isLoading}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
                  >
                    {isLoading && (
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    )}
                    <span>{isLoading ? "Creating..." : "Create Interview"}</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
