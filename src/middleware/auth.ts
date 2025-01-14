import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';

// Definerer en ny type, der udvider Request-objektet med et user-felt
interface AuthenticatedRequest extends Request {
  user?: { userId: number; role: string };
}

////////////////////////////////////////////////////////////////////////////////////////
// Middleware - Verify JWT token
export const authenticateJWT = (roles: string[] = []) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.authToken;

    if (!token) {
      res.locals.isLoggedIn = false;
      res.locals.role = null;
      if (roles.length > 0) {
        // Redirect only if roles are required
        return res.redirect('/login');
      }
      return next();
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; role: string };
      req.user = decoded;
      res.locals.isLoggedIn = true;
      res.locals.role = decoded.role;

      if (roles.length > 0 && !roles.includes(decoded.role)) {
        return res.redirect('/login');
      }

      next();
    } catch (error) {
      console.error('JWT verification failed:', error);
      res.clearCookie('authToken');
      res.locals.isLoggedIn = false;
      res.locals.role = null;
      if (roles.length > 0) {
        return res.redirect('/login');
      }
      next();
    }
  };
};