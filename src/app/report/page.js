"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function ReportPageContent() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [scoreId, setScoreId] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get("scoreId");
    setScoreId(id);
  }, [searchParams]);

  useEffect(() => {
    if (scoreId === null) return;

    if (!scoreId) {
      router.replace("/scores");
      return;
    }

    const fetchReport = async () => {
      try {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) {
          router.replace("/login");
          return;
        }

        const response = await fetch(`/api/report/${scoreId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 401) {
          router.replace("/login");
          return;
        }

        if (!response.ok) throw new Error("Failed to fetch report");

        const data = await response.json();
        setReport(data.report || []);
      } catch (error) {
        console.error("❌ Error fetching report:", error);
        setReport([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [scoreId, router]);

  const handleSendEmail = async () => {
    setSending(true);

    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) {
        router.replace("/login");
        return;
      }

      const response = await fetch("/api/send-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ scoreId }),
      });

      if (!response.ok) throw new Error("Failed to send email");

      alert("✅ Report sent to your email successfully!");
    } catch (error) {
      console.error("❌ Error sending email:", error);
      alert("❌ Failed to send the report. Please try again.");
    } finally {
      setSending(false);
    }
  };

  if (loading) return <p className="text-center text-white">Loading report...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Quiz Report</h1>

      {report && report.length > 0 ? (
        <div className="w-full max-w-2xl bg-gray-800 p-6 rounded-lg shadow-lg">
          {report.map((q, index) => (
            <div key={index} className="mb-4 p-3 border-b border-gray-700">
              <p className="font-semibold">
                {index + 1}. {q.question}
              </p>
              <p className="text-green-400">Correct Answer: {q.correctAnswer}</p>
              <p
                className={`text-${
                  q.chosenAnswer === q.correctAnswer ? "green" : "red"
                }-400`}
              >
                Your Answer: {q.chosenAnswer || "Not Answered"}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No report found.</p>
      )}

      {/* Send Report to Email Button */}
      <button
        onClick={handleSendEmail}
        disabled={sending}
        className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md disabled:bg-gray-600"
      >
        {sending ? "Sending..." : "Send Report to Email"}
      </button>
    </div>
  );
}

// ✅ Wrap in <Suspense> to fix pre-rendering issues
export default function ReportPage() {
  return (
    <Suspense fallback={<p className="text-center text-white">Loading...</p>}>
      <ReportPageContent />
    </Suspense>
  );
}
