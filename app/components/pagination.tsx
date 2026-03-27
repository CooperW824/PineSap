"use client";

import { useState } from "react";
import { type InventoryItem } from "@/lib/server/inventory/items";

import ItemBox from "./item-box";

type PaginationProps = {
  items: InventoryItem[];
  itemsPerPage?: number;
};

export default function Pagination({
  items,
  itemsPerPage = 10,
}: PaginationProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const paginatedItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (items.length === 0) {
    return (
      <p className="rounded-box border border-base-300 bg-base-200 p-4 text-sm opacity-70">
        No inventory items to display.
      </p>
    );
  }

  return (
    <>
      <div className="grid gap-4 w-full">
        {paginatedItems.map((item) => (
          <ItemBox key={item.id} item={item} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8 w-full">
          <div className="join shadow-sm">
            <button
              className="join-item btn"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
            >
              «
            </button>
            <button className="join-item btn no-animation pointer-events-none bg-base-200 hover:bg-base-200">
              Page {currentPage} of {totalPages}
            </button>
            <button
              className="join-item btn"
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              disabled={currentPage === totalPages}
            >
              »
            </button>
          </div>
        </div>
      )}
    </>
  );
}
