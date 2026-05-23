import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "../data/mockData";
import {
  LayoutGrid,
  FolderKanban,
  MessageSquare,
  Settings,
  Send,
  Sparkles,
  ChevronRight,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";

const navItems = [
  { icon: LayoutGrid, label: "Overview", active: true },
  { icon: FolderKanban, label: "Projects" },
  { icon: MessageSquare, label: "Messages" },
  { icon: Settings, label: "Settings" },
];

export function Dashboard() {
  const [aiInput, setAiInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "ai", text: "Your Vault Finance milestone is due in 4 days. Want me to draft a status update for the client?" },
  ]);

  const sendAi = () => {
    if (!aiInput.trim()) return;
    setMessages((m) => [...m, { role: "user", text: aiInput }, { role: "ai", text: "I'll analyze your project timeline and suggest next steps. One moment..." }]);
    setAiInput("");
  };

  return (
    <div className="pt-20 min-h-screen flex flex-col lg:flex-row">
      <aside className="hidden lg:flex w-[220px] shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)]/30 min-h-[calc(100vh-5rem)] p-4">
        <p className="text-[11px] uppercase tracking-wider text-[var(--color-muted)] px-3 mb-4">Workspace</p>
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm mb-1 transition-colors ${
              item.active ? "bg-white/[0.06] text-[var(--color-text)]" : "text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-white/[0.03]"
            }`}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </aside>

      <div className="flex-1 p-4 md:p-8 overflow-auto">
        <div className="max-w-3xl">
          <h1 className="text-display text-2xl md:text-3xl font-medium">Good evening, Maya</h1>
          <p className="text-[var(--color-muted)] mt-2 text-sm">3 active projects · 2 messages waiting</p>

          <div className="mt-10 space-y-4">
            <p className="text-[11px] uppercase tracking-wider text-[var(--color-muted)]">Current work</p>
            {projects.map((p, i) => (
              <Link
                key={p.id}
                to="/projects/vault-redesign"
                className="block glass rounded-xl p-5 hover:border-[var(--color-border-strong)] transition-all group"
                style={{ transform: `translateX(${i * 4}px)` }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{p.title}</h3>
                    <p className="text-sm text-[var(--color-muted)] mt-0.5">{p.client}</p>
                  </div>
                  <span className="text-[11px] px-2 py-1 rounded-full bg-white/5 text-[var(--color-muted)]">{p.status}</span>
                </div>
                <div className="mt-4 h-1 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[var(--color-warm)] to-[var(--color-mint)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${p.progress}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                  />
                </div>
                <div className="flex justify-between mt-3 text-[11px] text-[var(--color-muted)]">
                  <span className="flex items-center gap-1"><Clock size={10} /> Due {p.due}</span>
                  <span>{p.budget}</span>
                  <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 glass rounded-xl p-6">
            <h3 className="font-medium text-sm mb-4">Today's focus</h3>
            <ul className="space-y-3 text-sm text-[var(--color-muted)]">
              <li className="flex items-center gap-3">
                <input type="checkbox" className="rounded border-[var(--color-border)]" defaultChecked />
                <span className="line-through opacity-60">Review Helix AI feedback</span>
              </li>
              <li className="flex items-center gap-3">
                <input type="checkbox" className="rounded border-[var(--color-border)]" />
                Vault Finance — Visual design handoff
              </li>
              <li className="flex items-center gap-3">
                <input type="checkbox" className="rounded border-[var(--color-border)]" />
                Respond to Bloom Studio proposal
              </li>
            </ul>
          </div>
        </div>
      </div>

      <aside className="w-full lg:w-[340px] shrink-0 border-t lg:border-t-0 lg:border-l border-[var(--color-border)] bg-[var(--color-surface)]/50 flex flex-col min-h-[320px] lg:min-h-[calc(100vh-5rem)]">
        <div className="p-4 border-b border-[var(--color-border)] flex items-center gap-2">
          <Sparkles size={16} className="text-[var(--color-warm)]" />
          <span className="text-sm font-medium">AI Assistant</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-sm p-3 rounded-xl max-w-[90%] ${
                  msg.role === "ai"
                    ? "bg-white/[0.04] text-[var(--color-muted)] mr-auto"
                    : "bg-[var(--color-warm)]/15 text-[var(--color-text)] ml-auto"
                }`}
              >
                {msg.text}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="p-4 border-t border-[var(--color-border)]">
          <div className="flex gap-2">
            <input
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendAi()}
              placeholder="Ask anything..."
              className="flex-1 bg-white/5 border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-warm)]/30"
            />
            <button
              onClick={sendAi}
              className="p-2.5 rounded-xl bg-[var(--color-warm)] text-[#0a0a0b] hover:opacity-90 transition-opacity"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </aside>

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
