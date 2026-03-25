"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Filter } from "lucide-react";
import { getInventoryItems } from "@/lib/server/inventory/items";

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

export default function Home() {
  const inventoryItems = getInventoryItems();
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(inventoryItems.length / ITEMS_PER_PAGE);

  const paginatedItems = inventoryItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <main className="min-h-screen w-full p-6 bg-base-100 text-base-content flex flex-col items-center">
      <div className="w-full max-w-4xl mb-8">
        <h1 className="text-3xl font-bold">Inventory</h1>
      </div>

      <div className="w-full max-w-4xl space-y-8">
        {/* PROJECT SELECTION UI */}
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

        {/* INVENTORY SECTION */}
        <section className="space-y-4 w-full">
          <h2 className="text-lg font-semibold">All Items</h2>

          {/* SEARCH & FILTER BAR */}
          <div className="flex w-full gap-2">
            {/* Search Input Wrapper */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search items..."
                // Added pr-10 to give the text room so it doesn't type under the icon
                className="input input-bordered w-full pr-10 bg-base-200" 
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 opacity-50" />
            </div>

            {/* Filter Button */}
            <button className="btn btn-square bg-base-200 border-base-content/20 hover:bg-base-300">
              <Filter className="h-5 w-5 opacity-70" />
            </button>
          </div>

          <div className="grid gap-4 w-full">
            {paginatedItems.map((item) => (
              <Link
                key={item.id}
                href={`/item-selection?itemId=${item.id}`}
                className="card bg-base-200 shadow w-full hover:bg-base-300 transition-colors cursor-pointer active:scale-[0.99] block"
              >
                <div className="card-body p-5">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex flex-col min-w-0 flex-1">
                      <h3 className="card-title text-[15px] m-0 leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-[13px] opacity-70 mt-1 m-0 leading-tight">
                        {truncateText(item.description, 82)}
                      </p>
                    </div>

                    <div className="flex flex-col text-right shrink-0">
                      <p className="font-semibold text-[15px] m-0 leading-tight">{item.location}</p>
                      <p className="text-[13px] opacity-70 mt-1 m-0 leading-tight">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* PAGINATION CONTROLS */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 w-full">
              <div className="join shadow-sm">
                <button 
                  className="join-item btn"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  «
                </button>
                <button className="join-item btn no-animation pointer-events-none bg-base-200 hover:bg-base-200">
                  Page {currentPage} of {totalPages}
                </button>
                <button 
                  className="join-item btn"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  »
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
