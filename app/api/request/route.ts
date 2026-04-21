import { auth } from "@/lib/server/auth";
import { Authorizer } from "@/lib/server/authorization/authorization";
import { PersistedUser } from "@/lib/server/DatabaseModels/user";
import { PersistedRequest } from "@/lib/server/DatabaseModels/request";
import { headers } from "next/headers";

/**
 * POST /api/request
 *
 * Creates a new request with default values. Requires the user to have permission to create requests.
 *
 * @param request The HTTP Request
 * @returns {request: {id: string, name: string, purpose: string | null, status: RequestStatus}} The details of the newly created request if successful, or an error message if not
 */
export async function POST() {
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
	const newRequest = await PersistedRequest.create(user!.id!);

	return new Response(
		JSON.stringify({
			request: {
				id: newRequest.id,
				name: newRequest.name,
				purpose: newRequest.purpose,
				status: newRequest.status,
			},
		}),
		{ status: 201 },
	);
}

/**
 * PATCH /api/request?id=requestId
 *
 * Updates the details of a request. Requires the user to have permission to edit requests.
 *
 * Query Parameters:
 * - id: the ID of the request to update
 *
 * Request Body:
 * - name: (optional) the new name of the request
 * - purpose: (optional) the new purpose of the request
 * - projectId: (optional) the ID of the project to associate with the request, or null to remove from project
 * - status: (optional) if set to "PENDING", will submit the request for approval
 *
 * @returns {request: RequestData} The updated request details if successful, or an error message if not
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

	const requestOwner = await PersistedUser.getById(
		(await PersistedRequest.getById(requestId))?.ownerId || "",
	);

	if (!authorizer.requests().canEdit(requestOwner!)) {
		return new Response(JSON.stringify({ error: "Forbidden" }), {
			status: 403,
		});
	}

	const requestData = await request.json();

	if (requestData.name) {
		existingRequest.name = requestData.name;
	}

	if (requestData.purpose) {
		existingRequest.purpose = requestData.purpose;
	}

	if (requestData.projectId) {
		if (requestData.projectId === "") {
			await existingRequest.removeFromProject();
		} else {
			if (existingRequest.projectId !== requestData.projectId) {
				await existingRequest.setProject(requestData.projectId);
			}
		}
	}

	if (requestData.status && requestData.status === "PENDING") {
		await existingRequest.submitForApproval();
	}

	await existingRequest.save();

	return new Response(
		JSON.stringify({
			request: {
				id: existingRequest.id,
				name: existingRequest.name,
				purpose: existingRequest.purpose,
				status: existingRequest.status,
				projectId: existingRequest.projectId,
				totalCost: existingRequest.totalCost,
			},
		}),
		{ status: 200 },
	);
}
