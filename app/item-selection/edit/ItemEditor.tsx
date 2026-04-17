"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

type Item = {
	id: string;
	name: string;
	description: string;
	price: number;
	quantity: number;
	physicalLocation: string;
	placeOfPurchase: string;
};

type SaveState = "idle" | "saving" | "saved" | "error";

const detailCardClassName = "rounded-2xl border border-base-300 bg-base-100 px-4 py-4 shadow-sm";

function EditableField({
	label,
	defaultValue,
	onBlur,
	className = "",
	type = "text",
}: {
	label: string;
	defaultValue: string | number;
	onBlur: (value: string) => void;
	className?: string;
	type?: "text" | "number";
}) {
	return (
		<div className={`${detailCardClassName} ${className}`.trim()}>
			<p className="text-sm font-semibold text-base-content/70">{label}</p>
			{type === "text" ? (
				<input
					className="mt-2 w-full rounded-xl border border-base-300 bg-base-100 px-3 py-2 text-base outline-none focus:border-primary"
					defaultValue={defaultValue}
					onBlur={(e) => onBlur(e.target.value)}
				/>
			) : (
				<input
					type="number"
					className="mt-2 w-full rounded-xl border border-base-300 bg-base-100 px-3 py-2 text-base outline-none focus:border-primary"
					defaultValue={defaultValue}
					onBlur={(e) => onBlur(e.target.value)}
				/>
			)}
		</div>
	);
}

function EditableTextArea({
	label,
	defaultValue,
	onBlur,
	className = "",
}: {
	label: string;
	defaultValue: string;
	onBlur: (value: string) => void;
	className?: string;
}) {
	return (
		<div className={`${detailCardClassName} ${className}`.trim()}>
			<p className="text-sm font-semibold text-base-content/70">{label}</p>
			<textarea
				className="mt-2 min-h-32 w-full rounded-xl border border-base-300 bg-base-100 px-3 py-2 text-base outline-none focus:border-primary"
				defaultValue={defaultValue}
				onBlur={(e) => onBlur(e.target.value)}
			/>
		</div>
	);
}

// auto saver progress
function SaveStatus({ state }: { state: SaveState }) {
	if (state === "saving") {
		return (
			<div className="badge badge-outline gap-2 px-4 py-3">
				<Loader2 className="h-4 w-4 animate-spin" />
				Saving...
			</div>
		);
	}

	if (state === "saved") {
		return (
			<div className="badge badge-success gap-2 px-4 py-3">
				<CheckCircle2 className="h-4 w-4" />
				Saved
			</div>
		);
	}

	if (state === "error") {
		return (
			<div className="badge badge-error gap-2 px-4 py-3">
				<AlertCircle className="h-4 w-4" />
				Failed to save
			</div>
		);
	}

	return <div className="badge badge-outline px-4 py-3">All changes saved</div>;
}

export default function ItemEditor() {
	const [item, setItem] = useState<Item | null>(null);
	const [saveState, setSaveState] = useState<SaveState>("idle");

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const itemId = params.get("itemId");

		if (!itemId) return;

		fetch(`/api/items?id=${itemId}`)
			.then((res) => res.json())
			.then((data) => setItem(data.item));
	}, []);

	async function saveField(field: keyof Item, value: string | number) {
		if (!item) return;

		setSaveState("saving");

		const updated = { ...item, [field]: value };
		setItem(updated);

		try {
			const response = await fetch(`/api/items?id=${item.id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ [field]: value }),
			});

			if (!response.ok) {
				throw new Error("Save failed");
			}

			setSaveState("saved");

			setTimeout(() => {
				setSaveState("idle");
			}, 1500);
		} catch {
			setSaveState("error");
		}
	}

	if (!item) {
		return <div className="p-8">Loading...</div>;
	}

	return (
		<main
			data-theme="forest"
			className="min-h-[calc(100vh-4rem)] w-full bg-base-100 px-4 py-6 text-base-content sm:px-6 lg:px-10"
		>
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
				<section className="rounded-3xl border border-base-300 bg-base-100 shadow-sm">
					<div className="flex flex-col gap-8 px-6 py-8 sm:px-8 lg:px-10">
						<Link
							href={`/item-selection?itemId=${item.id}`}
							className="btn h-12 min-h-12 w-fit rounded-2xl border-base-300 bg-base-200 px-5 text-base font-semibold text-base-content shadow-none hover:border-base-300 hover:bg-base-300/60"
						>
							<ArrowLeft className="h-4 w-4" />
							Back to Item
						</Link>

						<div className="max-w-4xl">
							<p className="text-sm font-semibold uppercase tracking-[0.2em] text-base-content/55">
								Edit Item
							</p>

							<div className="mt-2 flex items-center gap-4">
								<h1 className="text-3xl font-bold sm:text-4xl">{item.name}</h1>
								<SaveStatus state={saveState} />
							</div>

							<div className="mt-4 flex flex-wrap gap-3">
								<div className="badge badge-outline badge-lg px-4 py-3 text-sm font-medium">
									{item.physicalLocation}
								</div>
							</div>
						</div>

						<section className="rounded-2xl border border-base-300 bg-base-200/60 p-4 sm:p-6">
							<div className="grid gap-6 lg:grid-cols-2">
								<EditableField
									label="Item Name"
									defaultValue={item.name}
									onBlur={(value) => saveField("name", value)}
									className="lg:col-span-2"
								/>

								<EditableTextArea
									label="Description of Item"
									defaultValue={item.description ?? ""}
									onBlur={(value) => saveField("description", value)}
									className="lg:col-span-2"
								/>

								<EditableField
									label="Quantity of Item"
									defaultValue={item.quantity}
									type="number"
									onBlur={(value) => saveField("quantity", Number(value))}
								/>

								<EditableField
									label="Place of Purchase"
									defaultValue={item.placeOfPurchase ?? ""}
									onBlur={(value) => saveField("placeOfPurchase", value)}
								/>

								<EditableField
									label="Price"
									defaultValue={item.price}
									type="number"
									onBlur={(value) => saveField("price", Number(value))}
								/>

								<EditableField
									label="Location"
									defaultValue={item.physicalLocation ?? ""}
									onBlur={(value) => saveField("physicalLocation", value)}
								/>
							</div>
						</section>
					</div>
				</section>
			</div>
		</main>
	);
}
