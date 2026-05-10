import { Resend } from "resend";
import { env } from "../config/envValidate.js";
import { ApiError } from "./apiError.js";

const resend = new Resend(env.RESEND_API_KEY);

export const sendOtp = async (email: string, otp: string): Promise<void> => {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Your Login OTP",
      html: `<div>
  <h2>Your Login OTP</h2>
  <p>Your OTP is: <strong>${otp}</strong></p>
  <p>This OTP expires in 5 minutes.</p>
</div>`,
    });
  } catch {
    throw ApiError.internal("Failed to send OTP email");
  }
};

export const sendVerificationToken = async (email: string, token: string): Promise<void> => {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Email Verification",
      html: `<div>
  <h2>Verify Your Email</h2>
  <p>Your verification token is: <strong>${token}</strong></p>
  <p>This token expires in 5 minutes.</p>
</div>`,
    });
  } catch {
    throw ApiError.internal("Failed to send verification email");
  }
};
