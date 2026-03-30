import { PersistedUser } from "@/lib/server/DatabaseModels/user";
import UserManagementPane from "@/app/components/user-management/user-management-pane";
import { headers } from "next/headers";
import { auth } from "@/lib/server/auth";
import { redirect } from "next/navigation";

export default async function UserManagementPage() {
  // Get current session and user from the auth module. If there is no session or the user
  // does not have permission to view the user management page, we should redirect them to the 404 page.
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/not-found");
  }

  const user = await PersistedUser.getById(session.user.id);

  if (!user || user.role !== "admin") {
    redirect("/not-found");
  }

  const count = await PersistedUser.count();

  // Only listing the first 10 users when the page loads.
  // The user management pane will have pagination controls to load more users if needed.
  const users = await PersistedUser.list(
    Number(process.env.NEXT_PUBLIC_ITEMS_PER_PAGE),
    1,
  );
  return (
    <main
      data-theme="forest"
      className="min-h-[calc(100vh-4rem)] w-full bg-base-100 px-4 py-6 text-base-content sm:px-6 lg:px-10"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="rounded-3xl border border-base-300 bg-base-100 shadow-sm">
          <div className="flex flex-col gap-6 px-6 py-8 sm:px-8 lg:px-10">
            <UserManagementPane users={users} count={count} />
          </div>
        </section>
      </div>
    </main>
  );
}
