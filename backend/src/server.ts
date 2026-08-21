import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { GeminiService } from './services/ai/gemini.service';
import { rateLimiter, RATE_LIMIT_PRESETS } from './middleware/rate-limiter';
import { prisma } from './db';
import { PasswordService } from './auth/password.service';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000; // default to 5000 as configured in .env.example
const JWT_SECRET = process.env.JWT_SECRET || 'development-jwt-secret-key-wellora-mama-2026';
const JSON_BODY_LIMIT = process.env.JSON_BODY_LIMIT || '25mb';
const MAX_MEDIA_UPLOAD_BYTES = Number(process.env.MAX_MEDIA_UPLOAD_BYTES || 15 * 1024 * 1024);

// Enable CORS
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173'
];
if (process.env.FRONTEND_URL) {
  const envOrigins = process.env.FRONTEND_URL.split(',').map(o => o.trim());
  allowedOrigins.push(...envOrigins);
}

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true
}));

// Parse JSON request bodies. Media uploads use base64 JSON so they can run on Vercel without multipart dependencies.
app.use(express.json({ limit: JSON_BODY_LIMIT }));

// Custom rate-limiter configuration for the AI endpoint: 10 requests per minute
const aiRateLimiter = rateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: 'Too many AI requests. Rate limit is 10 requests per minute per Pro subscriber.'
});

/**
 * JWT Verification Middleware
 */
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Access token is required.'
    });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({
        statusCode: 403,
        error: 'Forbidden',
        message: 'Invalid or expired access token.'
      });
    }
    (req as any).user = user;
    next();
  });
};

const getTrimesterFromDueDate = (dueDate: Date | null): 'First' | 'Second' | 'Third' | null => {
  if (!dueDate) return null;
  const today = new Date();
  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const weeksConceived = Math.max(0, 40 - Math.floor(diffDays / 7));
  if (weeksConceived <= 13) return 'First';
  if (weeksConceived <= 27) return 'Second';
  return 'Third';
};

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

const getMediaKind = (mimeType: string): 'image' | 'video' | null => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  return null;
};

const toBase64Payload = (value: string) => {
  const commaIndex = value.indexOf(',');
  return commaIndex >= 0 ? value.slice(commaIndex + 1) : value;
};

/**
 * List media metadata stored in Neon.
 * GET /api/media?kind=image|video
 */
app.get('/api/media', async (req: Request, res: Response) => {
  try {
    const kind = typeof req.query.kind === 'string' ? req.query.kind : undefined;
    const where = kind === 'image' || kind === 'video' ? { kind } : {};

    const assets = await prisma.mediaAsset.findMany({
      where,
      select: {
        id: true,
        kind: true,
        fileName: true,
        mimeType: true,
        sizeBytes: true,
        description: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: 100
    });

    return res.json({
      assets: assets.map((asset) => ({
        ...asset,
        url: `/api/media/${asset.id}`
      }))
    });
  } catch (err) {
    console.error('List media error:', err);
    return res.status(500).json({ error: 'Failed to list media assets.' });
  }
});

/**
 * Upload an image or video into Neon.
 * POST /api/media
 */
app.post('/api/media', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { fileName, mimeType, description, base64 } = req.body;

    if (!fileName || !mimeType || !base64) {
      return res.status(400).json({ error: 'fileName, mimeType, and base64 are required.' });
    }

    const kind = getMediaKind(mimeType);
    if (!kind) {
      return res.status(400).json({ error: 'Only image/* and video/* uploads are supported.' });
    }

    const content = Buffer.from(toBase64Payload(base64), 'base64');
    if (!content.length) {
      return res.status(400).json({ error: 'Uploaded media content is empty.' });
    }

    if (content.length > MAX_MEDIA_UPLOAD_BYTES) {
      return res.status(413).json({
        error: `Media is too large. Maximum upload size is ${MAX_MEDIA_UPLOAD_BYTES} bytes.`
      });
    }

    const asset = await prisma.mediaAsset.create({
      data: {
        ownerId: (req as any).user.id,
        kind,
        fileName,
        mimeType,
        sizeBytes: content.length,
        description: description || null,
        content
      },
      select: {
        id: true,
        kind: true,
        fileName: true,
        mimeType: true,
        sizeBytes: true,
        description: true,
        createdAt: true
      }
    });

    return res.status(201).json({
      asset: {
        ...asset,
        url: `/api/media/${asset.id}`
      }
    });
  } catch (err) {
    console.error('Upload media error:', err);
    return res.status(500).json({ error: 'Failed to upload media asset.' });
  }
});

/**
 * Stream image or video bytes from Neon.
 * GET /api/media/:id
 */
app.get('/api/media/:id', async (req: Request, res: Response) => {
  try {
    const asset = await prisma.mediaAsset.findUnique({
      where: { id: req.params.id }
    });

    if (!asset) {
      return res.status(404).json({ error: 'Media asset not found.' });
    }

    const content = Buffer.from(asset.content);
    res.setHeader('Content-Type', asset.mimeType);
    res.setHeader('Content-Length', content.length);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('Content-Disposition', `inline; filename="${asset.fileName.replace(/"/g, '')}"`);
    return res.end(content);
  } catch (err) {
    console.error('Fetch media error:', err);
    return res.status(500).json({ error: 'Failed to fetch media asset.' });
  }
});

/**
 * Delete a media asset from Neon.
 * DELETE /api/media/:id
 */
app.delete('/api/media/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const asset = await prisma.mediaAsset.findUnique({
      where: { id: req.params.id },
      select: { ownerId: true }
    });

    if (!asset) {
      return res.status(404).json({ error: 'Media asset not found.' });
    }

    if (asset.ownerId && asset.ownerId !== (req as any).user.id) {
      return res.status(403).json({ error: 'You cannot delete media uploaded by another user.' });
    }

    await prisma.mediaAsset.delete({ where: { id: req.params.id } });
    return res.json({ success: true });
  } catch (err) {
    console.error('Delete media error:', err);
    return res.status(500).json({ error: 'Failed to delete media asset.' });
  }
});

/**
 * Sign Up Endpoint
 * POST /api/auth/signup
 */
app.post('/api/auth/signup', async (req: Request, res: Response) => {
  try {
    const { email, password, name, stage, trimester, weeksPostpartum, dueOrBirthDate, goals } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required.' });
    }

    // Split name into first and last name
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0] || 'Mama';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    // Hash password
    const salt = PasswordService.generateSalt();
    const passwordHash = await PasswordService.hashPassword(password, salt);

    // Create user and profile in a transaction
    const newUser = await prisma.$transaction(async (tx) => {
      const u = await tx.user.create({
        data: {
          email,
          passwordHash,
          salt,
          firstName,
          lastName,
          isPro: false, // Default is free
        }
      });

      // Create standard default profile
      await tx.pregnancyProfile.create({
        data: {
          userId: u.id,
          status: (stage || 'pregnant').toUpperCase(), // "PREGNANT" | "POSTPARTUM" | "CAREGIVER"
          dueDate: dueOrBirthDate ? new Date(dueOrBirthDate) : null,
          weeksPostpartum: weeksPostpartum ? parseInt(weeksPostpartum) : null,
          goals: goals || [],
        }
      });

      return u;
    });

    // Sign JWT token
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });

    // Fetch user details to return
    const userWithProfile = await prisma.user.findUnique({
      where: { id: newUser.id },
      include: { pregnancyProfile: true }
    });

    return res.json({
      token,
      user: {
        id: userWithProfile?.id,
        email: userWithProfile?.email,
        firstName: userWithProfile?.firstName,
        lastName: userWithProfile?.lastName,
        isPro: userWithProfile?.isPro,
        pregnancyProfile: userWithProfile?.pregnancyProfile,
      }
    });
  } catch (err: any) {
    console.error('Signup error:', err);
    return res.status(500).json({ error: 'Failed to create account. Please check your database connection.' });
  }
});

/**
 * Log In Endpoint
 * POST /api/auth/login
 */
app.post('/api/auth/login', RATE_LIMIT_PRESETS.auth, async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { pregnancyProfile: true }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isPasswordValid = await PasswordService.verifyPassword(password, user.passwordHash, user.salt);
    if (!isPasswordValid) {
      // Log failed attempt
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          event: 'AUTH_LOGIN_FAILED',
          ipAddress: req.ip || 'unknown',
        }
      }).catch(err => console.error('Audit log error:', err));

      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Log successful login
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        event: 'AUTH_LOGIN_SUCCESS',
        ipAddress: req.ip || 'unknown',
      }
    }).catch(err => console.error('Audit log error:', err));

    // Sign JWT
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isPro: user.isPro,
        pregnancyProfile: user.pregnancyProfile,
      }
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'An error occurred during login. Please check database connectivity.' });
  }
});

/**
 * Fetch Current Authenticated User Endpoint
 * GET /api/auth/me
 */
app.get('/api/auth/me', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { 
        pregnancyProfile: true,
        babies: {
          include: {
            immunizationRecords: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isPro: user.isPro,
        pregnancyProfile: user.pregnancyProfile,
        babies: user.babies,
      }
    });
  } catch (err) {
    console.error('Fetch profile error:', err);
    return res.status(500).json({ error: 'Failed to retrieve profile.' });
  }
});

/**
 * Update User Profile Endpoint (Secured)
 * PUT /api/auth/profile
 */
app.put('/api/auth/profile', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { name, isPro, stage, weeksPostpartum, dueOrBirthDate, goals } = req.body;

    const userUpdateData: any = {};
    if (name !== undefined) {
      const nameParts = name.trim().split(' ');
      userUpdateData.firstName = nameParts[0] || '';
      userUpdateData.lastName = nameParts.slice(1).join(' ') || '';
    }
    if (isPro !== undefined) {
      userUpdateData.isPro = isPro;
    }

    const profileUpdateData: any = {};
    if (stage !== undefined) {
      profileUpdateData.status = stage.toUpperCase();
    }
    if (weeksPostpartum !== undefined) {
      profileUpdateData.weeksPostpartum = weeksPostpartum;
    }
    if (dueOrBirthDate !== undefined) {
      profileUpdateData.dueDate = dueOrBirthDate ? new Date(dueOrBirthDate) : null;
    }
    if (goals !== undefined) {
      profileUpdateData.goals = goals;
    }

    // Perform database updates
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...userUpdateData,
        pregnancyProfile: {
          update: profileUpdateData
        }
      },
      include: {
        pregnancyProfile: true,
        babies: {
          include: {
            immunizationRecords: true
          }
        }
      }
    });

    return res.json({
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        isPro: updatedUser.isPro,
        pregnancyProfile: updatedUser.pregnancyProfile,
        babies: updatedUser.babies,
      }
    });
  } catch (err: any) {
    console.error('Update profile error:', err);
    return res.status(500).json({ error: 'Failed to update user profile.' });
  }
});


/**
 * AI Streaming Chat Endpoint (Secured)
 * POST /api/ai/chat
 */
app.post('/api/ai/chat', authenticateToken, aiRateLimiter, async (req: Request, res: Response) => {
  try {
    const { message, history, useMidwifeMode } = req.body;
    const userId = (req as any).user.id;

    // Retrieve user and profile from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { pregnancyProfile: true }
    });

    if (!user) {
      return res.status(401).json({ error: 'Account does not exist.' });
    }

    // 1. Pro subscriber validation check
    if (!user.isPro) {
      return res.status(403).json({ 
        statusCode: 403,
        error: 'Forbidden',
        message: 'Upgrade to Wellora Mama Pro to use Wellora AI.' 
      });
    }

    if (!message) {
      return res.status(400).json({ error: 'Message content is required.' });
    }

    // Format profile context for Gemini
    const userProfileContext = {
      stage: user.pregnancyProfile?.status.toLowerCase() || 'pregnant',
      trimester: user.pregnancyProfile?.dueDate ? getTrimesterFromDueDate(user.pregnancyProfile.dueDate) : 'First',
      weeksPostpartum: user.pregnancyProfile?.weeksPostpartum || null,
      goals: user.pregnancyProfile?.goals || [],
      dueOrBirthDate: user.pregnancyProfile?.dueDate ? user.pregnancyProfile.dueDate.toISOString().split('T')[0] : null,
    };

    // Set up SSE / Chunked Transfer headers
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Transfer-Encoding', 'chunked');

    // Generate stream
    const stream = GeminiService.generateChatStream(
      message,
      history || [],
      userProfileContext,
      !!useMidwifeMode
    );

    for await (const chunk of stream) {
      res.write(chunk);
    }

    res.end();
  } catch (err: any) {
    console.error('Server error during AI chat streaming:', err);
    if (!res.headersSent) {
      res.status(500).json({ 
        statusCode: 500,
        error: 'Internal Server Error',
        message: err.message || 'An error occurred during generative processing.' 
      });
    } else {
      res.write('\n[Error: Stream interrupted due to backend issue.]');
      res.end();
    }
  }
});

/**
 * Personalized Daily Wellness Plan Endpoint (Secured)
 * POST /api/ai/daily-plan
 */
app.post('/api/ai/daily-plan', authenticateToken, aiRateLimiter, async (req: Request, res: Response) => {
  try {
    const { energyLevel, painLevel, preferences } = req.body;
    const userId = (req as any).user.id;

    // Retrieve user and profile from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { pregnancyProfile: true }
    });

    if (!user) {
      return res.status(401).json({ error: 'Account does not exist.' });
    }

    // 1. Pro Check
    if (!user.isPro) {
      return res.status(403).json({ 
        statusCode: 403,
        error: 'Forbidden',
        message: 'Upgrade to Wellora Mama Pro to use Wellora AI.' 
      });
    }

    // Format profile context for Gemini
    const userProfileContext = {
      stage: user.pregnancyProfile?.status.toLowerCase() || 'pregnant',
      trimester: user.pregnancyProfile?.dueDate ? getTrimesterFromDueDate(user.pregnancyProfile.dueDate) : 'First',
      weeksPostpartum: user.pregnancyProfile?.weeksPostpartum || null,
      goals: user.pregnancyProfile?.goals || [],
      dueOrBirthDate: user.pregnancyProfile?.dueDate ? user.pregnancyProfile.dueDate.toISOString().split('T')[0] : null,
    };

    const planJsonString = await GeminiService.generateDailyPlan(
      userProfileContext,
      energyLevel ?? 5,
      painLevel ?? 0,
      preferences || ''
    );

    try {
      const planObj = JSON.parse(planJsonString);
      return res.json(planObj);
    } catch {
      return res.json({ rawPlan: planJsonString });
    }
  } catch (err: any) {
    console.error('Server error during daily plan generation:', err);
    res.status(500).json({ 
      statusCode: 500,
      error: 'Internal Server Error',
      message: err.message || 'Failed to generate wellness plan.' 
    });
  }
});

// Simple in-memory subscription store for demonstration/scaffolding
interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}
const subscriptionsStore = new Map<string, { subscription: PushSubscription; type: 'antenatal' | 'vaccines' }[]>();

/**
 * Forgot Password Endpoint
 * POST /api/auth/forgot-password
 */
app.post('/api/auth/forgot-password', RATE_LIMIT_PRESETS.passwordReset, async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }
  
  console.log(`Password reset link requested for email: ${email}`);
  
  return res.json({ 
    success: true, 
    message: 'If the email exists, a password reset link has been dispatched.' 
  });
});

/**
 * Subscribe to Antenatal Push Notifications
 * POST /api/push/subscribe
 */
app.post('/api/push/subscribe', async (req: Request, res: Response) => {
  const { subscription, userId } = req.body;
  
  if (!subscription || !userId) {
    return res.status(400).json({ error: 'Subscription and userId are required.' });
  }

  console.log(`Registered antenatal push subscription for ${userId}:`, subscription.endpoint);
  
  const userSubs = subscriptionsStore.get(userId) || [];
  userSubs.push({ subscription, type: 'antenatal' });
  subscriptionsStore.set(userId, userSubs);
  
  return res.json({ success: true, message: 'Antenatal push subscription registered successfully.' });
});

/**
 * Subscribe to Vaccine Push Notifications
 * POST /api/push/subscribe-vaccines
 */
app.post('/api/push/subscribe-vaccines', async (req: Request, res: Response) => {
  const { subscription, userId } = req.body;
  
  if (!subscription || !userId) {
    return res.status(400).json({ error: 'Subscription and userId are required.' });
  }

  console.log(`Registered vaccine push subscription for ${userId}:`, subscription.endpoint);
  
  const userSubs = subscriptionsStore.get(userId) || [];
  userSubs.push({ subscription, type: 'vaccines' });
  subscriptionsStore.set(userId, userSubs);
  
  return res.json({ success: true, message: 'Vaccine push subscription registered successfully.' });
});

// Start listening
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Wellora Mama Secure AI Backend running on port ${PORT}`);
  });
}

export default app;
