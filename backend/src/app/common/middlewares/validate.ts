import type { NextFunction, Request, Response } from "express";
import type BaseDto from "../validation/baseDto.js";
import { ApiError } from "../utils/apiError.js";


export function validate<T extends typeof BaseDto>(dtoClass: T) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = await dtoClass.parseAsync(req.body);
      next();
    } catch (error) {
      // If it's already an ApiError, forward it
      if (error instanceof ApiError) {
        next(error);
        return;
      }
      next(ApiError.badRequest("Validation failed", error as object));
    }
  };
}
