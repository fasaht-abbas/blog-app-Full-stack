import express from "express";
import formidable from "express-formidable";
const router = express.Router();
import {
  deleteBlogController,
  getPhoto,
  getSingleBlog,
  getUserBlogsController,
  newBlogController,
  searchBlogController,
  searchCategoryBlogs,
  updateBlogController,
} from "../controllers/blogController.js";

router.post("/create-blog", formidable(), newBlogController);

// getting the users blogs..
router.get("/get-user-blogs/:id", getUserBlogsController);

//getting the BLog Photo
router.get("/get-photo/:id", getPhoto);

// getting the single blog
router.get("/get-blog/:id", getSingleBlog);

//updating the blog
router.put("/update-blog/:id", formidable(), updateBlogController);

// delete blog
router.delete("/delete-blog/:id", deleteBlogController);

// searching for blogs
router.get("/search-for/:key", searchBlogController);

//category-filter route
router.get("/category-filter/:cid", searchCategoryBlogs);
export default router;
