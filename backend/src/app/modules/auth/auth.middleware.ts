import type { Request, Response, NextFunction, RequestHandler } from "express";
import { ApiError } from "../../common/utils/apiError.js";
import { verifyAccessToken } from "../../common/utils/jwtService.js";
import { db } from "../../../db/index.js";
import { users } from "../../../db/schema/users.schema.js";
import { eq } from "drizzle-orm";
import { auths } from "../../../db/schema/auth.schema.js";
import asyncHandler from "../../common/middlewares/asyncHandler.js";

function extractBearerToken(req: Request): string {
  const authHeader =
    req.get("authorization") ||
    (req.headers["x-access-token"] as string | undefined);
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw ApiError.unAuthorized("Missing or malformed Authorization header");
  }

  const token = authHeader.split(" ")[1];
  if (!token) throw ApiError.unAuthorized();
  return token;
}

// Any authenticated user
export const authorization: RequestHandler = asyncHandler(
  async (req, _res, next) => {
    const token = extractBearerToken(req);
    const payload = verifyAccessToken(token);

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, payload.userId));
    if (!user) throw ApiError.unAuthorized("User not found");

    (req as any).userId = payload;
    next();
  },
);
//role based
export const roleBasedAuthrization = (...roles: string[]): RequestHandler =>
  asyncHandler(async (req, res, next) => {
    const { userId } = (req as any).userId;
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) throw ApiError.unAuthorized("User not found");
    const [userAuth] = await db
      .select()
      .from(auths)
      .where(eq(auths.userId, user.id));
    if (!userAuth) {
      throw ApiError.unAuthorized(
        "Account is not verified. Please verify your email.",
      );
    }
    if (!roles.includes(userAuth.role as string)) {
      throw ApiError.forbidden(
        "You do not have permission to access this resource.",
      );
    }
    next();
  });
