"use client";

import { ItemData } from "@/lib/server/DatabaseModels/item";
import { useState } from "react";
import PaginationControls from "../../pagination-controls";
import StaticItemCard from "./static-item-card";

export default function RequestItemsList({
	requestId,
	items,
	totalItemCount,
}: {
	requestId: string;
	items: ItemData[];
	totalItemCount: number;
}) {
	const [requestItems, setRequestItems] = useState<ItemData[]>(items);
	const [error, setError] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(totalItemCount > 0 ? 1 : 0);
	const [itemCount] = useState(totalItemCount);
	const itemsPerPage = 10;

	const onPageChange = async (newPage: number) => {
		const resp = await fetch(
			`/api/request/items/?id=${requestId}&page=${currentPage}&limit=${itemsPerPage}`,
		);
		if (resp.ok) {
			const data = await resp.json();
			setRequestItems(data.items);
		} else {
			setError("Failed to fetch request items");
		}
		setCurrentPage(newPage);
	};

	return (
		<div>
			{error && <p className="text-red-500">{error}</p>}

			<ul className="flex flex-col items-start justify-start w-full">
				<div className="flex items-center justify-between mb-4 w-full">
					<h2 className="text-xl font-bold">Items</h2>
					<p className="text-sm opacity-70 border border-white rounded-full ml-2 px-3 py-1">
						{itemCount} {itemCount === 1 ? "item" : "items"}
					</p>
				</div>
				{requestItems.map((item) => (
					<StaticItemCard key={item.id} item={item} requestId={requestId} />
				))}
				<PaginationControls
					currentPage={currentPage}
					totalPages={Math.ceil(itemCount / itemsPerPage)}
					onPageChange={onPageChange}
				/>
			</ul>
		</div>
	);
}
