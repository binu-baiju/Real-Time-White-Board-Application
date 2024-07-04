// backend/routes/drawing.js

import express from "express";

const router = express.Router();
import { authMiddleware } from "../middleware/authMiddleware";
import User from "../models/User";

// GET drawing data URL for the logged-in user
router.get("/getDrawing", authMiddleware, async (req: any, res: any) => {
  try {
    // Retrieve the logged-in user's ID from the request object (set by the auth middleware)
    console.log("came to getDrawing");
    const userId = req.userId;

    // Find the user in the database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Drawing not found" });
    }

    res.json({
      drawing: user.drawingImageUrl,
      // drawingHistory: user.drawingHistory,
    });
  } catch (error) {
    console.error("Error fetching drawing:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
