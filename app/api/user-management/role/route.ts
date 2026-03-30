import { auth } from "@/lib/server/auth";
import { PersistedUser } from "@/lib/server/DatabaseModels/user";
import { Authorizer } from "@/lib/server/authorization/authorization";

export async function PATCH(request: Request) {
    const callerSession = await auth.api.getSession({ headers: request.headers });

    if (!callerSession) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
        });
    }

    const callerUser = await PersistedUser.getById(callerSession.user.id);

    const authorizer = new Authorizer(callerUser!); // Since we have a valid session, we can be sure that the user exists in the database.

    if (!authorizer.users().canChangeRole()) {
        return new Response(JSON.stringify({ error: "Forbidden" }), {
            status: 403,
        });
    }

    const { userId, role } = await request.json();

    if (!userId || !role) {
        return new Response(
            JSON.stringify({ error: "User ID and role are required" }),
            { status: 400 },
        );
    }

    const user = await PersistedUser.getById(userId);
    
    if (!user) {
        return new Response(JSON.stringify({ error: "User not found" }), {
            status: 404,
        });
    }

    user.role = role;

    await user.save();

    return new Response(
        JSON.stringify({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        }),
        { status: 200 },
    );
}
    
    
