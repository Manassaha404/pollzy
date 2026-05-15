import type { Request, RequestHandler, Response } from "express";
import { ApiResponse } from "../../common/utils/apiResponce.js";
import { ApiError } from "../../common/utils/apiError.js";
import { db } from "../../../db/index.js";
import { users } from "../../../db/schema/users.schema.js";
import { auths } from "../../../db/schema/auth.schema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import crypto from "crypto";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../common/utils/jwtService.js";
import { sendOtp } from "../../common/utils/emailVerification.js";
import asyncHandler from "../../common/middlewares/asyncHandler.js";

class authController {
  static userRegister: RequestHandler = asyncHandler(
    async (req: Request, res: Response) => {
      const { firstName, lastName, email, password } = req.body;

      const emailExisted = await db
        .select()
        .from(users)
        .where(eq(users.email, email));
      if (emailExisted.length > 0)
        throw ApiError.conflict("Email already exists");

      const hashedPassword = await bcrypt.hash(password, 10);

      await db.transaction(async (tx: any) => {
        const [user] = await tx
          .insert(users)
          .values({ firstName, lastName, email })
          .returning();

        if (!user) throw ApiError.internal("Failed to create user record");

        const [auth] = await tx
          .insert(auths)
          .values({
            password: hashedPassword,
            userId: user.id,
          })
          .returning();
        if (!auth) throw ApiError.internal("Failed to create auth record");
      });
      ApiResponse(res, 201, "User registered successfully.");
    },
  );

  static userLogin: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
    
    if (!existingUser) throw ApiError.badRequest("Invalid email or password");
    const [userAuth] = await db
      .select()
      .from(auths)
      .where(eq(auths.userId, existingUser.id));
    
    if (!userAuth) {
      throw ApiError.unAuthorized(
        "Account is not verified. Please verify your email.",
      );
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      userAuth.password,
    );
    if (!isPasswordCorrect)
      throw ApiError.badRequest("Invalid email or password");
    const accessToken = generateAccessToken(existingUser.id);
    const refreshToken = generateRefreshToken(existingUser.id);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await db
      .update(auths)
      .set({ refreshToken: hashedRefreshToken })
      .where(eq(auths.id, userAuth.id));

    
    const isProd = process.env.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: (isProd ? 'none' : 'lax') as 'none' | 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    // 7. Attach cookie to response
    res.cookie("refreshToken", refreshToken, cookieOptions);

    // 8. Final API Response
    return ApiResponse(
      res,
      200,
      "Logged in successfully",
      { 
        accessToken, 
        info: { ...existingUser } 
      },
    );
  },
);

  static getUserInfo: RequestHandler = asyncHandler(
    async (req: Request, res: Response) => {
      const { userId } = (req as any).userId;

      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId));
      if (!existingUser) throw ApiError.notFound("User not found");

      ApiResponse(res, 200, "User info fetched successfully", {
        ...existingUser,
      });
    },
  );

  static forgotPass: RequestHandler = asyncHandler(
    async (req: Request, res: Response) => {
      const { email } = req.body;

      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));
      if (!existingUser) throw ApiError.badRequest("Email not found");

      const verificationOtp = crypto.randomInt(100000, 999999).toString();
      await db
        .update(auths)
        .set({ verificationOtp })
        .where(eq(auths.userId, existingUser.id));

      await sendOtp(email, verificationOtp);
      ApiResponse(res, 200, "Password reset token sent to email");
    },
  );

  static resetPass: RequestHandler = asyncHandler(
    async (req: Request, res: Response) => {
      const { newPassword, token, email } = req.body;

      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));
      if (!existingUser) throw ApiError.badRequest("User not found");

      const [userAuth] = await db
        .select()
        .from(auths)
        .where(eq(auths.userId, existingUser.id));
      if (!userAuth) {
        throw ApiError.unAuthorized("Account not verified");
      }

      if (userAuth.verificationOtp !== token) {
        throw ApiError.badRequest("Token does not match");
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await db
        .update(auths)
        .set({ verificationOtp: null, password: hashedPassword })
        .where(eq(auths.id, userAuth.id));

      ApiResponse(res, 200, "Password changed successfully");
    },
  );

  static resetTokens: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken)
      throw ApiError.unAuthorized("Refresh token missing in cookies");
    const payload = verifyRefreshToken(refreshToken);
    const userId = payload.userId;
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));
    if (!existingUser) throw ApiError.unAuthorized("User not found");
    const [userAuth] = await db
      .select()
      .from(auths)
      .where(eq(auths.userId, existingUser.id));
    
    if (!userAuth || !userAuth.refreshToken) {
      throw ApiError.unAuthorized("User is not logged in or account not verified");
    }
    const isRefreshTokenMatched = await bcrypt.compare(
      refreshToken,
      userAuth.refreshToken,
    );
    if (!isRefreshTokenMatched)
      throw ApiError.unAuthorized("Invalid refresh token");
    const newRefreshToken = generateRefreshToken(existingUser.id);
    const accessToken = generateAccessToken(existingUser.id);
    const hashedRefreshToken = await bcrypt.hash(newRefreshToken, 10);
    await db
      .update(auths)
      .set({ refreshToken: hashedRefreshToken })
      .where(eq(auths.id, userAuth.id));
    const isProd = process.env.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: (isProd ? 'none' : 'lax') as 'none' | 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };
    res.cookie("refreshToken", newRefreshToken, cookieOptions);
    return ApiResponse(
      res,
      200,
      "Tokens refreshed successfully",
      {
        accessToken,
        info: { ...existingUser },
      },
    );
  },
);

  static logout: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req as any).userId?.userId;
    if (!userId) throw ApiError.unAuthorized("Not authenticated");

    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));
    if (!existingUser) throw ApiError.notFound("User not found");

    const [userAuth] = await db
      .select()
      .from(auths)
      .where(eq(auths.userId, existingUser.id));

    if (!userAuth) throw ApiError.internal("Auth record missing");
    const isProd = process.env.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,
      sameSite: (isProd ? 'none' : 'lax') as 'none' | 'lax',
      secure: isProd,
    };
    await db
      .update(auths)
      .set({ refreshToken: null })
      .where(eq(auths.id, userAuth.id));
    res.clearCookie("refreshToken", cookieOptions);

    return ApiResponse(
      res,
      200,
      "Logged out successfully"
    );
  },
);

  static guestToken: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const guestToken = crypto.randomUUID();
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("guestToken", guestToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax', 
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    return ApiResponse(
      res, 
      200, 
      "guestToken sent successfully"
    );
  },
);
}

export default authController;
