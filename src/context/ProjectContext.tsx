import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { useTalent } from "./TalentContext";
import { SAMPLE_FREELANCER_ID } from "../data/sampleFreelancer";
import { syncProjectProposalsWithTalent, withSampleProposalIfMissing } from "../utils/proposals";

export type ProjectType = "Fixed" | "Hourly";
export type ProjectStatus = "Open" | "Active" | "Completed";

export interface ProjectComment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface ProjectProposal {
  id: string;
  freelancerId: string;
  coverMessage: string;
  matchScore: number;
  submittedAt: string;
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
  proposals?: ProjectProposal[];
  comments?: ProjectComment[];
}

function normalizeProjects(raw: Project[]): Project[] {
  return raw.map((p) => {
    const proposals = Array.isArray(p.proposals) ? p.proposals : [];
    return {
      ...p,
      proposals,
      proposalsCount: proposals.length,
      comments: Array.isArray(p.comments) ? p.comments : [],
    };
  });
}

interface ProjectContextType {
  projects: Project[];
  addProject: (
    project: Omit<Project, "id" | "status" | "proposalsCount" | "comments" | "proposals">
  ) => void;
  addComment: (projectId: string, author: string, text: string) => void;
  getProjects: () => Project[];
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const { talentPool } = useTalent();
  const sampleProposalsSeeded = useRef(false);

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem("skillsync_projects");
    if (saved) {
      try {
        return normalizeProjects(JSON.parse(saved) as Project[]).map(withSampleProposalIfMissing);
      } catch (e) {
        console.error("Failed to parse saved projects", e);
      }
    }
    return [];
  });

  const applyProjects = useCallback(
    (updater: (prev: Project[]) => Project[]) => {
      setProjects((prev) => syncProjectProposalsWithTalent(updater(prev), talentPool));
    },
    [talentPool]
  );

  useEffect(() => {
    localStorage.setItem("skillsync_projects", JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    setProjects((prev) => {
      const next = syncProjectProposalsWithTalent(prev, talentPool);
      const same =
        next.length === prev.length &&
        next.every((p, i) => {
          const a = p.proposals ?? [];
          const b = prev[i]?.proposals ?? [];
          return (
            a.length === b.length && a.every((prop, j) => prop.matchScore === b[j]?.matchScore)
          );
        });
      return same ? prev : next;
    });
  }, [talentPool]);

  const projectSkillsKey = projects
    .map((p) => `${p.id}:${(p.requiredSkills ?? []).join("|")}`)
    .join(";");

  useEffect(() => {
    setProjects((prev) => syncProjectProposalsWithTalent(prev, talentPool));
  }, [projectSkillsKey, talentPool]);

  useEffect(() => {
    if (sampleProposalsSeeded.current || projects.length === 0) return;
    const needsSeed = projects.some(
      (p) => !(p.proposals ?? []).some((prop) => prop.freelancerId === SAMPLE_FREELANCER_ID)
    );
    if (!needsSeed) {
      sampleProposalsSeeded.current = true;
      return;
    }
    applyProjects((prev) => prev.map(withSampleProposalIfMissing));
    sampleProposalsSeeded.current = true;
  }, [projects, applyProjects]);

  const addProject = (
    projectData: Omit<Project, "id" | "status" | "proposalsCount" | "comments" | "proposals">
  ) => {
    const base: Project = {
      ...projectData,
      id: `p-${Date.now()}`,
      status: "Open",
      proposals: [],
      proposalsCount: 0,
      comments: [],
    };
    const newProject = withSampleProposalIfMissing(base);
    applyProjects((prev) => [newProject, ...prev]);
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

    applyProjects((prev) =>
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
