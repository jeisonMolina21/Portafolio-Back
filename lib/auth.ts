import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || process.env.JWT_SECRETO || 'fallback-secret-for-dev';

export interface UserToken {
  userId: number;
  username: string;
}

/**
 * Generates a JWT for the user.
 */
export const signToken = (payload: UserToken): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
};

/**
 * Verifies the JWT from the request headers.
 */
export const verifyToken = (token: string): UserToken | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as UserToken;
  } catch (error) {
    return null;
  }
};

/**
 * Helper to get user from request headers (Authorization: Bearer <token>)
 */
export const getAuthUser = (req: NextRequest): UserToken | null => {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  
  const token = authHeader.split(' ')[1];
  return verifyToken(token);
};

