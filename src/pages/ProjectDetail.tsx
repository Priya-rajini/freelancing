import { useState, useRef, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { milestones, projects } from "../data/mockData";
import { RevealSection } from "../components/ui/RevealSection";
import { useUser } from "../context/UserContext";
import { X, ArrowLeft, Users, FileText } from "lucide-react";

const incomingProposals = [
  { name: "Maya Chen", score: 94, rate: "$95/hr", timeline: "6 weeks" },
  { name: "James Okafor", score: 78, rate: "$120/hr", timeline: "5 weeks" },
  { name: "Elena Voss", score: 72, rate: "$140/hr", timeline: "8 weeks" },
];

export function ProjectDetail() {
  const { id } = useParams();
  const { user } = useUser();
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

  const project = projects.find((p) => p.id === id) ?? projects[0];
  const isClient =
    user.role === "client" || (user.role === "both" && user.activeRoleView === "client");

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="mx-auto max-w-[900px] px-4 md:px-8">
        <Link
          to={isClient ? "/dashboard" : "/projects"}
          className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] mb-6"
        >
          <ArrowLeft size={16} /> Back
        </Link>

        <RevealSection>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <p className="text-[var(--color-muted)] text-sm">{project.client} · {project.status}</p>
              <h1 className="text-display text-3xl md:text-4xl font-medium mt-2">{project.title}</h1>
            </div>
            {isClient && (
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl glass border border-[var(--color-border-strong)] text-sm hover:border-[var(--color-warm)]/30 transition-colors shrink-0 self-start"
              >
                <Users size={16} />
                View proposals ({incomingProposals.length})
              </button>
            )}
            {!isClient && user.role !== "client" && (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm bg-[var(--color-warm)]/15 text-[var(--color-warm)] border border-[var(--color-warm)]/25 shrink-0 self-start"
              >
                <FileText size={16} />
                Manage in workspace
              </Link>
            )}
          </div>
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
            <p className="text-sm text-[var(--color-muted)] mb-4">
              {isClient
                ? "Thread with your hired freelancer."
                : "Reply in Dashboard → Messages for full contract chat."}
            </p>
            <div className="space-y-4">
              {[
                { author: "Alex (Vault)", text: "Love the direction on the transfer flow. Can we explore a denser data table variant?", time: "Yesterday" },
                { author: "Maya Chen", text: "Absolutely — I'll add a compact view toggle in the next iteration.", time: "5h ago" },
              ].map((c) => (
                <div key={c.time} className="glass rounded-xl p-4">
                  <p className="text-sm font-medium">{c.author}</p>
                  <p className="text-[var(--color-muted)] mt-2 text-sm leading-relaxed">{c.text}</p>
                  <p className="text-[11px] text-[var(--color-muted)] mt-2">{c.time}</p>
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
            {!isClient && (
              <Link
                to="/dashboard?section=messages"
                className="inline-block mt-4 text-sm text-[var(--color-warm)] hover:underline"
              >
                Open Messages in workspace →
              </Link>
            )}
          </RevealSection>
        </article>
      </div>

      {/* Client-only: proposal drawer (no fixed corner FAB) */}
      <AnimatePresence>
        {drawerOpen && isClient && (
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
                <button type="button" onClick={() => setDrawerOpen(false)} aria-label="Close">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                {incomingProposals.map((p) => (
                  <div key={p.name} className="glass rounded-xl p-5 cursor-pointer hover:border-[var(--color-warm)]/20 transition-colors">
                    <div className="flex justify-between">
                      <span className="font-medium">{p.name}</span>
                      <span className="text-[var(--color-mint)] text-sm font-bold">{p.score}</span>
                    </div>
                    <p className="text-sm text-[var(--color-muted)] mt-1">{p.rate} · {p.timeline}</p>
                    <div className="mt-3 h-1 rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[var(--color-warm)] to-[var(--color-mint)]"
                        style={{ width: `${p.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
