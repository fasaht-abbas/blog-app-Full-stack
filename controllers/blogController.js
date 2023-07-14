import blogModel from "../models/blogModel.js";
import userModel from "../models/userModel.js";
import categoryModel from "../models/categoryModel.js";
import fs from "fs";

export const newBlogController = async (req, res) => {
  try {
    const { title, description, content, keywords, userId, categories } =
      req.fields;
    const author = await userModel.findById(userId);
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
    const newBlog = new blogModel({
      author,
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
    const photo = await blogModel.findById({ _id: id }).select("blogPhoto");
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
    console.log(id);
    const blog = await blogModel
      .findById(id)
      .populate("author")
      .populate("categories")
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
    const results = await blogModel
      .find({
        $or: [
          { title: { $regex: key } },
          { description: { $regex: key } },
          { keywords: { $regex: key } },
        ],
      })
      .populate("author")
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
        message: "NO ID RECEIVEC",
      });
    }
    console.log(cid);
    const blogs = await blogModel
      .find({
        categories: { $in: cid },
      })
      .populate("categories")
      .populate("author")
      .select("-blogPhoto");
    if (blogs.length <= 0) {
      console.log("NO BLOGS Found");
    }
    return res.status(200).send({ success: true, blogs });
  } catch (error) {
    console.log(error);
  }
};
