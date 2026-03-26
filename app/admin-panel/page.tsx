"use client";

import { useState } from "react";
import ProjectCard from "../components/ProjectCard";
import Modal from "../components/Modal";
import { Project } from "../types/types";

export default function AdminSettingsClient() {

  // -----------------------------
  // STATE VARIABLES
  // -----------------------------

  const clubName = "CLUB NAME HERE"; 

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
          ? { ...project, reviewers: project.reviewers.filter(r => r !== email) }
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

      {/* CLUB NAME SECTION */}
      <section className="space-y-2 mb-8">
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
            onClick={() => setShowProjectModal(true)}
          >
            New Project
          </button>
        </div>

        {/* PROJECT LIST */}
        <div className="grid gap-4 w-full">
          {projects.length > 0 ? (
            projects.map(project => (
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

      {/* CREATE PROJECT MODAL */}
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
          className="input input-bordered w-full mb-4"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
        />
      </Modal>

      {/* ADD REVIEWER MODAL */}
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
          className="input input-bordered w-full mb-4"
          value={reviewerEmail}
          onChange={(e) => setReviewerEmail(e.target.value)}
        />
      </Modal>

    </main>
  );
}