"use client";

import { useState } from "react";
import ReactMarkdown from 'react-markdown';

export default function Home() {
  const [dream, setDream] = useState<string>("");
  const [interpretation, setInterpretation] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const interpretDream = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dream.trim()) return;

    setLoading(true);
    setInterpretation("");

    try {
      const response = await fetch("/api/interpret", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dream }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to interpret dream");

      setInterpretation(data.interpretation || "No interpretation found");
    } catch (error) {
      console.error(error);
      setInterpretation("An error occurred while interpreting the dream");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <h1 className="text-2xl font-bold text-black mb-4">AI Dream Interpreter</h1>

      <form className="w-full max-w-md" onSubmit={interpretDream}>
        <textarea
          className="w-full p-2 text-black border border-gray-300 rounded-md mb-4"
          placeholder="Describe your dream here..."
          value={dream}
          onChange={(e) => setDream(e.target.value)}
        />
        <button
          type="submit"
          className="w-full mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-300"
          disabled={loading || !dream.trim()}
        >
          {loading ? "Interpreting..." : "Interpret Dream"}
        </button>
      </form>

      {interpretation && (
        <div className="mt-4 p-4 bg-white shadow rounded-md w-full max-w-md" aria-live="polite">
          <h2 className="text-lg font-bold text-black mb-2">Interpretation</h2>
          <p className="text-gray-800">
            <ReactMarkdown>{interpretation}</ReactMarkdown>
          </p>
        </div>
      )}
    </div>
  );
}
