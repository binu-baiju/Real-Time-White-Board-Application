import express from "express";

import User from "../models/User";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

router.get("/verify-email/:code", async (req, res) => {
  const { code } = req.params;
  const trimmedCode = code.trim();
  console.log("code:", code);

  try {
    const user = await User.findOne({
      verificationCode: trimmedCode,
    });
    console.log("user:", user);

    if (!user) {
      return res.status(400).json({ error: "Invalid verification code" });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    await user.save();

    res
      .status(200)
      .json({ message: "Email verified successfully", success: true });
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Verification failed, please try again later.",
        success: false,
      });
  }
});

export default router;
