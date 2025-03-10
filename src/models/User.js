import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  score: { type: Number, required: true },
  total: { type: Number, required: true }
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  scores: { type: [scoreSchema], default: [] } // ✅ Add this
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
