import { auth } from "@/lib/server/auth";
import { Authorizer } from "@/lib/server/authorization/authorization";
import { PersistedUser } from "@/lib/server/DatabaseModels/user";
import { Request as PersistedRequest } from "@/lib/server/database/request";
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
                id: newRequest.id,
                name: newRequest.name,
                purpose: newRequest.purpose,
                status: newRequest.status,
            },
        }),
        { status: 201 },
    );
}   
