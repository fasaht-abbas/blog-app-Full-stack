import express from "express";
import {
  signUpController,
  loginController,
} from "../controllers/userController.js";
const router = express.Router();

// create a new user
router.post("/sign-up", signUpController);

//login to the user
router.get("/login", loginController);
export default router;
