import { auth } from "@/lib/server/auth";
import { headers } from "next/headers";
import { Authorizer } from "@/lib/server/authorization/authorization";
import { PersistedUser } from "@/lib/server/DatabaseModels/user";
import { PersistedItem } from "@/lib/server/DatabaseModels/item";

/* 
   This is for items editting, you may want to later change the structure of the api to make this 
   clear. But for now that's just where I put it.
*/

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
		return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
	}

	const user = await PersistedUser.getById(session.user.id);
	const authorizer = new Authorizer(user!);

	if (!authorizer.items().canEdit()) {``
		return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
	}

	const itemId = new URL(request.url).searchParams.get("id");

	if (!itemId) {
		return new Response(JSON.stringify({ error: "Item ID required" }), { status: 400 });
	}

	const item = await PersistedItem.getById(itemId);

	if (!item) {
		return new Response(JSON.stringify({ error: "Item not found" }), { status: 404 });
	}

	return new Response(
		JSON.stringify({
			item: {
				id: item.id,
				name: item.name,
				description: item.description,
				price: item.price,
				quantity: item.quantity,
				physicalLocation: item.physicalLocation,
				placeOfPurchase: item.placeOfPurchase,
			},
		}),
		{
			status: 200,
			headers: { "Content-Type": "application/json" },
		},
	);
}

/**
 * PATCH /api/items?id=itemId
 *
 * Updates the details of a specific inventory item. Requires the user to have permission to edit items.
 * 
 * Query Parameters:
 * - id: the ID of the item to update
 *
 * Request Body:
 * - name: (optional) the new name of the item
 * - description: (optional) the new description of the item
 * - price: (optional) the new price of the item
 * - quantity: (optional) the new quantity of the item
 * - physicalLocation: (optional) the new physical location of the item
 * - placeOfPurchase: (optional) the new place of purchase for the item
 *
 * @param request The HTTP Request
 * @returns {success: boolean, item: ItemData} The updated item details if successful, or an error message if not
 */

export async function PATCH(request: Request) {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session) {
		return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
	}

	const user = await PersistedUser.getById(session.user.id);
	const authorizer = new Authorizer(user!);

	if (!authorizer.items().canEdit()) {
		return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
	}

	const itemId = new URL(request.url).searchParams.get("id");

	if (!itemId) {
		return new Response(JSON.stringify({ error: "Item ID required" }), { status: 400 });
	}

	const item = await PersistedItem.getById(itemId);

	if (!item) {
		return new Response(JSON.stringify({ error: "Item not found" }), { status: 404 });
	}

	const body = await request.json();

	if (body.name !== undefined) item.name = body.name;
	if (body.description !== undefined) item.description = body.description;
	if (body.quantity !== undefined) item.quantity = body.quantity;
	if (body.price !== undefined) item.price = body.price;
	if (body.placeOfPurchase !== undefined) item.placeOfPurchase = body.placeOfPurchase;
	if (body.physicalLocation !== undefined) item.physicalLocation = body.physicalLocation;

	await item.save();

	return new Response(JSON.stringify({ success: true, item }), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
}

/**
 * POST /api/items
 *
 * Creates a new inventory item with default values. Requires the user to have permission to create items.
 *
 * @param request The HTTP Request
 * @returns {item: {id: string}} The ID of the newly created item if successful, or an error message if not
 */
export async function POST(request: Request) {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session) {
		return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
	}

	const user = await PersistedUser.getById(session.user.id);
	const authorizer = new Authorizer(user!);

	if (!authorizer.items().canCreate()) {
		return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
	}

	const item = await PersistedItem.create();

	return new Response(JSON.stringify({ item: { id: item.id } }), {
		status: 201,
		headers: { "Content-Type": "application/json" },
	});
}
