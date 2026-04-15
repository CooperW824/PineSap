import { auth } from "@/lib/server/auth";
import { headers } from "next/headers";
import { Authorizer } from "@/lib/server/authorization/authorization";
import { PersistedUser } from "@/lib/server/DatabaseModels/user";

import SideBarShell from "./sidebar-shell";

export default async function SideBar() {
  let isAdmin = false;
  const user = await auth.api.getSession({ headers: await headers() });

  if (user) {
    const persistedUser = await PersistedUser.getById(user.user.id);
    const authorizer = new Authorizer(persistedUser!);
    isAdmin = authorizer.users().canChangeRole();
  }

  return <SideBarShell isAdmin={isAdmin} />;
}
