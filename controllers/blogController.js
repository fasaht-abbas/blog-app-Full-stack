import blogModel from "../models/blogModel.js";
import userModel from "../models/userModel.js";
import categoryModel from "../models/categoryModel.js";
import fs from "fs";
import mongoose from "mongoose";
import slugify from "slugify";

export const newBlogController = async (req, res) => {
  try {
    const { title, description, content, keywords, userId, categories } =
      req.fields;
    const author = new mongoose.Types.ObjectId(userId);
    const { blogPhoto } = req.files;
    if (
      !(
        title ||
        description ||
        content ||
        keywords ||
        author ||
        blogPhoto ||
        categories
      )
    ) {
      return res.status(404).send({
        success: false,
        message: "every Field is required",
      });
    }
    const slug = slugify(title);
    const newBlog = new blogModel({
      author,
      slug,
      title,
      description,
      content,
    });
    newBlog.keywords = keywords.split(",");
    newBlog.categories = categories.split(",");

    if (blogPhoto) {
      newBlog.blogPhoto.data = fs.readFileSync(blogPhoto.path);
      newBlog.blogPhoto.contentType = blogPhoto.type;
    }
    await newBlog.save();
    return res.status(200).send({
      success: true,
      message: "Blog created SuccessFully",
    });
  } catch (error) {
    console.log(error);
  }
};

export const getPhoto = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).send({
        success: false,
        message: "Id is missing",
      });
    }
    const photo = await blogModel.findById(id).select("blogPhoto");
    if (photo.blogPhoto.data) {
      res.set("Content-type", photo.blogPhoto.contentType);
      res.status(200).send(photo.blogPhoto.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Could not get Photo",
      error,
    });
  }
};

// getting all the blogs written by user

export const getUserBlogsController = async (req, res) => {
  try {
    const { id } = req.params;

    const allBlogs = await blogModel
      .find({ author: id })
      .sort("-createdAt")
      .populate("author")
      .populate("likes")
      .populate("categories")
      .select("-blogPhoto");

    return res.status(200).send({
      success: true,
      message: "These are all user blogs",
      allBlogs,
    });
  } catch (error) {
    console.log(error);
  }
};

// getting the single blog

export const getSingleBlog = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send({
        success: false,
        message: "Invalid id",
      });
    }
    const blog = await blogModel
      .findById(id)
      .populate("author")
      .populate("categories")
      .populate("likes")
      .populate("comments")
      .select("-blogPhoto");

    return res.status(200).send({
      success: true,
      message: "This is the blog",
      blog,
    });
  } catch (error) {
    console.log(error);
  }
};

//update blog

export const updateBlogController = async (req, res) => {
  try {
    const { title, description, content, categories, keywords } = req.fields;
    const { blogPhoto } = req.files;
    if (!title || !description || !content || !categories || !keywords) {
      return res.status(404).send({
        success: false,
        message: "every field is required",
      });
    }
    const { id } = req.params;

    const blog = await blogModel.findByIdAndUpdate(
      id,
      {
        title: title,
        description: description,
        content: content,
        categories: categories.split(","),
        keywords: keywords.split(","),
      },
      { new: true }
    );
    if (blogPhoto) {
      blog.blogPhoto.data = fs.readFileSync(blogPhoto.path);
      blog.blogPhoto.contentType = blogPhoto.type;
    }
    await blog.save();
    return res.status(200).send({
      success: true,
      message: "Blog updated successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

//delete controller

export const deleteBlogController = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await blogModel.findByIdAndDelete(id);
    return res.status(200).send({
      success: true,
      message: "Blog deleted Successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

// searching for the blogs

export const searchBlogController = async (req, res) => {
  try {
    const { key } = req.params;
    const querry = new RegExp(key);
    const results = await blogModel
      .find({
        $or: [
          { slug: { $regex: querry } },
          { title: { $regex: querry } },
          { description: { $regex: querry } },
          { keywords: { $regex: querry } },
        ],
      })
      .populate("author")
      .populate("likes")
      .populate("categories")
      .select("-blogPhoto");
    return res.status(200).send({
      success: true,
      results,
    });
  } catch (error) {
    console.log(error);
  }
};

//search based on the category
export const searchCategoryBlogs = async (req, res) => {
  try {
    const { cid } = req.params;
    if (!cid) {
      return res.status(404).send({
        success: false,
        message: "NO ID RECEIVED",
      });
    }
    const blogs = await blogModel
      .find({
        categories: { $in: cid },
      })
      .populate("categories")
      .populate("author")
      .populate("likes")
      .select("-blogPhoto");
    if (blogs.length <= 0) {
      console.log("NO BLOGS Found");
    }
    return res.status(200).send({ success: true, blogs });
  } catch (error) {
    console.log(error);
  }
};

// handling the likes
export const likeClickController = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req.body;

    const userId = new mongoose.Types.ObjectId(user);

    const foundBlog = await blogModel.findById(id);

    const liked = foundBlog.likes.includes(userId);

    if (!liked) {
      const updatedBlog = await blogModel.findByIdAndUpdate(
        id,
        {
          $push: { likes: userId },
        },
        { new: true }
      );
      return res.status(200).send({
        success: true,
        nowLiked: true,
        message: "liked successfully",
      });
    } else if (liked) {
      const updatedBlog = await blogModel.findByIdAndUpdate(
        id,
        {
          $pull: { likes: userId },
        },
        {
          new: true,
        }
      );
      return res.status(200).send({
        success: true,
        nowLiked: false,
        message: "unliked",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const checkLiked = async (req, res) => {
  try {
    const { bid, uid } = req.params;
    const foundBlog = await blogModel.findById(bid);

    if (foundBlog?.likes.includes(uid)) {
      return res.status(200).send({
        success: true,
        message: "checked like",
      });
    } else
      return res.status(404).send({
        success: false,
        message: "not liked",
      });
  } catch (error) {
    console.log(error);
  }
};

export const allLikesControllers = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).send({
        success: false,
        message: " No Id",
      });
    }
    const foundblog = await blogModel.findById(id).populate("likes");
    const allLikes = foundblog.likes;
    return res.status(200).send({
      success: true,
      message: "these are liked users",
      allLikes,
    });
  } catch (error) {
    console.log(object);
  }
};

export const countViewController = async (req, res) => {
  try {
    const { id } = req.params;
    const foundBlog = await blogModel.findById(id);
    if (foundBlog) {
      foundBlog.likes += 1;
      foundBlog.save();
      return res.status(200).send({
        success: true,
        message: "viewAdded",
        blogView: true,
      });
    } else {
      return res.status(404).send({
        success: false,
        message: "View not counted",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// co troller for the trending blogs

export const trendingBlogs = async (req, res) => {
  // formula for finding the trending Score...
  const findTrendingScore = (blog) => {
    return blog.views * 0.7 + blog.comments * 0.2 + blog.likes * 0.1;
  };

  try {
    const allBlogs = await blogModel.find({}).populate("author");

    // adding the trending field in the Blog Model
    const trending = await allBlogs.map((blog) => ({
      ...blog.toObject(),
      trendingScore: findTrendingScore(blog),
    }));

    // actual trending blogs depending upon the trending Score

    const allTrendingBlogs = trending.sort(
      (a, b) => b.trendingScore - a.trendingScore
    );

    const trendingBlogs = allTrendingBlogs.slice(0, 6);

    res.status(200).send({
      success: true,
      trendingBlogs,
    });
  } catch (error) {
    console.log(error);
  }
};

// viedw controller

export const viewController = async (req, res) => {
  const { blogId } = req.body;
  try {
    const foundBlog = await blogModel.findById(blogId);
    if (!foundBlog) {
      return res.status(404).send({
        success: false,

        message: "No Blog found",
      });
    }
    foundBlog.views += 1;
    await foundBlog.save();
    return res.status(200).send({
      success: true,
      message: "View Counted",
    });
  } catch (error) {
    console.log(error);
  }
};
