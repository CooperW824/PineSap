"use client";

import { useEffect, useState } from "react";
import Modal from "./Modal";
import ProjectCard from "./ProjectCard";
import { Project } from "../types/types";

export default function AdminProjectList() {
	const [clubProjects, setClubProjects] = useState<Project[]>([]);
	const [showProjectModal, setShowProjectModal] = useState(false);
	const [newProjectName, setNewProjectName] = useState("");
	const [showReviewerModal, setShowReviewerModal] = useState(false);
	const [reviewerEmail, setReviewerEmail] = useState("");
	const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

	useEffect(() => {
		fetch("/api/projects")
			.then((res) => res.json())
			.then((data) => setClubProjects(data.projects));
	}, []);

	const handleCreateProject = async () => {
		if (!newProjectName.trim()) return;

		const response = await fetch("/api/projects", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name: newProjectName }),
		});

		if (!response.ok) return;

		const data = await response.json();

		setClubProjects((prev) => [data.project, ...prev]);

		setNewProjectName("");
		setShowProjectModal(false);
	};

	const handleAddReviewer = async () => {
		if (!activeProjectId || !reviewerEmail.trim()) return;

		const response = await fetch("/api/projects", {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				projectId: activeProjectId,
				email: reviewerEmail,
			}),
		});

		if (!response.ok) return;

		const data = await response.json();

		setClubProjects((prev) =>
			prev.map((project) => (project.id === activeProjectId ? data.project : project)),
		);

		setReviewerEmail("");
		setActiveProjectId(null);
		setShowReviewerModal(false);
	};

	const handleRemoveReviewer = async (projectId: string, email: string) => {
		const response = await fetch("/api/projects", {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				projectId,
				email,
			}),
		});

		if (!response.ok) return;

		const data = await response.json();

		setClubProjects((prev) =>
			prev.map((project) => (project.id === projectId ? data.project : project)),
		);
	};

	return (
		<>
			<section className="w-full space-y-4">
				<div className="flex w-full items-center justify-between">
					<h2 className="text-lg font-semibold">Projects</h2>

					<button className="btn btn-primary" onClick={() => setShowProjectModal(true)}>
						New Project
					</button>
				</div>

				<div className="grid w-full gap-4">
					{clubProjects.length > 0 ? (
						clubProjects.map((project) => (
							<ProjectCard
								key={project.id}
								project={project}
								onAddReviewer={() => {
									setActiveProjectId(project.id);
									setShowReviewerModal(true);
								}}
								onRemoveReviewer={(email) => handleRemoveReviewer(project.id, email)}
							/>
						))
					) : (
						<p className="opacity-70">No projects yet.</p>
					)}
				</div>
			</section>

			<Modal
				open={showProjectModal}
				title="Create Project"
				onClose={() => setShowProjectModal(false)}
				actions={
					<button className="btn btn-primary" onClick={handleCreateProject}>
						Create
					</button>
				}
			>
				<input
					type="text"
					placeholder="Project name"
					className="input input-bordered mb-4 w-full"
					value={newProjectName}
					onChange={(e) => setNewProjectName(e.target.value)}
				/>
			</Modal>

			<Modal
				open={showReviewerModal}
				title="Add Reviewer"
				onClose={() => setShowReviewerModal(false)}
				actions={
					<button className="btn btn-primary" onClick={handleAddReviewer}>
						Add
					</button>
				}
			>
				<input
					type="email"
					placeholder="Reviewer email"
					className="input input-bordered mb-4 w-full"
					value={reviewerEmail}
					onChange={(e) => setReviewerEmail(e.target.value)}
				/>
			</Modal>
		</>
	);
}
