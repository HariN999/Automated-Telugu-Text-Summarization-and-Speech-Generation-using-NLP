import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Globe } from "lucide-react";
import ArchStep from "../components/ArchStep";

function HeroSection({ onGetStarted }) {
  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-24">
        {/* Background: light mode = soft warm white | dark mode = deep navy */}
        <div className="absolute inset-0 bg-slate-50 dark:bg-[#080814] transition-colors duration-500" />

        {/* Noise texture */}
        <div className="noise-overlay" />

        {/* Gradient orbs — vibrant in dark, soft in light */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-48 -left-48 h-[500px] w-[500px] rounded-full bg-indigo-400/10 dark:bg-indigo-600/20 blur-[100px]"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute -bottom-48 -right-48 h-[500px] w-[500px] rounded-full bg-violet-400/10 dark:bg-violet-700/20 blur-[100px]"
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.35, 0.2] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 4 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-fuchsia-400/10 dark:bg-fuchsia-600/15 blur-[80px]"
          />
        </div>

        {/* Grid overlay — adapts color per theme */}
        <div
          className="absolute inset-0 opacity-[0.04] dark:opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(to right, rgb(79 70 229 / 0.3) 1px, transparent 1px), linear-gradient(to bottom, rgb(79 70 229 / 0.3) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Content */}
        <motion.div
          className="relative z-10 mx-auto max-w-5xl text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-10 inline-flex items-center gap-2 rounded-full border border-indigo-300/50 dark:border-indigo-500/20 bg-indigo-100/80 dark:bg-indigo-500/10 px-5 py-2 text-sm font-medium text-indigo-700 dark:text-indigo-300 backdrop-blur-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Powered by mT5 &amp; TF-IDF</span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="mb-4 font-display"
          >
            <span className="block text-5xl font-bold leading-tight text-slate-900 dark:text-white sm:text-6xl md:text-7xl lg:text-8xl">
              AI that speaks
            </span>
            <span className="block text-5xl font-bold leading-tight sm:text-6xl md:text-7xl lg:text-8xl">
              <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 dark:from-indigo-400 dark:via-violet-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
                తెలుగు
              </span>
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="mx-auto mb-14 max-w-2xl text-lg text-slate-500 dark:text-slate-400 sm:text-xl"
          >
            Transform Telugu content into insights. Summarize articles, generate
            speech, and extract meaning with state-of-the-art language AI.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-24 flex flex-wrap items-center justify-center gap-4"
          >
            <button
              onClick={onGetStarted}
              className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/40"
            >
              <span>Get Started</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>

            <a href="#learn-more">
              <button className="inline-flex items-center gap-2 rounded-full border border-slate-300 dark:border-white/10 bg-white/80 dark:bg-white/5 px-8 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-300 backdrop-blur-sm transition-all duration-200 hover:border-indigo-300 dark:hover:border-white/20 hover:bg-white dark:hover:bg-white/10">
                Learn More
                <Zap className="h-4 w-4" />
              </button>
            </a>
          </motion.div>

          {/* Feature cards */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-3"
          >
            {[
              {
                icon: Globe,
                label: "Multi-Source",
                desc: "Scrapes Eenadu, BBC Telugu & user input",
                bg: "bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-500/20 dark:to-blue-500/20",
                border: "border-indigo-200/60 dark:border-indigo-500/15",
                iconBg: "bg-indigo-100 dark:bg-white/10",
                iconColor: "text-indigo-600 dark:text-indigo-400",
              },
              {
                icon: Sparkles,
                label: "AI-Powered",
                desc: "mT5 & TF-IDF for Telugu summarization",
                bg: "bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-500/20 dark:to-purple-500/20",
                border: "border-violet-200/60 dark:border-violet-500/15",
                iconBg: "bg-violet-100 dark:bg-white/10",
                iconColor: "text-violet-600 dark:text-violet-400",
              },
              {
                icon: Zap,
                label: "Voice Output",
                desc: "High-quality Text-to-Speech in Telugu",
                bg: "bg-gradient-to-br from-fuchsia-50 to-pink-50 dark:from-fuchsia-500/20 dark:to-pink-500/20",
                border: "border-fuchsia-200/60 dark:border-fuchsia-500/15",
                iconBg: "bg-fuchsia-100 dark:bg-white/10",
                iconColor: "text-fuchsia-600 dark:text-fuchsia-400",
              },
            ].map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85 + i * 0.08 }}
                className={`group rounded-2xl border ${f.border} ${f.bg} p-5 backdrop-blur-sm text-left transition-all duration-300 hover:scale-[1.02]`}
              >
                <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl ${f.iconBg} ${f.iconColor}`}>
                  <f.icon className="h-4 w-4" />
                </div>
                <div className="text-base font-semibold text-slate-800 dark:text-white mb-1">{f.label}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ================= ARCHITECTURE ================= */}
      <section
        id="learn-more"
        className="relative overflow-hidden px-6 py-28 bg-slate-100 dark:bg-[#12121f] transition-colors duration-500"
      >
        {/* Subtle orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-indigo-400/15 dark:bg-indigo-500/30 blur-[80px]"
          />
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-violet-400/10 dark:bg-violet-500/25 blur-[80px]"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-3xl">

          {/* Badge */}
          <div className="mb-6 flex justify-center">
            <span className="rounded-full border border-indigo-300/60 dark:border-indigo-500/25 bg-indigo-100 dark:bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-700 dark:text-indigo-400">
              How It Works
            </span>
          </div>

          <h2 className="mb-4 text-center font-display text-4xl font-bold text-slate-900 dark:text-white">
            Architecture Overview
          </h2>
          <p className="mb-14 text-center text-sm text-slate-500 dark:text-slate-400">
            Five deliberate steps from raw content to polished audio summary.
          </p>

          <div className="grid gap-4">
            <ArchStep
              step="01"
              icon="search"
              title="Content Extraction"
              desc="BeautifulSoup extracts Telugu news articles or pasted text."
            />
            <ArchStep
              step="02"
              icon="broom"
              title="Text Cleaning"
              desc="Normalization removes noise and prepares Telugu text for processing."
            />
            <ArchStep
              step="03"
              icon="filter"
              title="Extractive Summarization"
              desc="TF-IDF identifies important sentences quickly and accurately."
            />
            <ArchStep
              step="04"
              icon="brain"
              title="Abstractive AI Model"
              desc="mT5 generates fluent, coherent Telugu summaries using deep learning."
            />
            <ArchStep
              step="05"
              icon="volume-up"
              title="Speech Generation"
              desc="gTTS converts the final summary into natural-sounding Telugu audio."
            />
          </div>
        </div>
      </section>
    </>
  );
}

export default HeroSection;