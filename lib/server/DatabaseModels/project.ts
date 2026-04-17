import prisma from "../prisma";
import { DatabaseObject } from "./database-object";
import { RequestData } from "./request";
import { UserData } from "./user";

export type ProjectData = {
	id: string;
	name: string;
	budget: number;
	totalSpend: number;
};

export interface Project {
	get id(): string;
	get name(): string;
	get budget(): number;

	getRequests(pageNumber: number, pageSize: number): Promise<RequestData[]>;
	countRequests(): Promise<number>;
	getTotalSpentOnApprovedRequests(): Promise<number>;
	addRequest(requestId: string): Promise<void>;

	listApprovers(): Promise<UserData[]>;
	addApprover(userId: string): Promise<void>;
	removeApprover(userId: string): Promise<void>;

	set name(newName: string);
	set budget(newBudget: number);
}

export class PersistedProject extends DatabaseObject implements Project {
	private m_name: string;
	private m_budget: number;

	protected constructor(data: Omit<ProjectData, "totalSpend">) {
		super(data.id);
		this.m_name = data.name;
		this.m_budget = data.budget;
	}

	static async getById(projectId: string): Promise<PersistedProject | null> {
		const project = await prisma.project.findUnique({
			where: { id: projectId },
		});

		if (!project) return null;

		return new PersistedProject({
			id: project.id,
			name: project.name,
			budget: project.budget,
		});
	}

	static async create(
		data: Partial<Pick<ProjectData, "name" | "budget">> = {},
	): Promise<PersistedProject> {
		const project = await prisma.project.create({
			data: {
				name: data.name ?? "", // Default to empty string if name isnt there
				budget: data.budget ?? 0,
			},
		});

		return new PersistedProject({
			id: project.id,
			name: project.name,
			budget: project.budget,
		});
	}

	get id(): string {
		return this.object_id;
	}

	get name(): string {
		return this.m_name;
	}

	get budget(): number {
		return this.m_budget;
	}

	set name(newName: string) {
		this.m_name = newName;
	}

	set budget(newBudget: number) {
		this.m_budget = newBudget;
	}

	async getRequests(pageNumber: number, pageSize: number): Promise<RequestData[]> {
		const requests = await prisma.request.findMany({
			where: { projectId: this.id },
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

	async countRequests(): Promise<number> {
		return prisma.request.count({
			where: { projectId: this.id },
		});
	}

	async getTotalSpentOnApprovedRequests(): Promise<number> {
		const agg = await prisma.request.aggregate({
			where: {
				projectId: this.id,
				status: "APPROVED",
			},
			_sum: {
				totalCost: true,
			},
		});

		return agg._sum.totalCost ?? 0;
	}

	async addRequest(requestId: string): Promise<void> {
		await prisma.request.update({
			where: { id: requestId },
			data: { projectId: this.id },
		});
	}

	async listApprovers(): Promise<UserData[]> {
		const approvers = await prisma.user.findMany({
			where: {
				projectApprovals: {
					some: { id: this.id },
				},
			},
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
			},
			orderBy: { createdAt: "desc" },
		});

		return approvers;
	}

	async addApprover(userId: string): Promise<void> {
		await prisma.project.update({
			where: { id: this.id },
			data: {
				approvers: {
					connect: { id: userId },
				},
			},
		});
	}

	async removeApprover(userId: string): Promise<void> {
		await prisma.project.update({
			where: { id: this.id },
			data: {
				approvers: {
					disconnect: { id: userId },
				},
			},
		});
	}

	async save(): Promise<void> {
		await prisma.project.update({
			where: { id: this.id },
			data: {
				name: this.m_name,
				budget: this.m_budget,
			},
		});
	}

	async delete(): Promise<void> {
		await prisma.project.delete({
			where: { id: this.id },
		});
	}

	static async count(): Promise<number> {
		return prisma.project.count();
	}

	static async list(pageSize: number, pageNumber: number): Promise<ProjectData[]> {
		const projects = await prisma.project.findMany({
			skip: (pageNumber - 1) * pageSize,
			take: pageSize,
			orderBy: { createdAt: "desc" },
		});

		// TODO: This is really inefficient, we should optimize this with a single query if possible
		const totalSpend: number[] = await Promise.all(
			projects.map(async (project) => {
				return new PersistedProject({
					id: project.id,
					name: project.name,
					budget: project.budget,
				}).getTotalSpentOnApprovedRequests();
			}),
		);

		return projects.map((project, index) => ({
			id: project.id,
			name: project.name,
			budget: project.budget,
			totalSpend: totalSpend[index],
		}));
	}
}
