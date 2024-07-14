import { prisma } from '@/lib/prisma';
import type { Auction } from "@prisma/client";

export const getAuctions = () => prisma.auction.findMany();

export const getAuctionById = (id: string) => prisma.auction.findUnique({
    where: {
        id: Number(id)
    }
});

export const createAuction = async (userId: string, { title, description, startingPrice, endTime }: Auction) => {
    const date = new Date(Date.now());

    return prisma.auction.create({
        data: {
            title,
            description,
            startingPrice,
            currentPrice: startingPrice,
            endTime: new Date(endTime),
            createdAt: date,
            userId
        }
    });
};

export const updateAuction = async (id: string, userId: string, { title, description, endTime }: Auction) => {
    const auction = await prisma.auction.update({
        where: { id: Number(id), userId },
        data: { title, description, endTime }
    });

    return auction;
};

export const deleteAuction = (id: string, userId: string) => prisma.auction.delete({
    where: {
        id: Number(id), userId
    }
})
