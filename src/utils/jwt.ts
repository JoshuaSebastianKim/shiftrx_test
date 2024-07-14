import 'dotenv/config';
import jwt from 'jsonwebtoken';
import type { User } from '@prisma/client';

const SECRET = process.env.JWT_SECRET || 'secret';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_secret';

type JWTPayload = {
  id: string;
  email: string;
};

const generateAccessToken = (payload: JWTPayload) => jwt.sign(payload, SECRET, { expiresIn: '1h', algorithm: 'HS256' });
const generateRefreshToken = (payload: JWTPayload, jwtId: String) =>
  jwt.sign({ ...payload, jwtId }, REFRESH_SECRET, { expiresIn: '8h' });
const generateTokens = (payload: JWTPayload, jwtId: String) => {
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload, jwtId);

  return {
    accessToken,
    refreshToken,
  };
};
const verifyToken = (token: string) => jwt.verify(token, SECRET) as User & { jwtId: string };
const verifyRefreshToken = (token: string) => jwt.verify(token, REFRESH_SECRET) as User & { jwtId: string };

export default {
  generateAccessToken,
  generateRefreshToken,
  generateTokens,
  verifyToken,
  verifyRefreshToken,
};
