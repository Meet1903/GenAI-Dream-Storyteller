import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <h1 className="text-2xl font-bold text-black mb-4">AI Dream Interpreter</h1>
      <form className="w-full max-w-md">
        <textarea 
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
          placeholder="Describe your dream here..."
          required
        />
        <button
          type="submit"
          className="w-full mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-300"
        >Interpret</button>
      </form>
    </div>
  );
}
