import express from "express";
import {
  generateVerificationCode,
  sendVerificationEmail,
} from "../utils/emailService";
import { z } from "zod";
import User from "../models/User";

require("dotenv").config();
const router = express.Router();

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

router.post("/sendforgotpasswordemail", async (req, res) => {
  let subject = "WhiteBoard Application Forgot Password";
  let htmlContent = "Click the following link to change your password: ";
  const { email } = forgotPasswordSchema.parse(req.body);
  console.log("email:", email);

  const verificationCode = generateVerificationCode();
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.resetPasswordToken = verificationCode;
    user.resetPasswordExpires = new Date(Date.now() + 3600000);

    await user.save();

    let emailresponse = await sendVerificationEmail(
      email,
      verificationCode,
      "forgotPassword",
      subject,
      htmlContent
    );
    console.log("email response:", emailresponse);
    res.status(201).json({
      message: "Forgot Email sent.",
      sucess: true,
    });
  } catch (error) {
    console.log("cant send email");
    res.status(400).json({
      message: "Failed to send verification email.",
      error:
        error instanceof z.ZodError
          ? error.errors
          : (error as Error).message || "Unknown error",
    });
  }
});

export default router;
