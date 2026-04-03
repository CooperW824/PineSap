import prisma from "../prisma"; //fixed the import, was wrong
import { Item } from "./item";
import { RequestStatus } from "@/generated/prisma/client";

//item definetion got getItems
// not sure if this is what you mean cooper
type ItemData = {
	id: string;
	name: string;
	price: number;
	quantity: number;
	description?: string | null;
	physicalLocation?: string | null;
};

export class Request {
	private id: string;
	private name: string;
	private purpose: string | null;
	private status: RequestStatus;
	private ownerId: string;

	/// PRIVATE constructor
	private constructor(data: {
		id: string;
		name: string;
		status: RequestStatus;
		purpose: string | null;
		ownerId: string;
	}) {
		this.id = data.id;
		this.name = data.name;
		this.purpose = data.purpose;
		this.status = data.status;
		this.ownerId = data.ownerId;
	}

	/// Fetch from DB by ID
	static async fromId(requestId: string): Promise<Request | null> {
		const request = await prisma.request.findUnique({
			where: { id: requestId },
		});

		if (!request) return null;

		return new Request({
			id: request.id,
			name: request.name,
			purpose: request.purpose,
			status: request.status,
			ownerId: request.ownerId,
		});
	}

	/// Create EMPTY request
	static async create(ownerId: string): Promise<Request> {
		const request = await prisma.request.create({
			data: {
				name: "", // placeholder
				purpose: "",
				ownerId,
			},
		});

		return new Request({
			id: request.id,
			name: request.name,
			purpose: request.purpose,
			status: request.status,
			ownerId: request.ownerId,
		});
	}

	/// Get all items in this request
	async getItems(): Promise<ItemData[]> {
		const requestItems = await prisma.requestItem.findMany({
			where: { requestId: this.id },
			include: {
				item: true,
			},
		});

		return requestItems.map(
			(ri: (typeof requestItems)[number]): ItemData => ({
				id: ri.item.id,
				name: ri.item.name,
				price: Number(ri.item.price),
				quantity: ri.quantity,
				description: ri.item.description,
				physicalLocation: ri.item.physicalLocation,
			}),
		);
	}

	// should this instead take in an item object and quantity?
	/// Add item to request
	async addItem(itemId: string, quantity: number, price: number): Promise<void> {
		await prisma.requestItem.create({
			data: {
				requestId: this.id,
				itemId,
				quantity,
				price,
			},
		});
	}

	// GETTERS
	getId(): string {
		return this.id;
	}

	getName(): string {
		return this.name;
	}

	getStatus(): string {
		return this.status;
	}
	getPurpose(): string | null {
		return this.purpose;
	}
	getOwnerId(): string {
		return this.ownerId;
	}

	// Compute total price dynamically from items
	async getTotalRequestPrice(): Promise<number> {
		const items = await this.getItems();
		return items.reduce((total, item) => total + item.price * item.quantity, 0);
	}

	// SETTERS
	async setName(newName: string): Promise<void> {
		await prisma.request.update({
			where: { id: this.id },
			data: { name: newName },
		});
		this.name = newName;
	}

	// didn't have this before, woops
	async setPurpose(newPurpose: string): Promise<void> {
		await prisma.request.update({
			where: { id: this.id },
			data: { purpose: newPurpose },
		});
		this.purpose = newPurpose;
	}

	async setStatus(newStatus: RequestStatus): Promise<void> {
		await prisma.request.update({
			where: { id: this.id },
			data: { status: newStatus },
		});
		this.status = newStatus;
	}

	// other methods
	async approve(): Promise<void> {
		await this.setStatus(RequestStatus.APPROVED);
	}

	async deny(): Promise<void> {
		await this.setStatus(RequestStatus.DENIED);
	}
}
