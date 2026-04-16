import StaticRequestItemsList from "@/app/components/Requests/Items/static-items-list";
import { auth } from "@/lib/server/auth";
import { Authorizer } from "@/lib/server/authorization/authorization";
import { PersistedRequest } from "@/lib/server/DatabaseModels/request";
import { PersistedUser } from "@/lib/server/DatabaseModels/user";
import { headers } from "next/headers";
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

	return (
		<main className="p-6">
			<h1 className="text-3xl font-bold">{request.name}</h1>

			<div className="mt-6 space-y-6">
				{/* project */}
				<div>
					<p className="text-sm opacity-70">Project</p>
					<p className="text-lg font-semibold">Rocket Club</p>
				</div>

				{/* purpose*/}
				<div>
					<p className="text-sm opacity-70">Purpose</p>
					<p className="text-base">
						{request.purpose !== "" ? request.purpose : "No purpose provided"}
					</p>
				</div>

				{/* items */}
				{/* header */}
				<h2 className="text-xl font-bold">Items</h2>

				<StaticRequestItemsList requestId={requestId} items={items} totalItemCount={totalItems} />

				{/* sensibily sized buttons 
        <div className="flex gap-10">
          <button className="btn btn-success">
            Approve
          </button>

          <button className="btn btn-error">
            Deny
          </button>
        </div>
            */}

				{/* comicall large buttons
				<div className="flex gap-4 mt-6">
					<button className="btn btn-success w-1/2 h-32 text-xl">Approve</button>

					<button className="btn btn-error w-1/2 h-32 text-xl">Deny</button>
				</div> */}
			</div>
		</main>
	);
}

