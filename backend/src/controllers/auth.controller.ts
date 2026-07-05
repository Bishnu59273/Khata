import bcrypt from 'bcryptjs';
import type { Request, Response } from 'express';
import { loginSchema, signupSchema } from '../schemas/auth.schema.js';
import * as shopsRepo from '../repositories/shops.repository.js';
import { AppError } from '../utils/AppError.js';
import { authUser as getAuthUser } from '../utils/params.js';
import { baseCookieOptions, COOKIE_NAME, signAuthToken } from '../middleware/auth.js';
import type { AuthResponse, AuthUser } from '../types/auth.js';

const PASSWORD_HASH_ROUNDS = 12;

function toAuthResponse(user: AuthUser): AuthResponse {
  return {
    user: { id: user.id, name: user.name, email: user.email },
    shop: { id: user.shopId, name: user.shopName },
  };
}

function setSessionCookie(res: Response, user: AuthUser) {
  const { token, maxAge } = signAuthToken(user);
  res.cookie(COOKIE_NAME, token, { ...baseCookieOptions(), maxAge });
}

export async function signup(req: Request, res: Response) {
  const input = signupSchema.parse(req.body);
  const email = input.email.trim().toLowerCase();

  const passwordHash = await bcrypt.hash(input.password, PASSWORD_HASH_ROUNDS);
  const { shop, user } = await shopsRepo.createShopWithOwner({
    shopName: input.shopName.trim(),
    name: input.name.trim(),
    email,
    passwordHash,
  });

  const authUser: AuthUser = {
    id: user.id,
    shopId: shop.id,
    shopName: shop.name,
    name: user.name,
    email: user.email,
  };

  setSessionCookie(res, authUser);
  res.status(201).json(toAuthResponse(authUser));
}

export async function login(req: Request, res: Response) {
  const input = loginSchema.parse(req.body);
  const email = input.email.trim().toLowerCase();

  const user = await shopsRepo.getUserByEmail(email);
  const invalidCredentials = () =>
    new AppError(401, 'Invalid email or password', 'INVALID_CREDENTIALS');

  if (!user) {
    // Run a dummy hash comparison so a nonexistent email doesn't respond
    // measurably faster than a wrong password, which would leak whether an
    // account exists via response timing.
    await bcrypt.compare(input.password, '$2a$12$invalidsaltinvalidsaltinvalidsaOa');
    throw invalidCredentials();
  }

  const passwordMatches = await bcrypt.compare(input.password, user.password_hash);
  if (!passwordMatches) throw invalidCredentials();

  const shop = await shopsRepo.getShopById(user.shop_id);
  if (!shop) throw new AppError(500, 'Shop not found for user');

  const authUser: AuthUser = {
    id: user.id,
    shopId: shop.id,
    shopName: shop.name,
    name: user.name,
    email: user.email,
  };

  setSessionCookie(res, authUser);
  res.json(toAuthResponse(authUser));
}

export async function logout(_req: Request, res: Response) {
  res.clearCookie(COOKIE_NAME, baseCookieOptions());
  res.json({ message: 'Logged out' });
}

export async function me(req: Request, res: Response) {
  res.json(toAuthResponse(getAuthUser(req)));
}
