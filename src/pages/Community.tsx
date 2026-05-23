import { useState } from "react";
import { motion } from "framer-motion";
import { communityPosts, weeklyChallenge } from "../data/mockData";
import { RevealSection } from "../components/ui/RevealSection";
import { ArrowBigUp, MessageSquare, Hash, Trophy, Users } from "lucide-react";

const channels = ["design-systems", "backend", "ai-ml", "freelance-tips", "show-and-tell"];

export function Community() {
  const [activeChannel, setActiveChannel] = useState("design-systems");
  const [reactions, setReactions] = useState<Record<number, number>>({});

  const react = (id: number) => {
    setReactions((r) => ({ ...r, [id]: (r[id] ?? 0) + 1 }));
  };

  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <div className="grid lg:grid-cols-[240px_1fr_300px] gap-8">
          <aside className="hidden lg:block">
            <RevealSection direction="left">
              <p className="text-[11px] uppercase tracking-wider text-[var(--color-muted)] mb-4">Channels</p>
              <div className="space-y-1">
                {channels.map((ch) => (
                  <button
                    key={ch}
                    onClick={() => setActiveChannel(ch)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                      activeChannel === ch ? "bg-white/[0.06] text-[var(--color-text)]" : "text-[var(--color-muted)] hover:bg-white/[0.03]"
                    }`}
                  >
                    <Hash size={14} />
                    {ch}
                  </button>
                ))}
              </div>
            </RevealSection>
          </aside>

          <main>
            <RevealSection>
              <h1 className="text-display text-3xl md:text-4xl font-medium">Community</h1>
              <p className="text-[var(--color-muted)] mt-2">Where freelancers learn, debate, and grow.</p>
            </RevealSection>

            <RevealSection delay={0.1} className="mt-10">
              <div
                className="relative rounded-2xl overflow-hidden p-8 md:p-12 min-h-[220px] flex flex-col justify-end"
                style={{
                  background: "linear-gradient(135deg, rgba(232,168,124,0.15) 0%, rgba(110,231,183,0.08) 50%, transparent 100%), var(--color-elevated)",
                }}
              >
                <div className="absolute top-6 right-6 flex items-center gap-2 text-[var(--color-warm)]">
                  <Trophy size={18} />
                  <span className="text-sm font-medium">Weekly Challenge</span>
                </div>
                <h2 className="text-display text-2xl md:text-3xl font-medium max-w-lg">{weeklyChallenge.title}</h2>
                <div className="flex flex-wrap gap-6 mt-6 text-sm">
                  <span className="text-[var(--color-mint)] font-medium">{weeklyChallenge.prize} prize</span>
                  <span className="text-[var(--color-muted)] flex items-center gap-1"><Users size={14} /> {weeklyChallenge.entries} entries</span>
                  <span className="text-[var(--color-muted)]">{weeklyChallenge.deadline}</span>
                </div>
                <button className="mt-6 self-start px-5 py-2.5 rounded-full bg-[var(--color-warm)] text-[#0a0a0b] text-sm font-medium">
                  Enter challenge
                </button>
              </div>
            </RevealSection>

            <div className="mt-10 space-y-4">
              {communityPosts.map((post, i) => (
                <RevealSection key={post.id} delay={i * 0.05}>
                  <motion.article
                    className="glass rounded-xl p-5 md:p-6 hover:border-[var(--color-border-strong)] transition-colors"
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center gap-1 shrink-0">
                        <button
                          onClick={() => react(post.id)}
                          className="p-1.5 rounded-lg hover:bg-[var(--color-warm)]/10 text-[var(--color-muted)] hover:text-[var(--color-warm)] transition-colors"
                        >
                          <ArrowBigUp size={20} />
                        </button>
                        <span className="text-sm font-medium">{post.votes + (reactions[post.id] ?? 0)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-[11px] text-[var(--color-muted)]">
                          <Hash size={10} />{post.channel}
                          <span>·</span>
                          <span>{post.author}</span>
                          <span>·</span>
                          <span>{post.time}</span>
                        </div>
                        <h3 className="font-medium mt-2 text-lg">{post.title}</h3>
                        <div className="flex items-center gap-4 mt-4 text-sm text-[var(--color-muted)]">
                          <span className="flex items-center gap-1"><MessageSquare size={14} /> {post.comments} comments</span>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                </RevealSection>
              ))}
            </div>
          </main>

          <aside className="hidden lg:block space-y-6">
            <RevealSection direction="right">
              <div className="glass rounded-xl p-5">
                <h3 className="font-medium text-sm mb-4">Online now</h3>
                <div className="flex -space-x-2">
                  {["MC", "JO", "EV", "SR"].map((a, i) => (
                    <div
                      key={a}
                      className="h-8 w-8 rounded-full border-2 border-[var(--color-void)] flex items-center justify-center text-[10px] font-bold bg-[var(--color-elevated)]"
                      style={{ zIndex: 4 - i }}
                    >
                      {a}
                    </div>
                  ))}
                  <span className="ml-4 text-sm text-[var(--color-muted)] self-center">+124</span>
                </div>
              </div>
            </RevealSection>
          </aside>
        </div>
      </div>
    </div>
  );
}
