import { auth } from "@/lib/server/auth";
import { Authorizer } from "@/lib/server/authorization/authorization";
import { PersistedProject } from "@/lib/server/DatabaseModels/project";
import { PersistedRequest } from "@/lib/server/DatabaseModels/request";
import { PersistedUser } from "@/lib/server/DatabaseModels/user";
import { headers } from "next/headers";

export async function PATCH(request: Request) {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session) {
		return new Response(JSON.stringify({ error: "Unauthorized" }), {
			status: 401,
		});
	}

	const user = await PersistedUser.getById(session.user.id);
	const authorizer = new Authorizer(user!);
	const requestId = new URLSearchParams(new URL(request.url).searchParams).get("id");

	if (!requestId) {
		return new Response(JSON.stringify({ error: "Request ID is required in query parameters" }), {
			status: 400,
		});
	}

	const existingRequest = await PersistedRequest.getById(requestId);
	if (!existingRequest) {
		return new Response(JSON.stringify({ error: "Request not found" }), {
			status: 404,
		});
	}

	const approval = (await request.json()).approval as Boolean | undefined;

	if (approval === undefined) {
		return new Response(
			JSON.stringify({ error: "Approval decision (approve or deny) is required in request body" }),
			{
				status: 400,
			},
		);
	}

	const requestProjectId = existingRequest.projectId;
	const requestProject = await PersistedProject.getById(requestProjectId || "");

	if (!requestProject) {
		return new Response(
			JSON.stringify({ error: "The Request is not associated with a valid project" }),
			{
				status: 404,
			},
		);
	}

	const projectApprovers = await requestProject.listApprovers();
	const projectApproverEmails = projectApprovers.map((approver) => approver.email);

	if (!authorizer.requests().canReview(projectApproverEmails)) {
		return new Response(JSON.stringify({ error: "Forbidden" }), {
			status: 403,
		});
	}

	if (approval) {
		existingRequest.approve();
	} else {
		existingRequest.deny();
	}

	return new Response(
		JSON.stringify({
			request: {
				id: existingRequest.id,
				status: existingRequest.status,
			},
		}),
		{
			status: 200,
		},
	);
}
