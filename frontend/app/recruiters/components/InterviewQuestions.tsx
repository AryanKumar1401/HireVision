"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/auth";

interface Question {
  id: string;
  question: string;
  order_index: number;
  interview_id: string;
  interview?: { recruiter_id: string };
}

interface InterviewQuestionsProps {
  recruiterId: string;
}

export default function InterviewQuestions({ recruiterId }: InterviewQuestionsProps) {
  const supabase = createClient();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true);
      // Fetch all interview questions for interviews created by this recruiter
      const { data, error } = await supabase
        .from("interview_questions")
        .select("*, interview:interview_id(recruiter_id)")
        .order("order_index");
      if (error) {
        setError(error.message);
      } else {
        // Filter in JS in case Supabase join filter is not working
        const filtered = (data || []).filter(q => q.interview && q.interview.recruiter_id === recruiterId);
        setQuestions(filtered);
      }
      setLoading(false);
    }
    if (recruiterId) fetchQuestions();
  }, [recruiterId]);

  const addQuestion = async () => {
    if (!newQuestion.trim()) return;
    setLoading(true);
    setError(null);
    // Find or create an interview for this recruiter (for demo, just use the first found or create a new one)
    let interviewId: string | null = null;
    // Try to find an existing interview for this recruiter
    const { data: interviews, error: interviewError } = await supabase
      .from("interview")
      .select("id")
      .eq("recruiter_id", recruiterId)
      .limit(1);
    if (interviewError) {
      setError(interviewError.message);
      setLoading(false);
      return;
    }
    if (interviews && interviews.length > 0) {
      interviewId = interviews[0].id;
    } else {
      // Create a new interview for this recruiter
      const { data: newInterview, error: createError } = await supabase
        .from("interview")
        .insert({ recruiter_id: recruiterId, invite_code: Math.floor(Math.random() * 1000000000) })
        .select()
        .single();
      if (createError) {
        setError(createError.message);
        setLoading(false);
        return;
      }
      interviewId = newInterview.id;
    }
    // Insert the new question
    const { data: questionData, error: questionError } = await supabase
      .from("interview_questions")
      .insert([{ interview_id: interviewId, question: newQuestion }])
      .select()
      .single();
    if (questionError) {
      setError(questionError.message);
    } else if (questionData) {
      setQuestions([...questions, questionData]);
      setNewQuestion("");
    }
    setLoading(false);
  };

  return (
    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 shadow-xl mt-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg md:text-xl font-semibold text-white">Interview Questions</h3>
          <p className="text-sm text-gray-400 mt-1">Craft focused, role-specific prompts for candidates.</p>
        </div>
        <span className="inline-flex items-center rounded-full bg-gray-800 px-3 py-1 text-xs font-medium text-gray-300 border border-gray-700">
          {questions.length} {questions.length === 1 ? "question" : "questions"}
        </span>
      </div>

      {loading ? (
        <div className="space-y-3">
          <div className="h-4 bg-gray-800/70 rounded animate-pulse" />
          <div className="h-4 bg-gray-800/70 rounded animate-pulse w-5/6" />
          <div className="h-4 bg-gray-800/70 rounded animate-pulse w-4/6" />
        </div>
      ) : (
        <>
          {error && (
            <div className="mb-4 rounded-lg border border-red-700/40 bg-red-900/20 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {questions.length === 0 ? (
            <div className="mb-5 rounded-xl border border-gray-800 bg-gray-800/40 px-5 py-8 text-center">
              <div className="mx-auto mb-2 h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400">?</div>
              <p className="text-gray-300 font-medium">No questions yet</p>
              <p className="text-sm text-gray-400 mt-1">Use the field below to add your first interview question.</p>
            </div>
          ) : (
            <ol className="mb-6 space-y-3">
              {questions.map((q, idx) => (
                <li key={q.id} className="group flex items-start gap-3 rounded-lg border border-gray-800 bg-gray-800/40 px-4 py-3">
                  <div className="mt-0.5 h-6 w-6 shrink-0 rounded-full bg-blue-600/20 text-blue-300 flex items-center justify-center text-xs font-semibold border border-blue-700/40">
                    {idx + 1}
                  </div>
                  <p className="text-gray-200 leading-relaxed">{q.question}</p>
                </li>
              ))}
            </ol>
          )}

          <div className="rounded-xl border border-gray-800 bg-gray-800/40 p-4">
            <label htmlFor="new-question" className="block text-sm font-medium text-gray-300 mb-2">
              Add a question
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                id="new-question"
                type="text"
                value={newQuestion}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewQuestion(e.target.value)}
                placeholder="e.g., Describe a challenging project you led and the outcome."
                className="px-3 py-2 bg-gray-900 text-white rounded-md border border-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600/40 focus:border-blue-600/40 flex-1"
              />
              <button
                onClick={addQuestion}
                disabled={loading || !newQuestion.trim()}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-400">Keep questions concise and objective. Avoid double-barreled prompts.</p>
          </div>
        </>
      )}
    </div>
  );
}
