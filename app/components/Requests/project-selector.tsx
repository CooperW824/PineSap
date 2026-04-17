"use client";

import { ProjectData } from "@/lib/server/DatabaseModels/project";

export default function RequestProjectSelector({
	requestId,
	projects,
	currentProjectId,
}: {
	requestId: string;
	projects: ProjectData[];
	currentProjectId: string | null;
}) {
	const handleProjectChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newProjectId = e.target.value || null;
		await fetch(`/api/request/?id=${requestId}`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ projectId: newProjectId }),
		});
	};

	return (
		<div>
			<p className="text-sm opacity-70">Project</p>
			<select
				className="select select-bordered w-full max-w-xs"
				defaultValue={currentProjectId || ""}
				onChange={handleProjectChange}
			>
				<option value="">No Project</option>
				{projects.map((project) => (
					<option key={project.id} value={project.id}>
						{project.name}
					</option>
				))}
			</select>
		</div>
	);
}
