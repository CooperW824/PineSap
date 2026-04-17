import { PersistedUser } from "@/lib/server/DatabaseModels/user";
import { auth } from "@/lib/server/auth";
import { Authorizer } from "@/lib/server/authorization/authorization";

/**
 * GET /api/user-management/?limit=10&page=1
 *
 * Gets a paginated list of users.
 *
 * @param request The HTTP Request, with optional query parameters "page" and "limit" for pagination (default: page=1, limit=10)
 * @returns {users: {id: string, email: string, name: string, role: Role}[], count: number} A paginated list of users with their details, and the total count of users in the system
 */
export async function GET(request: Request) {
	const callerSession = await auth.api.getSession({ headers: request.headers });

	if (!callerSession) {
		return new Response(JSON.stringify({ error: "Unauthorized" }), {
			status: 401,
		});
	}

	const callerUser = await PersistedUser.getById(callerSession.user.id);

	const authorizer = new Authorizer(callerUser!); // Since we have a valid session, we can be sure that the user exists in the database.

	if (!authorizer.users().canView()) {
		return new Response(JSON.stringify({ error: "Forbidden" }), {
			status: 403,
		});
	}

	const { page = "1", limit = "10" } = Object.fromEntries(new URL(request.url).searchParams);

	const users = await PersistedUser.list(Number(limit), Number(page));
	const count = await PersistedUser.count();

	return new Response(
		JSON.stringify({
			users: users.map((user) => ({
				id: user.id,
				email: user.email,
				name: user.name,
				role: user.role,
			})),
			count,
		}),
		{ status: 200 },
	);
}

/**
 * POST /api/user-management/
 *
 * Creates a new user. Requires the caller to have permission to create users.
 *
 * Request Body:
 * - email: the email of the new user
 * - name: the name of the new user
 *
 * @param request The HTTP Request
 * @returns {user: {id: string, email: string, name: string, role: Role}} The created user's details if successful, or an error message if not
 */
export async function POST(request: Request) {
	const callerSession = await auth.api.getSession({ headers: request.headers });

	if (!callerSession) {
		return new Response(JSON.stringify({ error: "Unauthorized" }), {
			status: 401,
		});
	}

	const callerUser = await PersistedUser.getById(callerSession.user.id);

	const authorizer = new Authorizer(callerUser!); // Since we have a valid session, we can be sure that the user exists in the database.

	if (!authorizer.users().canCreate()) {
		return new Response(JSON.stringify({ error: "Forbidden" }), {
			status: 403,
		});
	}

	const { email, name } = await request.json();

	if (!email || !name) {
		return new Response(JSON.stringify({ error: "Email and name are required" }), { status: 400 });
	}

	const existingUser = await PersistedUser.getByEmail(email);

	if (existingUser) {
		return new Response(JSON.stringify({ error: "User with this email already exists" }), {
			status: 400,
		});
	}

	const newUser = await PersistedUser.create({
		email,
		name,
		role: "member", // Users created through this endpoint will have the "member" role by default since they are being created by an admin.
	});

	return new Response(
		JSON.stringify({
			user: {
				id: newUser.id,
				email: newUser.email,
				name: newUser.name,
				role: newUser.role,
			},
		}),
		{ status: 201 },
	);
}

/**
 * DELETE /api/user-management/
 *
 * Deletes a user. Requires the caller to have permission to delete users.
 *
 * Request Body:
 * - userId: the ID of the user to delete
 *
 * @param request The HTTP Request
 * @returns {message: string} A success message if the user is deleted, or an error message if not
 */
export async function DELETE(request: Request) {
	const callerSession = await auth.api.getSession({ headers: request.headers });

	if (!callerSession) {
		return new Response(JSON.stringify({ error: "Unauthorized" }), {
			status: 401,
		});
	}

	const callerUser = await PersistedUser.getById(callerSession.user.id);

	const authorizer = new Authorizer(callerUser!); // Since we have a valid session, we can be sure that the user exists in the database.

	if (!authorizer.users().canDelete()) {
		return new Response(JSON.stringify({ error: "Forbidden" }), {
			status: 403,
		});
	}

	const { userId } = await request.json();

	if (!userId) {
		return new Response(JSON.stringify({ error: "User ID is required" }), {
			status: 400,
		});
	}

	const userToDelete = await PersistedUser.getById(userId);

	if (!userToDelete) {
		return new Response(JSON.stringify({ error: "User not found" }), {
			status: 404,
		});
	}

	await userToDelete.delete();

	return new Response(JSON.stringify({ message: "User deleted successfully" }), {
		status: 200,
	});
}
