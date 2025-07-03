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
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg mt-6">
      <h3 className="text-xl font-semibold text-white mb-4">
        Interview Questions
      </h3>
      {loading ? (
        <p className="text-gray-300">Loading questions...</p>
      ) : (
        <>
          {error && <p className="text-red-500">{error}</p>}
          <ul className="list-disc list-inside text-gray-300 mb-4">
            {questions.map((q) => (
              <li key={q.id}>{q.question}</li>
            ))}
          </ul>
          <div className="flex">
            <input
              type="text"
              value={newQuestion}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewQuestion(e.target.value)
              }
              placeholder="Add a new question..."
              className="px-3 py-2 bg-gray-700 text-white rounded-md flex-grow"
            />
            <button
              onClick={addQuestion}
              className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Add
            </button>
          </div>
        </>
      )}
    </div>
  );
}
