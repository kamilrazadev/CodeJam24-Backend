import express from "express";
import {
  verifyOtploginController,
  verifyOtpSignupController,
  verifyAccountLoginController,
  verifyAccountSignupController,
} from "../Controllers/authController.js";
const authRouter = express.Router();

authRouter.post("/verify/signup", verifyAccountSignupController);
authRouter.post("/signup", verifyOtpSignupController);
authRouter.post("/verify/login", verifyAccountLoginController);
authRouter.post("/login", verifyOtploginController);

export default authRouter;
