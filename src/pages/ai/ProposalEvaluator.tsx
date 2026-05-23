import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RevealSection } from "../../components/ui/RevealSection";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const scores = [
  { label: "Relevance to brief", score: 92, weight: 25 },
  { label: "Portfolio evidence", score: 88, weight: 25 },
  { label: "Timeline realism", score: 85, weight: 20 },
  { label: "Rate competitiveness", score: 78, weight: 15 },
  { label: "Communication clarity", score: 95, weight: 15 },
];

export function ProposalEvaluator() {
  const [animated, setAnimated] = useState(false);
  const overall = Math.round(scores.reduce((a, s) => a + (s.score * s.weight) / 100, 0));

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="mx-auto max-w-[800px] px-4 md:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] mb-8">
          <ArrowLeft size={16} /> Back
        </Link>

        <RevealSection>
          <h1 className="text-display text-4xl font-medium">Proposal Evaluator</h1>
          <p className="text-[var(--color-muted)] mt-2">Maya Chen — Vault Finance Dashboard</p>
        </RevealSection>

        <RevealSection delay={0.15} className="mt-12">
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
      </div>
    </div>
  );
}
