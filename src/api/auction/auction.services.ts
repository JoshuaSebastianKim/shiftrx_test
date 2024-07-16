import { prisma } from '@/lib/prisma';
import type { Auction } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

export const getAuctions = () => prisma.auction.findMany();

export const getAuctionById = (id: string) =>
  prisma.auction.findUnique({
    where: {
      id: Number(id),
    },
  });

export const getAuctionByUser = (userId: string) =>
  prisma.auction.findMany({
    where: {
      userId,
    },
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
      userId,
    },
  });
};

export const updateAuction = async (id: string, userId: string, { title, description, endTime }: Auction) => {
  const auction = await prisma.auction.update({
    where: { id: Number(id), userId },
    data: { title, description, endTime },
  });

  return auction;
};

export const deleteAuction = (id: string, userId: string) =>
  prisma.auction.delete({
    where: {
      id: Number(id),
      userId,
    },
  });

export const createBid = async (auctionId: string, userId: string, amount: number) =>
  prisma.$transaction(async (tx) => {
    const auction = await tx.auction.findUnique({
      where: {
        id: Number(auctionId),
      },
    });

    if (!auction) {
      throw { status: StatusCodes.NOT_FOUND, message: 'Auction not found.' };
    }

    if (Number(auction.currentPrice) >= amount) {
      throw { status: StatusCodes.BAD_REQUEST, message: 'Auction current price is greater than submitted amount.' };
    }

    // Update current price to new amount
    await tx.auction.update({
      where: { id: Number(auctionId) },
      data: { currentPrice: amount },
    });

    const date = new Date(Date.now());

    return prisma.bid.create({
      data: {
        auctionId: Number(auctionId),
        userId,
        amount,
        createdAt: date,
      },
    });
  });

export const getBids = (auctionId: string) =>
  prisma.bid.findMany({
    where: {
      auctionId: Number(auctionId),
    },
    orderBy: [
      {
        amount: 'desc',
      },
    ],
  });

export const getBidsByUser = (userId: string) =>
  prisma.bid.findMany({
    where: {
      userId,
    },
  });
