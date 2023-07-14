import express from "express";
import {
  categoryDelete,
  createCatController,
  getCategoryController,
  singleCategoryController,
} from "../controllers/catController.js";
const router = express.Router();

router.post("/create-cat", createCatController);

router.get("/get-cats", getCategoryController);

router.delete("/delete-category/:id", categoryDelete);

router.get("/get-single/:cid", singleCategoryController);

export default router;
