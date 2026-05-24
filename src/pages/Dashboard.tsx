import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser, type UserRole } from "../context/UserContext";
import { CompletenessWidget } from "../components/ui/CompletenessWidget";
import { TaskChecklist } from "../components/ui/TaskChecklist";
import { projects } from "../data/mockData";
import { useProjects } from "../context/ProjectContext";
import { useTalent } from "../context/TalentContext";
import { computeMatches } from "../utils/matching";
import {
  LayoutGrid,
  FolderKanban,
  MessageSquare,
  Settings,
  Send,
  Sparkles,
  ChevronRight,
  Clock,
  Briefcase,
  Users,
  Globe,
  Plus,
  ShieldCheck,
  UserPlus,
  MapPin,
  Palette,
} from "lucide-react";
import { Link } from "react-router-dom";

const navItems = [
  { icon: LayoutGrid, label: "Overview", active: true },
  { icon: FolderKanban, label: "Projects" },
  { icon: MessageSquare, label: "Messages" },
  { icon: Settings, label: "Settings" },
];

const colorPalettes = [
  { value: "#e8a87c", name: "Warm Amber" },
  { value: "#6ee7b7", name: "Mint Green" },
  { value: "#7dd3fc", name: "Sky Blue" },
  { value: "#f472b6", name: "Rose Pink" },
  { value: "#c084fc", name: "Lavender" },
];

export function Dashboard() {
  const { user, signup, setRole, setActiveRoleView } = useUser();
  const { projects: clientProjects } = useProjects();
  const { talentPool, myTalentId } = useTalent();
  const [aiInput, setAiInput] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Auto-select the first project when projects load or change
  useEffect(() => {
    if (clientProjects.length > 0) {
      setSelectedProjectId((prev) => {
        if (!prev) return clientProjects[0].id;
        const exists = clientProjects.some((p) => p.id === prev);
        return exists ? prev : clientProjects[0].id;
      });
    } else {
      setSelectedProjectId(null);
    }
  }, [clientProjects]);

  const selectedProject = useMemo(() => {
    return clientProjects.find((p) => p.id === selectedProjectId) || null;
  }, [clientProjects, selectedProjectId]);

  const matches = useMemo(() => {
    if (!selectedProject) return [];
    return computeMatches(talentPool, selectedProject, myTalentId ?? undefined).slice(0, 5);
  }, [selectedProject, talentPool, myTalentId]);
  const [messages, setMessages] = useState(() => [
    {
      role: "ai",
      text: "Welcome to SkillSync! I'm your AI Workspace Assistant. Let's finish your profile setup to unlock AI Smart Matching and verify your credentials.",
    },
  ]);

  // Signup fields
  const [signupName, setSignupName] = useState("");
  const [signupLocation, setSignupLocation] = useState("");
  const [signupColor, setSignupColor] = useState("#e8a87c");
  const [signupError, setSignupError] = useState("");

  const sendAi = () => {
    if (!aiInput.trim()) return;
    setMessages((m) => [
      ...m,
      { role: "user", text: aiInput },
      {
        role: "ai",
        text: `Analyzing your workspace metrics and profile data... How else can I assist with your matching status?`,
      },
    ]);
    setAiInput("");
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError("");
    if (!signupName.trim()) {
      setSignupError("Please enter your full name.");
      return;
    }
    if (!signupLocation.trim()) {
      setSignupError("Please enter your location.");
      return;
    }
    signup(signupName.trim(), signupLocation.trim(), signupColor);
  };

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setMessages((m) => [
      ...m,
      {
        role: "ai",
        text: `Awesome! You've set your role to ${selectedRole?.toUpperCase()}. I have tailored your workspace dashboard with relevant tools. Check out the Profile Completeness widget in the sidebar!`,
      },
    ]);
  };

  // -------------------------------------------------------------
  // STATE A: NOT REGISTERED (SIGN UP FLOW)
  // -------------------------------------------------------------
  if (!user.isRegistered) {
    return (
      <div className="pt-28 pb-20 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-strong rounded-2xl p-6 md:p-8 border border-white/10 shadow-2xl relative overflow-hidden"
          >
            {/* Ambient Background Glows */}
            <div
              className="absolute -top-24 -right-24 h-48 w-48 rounded-full blur-[80px] opacity-20 transition-colors duration-500"
              style={{ backgroundColor: signupColor }}
            />

            <div className="flex items-center gap-3 mb-6">
              <div
                className="h-10 w-10 rounded-lg flex items-center justify-center transition-colors duration-300"
                style={{ backgroundColor: `${signupColor}22`, border: `1px solid ${signupColor}44`, color: signupColor }}
              >
                <UserPlus size={20} />
              </div>
              <div>
                <h1 className="text-display text-2xl font-semibold text-white">Create Account</h1>
                <p className="text-[var(--color-muted)] text-xs">Set up your SkillSync credentials</p>
              </div>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[var(--color-muted)] mb-2 font-mono">
                  Full Name
                </label>
                <input
                  type="text"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--color-warm)]/40 transition-colors"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[var(--color-muted)] mb-2 font-mono">
                  Location / City
                </label>
                <div className="relative">
                  <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
                  <input
                    type="text"
                    value={signupLocation}
                    onChange={(e) => setSignupLocation(e.target.value)}
                    placeholder="e.g. San Francisco, CA"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--color-warm)]/40 transition-colors"
                  />
                </div>
              </div>

              {/* Color Swatch */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[var(--color-muted)] mb-2 flex items-center gap-1.5 font-mono">
                  <Palette size={13} /> Profile Theme Color
                </label>
                <div className="flex items-center gap-3 py-1">
                  {colorPalettes.map((pal) => (
                    <button
                      key={pal.value}
                      type="button"
                      onClick={() => setSignupColor(pal.value)}
                      title={pal.name}
                      className={`h-7 w-7 rounded-full transition-all border-2 relative flex items-center justify-center`}
                      style={{
                        backgroundColor: pal.value,
                        borderColor: signupColor === pal.value ? "white" : "transparent",
                        transform: signupColor === pal.value ? "scale(1.1)" : "scale(1)",
                      }}
                    >
                      {signupColor === pal.value && (
                        <span className="h-1.5 w-1.5 rounded-full bg-black" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {signupError && (
                <div className="text-xs text-red-400 bg-red-950/20 border border-red-900/30 p-3 rounded-lg flex items-center gap-2">
                  <span className="shrink-0">•</span>
                  <span>{signupError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[var(--color-warm)] text-black font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mt-4"
                style={{ backgroundColor: signupColor }}
              >
                Get Started
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STATE B: NO ROLE SELECTED YET (SPLASH ROLE PICKER SCREEN)
  // -------------------------------------------------------------
  if (user.role === null) {
    return (
      <div className="pt-28 pb-20 min-h-screen flex items-center justify-center px-4 bg-[var(--color-void)]">
        <div className="max-w-4xl w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="px-3 py-1 rounded-full bg-[var(--color-warm)]/10 text-[var(--color-warm)] text-xs font-mono font-medium tracking-wide">
              Onboarding Step 2 of 2
            </span>
            <h1 className="text-display text-4xl md:text-5xl font-medium mt-4 mb-3">
              Define Your Account Role
            </h1>
            <p className="text-[var(--color-muted)] max-w-lg mx-auto text-sm leading-relaxed mb-12">
              SkillSync operates on a single-account architecture. Select the role that matches your workflow goals, and toggle views at any time.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 text-left">
            {/* CARD 1: FREELANCER */}
            <motion.div
              whileHover={{ y: -6, scale: 1.01 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, type: "spring" }}
              onClick={() => handleRoleSelect("freelancer")}
              className="glass p-6 rounded-2xl border border-white/5 cursor-pointer hover:border-[var(--color-warm)]/30 group transition-all relative overflow-hidden bg-white/[0.005]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-warm)]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="h-10 w-10 rounded-xl bg-[var(--color-warm)]/10 flex items-center justify-center text-[var(--color-warm)] mb-6 border border-[var(--color-warm)]/20">
                <Briefcase size={20} />
              </div>
              <h3 className="font-semibold text-lg mb-2 group-hover:text-[var(--color-warm)] transition-colors">
                Freelancer
              </h3>
              <p className="text-xs text-[var(--color-muted)] leading-relaxed mb-6">
                Deliver services, showcase vetted skill badges, build AI trust score, and work on high-tier projects.
              </p>
              <div className="mt-auto text-[10px] text-[var(--color-muted)] border-t border-white/5 pt-4 font-mono">
                ACTIVE JOBS: 1,480+ • AVG RATE: $95/HR
              </div>
            </motion.div>

            {/* CARD 2: CLIENT */}
            <motion.div
              whileHover={{ y: -6, scale: 1.01 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, type: "spring" }}
              onClick={() => handleRoleSelect("client")}
              className="glass p-6 rounded-2xl border border-white/5 cursor-pointer hover:border-[var(--color-mint)]/30 group transition-all relative overflow-hidden bg-white/[0.005]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-mint)]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="h-10 w-10 rounded-xl bg-[var(--color-mint)]/10 flex items-center justify-center text-[var(--color-mint)] mb-6 border border-[var(--color-mint)]/25">
                <Users size={20} />
              </div>
              <h3 className="font-semibold text-lg mb-2 group-hover:text-[var(--color-mint)] transition-colors">
                Client / Hirer
              </h3>
              <p className="text-xs text-[var(--color-muted)] leading-relaxed mb-6">
                Post custom project guidelines, search talent using AI-matching suitability score, and manage milestones.
              </p>
              <div className="mt-auto text-[10px] text-[var(--color-muted)] border-t border-white/5 pt-4 font-mono">
                TALENT CAP: 12K+ • DEPOSITED FUNDS: $4.5M
              </div>
            </motion.div>

            {/* CARD 3: BOTH */}
            <motion.div
              whileHover={{ y: -6, scale: 1.01 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, type: "spring" }}
              onClick={() => handleRoleSelect("both")}
              className="glass p-6 rounded-2xl border border-white/5 cursor-pointer hover:border-[var(--color-sky)]/30 group transition-all relative overflow-hidden bg-white/[0.005]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-sky)]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="h-10 w-10 rounded-xl bg-[var(--color-sky)]/10 flex items-center justify-center text-[var(--color-sky)] mb-6 border border-[var(--color-sky)]/25">
                <Globe size={20} />
              </div>
              <h3 className="font-semibold text-lg mb-2 group-hover:text-[var(--color-sky)] transition-colors">
                Dual Agency (Both)
              </h3>
              <p className="text-xs text-[var(--color-muted)] leading-relaxed mb-6">
                Deliver services as a freelancer and hire contractors as a buyer under one unified dashboard account.
              </p>
              <div className="mt-auto text-[10px] text-[var(--color-muted)] border-t border-white/5 pt-4 font-mono">
                HYBRID PIPELINE: UNIFIED SWITCH
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STATE C: REGISTERED & ROLE ACTIVE (DASHBOARD RUNNING)
  // -------------------------------------------------------------
  const isFreelancerView = user.activeRoleView === "freelancer";

  return (
    <div className="pt-20 min-h-screen flex flex-col lg:flex-row bg-[var(--color-void)]">
      {/* Sidebar Nav */}
      <aside className="hidden lg:flex w-[220px] shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)]/30 min-h-[calc(100vh-5rem)] p-4">
        <p className="text-[11px] uppercase tracking-wider text-[var(--color-muted)] px-3 mb-4 font-mono">
          {isFreelancerView ? "Freelancer Space" : "Client Portal"}
        </p>
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm mb-1 transition-colors ${
              item.active
                ? "bg-white/[0.06] text-[var(--color-text)]"
                : "text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-white/[0.03]"
            }`}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}

        <div className="mt-auto pt-6 border-t border-white/5">
          <Link
            to="/portfolio"
            className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/5 text-xs text-[var(--color-muted)] hover:text-white transition-all hover:bg-white/[0.04]"
          >
            <span className="font-semibold">My Portfolio</span>
            <ChevronRight size={14} />
          </Link>
        </div>
      </aside>

      {/* Main Dashboard Space */}
      <div className="flex-1 p-4 md:p-8 overflow-auto">
        <div className="max-w-3xl">
          {/* Dual Switch Header Banner */}
          {user.role === "both" && (
            <div className="mb-6 p-4 rounded-xl border border-white/5 bg-white/[0.01] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[var(--color-warm)] animate-pulse" />
                <span className="text-xs text-[var(--color-muted)]">
                  Dual Account: You are currently viewing your dashboard as a{" "}
                  <strong className="text-white capitalize">{user.activeRoleView}</strong>
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveRoleView("freelancer")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                    isFreelancerView
                      ? "border-[var(--color-warm)] bg-[var(--color-warm)]/10 text-[var(--color-warm)]"
                      : "border-white/5 text-[var(--color-muted)] hover:text-white"
                  }`}
                  style={{
                    borderColor: isFreelancerView ? user.color : "rgba(255,255,255,0.05)",
                    color: isFreelancerView ? user.color : "",
                    backgroundColor: isFreelancerView ? `${user.color}15` : "",
                  }}
                >
                  Freelance View
                </button>
                <button
                  onClick={() => setActiveRoleView("client")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                    !isFreelancerView
                      ? "border-[var(--color-warm)] bg-[var(--color-warm)]/10 text-[var(--color-warm)]"
                      : "border-white/5 text-[var(--color-muted)] hover:text-white"
                  }`}
                  style={{
                    borderColor: !isFreelancerView ? user.color : "rgba(255,255,255,0.05)",
                    color: !isFreelancerView ? user.color : "",
                    backgroundColor: !isFreelancerView ? `${user.color}15` : "",
                  }}
                >
                  Client View
                </button>
              </div>
            </div>
          )}

          {/* Heading */}
          <h1 className="text-display text-2xl md:text-3xl font-medium">
            Good evening, {user.name.split(" ")[0]}
          </h1>
          <p className="text-[var(--color-muted)] mt-1.5 text-sm flex items-center gap-2">
            {isFreelancerView ? (
              <>
                <span>3 active projects · 2 messages waiting</span>
                {user.verification.status === "verified" && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-[var(--color-mint)] font-mono">
                    <ShieldCheck size={11} /> AI VERIFIED TALENT
                  </span>
                )}
              </>
            ) : (
              <>
                <span>{clientProjects.length} active job postings · {clientProjects.reduce((acc, p) => acc + p.proposalsCount, 0)} applications received</span>
                {user.verification.status === "verified" && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-[var(--color-mint)] font-mono">
                    <ShieldCheck size={11} /> VERIFIED HIRER
                  </span>
                )}
              </>
            )}
          </p>

          <AnimatePresence mode="wait">
            {/* VIEW A: FREELANCER VIEWPORT */}
            {isFreelancerView ? (
              <motion.div
                key="freelancer-dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-10 space-y-8"
              >
                <div className="space-y-4">
                  <p className="text-[11px] uppercase tracking-wider text-[var(--color-muted)] font-mono">
                    Current work
                  </p>
                  {projects.map((p, i) => (
                    <Link
                      key={p.id}
                      to={`/projects/${p.id}`}
                      className="block glass rounded-xl p-5 hover:border-[var(--color-border-strong)] transition-all group relative overflow-hidden"
                      style={{ transform: `translateX(${i * 4}px)` }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium group-hover:text-[var(--color-warm)] transition-colors" style={{ "--hover-color": user.color } as React.CSSProperties}>
                            {p.title}
                          </h3>
                          <p className="text-sm text-[var(--color-muted)] mt-0.5">{p.client}</p>
                        </div>
                        <span className="text-[11px] px-2 py-1 rounded-full bg-white/5 text-[var(--color-muted)]">
                          {p.status}
                        </span>
                      </div>
                      <div className="mt-4 h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r"
                          style={{
                            backgroundImage: `linear-gradient(90deg, ${user.color}, var(--color-mint))`,
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${p.progress}%` }}
                          transition={{ duration: 1, delay: i * 0.1 }}
                        />
                      </div>
                      <div className="flex justify-between mt-3 text-[11px] text-[var(--color-muted)]">
                        <span className="flex items-center gap-1">
                          <Clock size={10} /> Due {p.due}
                        </span>
                        <span>{p.budget}</span>
                        <ChevronRight
                          size={14}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--color-warm)]"
                          style={{ color: user.color }}
                        />
                      </div>
                    </Link>
                  ))}
                </div>

                <TaskChecklist roleView="freelancer" title="Today's focus" />
              </motion.div>
            ) : (
              // VIEW B: CLIENT VIEWPORT
              <motion.div
                key="client-dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-10 space-y-8"
              >
                {/* Active Postings */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-[11px] uppercase tracking-wider text-[var(--color-muted)] font-mono">
                      Active Job Postings
                    </p>
                    <Link
                      to="/post-project"
                      className="text-[11px] font-semibold flex items-center gap-1 hover:underline text-[var(--color-mint)]"
                      style={{ color: user.color }}
                    >
                      <Plus size={12} /> Post a Job
                    </Link>
                  </div>

                  {clientProjects.length === 0 ? (
                    <div className="glass rounded-xl p-8 text-center border border-white/5 bg-white/[0.005]">
                      <p className="text-sm text-[var(--color-muted)] mb-4">No projects yet. Post your first project</p>
                      <Link
                        to="/post-project"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-black hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: user.color }}
                      >
                        <Plus size={12} /> Post a Job
                      </Link>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      {clientProjects.map((proj) => {
                        const isSelected = proj.id === selectedProjectId;
                        return (
                          <div
                            key={proj.id}
                            onClick={() => setSelectedProjectId(proj.id)}
                            className="glass rounded-xl p-5 hover:border-[var(--color-border-strong)] transition-all flex flex-col justify-between cursor-pointer border"
                            style={{
                              borderColor: isSelected ? user.color : "rgba(255, 255, 255, 0.05)",
                              boxShadow: isSelected ? `0 0 15px ${user.color}25` : "none"
                            }}
                          >
                            <div>
                              <span 
                                className="text-[9px] font-mono px-2 py-0.5 rounded"
                                style={{
                                  backgroundColor: `${user.color}15`,
                                  color: user.color,
                                  border: `1px solid ${user.color}25`
                                }}
                              >
                                {proj.projectType === "Fixed" ? "FIXED BUDGET" : "HOURLY RATE"}
                              </span>
                              <h3 className="font-medium mt-3 text-white line-clamp-1">{proj.title}</h3>
                              <p className="text-xs text-[var(--color-muted)] mt-1.5 line-clamp-2">
                                {proj.description}
                              </p>
                            </div>
                            
                            <div className="mt-5 pt-3 border-t border-white/5 flex flex-col gap-2">
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-[var(--color-muted)]">Budget</span>
                                <span className="font-semibold text-white">
                                  {proj.projectType === "Fixed" ? `$${proj.budget.toLocaleString()}` : `$${proj.budget}/hr`}
                                </span>
                              </div>
                              <div className="flex justify-between items-center text-[11px] text-[var(--color-muted)]">
                                <span>{proj.proposalsCount} proposals</span>
                                <span className="capitalize px-1.5 py-0.5 rounded bg-white/5 text-[10px]">
                                  {proj.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Candidate Matches */}
                <div className="glass rounded-xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm">Best-Fit Candidate Matches (SkillSync Matcher)</h3>
                    <Sparkles size={16} className="text-[var(--color-warm)]" style={{ color: user.color }} />
                  </div>
                  <div className="space-y-3">
                    {!selectedProject ? (
                      <div className="p-8 text-center border border-dashed border-white/10 rounded-xl text-xs text-[var(--color-muted)] flex flex-col items-center gap-3">
                        <span>Post a project to see matches</span>
                        <Link
                          to="/post-project"
                          className="px-4 py-2 rounded-xl text-xs font-semibold text-black hover:opacity-90 transition-opacity"
                          style={{ backgroundColor: user.color }}
                        >
                          Post a Job
                        </Link>
                      </div>
                    ) : talentPool.length === 0 ? (
                      <div className="p-8 text-center border border-dashed border-white/10 rounded-xl text-xs text-[var(--color-muted)]">
                        No freelancers on SkillSync yet. When freelancers complete their profiles, matches appear here in real time.
                      </div>
                    ) : matches.length === 0 ? (
                      <div className="p-8 text-center border border-dashed border-white/10 rounded-xl text-xs text-[var(--color-muted)]">
                        No strong matches for this project yet. Add or adjust required skills on your posting.
                      </div>
                    ) : (
                      matches.map((candidate) => (
                        <div
                          key={candidate.id}
                          className="p-3.5 rounded-lg border border-white/5 hover:border-white/10 bg-white/[0.005] flex items-center justify-between transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold font-mono"
                              style={{ background: `${candidate.color}22`, color: candidate.color }}
                            >
                              {candidate.avatar || candidate.name.split(" ").map((n: string) => n[0]).join("")}
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-white">{candidate.name}</div>
                              <div className="text-[10px] text-[var(--color-muted)] mt-0.5">
                                {candidate.headline} · {candidate.skills.slice(0, 3).join(", ")}{candidate.skills.length > 3 && "..."}
                              </div>
                            </div>
                          </div>

                          <div className="text-right flex flex-col items-end">
                            {candidate.matchScore < 40 ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-950/20 text-red-400 text-[10px] font-mono border border-red-900/30">
                                Low match (below 40%)
                              </span>
                            ) : (
                              <span
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono border"
                                style={{
                                  backgroundColor: `${user.color}10`,
                                  borderColor: `${user.color}25`,
                                  color: user.color
                                }}
                              >
                                AI Match: {candidate.matchScore}%
                              </span>
                            )}
                            <Link
                              to={`/ai/proposal-evaluator?freelancerId=${candidate.id}&projectId=${selectedProject.id}`}
                              className="text-[10px] mt-1.5 hover:underline cursor-pointer text-[var(--color-warm)]"
                              style={{ color: user.color }}
                            >
                              Evaluate Proposal
                            </Link>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Checklist Client */}
                <TaskChecklist roleView="client" title="Today's Hiring Checklist" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Sidebar Section */}
      <aside className="w-full lg:w-[360px] shrink-0 border-t lg:border-t-0 lg:border-l border-[var(--color-border)] bg-[var(--color-surface)]/50 flex flex-col p-6 space-y-6">
        {/* Nudge Widget */}
        <CompletenessWidget />

        {/* AI assistant sidebar widgets */}
        <div className="glass rounded-2xl flex flex-col flex-1 min-h-[300px]">
          <div className="p-4 border-b border-[var(--color-border)] flex items-center gap-2">
            <Sparkles size={16} className="text-[var(--color-warm)] animate-pulse" style={{ color: user.color }} />
            <span className="text-sm font-semibold">AI Assistant</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[320px]">
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-xs p-3 rounded-xl max-w-[90%] leading-relaxed ${
                    msg.role === "ai"
                      ? "bg-white/[0.03] text-[var(--color-muted)] mr-auto border border-white/5"
                      : "bg-[var(--color-warm)]/15 text-[var(--color-text)] ml-auto"
                  }`}
                  style={{
                    backgroundColor: msg.role === "user" ? `${user.color}25` : "",
                  }}
                >
                  {msg.text}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="p-4 border-t border-[var(--color-border)] mt-auto">
            <div className="flex gap-2">
              <input
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendAi()}
                placeholder="Ask assistant to update profile..."
                className="flex-1 bg-white/5 border border-[var(--color-border)] rounded-xl px-4 py-2 text-xs focus:outline-none text-white placeholder-white/20"
                style={{ borderColor: "rgba(255,255,255,0.06)" }}
              />
              <button
                onClick={sendAi}
                className="p-2.5 rounded-xl text-[#0a0a0b] hover:opacity-90 transition-opacity"
                style={{ backgroundColor: user.color }}
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile nav bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 glass-strong border-t border-[var(--color-border)] flex justify-around py-3 px-2 z-40">
        {navItems.slice(0, 4).map((item) => (
          <button key={item.label} className="flex flex-col items-center gap-1 text-[10px] text-[var(--color-muted)]">
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
