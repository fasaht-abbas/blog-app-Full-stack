import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  commenter: {
    type: mongoose.ObjectId,
    ref: "user",
  },
  blog: {
    type: mongoose.ObjectId,
    ref: "blog",
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date
  }
});
export default mongoose.model("comment", commentSchema);
