import { ItemStatus } from "@/generated/prisma/enums";
import prisma from "../prisma"; //fixed the import, was wrong
import { DatabaseObject } from "./database-object";

export type ItemData = {
	id: string;
	name: string;
	price: number;
	quantity: number;
	description?: string | null;
	physicalLocation?: string | null;
	placeOfPurchase?: string | null;
	status: ItemStatus;
};

export interface Item {
	get id(): string;
	get createdAt(): Date;
	get name(): string;
	get price(): number;
	get quantity(): number;
	get description(): string | null;
	get physicalLocation(): string | null;
	get placeOfPurchase(): string | null;
	get status(): ItemStatus;

	set name(newName: string);
	set price(newPrice: number);
	set quantity(newQuantity: number);
	set description(newDescription: string | null);
	set physicalLocation(newPhysicalLocation: string | null);
	set placeOfPurchase(newPlaceOfPurchase: string | null);
	set status(newStatus: ItemStatus);
}

// Class for items in the DB
export class PersistedItem extends DatabaseObject {
	// Local variables

	//added createdAt and placeOfPurchase to better match our app/item-selection/page.tsx
	m_createdAt: Date;
	m_name: string;
	m_price: number;
	m_quantity: number;
	m_description?: string;
	m_physicalLocation?: string;
	m_placeOfPurchase?: string;
	m_status: ItemStatus;

	/// Constructor
	protected constructor(data: ItemData & { createdAt: Date }) {
		super(data.id);
		this.m_createdAt = data.createdAt;
		this.m_name = data.name;
		this.m_price = data.price;
		this.m_quantity = data.quantity;
		this.m_description = data.description || undefined;
		this.m_physicalLocation = data.physicalLocation || undefined;
		this.m_placeOfPurchase = data.placeOfPurchase || undefined;
		this.m_status = data.status;
	}

	// do we delete this function now? since fromID does basically the same thing.
	/// Fetch from DB, returns null if the item doesn't exist
	static async getById(itemId: string): Promise<PersistedItem | null> {
		const item = await prisma.item.findUnique({
			where: { id: itemId },
		});

		if (!item) return null;

		return new PersistedItem({
			id: item.id,
			createdAt: item.createdAt,
			name: item.name,
			price: Number(item.price),
			quantity: item.stockQuantity, //change to stockQuantity to match scheme.prisma
			description: item.description ?? undefined,
			physicalLocation: item.physicalLocation ?? undefined,
			placeOfPurchase: item.placeOfPurchase ?? undefined,
			status: item.status,
		});
	}

	/// create item in DB function
	static async create(): Promise<PersistedItem> {
		const item = await prisma.item.create({
			data: {
				name: "", // placeholder
				price: 0, // placeholder
				status: "PENDING_APPROVAL", // default status for new items
			},
		});

		return new PersistedItem({ ...item, quantity: item.stockQuantity });
	}

	get id(): string {
		return this.object_id;
	}

	get createdAt(): Date {
		return this.m_createdAt;
	}

	get name(): string {
		return this.m_name;
	}

	get price(): number {
		return this.m_price;
	}

	get quantity(): number {
		return this.m_quantity;
	}

	get description(): string | null {
		return this.m_description ?? null;
	}

	get physicalLocation(): string | null {
		return this.m_physicalLocation ?? null;
	}

	get placeOfPurchase(): string | null {
		return this.m_placeOfPurchase ?? null;
	}

	set name(newName: string) {
		this.m_name = newName;
	}

	set price(newPrice: number) {
		this.m_price = newPrice;
	}

	set quantity(newQuantity: number) {
		this.m_quantity = newQuantity;
	}

	set description(newDescription: string | null) {
		this.m_description = newDescription ?? undefined;
	}

	set physicalLocation(newPhysicalLocation: string | null) {
		this.m_physicalLocation = newPhysicalLocation ?? undefined;
	}

	set placeOfPurchase(newPlaceOfPurchase: string | null) {
		this.m_placeOfPurchase = newPlaceOfPurchase ?? undefined;
	}

	get status(): ItemStatus {
		return this.m_status;
	}

	set status(newStatus: ItemStatus) {
		this.m_status = newStatus;
	}

	// special functions

	// -- INVENTORY FUNCTIONS --
	static async count(): Promise<number> {
		return prisma.item.count();
	}

	static async list(page_size: number, page_number: number): Promise<ItemData[]> {
		const items = await prisma.item.findMany({
			take: page_size,
			skip: (page_number - 1) * page_size,
			orderBy: { createdAt: "desc" },
		});

		return items.map((item) => ({
			id: item.id,
			name: item.name,
			price: item.price,
			quantity: item.stockQuantity,
			description: item.description ?? undefined,
			physicalLocation: item.physicalLocation ?? undefined,
			placeOfPurchase: item.placeOfPurchase ?? undefined,
			status: item.status,
		}));
	}

	async save(): Promise<void> {
		await prisma.item.update({
			where: { id: this.id },
			data: {
				name: this.m_name,
				price: this.m_price,
				stockQuantity: this.m_quantity,
				description: this.m_description,
				physicalLocation: this.m_physicalLocation,
				placeOfPurchase: this.m_placeOfPurchase,
			},
		});
	}

	async delete(): Promise<void> {
		await prisma.item.delete({
			where: { id: this.id },
		});
	}
}
