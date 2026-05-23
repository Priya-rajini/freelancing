import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { MagneticButton } from "../ui/MagneticButton";

const links = [
  { to: "/", label: "Home" },
  { to: "/talent", label: "Talent" },
  { to: "/projects", label: "Projects" },
  { to: "/community", label: "Community" },
  { to: "/mentorship", label: "Mentorship" },
  { to: "/dashboard", label: "Dashboard" },
];

export function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 md:px-8">
        <nav className="glass-strong mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-3 md:px-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative h-8 w-8 rounded-lg bg-[var(--color-elevated)] border border-[var(--color-border)] flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-warm)]/20 to-[var(--color-mint)]/10" />
              <span className="relative text-xs font-bold text-[var(--color-warm)]">S</span>
            </div>
            <span className="text-sm font-semibold tracking-tight">
              SkillSync<span className="text-[var(--color-muted)] font-normal"> AI</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {links.map((link) => {
              const active = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-3.5 py-1.5 text-[13px] rounded-lg transition-colors ${
                    active ? "text-[var(--color-text)]" : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-white/[0.06] rounded-lg"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <span className="relative">{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <MagneticButton to="/talent" variant="ghost" className="!px-4 !py-2 text-[13px]">
              Browse
            </MagneticButton>
            <MagneticButton to="/dashboard" variant="primary" className="!px-4 !py-2 text-[13px]">
              Get Started
            </MagneticButton>
          </div>

          <button
            className="lg:hidden p-2 text-[var(--color-muted)]"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </header>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-0 z-40 lg:hidden pt-20 px-4"
        >
          <div className="glass-strong rounded-2xl p-6 space-y-2" onClick={() => setOpen(false)}>
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block py-3 px-4 text-lg border-b border-[var(--color-border)] last:border-0"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </>
  );
}
