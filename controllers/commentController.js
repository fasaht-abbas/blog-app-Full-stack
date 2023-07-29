import mongoose from "mongoose";
import blogModel from "../models/blogModel.js";
import commentModel from "../models/commentModel.js";
import userModel from "../models/userModel.js";

export const createCommentController = async (req, res) => {
  try {
    const { commenter, comment, blog } = req.body;
    if (!commenter || !comment || !blog) {
      return res.status(404).send({
        success: false,
        message: "something is missing",
      });
    }

    const userId = new mongoose.Types.ObjectId(commenter);

    const newComment = new commentModel({
      commenter: userId,
      comment,
      blog,
      createdAt: Date.now(),
    });
    await newComment.save();

    const commetedBlog = await blogModel.findByIdAndUpdate(
      blog,
      {
        $push: { comments: newComment._id },
      },
      {
        new: true,
      }
    );
    return res.status(200).send({
      success: true,
      message: "Comment posted Successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

export const getBlogComments = async (req, res) => {
  try {
    const { blog } = req.params;
    if (!blog) {
      return res.status(400).send({
        success: false,
        message: "No Id Given",
      });
    }
    const allComments = await commentModel
      .find({ blog: blog })
      .populate("commenter");
    return res.status(200).send({
      success: true,
      allComments,
    });
  } catch (error) {
    console.log(error);
  }
};

export const deleteCommentController = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedComment = await commentModel.findByIdAndDelete(id);

    return res.status(200).send({
      success: true,
      message: "Comment deleted",
    });
  } catch (error) {
    console.log(error);
  }
};

export const editCommentController = async (req, res) => {
  try {
    const { id } = req.params;
    const { editedComment } = req.body;

    const updatedComment = await commentModel.findByIdAndUpdate(
      id,
      { comment: editedComment },
      { new: true }
    );

    return res.status(200).send({
      success: true,
      message: "Comment edited",
    });
  } catch (error) {
    console.log(error);
  }
};
