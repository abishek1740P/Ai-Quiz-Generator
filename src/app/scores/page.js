"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ScoresPage() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(5); // Number of scores initially shown
  const [allScoresLoaded, setAllScoresLoaded] = useState(false); // Check if all scores are loaded
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("No token found, redirecting to login...");
      router.replace("/login");
      return;
    }

    const fetchScores = async () => {
      try {
        const response = await fetch("/api/scores", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch scores");

        const data = await response.json();
        setScores(data.scores || []);
      } catch (error) {
        console.error("Error fetching scores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, [router]);

  // Load more scores when user clicks "Show More"
  const loadMoreScores = () => {
    const newVisibleCount = visibleCount + 5;
    setVisibleCount(newVisibleCount);

    if (newVisibleCount >= scores.length) {
      setAllScoresLoaded(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Your Scores</h1>

      {loading ? (
        <p className="text-lg text-gray-400">Loading...</p>
      ) : scores.length === 0 ? (
        <p className="text-lg text-gray-400">No scores available</p>
      ) : (
        <div className="w-full max-w-4xl">
          <table className="w-full border border-gray-700 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-800 text-lg text-gray-300">
                <th className="p-4 text-left">Topic</th>
                <th className="p-4">Difficulty</th>
                <th className="p-4">Score</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {scores.slice(0, visibleCount).map((score, index) => (
                <tr
                  key={index}
                  className="border-t border-gray-700 hover:bg-gray-800 transition duration-200"
                >
                  <td className="p-4 text-left">{score.topic}</td>
                  <td className="p-4">{score.difficulty || "N/A"}</td>
                  <td className="p-4 font-semibold">
                    {score.score}/{score.total}
                  </td>
                  <td className="p-4 text-gray-400">
                    <DateFormatter utcDate={score.createdAt} />
                  </td>
                  <td className="p-4">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200"
                      onClick={() => router.push(`/report?scoreId=${score._id}`)}
                    >
                      View Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!allScoresLoaded && (
            <button
              onClick={loadMoreScores}
              className="mt-4 bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-md transition duration-200"
            >
              Show More
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ✅ Moved Date Formatting to Client-Side to Prevent Hydration Issues
const DateFormatter = ({ utcDate }) => {
  const [formattedDate, setFormattedDate] = useState("Loading...");

  useEffect(() => {
    if (utcDate) {
      const date = new Date(utcDate);
      setFormattedDate(date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }));
    } else {
      setFormattedDate("N/A");
    }
  }, [utcDate]);

  return <span>{formattedDate}</span>;
};
