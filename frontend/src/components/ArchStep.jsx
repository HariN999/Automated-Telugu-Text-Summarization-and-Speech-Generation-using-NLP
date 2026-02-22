import { motion } from "framer-motion";
import { Search, Filter, Brain, Volume2, Brush } from "lucide-react";

const ICONS = {
  search: Search,
  broom: Brush,
  filter: Filter,
  brain: Brain,
  "volume-up": Volume2,
};

const STEP_COLORS = {
  "01": { dot: "bg-indigo-500", text: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-500/10", border: "border-indigo-200/60 dark:border-indigo-500/20" },
  "02": { dot: "bg-violet-500", text: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-500/10", border: "border-violet-200/60 dark:border-violet-500/20" },
  "03": { dot: "bg-purple-500", text: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-500/10", border: "border-purple-200/60 dark:border-purple-500/20" },
  "04": { dot: "bg-fuchsia-500", text: "text-fuchsia-600 dark:text-fuchsia-400", bg: "bg-fuchsia-50 dark:bg-fuchsia-500/10", border: "border-fuchsia-200/60 dark:border-fuchsia-500/20" },
  "05": { dot: "bg-pink-500", text: "text-pink-600 dark:text-pink-400", bg: "bg-pink-50 dark:bg-pink-500/10", border: "border-pink-200/60 dark:border-pink-500/20" },
};

function ArchStep({ step, icon, title, desc, sectionId }) {
  const Icon = ICONS[icon];
  const colors = STEP_COLORS[step] || STEP_COLORS["01"];

  return (
    <motion.div
      id={sectionId}
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className="group relative flex items-start gap-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 shadow-[0_8px_20px_rgba(15,23,42,0.08)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(15,23,42,0.12)] dark:shadow-[0_10px_30px_rgba(2,6,23,0.45)] dark:hover:shadow-[0_14px_34px_rgba(2,6,23,0.55)]"
    >
      {/* Step number badge */}
      <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border ${colors.bg} ${colors.border}`}>
        <span className={`font-mono text-xs font-semibold ${colors.text}`}>{step}</span>
      </div>

      {/* Icon */}
      {Icon && (
        <div className={`mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${colors.bg} ${colors.border} border`}>
          <Icon className={`h-5 w-5 ${colors.text}`} />
        </div>
      )}

      {/* Text */}
      <div className="flex-1 pt-1">
        <h4 className="mb-1 text-sm font-semibold text-[var(--text-primary)]">
          {title}
        </h4>
        <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
          {desc}
        </p>
      </div>

      {/* Hover accent line */}
      <div className={`absolute left-0 top-4 bottom-4 w-0.5 rounded-full ${colors.dot} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
    </motion.div>
  );
}

export default ArchStep;
