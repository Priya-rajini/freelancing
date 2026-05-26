import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { RevealSection } from "../ui/RevealSection";
import { MagneticButton } from "../ui/MagneticButton";
import { Link } from "react-router-dom";
import { Brain, FileSearch, Shield, BarChart3 } from "lucide-react";

export function StorySections() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start end", "end start"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <>
      <section className="py-32 md:py-40 relative">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          <div className="grid md:grid-cols-[0.45fr_0.55fr] gap-16 md:gap-24 items-end">
            <RevealSection direction="left">
              <p className="text-[13px] uppercase tracking-[0.15em] text-[var(--color-muted)] mb-4">
                The problem
              </p>
              <h2 className="text-display text-4xl md:text-5xl font-medium leading-tight">
                Hiring freelancers shouldn't feel like{" "}
                <span className="italic text-[var(--color-muted)]">archaeology.</span>
              </h2>
            </RevealSection>
            <RevealSection direction="right" delay={0.15}>
              <p className="text-lg text-[var(--color-muted)] leading-relaxed md:pl-12">
                Endless portfolios. Generic proposals. Weeks of back-and-forth.
                SkillSync replaces guesswork with AI that understands skills,
                context, and fit — before you send the first message.
              </p>
            </RevealSection>
          </div>
        </div>
      </section>

      <section ref={timelineRef} className="py-20 relative overflow-hidden">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          <div className="flex flex-col md:flex-row gap-16">
            <div className="md:w-[280px] shrink-0 md:sticky md:top-32 md:self-start">
              <RevealSection>
                <h2 className="text-display text-3xl font-medium">How it works</h2>
                <p className="mt-4 text-[var(--color-muted)] text-sm">Three steps. No fluff.</p>
              </RevealSection>
              <div className="hidden md:block relative mt-12 h-[200px] w-px bg-[var(--color-border)] ml-2">
                <motion.div
                  className="absolute top-0 left-0 w-full bg-gradient-to-b from-[var(--color-warm)] to-[var(--color-mint)] origin-top"
                  style={{ height: lineHeight }}
                />
              </div>
            </div>

            <div className="flex-1 space-y-24 md:space-y-32">
              {[
                {
                  step: "01",
                  title: "Describe your project",
                  desc: "Natural language. AI extracts scope, skills, and budget range.",
                  offset: "md:ml-0",
                },
                {
                  step: "02",
                  title: "Get matched instantly",
                  desc: "Compatibility scores based on portfolio, reviews, and availability.",
                  offset: "md:ml-16",
                  link: "/ai/smart-match",
                },
                {
                  step: "03",
                  title: "Collaborate in one workspace",
                  desc: "Milestones, discussions, proposals — like Notion, built for hiring.",
                  offset: "md:ml-8",
                  link: "/projects/vault-redesign",
                },
              ].map((item, i) => (
                <RevealSection key={item.step} delay={i * 0.1} className={item.offset}>
                  <div className="glass rounded-2xl p-8 md:p-10 max-w-xl hover:border-[var(--color-border-strong)] transition-colors">
                    <span className="text-[var(--color-warm)] text-sm font-mono">{item.step}</span>
                    <h3 className="text-display text-2xl md:text-3xl font-medium mt-4">{item.title}</h3>
                    <p className="mt-4 text-[var(--color-muted)] leading-relaxed">{item.desc}</p>
                    {item.link && (
                      <Link to={item.link} className="inline-block mt-6 text-sm text-[var(--color-warm)] hover:underline">
                        See it in action →
                      </Link>
                    )}
                  </div>
                </RevealSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 md:py-48">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          <RevealSection className="mb-20 md:mb-28 max-w-2xl">
            <h2 className="text-display text-4xl md:text-5xl font-medium">
              AI that works <span className="italic">with</span> you, not around you.
            </h2>
          </RevealSection>

          <div className="grid md:grid-cols-12 gap-6 md:gap-8">
            <AIFeatureCard
              icon={Brain}
              title="Smart Match"
              desc="Visual compatibility breakdown across skills, style, and history."
              to="/ai/smart-match"
              className="md:col-span-7 md:row-span-2"
              large
            />
            <AIFeatureCard
              icon={FileSearch}
              title="Proposal Evaluator"
              desc="Animated score breakdown for every submission."
              to="/ai/proposal-evaluator"
              className="md:col-span-5"
            />
            <AIFeatureCard
              icon={BarChart3}
              title="Portfolio Reviewer"
              desc="AI insights on craft, consistency, and market fit."
              to="/profile/maya-chen"
              className="md:col-span-5"
            />
            <AIFeatureCard
              icon={Shield}
              title="Skill Verification"
              desc="MCQ + practical tests earn badges like Verified React Developer."
              to="/ai/skill-verification"
              className="md:col-span-7"
            />
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 border-t border-[var(--color-border)]">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <h2 className="text-display text-3xl md:text-4xl font-medium max-w-lg">
              Ready to build with the right people?
            </h2>
            <MagneticButton to="/dashboard" variant="primary" className="self-center md:self-auto">
              Open your workspace
            </MagneticButton>
          </div>
        </div>
      </section>
    </>
  );
}

function AIFeatureCard({
  icon: Icon,
  title,
  desc,
  to,
  className = "",
  large = false,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  desc: string;
  to: string;
  className?: string;
  large?: boolean;
}) {
  return (
    <RevealSection className={className}>
      <Link
        to={to}
        className={`group glass block rounded-2xl p-8 h-full hover:border-[var(--color-warm)]/20 transition-all duration-500 hover:-translate-y-1 ${
          large ? "min-h-[320px] flex flex-col justify-between" : ""
        }`}
      >
        <Icon size={24} className="text-[var(--color-warm)] mb-6" />
        <div>
          <h3 className="text-xl font-medium mb-2">{title}</h3>
          <p className="text-[var(--color-muted)] text-sm leading-relaxed">{desc}</p>
        </div>
        <span className="inline-block mt-6 text-sm text-[var(--color-muted)] group-hover:text-[var(--color-warm)] transition-colors">
          Explore →
        </span>
      </Link>
    </RevealSection>
  );
}
