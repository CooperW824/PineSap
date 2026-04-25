"use client";

import { useState } from "react";

export default function CreateRequestButton() {
	const [error, setError] = useState<string | null>(null);

	const handleClick = async () => {
		const resp = await fetch("/api/request/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (resp.ok) {
			const data = await resp.json();
			const requestId = data.request.id;
			window.location.href = `/requests/edit/?id=${requestId}`;
		} else {
			setError("Failed to create request");
		}
	};

	return (
		<div>
			{error && <p className="text-red-500">{error}</p>}
			<button className="btn btn-primary" onClick={handleClick}>
				Create Request
			</button>
		</div>
	);
}
