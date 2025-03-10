// import mongoose from "mongoose";

// const ScoreSchema = new mongoose.Schema(
//   {
//     userId: { 
//       type: mongoose.Schema.Types.ObjectId, 
//       ref: "User", 
//       required: true 
//     },
//     username: { type: String, required: true },
//     topic: { type: String, required: true },
//     difficulty: { 
//       type: String, 
//       enum: ["Easy", "Medium", "Hard"], 
//       required: true 
//     },
//     score: { type: Number, required: true, min: 0 },
//     total: { type: Number, required: true, min: 1 },
//     percentage: { type: Number },
//   },
//   { timestamps: true }
// );

// // ✅ Auto-calculate percentage before saving
// ScoreSchema.pre("save", function (next) {
//   this.percentage = Number(((this.score / this.total) * 100).toFixed(2));
//   next();
// });


// export default mongoose.models.Score || mongoose.model("Score", ScoreSchema);


import mongoose from "mongoose";

const ScoreSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    username: { type: String, required: true },
    topic: { type: String, required: true },
    difficulty: { type: String, enum: ["Easy", "Intermediate", "Hard"], required: true },
    score: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 1 },
    report: [
      {
        question: { type: String, required: true },
        options: { type: [String], required: true }, // ✅ Ensure it's an array
        correctAnswer: { type: String, required: true },
        chosenAnswer: { type: String, required: false }, // ✅ Allow skipped questions
      }
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Score || mongoose.model("Score", ScoreSchema);



