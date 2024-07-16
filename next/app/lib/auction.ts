import { getSession } from './auth';
import axios from './axios';

export type Auction = {
  id: string;
  title: string;
  description: string;
  startingPrice: string;
  currentPrice: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
};

export type Bid = {
  id: string;
  auctionId: string;
  userId: string;
  amount: string;
  createdAt: string;
};

export const getAuctions = async (): Promise<Auction[]> => {
  const { data: auctions } = await axios.get('/api/auctions');

  return auctions;
};

export const getAuctionById = async (id: string): Promise<Auction> => {
  const { data: auction } = await axios.get(`/api/auctions/${id}`);

  return auction;
};

export const createAuction = async (formData: FormData): Promise<Auction> => {
  const session = await getSession();

  const title = formData.get('auction.title');
  const description = formData.get('auction.description');
  const startingPrice = formData.get('auction.startingPrice');
  const endTime = formData.get('auction.endTime');

  const { data } = await axios.post(
    '/api/auctions',
    {
      title,
      description,
      startingPrice,
      endTime: endTime && new Date(Date.parse(endTime as string)),
    },
    {
      headers: {
        Authorization: `Bearer ${session}`,
      },
    },
  );

  return data;
};

export const updateAuction = async (id: string, formData: FormData): Promise<Auction> => {
  const session = await getSession();

  const title = formData.get('auction.title');
  const description = formData.get('auction.description');
  const endTime = formData.get('auction.endTime');

  const { data } = await axios.put(
    `/api/auctions/${id}`,
    {
      title,
      description,
      endTime: endTime && new Date(Date.parse(endTime as string)),
    },
    {
      headers: {
        Authorization: `Bearer ${session}`,
      },
    },
  );

  return data;
};

export const createBid = async (auctionId: string, userId: string, formData: FormData): Promise<Bid[]> => {
  const session = await getSession();

  const amount = formData.get('auction.amount');

  const { data } = await axios.post(
    `/api/auctions/${auctionId}/bid`,
    {
      amount,
    },
    {
      headers: {
        Authorization: `Bearer ${session}`,
      },
    },
  );

  return data;
};

export const getBidsByAuction = async (auctionId: string): Promise<Bid[]> => {
  const { data: bids } = await axios.get(`/api/auctions/${auctionId}/bids`);

  return bids;
};
