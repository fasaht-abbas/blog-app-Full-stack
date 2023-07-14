import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.ObjectId,
      ref: "user",
    },
    blogPhoto: {
      data: Buffer,
      contentType: String,
    },
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
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("blog", blogSchema);
