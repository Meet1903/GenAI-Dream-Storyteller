"use client";

import { useState } from "react";
import ReactMarkdown from 'react-markdown';

export default function Home() {
  const [dream, setDream] = useState<string>("");
  const [story, setStory] = useState<string>("");
  const [followUpQuestion, setFollowUpQuestion] = useState<string>("");
  const [conversationHistory, setConversationHistory] = useState<{ question: string, answer: string }[]>([]); 
  const [loading, setLoading] = useState<boolean>(false);

  const interpretDream = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dream.trim()) return;

    setLoading(true);
    setStory("");
    setConversationHistory([]);
    setFollowUpQuestion("");

    try {
      const response = await fetch("/api/interpret", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dream, story, conversationHistory: [], followUpQuestion }), 
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to interpret dream");

      setStory(data.interpretation || "Failed to interpret dream");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch("/api/interpret", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dream,
          story,
          conversationHistory: conversationHistory,
          followUpQuestion,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to get follow-up answer");

      setConversationHistory((prev) => [...prev, { question: followUpQuestion, answer: data.interpretation }]); 
      setFollowUpQuestion("");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <h1 className="text-2xl font-bold text-black mb-4">AI Dream Storyteller</h1>

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
          {loading ? "Creating..." : "Tell me a story"}
        </button>
      </form>

      {story && (
        <div className="mt-4 p-4 bg-white shadow rounded-md w-full max-w-md" aria-live="polite">
          <h2 className="text-lg font-bold text-black mb-2">Dream Story</h2>
          <p className="text-gray-800">
            <ReactMarkdown>{story}</ReactMarkdown>
          </p>
        </div>
      )}

      {conversationHistory.length > 0 && (
        <div className="mt-4 p-4 bg-white shadow rounded-md w-full max-w-md" aria-live="polite">
          <h2 className="text-lg font-bold text-black mb-2">Follow up</h2>
          <div>
            {conversationHistory.map((item, index) => (
              <div key={index} className="mb-2">
                <strong className="text-black">Question:</strong> <p className="text-blue-600">{item.question}</p>
                <strong className="text-black">Answer:</strong> <p className="text-gray-800"><ReactMarkdown>{item.answer}</ReactMarkdown></p>
              </div>
            ))}
          </div>
        </div>
      )}

      {story && (
        <form className="w-full max-w-md mt-4" onSubmit={handleFollowUp}>
          <textarea
            className="w-full p-2 text-black border border-gray-300 rounded-md mb-4"
            placeholder="Ask a follow-up question about the dream..."
            value={followUpQuestion}
            onChange={(e) => {
              setFollowUpQuestion(e.target.value);
            }}
          />
          <button
            type="submit"
            className="w-full mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-300"
            disabled={loading || !followUpQuestion.trim()}
          >
            {loading ? "Loading..." : "Ask a Question"}
          </button>
        </form>
      )}
    </div>
  );
}
