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

  if (!authorizer.users().canResetPassword()) {
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

  const user = await PersistedUser.getById(userId);

  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
    });
  }

  await auth.api.requestPasswordReset({
    body: {
      email: user.email,
      redirectTo: `${process.env.BETTER_AUTH_URL}/reset-password`, // The URL the user will be sent to after they reset their password. This should be a page in your frontend that handles the password reset flow.
    },
  });

  return new Response(
    JSON.stringify({
      message: "Password reset email sent successfully",
    }),
    { status: 200 },
  );
}
