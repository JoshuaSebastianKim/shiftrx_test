import { Router } from 'express';
import rescue from 'express-rescue';
import type { User } from '@prisma/client';
import { findUserById } from '@/api/users/user.services';
import { getAuctionByUser, getBidsByUser } from '@/api/auction/auction.services';
import authMiddleware from '@/middlewares/auth';

const router = Router();

router.get(
  '/profile',
  authMiddleware,
  rescue(async (_req, res) => {
    const { id } = res.locals.payload;

    const user = (await findUserById(id)) as Partial<User>;
    delete user?.password;

    res.json(user);
  }),
);

router.get(
  '/dashboard',
  authMiddleware,
  rescue(async (_req, res) => {
    const { id } = res.locals.payload;

    const [auctions, bids] = await Promise.all([getAuctionByUser(id), getBidsByUser(id)]);

    res.json({
      auctions,
      bids,
    });
  }),
);

export default router;
