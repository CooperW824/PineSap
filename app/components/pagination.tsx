"use client";

import { useState } from "react";
import { type InventoryItem } from "@/lib/server/inventory/items";

import ItemBox from "./item-box";
import PaginationControls from "./pagination-controls";

type PaginationProps = {
  items: InventoryItem[];
  count: number;
  itemsPerPage?: number;
};

export default function Pagination({
  items,
  count,
  itemsPerPage = 10,
}: PaginationProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedItems, setPaginatedItems] = useState<InventoryItem[]>(items);
  const [paginatedCount, setPaginatedCount] = useState<number>(count);

  const totalPages = Math.ceil(paginatedCount / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetch(`/api/inventory?page=${newPage}&limit=${itemsPerPage}`)
      .then((res) => res.json())
      .then((data) => {
        setPaginatedItems(data.items);
        setPaginatedCount(data.count);
      })
      .catch((err) => {
        console.error("Failed to fetch inventory for page " + newPage, err);
      });
  };

  if (paginatedCount === 0) {
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
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </>
  );
}
