"use client";

import { useState } from "react";

import { ProjectData } from "@/lib/server/DatabaseModels/project";
import PaginationControls from "../pagination-controls";
import Modal from "../Modal";
export default function ProjectList({
	projects,
	totalCount,
	canUpdate,
}: {
	projects: ProjectData[];
	totalCount: number;
	canUpdate: boolean;
}) {
	const [currentProjects, setCurrentProjects] = useState<ProjectData[]>(projects);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const itemsPerPage = 10;
	const totalPages = Math.ceil(totalCount / itemsPerPage);
	const [budgetUpdateError, setBudgetUpdateError] = useState<string | null>(null);
	const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
	const [unsavedBudget, setUnsavedBudget] = useState<number>(0);

	const handlePageChange = async (newPage: number) => {
		const response = await fetch(`/api/budgets?page=${newPage}&limit=${itemsPerPage}`);
		const data = await response.json();
		setCurrentProjects(data.projects);
		setCurrentPage(newPage);
	};

	const handleBudgetUpdate = async (projectId: string, newBudget: number) => {
		const response = await fetch(`/api/budgets?id=${projectId}`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ budget: newBudget }),
		});
		if (response.ok) {
			const updatedProject = await response.json();
			setCurrentProjects((prevProjects) =>
				prevProjects.map((proj) =>
					proj.id === projectId ? { ...proj, budget: updatedProject.project.budget } : proj,
				),
			);
			setSelectedProject(null);
		} else {
			setBudgetUpdateError("Failed to update budget. Please try again.");
		}
	};

	return (
		<div>
			<div className="mt-4 space-y-4 mb-4">
				{currentProjects.map((project) => (
					<article
						key={project.id}
						className="flex flex-col gap-4 rounded-2xl border border-base-300 bg-base-200/60 px-5 py-5 sm:px-6 md:flex-row md:items-center md:justify-between"
					>
						<div className="space-y-2">
							<h2 className="text-xl font-bold">{project.name}</h2>
							<p className="text-lg font-semibold">Budget: ${project.budget.toFixed(2)}</p>
							<p className="text-lg font-semibold">Total Spend: ${project.totalSpend.toFixed(2)}</p>
						</div>
						{canUpdate && (
							<button
								type="button"
								className="btn h-12 min-h-12 rounded-xl border-base-300 bg-base-300 px-6 text-base font-medium text-base-content shadow-none hover:bg-base-300"
								onClick={() => {
									setSelectedProject(project);
									setUnsavedBudget(project.budget);
									setBudgetUpdateError(null);
								}}
							>
								Adjust Budget
							</button>
						)}
					</article>
				))}
			</div>

			{/* Single modal rendered once, outside the map */}
			<Modal
				open={selectedProject !== null}
				onClose={() => setSelectedProject(null)}
				title="Set New Budget"
				actions={
					<button
						className="btn btn-primary"
						onClick={() => {
							if (selectedProject) {
								handleBudgetUpdate(selectedProject.id, unsavedBudget);
							}
						}}
					>
						Update
					</button>
				}
			>
				<input
					type="number"
					className="input input-bordered w-full"
					value={unsavedBudget}
					onChange={(e) => setUnsavedBudget(Number(e.target.value))}
				/>
				{budgetUpdateError && <p className="text-error mt-2">{budgetUpdateError}</p>}
			</Modal>

			<PaginationControls
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={handlePageChange}
			/>
		</div>
	);
}
