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
	projectId: string | null;
};

interface Request {
	get id(): string;
	get name(): string;
	get purpose(): string | null;
	get status(): RequestStatus;
	get ownerId(): string;
	get totalCost(): number;
	get projectId(): string | null;

	setProject(projectId: string | null): Promise<void>;
	removeFromProject(): Promise<void>;

	getItems(pageNumber: number, itemsPerPage: number): Promise<ItemData[]>;
	countItems(): Promise<number>;
	addItem(data: ItemData): Promise<ItemData>;
	removeItem(itemId: string): Promise<void>;
	approve(): Promise<void>;
	deny(): Promise<void>;

	set name(newName: string);
	set purpose(newPurpose: string | null);
	set totalCost(newTotalCost: number);
}

export class PersistedRequest extends DatabaseObject implements Request {
	private m_name: string;
	private m_purpose: string | null;
	private m_status: RequestStatus;
	private m_ownerId: string;
	private m_totalCost: number;
	private m_projectId: string | null;

	/// PRIVATE constructor
	private constructor(data: RequestData) {
		super(data.id);
		this.m_name = data.name;
		this.m_purpose = data.purpose;
		this.m_status = data.status;
		this.m_ownerId = data.ownerId;
		this.m_totalCost = data.totalCost;
		this.m_projectId = data.projectId;
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
			projectId: request.projectId,
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
			projectId: request.projectId,
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

	get projectId(): string | null {
		return this.m_projectId;
	}

	set name(newName: string) {
		this.m_name = newName;
	}

	set purpose(newPurpose: string | null) {
		this.m_purpose = newPurpose;
	}

	set totalCost(newTotalCost: number) {
		this.m_totalCost = newTotalCost;
	}

	async setProject(projectId: string | null): Promise<void> {
		this.m_projectId = projectId;
		await prisma.request.update({
			where: { id: this.id },
			data: {
				project: { connect: { id: projectId! } },
			},
		});
	}

	async removeFromProject(): Promise<void> {
		this.m_projectId = null;
		await prisma.request.update({
			where: { id: this.id },
			data: {
				project: { disconnect: true },
			},
		});
	}

	async save(): Promise<void> {
		await prisma.request.update({
			where: { id: this.id },
			data: {
				name: this.m_name,
				purpose: this.m_purpose,
				status: this.m_status,
				totalCost: this.m_totalCost,
				projectId: this.m_projectId,
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
			projectId: request.projectId,
		}));
	}

	async approve(): Promise<void> {
		this.m_status = "APPROVED";
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
		this.m_status = "DENIED";
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
