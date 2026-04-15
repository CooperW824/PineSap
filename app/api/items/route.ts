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
		return Response.json({ error: "Unauthorized" }, { status: 401 });
	}

	const user = await PersistedUser.getById(session.user.id);
	const authorizer = new Authorizer(user!);

	if (!authorizer.items().canEdit()) {
		return Response.json({ error: "Forbidden" }, { status: 403 });
	}
	

	const itemId = new URL(request.url).searchParams.get("id");

	if (!itemId) {
		return Response.json({ error: "Item ID required" }, { status: 400 });
	}

	const item = await PersistedItem.getById(itemId);

	if (!item) {
		return Response.json({ error: "Item not found" }, { status: 404 });
	}

	return Response.json({
		item: {
			id: item.id,
			name: item.name,
			description: item.description,
			price: item.price,
			quantity: item.quantity,
			physicalLocation: item.physicalLocation,
			placeOfPurchase: item.placeOfPurchase,
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

	if (!authorizer.items().canEdit()) {
		return Response.json({ error: "Forbidden" }, { status: 403 });
	}

	const itemId = new URL(request.url).searchParams.get("id");

	if (!itemId) {
		return Response.json({ error: "Item ID required" }, { status: 400 });
	}

	const item = await PersistedItem.getById(itemId);

	if (!item) {
		return Response.json({ error: "Item not found" }, { status: 404 });
	}

	const body = await request.json();

	if (body.name !== undefined) item.name = body.name;
	if (body.description !== undefined) item.description = body.description;
	if (body.quantity !== undefined) item.quantity = body.quantity;
	if (body.price !== undefined) item.price = body.price;
	if (body.placeOfPurchase !== undefined) item.placeOfPurchase = body.placeOfPurchase;
	if (body.physicalLocation !== undefined)
		item.physicalLocation = body.physicalLocation;

	await item.save();

	return Response.json({ success: true, item });
}