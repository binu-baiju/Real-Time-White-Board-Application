import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import User from "../models/User";
require("dotenv").config();
const router = express.Router();

router.post("/saveDrawing", async (req, res) => {
  const { drawing, token, drawingHistory } = req.body;

  try {
    // Check if JWT_SECRET is defined
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT secret is not defined");
    }

    // Verify the token and decode it
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET) as {
      userId: string;
    };

    // Extract the user ID from the decoded token
    const userId = decodedToken.userId;
    console.log("User ID:", userId);

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId }, // Find user by ID
      {
        $set: {
          drawingImageUrl: drawing,
          // drawingHistory: JSON.stringify(drawingHistory),
        },
      }, // Update imageUrl field
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      throw new Error("User not found");
    }

    console.log("User updated:", updatedUser);

    console.log("Drawing:", drawing);
    console.log("Token:", token);

    res.status(201).json({ message: "Drawing saved successfully" });
  } catch (error) {
    console.error("Error saving drawing:", error);
    res.status(500).json({ error: "Failed to save drawing" });
  }
});

export default router;
