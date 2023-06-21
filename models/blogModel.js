import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  categories: [
    {
      type: mongoose.ObjectId,
      ref: "category",
    },
  ],
  keywords: [
    {
      type: String,
    },
  ],
});

export default mongoose.model("blog", blogSchema);
