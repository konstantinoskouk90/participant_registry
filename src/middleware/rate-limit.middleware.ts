import { rateLimit, RateLimitRequestHandler } from 'express-rate-limit';

export function rateLimitMiddleware(max: number, windowMs: number): RateLimitRequestHandler {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
  });
}