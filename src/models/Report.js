import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    quizData: [
      {
        question: { type: String, required: true },
        options: [{ type: String, required: true }],
        selectedAnswer: { type: String, required: true },
        correctAnswer: { type: String, required: true },
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.models.Report || mongoose.model("Report", ReportSchema);
