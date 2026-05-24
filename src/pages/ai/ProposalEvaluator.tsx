import { useMemo } from "react";
import { motion } from "framer-motion";
import { RevealSection } from "../../components/ui/RevealSection";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useTalent } from "../../context/TalentContext";
import { useProjects } from "../../context/ProjectContext";
import {
  buildCandidateSummary,
  buildProposalMetrics,
  computeMatch,
} from "../../utils/matching";

const metricLabels = [
  { key: "skillsOverlap" as const, label: "Skills overlap" },
  { key: "experienceFit" as const, label: "Experience fit" },
  { key: "profileStrength" as const, label: "Profile strength" },
  { key: "overall" as const, label: "Overall match" },
];

export function ProposalEvaluator() {
  const [searchParams] = useSearchParams();
  const freelancerId = searchParams.get("freelancerId");
  const projectId = searchParams.get("projectId");
  const { getTalentById } = useTalent();
  const { projects } = useProjects();

  const evaluation = useMemo(() => {
    if (!freelancerId || !projectId) return null;

    const freelancer = getTalentById(freelancerId);
    const project = projects.find((p) => p.id === projectId);
    if (!freelancer || !project) return null;

    const match = computeMatch(project, freelancer);
    const metrics = buildProposalMetrics(project, match);
    const summary = buildCandidateSummary(project, match, metrics);

    return { freelancer, project, match, metrics, summary };
  }, [freelancerId, projectId, getTalentById, projects]);

  if (!freelancerId || !projectId) {
    return (
      <div className="pt-28 pb-24 min-h-screen">
        <div className="mx-auto max-w-[640px] px-4 md:px-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] mb-8"
          >
            <ArrowLeft size={16} /> Back to dashboard
          </Link>
          <p className="text-[var(--color-muted)]">
            Select a candidate from your dashboard matches, then choose Evaluate Proposal.
          </p>
        </div>
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="pt-28 pb-24 min-h-screen">
        <div className="mx-auto max-w-[640px] px-4 md:px-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] mb-8"
          >
            <ArrowLeft size={16} /> Back to dashboard
          </Link>
          <p className="text-[var(--color-muted)]">
            This candidate or project is no longer available. Post a project or refresh your talent pool.
          </p>
        </div>
      </div>
    );
  }

  const { freelancer, project, match, metrics, summary } = evaluation;

  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="mx-auto max-w-[640px] px-4 md:px-8">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] mb-8"
        >
          <ArrowLeft size={16} /> Back to dashboard
        </Link>

        <RevealSection>
          <h1 className="text-display text-3xl font-medium">Proposal evaluation</h1>
          <p className="text-[var(--color-muted)] mt-2">
            {freelancer.name} · {project.title}
          </p>
        </RevealSection>

        <RevealSection delay={0.1} className="mt-8">
          <div className="glass rounded-2xl p-6">
            <h2 className="text-sm font-medium text-white mb-3">Summary</h2>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed">{summary}</p>
            <p className="text-xs text-[var(--color-muted)] mt-4">
              {freelancer.headline}
              {freelancer.location ? ` · ${freelancer.location}` : ""}
              {freelancer.availability !== "Not specified"
                ? ` · ${freelancer.availability}`
                : ""}
            </p>
          </div>
        </RevealSection>

        <RevealSection delay={0.15} className="mt-6">
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-medium text-white">Match metrics</h2>
              <span className="text-2xl font-bold text-[var(--color-warm)]">{match.matchScore}%</span>
            </div>
            <div className="space-y-5">
              {metricLabels.map((item, i) => {
                const value = metrics[item.key];
                return (
                  <div key={item.key}>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{item.label}</span>
                      <span className="text-[var(--color-muted)]">{value}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-[var(--color-warm)] to-[var(--color-mint)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${value}%` }}
                        transition={{ delay: 0.1 + i * 0.08, duration: 0.6 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </RevealSection>
      </div>
    </div>
  );
}
