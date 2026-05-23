import { Link } from "react-router-dom";
import { projects } from "../data/mockData";
import { RevealSection } from "../components/ui/RevealSection";
import { Plus } from "lucide-react";

export function Projects() {
  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <RevealSection>
            <h1 className="text-display text-4xl md:text-5xl font-medium">Projects</h1>
            <p className="text-[var(--color-muted)] mt-2">Document-style project pages. Not spreadsheets.</p>
          </RevealSection>
          <RevealSection delay={0.1}>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[var(--color-border-strong)] text-sm hover:border-[var(--color-warm)]/40 transition-colors self-start">
              <Plus size={16} /> New project
            </button>
          </RevealSection>
        </div>

        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <RevealSection key={p.id} delay={i * 0.08}>
              <Link
                to="/projects/vault-redesign"
                className={`block glass rounded-2xl p-8 h-full hover:border-[var(--color-border-strong)] transition-all hover:-translate-y-1 ${
                  i === 0 ? "md:col-span-2 lg:col-span-1 lg:row-span-2 min-h-[280px] flex flex-col justify-between" : ""
                }`}
                style={{ marginTop: i === 2 ? 24 : 0 }}
              >
                <div>
                  <span className="text-[11px] text-[var(--color-muted)]">{p.client}</span>
                  <h2 className="text-xl font-medium mt-2">{p.title}</h2>
                </div>
                <div className="mt-8">
                  <div className="h-1 rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[var(--color-warm)] to-[var(--color-mint)]"
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-4 text-sm text-[var(--color-muted)]">
                    <span>{p.status}</span>
                    <span>{p.budget}</span>
                  </div>
                </div>
              </Link>
            </RevealSection>
          ))}
        </div>
      </div>
    </div>
  );
}
