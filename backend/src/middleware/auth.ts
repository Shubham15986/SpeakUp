import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request to hold user info
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.SUPABASE_JWT_SECRET;
    if (!secret) {
      console.error('SUPABASE_JWT_SECRET is not configured.');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
    req.user = decoded; 
    
    // Inject userId to preserve existing controller logic
    if (decoded.sub) {
      if (req.method === 'GET' || req.method === 'DELETE') {
        req.query.userId = decoded.sub;
      } else {
        req.body.userId = decoded.sub;
      }
    }

    next();
  } catch (error) {
    console.error('JWT Verification failed:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
