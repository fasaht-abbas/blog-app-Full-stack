import express from "express";
import {
  signUpController,
  loginController,
  refresh,
  logoutController,
  getProfilePhoto,
  generateOtpController,
  verifyOtpController,
  resettingPassController,
  sendContactMessage,
} from "../controllers/userController.js";
import formidable from "express-formidable";
import { signInFirst } from "../middlewares/userMiddlewares.js";
const router = express.Router();

// create a new user
router.post("/sign-up", formidable(), signUpController);

// refreshing the TOKENS
router.get("/refresh", refresh);

// protected the TOKENS
router.get("/private-auth", signInFirst, (req, res) => {
  try {
    res.status(200).send({ ok: true });
  } catch (error) {
    console.log(error);
  }
});
// deleting the cookie to logout
router.delete("/logout", logoutController);

//login to the user
router.post("/login", loginController);

//getting the photo
router.get("/get-photo/:id", getProfilePhoto);

// generating the otp
router.post("/generate-otp", generateOtpController);
// VERIFY the otp
router.post("/verify-otp", verifyOtpController);

router.post("/reset-password", resettingPassController);

router.post("/send-message", sendContactMessage);

export default router;
