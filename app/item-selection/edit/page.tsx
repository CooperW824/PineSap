import { auth } from "@/lib/server/auth";
import { headers } from "next/headers";
import { PersistedUser } from "@/lib/server/DatabaseModels/user";
import { Authorizer } from "@/lib/server/authorization/authorization";
import { notFound } from "next/navigation";
import ItemEditor from "./ItemEditor";

/*
This page hides the editting from non-admins. This might be overkill but I wanted to see 
how it would work. F
*/

export default async function EditPage() {
	// do normal check for editting items
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session) {
		notFound();
	}

	const user = await PersistedUser.getById(session.user.id);
	const authorizer = new Authorizer(user!);

	if (!authorizer.items().canEdit()) {
		notFound();
	}
	// return the actual editing page if we're good
	return <ItemEditor />;
}
