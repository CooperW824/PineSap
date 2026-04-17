import { auth } from "@/lib/server/auth";
import { Authorizer } from "@/lib/server/authorization/authorization";
import { PersistedProject } from "@/lib/server/DatabaseModels/project";
import { PersistedUser } from "@/lib/server/DatabaseModels/user";
import { headers } from "next/headers";

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
