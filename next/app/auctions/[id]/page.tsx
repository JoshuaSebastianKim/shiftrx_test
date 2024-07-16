import { createBid, getAuctionById, getBidsByAuction } from '@/app/lib/auction';
import formatter from '@/app/lib/price';
import { getUserProfile } from '@/app/lib/user';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function Auction({ params }: { params: { id: string } }) {
  const [user, auction, bids] = await Promise.all([
    getUserProfile(),
    getAuctionById(params.id),
    getBidsByAuction(params.id),
  ]);

  return (
    <div>
      {user?.id === auction.userId && (
        <div className="flex justify-end">
          <Link
            href={`/edit-auction/${params.id}`}
            type="button"
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Edit Auction
          </Link>
        </div>
      )}

      <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
        <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{auction.title}</h1>
        </div>
        <div className="mt-4 lg:row-span-3 lg:mt-0">
          <p className="text-3xl tracking-tight text-gray-900">
            Current price: {formatter.format(Number(auction.currentPrice))}
          </p>
          <p className="mt-2 text-xl tracking-tight text-gray-500">
            Starting price: <span className="line-through">{formatter.format(Number(auction.startingPrice))}</span>
          </p>
        </div>
        <div className="py-5 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
          <div>
            <h3 className="sr-only">Description</h3>
            <div className="space-y-6">
              <p className="text-base text-gray-900">{auction.description}</p>
            </div>
          </div>

          <div className="mt-5">
            <div>
              <p className="text-xs text-gray-600">
                Created: {new Date(auction.createdAt).toLocaleDateString('en-GB')}
              </p>
              <p className="text-xs text-gray-600">
                End: {new Date(auction.endTime).toLocaleDateString('en-GB', { timeZone: 'Etc/GMT' })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <ul role="list" className="divide-y divide-gray-100">
        {bids.map((bid) => (
          <li key={bid.id} className="flex justify-between gap-x-6 py-5">
            <div className="text-sm font-semibold leading-6 text-gray-900">User id: {bid.userId}</div>
            <div className="text-sm leading-6 text-gray-900">Amount: {formatter.format(Number(bid.amount))}</div>
          </li>
        ))}
      </ul>

      {user && (
        <div>
          <form
            action={async (formData) => {
              'use server';

              await createBid(params.id, user.id, formData);

              redirect(`/auctions/${params.id}`);
            }}
          >
            <label htmlFor="auction.amount" className="block text-sm font-medium leading-6 text-gray-900">
              Bid
            </label>
            <div className="relative mt-2 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                id="auction.amount"
                name="auction.amount"
                type="text"
                placeholder="0.00"
                className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                <button
                  type="submit"
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Bid
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
