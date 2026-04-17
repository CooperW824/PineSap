import { auth } from "@/lib/server/auth";
import { headers } from "next/headers";
import { Authorizer } from "@/lib/server/authorization/authorization";
import { PersistedUser } from "@/lib/server/DatabaseModels/user";
import { PersistedItem } from "@/lib/server/DatabaseModels/item";

/* 
   This is for items editting, you may want to later change the structure of the api to make this 
   clear. But for now that's just where I put it.
*/

// stole most of this from cooper's API auth stuff
export async function GET(request: Request) {
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
