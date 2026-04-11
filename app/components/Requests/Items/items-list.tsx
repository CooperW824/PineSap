"use client";

import { ItemData } from "@/lib/server/DatabaseModels/request";
import { useEffect, useState } from "react";
import PaginationControls from "../../pagination-controls";
import ItemCard from "./item-card";

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
	const [currentPage, setCurrentPage] = useState(1);
	const [itemCount, setItemCount] = useState(totalItemCount);
	const itemsPerPage = 10;

	useEffect(() => {
		const fetchItems = async () => {
			const resp = await fetch(
				`/api/request/items/?id=${requestId}&page=${currentPage}&limit=${itemsPerPage}`,
			);
			if (resp.ok) {
				const data = await resp.json();
				setRequestItems(data.items);
			} else {
				setError("Failed to fetch request items");
			}
		};

		fetchItems();
	}, [requestId, currentPage]);

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

	const handleAddItem = async () => {
		const resp = await fetch(`/api/request/items/?id=${requestId}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (resp.ok) {
			const data = await resp.json();
			const newItem = data.item;
			setRequestItems((prevItems) => [...prevItems, newItem]);
			setItemCount((prevCount) => prevCount + 1);
		}
	};

	return (
		<div>
			{error && <p className="text-red-500">{error}</p>}
			<button className="btn btn-secondary mb-4" onClick={handleAddItem}>
				Add New Item to Request
			</button>
			<ul className="divide-y divide-gray-200">
				{requestItems.map((item) => (
					<ItemCard key={item.id} item={item} requestId={requestId} />
				))}
			</ul>
			<PaginationControls
				currentPage={currentPage}
				totalPages={Math.ceil(itemCount / itemsPerPage)}
				onPageChange={onPageChange}
			/>
		</div>
	);
}
