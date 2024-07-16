import { redirect } from 'next/navigation';
import { getAuctionById, updateAuction } from '@/app/lib/auction';

export default async function EditAuction({ params }: { params: { id: string } }) {
  const auction = await getAuctionById(params.id);

  return (
    <form
      action={async (formData) => {
        'use server';

        await updateAuction(params.id, formData);

        redirect('/auctions');
      }}
    >
      <div className="space-y-12">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">Create Auction</h2>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 border-b border-gray-900/10 pb-12">
            <div className="sm:col-span-4">
              <label htmlFor="auction.title" className="block text-sm font-medium leading-6 text-gray-900">
                Title
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    id="auction.title"
                    name="auction.title"
                    type="text"
                    placeholder="Car"
                    autoComplete="username"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    defaultValue={auction.title}
                  />
                </div>
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="auction.description" className="block text-sm font-medium leading-6 text-gray-900">
                Description
              </label>
              <div className="mt-2">
                <textarea
                  id="auction.description"
                  name="auction.description"
                  rows={3}
                  className="block w-full rounded-md border-0 py-1.5 px-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  defaultValue={auction.description}
                />
              </div>
            </div>
          </div>

          <div>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="auction.endTime" className="block text-sm font-medium leading-6 text-gray-900">
                  End time
                </label>
                <div className="mt-2">
                  <input
                    id="auction.endTime"
                    name="auction.endTime"
                    type="date"
                    className="block w-full rounded-md border-0 py-1.5 pl-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    defaultValue={new Date(auction.endTime).toISOString().substring(0, 10)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Update
        </button>
      </div>
    </form>
  );
}
