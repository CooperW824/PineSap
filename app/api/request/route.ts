import { auth } from "@/lib/server/auth";
import { Authorizer } from "@/lib/server/authorization/authorization";
import { PersistedUser } from "@/lib/server/DatabaseModels/user";
import { Request as PersistedRequest } from "@/lib/server/DatabaseModels/request";
import { headers } from "next/headers";

export async function POST(request: Request) {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session) {
		return new Response(JSON.stringify({ error: "Unauthorized" }), {
			status: 401,
		});
	}

	const user = await PersistedUser.getById(session.user.id);
	const authorizer = new Authorizer(user!);

	if (!authorizer.requests().canSubmit()) {
		return new Response(JSON.stringify({ error: "Forbidden" }), {
			status: 403,
		});
	}

	// This creates an empty request with just the user as the owner, we can update it later with the rest of the details. This is done to simplify the authorization logic, since we need to have a request object to check if the user can submit it or not.
	const newRequest = await PersistedRequest.create(user?.id!);

	return new Response(
		JSON.stringify({
			request: {
				id: newRequest.getId(),
				name: newRequest.getName(),
				purpose: newRequest.getPurpose(),
				status: newRequest.getStatus(),
			},
		}),
		{ status: 201 },
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
	const requestId = new URLSearchParams(new URL(request.url).searchParams).get("id");

	if (!requestId) {
		return new Response(JSON.stringify({ error: "Request ID is required in query parameters" }), {
			status: 400,
		});
	}

	const existingRequest = await PersistedRequest.fromId(requestId);

	if (!existingRequest) {
		return new Response(JSON.stringify({ error: "Request not found" }), {
			status: 404,
		});
	}

	const requestOwner = await PersistedUser.getById(
		(await PersistedRequest.fromId(requestId))?.getOwnerId() || "",
	);

	if (!authorizer.requests().canEdit(requestOwner!)) {
		return new Response(JSON.stringify({ error: "Forbidden" }), {
			status: 403,
		});
	}

	const requestData = await request.json();

	if (requestData.name) {
		await existingRequest.setName(requestData.name);
	}

	if (requestData.purpose) {
		await existingRequest.setPurpose(requestData.purpose);
	}

	if (requestData.status) {
		await existingRequest.setStatus(requestData.status);
	}

	return new Response(
		JSON.stringify({
			request: {
				id: existingRequest.getId(),
				name: existingRequest.getName(),
				purpose: existingRequest.getPurpose(),
				status: existingRequest.getStatus(),
			},
		}),
		{ status: 200 },
	);
}
