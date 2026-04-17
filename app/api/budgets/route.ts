import { auth } from "@/lib/server/auth";
import { Authorizer } from "@/lib/server/authorization/authorization";
import { PersistedProject } from "@/lib/server/DatabaseModels/project";
import { PersistedUser } from "@/lib/server/DatabaseModels/user";
import { headers } from "next/headers";

/**
 * GET /api/budgets?limit=10&page=1
 *
 * Returns a list of projects with their budgets and total spend. Requires the user to have permission to view budgets.
 *
 * Query Parameters:
 * - limit: number of projects to return per page (default: 10)
 * - page: page number for pagination (default: 1)
 *
 * @param request The HTTPs Request
 * @returns {projects: {id: string, name: string, budget: number, totalSpend: number}[]} A list of projects with their budgets and total spend
 */
export async function GET(request: Request) {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session) {
		return new Response(JSON.stringify({ error: "Unauthorized" }), {
			status: 401,
		});
	}

	const user = await PersistedUser.getById(session.user.id);

	const authorizer = new Authorizer(user!);
	if (!authorizer.budget().canView()) {
		return new Response(JSON.stringify({ error: "Forbidden" }), {
			status: 403,
		});
	}

	const limit = Number(new URL(request.url).searchParams.get("limit") || "10");
	const page = Number(new URL(request.url).searchParams.get("page") || "1");

	const projects = await PersistedProject.list(limit, page);

	return new Response(
		JSON.stringify({
			projects: projects.map((project) => ({
				id: project.id,
				name: project.name,
				budget: project.budget,
				totalSpend: project.totalSpend,
			})),
		}),
		{ status: 200 },
	);
}

/**
 * PATCH /api/budgets?id=projectId
 *
 * Updates the budget for a specific project. Requires the user to have permission to update budgets.
 *
 * Query Parameters:
 * - id: the ID of the project to update
 *
 * Request Body:
 * - budget: the new budget for the project
 *
 * @param request The HTTPs Request
 * @returns {project: {id: string, name: string, budget: number, totalSpend: number}} The updated project with its new budget and total spend
 *
 * Note: This endpoint only updates the budget of the project. It does not update the total spend, as total spend is calculated based on approved requests and is not directly editable.
 */
export async function PATCH(request: Request) {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session) {
		return new Response(JSON.stringify({ error: "Unauthorized" }), {
			status: 401,
		});
	}

	const user = await PersistedUser.getById(session.user.id);
	const authorizer = new Authorizer(user!);

	if (!authorizer.budget().canUpdate()) {
		return new Response(JSON.stringify({ error: "Forbidden" }), {
			status: 403,
		});
	}

	const projectId = new URLSearchParams(new URL(request.url).searchParams).get("id");

	if (!projectId) {
		return new Response(JSON.stringify({ error: "Project ID is required in query parameters" }), {
			status: 400,
		});
	}

	const existingProject = await PersistedProject.getById(projectId);

	if (!existingProject) {
		return new Response(JSON.stringify({ error: "Project not found" }), {
			status: 404,
		});
	}

	const requestData = await request.json();

	if (requestData.budget !== undefined) {
		existingProject.budget = requestData.budget;
	}

	await existingProject.save();
	return new Response(
		JSON.stringify({
			project: {
				id: existingProject.id,
				name: existingProject.name,
				budget: existingProject.budget,
				totalSpend: existingProject.getTotalSpentOnApprovedRequests(),
			},
		}),
		{
			status: 200,
		},
	);
}
