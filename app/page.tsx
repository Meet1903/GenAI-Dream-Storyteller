'use client';

import Image from "next/image";
import { useState } from "react";

export default function Home() {

  const [dream, setDream] = useState<string>('');
  const [interpretation, setInterpretation] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <h1 className="text-2xl font-bold text-black mb-4">AI Dream Interpreter</h1>
      <form className="w-full max-w-md">
        <textarea 
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
          placeholder="Describe your dream here..."
          value={dream}
          onChange={(e) => setDream(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-300"
          disabled={loading}
        >{loading ? 'Interpreting...' : 'Interpret Dream'}
        </button>
      </form>
      {interpretation && (
        <div className="mt-4 p-4 bg-white shadow rounded-md w-full max-w-md">
          <h2 className="text-lg font-bold text-black mb-2">Interpretation</h2>
          <p className="text-gray-800">{interpretation}</p>
        </div>
      )}
    </div>
  );
}
