import { comparePassword, hashpassowrd } from "../helpers/userHelper.js";
import userModel from "../models/userModel.js";
import Jwt from "jsonwebtoken";
import fs from "fs";

//  Creating a new user
export const signUpController = async (req, res) => {
  const { firstName, secondName, email, phone, address, password } = req.fields;
  const { profilePhoto } = req.files;
  if (
    !firstName ||
    !secondName ||
    !email ||
    !phone ||
    !address ||
    !password ||
    !profilePhoto
  ) {
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
    firstName: firstName,
    secondName: secondName,
    phone: phone,
    email: email,
    password: newPassword,
    address: address,
  });
  if (profilePhoto) {
    user.profilePhoto.data = fs.readFileSync(profilePhoto.path);
    user.profilePhoto.contentType = profilePhoto.type;
  }
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

    const user = await userModel.findOne({ email }).select("-profilePhoto");

    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "user not found" });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(400).send({
        success: false,
        message: "The passeord is wrong",
      });
    }

    const accessToken = await Jwt.sign(
      { id: user._id },
      process.env.JWT_Access_TOKEN,
      {
        expiresIn: process.env.JWT_ACCESS_EXPIRY_TIME,
      }
    );
    const refreshToken = await Jwt.sign(
      { id: user._id },
      process.env.JWT_Refresh_TOKEN,
      {
        expiresIn: process.env.JWT_REFRESH_EXPIRY_TIME,
      }
    );

    res.cookie("jwToken", refreshToken, {
      httpOnly: true,
      expiresIn: process.env.JWT_REFRESH_EXPIRY_TIME,
    });
    user.password = undefined;
    res.status(200).send({
      success: true,
      user,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.log(error, "Error in Login controller");
  }
};

// new ACCESS and REFRESH Token
export const refresh = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwToken) {
    return res.status(400).send({
      message: "no cookie found",
    });
  }
  const refreshToken = cookies?.jwToken;

  const decoded = Jwt.verify(refreshToken, process.env.JWT_Refresh_TOKEN);

  if (!decoded) {
    return res.status(403).send("Invalid token");
  }

  const userId = decoded.id;

  const user = await userModel.findOne({ _id: userId });

  if (!user) {
    return res.status(401).send("Invalid refresh token");
  }

  const newAccessToken = Jwt.sign(
    { id: user._id },
    process.env.JWT_Access_TOKEN,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRY_TIME,
    }
  );
  const newRefreshToken = Jwt.sign(
    { id: user._id },
    process.env.JWT_Refresh_TOKEN,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRY_TIME,
    }
  );

  res.cookie("jwToken", newRefreshToken, {
    httpOnly: true,
    expiresIn: process.env.JWT_REFRESH_EXPIRY_TIME,
  });
  user.password = undefined;
  res.status(200).send({
    success: true,
    user,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  });
};

// LOGGING THE USER OUT
export const logoutController = async (req, res) => {
  try {
    res.clearCookie("jwToken", {
      httpOnly: true,
    });
    res.status(200).send({
      success: true,
      message: "The user logged out successfuly",
    });
  } catch (error) {
    console.log(error);
  }
};

// retrieving the user profile photo...
export const getProfilePhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const profilePic = await userModel
      .findById({ _id: id })
      .select("profilePhoto");
    if (profilePic.profilePhoto.data) {
      res.set("Content-type", profilePic.profilePhoto.contentType);
      res.status(200).send(profilePic.profilePhoto.data);
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
