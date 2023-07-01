import express from "express";
import {
  signUpController,
  loginController,
  refresh,
  logoutController,
} from "../controllers/userController.js";
import { signInFirst } from "../middlewares/userMiddlewares.js";
const router = express.Router();

// create a new user
router.post("/sign-up", signUpController);

// refreshing the TOKENS
router.get("/refresh", refresh);

// refreshing the TOKENS
router.get("/private-auth", signInFirst, (req, res) => {
  try {
    res.status(200).send({ ok: true });
  } catch (error) {
    console.log(error);
  }
});

router.delete("/logout", logoutController);

//login to the user
router.post("/login", loginController);

export default router;
