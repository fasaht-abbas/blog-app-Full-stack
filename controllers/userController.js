import { comparePassword, hashpassowrd } from "../helpers/userHelper.js";
import userModel from "../models/userModel.js";
import nodemailer from "nodemailer";
import Jwt from "jsonwebtoken";
import fs from "fs";
import otpGenerator from "otp-generator";
import mongoose from "mongoose";

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
  if (!cookies.jwToken) {
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
// generating the otp and send the otp to email
export const generateOtpController = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email not registered",
      });
    }
    // generating the otp
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: true,
      lowerCaseAlphabets: false,
      specialChars: false,
      digits: true,
    });

    // saving in the user otp field
    user.otp.token = otp;
    user.otp.createdAt = Date.now();
    user.otp.expiresAt = Date.now() + 300000;
    await user.save();

    // creating a nodemailer transporter for sending the mail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    // mail options and the message to be sent
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Verify Account request",
      text:
        `Hi ${user.firstName},\n\n` +
        `We have received a request to verify your account.` +
        `Please use the following OTP to access your accouont: ${otp}\n\n` +
        `If you did not make this request, please ignore this email.\n\n` +
        `Best regards,\n` +
        `BH Blogs Team`,
    };

    transporter.sendMail(mailOptions);
    return res.status(200).send({
      success: true,
      message: "Otp sent successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

export const verifyOtpController = async (req, res) => {
  try {
    const { otp } = req.body;
    const user = await userModel.findOne({
      "otp.token": otp,
    });
    // finding the user
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "Wrong otp",
      });
    }

    // finding if the otp has expired
    if (user.otp.expiresAt <= Date.now()) {
      return res.status(403).send({
        success: false,
        message: "The Otp has expired",
      });
    }
    // turning the user to the verified user.
    user.verified = true;
    user.otp.token = "";
    user.otp.createdAt = undefined;
    user.otp.expiresAt = undefined;
    await user.save();
    return res.status(200).send({
      success: true,
      message: "OTP verified",
    });
  } catch (error) {
    console.log(error);
  }
};
// reseting the password
export const resettingPassController = async (req, res) => {
  try {
    const { password, email } = req.body;
    console.log(password);
    const hashedNewPassword = await hashpassowrd(password);
    const user = await userModel.findOne({ email: email });
    console.log(hashedNewPassword);
    user.password = hashedNewPassword;
    await user.save();
    return res.status(200).send({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

// sending the mail from the contact page
export const sendContactMessage = async (req, res) => {
  try {
    const { email, name, subject, message } = req.body;
    if (!email || !name || !subject || !message) {
      return res.status(404).send({
        success: true,
        message: "Some thing is missing",
      });
    }
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    const mailOptions1 = {
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      subject: subject,
      text:
        `From: ${name},\n\n` + `Email : ${email},\n\n'` + `Message: ${message}`,
    };

    const mailOptions2 = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Received Your Message",
      text:
        `Hi ${name},\n\n` +
        `We have received the message you sent.` +
        `We will get back to you as soon as possible.` +
        `Best regards,\n` +
        `BH Blogs Team`,
    };
    transporter.sendMail(mailOptions1);
    transporter.sendMail(mailOptions2);

    return res.status(200).send({
      success: true,
      message: "Message Sent Successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

// making the user return
export const updateUser = async (req, res) => {
  try {
    //here goes the controller....updating logic
    const { firstName, secondName, address, phone, password, email } =
      req.fields;
    if (!password) {
      return res.status(404).send({
        success: false,
        message: "Password is required",
      });
    }

    const { profilePhoto } = req.files;
    const { id } = req.params;
    const user = await userModel.findById(id);
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(400).send({
        success: false,
        message: "The passeord is wrong",
      });
    }
    const updated = await userModel.findOneAndUpdate(
      user._id,
      {
        firstName: firstName,
        secondName: secondName,
        phone: phone,
        emial: email,
        address: address,
      },
      { new: true }
    );
    // here updated is the user which is being updated
    if (profilePhoto) {
      updated.profilePhoto.data = fs.readFileSync(profilePhoto.path);
      updated.profilePhoto.contentType = profilePhoto.type;
    }
    await updated.save();
    updated.password = undefined;
    return res.status(200).send({
      success: true,
      updated,
    });
  } catch (error) {
    console.log(error);
  }
};
