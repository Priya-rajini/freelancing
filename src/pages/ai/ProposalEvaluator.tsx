import { RevealSection } from "../../components/ui/RevealSection";
import { MatchMetricBars } from "../../components/ui/MatchMetricBars";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useLiveEvaluation } from "../../hooks/useLiveEvaluation";

export function ProposalEvaluator() {
  const [searchParams] = useSearchParams();
  const freelancerId = searchParams.get("freelancerId");
  const projectId = searchParams.get("projectId");
  const evaluation = useLiveEvaluation(projectId, freelancerId);

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
            {match.matchedSkills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {match.matchedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-mint)]/10 text-[var(--color-mint)] border border-[var(--color-mint)]/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </RevealSection>

        <RevealSection delay={0.15} className="mt-6">
          <div className="glass rounded-2xl p-6">
            <MatchMetricBars metrics={metrics} headlineScore={match.matchScore} />
          </div>
        </RevealSection>
      </div>
    </div>
  );
}
