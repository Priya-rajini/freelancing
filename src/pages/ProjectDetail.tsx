import { useState, useRef, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useProjects } from "../context/ProjectContext";
import { useTalent } from "../context/TalentContext";
import { useUser } from "../context/UserContext";
import { computeMatch } from "../utils/matching";
import { RevealSection } from "../components/ui/RevealSection";
import { ArrowLeft, X, FileText, Send } from "lucide-react";

function formatBudget(project: { projectType: string; budget: number }) {
  return project.projectType === "Fixed"
    ? `$${project.budget.toLocaleString()}`
    : `$${project.budget}/hr`;
}

function formatDeadline(deadline: string) {
  try {
    return new Date(deadline).toLocaleDateString(undefined, {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return deadline;
  }
}

function formatCommentTime(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Just now";

  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function ProjectDetail() {
  const { id } = useParams();
  const { projects, addComment } = useProjects();
  const { getTalentById } = useTalent();
  const { user } = useUser();
  const project = projects.find((p) => p.id === id);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const commentsEndRef = useRef<HTMLDivElement>(null);

  const comments = project?.comments ?? [];
  const proposals = project?.proposals ?? [];
  const authorName = user.isRegistered && user.name.trim() ? user.name.trim() : "You";

  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments.length]);

  const submitComment = () => {
    if (!project || !commentInput.trim()) return;
    addComment(project.id, authorName, commentInput);
    setCommentInput("");
  };

  if (!project) {
    return (
      <div className="pt-28 pb-24 min-h-screen">
        <div className="mx-auto max-w-[900px] px-4 md:px-8">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)]"
          >
            <ArrowLeft size={16} /> All projects
          </Link>
          <p className="mt-8 text-[var(--color-muted)]">Project not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="mx-auto max-w-[900px] px-4 md:px-8">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] mb-6"
        >
          <ArrowLeft size={16} /> All projects
        </Link>

        <RevealSection>
          <p className="text-[var(--color-muted)] text-sm capitalize">
            {project.status} · {project.projectType === "Fixed" ? "Fixed budget" : "Hourly"}
          </p>
          <h1 className="text-display text-3xl md:text-4xl font-medium mt-2">{project.title}</h1>
        </RevealSection>

        <article className="mt-12 prose-custom">
          <RevealSection delay={0.1}>
            <h2 className="text-lg font-medium mb-4">Overview</h2>
            <p className="text-[var(--color-muted)] leading-[1.8] text-[17px]">{project.description}</p>
          </RevealSection>

          <RevealSection delay={0.15} className="mt-12">
            <h2 className="text-lg font-medium mb-4">Details</h2>
            <ul className="space-y-3 text-[var(--color-muted)] text-[17px] leading-relaxed">
              <li className="flex gap-3">
                <span className="text-[var(--color-warm)]">→</span>
                Budget: {formatBudget(project)}
              </li>
              <li className="flex gap-3">
                <span className="text-[var(--color-warm)]">→</span>
                Deadline: {formatDeadline(project.deadline)}
              </li>
              <li className="flex gap-3">
                <span className="text-[var(--color-warm)]">→</span>
                {project.proposalsCount} proposal{project.proposalsCount === 1 ? "" : "s"} received
              </li>
            </ul>
          </RevealSection>

          {project.requiredSkills.length > 0 && (
            <RevealSection delay={0.2} className="mt-12">
              <h2 className="text-lg font-medium mb-4">Required skills</h2>
              <div className="flex flex-wrap gap-2">
                {project.requiredSkills.map((skill) => (
                  <span
                    key={skill}
                    className="text-sm px-3 py-1 rounded-full bg-white/5 text-[var(--color-muted)]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </RevealSection>
          )}

          <RevealSection delay={0.25} className="mt-16">
            <h2 className="text-lg font-medium mb-6">Discussion</h2>
            <div className="space-y-4 min-h-[80px]">
              {comments.length === 0 ? (
                <div className="glass rounded-xl p-6 text-sm text-[var(--color-muted)]">
                  No comments yet. Start the conversation with your freelancer.
                </div>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="glass rounded-xl p-4">
                    <p className="text-sm font-medium">{c.author}</p>
                    <p className="text-[var(--color-muted)] mt-2 text-sm leading-relaxed whitespace-pre-wrap">
                      {c.text}
                    </p>
                    <p className="text-[11px] text-[var(--color-muted)] mt-2">
                      {formatCommentTime(c.createdAt)}
                    </p>
                  </div>
                ))
              )}
              <div ref={commentsEndRef} />
            </div>
            <form
              className="mt-4 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                submitComment();
              }}
            >
              <input
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-white/5 border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-warm)]/40 text-white placeholder:text-white/30"
              />
              <button
                type="submit"
                disabled={!commentInput.trim()}
                className="px-4 rounded-xl bg-[var(--color-warm)] text-[#0a0a0b] disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                aria-label="Post comment"
              >
                <Send size={18} />
              </button>
            </form>
            {!user.isRegistered && (
              <p className="text-[11px] text-[var(--color-muted)] mt-2">
                Comments are saved to this project.{" "}
                <Link to="/dashboard" className="text-[var(--color-warm)] hover:underline">
                  Sign in from the dashboard
                </Link>{" "}
                to use your name.
              </p>
            )}
          </RevealSection>
        </article>
      </div>

      <button
        onClick={() => setDrawerOpen(true)}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 flex items-center gap-2 px-5 py-3 rounded-full glass-strong shadow-2xl hover:border-[var(--color-warm)]/30 transition-colors z-30"
      >
        <FileText size={18} />
        <span className="text-sm font-medium">
          Proposals ({project.proposalsCount})
        </span>
      </button>

      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md glass-strong border-l border-[var(--color-border)] z-50 overflow-y-auto"
            >
              <div className="p-6 border-b border-[var(--color-border)] flex justify-between items-center">
                <h3 className="font-medium">Proposals</h3>
                <button onClick={() => setDrawerOpen(false)}>
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                {proposals.length === 0 ? (
                  <p className="text-sm text-[var(--color-muted)]">
                    No proposals yet. Matches from your dashboard will appear here as freelancers apply.
                  </p>
                ) : (
                  proposals.map((proposal) => {
                    const freelancer = getTalentById(proposal.freelancerId);
                    const liveScore = freelancer
                      ? computeMatch(project, freelancer).matchScore
                      : proposal.matchScore;
                    return (
                      <div
                        key={proposal.id}
                        className="glass rounded-xl p-5 border border-white/5 hover:border-[var(--color-warm)]/20 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className="h-10 w-10 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                              style={{
                                background: `${freelancer?.color ?? "#6ee7b7"}22`,
                                color: freelancer?.color ?? "#6ee7b7",
                              }}
                            >
                              {freelancer?.avatar ?? "?"}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-sm truncate">
                                {freelancer?.name ?? "Freelancer"}
                              </p>
                              <p className="text-[11px] text-[var(--color-muted)] truncate">
                                {freelancer?.headline ?? "Applicant"}
                              </p>
                            </div>
                          </div>
                          <span className="text-sm font-bold text-[var(--color-mint)] shrink-0">
                            {liveScore}%
                          </span>
                        </div>
                        <p className="text-sm text-[var(--color-muted)] mt-3 leading-relaxed">
                          {proposal.coverMessage}
                        </p>
                        <Link
                          to={`/ai/proposal-evaluator?freelancerId=${proposal.freelancerId}&projectId=${project.id}`}
                          onClick={() => setDrawerOpen(false)}
                          className="inline-block mt-3 text-xs text-[var(--color-warm)] hover:underline"
                        >
                          Evaluate proposal →
                        </Link>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
