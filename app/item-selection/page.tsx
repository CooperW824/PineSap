import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PersistedItem } from "@/lib/server/DatabaseModels/item";

// for auth to hide the edit button from non admins, 3
// REMOVE if yall think its too much for the page
import { auth } from "@/lib/server/auth";
import { headers } from "next/headers";
import { PersistedUser } from "@/lib/server/DatabaseModels/user";
import { Authorizer } from "@/lib/server/authorization/authorization";
// end remove section

const detailCardClassName = "rounded-2xl border border-base-300 bg-base-100 px-4 py-4 shadow-sm";

function DetailField({
	label,
	value,
	className = "",
}: {
	label: string;
	value: string;
	className?: string;
}) {
	return (
		<div className={`${detailCardClassName} ${className}`.trim()}>
			<p className="text-sm font-semibold text-base-content/70">{label}</p>
			<p className="mt-2 whitespace-pre-wrap text-base text-base-content">{value}</p>
		</div>
	);
}

function BackButton() {
	return (
		<Link
			href="/"
			className="btn h-12 min-h-12 rounded-2xl border-base-300 bg-base-200 px-5 text-base 
      font-semibold text-base-content shadow-none hover:border-base-300 hover:bg-base-300/60"
		>
			<ArrowLeft className="h-4 w-4" />
			Back to Home
		</Link>
	);
}

type ItemSelectionPageProps = {
	searchParams?: Promise<{
		itemId?: string | string[];
	}>;
};

export default async function ItemSelectionPage({ searchParams }: ItemSelectionPageProps) {
	const resolvedSearchParams = searchParams ? await searchParams : {};
	const itemId = Array.isArray(resolvedSearchParams.itemId)
		? resolvedSearchParams.itemId[0]
		: resolvedSearchParams.itemId;
	const selectedItem = itemId ? await PersistedItem.getById(itemId) : undefined;

	// auth  for button hiding
	const session = await auth.api.getSession({ headers: await headers() });

	let canEdit = false;

	if (session) {
		const user = await PersistedUser.getById(session.user.id);
		const authorizer = new Authorizer(user!);
		canEdit = authorizer.items().canEdit();
	}
	// end auth  for button hiding

	return (
		<main
			data-theme="forest"
			className="min-h-[calc(100vh-4rem)] w-full bg-base-100 px-4 py-6 text-base-content sm:px-6 lg:px-10"
		>
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
				<section className="rounded-3xl border border-base-300 bg-base-100 shadow-sm">
					<div className="flex flex-col gap-8 px-6 py-8 sm:px-8 lg:px-10">
						<div>
							<BackButton />
						</div>


						{!selectedItem ? (
							<section className="rounded-2xl border border-dashed border-base-300 bg-base-200/40 p-8 text-center shadow-sm">
								<h1 className="text-3xl font-bold sm:text-4xl">No Item Selected</h1>
								<p className="mt-3 text-base text-base-content/70">
									Choose an item from the home inventory list to view its details here.
								</p>
							</section>
						) : (
							<>
						{canEdit && (
							<Link
								href={`/item-selection/edit?itemId=${selectedItem.id}`}
								className="btn btn-primary rounded-2xl"
							>
								Edit Item
							</Link>
						)}
								<div className="max-w-4xl">
									<p className="text-sm font-semibold uppercase tracking-[0.2em] text-base-content/55">
										Item Details
									</p>
									<h1 className="mt-2 text-3xl font-bold sm:text-4xl">{selectedItem.name}</h1>
									<div className="mt-4 flex flex-wrap gap-3">
										<div className="badge badge-outline badge-lg px-4 py-3 text-sm font-medium">
											{selectedItem.physicalLocation}
										</div>
									</div>
								</div>

								<section className="rounded-2xl border border-base-300 bg-base-200/60 p-4 sm:p-6">
									<div className="grid gap-6 lg:grid-cols-2">
										<DetailField
											label="Description of Item"
											value={selectedItem.description ?? "No description provided"}
											className="lg:col-span-2"
										/>
										<DetailField label="Quantity of Item" value={String(selectedItem.quantity)} />
										<DetailField
											label="Place of Purchase"
											value={selectedItem.placeOfPurchase ?? "Unknown"}
										/>
										<DetailField label="Price" value={`$${selectedItem.price.toFixed(2)}`} />
										<DetailField
											label="Location"
											value={selectedItem.physicalLocation ?? "Unknown"}
										/>
									</div>
								</section>
							</>
						)}
					</div>
				</section>
			</div>
		</main>
	);
}
