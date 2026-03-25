import { Filter, Search } from "lucide-react";

import Pagination from "./components/pagination";
import { type InventoryItem } from "./components/item-box";

export default function Home() {
  const mockItems: InventoryItem[] = Array.from({ length: 25 }).map((_, i) => ({
    id: i,
    title: `Item ${i + 1}`,
    description:
      i % 2 === 0
        ? "Short description"
      : "THIS IS A LONG ITEM DESCRIPTION I WANT TO TEST IF IT WILL WORK WITH A LOT OF TEXT SO THAT THE SPACING IS OKAHLAKSNH...askjdhaoksdhkasdhbakjhbdkasjhdkiajhd...",
    location: `Storage Unit ${Math.floor(i / 5) + 1}`,
    quantity: `${(i + 1) * 2}`,
  }));

  return (
    <main className="min-h-screen w-full p-6 bg-base-100 text-base-content flex flex-col items-center">
      <div className="w-full max-w-4xl mb-8">
        <h1 className="text-3xl font-bold">Inventory</h1>
      </div>

      <div className="w-full max-w-4xl space-y-8">
        <section className="flex flex-col gap-2">
          <label htmlFor="club-select" className="text-sm font-semibold opacity-70 ml-1">
            Project Name
          </label>
          <select
            id="club-select"
            className="select select-bordered w-full max-w-xs bg-base-200"
            defaultValue="Project A"
          >
            <option>Project A</option>
            <option>Project B</option>
            <option>Project C</option>
          </select>
        </section>

        <section className="space-y-4 w-full">
          <h2 className="text-lg font-semibold">All Items</h2>

          <div className="flex w-full gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search items..."
                className="input input-bordered w-full pr-10 bg-base-200"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 opacity-50" />
            </div>

            <button className="btn btn-square bg-base-200 border-base-content/20 hover:bg-base-300">
              <Filter className="h-5 w-5 opacity-70" />
            </button>
          </div>

          <Pagination items={mockItems} />
        </section>
      </div>
    </main>
  );
}
