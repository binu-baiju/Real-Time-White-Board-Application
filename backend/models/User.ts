// models/User.ts
import mongoose, { Document } from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  drawingImageUrl: { type: String },
  // drawingHistory: { type: [String], default: [] },
  verificationCode: { type: String, default: undefined },
  isVerified: { type: Boolean, default: false },
  resetPasswordToken: { type: String, default: undefined },
  resetPasswordExpires: { type: Date, default: undefined },
});

interface IUser extends Document {
  email: string;
  password: string;
  drawingImageUrl?: string;
  drawingHistory: string[];
  verificationCode?: string;
  isVerified: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

export default mongoose.model<IUser>("User", userSchema);
