import rescue from 'express-rescue';
import { Router } from 'express';
import {
  createAuction,
  createBid,
  deleteAuction,
  getAuctionById,
  getAuctions,
  getBids,
  updateAuction,
} from '@/api/auction/auction.services';
import { Auction } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import authMiddleware from '@/middlewares/auth';

const router = Router();

router.get(
  '/',
  rescue(async (_req, res) => {
    const auctions = await getAuctions();

    res.json(auctions);
  }),
);

router.post(
  '/',
  authMiddleware,
  rescue(async (req, res) => {
    const { title, description, startingPrice, endTime } = req.body;
    const { id } = res.locals.payload;

    const auction = await createAuction(id, { title, description, startingPrice, endTime } as Auction);

    res.json(auction);
  }),
);

router.get(
  '/:id',
  rescue(async (req, res, next) => {
    const { id } = req.params;

    const auction = await getAuctionById(id);

    if (!auction) {
      return next({
        status: StatusCodes.UNAUTHORIZED,
        message: 'Auction not found.',
      });
    }

    res.json(auction);
  }),
);

router.put(
  '/:id',
  authMiddleware,
  rescue(async (req, res) => {
    const { id } = req.params;
    const { id: userId } = res.locals.payload;
    const { title, description, endTime } = req.body;

    const auction = await updateAuction(id, userId, { title, description, endTime } as Auction);

    res.json(auction);
  }),
);

router.delete(
  '/:id',
  authMiddleware,
  rescue(async (req, res) => {
    const { id } = req.params;
    const { id: userId } = res.locals.payload;

    await deleteAuction(id, userId);

    res.json({
      message: 'Auction Deleted.',
    });
  }),
);

router.post(
  '/:id/bid',
  authMiddleware,
  rescue(async (req, res) => {
    const { id: auctionId } = req.params;
    const { id: userId } = res.locals.payload;
    const { amount } = req.body;

    const bid = await createBid(auctionId, userId, amount);

    res.json(bid);
  }),
);

router.get(
  '/:id/bids',
  rescue(async (req, res) => {
    const { id: auctionId } = req.params;

    const bids = await getBids(auctionId);

    res.json(bids);
  }),
);

export default router;
