import type { Project, ProjectProposal } from "../context/ProjectContext";
import { SAMPLE_FREELANCER, SAMPLE_FREELANCER_ID, SAMPLE_PROPOSAL_MESSAGE } from "../data/sampleFreelancer";
import type { TalentProfile } from "./matching";
import { computeMatch } from "./matching";

export function syncProjectProposalsWithTalent(
  projects: Project[],
  talentPool: TalentProfile[]
): Project[] {
  return projects.map((project) => {
    const proposals = (project.proposals ?? []).map((prop) => {
      const freelancer = talentPool.find((t) => t.id === prop.freelancerId);
      if (!freelancer) return prop;
      const { matchScore } = computeMatch(project, freelancer);
      if (prop.matchScore === matchScore) return prop;
      return { ...prop, matchScore };
    });
    const changed = proposals.some(
      (p, i) => p.matchScore !== (project.proposals ?? [])[i]?.matchScore
    );
    if (!changed) return project;
    return { ...project, proposals, proposalsCount: proposals.length };
  });
}

export function createSampleProposal(project: Project): ProjectProposal {
  const match = computeMatch(project, SAMPLE_FREELANCER);
  return {
    id: `prop-${SAMPLE_FREELANCER_ID}-${project.id}`,
    freelancerId: SAMPLE_FREELANCER_ID,
    coverMessage: SAMPLE_PROPOSAL_MESSAGE,
    matchScore: match.matchScore,
    submittedAt: new Date().toISOString(),
  };
}

export function withSampleProposalIfMissing(project: Project): Project {
  const proposals = project.proposals ?? [];
  if (proposals.some((p) => p.freelancerId === SAMPLE_FREELANCER_ID)) {
    return { ...project, proposals, proposalsCount: proposals.length };
  }
  const next = [...proposals, createSampleProposal(project)];
  return { ...project, proposals: next, proposalsCount: next.length };
}
