"use client";
import { useEffect, useState } from "react";

export default function Timer({ time, setTimer, setTimerRunning, handleSubmit }) {
  const [displayTime, setDisplayTime] = useState(formatTime(time));

  useEffect(() => {
    if (time <= 0) {
      setTimerRunning(false);
      handleSubmit(); // ✅ Auto-submit when time runs out
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimerRunning(false);
          handleSubmit(); // ✅ Ensures submit happens before stopping
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [time, setTimer, setTimerRunning, handleSubmit]);

  useEffect(() => {
    setDisplayTime(formatTime(time)); // ✅ Updates displayed time in MM:SS format
  }, [time]);

  return (
    <div className="fixed top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg text-lg font-bold">
      ⏳ {displayTime}
    </div>
  );
}

// ✅ Function to format time as MM:SS
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}
