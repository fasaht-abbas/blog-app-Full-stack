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

  res.cookie("test", "this is shte shitty value", {
    expiresIn: "3m",
    httpOnly: true,
  });

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

    const user = await userModel.findOne({ email });

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
        expiresIn: "1m",
      }
    );
    const refreshToken = await Jwt.sign(
      { id: user._id },
      process.env.JWT_Refresh_TOKEN,
      {
        expiresIn: "30m",
      }
    );

    res.cookie("jwToken", refreshToken, {
      httpOnly: true,
      expiresIn: "30m",
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
      expiresIn: "1m",
    }
  );
  const newRefreshToken = Jwt.sign(
    { id: user._id },
    process.env.JWT_Refresh_TOKEN,
    {
      expiresIn: "30m",
    }
  );

  res.cookie("jwToken", newRefreshToken, {
    httpOnly: true,
    expiresIn: "30m",
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
