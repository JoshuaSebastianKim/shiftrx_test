import { Router } from 'express';
import authRouter from '@/api/auth/auth.routes';
import userRouter from '@/api/users/user.routes';
import auctionRouter from '@/api/auction/auction.routes';

const router = Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/auctions', auctionRouter);

export default router;
