import { comparePassword, hashpassowrd } from "../helpers/userHelper.js";
import userModel from "../models/userModel.js";
import Jwt from "jsonwebtoken";

//  Creating a new user
export const signUpController = async (req, res) => {
  const { name, email, phone, address, password } = req.body;
  if (!name || !email || !password || !address || !phone) {
    return res.status(404).send({
      success: false,
      message: "something is missing",
    });
  }
  let existingUser = await userModel.findOne({ email: email });

  if (existingUser) {
    return res.status(409).send({
      success: false,
      message: "The user already exsits",
    });
  }

  const newPassword = await hashpassowrd(password);

  const user = new userModel({
    name: name,
    phone: phone,
    email: email,
    password: newPassword,
    address: address,
  });
  await user.save();

  return res.status(200).send({
    success: true,
    message: "User created successfuly",
  });
};

// Loging in the user

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Something is missing",
      });
    }

    const user = await userModel.findOne({ email: email });

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(400).send({
        success: false,
        message: "The passeord is wrong",
      });
    }

    const token = await Jwt.sign({ id: user._id }, process.env.JWT_TOKEN, {
      expiresIn: "7d",
    });
    return res.status(200).send({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error, "Error in Login controller");
  }
};
