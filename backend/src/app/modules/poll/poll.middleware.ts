import type { RequestHandler, Request, Response, NextFunction } from "express";
import asyncHandler from "../../common/middlewares/asyncHandler.js";
import { authorization, extractBearerToken } from "../auth/auth.middleware.js";
import { db } from "../../../db/index.js";
import { polls } from "../../../db/schema/poll.schema.js";
import { eq } from "drizzle-orm";
import ApiError from "../../common/utils/apiError.js";






export const isAuthorizationRequired: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    
    
    const { pollId } = req.params;

    if (!pollId) {
      throw ApiError.badRequest("pollId is missing");
    }

    const [poll] = await db
      .select()
      .from(polls)
      .where(eq(polls.id, pollId as string));

    
    if (!poll) {
      throw ApiError.notFound("poll not found");
    }

    if (!poll.isPublic) {
      return authorization(req, res, next);
    }
    const token = extractBearerToken(req);
    if(token){
      return authorization(req, res, next);
    }
    next();
  }
);
