import { Router } from 'express';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { StatusCodes } from 'http-status-codes';
import rescue from 'express-rescue';
import jwt from '@/utils/jwt';
import { hashToken } from '@/utils/hashToken';
import { createUserByEmailAndPassword, findUserByEmail, findUserById } from '@/api/users/user.services';
import { addRefreshTokenToWhitelist, deleteRefreshToken, findRefreshTokenById } from '@/api/auth/auth.services';
import Joi from 'joi';

const router = Router();

const schema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
});

router.post(
  '/sign-up',
  rescue(async (req, res, next) => {
    const { email, password } = req.body;

    try {
      await schema.validateAsync({ email, password });
    } catch (error) {
      return next({
        status: StatusCodes.BAD_REQUEST,
        message: error,
      });
    }

    if (!email || !password) {
      return next({
        status: StatusCodes.BAD_REQUEST,
        message: 'Some required fields are missing',
      });
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return next({
        status: StatusCodes.BAD_REQUEST,
        message: 'Email already in use.',
      });
    }

    const user = await createUserByEmailAndPassword({ email, password });
    const jwtId = uuidv4();
    const { accessToken, refreshToken } = jwt.generateTokens(user, jwtId);

    await addRefreshTokenToWhitelist({ jwtId, refreshToken, userId: user.id });

    res.cookie('access_token', accessToken, {
      maxAge: 60 * 60 * 24,
    });

    res.json({
      accessToken,
      refreshToken,
    });
  }),
);

router.post(
  '/login',
  rescue(async (req, res, next) => {
    const { email, password } = req.body;

    try {
      await schema.validateAsync({ email, password });
    } catch (error) {
      return next({
        status: StatusCodes.BAD_REQUEST,
        message: error,
      });
    }

    if (!email || !password) {
      return next({
        status: StatusCodes.BAD_REQUEST,
        message: 'Some required fields are missing',
      });
    }

    const existingUser = await findUserByEmail(email);

    if (!existingUser) {
      return next({
        status: StatusCodes.FORBIDDEN,
        message: 'Invalid login credentials.',
      });
    }

    const validPassword = await bcrypt.compare(password, existingUser.password);

    if (!validPassword) {
      return next({
        status: StatusCodes.FORBIDDEN,
        message: 'Invalid login credentials.',
      });
    }

    const jwtId = uuidv4();
    const { accessToken, refreshToken } = jwt.generateTokens(existingUser, jwtId);
    await addRefreshTokenToWhitelist({ jwtId, refreshToken, userId: existingUser.id });

    res.cookie('access_token', accessToken, {
      maxAge: 60 * 60 * 24,
    });

    res.json({
      accessToken,
      refreshToken,
    });
  }),
);

router.post(
  '/refresh-token',
  rescue(async (req, res, next) => {
    const { refresh_token: refreshToken } = req.body;

    if (!refreshToken) {
      return next({
        status: StatusCodes.BAD_REQUEST,
        message: 'Missing refresh token.',
      });
    }

    const payload = jwt.verifyRefreshToken(refreshToken);
    const savedRefreshToken = await findRefreshTokenById(payload.jwtId);

    if (!savedRefreshToken || savedRefreshToken.revoked === true) {
      return next({
        status: StatusCodes.UNAUTHORIZED,
        message: 'Unauthorized',
      });
    }

    const hashedToken = hashToken(refreshToken);

    if (hashedToken !== savedRefreshToken.hashedToken) {
      return next({
        status: StatusCodes.UNAUTHORIZED,
        message: 'Unauthorized',
      });
    }

    const user = await findUserById(payload.id);

    if (!user) {
      return next({
        status: StatusCodes.UNAUTHORIZED,
        message: 'Unauthorized',
      });
    }

    await deleteRefreshToken(savedRefreshToken.id);
    const jwtId = uuidv4();
    const { accessToken, refreshToken: newRefreshToken } = jwt.generateTokens(user, jwtId);
    await addRefreshTokenToWhitelist({ jwtId, refreshToken: newRefreshToken, userId: user.id });

    res.cookie('access_token', accessToken, {
      maxAge: 60 * 60 * 24,
    });

    res.json({
      accessToken,
      refreshToken: newRefreshToken,
    });
  }),
);

export default router;
