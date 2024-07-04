import express from "express";
import { z } from "zod";
import User from "../models/User";
import bcrypt from "bcrypt";

const router = express.Router();

const resetPasswordSchema = z.object({
  password: z.string().min(6),
  token: z.string(),
});

router.post("/resetpassword", async (req, res) => {
  const { password, token } = resetPasswordSchema.parse(req.body);

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }, // Check if token is not expired
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword; // Make sure to hash the password before saving in production
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({
      message: "Password has been reset successfully.",
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to reset password.",
      error:
        error instanceof z.ZodError
          ? error.errors
          : (error as Error).message || "Unknown error",
    });
  }
});

export default router;
