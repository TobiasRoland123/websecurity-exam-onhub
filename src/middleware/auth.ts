import type { Request, Response, NextFunction } from 'express';
import type { JwtPayload } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';

// Runtime check to ensure the secret is provided
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not defined.');
}

// Defining a clearer user type for better type safety
interface DecodedUser extends JwtPayload {
  userId: number;
  role: string;
}

// Extending the Express Request object properly with TypeScript
interface AuthenticatedRequest extends Request {
  user?: DecodedUser;
}

////////////////////////////////////////////////////////////////////////////////////////
// Middleware - Verify JWT token
export const authenticateJWT = (roles: string[] = []) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const token = req.cookies?.authToken;

    if (!token) {
      res.clearCookie('authToken');
      res.locals.isLoggedIn = false;
      res.locals.role = null;
      return roles.length > 0 ? res.redirect('/login') : next();
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as DecodedUser;
      req.user = decoded;
      res.locals.isLoggedIn = true;
      res.locals.role = decoded.role;

      // Check role authorization if specific roles are required
      if (roles.length > 0 && !roles.includes(decoded.role)) {
        console.warn('Unauthorized access attempt.');
        res.status(403).send('Unauthorized.');
        return;
      }

      next();
    } catch (error) {
      console.error('JWT verification failed:', error);
      res.clearCookie('authToken');
      res.locals.isLoggedIn = false;
      res.locals.role = null;
      return roles.length > 0 ? res.redirect('/login') : next();
    }
  };
};