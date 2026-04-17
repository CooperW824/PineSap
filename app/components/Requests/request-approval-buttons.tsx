"use client";

import { redirect } from "next/navigation";
import { useState } from "react";

export default function RequestApprovalButtons({ requestId }: { requestId: string }) {
	const [error, setError] = useState<string | null>(null);
	const handleApproval = async (approved: boolean) => {
		const resp = await fetch(`/api/request/approval/?id=${requestId}`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ approval: approved }),
		});

		if (!resp.ok) {
			const data = await resp.json();
			setError(data.error || "An error occurred while processing the approval decision.");
		} else {
			setError(null);
			window.location.href = `/requests`; // Redirect to the request details page after approval decision
		}
	};

	return (
		<div className="flex space-x-4 mb-6">
			<button onClick={() => handleApproval(true)} className="btn btn-success">
				Approve
			</button>
			<button onClick={() => handleApproval(false)} className="btn btn-error">
				Reject
			</button>
		</div>
	);
}
