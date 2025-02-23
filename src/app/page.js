

"use client";

import { useState } from "react";
import QuizForm from "./Components/QuizForm";
import QuizDisplay from "./Components/QuizDisplay";
import ScoreDisplay from "./Components/ScoreDisplay";
import Timer from "./Components/Timer"; // ✅ Ensure Timer is imported correctly

export default function Home() {
  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [timer, setTimer] = useState(null);
  const [timerRunning, setTimerRunning] = useState(false);

  // Fetch quiz questions from API
  const fetchQuiz = async (topic, difficulty, count, time) => {
    setLoading(true);
    setQuiz([]);
    setScore(null);
    setAnswers({});
    setSubmitted(false);

    try {
      const response = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, difficulty, count }),
      });

      const data = await response.json();
      if (data.quiz) {
        setQuiz(data.quiz);
        if (time > 0) {
          setTimer(Number(time));
          setTimerRunning(true);
        }
      }
    } catch (error) {
      console.error("Error fetching quiz:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle answer selection
  const handleAnswerChange = (questionIndex, selectedOption) => {
    if (!submitted) {
      setAnswers((prev) => ({
        ...prev,
        [questionIndex]: selectedOption,
      }));
    }
  };

  // Submit quiz and calculate score
  const handleSubmit = () => {
    let correctAnswers = 0;
    quiz.forEach((q, index) => {
      if (answers[index] === q.answer) {
        correctAnswers++;
      }
    });

    setScore(correctAnswers);
    setSubmitted(true);
    setTimerRunning(false); // ✅ Stop the timer when quiz is submitted
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-extrabold mb-6">AI Quiz Generator</h1>

      {/* Quiz Form */}
      <QuizForm fetchQuiz={fetchQuiz} loading={loading} />

      {/* Quiz Display & Timer */}
      {quiz.length > 0 && (
        <div className="relative w-full max-w-lg p-6 mt-6 bg-gray-800 rounded-xl shadow-lg">
          {/* ✅ Timer Component (Only show if the quiz is not submitted) */}
          {timer > 0 && timerRunning && (
            <Timer time={timer} setTimer={setTimer} setTimerRunning={setTimerRunning} handleSubmit={handleSubmit} />
          )}

          {/* ✅ Quiz Display - Always visible, even after submission */}
          <QuizDisplay
            quiz={quiz}
            answers={answers}
            setAnswers={setAnswers}
            submitted={submitted}
            setSubmitted={setSubmitted}
            setScore={setScore}
            handleAnswerChange={handleAnswerChange}
          />

          {/* ✅ Show Submit button only if the quiz is not submitted */}
          {!submitted && (
            <button
              className="w-full mt-6 p-3 bg-green-500 rounded-lg font-semibold text-white hover:bg-green-600 transition duration-200 disabled:bg-gray-500"
              onClick={handleSubmit}
              disabled={submitted}
            >
              Submit Answers
            </button>
          )}
        </div>
      )}

      {/* ✅ Score Display - Visible only after submission */}
      {submitted && <ScoreDisplay score={score} total={quiz.length} />}

     
    </div>
  );
}
