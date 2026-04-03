"use client";

import { useEffect, useState } from "react";

import { ItemData } from "@/lib/server/database/request";

export default function ItemCard({ item }: { item: ItemData }) {
	const [error, setError] = useState<string | null>(null);
	const [editedItem, setEditedItem] = useState<ItemData>(item);

	const updateItem = async () => {
		const resp = await fetch(`/api/request/items/?id=${item.id}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(editedItem),
		});

		if (!resp.ok) {
			setError("Failed to update item");
		}
	};

	return (
		<li className=" flex items-center justify-between w-full bg-base-200 p-4 rounded-md mb-2 ">
			<div className="flex items-center w-full">
				<div className="w-full flex items-start justify-between">
					<div className="w-1/3">
						<label className="block text-sm font-medium">Item Name</label>
						<input
							type="text"
							value={editedItem.name}
							onChange={(e) => setEditedItem({ ...editedItem, name: e.target.value })}
							onBlur={updateItem}
							className="input input-bordered w-full"
						/>
						<label className="block text-sm font-medium mt-2">Description</label>
						<textarea
							value={editedItem.description || ""}
							onChange={(e) => setEditedItem({ ...editedItem, description: e.target.value })}
							onBlur={updateItem}
							className="textarea textarea-bordered w-full mt-2"
						/>
					</div>

					<div className="w-1/3 flex flex-col items-end">
						<label className="block text-sm font-medium  mt-2">Item Price</label>
						<input
							type="number"
							value={editedItem.price}
							onChange={(e) => setEditedItem({ ...editedItem, price: Number(e.target.value) })}
							onBlur={updateItem}
							className="input input-bordered w-full mt-2"
						/>
						<label className="block text-sm font-medium  mt-2">Item Quantity</label>
						<input
							type="number"
							value={editedItem.quantity}
							onChange={(e) => setEditedItem({ ...editedItem, quantity: Number(e.target.value) })}
							onBlur={updateItem}
							className="input input-bordered w-full mt-2"
						/>
					</div>

					{error && <p className="text-red-500">{error}</p>}
				</div>
			</div>
		</li>
	);
}
