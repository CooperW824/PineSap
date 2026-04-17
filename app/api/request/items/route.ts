import { auth } from "@/lib/server/auth";
import { Authorizer } from "@/lib/server/authorization/authorization";
import { PersistedUser } from "@/lib/server/DatabaseModels/user";
import { PersistedRequest } from "@/lib/server/DatabaseModels/request";
import { PersistedItem } from "@/lib/server/DatabaseModels/item";
import { headers } from "next/headers";
import { it } from "node:test";

/**
 * GET /api/items?id=itemId
 *
 * Returns the details of a specific inventory item. Requires the user to have permission to edit items.
 *
 * Query Parameters:
 * - id: the ID of the item to retrieve
 *
 * @param request The HTTP Request
 * @returns {item: ItemData} The details of the requested item
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

	if (pageNumber == 0) {
		return new Response(JSON.stringify({ items: [] }), { status: 200 });
	}

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

	return new Response(
		JSON.stringify({
			items: await existingRequest.getItems(pageNumber, itemsPerPage),
		}),
		{ status: 200 },
	);
}

/**
 * POST /api/items?id=itemId
 *
 * Creates a new empty inventory item. Requires the user to have permission to edit requests.
 *
 * Query Parameters:
 * - id: the ID of the item to update
 *
 * Request Body:
 * - name: the new name of the item (optional)
 * - price: the new price of the item (optional)
 * - quantity: the new quantity of the item (optional)
 * - description: the new description of the item (optional)
 * - physicalLocation: the new physical location of the item (optional)
 * - placeOfPurchase: the new place of purchase for the item (optional)
 *
 * @param request The HTTP Request
 * @returns {item: ItemData} The updated item details if successful, or an error message if the update failed
 */
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

	const existingRequest = await PersistedRequest.getById(requestId);

	if (!existingRequest) {
		return new Response(JSON.stringify({ error: "Request not found" }), {
			status: 404,
		});
	}

	const user = await PersistedUser.getById(session.user.id);
	const authorizer = new Authorizer(user!);
	const requestOwner = await PersistedUser.getById(existingRequest.ownerId);

	// We can be certain that requestOwner exists since if the request exists, the owner must also exist.
	if (!authorizer.requests().canEdit(requestOwner!)) {
		return new Response(JSON.stringify({ error: "Forbidden" }), {
			status: 403,
		});
	}

	// Create an empty request item for the request. The frontend will update it with the correct item, quantity, and price later.
	const item = await existingRequest.addItem({
		name: "",
		price: 0,
		quantity: 1,
		description: "",
		placeOfPurchase: "",
		status: "PENDING_APPROVAL",
	});

	return new Response(
		JSON.stringify({
			item: item,
		}),
		{ status: 200 },
	);
}

/**
 * PATCH /api/items?id=itemId
 *
 * Updates the details of an inventory item. Will also update the request's total cost if the price or quantity is changed.
 * Requires the user to have permission to edit requests.
 *
 * Query Parameters:
 * - id: the ID of the item to update
 *
 * Request Body:
 * - name: (optional) the new name of the item
 * - description: (optional) the new description of the item
 * - price: (optional) the new price of the item
 * - quantity: (optional) the new quantity of the item
 * - placeOfPurchase: (optional) the new place of purchase for the item
 *
 * @param request The HTTP Request
 * @returns {item: ItemData} The updated item details if successful, or an error message if not
 */
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

	const existingRequest = await PersistedRequest.getById(requestId);

	if (!existingRequest) {
		return new Response(JSON.stringify({ error: "Request not found" }), {
			status: 404,
		});
	}

	const user = await PersistedUser.getById(session.user.id);
	const authorizer = new Authorizer(user!);
	const requestOwner = await PersistedUser.getById(existingRequest.ownerId);

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

	const item = await PersistedItem.getById(itemId);

	if (!item) {
		return new Response(JSON.stringify({ error: "Item not found" }), {
			status: 404,
		});
	}

	if (itemData.name) {
		item.name = itemData.name;
	}

	if (itemData.price) {
		// Add the difference between the new price and the old price to the request's total cost
		existingRequest.totalCost += itemData.price * itemData.quantity - item.price * item.quantity;
		item.price = itemData.price;
		await existingRequest.save();
	}

	if (itemData.quantity) {
		existingRequest.totalCost += itemData.price * itemData.quantity - item.price * item.quantity;
		item.quantity = itemData.quantity;
		await existingRequest.save();
	}

	if (itemData.description) {
		item.description = itemData.description;
	}

	if (itemData.placeOfPurchase) {
		item.placeOfPurchase = itemData.placeOfPurchase;
	}

	await item.save();

	return new Response(
		JSON.stringify({
			item: {
				id: item.id,
				name: item.name,
				price: item.price,
				quantity: item.quantity,
				description: item.description,
				physicalLocation: item.physicalLocation,
				placeOfPurchase: item.placeOfPurchase,
			},
		}),
		{ status: 200 },
	);
}
