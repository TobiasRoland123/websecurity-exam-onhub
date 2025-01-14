import type { Request, Response, NextFunction } from 'express';

////////////////////////////////////////////////////////////////////////////////////////
// Global error handler
export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error('Error:', err.message);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
  next();
}
