import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    role: {
      type: Number,
      default: 0,
    },
    refreshTokens: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("user", userSchema);
