import express, { Request, Response } from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { GeminiService } from './services/ai/gemini.service';
import { rateLimiter, RATE_LIMIT_PRESETS } from './middleware/rate-limiter';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'], // standard development origins
  credentials: true
}));

// Parse JSON request bodies
app.use(express.json());

// Custom rate-limiter configuration for the AI endpoint: 10 requests per minute
const aiRateLimiter = rateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: 'Too many AI requests. Rate limit is 10 requests per minute per Pro subscriber.'
});

// Middleware to mock a request user object if we want to tie it into our rate limiter's key
const injectRateLimitUser = (req: Request, res: Response, next: any) => {
  const { userProfile } = req.body;
  if (userProfile && userProfile.email) {
    // Inject the user email as the rate limiter key
    (req as any).user = { id: userProfile.email };
  }
  next();
};

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

/**
 * AI Streaming Chat Endpoint
 * POST /api/ai/chat
 */
app.post('/api/ai/chat', injectRateLimitUser, aiRateLimiter, async (req: Request, res: Response) => {
  try {
    const { message, history, userProfile, useMidwifeMode } = req.body;

    // 1. Authentication Check
    if (!userProfile || !userProfile.isLoggedIn) {
      return res.status(401).json({ 
        statusCode: 401,
        error: 'Unauthorized',
        message: 'You must be logged in to access Wellora AI.' 
      });
    }

    // 2. Pro subscriber validation check
    if (!userProfile.isPro) {
      return res.status(403).json({ 
        statusCode: 403,
        error: 'Forbidden',
        message: 'Upgrade to Wellora Mama Pro to use Wellora AI.' 
      });
    }

    if (!message) {
      return res.status(400).json({ error: 'Message content is required.' });
    }

    // Set up SSE / Chunked Transfer headers
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Transfer-Encoding', 'chunked');

    // Generate stream
    const stream = GeminiService.generateChatStream(
      message,
      history || [],
      userProfile,
      !!useMidwifeMode
    );

    for await (const chunk of stream) {
      res.write(chunk);
    }

    res.end();
  } catch (err: any) {
    console.error('Server error during AI chat streaming:', err);
    // If headers haven't been sent yet, send a graceful JSON error
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
 * Personalized Daily Wellness Plan Endpoint
 * POST /api/ai/daily-plan
 */
app.post('/api/ai/daily-plan', injectRateLimitUser, aiRateLimiter, async (req: Request, res: Response) => {
  try {
    const { userProfile, energyLevel, painLevel, preferences } = req.body;

    // 1. Authentication Check
    if (!userProfile || !userProfile.isLoggedIn) {
      return res.status(401).json({ 
        statusCode: 401,
        error: 'Unauthorized',
        message: 'You must be logged in to request a wellness plan.' 
      });
    }

    // 2. Pro Check
    if (!userProfile.isPro) {
      return res.status(403).json({ 
        statusCode: 403,
        error: 'Forbidden',
        message: 'Upgrade to Wellora Mama Pro to use Wellora AI.' 
      });
    }

    const planJsonString = await GeminiService.generateDailyPlan(
      userProfile,
      energyLevel ?? 5,
      painLevel ?? 0,
      preferences || ''
    );

    // Try parsing as JSON to confirm it is valid, else return as raw string
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

