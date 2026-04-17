import { auth } from "@/lib/server/auth";
import { Authorizer } from "@/lib/server/authorization/authorization";
import { PersistedProject } from "@/lib/server/DatabaseModels/project";
import { PersistedUser } from "@/lib/server/DatabaseModels/user";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ProjectList from "../components/Budgets/project-list";

export default async function BudgetPage() {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session) {
		redirect("/not-found");
	}

	const user = await PersistedUser.getById(session.user.id);

	const canView = new Authorizer(user!).budget().canView();
	const canUpdate = new Authorizer(user!).budget().canUpdate();

	if (!canView) {
		redirect("/not-found");
	}

	// Fetch the first 10 projects to display on the budget page, the client side component will handle pagination if there are more than 10 projects
	const projects = await PersistedProject.list(10, 1);

	const totalCount = await PersistedProject.count();

	return (
		<main
			data-theme="forest"
			className="min-h-[calc(100vh-4rem)] w-full bg-base-100 px-4 py-6 text-base-content sm:px-6 lg:px-10"
		>
			<div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
				<section className="rounded-3xl border border-base-300 bg-base-100 shadow-sm">
					<div className="px-6 py-8 sm:px-8 lg:px-10">
						<h1 className="text-3xl font-bold sm:text-4xl">Project Budgets</h1>

						<ProjectList projects={projects} totalCount={totalCount} canUpdate={canUpdate} />
					</div>
				</section>
			</div>
		</main>
	);
}
