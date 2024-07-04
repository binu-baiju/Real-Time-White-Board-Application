// routes/auth.ts
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import User from "../models/User";
import {
  generateVerificationCode,
  sendVerificationEmail,
} from "../utils/emailService";
require("dotenv").config();
const router = express.Router();

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

router.post("/signup", async (req, res) => {
  let subject = "WhiteBoard Application Email Verification";
  let htmlContent = "Click the following link to verify your email:";
  try {
    console.log("hello");
    const { email, password } = signupSchema.parse(req.body);

    const verificationCode = generateVerificationCode();
    console.log("verificationCode", verificationCode);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
      verificationCode: verificationCode,
    });
    await user.save();
    try {
      let emailresponse = await sendVerificationEmail(
        email,
        verificationCode,
        "verifyEmail",
        subject,
        htmlContent
      );
      console.log("email response:", emailresponse);
      res.status(201).json({
        message: "User created successfully. Verification email sent.",
        sucess: true,
      });
    } catch (error) {
      console.log("cant send email");
      res.status(400).json({
        message: "User created, but failed to send verification email.",
        error:
          error instanceof z.ZodError
            ? error.errors
            : (error as Error).message || "Unknown error",
      });
    }
  } catch (error) {
    res.status(400).json({
      error:
        error instanceof z.ZodError
          ? error.errors
          : (error as Error).message || "Unknown error",
    });
  }
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

router.post("/login", async (req, res) => {
  try {
    console.log("hello");

    const { email, password } = loginSchema.parse(req.body);
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) throw new Error("User not found");
    if (!user.isVerified) {
      return res
        .status(403)
        .json({ error: "Please verify your email before logging in" });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new Error("Invalid password");
    let token;
    try {
      token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string);
      console.log(token);
    } catch (error) {
      return res.status(500).json({ error: "Failed to create token" });
    }

    res.status(201).json({ token, sucess: true });
  } catch (error) {
    res.status(400).json({
      error:
        error instanceof z.ZodError ? error.errors : (error as Error).message,
    });
  }
});

export default router;
