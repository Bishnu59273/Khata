import type { CookieOptions, NextFunction, Request, Response } from 'express';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';
import type { AuthUser, JwtPayload } from '../types/auth.js';

export const COOKIE_NAME = 'khata_session';

const isProduction = process.env.NODE_ENV === 'production';

export function baseCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
    signed: true,
  };
}

export function signAuthToken(user: AuthUser): { token: string; maxAge: number } {
  const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
    sub: user.id,
    shopId: user.shopId,
    shopName: user.shopName,
    name: user.name,
    email: user.email,
  };
  const options: SignOptions = { expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'] };
  const token = jwt.sign(payload, env.JWT_SECRET, options);

  const decoded = jwt.decode(token) as JwtPayload;
  const maxAge = decoded.exp ? decoded.exp * 1000 - Date.now() : 0;

  return { token, maxAge };
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token = req.signedCookies?.[COOKIE_NAME];
  if (!token) {
    throw new AppError(401, 'Authentication required', 'UNAUTHENTICATED');
  }

  let payload: JwtPayload;
  try {
    payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
  } catch {
    throw new AppError(401, 'Invalid or expired session', 'UNAUTHENTICATED');
  }

  req.user = {
    id: payload.sub,
    shopId: payload.shopId,
    shopName: payload.shopName,
    name: payload.name,
    email: payload.email,
  };
  next();
}
