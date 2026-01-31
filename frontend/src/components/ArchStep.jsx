import { motion } from "framer-motion";
import { Search, Filter, Brain, Volume2, Brush } from "lucide-react";

const ICONS = {
  search: Search,
  broom: Brush,
  filter: Filter,
  brain: Brain,
  "volume-up": Volume2,
};

function ArchStep({ step, icon, title, desc, sectionId }) {
  const Icon = ICONS[icon];

  return (
    <motion.div
      id={sectionId}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex gap-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-5 backdrop-blur-sm shadow-sm dark:shadow-none"
    >
      <div className="text-blue-600 dark:text-blue-400 text-xl font-bold">{step}</div>

      {Icon && <Icon className="text-purple-600 dark:text-purple-400" />}

      <div>
        <h4 className="text-slate-900 dark:text-white font-semibold">{title}</h4>
        <p className="text-slate-600 dark:text-slate-400 text-sm">{desc}</p>
      </div>
    </motion.div>
  );
}

export default ArchStep;