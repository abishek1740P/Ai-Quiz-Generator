"use client";

export default function QuizDisplay({
  quiz,
  score,
  setScore,
  answers,
  setAnswers,
  submitted,
  setSubmitted,
}) {
  // Function to handle answer selection
  const handleAnswerChange = (questionIndex, selectedOption) => {
    if (!submitted) {
      setAnswers((prev) => ({
        ...prev,
        [questionIndex]: selectedOption,
      }));
    }
  };

  return (
    <div className="w-full max-w-3xl p-8 mt-8 bg-gray-800 rounded-2xl shadow-2xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Your Quiz</h2>

      {/* Display Quiz Questions */}
      {quiz.map((q, index) => {
        let userAnswer = answers[index];
        let isCorrect = userAnswer === q.answer;
        let isSkipped = userAnswer === undefined; // ✅ Check if skipped

        return (
          <div key={index} className="mb-6 p-4 bg-gray-900 rounded-lg">
            {/* ✅ Question Number */}
            <p className="text-lg font-bold text-blue-400">Q{index + 1}. {q.question}</p>

            <div className="mt-4 space-y-3">
              {q.options.map((option, i) => {
                let bgColor = "bg-gray-700";

                if (submitted) {
                  if (option === q.answer) {
                    bgColor = "bg-green-500 text-white font-bold"; // ✅ Highlight correct answer
                  } else if (userAnswer === option) {
                    bgColor = "bg-red-500 text-white"; // ❌ Highlight wrong selected answer
                  }
                } else if (userAnswer === option) {
                  bgColor = "bg-blue-500 text-white"; // ✅ Highlight selected option
                }

                return (
                  <label
                    key={i}
                    className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg text-lg ${bgColor} transition duration-200`}
                  >
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      className="hidden"
                      onChange={() => handleAnswerChange(index, option)}
                      checked={userAnswer === option}
                      disabled={submitted} // Disable after submission
                    />
                    <span>{option}</span>
                  </label>
                );
              })}
            </div>

            {/* Show Skipped Message */}
            {submitted && isSkipped && (
              <p className="mt-3 text-yellow-400 font-semibold">
                Skipped ❌ (Correct: {q.answer})
              </p>
            )}

            {/* Show Wrong Answer Message */}
            {submitted && !isSkipped && !isCorrect && (
              <p className="mt-3 text-red-400 font-semibold">
                ❌ Your Answer: {userAnswer} (Correct: {q.answer})
              </p>
            )}

            {/* Show Correct Answer Message */}
            {submitted && isCorrect && (
              <p className="mt-3 text-green-400 font-semibold">✔ Correct</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
