import { RevealSection } from "../components/ui/RevealSection";
import { MagneticButton } from "../components/ui/MagneticButton";
import { GraduationCap, Calendar, Video } from "lucide-react";

const mentors = [
  { name: "Diana Okonkwo", focus: "Product Leadership", sessions: 340, rate: "Free intro" },
  { name: "Marcus Webb", focus: "Engineering Career", sessions: 218, rate: "$50/session" },
  { name: "Yuki Tanaka", focus: "Design Portfolio", sessions: 156, rate: "$40/session" },
];

export function Mentorship() {
  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <RevealSection direction="left">
            <p className="text-[13px] uppercase tracking-[0.15em] text-[var(--color-muted)]">Mentorship</p>
            <h1 className="text-display text-4xl md:text-5xl font-medium mt-4 leading-tight">
              Learn from people who've{" "}
              <span className="italic text-[var(--color-warm)]">already shipped.</span>
            </h1>
            <p className="mt-6 text-lg text-[var(--color-muted)] leading-relaxed max-w-md">
              1:1 sessions with senior freelancers and startup leaders. No courses — real conversations.
            </p>
            <MagneticButton to="/community" variant="primary" className="mt-8">
              Browse mentors
            </MagneticButton>
          </RevealSection>

          <div className="space-y-4 md:mt-16">
            {mentors.map((m, i) => (
              <RevealSection key={m.name} delay={i * 0.1} direction="right">
                <div
                  className="glass rounded-2xl p-6 flex gap-5 items-center hover:-translate-y-0.5 transition-transform cursor-pointer"
                  style={{ marginLeft: i === 1 ? 32 : i === 2 ? 16 : 0 }}
                >
                  <div className="h-14 w-14 rounded-xl bg-white/5 flex items-center justify-center">
                    <GraduationCap size={24} className="text-[var(--color-warm)]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{m.name}</h3>
                    <p className="text-sm text-[var(--color-muted)]">{m.focus}</p>
                    <p className="text-[11px] text-[var(--color-muted)] mt-1">{m.sessions} sessions completed</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[var(--color-mint)]">{m.rate}</p>
                    <button className="mt-2 flex items-center gap-1 text-[11px] text-[var(--color-muted)] hover:text-[var(--color-text)]">
                      <Calendar size={12} /> Book
                    </button>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>

        <RevealSection className="mt-32">
          <div className="glass rounded-2xl p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center">
            <Video size={48} className="text-[var(--color-warm)] shrink-0" />
            <div>
              <h2 className="text-display text-2xl font-medium">Live office hours</h2>
              <p className="text-[var(--color-muted)] mt-2 max-w-lg">
                Every Thursday, mentors host open Q&A sessions. Drop in, ask anything, leave sharper.
              </p>
            </div>
            <button className="md:ml-auto shrink-0 px-6 py-3 rounded-full border border-[var(--color-border-strong)] text-sm hover:border-[var(--color-warm)]/40 transition-colors">
              See schedule
            </button>
          </div>
        </RevealSection>
      </div>
    </div>
  );
}
