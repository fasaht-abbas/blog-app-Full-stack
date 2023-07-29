import express from "express";
import {
  createCommentController,
  getBlogComments,
  deleteCommentController,
  editCommentController,
} from "../controllers/commentController.js";
const router = express.Router();

router.post("/create-comment", createCommentController);

router.delete("/delete-comment/:id", deleteCommentController);

router.put("/edit-comment/:id", editCommentController);

router.get("/get-comments/:blog", getBlogComments);

export default router;
