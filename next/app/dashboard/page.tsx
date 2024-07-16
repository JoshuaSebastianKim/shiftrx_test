import { redirect } from 'next/navigation';
import formatter from '../lib/price';
import { getDashboard } from '../lib/user';

export default async function Dashboard() {
  const dashboard = await getDashboard();

  if (!dashboard) {
    redirect('/');
  }

  return (
    <div>
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Dashboard
          </h2>
        </div>
      </div>
      <div className="mt-4 grid gap-6 grid-cols-2">
        <div>
          <div>Auctions</div>
          <ul role="list" className="divide-y divide-gray-100">
            {dashboard.auctions.map((auction) => (
              <li key={auction.id} className="flex justify-between gap-x-6 py-5">
                <div className="text-sm font-semibold leading-6 text-gray-900">{auction.title}</div>
                <div className="text-sm leading-6 text-gray-900">
                  Amount: {formatter.format(Number(auction.currentPrice))}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div>Bids</div>
          <ul role="list" className="divide-y divide-gray-100">
            {dashboard.bids.map((bid) => (
              <li key={bid.id} className="flex justify-between gap-x-6 py-5">
                <div className="text-sm font-semibold leading-6 text-gray-900">Auction id: {bid.auctionId}</div>
                <div className="text-sm leading-6 text-gray-900">Amount: {formatter.format(Number(bid.amount))}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
