"use client";

import { useState } from "react";
import { type InventoryItem } from "@/lib/server/inventory/items";

import ItemBox from "./item-box";
import PaginationControls from "./pagination-controls";

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
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </>
  );
}
