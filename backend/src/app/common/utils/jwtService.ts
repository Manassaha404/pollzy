import jwt from "jsonwebtoken";
import { env } from "../config/envValidate.js";
import { ApiError } from "./apiError.js";

export const generateAccessToken = (userId: string): string => {
  return jwt.sign({ userId }, env.JWT_ACCESS_TOKEN_SERECT, {
    expiresIn: env.JWT_ACCESS_TOKEN_EXPIRY as `${number}${"s" | "m" | "h" | "d"}` | number,
  });
};

export const verifyAccessToken = (token: string): jwt.JwtPayload & { userId: string } => {
  try {
    return jwt.verify(token, env.JWT_ACCESS_TOKEN_SERECT) as jwt.JwtPayload & { userId: string };
  } catch {
    throw ApiError.unAuthorized("Access token is invalid or expired");
  }
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ userId }, env.JWT_REFRESH_TOKEN_SERECT, {
    expiresIn: env.JWT_REFRESH_TOKEN_EXPIRY as `${number}${"s" | "m" | "h" | "d"}` | number,
  });
};

export const verifyRefreshToken = (token: string): jwt.JwtPayload & { userId: string } => {
  try {
    return jwt.verify(token, env.JWT_REFRESH_TOKEN_SERECT) as jwt.JwtPayload & { userId: string };
  } catch {
    throw ApiError.unAuthorized("Refresh token is invalid or expired");
  }
};

export const generateVerifcationToken = (email: string): string => {
  return jwt.sign({ email }, env.VERIFICATION_TOKEN_SERECT, {
    expiresIn: env.VERIFICATION_TOKEN_EXPIRY as `${number}${"s" | "m" | "h" | "d"}` | number,
  });
};

export const verifyVerificationToken = (token: string): jwt.JwtPayload & { email: string } => {
  try {
    return jwt.verify(token, env.VERIFICATION_TOKEN_SERECT) as jwt.JwtPayload & { email: string };
  } catch {
    throw ApiError.badRequest("Verification token is invalid or expired");
  }
};
