import prisma from "../prisma"; //fixed the import, was wrong
import { DatabaseObject } from "./database-object";
import { ItemData } from "./item";
import { RequestStatus } from "@/generated/prisma/client";

export type RequestData = {
	id: string;
	name: string;
	purpose: string | null;
	status: RequestStatus;
	ownerId: string;
	totalCost: number;
};

interface Request {
	get id(): string;
	get name(): string;
	get purpose(): string | null;
	get status(): RequestStatus;
	get ownerId(): string;
	get totalCost(): number;

	getItems(pageNumber: number, itemsPerPage: number): Promise<ItemData[]>;
	countItems(): Promise<number>;
	addItem(data: ItemData): Promise<ItemData>;
	removeItem(itemId: string): Promise<void>;
	approve(): Promise<void>;
	deny(): Promise<void>;

	set name(newName: string);
	set purpose(newPurpose: string | null);
	set status(newStatus: RequestStatus);
}

export class PersistedRequest extends DatabaseObject implements Request {
	private m_name: string;
	private m_purpose: string | null;
	private m_status: RequestStatus;
	private m_ownerId: string;
	private m_totalCost: number;

	/// PRIVATE constructor
	private constructor(data: RequestData) {
		super(data.id);
		this.m_name = data.name;
		this.m_purpose = data.purpose;
		this.m_status = data.status;
		this.m_ownerId = data.ownerId;
		this.m_totalCost = data.totalCost;
	}

	static async getById(requestId: string): Promise<PersistedRequest | null> {
		const request = await prisma.request.findUnique({
			where: { id: requestId },
		});

		if (!request) return null;

		return new PersistedRequest({
			id: request.id,
			name: request.name,
			purpose: request.purpose,
			status: request.status,
			ownerId: request.ownerId,
			totalCost: request.totalCost,
		});
	}

	/// Create EMPTY request
	static async create(ownerId: string): Promise<PersistedRequest> {
		const request = await prisma.request.create({
			data: {
				name: "", // placeholder
				purpose: "",
				ownerId,
			},
		});

		return new PersistedRequest({
			id: request.id,
			name: request.name,
			purpose: request.purpose,
			status: request.status,
			ownerId: request.ownerId,
			totalCost: request.totalCost,
		});
	}

	/// Get all items in this request
	async getItems(pageNumber: number, itemsPerPage: number): Promise<ItemData[]> {
		const items = await prisma.item.findMany({
			where: {
				requestId: this.id,
			},
			skip: (pageNumber - 1) * itemsPerPage,
			take: itemsPerPage,
		});

		return items.map((item) => ({
			id: item.id,
			name: item.name,
			price: item.price,
			quantity: item.stockQuantity,
			description: item.description,
			physicalLocation: item.physicalLocation,
		}));
	}

	async countItems(): Promise<number> {
		const count = await prisma.item.count({
			where: {
				requestId: this.id,
			},
		});
		return count;
	}

	// should this instead take in an item object and quantity?
	/// Add item to request
	async addItem({
		name,
		price,
		quantity,
		description,
		placeOfPurchase,
	}: Omit<ItemData, "id" | "physicalLocation">): Promise<ItemData> {
		const item = await prisma.item.create({
			data: {
				name,
				price,
				description,
				stockQuantity: quantity,
				placeOfPurchase,
			},
		});

		await prisma.request.update({
			where: { id: this.id },
			data: {
				requestItems: {
					connect: {
						id: item.id,
					},
				},
				totalCost: {
					increment: price * quantity,
				},
			},
		});

		this.m_totalCost += price * quantity;

		return {
			id: item.id,
			name: item.name,
			price: item.price,
			quantity: item.stockQuantity,
			description: item.description,
			physicalLocation: item.physicalLocation,
		};
	}

	async removeItem(itemId: string): Promise<void> {
		const item = await prisma.item.findUnique({
			where: { id: itemId },
		});

		if (!item) {
			throw new Error("Item not found");
		}

		await prisma.request.update({
			where: { id: this.id },
			data: {
				requestItems: {
					disconnect: {
						id: itemId,
					},
				},
				totalCost: {
					decrement: item.price * item.stockQuantity,
				},
			},
		});

		this.m_totalCost -= item.price * item.stockQuantity;

		await prisma.item.delete({
			where: {
				id: itemId,
			},
		});
	}

	get id(): string {
		return this.object_id;
	}

	get name(): string {
		return this.m_name;
	}

	get purpose(): string | null {
		return this.m_purpose;
	}

	get status(): RequestStatus {
		return this.m_status;
	}

	get ownerId(): string {
		return this.m_ownerId;
	}

	get totalCost(): number {
		return this.m_totalCost;
	}

	set name(newName: string) {
		this.m_name = newName;
	}

	set purpose(newPurpose: string | null) {
		this.m_purpose = newPurpose;
	}

	set status(newStatus: RequestStatus) {
		this.m_status = newStatus;
	}

	set totalCost(newTotalCost: number) {
		this.m_totalCost = newTotalCost;
	}

	async save(): Promise<void> {
		await prisma.request.update({
			where: { id: this.id },
			data: {
				name: this.m_name,
				purpose: this.m_purpose,
				status: this.m_status,
				totalCost: this.m_totalCost,
			},
		});
	}

	async delete(): Promise<void> {
		await prisma.request.delete({
			where: { id: this.id },
		});
	}

	static async count(): Promise<number> {
		const count = await prisma.request.count();
		return count;
	}

	static async list(pageSize: number, pageNumber: number): Promise<RequestData[]> {
		const requests = await prisma.request.findMany({
			skip: (pageNumber - 1) * pageSize,
			take: pageSize,
			orderBy: { createdAt: "desc" },
		});

		return requests.map((request) => ({
			id: request.id,
			name: request.name,
			purpose: request.purpose,
			status: request.status,
			ownerId: request.ownerId,
			totalCost: request.totalCost,
		}));
	}

	async approve(): Promise<void> {
		this.status = "APPROVED";
		await prisma.item.updateMany({
			where: {
				requestId: this.id,
			},
			data: {
				status: "AWAITING_PURCHASE",
			},
		});
		await this.save();
	}

	async deny(): Promise<void> {
		this.status = "DENIED";
		await prisma.item.updateMany({
			where: {
				requestId: this.id,
			},
			data: {
				status: "DENIED",
			},
		});
		await this.save();
	}
}
