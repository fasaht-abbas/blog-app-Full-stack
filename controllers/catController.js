import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";

// creating new category
export const createCatController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res
        .status(404)
        .send({ success: false, message: "Name is required" });
    }
    const existing = await categoryModel.findOne({ name: name });
    if (existing) {
      return res.status(400).send({
        success: false,
        message: "This category already exsits",
      });
    }
    const slug = slugify(name);
    const newCat = new categoryModel({
      name: name,
      slug: slug,
    });
    await newCat.save();
    return res.status(200).send({
      success: true,
      message: "the new category created",
    });
  } catch (error) {
    console.log(error);
  }
};

// fetcing alll the categories available
export const getCategoryController = async (req, res) => {
  try {
    const allCategories = await categoryModel.find({});
    return res.status(200).send({
      success: true,
      message: "these are all categories",
      allCategories,
    });
  } catch (error) {
    console.log(error);
  }
};

// getting the single category
export const singleCategoryController = async (req, res) => {
  try {
    const { cid } = req.params;
    const category = await categoryModel.findById(cid);
    return res.status(200).send({
      success: true,
      category,
    });
  } catch (error) {
    console.log(error);
  }
};

// deleting the category
export const categoryDelete = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const deleteCat = await categoryModel.findByIdAndDelete(id);
    return res.status(200).send({
      success: true,
      message: "THe category has been deleted",
    });
  } catch (error) {
    console.log(error);
  }
};

// updating the category
export const categoryUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const slug = slugify(name);
    const updated = await categoryModel.findByIdAndUpdate(
      id,
      {
        name: name,
        slug: slug,
      },
      { new: true }
    );
    return res.status(200).send({
      success: true,
      message: "Updated Successfully",
    });
  } catch (error) {
    console.log(error);
  }
};
