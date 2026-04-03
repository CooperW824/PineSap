import { PersistedUser } from "@/lib/server/DatabaseModels/user";
import { auth } from "@/lib/server/auth";
import { Authorizer } from "@/lib/server/authorization/authorization";

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

  const { page = "1", limit = "10" } = Object.fromEntries(
    new URL(request.url).searchParams,
  );

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
    return new Response(
      JSON.stringify({ error: "Email and name are required" }),
      { status: 400 },
    );
  }

  const existingUser = await PersistedUser.getByEmail(email);

  if (existingUser) {
    return new Response(
      JSON.stringify({ error: "User with this email already exists" }),
      { status: 400 },
    );
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

  return new Response(
    JSON.stringify({ message: "User deleted successfully" }),
    {
      status: 200,
    },
  );
}
