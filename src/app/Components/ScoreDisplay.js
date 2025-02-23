
"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

export default function ScoreDisplay({ score, total }) {
  useEffect(() => {
    if (score === total) {
      fireConfetti();
    }
  }, [score, total]);

  const fireConfetti = () => {
    confetti({
      particleCount: 200,
      spread: 90,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="w-full max-w-lg p-6 mt-6 bg-gray-800 rounded-xl shadow-lg text-center">
      <h2 className="text-2xl font-bold text-white">Quiz Completed!</h2>
      <p className="text-lg mt-4">
        You scored <span className="text-green-400 font-bold">{score}</span> out of{" "}
        <span className="text-blue-400 font-bold">{total}</span>.
      </p>

      <button
        className="w-full mt-6 p-3 bg-blue-500 rounded-lg text-white"
        onClick={() => window.location.reload()}
      >
        Try Again
      </button>
    </div>
  );
}


