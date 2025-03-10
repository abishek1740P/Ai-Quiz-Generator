"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import QuizDisplay from "../Components/QuizDisplay";
import ScoreDisplay from "../Components/ScoreDisplay";
import QuizForm from "../Components/QuizForm";
import Timer from "../Components/Timer";

export default function QuizPage() {
  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [timer, setTimer] = useState(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  const router = useRouter();

  // ✅ Check authentication & redirect
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error();
        }

        const data = await response.json();
        setUser(data.user);
      } catch {
        localStorage.removeItem("token");
        router.replace("/login");
      } finally {
        setAuthChecked(true);
      }
    };

    fetchUser();
  }, [router]);

  // ✅ Prevent rendering until authentication is checked
  if (!authChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p>Checking authentication...</p>
      </div>
    );
  }
  // ✅ Function to scroll to the top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Enables smooth scrolling animation
    });
  };

  // ✅ Fetch quiz questions
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
        const quizData = data.quiz.map((q) => ({ ...q, topic, difficulty }));
        setQuiz(quizData);

        if (time > 0) {
          setTimer(Number(time));
          setTimerRunning(true);
        }
      }
    } catch {
      // Silent fail in production
    } finally {
      setLoading(false);
    }
  };

  // ✅ Submit quiz and calculate score
  const handleSubmit = () => {
    let correctAnswers = 0;
    quiz.forEach((q, index) => {
      if (answers[index] === q.answer) {
        correctAnswers++;
      }
    });

    setScore(correctAnswers);
    setSubmitted(true);
    setTimerRunning(false);

    // Call with the correct values immediately
    handleQuizCompletion(correctAnswers, quiz.length);
  };

  // ✅ Submit score to backend
  const handleSubmitScore = async (score, total, topic, difficulty) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // ✅ Build the report data
    const report = quiz.map((q, index) => ({
      question: q.question,
      options: q.options,
      correctAnswer: q.answer, // Ensure this matches backend field name
      chosenAnswer: answers[index] || null, // Handle unanswered questions
    }));

    // ✅ Add report to request body
    const bodyData = { topic, difficulty, score, total, report };

    

    try {
      const response = await fetch("/api/scores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();
     
    } catch (error) {
      console.error("Error submitting score:", error);
    }
  };

  // ✅ Call this function when the quiz ends
  const handleQuizCompletion = (score, total) => {
    if (quiz.length === 0) return;

    const topic = quiz[0]?.topic || "unknown_topic";
    const difficulty =
      quiz[0]?.difficulty.charAt(0).toUpperCase() +
        quiz[0]?.difficulty.slice(1) || "Unknown";

    handleSubmitScore(score, total, topic, difficulty);
  };

  // ✅ Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      {/* ✅ Navbar */}
      <div className="absolute top-4 right-4 bg-gray-800 p-3 rounded-lg flex gap-4">
        {user && (
          <div>
            <p className="text-sm">Welcome, {user.username}!</p>
            <button
              onClick={handleLogout}
              className="mt-2 bg-red-500 px-3 py-1 rounded text-sm hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        )}
        <button
          onClick={() => router.push("/scores")}
          className="bg-blue-500 px-4 py-2 rounded-lg text-sm hover:bg-blue-600"
        >
          Scores
        </button>
      </div>

      <h1 className="text-4xl font-extrabold mb-6">AI Quiz Generator</h1>

      {/* ✅ Quiz Form */}
      <QuizForm fetchQuiz={fetchQuiz} loading={loading} />

      {/* ✅ Quiz Display */}
      {quiz.length > 0 && (
        <div className="relative w-full max-w-lg p-6 mt-6 bg-gray-800 rounded-xl shadow-lg">
          {/* ✅ Timer Component */}
          {timer > 0 && timerRunning && (
            <Timer
              time={timer}
              setTimer={setTimer}
              setTimerRunning={setTimerRunning}
              handleSubmit={handleSubmit}
            />
          )}

          {/* ✅ Quiz Display */}
          <QuizDisplay
            quiz={quiz}
            answers={answers}
            setAnswers={setAnswers}
            submitted={submitted}
            setSubmitted={setSubmitted}
            setScore={setScore}
            handleAnswerChange={(index, option) =>
              setAnswers({ ...answers, [index]: option })
            }
          />

          {/* ✅ Submit button */}
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

      {/* ✅ Score Display */}
      {submitted && <ScoreDisplay score={score} total={quiz.length} />}
      {/* ✅ Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 bg-gray-800 p-4 rounded-full text-white shadow-md hover:bg-gray-700 transition duration-300 border border-gray-600 flex items-center justify-center"
      >
        ↑
      </button>
    </div>
  );
}
