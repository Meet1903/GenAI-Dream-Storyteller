"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();
  const [dream, setDream] = useState<string>("");
  const [story, setStory] = useState<string>("");
  const [followUpQuestion, setFollowUpQuestion] = useState<string>("");
  const [conversationHistory, setConversationHistory] = useState<
    { question: string; answer: string }[]
  >([]);
  const [storyLoading, setStoryLoading] = useState<boolean>(false);
  const [followUpLoading, setFollowUpLoading] = useState<boolean>(false);

  const interpretDream = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dream.trim()) return;

    setStoryLoading(true);
    setStory("");
    setConversationHistory([]);
    setFollowUpQuestion("");

    try {
      const response = await fetch("/api/interpret", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dream, userId: session?.user?.email }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to interpret dream");

      setStory(data.interpretation || "Failed to interpret dream");
    } catch (error) {
      console.error(error);
    } finally {
      setStoryLoading(false);
    }
  };

  const handleFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();

    setFollowUpLoading(true);

    try {
      const response = await fetch("/api/followup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dream,
          story,
          conversationHistory: conversationHistory,
          followUpQuestion,
          userId: session?.user?.email,
        }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to get follow-up answer");

      setConversationHistory((prev) => [
        ...prev,
        { question: followUpQuestion, answer: data.interpretation },
      ]);
      setFollowUpQuestion("");
    } catch (error) {
      console.error(error);
    } finally {
      setFollowUpLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-md flex justify-between items-center mb-4">
        <h1 className="text-4xl font-mono font-bold text-blue-600">
          AI Dream Storyteller
        </h1>

        {status === "loading" ? (
          <div className="animate-pulse bg-gray-300 h-10 w-24 rounded-md"></div>
        ) : session ? (
          <div className="flex flex-col items-center space-x-2">
            <div className="flex items-center space-x-2">
              {session.user?.image && (
                <img
                  src={session.user.image}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                  referrerPolicy="no-referrer"
                />
              )}
              <div className="flex flex-col text-sm">
                <span className="font-medium text-gray-900">
                  {session.user?.name}
                </span>
              </div>
            </div>
            <button
                onClick={() => signOut()}
                className="text-red-500 hover:text-red-700 text-xs text-left hover:cursor-pointer"
              >
                Sign out
              </button>
          </div>
        ) : null}
      </div>

      {session ? (
        <>
          <form className="w-full max-w-md" onSubmit={interpretDream}>
            <textarea
              className="w-full p-2 text-black border border-gray-400 rounded-2xl resize-none overflow-hidden"
              placeholder="Saw a weirdly fantastic dream last night? Describe it here..."
              value={dream}
              onChange={(e) => {
                setDream(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
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
            <div
              className="mt-4 p-4 bg-white shadow rounded-2xl w-full max-w-md border border-gray-400"
              aria-live="polite"
            >
              <h2 className="text-xl font-bold text-black mb-2">Dream Story</h2>
              <p className="text-gray-800">
                <ReactMarkdown>{story}</ReactMarkdown>
              </p>
            </div>
          )}

          {conversationHistory.length > 0 && (
            <div
              className="mt-4 p-4 bg-white shadow rounded-2xl w-full max-w-md border border-gray-400"
              aria-live="polite"
            >
              <h2 className="text-xl font-bold text-black mb-2">Follow up</h2>
              <div>
                {conversationHistory.map((item, index) => (
                  <div key={index} className="mb-2">
                    <strong className="text-black">Question:</strong>{" "}
                    <p className="text-blue-600 text-lg mb-2">
                      {item.question}
                    </p>
                    <strong className="text-black">Answer:</strong>{" "}
                    <p className="text-gray-800">
                      <ReactMarkdown>{item.answer}</ReactMarkdown>
                    </p>
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
        </>
      ) : (
        <div className="w-full max-w-md p-6 bg-white shadow rounded-2xl border border-gray-400 text-center">
          <h2 className="text-xl font-bold text-black mb-4">
            Welcome to AI Dream Storyteller
          </h2>
          <p className="text-gray-800 mb-6">
            Sign in with your Google account to interpret your dreams and get
            personalized dream stories.
          </p>
          <button
            onClick={() => signIn("google")}
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-md shadow hover:bg-blue-700"
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
            >
              <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path
                  fill="#FFFFFF"
                  d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                />
                <path
                  fill="#FFFFFF"
                  d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                />
                <path
                  fill="#FFFFFF"
                  d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                />
                <path
                  fill="#FFFFFF"
                  d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                />
              </g>
            </svg>
            <span>Sign in with Google</span>
          </button>
        </div>
      )}
    </div>
  );
}
