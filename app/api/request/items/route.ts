import { auth } from "@/lib/server/auth";
import { Authorizer } from "@/lib/server/authorization/authorization";
import { PersistedUser } from "@/lib/server/DatabaseModels/user";
import { Request as PersistedRequest } from "@/lib/server/database/request";
import { Item as PersistedItem } from "@/lib/server/database/item";
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

	if (!authorizer.requests().canView()) {
		return new Response(JSON.stringify({ error: "Forbidden" }), {
			status: 403,
		});
	}

	const requestId = new URLSearchParams(new URL(request.url).searchParams).get("id");
	const pageNumber = Number(
		new URLSearchParams(new URL(request.url).searchParams).get("page") || "1",
	);
	const itemsPerPage = Number(
		new URLSearchParams(new URL(request.url).searchParams).get("limit") || "10",
	);

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

	return new Response(
		JSON.stringify({
			items: await existingRequest.getItems(pageNumber, itemsPerPage),
		}),
		{ status: 200 },
	);
}

export async function POST(request: Request) {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session) {
		return new Response(JSON.stringify({ error: "Unauthorized" }), {
			status: 401,
		});
	}

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

	const user = await PersistedUser.getById(session.user.id);
	const authorizer = new Authorizer(user!);
	const requestOwner = await PersistedUser.getById(existingRequest.getOwnerId());

	// We can be certain that requestOwner exists since if the request exists, the owner must also exist.
	if (!authorizer.requests().canEdit(requestOwner!)) {
		return new Response(JSON.stringify({ error: "Forbidden" }), {
			status: 403,
		});
	}

	// Create an empty request item for the request. The frontend will update it with the correct item, quantity, and price later.

	const item = await existingRequest.addItem("New Item", 0, 0, null);
	return new Response(
		JSON.stringify({
			item: item,
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

	const user = await PersistedUser.getById(session.user.id);
	const authorizer = new Authorizer(user!);
	const requestOwner = await PersistedUser.getById(existingRequest.getOwnerId());

	if (!authorizer.requests().canEdit(requestOwner!)) {
		return new Response(JSON.stringify({ error: "Forbidden" }), {
			status: 403,
		});
	}

	const itemData = await request.json();
	const itemId = itemData.id;

	if (!itemId) {
		return new Response(JSON.stringify({ error: "Item ID is required in request body" }), {
			status: 400,
		});
	}

	const item = await PersistedItem.fetchByID(itemId);

	if (!item) {
		return new Response(JSON.stringify({ error: "Item not found" }), {
			status: 404,
		});
	}

	if (itemData.name) {
		await item.setName(itemData.name);
	}

	if (itemData.price) {
		await item.setPrice(itemData.price);
	}

	if (itemData.quantity) {
		await item.setQuantity(itemData.quantity);
	}

	if (itemData.description) {
		await item.setDescription(itemData.description);
	}

	if (itemData.physicalLocation) {
		await item.setPhysicalLocation(itemData.physicalLocation);
	}

	return new Response(
		JSON.stringify({
			item: {
				id: item.getId(),
				name: item.getName(),
				price: item.getPrice(),
				quantity: item.getQuantity(),
				description: item.getDesc(),
				physicalLocation: item.getPhysicalLocation(),
				placeOfPurchase: item.getPlaceOfPurchase(),
			},
		}),
		{ status: 200 },
	);
}
