import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser, type UserRole } from "../../context/UserContext";
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  Plus,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { VerificationModal } from "./VerificationModal";

export function CompletenessWidget() {
  const {
    user,
    setRole,
    updateBio,
    addSkill,
    removeSkill,
    addPortfolioItem,
    updateProfileFields,
    completeness,
  } = useUser();

  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [bioText, setBioText] = useState(user.bio);
  const [skillInput, setSkillInput] = useState("");
  const [portfolioTitle, setPortfolioTitle] = useState("");
  const [portfolioCategory, setPortfolioCategory] = useState("Product");
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);

  // Dynamic preference states
  const [companyName, setCompanyName] = useState(user.companyName || "");
  const [hiringPreferences, setHiringPreferences] = useState(user.hiringPreferences || "");
  const [experienceYears, setExperienceYears] = useState(user.experienceYears || "");
  const [availability, setAvailability] = useState(user.availability || "");

  // Sync state if user settings update
  useEffect(() => {
    setBioText(user.bio);
    setCompanyName(user.companyName || "");
    setHiringPreferences(user.hiringPreferences || "");
    setExperienceYears(user.experienceYears || "");
    setAvailability(user.availability || "");
  }, [user]);

  const toggleExpand = (item: string) => {
    setExpandedItem((prev) => (prev === item ? null : item));
  };

  const handleSaveBio = () => {
    updateBio(bioText);
    setExpandedItem(null);
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (skillInput.trim()) {
      addSkill(skillInput.trim());
      setSkillInput("");
    }
  };

  const handleQuickAddSkill = (skill: string) => {
    addSkill(skill);
  };

  const handleAddPortfolio = () => {
    if (portfolioTitle.trim()) {
      // Use a nice unsplash mock image corresponding to category
      let img = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80";
      if (portfolioCategory === "Fintech") {
        img = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80";
      } else if (portfolioCategory === "AI") {
        img = "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80";
      } else if (portfolioCategory === "SaaS") {
        img = "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80";
      }
      addPortfolioItem(portfolioTitle.trim(), portfolioCategory, img);
      setPortfolioTitle("");
      setExpandedItem(null);
    }
  };

  const handleSaveClientPrefs = () => {
    updateProfileFields({ companyName, hiringPreferences });
    setExpandedItem(null);
  };

  const handleSaveFreelancerPrefs = () => {
    updateProfileFields({ experienceYears, availability });
    setExpandedItem(null);
  };

  const currentScore = completeness.score;
  const { roleSelected, verified, bioAdded, skillsAdded, portfolioAdded, clientPrefsAdded, freelancerPrefsAdded } =
    completeness.checklist;

  const isClient = user.role === "client" || (user.role === "both" && user.activeRoleView === "client");

  // Recommended skills for quick add
  const suggestedSkills = ["TypeScript", "Next.js", "AI Integrations", "Figma", "TailwindCSS", "Node.js"].filter(
    (s) => !user.skills.includes(s)
  );

  return (
    <>
      <div className="glass rounded-2xl p-6 border border-white/5 shadow-lg bg-white/[0.01]">
        {/* Score & Progress Ring */}
        <div className="flex items-center gap-5 pb-6 border-b border-white/5">
          <div className="relative h-16 w-16 shrink-0 flex items-center justify-center">
            {/* SVG circular progress indicator */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                className="stroke-white/5"
                strokeWidth="4"
                fill="transparent"
              />
              <motion.circle
                cx="32"
                cy="32"
                r="28"
                className="stroke-[var(--color-warm)]"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={176} // 2 * pi * r (2 * 3.1415 * 28)
                initial={{ strokeDashoffset: 176 }}
                animate={{ strokeDashoffset: 176 - (176 * currentScore) / 100 }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
            <span className="absolute text-sm font-semibold font-mono">{currentScore}%</span>
          </div>

          <div>
            <h3 className="text-sm font-semibold flex items-center gap-1.5">
              Profile Completeness
              {currentScore === 100 && (
                <Sparkles size={14} className="text-[var(--color-warm)] animate-pulse" />
              )}
            </h3>
            <p className="text-xs text-[var(--color-muted)] mt-1">
              {currentScore < 40
                ? "Let's build your identity foundation."
                : currentScore < 80
                ? "Looking good! Add a few details to unlock matching."
                : currentScore < 100
                ? "Almost complete. Power up your profile visibility!"
                : "Profile complete! You're receiving maximum search match ranking."}
            </p>
          </div>
        </div>

        {/* Actionable Checklist */}
        <div className="mt-5 space-y-3">
          {/* 1. ROLE SELECTION */}
          <div className="border border-white/5 rounded-xl overflow-hidden bg-white/[0.005]">
            <button
              onClick={() => toggleExpand("role")}
              className="w-full flex items-center justify-between p-3 text-left transition-colors hover:bg-white/[0.01]"
            >
              <div className="flex items-center gap-3">
                <CheckCircle
                  size={16}
                  className={roleSelected ? "text-[var(--color-mint)]" : "text-white/10"}
                />
                <span className={`text-xs ${roleSelected ? "text-[var(--color-muted)]" : "font-medium text-white"}`}>
                  Choose Role Account Preference
                </span>
              </div>
              <div className="flex items-center gap-2">
                {roleSelected && (
                  <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-[var(--color-warm)] uppercase font-mono">
                    {user.role}
                  </span>
                )}
                {expandedItem === "role" ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </div>
            </button>

            <AnimatePresence>
              {expandedItem === "role" && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  className="overflow-hidden bg-white/[0.01]"
                >
                  <div className="p-4 border-t border-white/5 space-y-3">
                    <p className="text-[11px] text-[var(--color-muted)] leading-relaxed">
                      Select your operational identity. This changes your workspace dashboards and tools.
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {(["freelancer", "client", "both"] as UserRole[]).map((r) => (
                        <button
                          key={r}
                          onClick={() => setRole(r)}
                          className={`py-2 rounded-lg text-xs capitalize font-medium border transition-all ${
                            user.role === r
                              ? "border-[var(--color-warm)] bg-[var(--color-warm)]/10 text-white"
                              : "border-white/5 bg-white/[0.01] text-[var(--color-muted)] hover:border-white/10"
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 2. IDENTITY VERIFICATION */}
          <div className="border border-white/5 rounded-xl overflow-hidden bg-white/[0.005]">
            <button
              onClick={() => toggleExpand("verification")}
              className="w-full flex items-center justify-between p-3 text-left transition-colors hover:bg-white/[0.01]"
            >
              <div className="flex items-center gap-3">
                <CheckCircle
                  size={16}
                  className={verified ? "text-[var(--color-mint)]" : "text-white/10"}
                />
                <span className={`text-xs ${verified ? "text-[var(--color-muted)]" : "font-medium text-white"}`}>
                  Verify Institutional Identity
                </span>
              </div>
              <div className="flex items-center gap-2">
                {verified ? (
                  <span className="text-[10px] text-[var(--color-mint)] flex items-center gap-0.5">
                    <ShieldCheck size={12} /> AI Verified
                  </span>
                ) : (
                  <span className="text-[10px] text-[var(--color-warm)] flex items-center gap-0.5 animate-pulse">
                    <ShieldAlert size={12} /> Required
                  </span>
                )}
                {expandedItem === "verification" ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </div>
            </button>

            <AnimatePresence>
              {expandedItem === "verification" && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  className="overflow-hidden bg-white/[0.01]"
                >
                  <div className="p-4 border-t border-white/5 space-y-3">
                    <p className="text-[11px] text-[var(--color-muted)]">
                      Upload your Student ID Card or authorize a LinkedIn profile URL to verify your talent or buyer status.
                    </p>
                    <button
                      onClick={() => setIsVerifyOpen(true)}
                      className="w-full py-2 rounded-lg bg-[var(--color-warm)] hover:bg-[var(--color-warm)]/90 text-black text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                    >
                      {verified ? "Manage Verification" : "Launch AI Verification"}
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 3. BIO DESCRIPTION */}
          <div className="border border-white/5 rounded-xl overflow-hidden bg-white/[0.005]">
            <button
              onClick={() => toggleExpand("bio")}
              className="w-full flex items-center justify-between p-3 text-left transition-colors hover:bg-white/[0.01]"
            >
              <div className="flex items-center gap-3">
                <CheckCircle
                  size={16}
                  className={bioAdded ? "text-[var(--color-mint)]" : "text-white/10"}
                />
                <span className={`text-xs ${bioAdded ? "text-[var(--color-muted)]" : "font-medium text-white"}`}>
                  {isClient ? "Write Biography (Client-Focused Bio)" : "Write Biography About Section"}
                </span>
              </div>
              <div>{expandedItem === "bio" ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</div>
            </button>

            <AnimatePresence>
              {expandedItem === "bio" && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  className="overflow-hidden bg-white/[0.01]"
                >
                  <div className="p-4 border-t border-white/5 space-y-3">
                    <textarea
                      value={bioText}
                      onChange={(e) => setBioText(e.target.value)}
                      placeholder={isClient ? "Share your company background, hiring culture, and project values..." : "Share your expertise, achievements, and core philosophy..."}
                      rows={3}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[var(--color-warm)]/30 resize-none"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setBioText(user.bio);
                          setExpandedItem(null);
                        }}
                        className="px-3 py-1.5 rounded-lg border border-white/5 text-[var(--color-muted)] text-[10px] hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveBio}
                        className="px-4 py-1.5 rounded-lg bg-white/10 text-white text-[10px] font-semibold hover:bg-white/20"
                      >
                        Save Biography
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 4. CLIENT ONLY: COMPANY / HIRING PREFERENCES */}
          {isClient && (
            <div className="border border-white/5 rounded-xl overflow-hidden bg-white/[0.005]">
              <button
                onClick={() => toggleExpand("clientPrefs")}
                className="w-full flex items-center justify-between p-3 text-left transition-colors hover:bg-white/[0.01]"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle
                    size={16}
                    className={clientPrefsAdded ? "text-[var(--color-mint)]" : "text-white/10"}
                  />
                  <span className={`text-xs ${clientPrefsAdded ? "text-[var(--color-muted)]" : "font-medium text-white"}`}>
                    Company / Hiring Preferences (Optional)
                  </span>
                </div>
                <div>{expandedItem === "clientPrefs" ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</div>
              </button>

              <AnimatePresence>
                {expandedItem === "clientPrefs" && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="overflow-hidden bg-white/[0.01]"
                  >
                    <div className="p-4 border-t border-white/5 space-y-3">
                      <div className="space-y-1">
                        <label className="block text-[9px] uppercase tracking-wider text-[var(--color-muted)] font-mono">
                          Company Name
                        </label>
                        <input
                          type="text"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="e.g. Acme Corp"
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[var(--color-warm)]/30"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[9px] uppercase tracking-wider text-[var(--color-muted)] font-mono">
                          Hiring Preferences
                        </label>
                        <input
                          type="text"
                          value={hiringPreferences}
                          onChange={(e) => setHiringPreferences(e.target.value)}
                          placeholder="e.g. Full-time, Remote, React developers"
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[var(--color-warm)]/30"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleSaveClientPrefs}
                        className="w-full py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-all"
                      >
                        Save Preferences
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* 4. FREELANCER ONLY: CORE SKILLS TAGGING */}
          {!isClient && (
            <div className="border border-white/5 rounded-xl overflow-hidden bg-white/[0.005]">
              <button
                onClick={() => toggleExpand("skills")}
                className="w-full flex items-center justify-between p-3 text-left transition-colors hover:bg-white/[0.01]"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle
                    size={16}
                    className={skillsAdded ? "text-[var(--color-mint)]" : "text-white/10"}
                  />
                  <span className={`text-xs ${skillsAdded ? "text-[var(--color-muted)]" : "font-medium text-white"}`}>
                    Core Skills Tagging ({user.skills.length}/3)
                  </span>
                </div>
                <div>{expandedItem === "skills" ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</div>
              </button>

              <AnimatePresence>
                {expandedItem === "skills" && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="overflow-hidden bg-white/[0.01]"
                  >
                    <div className="p-4 border-t border-white/5 space-y-4">
                      <form onSubmit={handleAddSkill} className="flex gap-2">
                        <input
                          type="text"
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          placeholder="Add skill tag (e.g. React)..."
                          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[var(--color-warm)]/30"
                        />
                        <button
                          type="submit"
                          className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20"
                        >
                          <Plus size={14} />
                        </button>
                      </form>

                      {/* Skill tags */}
                      {user.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {user.skills.map((skill) => (
                            <span
                              key={skill}
                              className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[var(--color-text)]"
                            >
                              {skill}
                              <button
                                type="button"
                                onClick={() => removeSkill(skill)}
                                className="text-[var(--color-muted)] hover:text-red-400"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Suggested skills */}
                      {suggestedSkills.length > 0 && (
                        <div>
                          <div className="text-[10px] text-[var(--color-muted)] mb-2 font-mono">Suggested skills:</div>
                          <div className="flex flex-wrap gap-1">
                            {suggestedSkills.slice(0, 4).map((s) => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => handleQuickAddSkill(s)}
                                className="text-[9px] px-2 py-0.5 rounded border border-white/5 text-[var(--color-muted)] hover:text-white hover:border-white/10 hover:bg-white/[0.01]"
                              >
                                + {s}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* 5. FREELANCER ONLY: PORTFOLIO */}
          {!isClient && (
            <div className="border border-white/5 rounded-xl overflow-hidden bg-white/[0.005]">
              <button
                onClick={() => toggleExpand("portfolio")}
                className="w-full flex items-center justify-between p-3 text-left transition-colors hover:bg-white/[0.01]"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle
                    size={16}
                    className={portfolioAdded ? "text-[var(--color-mint)]" : "text-white/10"}
                  />
                  <span className={`text-xs ${portfolioAdded ? "text-[var(--color-muted)]" : "font-medium text-white"}`}>
                    Showcase Work Portfolio ({user.portfolioItems.length}/1)
                  </span>
                </div>
                <div>{expandedItem === "portfolio" ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</div>
              </button>

              <AnimatePresence>
                {expandedItem === "portfolio" && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="overflow-hidden bg-white/[0.01]"
                  >
                    <div className="p-4 border-t border-white/5 space-y-4">
                      <div className="space-y-2">
                        <label className="block text-[9px] uppercase tracking-wider text-[var(--color-muted)] font-mono">
                          Project Name
                        </label>
                        <input
                          type="text"
                          value={portfolioTitle}
                          onChange={(e) => setPortfolioTitle(e.target.value)}
                          placeholder="e.g. Helix AI Sidebar redesign"
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[var(--color-warm)]/30"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-[9px] uppercase tracking-wider text-[var(--color-muted)] font-mono">
                          Domain Category
                        </label>
                        <div className="grid grid-cols-4 gap-1">
                          {["Product", "Fintech", "AI", "SaaS"].map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setPortfolioCategory(cat)}
                              className={`py-1 rounded text-[10px] border transition-all ${
                                portfolioCategory === cat
                                  ? "border-[var(--color-warm)] bg-[var(--color-warm)]/10 text-white"
                                  : "border-white/5 bg-white/[0.01] text-[var(--color-muted)] hover:border-white/10"
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddPortfolio}
                        disabled={!portfolioTitle.trim()}
                        className="w-full py-1.5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:hover:bg-white/10 text-xs font-semibold text-white transition-all"
                      >
                        Publish Work to Portfolio
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* 6. FREELANCER ONLY: EXPERIENCE / AVAILABILITY */}
          {!isClient && (
            <div className="border border-white/5 rounded-xl overflow-hidden bg-white/[0.005]">
              <button
                onClick={() => toggleExpand("freelancerPrefs")}
                className="w-full flex items-center justify-between p-3 text-left transition-colors hover:bg-white/[0.01]"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle
                    size={16}
                    className={freelancerPrefsAdded ? "text-[var(--color-mint)]" : "text-white/10"}
                  />
                  <span className={`text-xs ${freelancerPrefsAdded ? "text-[var(--color-muted)]" : "font-medium text-white"}`}>
                    Experience / Availability
                  </span>
                </div>
                <div>{expandedItem === "freelancerPrefs" ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</div>
              </button>

              <AnimatePresence>
                {expandedItem === "freelancerPrefs" && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="overflow-hidden bg-white/[0.01]"
                  >
                    <div className="p-4 border-t border-white/5 space-y-3">
                      <div className="space-y-1">
                        <label className="block text-[9px] uppercase tracking-wider text-[var(--color-muted)] font-mono">
                          Years of Experience
                        </label>
                        <input
                          type="text"
                          value={experienceYears}
                          onChange={(e) => setExperienceYears(e.target.value)}
                          placeholder="e.g. 5 years"
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[var(--color-warm)]/30"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[9px] uppercase tracking-wider text-[var(--color-muted)] font-mono">
                          Availability Status
                        </label>
                        <input
                          type="text"
                          value={availability}
                          onChange={(e) => setAvailability(e.target.value)}
                          placeholder="e.g. 20 hrs/week, Open to work"
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[var(--color-warm)]/30"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleSaveFreelancerPrefs}
                        className="w-full py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-all"
                      >
                        Save Experience & Availability
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Verification modal */}
      <AnimatePresence>
        {isVerifyOpen && (
          <VerificationModal isOpen={isVerifyOpen} onClose={() => setIsVerifyOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
