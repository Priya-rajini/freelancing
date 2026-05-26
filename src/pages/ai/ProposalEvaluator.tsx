import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { RevealSection } from "../../components/ui/RevealSection";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useUser } from "../../context/UserContext";

function buildScores(overall: number) {
  const jitter = (base: number) => Math.min(99, Math.max(60, base + Math.floor(Math.random() * 8) - 4));
  return [
    { label: "Relevance to brief", score: jitter(overall + 2), weight: 25 },
    { label: "Portfolio evidence", score: jitter(overall - 4), weight: 25 },
    { label: "Timeline realism", score: jitter(overall - 6), weight: 20 },
    { label: "Rate competitiveness", score: jitter(overall - 10), weight: 15 },
    { label: "Communication clarity", score: jitter(overall + 4), weight: 15 },
  ];
}

export function ProposalEvaluator() {
  const { user } = useUser();
  const latest = user.proposals[user.proposals.length - 1];
  const [animated, setAnimated] = useState(false);

  const overall = latest?.score ?? 88;
  const scores = useMemo(() => buildScores(overall), [overall]);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(t);
  }, [latest?.id]);

  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="mx-auto max-w-[800px] px-4 md:px-8">
        <Link to="/projects" className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] mb-8">
          <ArrowLeft size={16} /> Projects
        </Link>

        <RevealSection>
          <h1 className="text-display text-4xl font-medium">Proposal Evaluator</h1>
          {latest ? (
            <p className="text-[var(--color-muted)] mt-2">
              {user.name || "You"} — {latest.projectTitle}
              <span className="block text-sm mt-1">
                Bid {latest.bidAmount} · {latest.timeline}
              </span>
            </p>
          ) : (
            <p className="text-[var(--color-muted)] mt-2">
              Submit a proposal first to see your AI score breakdown.
              <Link to="/projects" className="block text-[var(--color-warm)] mt-2 hover:underline">
                Browse open projects →
              </Link>
            </p>
          )}
        </RevealSection>

        {latest && (
          <>
            <RevealSection delay={0.1} className="mt-8">
              <div className="glass rounded-xl p-5 text-sm text-[var(--color-muted)] leading-relaxed border-l-2 border-l-[var(--color-warm)]">
                <p className="text-[11px] uppercase tracking-wider text-[var(--color-muted)] mb-2">Cover message</p>
                "{latest.coverMessage}"
              </div>
            </RevealSection>

            <RevealSection delay={0.15} className="mt-8">
              <div className="glass rounded-2xl p-8 md:p-10 text-center">
                <motion.div
                  className="text-6xl font-bold text-display"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {animated ? overall : "—"}
                </motion.div>
                <p className="text-[var(--color-muted)] mt-2">Overall proposal score</p>
              </div>
            </RevealSection>

            <div className="mt-10 space-y-6">
              {scores.map((item, i) => (
                <RevealSection key={item.label} delay={0.2 + i * 0.08}>
                  <div className="glass rounded-xl p-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-medium">{item.label}</span>
                      <motion.span
                        className="text-2xl font-bold text-[var(--color-warm)]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: animated ? 1 : 0 }}
                        transition={{ delay: 0.4 + i * 0.15 }}
                      >
                        {animated ? item.score : "—"}
                      </motion.span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-[var(--color-warm)] to-[var(--color-mint)]"
                        initial={{ width: 0 }}
                        animate={{ width: animated ? `${item.score}%` : 0 }}
                        transition={{ delay: 0.5 + i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                    <p className="text-[11px] text-[var(--color-muted)] mt-2">Weight: {item.weight}%</p>
                  </div>
                </RevealSection>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
