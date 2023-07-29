import express from "express";
import formidable from "express-formidable";
const router = express.Router();
import {
  allLikesControllers,
  checkLiked,
  countViewController,
  deleteBlogController,
  getPhoto,
  getSingleBlog,
  getUserBlogsController,
  likeClickController,
  newBlogController,
  searchBlogController,
  searchCategoryBlogs,
  trendingBlogs,
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

// view counter
router.get("/count-view/:id", countViewController);

// searching for blogs
router.get("/search-for/:key", searchBlogController);

//category-filter route
router.get("/category-filter/:cid", searchCategoryBlogs);

// liking the blog
router.put("/like-post/:id", likeClickController);

//check whether user has liked or not
router.get("/check-liked/:bid/:uid", checkLiked);

// getting all the likes
router.get("/all-likes/:id", allLikesControllers);

//getting-trending blogs
router.get("/trending-blogs", trendingBlogs);

export default router;
