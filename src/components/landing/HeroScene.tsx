import { motion } from "framer-motion";
import { useMouseParallax } from "../../hooks/useMouseParallax";
import { freelancers, liveHiring } from "../../data/mockData";
import { Sparkles, Zap, ArrowUpRight } from "lucide-react";
import { MagneticButton } from "../ui/MagneticButton";
import { Link } from "react-router-dom";

const floatingCards = [
  { type: "profile", data: freelancers[0], x: "8%", y: "18%", rot: -4, delay: 0 },
  { type: "project", title: "Dashboard v3", budget: "$12k", x: "72%", y: "12%", rot: 3, delay: 0.1 },
  { type: "ai", text: "94% match — Maya is ideal for your fintech UI", x: "78%", y: "58%", rot: -2, delay: 0.2 },
  { type: "profile", data: freelancers[1], x: "4%", y: "62%", rot: 5, delay: 0.15 },
  { type: "match", names: "Maya × Vault", score: 94, x: "62%", y: "72%", rot: -3, delay: 0.25 },
];

export function HeroScene() {
  const parallax = useMouseParallax(0.015);

  return (
    <section className="relative min-h-[100vh] overflow-hidden pt-28 pb-20 md:pt-32">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(232,168,124,0.12), transparent), radial-gradient(ellipse 60% 40% at 90% 80%, rgba(110,231,183,0.06), transparent)",
        }}
      />

      <div className="relative mx-auto max-w-[1400px] px-4 md:px-8">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-8 items-start">
          <div className="lg:pr-8 z-10">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-[13px] uppercase tracking-[0.2em] text-[var(--color-muted)] mb-6"
            >
              AI-powered talent marketplace
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-display text-[clamp(2.5rem,6vw,4.5rem)] font-medium leading-[1.05] text-[var(--color-text)] max-w-[14ch]"
            >
              Find Talent.
              <br />
              <span className="italic text-[var(--color-warm)]">Build Faster.</span>
              <br />
              Powered by AI.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-8 text-lg text-[var(--color-muted)] max-w-md leading-relaxed"
            >
              SkillSync matches you with verified freelancers in seconds — not weeks.
              Smart proposals, portfolio insights, and live collaboration built in.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <MagneticButton to="/talent" variant="primary">
                Explore Talent <ArrowUpRight size={16} />
              </MagneticButton>
              <MagneticButton to="/projects/vault-redesign" variant="outline">
                View a Project
              </MagneticButton>
            </motion.div>
          </div>

          <div className="relative hidden lg:block h-[520px]">
            {floatingCards.map((card, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: card.x,
                  top: card.y,
                  ["--rot" as string]: `${card.rot}deg`,
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: parallax.x * (i + 1) * 0.5,
                  y: parallax.y * (i + 1) * 0.5,
                }}
                transition={{ delay: 0.3 + card.delay, duration: 0.6 }}
              >
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
                  style={{ rotate: card.rot }}
                >
                  {card.type === "profile" && card.data && (
                    <Link to={`/profile/${card.data.id}`} className="glass block w-[200px] rounded-xl p-4 hover:border-[var(--color-warm)]/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <div
                          className="h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ background: `${card.data.color}22`, color: card.data.color }}
                        >
                          {card.data.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{card.data.name}</p>
                          <p className="text-[11px] text-[var(--color-muted)]">{card.data.role}</p>
                        </div>
                      </div>
                      <p className="mt-3 text-[11px] text-[var(--color-mint)]">{card.data.match}% match</p>
                    </Link>
                  )}
                  {card.type === "project" && (
                    <div className="glass w-[160px] rounded-xl p-3 border-l-2 border-l-[var(--color-warm)]">
                      <p className="text-[11px] text-[var(--color-muted)]">Active project</p>
                      <p className="text-sm font-medium mt-1">{card.title}</p>
                      <p className="text-xs text-[var(--color-warm)] mt-2">{card.budget}</p>
                    </div>
                  )}
                  {card.type === "ai" && (
                    <div className="glass flex gap-2 w-[220px] rounded-2xl p-3 items-start">
                      <Sparkles size={14} className="text-[var(--color-warm)] shrink-0 mt-0.5" />
                      <p className="text-[12px] leading-snug text-[var(--color-muted)]">{card.text}</p>
                    </div>
                  )}
                  {card.type === "match" && (
                    <div className="glass rounded-full px-4 py-2 flex items-center gap-2">
                      <Zap size={14} className="text-[var(--color-mint)]" />
                      <span className="text-xs">{card.names}</span>
                      <span className="text-xs font-bold text-[var(--color-mint)]">{card.score}%</span>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            ))}

            <HiringFeed />
          </div>
        </div>

        <MobileHeroCards />
      </div>
    </section>
  );
}

function HiringFeed() {
  return (
    <motion.div
      className="absolute bottom-4 left-0 w-[280px] glass rounded-xl overflow-hidden"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.8 }}
    >
      <div className="px-3 py-2 border-b border-[var(--color-border)] flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-mint)] animate-pulse" />
        <span className="text-[11px] text-[var(--color-muted)]">Live hiring activity</span>
      </div>
      <div className="max-h-[120px] overflow-hidden">
        <motion.div
          animate={{ y: [0, -120] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        >
          {[...liveHiring, ...liveHiring].map((item, i) => (
            <div key={i} className="px-3 py-2.5 border-b border-[var(--color-border)] last:border-0 text-[12px]">
              <span className="text-[var(--color-text)]">{item.client}</span>
              <span className="text-[var(--color-muted)]"> hired </span>
              <span>{item.role}</span>
              <span className="float-right text-[var(--color-muted)]">{item.time}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

function MobileHeroCards() {
  return (
    <div className="lg:hidden mt-12 space-y-3">
      {freelancers.slice(0, 2).map((f, i) => (
        <Link
          key={f.id}
          to={`/profile/${f.id}`}
          className="glass flex items-center gap-4 p-4 rounded-xl"
          style={{ marginLeft: i % 2 === 0 ? 0 : 24 }}
        >
          <div
            className="h-12 w-12 rounded-full flex items-center justify-center font-bold"
            style={{ background: `${f.color}22`, color: f.color }}
          >
            {f.avatar}
          </div>
          <div className="flex-1">
            <p className="font-medium">{f.name}</p>
            <p className="text-sm text-[var(--color-muted)]">{f.role}</p>
          </div>
          <span className="text-sm text-[var(--color-mint)]">{f.match}%</span>
        </Link>
      ))}
    </div>
  );
}
