import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { freelancers, reviews, skillGraph, portfolioItems } from "../data/mockData";
import { RevealSection } from "../components/ui/RevealSection";
import { ShieldCheck, ShieldAlert, Star, ArrowLeft, Edit2, Plus } from "lucide-react";
import { useUser } from "../context/UserContext";
import { useState } from "react";
import { CompletenessWidget } from "../components/ui/CompletenessWidget";
import { VerificationModal } from "../components/ui/VerificationModal";

export function Profile() {
  const { id } = useParams();
  const { user, updateBio, addSkill, removeSkill } = useUser();

  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState(user.bio || "Former Stripe design lead. I craft interfaces that feel inevitable.");
  const [newSkill, setNewSkill] = useState("");
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);

  // Determine if this is the active user's own profile page (Maya Chen)
  const isOwnProfile = id === "maya-chen" || id === "me" || !id;

  const person = isOwnProfile
    ? {
        ...freelancers[0],
        name: user.name,
        role: user.role
          ? user.role === "both"
            ? "Hybrid Freelancer & Client"
            : user.role.charAt(0).toUpperCase() + user.role.slice(1)
          : "Role Unspecified",
        bio: user.bio || "No biography added yet. Click the edit icon to share your experience!",
        skills: user.skills,
        verified: user.verification.status === "verified"
          ? [user.verification.method === "student_id" ? "Student ID" : "LinkedIn"]
          : [],
      }
    : (freelancers.find((f) => f.id === id) ?? freelancers[0]);

  // Combine mock portfolio with any live added portfolio items
  const displayPortfolio = isOwnProfile
    ? [...user.portfolioItems, ...portfolioItems.slice(0, 4)]
    : portfolioItems.slice(0, 4);

  // Map user.skills to graph data
  const displaySkillGraph = isOwnProfile
    ? user.skills.map((skill, idx) => ({
        skill,
        level: idx === 0 ? 95 : idx === 1 ? 88 : idx === 2 ? 80 : 75,
      }))
    : skillGraph;

  return (
    <div className="min-h-screen bg-[var(--color-void)]">
      <div
        className="h-[280px] md:h-[340px] relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${person.color}15 0%, transparent 50%), linear-gradient(225deg, var(--color-elevated) 0%, var(--color-void) 100%)`,
        }}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.02\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--color-void)] to-transparent" />
        <Link
          to="/dashboard"
          className="absolute top-28 left-4 md:left-8 flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)]"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 md:px-8 -mt-20 relative z-10 pb-24">
        {/* Profile Info Header */}
        <div className="flex flex-col md:flex-row gap-8 items-end">
          <div
            className="h-28 w-28 rounded-2xl border-4 border-[var(--color-void)] flex items-center justify-center text-2xl font-bold shadow-2xl relative"
            style={{ background: `${person.color}22`, color: person.color }}
          >
            {person.avatar}
            {isOwnProfile && user.verification.status === "verified" && (
              <span className="absolute -bottom-2 -right-2 h-6 w-6 rounded-full bg-[var(--color-mint)] border-4 border-[var(--color-void)] flex items-center justify-center text-[10px] text-black">
                ✓
              </span>
            )}
          </div>
          
          <div className="flex-1 pb-2">
            <h1 className="text-display text-3xl md:text-4xl font-medium">{person.name}</h1>
            <p className="text-[var(--color-muted)] mt-1">{person.role} · {person.location}</p>
            
            <div className="flex flex-wrap gap-2 mt-4">
              {person.verified.length > 0 ? (
                person.verified.map((v) => (
                  <span
                    key={v}
                    className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full bg-[var(--color-mint)]/10 text-[var(--color-mint)] border border-[var(--color-mint)]/20 font-mono"
                  >
                    <ShieldCheck size={12} /> AI Verified · {v}
                  </span>
                ))
              ) : isOwnProfile ? (
                <button
                  onClick={() => setIsVerifyOpen(true)}
                  className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full bg-[var(--color-warm)]/10 text-[var(--color-warm)] border border-[var(--color-warm)]/20 font-mono hover:bg-[var(--color-warm)]/20 transition-all animate-pulse"
                >
                  <ShieldAlert size={12} /> Identity Unverified · Verify Now
                </button>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-white/5 text-[var(--color-muted)] border border-white/5 font-mono">
                  Self-Declared Account
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-3 pb-2">
            {!isOwnProfile && (
              <>
                <button className="px-6 py-2.5 rounded-full bg-[var(--color-warm)] text-[#0a0a0b] font-medium text-sm">
                  Hire {person.name.split(" ")[0]}
                </button>
                <button className="px-6 py-2.5 rounded-full border border-[var(--color-border-strong)] text-sm">
                  Message
                </button>
              </>
            )}
          </div>
        </div>

        {/* Biography */}
        <div className="mt-8 max-w-2xl">
          {isOwnProfile ? (
            <div className="group relative">
              {isEditingBio ? (
                <div className="space-y-3">
                  <textarea
                    value={bioInput}
                    onChange={(e) => setBioInput(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-base text-white focus:outline-none focus:border-[var(--color-warm)]/30 resize-none"
                    rows={4}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        updateBio(bioInput.trim());
                        setIsEditingBio(false);
                      }}
                      className="px-4 py-2 text-xs font-semibold rounded-full bg-[var(--color-warm)] text-black hover:opacity-90 transition-all"
                    >
                      Save Biography
                    </button>
                    <button
                      onClick={() => {
                        setBioInput(user.bio);
                        setIsEditingBio(false);
                      }}
                      className="px-4 py-2 text-xs rounded-full border border-white/10 text-[var(--color-muted)] hover:text-white transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-4">
                  <p className="text-lg text-[var(--color-muted)] max-w-xl leading-relaxed">
                    {person.bio}
                  </p>
                  <button
                    onClick={() => {
                      setBioInput(user.bio);
                      setIsEditingBio(true);
                    }}
                    className="p-2 rounded-lg hover:bg-white/5 text-[var(--color-muted)] hover:text-white transition-all opacity-0 group-hover:opacity-100 shrink-0"
                    title="Edit biography"
                  >
                    <Edit2 size={16} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p className="text-lg text-[var(--color-muted)] max-w-2xl leading-relaxed">{person.bio}</p>
          )}
        </div>

        {/* Content Columns */}
        <div className="grid lg:grid-cols-[1fr_340px] gap-12 mt-20">
          <div className="space-y-20">
            {/* Timeline */}
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

            {/* Portfolio Grid */}
            <RevealSection>
              <div className="flex items-end justify-between mb-8">
                <h2 className="text-display text-2xl font-medium">Portfolio</h2>
                <Link to="/portfolio" className="text-sm text-[var(--color-warm)] hover:underline">Full gallery →</Link>
              </div>
              
              {displayPortfolio.length === 0 ? (
                <div className="border border-dashed border-white/10 rounded-xl p-8 text-center text-sm text-[var(--color-muted)] bg-white/[0.005]">
                  No portfolio items uploaded yet. Complete your checklist to add your first work showcase!
                </div>
              ) : (
                <div className="columns-2 gap-4 space-y-4">
                  {displayPortfolio.map((item, i) => (
                    <div
                      key={item.id}
                      className={`break-inside-avoid rounded-xl overflow-hidden group cursor-pointer border border-white/5 hover:border-white/10 transition-all ${
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
                          <p className="font-medium text-sm text-white">{item.title}</p>
                          <p className="text-[11px] text-[var(--color-muted)] mt-0.5">{item.metrics.conversion} conv. · {item.category}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </RevealSection>

            {/* Client Reviews */}
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
                    <p className="mt-4 text-sm text-[var(--color-muted)] font-mono">— {r.client}, {r.date}</p>
                  </div>
                ))}
              </div>
            </RevealSection>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Show Completeness Widget on own profile to nudge completion */}
            {isOwnProfile && (
              <RevealSection direction="right">
                <CompletenessWidget />
              </RevealSection>
            )}

            {/* Skill Graph */}
            <RevealSection direction="right" delay={0.05}>
              <div className="glass rounded-2xl p-6 bg-white/[0.01]">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-medium text-sm">Skill graph</h3>
                  {isOwnProfile && (
                    <button
                      onClick={() => setIsEditingSkills(!isEditingSkills)}
                      className="text-[10px] text-[var(--color-warm)] hover:underline font-mono"
                    >
                      {isEditingSkills ? "Done" : "Manage"}
                    </button>
                  )}
                </div>

                {isEditingSkills && isOwnProfile && (
                  <div className="mb-6 p-3 rounded-lg border border-white/5 bg-white/[0.005] space-y-3">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (newSkill.trim()) {
                          addSkill(newSkill.trim());
                          setNewSkill("");
                        }
                      }}
                      className="flex gap-2"
                    >
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Add skill tag..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="p-1 rounded bg-[var(--color-warm)] text-black"
                      >
                        <Plus size={14} />
                      </button>
                    </form>

                    <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto">
                      {user.skills.map((sk) => (
                        <span
                          key={sk}
                          className="inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded bg-white/5 text-white border border-white/5"
                        >
                          {sk}
                          <button
                            type="button"
                            onClick={() => removeSkill(sk)}
                            className="text-red-400 font-bold hover:text-red-300 ml-1"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {displaySkillGraph.length === 0 ? (
                  <p className="text-xs text-[var(--color-muted)] text-center py-4">No skills tagged yet.</p>
                ) : (
                  <div className="space-y-4">
                    {displaySkillGraph.map((s) => (
                      <div key={s.skill}>
                        <div className="flex justify-between text-xs mb-1.5">
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
                )}
              </div>
            </RevealSection>

            {/* AI Review */}
            <RevealSection direction="right" delay={0.1}>
              <div className="glass rounded-2xl p-6 border-l-2 border-l-[var(--color-warm)] bg-white/[0.01]">
                <p className="text-[11px] uppercase tracking-wider text-[var(--color-muted)] font-mono">AI Portfolio Review</p>
                <p className="mt-3 text-xs leading-relaxed text-[var(--color-muted)]">
                  Strong visual consistency across fintech projects. Motion design is an untapped strength — consider highlighting 2–3 micro-interaction case studies.
                </p>
              </div>
            </RevealSection>

            {/* Activity log */}
            <RevealSection direction="right" delay={0.15}>
              <h3 className="font-medium text-sm mb-4">Activity Log</h3>
              <div className="space-y-3 text-xs text-[var(--color-muted)] font-mono">
                {isOwnProfile && user.verification.status === "verified" && (
                  <p className="text-[var(--color-mint)]">✓ Verified identity badges unlocked · Just now</p>
                )}
                {isOwnProfile && user.bio && (
                  <p>Added biography description · Just now</p>
                )}
                {isOwnProfile && user.skills.length > 1 && (
                  <p>Updated active core skills list · Just now</p>
                )}
                <p>Completed milestone on Vault Finance · 2d ago</p>
                <p>Posted in design-systems · 4d ago</p>
                <p>Earned Accessibility badge · 1w ago</p>
              </div>
            </RevealSection>
          </aside>
        </div>
      </div>

      {/* Verification modal overlay */}
      <AnimatePresence>
        {isVerifyOpen && (
          <VerificationModal isOpen={isVerifyOpen} onClose={() => setIsVerifyOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
