import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

export function generateVerificationCode() {
  return crypto.randomBytes(20).toString("hex");
}

import nodemailer from "nodemailer";

export async function sendVerificationEmail(
  userEmail: string,
  verificationCode: string,
  emailType: string,
  subject: string,
  htmlcontent: string
) {
  let correctUrl = "";
  const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const verificationUrl = `http://localhost:5173/verify-email/${verificationCode}`;
  const forgotPasswordUrl = `http://localhost:5173/reset-password/${verificationCode}`;

  if (emailType === "verifyEmail") {
    correctUrl = verificationUrl;
  } else if (emailType === "forgotPassword") {
    correctUrl = forgotPasswordUrl;
  }

  return new Promise(async (resolve, reject) => {
    await transporter.sendMail(
      {
        from: '"Your App" <binuapplicatons@outlook.com>',
        to: userEmail,
        subject: subject,
        html: `<div><p>${htmlcontent} ${correctUrl}</p></div><a href="${correctUrl}">${emailType}</a>`,
      },
      (error, info) => {
        if (error) {
          console.error(error);
          reject(error);
        } else {
          console.log("Email sent: " + info.response);
          resolve(info.response);
        }
      }
    );
  });
}
