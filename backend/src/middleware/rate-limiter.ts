import { Request, Response, NextFunction } from 'express';
// import Redis from 'ioredis'; // To connect to Redis/Upstash for distributed deployments

interface RateLimitConfig {
  windowMs: number;
  max: number;
  message: string;
}

// In-memory fallback database for rate limits
const memoryStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Custom Rate Limiter Middleware
 * Can easily be swapped with 'express-rate-limit' or 'nestjs-throttler'
 */
export const rateLimiter = (config: RateLimitConfig) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Determine the client identifier: prioritize authenticated user ID, fallback to IP
    const userIdentifier = (req as any).user?.id || req.ip || 'anonymous';
    const key = `${req.path}:${userIdentifier}`;

    const now = Date.now();

    // -------------------------------------------------------------
    // REDIS IMPLEMENTATION (Recommended for production/distributed)
    // -------------------------------------------------------------
    // try {
    //   const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    //   const requests = await redis.incr(key);
    //   if (requests === 1) {
    //     await redis.pexpire(key, config.windowMs);
    //   }
    //   const ttl = await redis.pttl(key);
    //   
    //   res.setHeader('X-RateLimit-Limit', config.max);
    //   res.setHeader('X-RateLimit-Remaining', Math.max(0, config.max - requests));
    //   res.setHeader('X-RateLimit-Reset', new Date(now + ttl).toISOString());
    //
    //   if (requests > config.max) {
    //     return res.status(429).json({
    //       statusCode: 429,
    //       error: 'Too Many Requests',
    //       message: config.message,
    //       retryAfterMs: ttl
    //     });
    //   }
    //   return next();
    // } catch (err) {
    //   console.error('Redis Rate Limiter Error, falling back to local memory', err);
    // }

    // -------------------------------------------------------------
    // MEMORY STORE FALLBACK IMPLEMENTATION
    // -------------------------------------------------------------
    const record = memoryStore.get(key);

    if (!record) {
      memoryStore.set(key, {
        count: 1,
        resetTime: now + config.windowMs,
      });
      res.setHeader('X-RateLimit-Limit', config.max);
      res.setHeader('X-RateLimit-Remaining', config.max - 1);
      res.setHeader('X-RateLimit-Reset', new Date(now + config.windowMs).toISOString());
      return next();
    }

    if (now > record.resetTime) {
      // Window expired, reset limit
      record.count = 1;
      record.resetTime = now + config.windowMs;
      memoryStore.set(key, record);

      res.setHeader('X-RateLimit-Limit', config.max);
      res.setHeader('X-RateLimit-Remaining', config.max - 1);
      res.setHeader('X-RateLimit-Reset', new Date(record.resetTime).toISOString());
      return next();
    }

    record.count += 1;
    memoryStore.set(key, record);

    const remaining = Math.max(0, config.max - record.count);
    res.setHeader('X-RateLimit-Limit', config.max);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', new Date(record.resetTime).toISOString());

    if (record.count > config.max) {
      const retryAfterMs = record.resetTime - now;
      res.setHeader('Retry-After', Math.ceil(retryAfterMs / 1000));
      return res.status(429).json({
        statusCode: 429,
        error: 'Too Many Requests',
        message: config.message,
        retryAfterMs
      });
    }

    next();
  };
};

// Preset rate limit parameters complying with the OWASP guidelines
export const RATE_LIMIT_PRESETS = {
  auth: rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 mins
    max: 5,
    message: 'Too many authentication attempts. Please try again after 15 minutes.'
  }),
  passwordReset: rateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3,
    message: 'Password reset request limit exceeded. Please try again in an hour.'
  }),
  publicApi: rateLimiter({
    windowMs: 60 * 1000, // 1 minute
    max: 60,
    message: 'Too many requests. Please slow down.'
  }),
  userApi: rateLimiter({
    windowMs: 60 * 1000, // 1 minute
    max: 120,
    message: 'API quota exceeded for this session.'
  })
};
