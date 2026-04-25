"use client";

import { useState } from "react";

export default function RequestNameEdit({ name, requestId }: { name: string; requestId: string }) {
	const [requestName, setRequestName] = useState(name);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async () => {
		fetch(`/api/request/?id=${requestId}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ name: requestName }),
		}).catch(() => {
			setError("Failed to update request name");
		});
	};

	return (
		<div>
			<input
				type="text"
				placeholder="Request Name"
				className="input input-bordered w-full"
				value={requestName}
				onChange={(e) => setRequestName(e.target.value)}
				onBlur={handleSubmit}
			/>
			{error && <p className="text-red-500">{error}</p>}
		</div>
	);
}
