import BackButton from "@/app/components/back-button";
import StaticRequestItemsList from "@/app/components/Requests/Items/static-items-list";
import RequestApprovalButtons from "@/app/components/Requests/request-approval-buttons";
import { auth } from "@/lib/server/auth";
import { Authorizer } from "@/lib/server/authorization/authorization";
import { PersistedProject } from "@/lib/server/DatabaseModels/project";
import { PersistedRequest } from "@/lib/server/DatabaseModels/request";
import { PersistedUser } from "@/lib/server/DatabaseModels/user";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ViewRequestPage(params: { searchParams: Promise<{ id: string }> }) {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session) {
		redirect("/not-found");
	}

	const user = await PersistedUser.getById(session.user.id);
	const authorizer = new Authorizer(user!);

	if (!authorizer.requests().canView()) {
		redirect("/not-found");
	}

	const requestId = (await params.searchParams).id;
	const request = await PersistedRequest.getById(requestId);

	if (!request) {
		redirect("/not-found");
	}

	const items = await request.getItems(1, 10); // Fetch first page of items for the request
	const totalItems = await request.countItems();

	const canEdit = authorizer.requests().canEdit((await PersistedUser.getById(request.ownerId))!);

	const project = await PersistedProject.getById(request.projectId || ""); // Fetch the project associated with the request, if any
	const projectApprovers = project ? (await project.listApprovers()).map((user) => user.email) : [];

	const canReview = authorizer.requests().canReview(projectApprovers);

	return (
		<main className="p-6 flex flex-col items-center w-full">
			<div className="flex w-1/2 items-start justify-between">
				<h1 className="text-3xl font-bold">Request: {request.name}</h1>
				{canEdit && request.status !== "APPROVED" && (
					<Link href={`/requests/edit/?id=${requestId}`} className="btn btn-primary ml-4">
						Edit Request
					</Link>
				)}
			</div>

			<div className="w-1/2 my-2">
				<BackButton href="/requests" />
			</div>

			<div className="w-1/2">
				{/* project */}
				<div>
					<p className="text-sm opacity-70">Project</p>
					<p className="text-lg font-semibold">{project ? project.name : "No project assigned"}</p>
				</div>

				{/* purpose*/}
				<div className="mb-4">
					<p className="text-sm opacity-70">Purpose</p>
					<p className="text-base">
						{request.purpose !== "" ? request.purpose : "No purpose provided"}
					</p>
				</div>

				<div className="mb-4">
					<p className="text-sm opacity-70">Status</p>
					<p className="text-base">{request.status}</p>
				</div>

				{canReview && request.status === "PENDING" && (
					<RequestApprovalButtons requestId={requestId} />
				)}

				<StaticRequestItemsList requestId={requestId} items={items} totalItemCount={totalItems} />
			</div>
		</main>
	);
}
