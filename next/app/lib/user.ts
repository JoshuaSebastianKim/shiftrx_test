import { getSession } from './auth';
import axios from './axios';
import type { Auction, Bid } from './auction';

export async function getUserProfile() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  const { data } = await axios.get('/api/user/profile', {
    headers: {
      Authorization: `Bearer ${session}`,
    },
  });

  return data;
}

export async function getDashboard(): Promise<{ auctions: Auction[]; bids: Bid[] } | null> {
  const session = await getSession();

  if (!session) {
    return null;
  }

  const { data } = await axios.get('/api/user/dashboard', {
    headers: {
      Authorization: `Bearer ${session}`,
    },
  });

  return data;
}
