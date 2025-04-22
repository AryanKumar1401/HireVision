"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/auth";

interface Question {
  id: string;
  company_number: string;
  question: string;
}

interface InterviewQuestionsProps {
  company_number: string;
}

export default function InterviewQuestions({
  company_number,
}: InterviewQuestionsProps) {
  const supabase = createClient();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //At this point, we will fetch the list of questions for the company

  useEffect(() => {
    async function fetchQuestions() {
      const { data, error } = await supabase
        .from("interview_questions")
        .select("*")
        .eq("company_number", company_number);
      if (error) {
        setError(error.message);
      } else {
        setQuestions(data || []);
      }
      setLoading(false);
    }
    fetchQuestions();
  }, [company_number]);

  const addQuestion = async () => {
    if (!newQuestion.trim()) return;
    const { data, error } = await supabase
      .from("interview_questions")
      .insert([{ company_number: company_number, question: newQuestion }])
      .single();
    if (error) {
      setError(error.message);
    } else if (data) {
      setQuestions([...questions, data]);
      setNewQuestion("");
    }
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
