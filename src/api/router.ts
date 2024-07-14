import { Router } from 'express';
import authRouter from './auth/auth.routes';
import userRouter from './users/user.routes';
import authMiddleware from '../middlewares/auth';

const router = Router();

router.use('/auth', authRouter);
router.use('/user', authMiddleware, userRouter)

export default router;