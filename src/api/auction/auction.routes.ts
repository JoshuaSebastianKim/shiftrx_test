import rescue from 'express-rescue';
import { Router } from 'express';
import { createAuction, deleteAuction, getAuctionById, getAuctions, updateAuction } from './auction.services';
import { Auction } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

const router = Router();

router.get('/', rescue(async (_req, res) => {
    const auctions = await getAuctions();

    res.json(auctions)
}));

router.post('/', rescue(async (req, res) => {
    const {
        title,
        description,
        startingPrice,
        endTime,
    } = req.body;
    const { id } = res.locals.payload;

    const auction = await createAuction(id, { title, description, startingPrice, endTime } as Auction)

    res.json(auction);
}));

router.get('/:id', rescue(async (req, res, next) => {
    const { id } = req.params;

    const auction = await getAuctionById(id);

    if (!auction) {
        return next({
            status: StatusCodes.UNAUTHORIZED,
            message: 'Auction not found.'
        });
    }

    res.json(auction);
}))

router.put('/:id', rescue(async (req, res) => {
    const { id } = req.params;
    const { id: userId } = res.locals.payload;
    const { title, description, endTime } = req.body;

    const auction = await updateAuction(id, userId, { title, description, endTime } as Auction)

    res.json(auction);
}));

router.delete('/:id', rescue(async (req, res) => {
    const { id } = req.params;
    const { id: userId } = res.locals.payload;

    await deleteAuction(id, userId);

    res.json({
        message: 'Auction Deleted.'
    })
}));

export default router;