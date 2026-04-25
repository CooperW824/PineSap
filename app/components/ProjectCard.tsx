"use client"; // RESOLVED: Client component because it uses callbacks and interactivity

import { Trash2 } from "lucide-react";
import { Project } from "../types/types";

type Props = {
	project: Project;
	onAddReviewer: () => void;
	onRemoveReviewer: (email: string) => void;
};

export default function ProjectCard({ project, onAddReviewer, onRemoveReviewer }: Props) {
	return (
		<div className="card bg-base-200 shadow w-full">
			<div className="card-body">
				{/* Project Header */}
				<div className="flex justify-between items-center">
					<h3 className="card-title">{project.name}</h3>
					<button className="btn btn-sm btn-secondary" onClick={onAddReviewer}>
						Add Reviewer
					</button>
					{/* RESOLVED: "Add Reviewer button triggers modal via callback" */}
				</div>

				{/* Reviewer List */}
				<div className="text-base opacity-70 mt-2">
					<p className="font-medium mb-1">Current Reviewer(s):</p>
					{project.reviewers.length > 0 ? (
						<ul className="space-y-2">
							{project.reviewers.map((rev, idx) => (
								<li key={idx} className="flex items-center gap-2">
									<span>{rev}</span>
									<button
										className="btn btn-xs btn-ghost text-error"
										onClick={() => onRemoveReviewer(rev)}
									>
										<Trash2 size={16} />
									</button>
									{/* RESOLVED: "Remove reviewer handled via callback" */}
								</li>
							))}
						</ul>
					) : (
						<p>None</p>
					)}
				</div>
			</div>
		</div>
	);
}
