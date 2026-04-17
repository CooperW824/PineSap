"use client";

import { useState } from "react";

export default function NewItemButton() {
	const [error, setError] = useState<string | null>(null);

	const handleClick = async () => {
		const resp = await fetch("api/items/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!resp.ok) {
			setError("Error creating item");
			return;
		}

		const data = await resp.json();
		window.location.href = `/item-selection/edit/?itemId=${data.item.id}`; // Redirect to the new item's page
	};

	return (
		<>
			<p className="text-sm text-error mb-2">{error}</p>
			<button className="btn btn-primary" onClick={handleClick}>
				New Item
			</button>
		</>
	);
}
