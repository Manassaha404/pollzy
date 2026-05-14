import type { Request, Response, NextFunction, RequestHandler } from "express";
import { ApiError } from "../../common/utils/apiError.js";
import { verifyAccessToken } from "../../common/utils/jwtService.js";
import { db } from "../../../db/index.js";
import { users } from "../../../db/schema/users.schema.js";
import { eq } from "drizzle-orm";
import { auths } from "../../../db/schema/auth.schema.js";
import asyncHandler from "../../common/middlewares/asyncHandler.js";
import ApiResponse from "../../common/utils/apiResponce.js";

export function extractBearerToken(req: Request): string {
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


export function extractOptionalBearerToken(
  req: Request,
): string | null {
  const authHeader =
    req.get("authorization") ||
    (req.headers["authorization"] as string | undefined);
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.split(" ")[1] || null;
}

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

export const isGuestTokenExisted: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next:NextFunction) => {
    const {guestToken} = req.cookies;
    if(guestToken){
      return ApiResponse(res, 200, "guestToken already there")
    }
    next();
  },
);

export const optionalAuthorization: RequestHandler = asyncHandler(
  async (req, _res, next) => {
    try {
      const token = extractOptionalBearerToken(req);
      
      if (!token) {
        (req as any).userId = null;
        return next();
      }
      const payload = verifyAccessToken(token);
      
      
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, payload.userId));
      if (!user) {
        (req as any).userId = null;
        return next();
      }
      (req as any).userId = payload.userId;
      next();
    } catch {
      (req as any).userId = null;
      next();
    }
  },
);
