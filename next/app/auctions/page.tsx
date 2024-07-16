import Link from 'next/link';
import { getAuctions } from '@/app/lib/auction';
import formatter from '@/app/lib/price';
import { getUserProfile } from '@/app/lib/user';

export default async function Auctions() {
  const [user, auctions] = await Promise.all([getUserProfile(), getAuctions()]);

  return (
    <div>
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Auctions
          </h2>
        </div>
        <div className="mt-5 flex lg:ml-4 lg:mt-0">
          {user && (
            <Link
              href="/create-auction"
              type="button"
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Create Auction
            </Link>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl">
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {auctions?.map((auction) => (
            <div key={auction.id} className="group relative">
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <Link href={`/auctions/${auction.id}`}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {auction.title}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{auction.description}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{formatter.format(Number(auction.currentPrice))}</p>
                  <p className="mt-1 text-sm font-sm text-gray-500 line-through">
                    {formatter.format(Number(auction.startingPrice))}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
