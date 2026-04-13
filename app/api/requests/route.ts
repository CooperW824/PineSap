import { auth } from "@/lib/server/auth";
import { Authorizer } from "@/lib/server/authorization/authorization";
import { PersistedRequest } from "@/lib/server/DatabaseModels/request";
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
	if (!authorizer.requests().canView()) {
		return new Response(JSON.stringify({ error: "Forbidden" }), {
			status: 403,
		});
	}

	const limit = new URLSearchParams(new URL(request.url).searchParams).get("limit");
	const page = new URLSearchParams(new URL(request.url).searchParams).get("page");

	if (!limit || !page) {
		return new Response(JSON.stringify({ error: "Missing limit or page query parameters" }), {
			status: 400,
		});
	}

	const requests = await PersistedRequest.list(Number(limit), Number(page));
	const totalCount = await PersistedRequest.count();

	return new Response(JSON.stringify({ requests, totalCount }), { status: 200 });
}
