"use client";

import { useState } from "react";
import ReactMarkdown from 'react-markdown';

export default function Home() {
  const [dream, setDream] = useState<string>("");
  const [story, setStory] = useState<string>("");
  const [followUpQuestion, setFollowUpQuestion] = useState<string>("");
  const [conversationHistory, setConversationHistory] = useState<{ question: string, answer: string }[]>([]); 
  const [storyLoading, serStoryLoading] = useState<boolean>(false);
  const [followUpLoading, setFollowUpLoading] = useState<boolean>(false);

  const interpretDream = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dream.trim()) return;

    serStoryLoading(true);
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
      serStoryLoading(false);
    }
  };

  const handleFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();

    setFollowUpLoading(true);

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
      setFollowUpLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-4xl text-center font-mono font-bold text-black mb-4 text-blue-600">AI Dream Storyteller</h1>

      <form className="w-full max-w-md" onSubmit={interpretDream}>
        <textarea
          className="w-full p-2 text-black border border-gray-400 rounded-2xl resize-none overflow-hidden"
          placeholder="Show a weirdly fantastic dream last night? Describe it here..."
          value={dream}
          onChange={(e) => {
              setDream(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }
          }
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) { 
              e.preventDefault();
              if (dream.trim()) {
                interpretDream(e);
              }
            }
          }}
        />
        <button
          type="submit"
          className="w-full mt-2 bg-blue-500 hover:bg-blue-700 hover:cursor-pointer text-white font-bold py-2 px-4 rounded-2xl disabled:bg-gray-300"
          disabled={storyLoading || !dream.trim()}
        >
          {storyLoading ? "Creating..." : "Tell me a story"}
        </button>
      </form>

      {story && (
        <div className="mt-4 p-4 bg-white shadow rounded-2xl w-full max-w-md border border-gray-400" aria-live="polite">
          <h2 className="text-xl font-bold text-black mb-2">Dream Story</h2>
          <p className="text-gray-800">
            <ReactMarkdown>{story}</ReactMarkdown>
          </p>
        </div>
      )}

      {conversationHistory.length > 0 && (
        <div className="mt-4 p-4 bg-white shadow rounded-2xl w-full max-w-md border border-gray-400" aria-live="polite">
          <h2 className="text-xl font-bold text-black mb-2">Follow up</h2>
          <div>
            {conversationHistory.map((item, index) => (
              <div key={index} className="mb-2">
                <strong className="text-black">Question:</strong> <p className="text-blue-600 text-lg mb-2">{item.question}</p>
                <strong className="text-black">Answer:</strong> <p className="text-gray-800"><ReactMarkdown>{item.answer}</ReactMarkdown></p>
              </div>
            ))}
          </div>
        </div>
      )}

      {story && (
        <form className="w-full max-w-md mt-4" onSubmit={handleFollowUp}>
          <textarea
            className="w-full p-2 text-black border border-gray-400 rounded-2xl resize-none overflow-hidden"
            placeholder="Ask a follow-up question about the dream..."
            value={followUpQuestion}
            onChange={(e) => {
              setFollowUpQuestion(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { 
                e.preventDefault();
                if (followUpQuestion.trim()) {
                  handleFollowUp(e);
                }
              }
            }}
          />
          <button
            type="submit"
            className="w-full mt-2 bg-green-500 hover:bg-green-700 hover:cursor-pointer text-white font-bold py-2 px-4 rounded-2xl disabled:bg-gray-300"
            disabled={followUpLoading || !followUpQuestion.trim()}
          >
            {followUpLoading ? "Loading..." : "Ask a Question"}
          </button>
        </form>
      )}
    </div>
  );
}
