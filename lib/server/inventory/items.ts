/* 
This file is where we will implement all of the information from the database
of an item. this file is where app/page.tsx and item-selection/page.tsx both pull their 
information from. This being here serves to make it easier to refactor for database
calls later.
*/
import { Item } from "../DatabaseModels/item";

export type InventoryItem = {
	id: string;
	createdAt: Date;
	name: string;
	description: string | null;
	physicalLocation: string | null;
	placeOfPurchase: string | null;
	price: number;
	stockQuantity: number;
};

export async function getInventoryItemCount(): Promise<number> {
	return Item.count();
}

// for displaying across home page
// show 10 items per page,
export async function getInventoryItems(
	page: number = 1,
	limit: number = 10,
): Promise<InventoryItem[]> {
	const items = await Item.list(limit, page);
	return items.map((item) => ({
		id: item.getId(),
		createdAt: item.getCreatedAt(),
		name: item.getName(),
		description: item.getDesc(),
		physicalLocation: item.getPhysicalLocation(),
		placeOfPurchase: item.getPlaceOfPurchase(),
		price: item.getPrice(),
		stockQuantity: item.getQuantity(),
	}));
}

//for item select screen
export async function getInventoryItemById(itemId: string): Promise<InventoryItem | undefined> {
	const item = await Item.fetchByID(itemId);
	if (!item) return undefined;
	return {
		id: item.getId(),
		createdAt: item.getCreatedAt(),
		name: item.getName(),
		description: item.getDesc(),
		physicalLocation: item.getPhysicalLocation(),
		placeOfPurchase: item.getPlaceOfPurchase(),
		price: item.getPrice(),
		stockQuantity: item.getQuantity(),
	};
}
