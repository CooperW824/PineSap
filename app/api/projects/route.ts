import { auth } from "@/lib/server/auth";
import { headers } from "next/headers";
import { PersistedUser } from "@/lib/server/DatabaseModels/user";
import { PersistedProject } from "@/lib/server/DatabaseModels/project";
import { Authorizer } from "@/lib/server/authorization/authorization";

export async function GET() {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session) {
		return Response.json({ error: "Unauthorized" }, { status: 401 });
	}

	const user = await PersistedUser.getById(session.user.id);
	const authorizer = new Authorizer(user!);

	if (!authorizer.users().canView()) {
		return Response.json({ error: "Forbidden" }, { status: 403 });
	}

	const projects = await PersistedProject.list(100, 1);

	const hydratedProjects = await Promise.all(
		projects.map(async (project) => {
			const persisted = await PersistedProject.getById(project.id);
			const approvers = await persisted!.listApprovers();

			return {
				...project,
				reviewers: approvers.map((u) => u.email),
			};
		}),
	);

	return Response.json({ projects: hydratedProjects });
}

export async function POST(request: Request) {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session) {
		return Response.json({ error: "Unauthorized" }, { status: 401 });
	}

	const user = await PersistedUser.getById(session.user.id);
	const authorizer = new Authorizer(user!);

	if (!authorizer.users().canCreate()) {
		return Response.json({ error: "Forbidden" }, { status: 403 });
	}

	const body = await request.json();

	if (!body.name) {
		return Response.json({ error: "Project name required" }, { status: 400 });
	}

	const project = await PersistedProject.create({
		name: body.name,
		budget: body.budget ?? 0,
	});

	return Response.json({
		project: {
			id: project.id,
			name: project.name,
			budget: project.budget,
			reviewers: [],
		},
	});
}

export async function PATCH(request: Request) {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session) {
		return Response.json({ error: "Unauthorized" }, { status: 401 });
	}

	const user = await PersistedUser.getById(session.user.id);
	const authorizer = new Authorizer(user!);

	if (!authorizer.users().canCreate()) {
		return Response.json({ error: "Forbidden" }, { status: 403 });
	}

	const body = await request.json();

	const project = await PersistedProject.getById(body.projectId);

	if (!project) {
		return Response.json({ error: "Project not found" }, { status: 404 });
	}

	const reviewer = await PersistedUser.getByEmail(body.email);

	if (!reviewer) {
		return Response.json({ error: "User not found" }, { status: 404 });
	}

	await project.addApprover(reviewer.id);

	const reviewers = await project.listApprovers();

	return Response.json({
		project: {
			id: project.id,
			name: project.name,
			budget: project.budget,
			reviewers: reviewers.map((u) => u.email),
		},
	});
	
}

export async function DELETE(request: Request) {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session) {
		return Response.json({ error: "Unauthorized" }, { status: 401 });
	}

	const user = await PersistedUser.getById(session.user.id);
	const authorizer = new Authorizer(user!);

	if (!authorizer.users().canCreate()) {
		return Response.json({ error: "Forbidden" }, { status: 403 });
	}

	const body = await request.json();

	const project = await PersistedProject.getById(body.projectId);

	if (!project) {
		return Response.json({ error: "Project not found" }, { status: 404 });
	}

	const reviewer = await PersistedUser.getByEmail(body.email);

	if (!reviewer) {
		return Response.json({ error: "User not found" }, { status: 404 });
	}

	await project.removeApprover(reviewer.id);

	const reviewers = await project.listApprovers();

	return Response.json({
		project: {
			id: project.id,
			name: project.name,
			budget: project.budget,
			reviewers: reviewers.map((u) => u.email),
		},
	});
}