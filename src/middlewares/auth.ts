import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from '@/utils/jwt';

export default (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1] || req.cookies.access_token;

  if (!token)
    return next({
      status: StatusCodes.UNAUTHORIZED,
      message: 'No token provided',
    });

  try {
    const data = jwt.verifyToken(token);
    res.locals.payload = data;
    return next();
  } catch {
    return next({ status: StatusCodes.UNAUTHORIZED, message: 'Unauthorized' });
  }
};
