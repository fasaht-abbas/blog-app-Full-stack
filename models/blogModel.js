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
    slug: {
      type: String,
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
    likes: [
      {
        type: mongoose.ObjectId,
        ref: "user",
      },
    ],
    comments: [
      {
        type: mongoose.ObjectId,
        ref: "comment",
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
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
