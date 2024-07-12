import express from 'express';
import { prisma } from '../index'

const router = express.Router();

router.get('/', async (_req, res) => {
    const auctions = await prisma.auction.findMany();

    res.json(auctions)
});

router.post('/', async (req, res) => {
    const {
        title,
        description,
        startingPrice,
        endTime,
    } = req.body;
    const date = new Date(Date.now());
    const auction = await prisma.auction.create({
        data: {
            title,
            description,
            startingPrice,
            currentPrice: startingPrice,
            endTime: new Date(endTime),
            createdAt: date,
            updatedAt: date
        }
    });

    res.json(auction);
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const auction = await prisma.auction.update({
        where: { id: Number(id) },
        data: req.body
    });

    res.json(auction)
})

export default router;