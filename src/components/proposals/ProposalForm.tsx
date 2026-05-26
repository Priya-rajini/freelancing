import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles, CheckCircle2 } from "lucide-react";
import { useUser } from "../../context/UserContext";
import { Link } from "react-router-dom";

interface ProposalFormProps {
  projectId: string;
  projectTitle: string;
  clientName: string;
  suggestedBudget?: string;
  suggestedTimeline?: string;
  onSuccess?: () => void;
  compact?: boolean;
}

export function ProposalForm({
  projectId,
  projectTitle,
  clientName,
  suggestedBudget = "",
  suggestedTimeline = "",
  onSuccess,
  compact = false,
}: ProposalFormProps) {
  const { user, submitProposal } = useUser();
  const [bidAmount, setBidAmount] = useState(suggestedBudget.split("–")[0]?.trim() || "");
  const [timeline, setTimeline] = useState(suggestedTimeline);
  const [coverMessage, setCoverMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const alreadySubmitted = user.proposals.some((p) => p.projectId === projectId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!bidAmount.trim()) {
      setError("Enter your bid amount.");
      return;
    }
    if (!timeline.trim()) {
      setError("Enter your proposed timeline.");
      return;
    }
    if (coverMessage.trim().length < 40) {
      setError("Cover message should be at least 40 characters.");
      return;
    }
    submitProposal(projectId, projectTitle, clientName, bidAmount.trim(), timeline.trim(), coverMessage.trim());
    setSubmitted(true);
    onSuccess?.();
  };

  if (alreadySubmitted && !submitted) {
    const existing = user.proposals.find((p) => p.projectId === projectId)!;
    return (
      <div className="glass rounded-2xl p-6 border border-[var(--color-mint)]/20">
        <div className="flex items-center gap-2 text-[var(--color-mint)] mb-3">
          <CheckCircle2 size={18} />
          <span className="font-medium text-sm">Proposal submitted</span>
        </div>
        <p className="text-sm text-[var(--color-muted)]">
          Bid <span className="text-[var(--color-text)]">{existing.bidAmount}</span> · Timeline{" "}
          <span className="text-[var(--color-text)]">{existing.timeline}</span>
        </p>
        <p className="text-[11px] text-[var(--color-muted)] mt-3">
          AI match score: <span className="text-[var(--color-warm)] font-bold">{existing.score}%</span> · Status: {existing.status}
        </p>
        <Link
          to="/ai/proposal-evaluator"
          className="inline-block mt-4 text-sm text-[var(--color-warm)] hover:underline"
        >
          View AI evaluation →
        </Link>
      </div>
    );
  }

  if (submitted) {
    const latest = user.proposals.find((p) => p.projectId === projectId);
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-2xl p-8 text-center border border-[var(--color-mint)]/25"
      >
        <CheckCircle2 size={40} className="mx-auto text-[var(--color-mint)]" />
        <h3 className="text-lg font-medium mt-4">Proposal sent</h3>
        <p className="text-sm text-[var(--color-muted)] mt-2 max-w-sm mx-auto">
          SkillSync AI scored your proposal at{" "}
          <span className="text-[var(--color-warm)] font-bold">{latest?.score ?? 88}%</span> compatibility.
        </p>
        <div className="flex flex-wrap gap-3 justify-center mt-6">
          <Link to="/dashboard" className="text-sm px-4 py-2 rounded-full bg-white/5 border border-[var(--color-border)] hover:border-[var(--color-warm)]/30">
            View in workspace
          </Link>
          <Link to="/ai/proposal-evaluator" className="text-sm px-4 py-2 rounded-full bg-[var(--color-warm)] text-[#0a0a0b] font-medium">
            See breakdown
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={compact ? "space-y-4" : "space-y-5"}>
      <div className="flex items-center gap-2 text-[11px] text-[var(--color-muted)] mb-1">
        <Sparkles size={12} className="text-[var(--color-warm)]" />
        AI will score your proposal against the brief
      </div>

      <div className={compact ? "grid grid-cols-1 gap-4" : "grid sm:grid-cols-2 gap-4"}>
        <div>
          <label className="text-[11px] uppercase tracking-wider text-[var(--color-muted)] mb-1.5 block">
            Your bid
          </label>
          <input
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            placeholder="e.g. $9,500"
            className="w-full bg-white/5 border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-warm)]/40"
          />
        </div>
        <div>
          <label className="text-[11px] uppercase tracking-wider text-[var(--color-muted)] mb-1.5 block">
            Timeline
          </label>
          <input
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
            placeholder="e.g. 7 weeks"
            className="w-full bg-white/5 border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-warm)]/40"
          />
        </div>
      </div>

      <div>
        <label className="text-[11px] uppercase tracking-wider text-[var(--color-muted)] mb-1.5 block">
          Cover message
        </label>
        <textarea
          value={coverMessage}
          onChange={(e) => setCoverMessage(e.target.value)}
          rows={compact ? 4 : 6}
          placeholder="Why you're the right fit, relevant experience, and how you'd approach this project..."
          className="w-full bg-white/5 border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-warm)]/40 resize-none leading-relaxed"
        />
        <p className="text-[10px] text-[var(--color-muted)] mt-1">{coverMessage.length} / 40 min characters</p>
      </div>

      {error && <p className="text-sm text-red-400/90">{error}</p>}

      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--color-warm)] text-[#0a0a0b] font-medium hover:shadow-[0_0_32px_rgba(232,168,124,0.25)] transition-shadow"
      >
        <Send size={16} /> Submit proposal
      </button>
    </form>
  );
}
