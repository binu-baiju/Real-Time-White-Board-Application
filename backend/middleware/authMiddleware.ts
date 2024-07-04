// backend/middleware/auth.js

import jwt from "jsonwebtoken";

require("dotenv").config();

export const authMiddleware = (req: any, res: any, next: any) => {
  // Get the token from the request headers
  const token = req.header("Authorization");

  // Check if token doesn't exist
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Verify the token
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT secret is not defined");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      userId: string;
    };

    // Attach the decoded user data to the request object
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default authMiddleware;
