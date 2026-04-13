"use client";

import Link from "next/link";
import { RequestData } from "@/lib/server/DatabaseModels/request";
import { useState } from "react";
import PaginationControls from "../pagination-controls";

export default function RequestsList({
	requests,
	totalCount,
}: {
	requests: RequestData[];
	totalCount: number;
}) {
	const [currentPage, setCurrentPage] = useState(1);
	const [paginatedRequests, setPaginatedRequests] = useState<RequestData[]>(requests);

	const itemsPerPage = 10;
	const totalPages = Math.ceil(totalCount / itemsPerPage);

	const handlePageChange = (newPage: number) => {
		setCurrentPage(newPage);
		fetch(`/api/requests?page=${newPage}&limit=${itemsPerPage}`)
			.then((res) => res.json())
			.then((data) => {
				setPaginatedRequests(data.requests);
			})
			.catch((err) => {
				console.error("Failed to fetch requests for page " + newPage, err);
			});
	};


	return (
		<div className="space-y-3 w-3/4">
			{paginatedRequests.map((request) => (
				<Link key={request.id} href="/requests/view" className="block">
					<div className="card bg-base-200 shadow p-8 cursor-pointer hover:shadow-lg hover:bg-base-300 transition-colors">
						<div className="flex justify-between">
							<div>
								<p className="font-bold">Name: {request.name || "Untitled Request"}</p>
								<p>Status: {request.status}</p>
								<p>Purpose: {request.purpose || "No purpose provided"}</p>
							</div>

							<div className="text-right">
								<p>Price: ${request.totalCost.toFixed(2)}</p>
							</div>
						</div>
					</div>
				</Link>
			))}
			<PaginationControls
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={handlePageChange}
			/>
		</div>
	);
}
