"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

// -----------------------------
// TYPE DEFINITIONS (we can edit this if we need to btw)
// -----------------------------
type Project = {
  id: number;
  name: string;
  reviewers: string[];
};

// -----------------------------
// MAIN COMPONENT
// -----------------------------
export default function AdminSettingsPage() {

  // -----------------------------
  // STATE VARIABLES
  // -----------------------------

  const clubName = "Club A";

  const [clubProjects, setClubProjects] = useState<Project[]>([]);

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  const [showReviewerModal, setShowReviewerModal] = useState(false);
  const [reviewerEmail, setReviewerEmail] = useState("");

  const [activeProjectId, setActiveProjectId] = useState<number | null>(null);

  const [newlyAddedId, setNewlyAddedId] = useState<number | null>(null);

  const projects = clubProjects;

  // -----------------------------
  // FUNCTIONS
  // -----------------------------

  const handleCreateProject = () => {
    if (!newProjectName) return;

    const newProject: Project = {
      id: Date.now(),
      name: newProjectName,
      reviewers: [],
    };

    setClubProjects(prev => [newProject, ...prev]);

    setNewProjectName("");
    setShowProjectModal(false);

    setNewlyAddedId(newProject.id);
    setTimeout(() => setNewlyAddedId(null), 400);
  };

  const handleAddReviewer = () => {
    if (!activeProjectId || !reviewerEmail) return;

    setClubProjects(prev =>
      prev.map(project =>
        project.id === activeProjectId
          ? { ...project, reviewers: [...project.reviewers, reviewerEmail] }
          : project
      )
    );

    setReviewerEmail("");
    setActiveProjectId(null);
    setShowReviewerModal(false);
  };

  const handleRemoveReviewer = (projectId: number, email: string) => {
    setClubProjects(prev =>
      prev.map(project =>
        project.id === projectId
          ? {
              ...project,
              reviewers: project.reviewers.filter(r => r !== email),
            }
          : project
      )
    );
  };

  // -----------------------------
  // UI 
  // -----------------------------

  return (
    <main className="min-h-screen w-full p-6 bg-base-100 text-base-content">

      {/* PAGE HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Admin Settings</h1>
      </div>

      <div className="w-full space-y-8">

        {/* CLUB SELECTION */}
        <section className="space-y-2">
          <h2 className="text-2xl font-semibold">
            Club Name: <span className="opacity-80">{clubName}</span>
          </h2>
        </section>

        {/* PROJECT SECTION */}
        <section className="space-y-4 w-full">

          <div className="flex justify-between items-center w-full">
            <h2 className="text-lg font-semibold">Projects</h2>

            <button
              className="btn btn-primary"
              disabled={false}
              onClick={() => setShowProjectModal(true)}
            >
              New Project
            </button>
          </div>

          {/* PROJECT LIST */}
          <div className="grid gap-4 w-full">

            {projects.map(project => (
              <div
                key={project.id}
                className="card bg-base-200 shadow w-full"
              >
                <div className="card-body">

                  <div className="flex justify-between items-center">
                    <h3 className="card-title">{project.name}</h3>

                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => {
                        setActiveProjectId(project.id);
                        setShowReviewerModal(true);
                      }}
                    >
                      Add Reviewer
                    </button>
                  </div>

                  <div className="text-base opacity-70">
                    <p className="font-medium mb-1">Current Reviewer(s):</p>

                    {project.reviewers.length > 0 ? (
                      <ul className="space-y-2">
                        {project.reviewers.map((rev, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span>{rev}</span>

                            <button
                              className="btn btn-xs btn-ghost text-error"
                              onClick={() => handleRemoveReviewer(project.id, rev)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>None</p>
                    )}
                  </div>

                </div>
              </div>
            ))}

            {projects.length === 0 && (
              <p className="opacity-70">No projects yet.</p>
            )}
          </div>
        </section>
      </div>

      {/* CREATE PROJECT MODAL */}
      {showProjectModal && (
        <dialog className="modal modal-open">
          <div className="modal-box bg-base-100 text-base-content">

            <h3 className="text-lg font-bold mb-4">Create Project</h3>

            <input
              type="text"
              placeholder="Project name"
              className="input input-bordered w-full mb-4"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
            />

            <div className="modal-action">
              <button className="btn" onClick={() => setShowProjectModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleCreateProject}>
                Create
              </button>
            </div>

          </div>
        </dialog>
      )}

      {/* ADD REVIEWER MODAL */}
      {showReviewerModal && (
        <dialog className="modal modal-open">
          <div className="modal-box bg-base-100 text-base-content">

            <h3 className="text-lg font-bold mb-4">Add Reviewer</h3>

            <input
              type="email"
              placeholder="Reviewer email"
              className="input input-bordered w-full mb-4"
              value={reviewerEmail}
              onChange={(e) => setReviewerEmail(e.target.value)}
            />

            <div className="modal-action">
              <button className="btn" onClick={() => setShowReviewerModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleAddReviewer}>
                Add
              </button>
            </div>

          </div>
        </dialog>
      )}

    </main>
  );
}