import { Link, useParams } from "react-router-dom";
import { getOpenProject } from "../data/mockData";
import { RevealSection } from "../components/ui/RevealSection";
import { ProposalForm } from "../components/proposals/ProposalForm";
import { ArrowLeft, MapPin, Clock, Users, Zap } from "lucide-react";

export function OpenProjectDetail() {
  const { id } = useParams();
  const project = getOpenProject(id ?? "") ?? getOpenProject("arcadia-react-dashboard")!;

  const urgencyStyles: Record<"high" | "medium" | "low", string> = {
    high: "bg-[var(--color-warm)]/15 text-[var(--color-warm)]",
    medium: "bg-white/5 text-[var(--color-muted)]",
    low: "bg-[var(--color-mint)]/10 text-[var(--color-mint)]",
  };

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] mb-8"
        >
          <ArrowLeft size={16} /> All open projects
        </Link>

        <div className="grid lg:grid-cols-[1fr_400px] gap-12 lg:gap-16 items-start">
          <div>
            <RevealSection>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-[var(--color-mint)]/10 text-[var(--color-mint)] border border-[var(--color-mint)]/20">
                  Open for proposals
                </span>
                <span className={`text-[11px] px-2.5 py-1 rounded-full ${urgencyStyles[project.urgency as keyof typeof urgencyStyles]}`}>
                  {project.urgency} priority
                </span>
              </div>
              <h1 className="text-display text-3xl md:text-4xl font-medium leading-tight">{project.title}</h1>
              <p className="text-[var(--color-muted)] mt-2">{project.client}</p>

              <div className="flex flex-wrap gap-5 mt-6 text-sm text-[var(--color-muted)]">
                <span className="flex items-center gap-1.5">
                  <span className="text-[var(--color-warm)] font-medium">{project.budget}</span>
                  <span className="text-[11px]">({project.budgetHint})</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} /> {project.timeline}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} /> {project.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users size={14} /> {project.proposalsCount} proposals
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mt-6">
                {project.skills.map((s) => (
                  <span key={s} className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 text-[var(--color-muted)]">
                    {s}
                  </span>
                ))}
              </div>
            </RevealSection>

            <RevealSection delay={0.1} className="mt-12">
              <h2 className="text-lg font-medium mb-4">About this project</h2>
              <p className="text-[var(--color-muted)] leading-[1.85] text-[17px]">{project.description}</p>
            </RevealSection>

            <RevealSection delay={0.15} className="mt-12">
              <h2 className="text-lg font-medium mb-4">Deliverables</h2>
              <ul className="space-y-3">
                {project.scope.map((item) => (
                  <li key={item} className="flex gap-3 text-[var(--color-muted)] text-[17px] leading-relaxed">
                    <Zap size={16} className="text-[var(--color-warm)] shrink-0 mt-1" />
                    {item}
                  </li>
                ))}
              </ul>
            </RevealSection>

            <p className="text-[11px] text-[var(--color-muted)] mt-8">Posted {project.posted}</p>
          </div>

          <aside className="lg:sticky lg:top-28">
            <RevealSection direction="right">
              <div className="glass rounded-2xl p-6 md:p-8 border border-[var(--color-border-strong)]">
                <h2 className="font-medium text-lg mb-1">Submit your proposal</h2>
                <p className="text-sm text-[var(--color-muted)] mb-6">
                  Custom bid, timeline, and cover message — scored by SkillSync AI.
                </p>
                <ProposalForm
                  projectId={project.id}
                  projectTitle={project.title}
                  clientName={project.client}
                  suggestedBudget={project.budget}
                  suggestedTimeline={project.timeline}
                />
              </div>
            </RevealSection>
          </aside>
        </div>
      </div>
    </div>
  );
}
