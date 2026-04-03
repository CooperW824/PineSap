// import { ChevronDown, Plus, RotateCcw, Trash2, UserRound } from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/server/prisma";
// sample requests, delete later
import { auth } from "@/lib/server/auth";
import { headers } from "next/headers";
import { PersistedUser } from "@/lib/server/DatabaseModels/user";
import { Authorizer } from "@/lib/server/authorization/authorization";
import { redirect } from "next/navigation";
import CreateRequestButton from "../components/Requests/create-request-button";

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

	const requests = await prisma.request.findMany({
		orderBy: {
			createdAt: "desc",
		},
	});

	return (
		<main className="p-6">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold">Requests</h1>
				{canSubmit && <CreateRequestButton />}
			</div>
			<div className="space-y-3">
				<div className="mt-6 rounded-2xl bg-base-200 p-6">
					<div className="space-y-4">
						{requests.map((request) => (
							<Link key={request.name} href="/requests/view" className="block">
								{" "}
								{/* need to make the link element behave like a block so we can have proper spacing, may not be neccesary
              when we have non-sample requests.*/}
								<div className="card bg-base-300 shadow p-8 cursor-pointer hover:shadow-lg">
									<div className="flex justify-between">
										<div>
											<p className="font-bold">Name: {request.name || "Untitled Request"}</p>
											<p>Status: {request.status}</p>
											<p>Purpose: {request.purpose || "No purpose provided"}</p>
										</div>

										<div className="text-right">
											<p>Price: {Number(67).toFixed(2)}</p>
										</div>
									</div>
								</div>
							</Link>
						))}
					</div>
				</div>
			</div>
		</main>
	);
}
