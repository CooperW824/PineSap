import { Trash2, Pencil } from "lucide-react";
import { PersistedUser } from "@/lib/server/DatabaseModels/user";
import { auth } from "@/lib/server/auth";
import { Authorizer } from "@/lib/server/authorization/authorization";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { PersistedRequest } from "@/lib/server/DatabaseModels/request";
import RequestNameEdit from "@/app/components/Requests/name-edit";
import RequestDecriptionEdit from "@/app/components/Requests/description-edit";
import RequestSubmitButton from "@/app/components/Requests/submit-request-button";
import RequestItemsList from "@/app/components/Requests/Items/editable-items-list";
import { PersistedProject } from "@/lib/server/DatabaseModels/project";
import RequestProjectSelector from "@/app/components/Requests/project-selector";
import BackButton from "@/app/components/back-button";

export default async function EditRequestPage(params: { searchParams: Promise<{ id: string }> }) {
	// Get the request id from the url query parameters
	const requestId = (await params.searchParams).id;

	const session = await auth.api.getSession({ headers: await headers() });

	if (!session) {
		redirect("/not-found");
	}

	const user = await PersistedUser.getById(session.user.id);
	const authorizer = new Authorizer(user!);
	const request = await PersistedRequest.getById(requestId);
	const requestOwner = await PersistedUser.getById(request?.ownerId || "");

	if (!request || !requestOwner) {
		redirect("/not-found");
	}

	if (!authorizer.requests().canEdit(requestOwner)) {
		redirect("/not-found");
	}

	const items = await request.getItems(1, 10); // Fetch first page of items for the request
	const totalItems = await request.countItems();

	const projects = await PersistedProject.list(100, 1); // Fetch first 100 projects for the project selection dropdown

	return (
		<main className="p-6">
			<h1 className="text-3xl font-bold mb-2">Edit Request</h1>

			<BackButton href={`/requests/view/?id=${requestId}`} />

			<div className="mt-2 space-y-6">
				{/* TODO: Implement proper project selection */}
				{/* Select project */}
				<RequestProjectSelector
					requestId={requestId}
					projects={projects}
					currentProjectId={request.projectId}
				/>

				<RequestNameEdit requestId={requestId} name={request.name} />

				<RequestDecriptionEdit requestId={requestId} description={request.purpose || ""} />

				<RequestItemsList requestId={requestId} items={items} totalItemCount={totalItems} />

				<RequestSubmitButton requestId={requestId} />
			</div>
		</main>
	);
}
