import { Router } from 'express';
import authRouter from './auth/auth.routes';
import userRouter from './users/user.routes';
import auctionRouter from './auction/auction.routes';

const router = Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/auctions', auctionRouter);

export default router;
