import { Filter, Search } from "lucide-react";
import { PersistedItem } from "@/lib/server/DatabaseModels/item";

import ItemList from "./components/item-list";
import NewItemButton from "./components/Inventory/new-item-btn";
import { auth } from "@/lib/server/auth";
import { headers } from "next/headers";
import { PersistedUser } from "@/lib/server/DatabaseModels/user";
import { Authorizer } from "@/lib/server/authorization/authorization";

// added async so we can await the fetch of inventory items, not sure if this is the best way but It works
export default async function Home() {
	const inventoryItems = await PersistedItem.list(
		Number(process.env.NEXT_PUBLIC_ITEMS_PER_PAGE),
		1,
	);
	const count = await PersistedItem.count();

	const session = await auth.api.getSession({ headers: await headers() });

	const user = session ? await PersistedUser.getById(session.user.id) : null;

	const canCreate = user ? new Authorizer(user).items().canCreate() : false;

	return (
		<main className="min-h-screen w-full p-6 bg-base-100 text-base-content flex flex-col items-center">
			<div className="w-full max-w-4xl mb-8 flex items-center justify-between">
				<h1 className="text-3xl font-bold">Inventory</h1>
				{canCreate && <NewItemButton />}
			</div>

			<div className="w-full max-w-4xl space-y-8">
				{/* <section className="flex flex-col gap-2">
					<label htmlFor="project-select" className="text-sm font-semibold opacity-70 ml-1">
						Project Name
					</label>
					{/* FIX PROJECT SELECT FOR BETA RELEASE */}
				{/* <select
						id="project-select"
						className="select select-bordered w-full max-w-xs bg-base-200"
						defaultValue="Project A"
					>
						<option>Project A</option>
						<option>Project B</option>
						<option>Project C</option>
					</select> */}
				{/* </section> */}

				<section className="space-y-4 w-full">
					<h2 className="text-lg font-semibold">All Items</h2>

					<div className="flex w-full gap-2">
						<div className="relative flex-1">
							<input
								type="text"
								placeholder="Search items..."
								className="input input-bordered w-full pr-10 bg-base-200"
							/>
							<Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 opacity-50" />
						</div>

						<button className="btn btn-square bg-base-200 border-base-content/20 hover:bg-base-300">
							<Filter className="h-5 w-5 opacity-70" />
						</button>
					</div>

					<ItemList items={inventoryItems} count={count} />
				</section>
			</div>
		</main>
	);
}
