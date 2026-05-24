import React, { createContext, useContext, useState, useEffect } from "react";

export type ProjectType = "Fixed" | "Hourly";
export type ProjectStatus = "Open" | "Active" | "Completed";

export interface ProjectComment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  budget: number;
  deadline: string;
  projectType: ProjectType;
  status: ProjectStatus;
  proposalsCount: number;
  comments?: ProjectComment[];
}

function normalizeProjects(raw: Project[]): Project[] {
  return raw.map((p) => ({
    ...p,
    comments: Array.isArray(p.comments) ? p.comments : [],
  }));
}

interface ProjectContextType {
  projects: Project[];
  addProject: (project: Omit<Project, "id" | "status" | "proposalsCount" | "comments">) => void;
  addComment: (projectId: string, author: string, text: string) => void;
  getProjects: () => Project[];
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem("skillsync_projects");
    if (saved) {
      try {
        return normalizeProjects(JSON.parse(saved) as Project[]);
      } catch (e) {
        console.error("Failed to parse saved projects", e);
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("skillsync_projects", JSON.stringify(projects));
  }, [projects]);

  const addProject = (
    projectData: Omit<Project, "id" | "status" | "proposalsCount" | "comments">
  ) => {
    const newProject: Project = {
      ...projectData,
      id: `p-${Date.now()}`,
      status: "Open",
      proposalsCount: 0,
      comments: [],
    };
    setProjects((prev) => [newProject, ...prev]);
  };

  const addComment = (projectId: string, author: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const comment: ProjectComment = {
      id: `c-${Date.now()}`,
      author: author.trim() || "You",
      text: trimmed,
      createdAt: new Date().toISOString(),
    };

    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, comments: [...(p.comments ?? []), comment] }
          : p
      )
    );
  };

  const getProjects = () => {
    return projects;
  };

  return (
    <ProjectContext.Provider value={{ projects, addProject, addComment, getProjects }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProjects must be used within a ProjectProvider");
  }
  return context;
}
