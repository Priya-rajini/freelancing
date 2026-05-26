import { useMemo } from "react";
import { useProjects } from "../context/ProjectContext";
import { useTalent } from "../context/TalentContext";
import {
  buildCandidateSummary,
  buildProposalMetrics,
  computeMatch,
} from "../utils/matching";

export function useLiveEvaluation(
  projectId: string | null | undefined,
  freelancerId: string | null | undefined
) {
  const { projects } = useProjects();
  const { talentPool } = useTalent();

  return useMemo(() => {
    if (!projectId || !freelancerId) return null;

    const project = projects.find((p) => p.id === projectId);
    const freelancer = talentPool.find((t) => t.id === freelancerId);
    if (!project || !freelancer) return null;

    const match = computeMatch(project, freelancer);
    const metrics = buildProposalMetrics(project, match);
    const summary = buildCandidateSummary(project, match, metrics);

    return { project, freelancer, match, metrics, summary };
  }, [projectId, freelancerId, projects, talentPool]);
}
