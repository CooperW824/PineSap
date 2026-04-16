"use client";

export default function RequestApprovalButtons({ requestId }: { requestId: string }) {
	const handleApproval = async (approved: boolean) => {
		await fetch(`/api/request/approval/?id=${requestId}`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ approval: approved }),
		});
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
