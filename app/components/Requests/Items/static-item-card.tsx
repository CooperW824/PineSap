"use client";

import { useEffect, useState } from "react";

import { ItemData } from "@/lib/server/DatabaseModels/item";

export default function ItemCard({ item, requestId }: { item: ItemData; requestId: string }) {
	return (
		<li className=" flex items-center justify-between w-full bg-base-200 p-4 rounded-md mb-2 ">
			<div className="flex items-center w-full">
				<div className="w-full flex items-start justify-between">
					<div className="w-1/3">
						<label className="block text-sm font-medium">Item Name</label>
						<p className="text-lg font-bold">{item.name}</p>
						<label className="block text-sm font-medium mt-2">Description</label>
						<textarea
							value={item.description || ""}
							readOnly
							className="textarea textarea-bordered w-full mt-2"
						/>
						<label className="block text-sm font-medium mt-2">Vendor</label>
						<p className="text-lg font-bold">{item.placeOfPurchase}</p>
					</div>

					<div className="w-1/3 flex flex-col items-end">
						<label className="block text-sm font-medium  mt-2">Item Price</label>
						<input
							type="number"
							value={item.price}
							readOnly
							className="input input-bordered w-full mt-2"
						/>
						<label className="block text-sm font-medium  mt-2">Item Quantity</label>
						<input
							type="number"
							value={item.quantity}
							readOnly
							className="input input-bordered w-full mt-2"
						/>
					</div>
				</div>
			</div>
		</li>
	);
}
