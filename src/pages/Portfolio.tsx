import { useState } from "react";
import { motion } from "framer-motion";
import { portfolioItems } from "../data/mockData";
import { RevealSection } from "../components/ui/RevealSection";
import { Play, Eye } from "lucide-react";

const sizeClasses: Record<string, string> = {
  tall: "row-span-2",
  wide: "col-span-2",
  square: "",
};

export function Portfolio() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <RevealSection>
          <p className="text-[13px] uppercase tracking-[0.15em] text-[var(--color-muted)]">Portfolio</p>
          <h1 className="text-display text-4xl md:text-5xl font-medium mt-4 max-w-lg">
            Work that speaks before the pitch.
          </h1>
        </RevealSection>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] md:auto-rows-[200px] gap-3 md:gap-4">
          {portfolioItems.map((item, i) => (
            <RevealSection
              key={item.id}
              delay={i * 0.05}
              className={`${sizeClasses[item.size]} ${i === 2 ? "md:mt-8" : ""}`}
            >
              <motion.article
                className="relative h-full rounded-2xl overflow-hidden group cursor-pointer"
                onHoverStart={() => setHovered(item.id)}
                onHoverEnd={() => setHovered(null)}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                {hovered === item.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/40"
                  >
                    <div className="h-14 w-14 rounded-full glass flex items-center justify-center">
                      <Play size={20} className="text-white ml-1" />
                    </div>
                  </motion.div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                  <span className="text-[10px] uppercase tracking-wider text-[var(--color-warm)]">{item.category}</span>
                  <h3 className="font-medium mt-1 text-sm md:text-base">{item.title}</h3>
                  <div className="flex gap-4 mt-2 text-[11px] text-[var(--color-muted)]">
                    <span className="flex items-center gap-1"><Eye size={10} /> {item.metrics.views}</span>
                    <span className="text-[var(--color-mint)]">{item.metrics.conversion}</span>
                  </div>
                </div>
              </motion.article>
            </RevealSection>
          ))}
        </div>
      </div>
    </div>
  );
}
