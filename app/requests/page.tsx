// import { ChevronDown, Plus, RotateCcw, Trash2, UserRound } from "lucide-react";
import Link from "next/link";
// sample requests, delete later
import { auth } from "@/lib/server/auth";
import { headers } from "next/headers";
import { PersistedUser } from "@/lib/server/DatabaseModels/user";
import { Authorizer } from "@/lib/server/authorization/authorization";
import { redirect } from "next/navigation";
import CreateRequestButton from "../components/Requests/create-request-button";
import { PersistedRequest } from "@/lib/server/DatabaseModels/request";
import RequestsList from "../components/Requests/requests-list";

export default async function RequestsPage() {
	const session = await auth.api.getSession({ headers: await headers() });
	let canView = false;
	let canSubmit = false;

	if (session) {
		const user = await PersistedUser.getById(session.user.id);
		const authorizer = new Authorizer(user!);
		canView = authorizer.requests().canView();
		canSubmit = authorizer.requests().canSubmit();
	}

	if (!canView) {
		redirect("/not-found");
	}

	const requests = await PersistedRequest.list(10, 1);
	const totalRequestCount = await PersistedRequest.count();

	return (
		<main className="p-6 flex flex-col w-full justify-start items-center">
			<div className="flex justify-between items-center mb-4 w-1/2">
				<h1 className="text-3xl font-bold">Requests</h1>
				{canSubmit && <CreateRequestButton />}
			</div>
			<RequestsList requests={requests} totalCount={totalRequestCount} />
		</main>
	);
}
