

"use client";

import { useState } from "react";

export default function QuizForm({ fetchQuiz }) {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [quizCount, setQuizCount] = useState(10);
  const [time, setTime] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleGenerateQuiz = async () => {
    setLoading(true);
    await fetchQuiz(topic, difficulty, quizCount, time);
    setLoading(false);
  };

  return (
    <div className="w-full max-w-lg p-6 bg-gray-800 rounded-xl shadow-lg">
      {/* Quiz Topic Input */}
      <label className="block text-sm font-medium mb-2 text-white">
        Quiz Topic
      </label>
      <input
        type="text"
        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Enter topic (e.g., JavaScript)"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />

      {/* Difficulty Selector */}
      <label className="block text-sm font-medium mt-4 mb-2 text-white">
        Difficulty
      </label>
      <select
        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
      >
        <option value="easy">Easy</option>
        <option value="intermediate">Intermediate</option>
        <option value="hard">Hard</option>
      </select>

      {/* Number of Questions Selector */}
      <label className="block text-sm font-medium mt-4 mb-2 text-white">
        Number of Questions
      </label>
      <select
        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={quizCount}
        onChange={(e) => setQuizCount(Number(e.target.value))}
      >
        <option value={10}>10 Questions</option>
        <option value={20}>20 Questions</option>
        <option value={30}>30 Questions</option>
      </select>

      {/* Timer Input */}
      <label className="block text-sm font-medium mt-4 mb-2 text-white">
        Set Timer (Minutes & Seconds)
      </label>
      <div className="flex space-x-2 items-center">
        {/* Minutes Input */}
        <div className="relative w-1/2">
          <input
            type="number"
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            placeholder="Min"
            value={time ? Math.floor(time / 60) : ""}
            onChange={(e) => {
              let minutes = parseInt(e.target.value, 10) || 0;
              let seconds = time % 60;
              setTime(minutes * 60 + seconds);
            }}
            min="0"
          />
          {/* Cute Arrows */}
          <div className="absolute right-3 top-2 flex flex-col">
            <button
              className="text-gray-300 hover:text-white transition relative -top-[5px]"
              onClick={() => setTime(time + 60)}
              type="button"
            >
              ▲
            </button>

            <button
              className="text-gray-300 hover:text-white transition relative -bottom-[-7px]"
              onClick={() => setTime(Math.max(0, time - 60))}
              type="button"
            >
              ▼
            </button>
          </div>
        </div>

        <span className="text-white flex items-center text-lg font-bold">
          :
        </span>

        {/* Seconds Input */}
        <div className="relative w-1/2">
          <input
            type="number"
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            placeholder="Sec"
            value={time % 60}
            onChange={(e) => {
              let seconds = parseInt(e.target.value, 10) || 0;
              let minutes = Math.floor(time / 60);
              setTime(minutes * 60 + seconds);
            }}
            min="0"
            max="59"
          />
          {/* Cute Arrows */}
          <div className="absolute right-3 top-2 flex flex-col">
            <button
              className="text-gray-300 hover:text-white transition relative -bottom-[-6px]"
              onClick={() => setTime(time + 1)}
              type="button"
            >
              ▲
            </button>
            <button
              className="text-gray-300 hover:text-white transition relative -bottom-[-6px]"
              onClick={() => setTime(Math.max(0, time - 1))}
              type="button"
            >
              ▼
            </button>
          </div>
        </div>
      </div>

      {/* Generate Quiz Button */}
      <button
        className="w-full mt-6 p-3 bg-blue-500 rounded-lg font-semibold text-white hover:bg-blue-600 transition duration-200 disabled:bg-blue-300 flex items-center justify-center"
        onClick={handleGenerateQuiz}
        disabled={loading}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-5 w-5 mr-2 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            Generating...
          </>
        ) : (
          "Generate Quiz"
        )}
      </button>
    </div>
  );
}
