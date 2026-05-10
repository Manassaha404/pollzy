import type { Response } from "express";

/**
 * Sends a standardised success JSON response.
 * Call as a plain function – no need to `new` it.
 */
export function ApiResponse(
  res: Response,
  statusCode: number,
  message: string,
  data?: object | null,
): void {
  res.status(statusCode).json({
    success: true,
    message,
    data: data ?? null,
  });
}

export default ApiResponse;
