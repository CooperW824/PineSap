"use client";

import { ItemData } from "@/lib/server/DatabaseModels/item";

export default function ItemCard({ item }: { item: ItemData }) {
	return (
		<li className=" flex items-center justify-between w-full bg-base-200 p-4 rounded-md mb-2 ">
			<div className="flex items-center w-full">
				<div className="w-full flex items-start justify-between">
					<div className="w-1/3">
						<label className="block text-sm font-medium">Item Name</label>
						<p className="text-lg font-bold">{item.name}</p>
						<label className="block text-sm font-medium mt-2">Description</label>
						<p className="text-base text-wrap">{item.description}</p>
						<label className="block text-sm font-medium mt-2">Vendor</label>
						<p className="text-lg font-bold">{item.placeOfPurchase}</p>
					</div>

					<div className="w-1/3 flex flex-col items-end">
						<label className="block text-sm font-medium  mt-2">Item Price</label>
						<p className="text-lg font-bold">${item.price.toFixed(2)}</p>
						<label className="block text-sm font-medium  mt-2">Item Quantity</label>
						<p className="text-lg font-bold">{item.quantity}</p>
					</div>
				</div>
			</div>
		</li>
	);
}
