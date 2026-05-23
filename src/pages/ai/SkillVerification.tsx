import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RevealSection } from "../../components/ui/RevealSection";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Check } from "lucide-react";

const questions = [
  {
    q: "Which WCAG level requires color contrast ratio of at least 4.5:1 for normal text?",
    options: ["Level A", "Level AA", "Level AAA", "None"],
    correct: 1,
  },
  {
    q: "What is the primary purpose of focus indicators in accessible UI?",
    options: ["Decoration", "Keyboard navigation visibility", "SEO", "Performance"],
    correct: 1,
  },
  {
    q: "Which ARIA attribute announces dynamic content changes to screen readers?",
    options: ["aria-hidden", "aria-live", "aria-label", "role='button'"],
    correct: 1,
  },
];

export function SkillVerification() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const current = questions[step];

  const submit = () => {
    if (selected === null) return;
    const correct = selected === current.correct;
    if (correct) setScore((s) => s + 1);
    if (step < questions.length - 1) {
      setStep((s) => s + 1);
      setSelected(null);
    } else {
      setDone(true);
    }
  };

  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="mx-auto max-w-[600px] px-4 md:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] mb-8">
          <ArrowLeft size={16} /> Back
        </Link>

        <RevealSection>
          <div className="flex items-center gap-3">
            <Shield className="text-[var(--color-mint)]" size={28} />
            <div>
              <h1 className="text-display text-3xl font-medium">Skill Verification</h1>
              <p className="text-[var(--color-muted)] text-sm">Accessibility · UI/UX</p>
            </div>
          </div>
        </RevealSection>

        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="mt-12"
            >
              <div className="flex gap-2 mb-8">
                {questions.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full ${i <= step ? "bg-[var(--color-mint)]" : "bg-white/10"}`}
                  />
                ))}
              </div>

              <p className="text-sm text-[var(--color-muted)] mb-2">Question {step + 1} of {questions.length}</p>
              <h2 className="text-xl font-medium leading-relaxed">{current.q}</h2>

              <div className="mt-8 space-y-3">
                {current.options.map((opt, i) => (
                  <button
                    key={opt}
                    onClick={() => setSelected(i)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      selected === i
                        ? "border-[var(--color-mint)] bg-[var(--color-mint)]/10"
                        : "border-[var(--color-border)] hover:border-[var(--color-border-strong)]"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              <button
                onClick={submit}
                disabled={selected === null}
                className="mt-8 w-full py-3 rounded-xl bg-[var(--color-warm)] text-[#0a0a0b] font-medium disabled:opacity-40 transition-opacity"
              >
                {step < questions.length - 1 ? "Next" : "Finish"}
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-12 glass rounded-2xl p-10 text-center"
            >
              <div className="h-16 w-16 rounded-full bg-[var(--color-mint)]/20 flex items-center justify-center mx-auto">
                <Check size={32} className="text-[var(--color-mint)]" />
              </div>
              <h2 className="text-display text-2xl font-medium mt-6">Verified!</h2>
              <p className="text-[var(--color-muted)] mt-2">
                You scored {score}/{questions.length}. Badge added to your profile.
              </p>
              <span className="inline-flex items-center gap-1 mt-6 text-sm px-4 py-2 rounded-full bg-[var(--color-mint)]/10 text-[var(--color-mint)] border border-[var(--color-mint)]/20">
                <Shield size={14} /> AI Verified · Accessibility
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
