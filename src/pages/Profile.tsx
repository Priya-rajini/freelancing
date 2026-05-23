import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { freelancers, reviews, skillGraph, portfolioItems } from "../data/mockData";
import { RevealSection } from "../components/ui/RevealSection";
import { Shield, Star, ArrowLeft } from "lucide-react";

export function Profile() {
  const { id } = useParams();
  const person = freelancers.find((f) => f.id === id) ?? freelancers[0];

  return (
    <div className="min-h-screen">
      <div
        className="h-[280px] md:h-[340px] relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${person.color}15 0%, transparent 50%), linear-gradient(225deg, var(--color-elevated) 0%, var(--color-void) 100%)`,
        }}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.02\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--color-void)] to-transparent" />
        <Link
          to="/talent"
          className="absolute top-28 left-4 md:left-8 flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)]"
        >
          <ArrowLeft size={16} /> Back
        </Link>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 md:px-8 -mt-20 relative z-10 pb-24">
        <div className="flex flex-col md:flex-row gap-8 items-end">
          <div
            className="h-28 w-28 rounded-2xl border-4 border-[var(--color-void)] flex items-center justify-center text-2xl font-bold shadow-2xl"
            style={{ background: `${person.color}22`, color: person.color }}
          >
            {person.avatar}
          </div>
          <div className="flex-1 pb-2">
            <h1 className="text-display text-3xl md:text-4xl font-medium">{person.name}</h1>
            <p className="text-[var(--color-muted)] mt-1">{person.role} · {person.location}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {person.verified.map((v) => (
                <span key={v} className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-[var(--color-mint)]/10 text-[var(--color-mint)] border border-[var(--color-mint)]/20">
                  <Shield size={10} /> AI Verified · {v}
                </span>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pb-2">
            <button className="px-6 py-2.5 rounded-full bg-[var(--color-warm)] text-[#0a0a0b] font-medium text-sm">
              Hire {person.name.split(" ")[0]}
            </button>
            <button className="px-6 py-2.5 rounded-full border border-[var(--color-border-strong)] text-sm">
              Message
            </button>
          </div>
        </div>

        <p className="mt-8 text-lg text-[var(--color-muted)] max-w-2xl leading-relaxed">{person.bio}</p>

        <div className="grid lg:grid-cols-[1fr_340px] gap-12 mt-20">
          <div className="space-y-20">
            <RevealSection>
              <h2 className="text-display text-2xl font-medium mb-8">Work timeline</h2>
              <div className="relative pl-8 border-l border-[var(--color-border)] space-y-10">
                {[
                  { year: "2026", title: "Vault Finance Dashboard", type: "Lead Designer" },
                  { year: "2025", title: "Helix AI Product Suite", type: "Design Consultant" },
                  { year: "2024", title: "Stripe Design Systems", type: "Senior Designer" },
                ].map((item, i) => (
                  <motion.div
                    key={item.year}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="relative"
                  >
                    <span className="absolute -left-[33px] top-1 h-2.5 w-2.5 rounded-full bg-[var(--color-warm)] ring-4 ring-[var(--color-void)]" />
                    <span className="text-[11px] text-[var(--color-muted)] font-mono">{item.year}</span>
                    <h3 className="font-medium mt-1">{item.title}</h3>
                    <p className="text-sm text-[var(--color-muted)]">{item.type}</p>
                  </motion.div>
                ))}
              </div>
            </RevealSection>

            <RevealSection>
              <div className="flex items-end justify-between mb-8">
                <h2 className="text-display text-2xl font-medium">Portfolio</h2>
                <Link to="/portfolio" className="text-sm text-[var(--color-warm)]">Full gallery →</Link>
              </div>
              <div className="columns-2 gap-4 space-y-4">
                {portfolioItems.slice(0, 4).map((item, i) => (
                  <div
                    key={item.id}
                    className={`break-inside-avoid rounded-xl overflow-hidden group cursor-pointer ${
                      i === 0 ? "mb-4" : ""
                    }`}
                  >
                    <div className="relative aspect-auto">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                        <p className="font-medium text-sm">{item.title}</p>
                        <p className="text-[11px] text-[var(--color-muted)]">{item.metrics.conversion} conv.</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </RevealSection>

            <RevealSection>
              <h2 className="text-display text-2xl font-medium mb-8">Client reviews</h2>
              <div className="space-y-6">
                {reviews.map((r, ri) => (
                  <div key={r.client} className="glass rounded-xl p-6 max-w-xl" style={{ marginLeft: ri % 2 === 1 ? "auto" : 0 }}>
                    <div className="flex gap-1 mb-3">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} size={14} className="fill-[var(--color-warm)] text-[var(--color-warm)]" />
                      ))}
                    </div>
                    <p className="text-[var(--color-muted)] leading-relaxed">"{r.text}"</p>
                    <p className="mt-4 text-sm text-[var(--color-muted)]">— {r.client}, {r.date}</p>
                  </div>
                ))}
              </div>
            </RevealSection>
          </div>

          <aside className="space-y-8">
            <RevealSection direction="right">
              <div className="glass rounded-2xl p-6">
                <h3 className="font-medium mb-6">Skill graph</h3>
                <div className="space-y-4">
                  {skillGraph.map((s) => (
                    <div key={s.skill}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span>{s.skill}</span>
                        <span className="text-[var(--color-muted)]">{s.level}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: `linear-gradient(90deg, ${person.color}, var(--color-mint))` }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${s.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </RevealSection>

            <RevealSection direction="right" delay={0.1}>
              <div className="glass rounded-2xl p-6 border-l-2 border-l-[var(--color-warm)]">
                <p className="text-[11px] uppercase tracking-wider text-[var(--color-muted)]">AI Portfolio Review</p>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">
                  Strong visual consistency across fintech projects. Motion design is an untapped strength — consider highlighting 2–3 micro-interaction case studies.
                </p>
              </div>
            </RevealSection>

            <RevealSection direction="right" delay={0.15}>
              <h3 className="font-medium mb-4">Activity</h3>
              <div className="space-y-3 text-sm text-[var(--color-muted)]">
                <p>Completed milestone on Vault Finance · 2d ago</p>
                <p>Posted in design-systems · 4d ago</p>
                <p>Earned Accessibility badge · 1w ago</p>
              </div>
            </RevealSection>
          </aside>
        </div>
      </div>
    </div>
  );
}
