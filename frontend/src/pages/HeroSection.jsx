import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Globe } from "lucide-react";
import ArchStep from "../components/ArchStep";

function HeroSection({ onGetStarted }) {
  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        {/* Background */}
        <div className="absolute inset-0">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-500/30 blur-3xl"
          />

          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-purple-500/30 blur-3xl"
          />

          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgb(255 255 255 / 0.05) 1px, transparent 1px),
                linear-gradient(to bottom, rgb(255 255 255 / 0.05) 1px, transparent 1px)
              `,
              backgroundSize: "4rem 4rem",
            }}
          />
        </div>

        {/* Content */}
        <motion.div className="relative z-10 mx-auto max-w-6xl text-center">
          <div className="mb-8 inline-flex items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-300 dark:text-blue-400">
              <Sparkles className="h-3.5 w-3.5" />
              Powered by Advanced AI
            </span>
          </div>

          <h1 className="mb-6 bg-gradient-to-br from-white via-blue-100 to-purple-200 bg-clip-text text-6xl font-bold leading-tight text-transparent sm:text-7xl md:text-8xl lg:text-9xl">
            AI that speaks <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text">
              తెలుగు
            </span>
          </h1>

          <p className="mx-auto mb-12 max-w-3xl text-lg text-slate-300 dark:text-slate-400 sm:text-xl">
            Transform Telugu content into insights. Summarize articles, generate
            speech, and extract meaning with state-of-the-art language AI.
          </p>

          {/* CTA */}
          <div className="mb-20 flex justify-center gap-4">
            <button
              onClick={onGetStarted}
              className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 font-semibold text-white hover:scale-105 transition"
            >
              Get Started <ArrowRight className="inline ml-2" />
            </button>

            {/* Jump Button */}
            <a href="#learn-more">
              <button className="rounded-full border border-slate-600 dark:border-slate-700 bg-slate-800/50 dark:bg-slate-800/70 px-8 py-4 font-semibold text-white hover:bg-slate-800/70 dark:hover:bg-slate-800/90 transition">
                Learn More <Zap className="inline ml-2" />
              </button>
            </a>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              {
                icon: Globe,
                title: "Multi-Source",
                desc: "Scrapes Eenadu, BBC Telugu, and user input for summarization",
              },
              {
                icon: Sparkles,
                title: "AI-Powered",
                desc: "mT5 & TF-IDF for Telugu summarization",
              },
              {
                icon: Zap,
                title: "Voice Output",
                desc: "Text-to-Speech in Telugu",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-white/5 dark:border-white/10 bg-white/5 dark:bg-white/[0.02] p-6 backdrop-blur-sm"
              >
                <feature.icon className="mb-3 h-6 w-6 text-blue-400 dark:text-blue-500" />
                <div className="text-xl font-bold text-white mb-2">
                  {feature.title}
                </div>
                <div className="text-sm text-slate-400 dark:text-slate-500">
                  {feature.desc}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ================= ARCHITECTURE ================= */}
      <section
        id="learn-more"
        className="relative overflow-hidden px-4 py-28 bg-slate-100 dark:bg-slate-900"
      >
        {/* Background orbs */}
        <div className="absolute inset-0">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.25, 0.4, 0.25] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-blue-500/30 blur-3xl"
          />

          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.25, 0.4, 0.25] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-purple-500/30 blur-3xl"
          />

          {/* Grid */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
          linear-gradient(to right, rgb(255 255 255 / 0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgb(255 255 255 / 0.05) 1px, transparent 1px)
        `,
              backgroundSize: "4rem 4rem",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-5xl">
          {/* Badge */}
          <div className="mb-6 flex justify-center">
            <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm text-blue-600 dark:text-blue-400">
              How It Works
            </span>
          </div>

          <h2 className="mb-14 text-center text-4xl font-bold bg-gradient-to-br from-slate-900 via-blue-800 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-200 bg-clip-text text-transparent">
            Architecture Overview
          </h2>

          <div className="grid gap-5">
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
              desc="Normalization removes noise and prepares Telugu text."
            />

            <ArchStep
              step="03"
              icon="filter"
              title="Extractive Summarization"
              desc="TF-IDF identifies important sentences quickly."
            />

            <ArchStep
              step="04"
              icon="brain"
              title="Abstractive AI Model"
              desc="mT5 generates fluent Telugu summaries."
            />

            <ArchStep
              step="05"
              icon="volume-up"
              title="Speech Generation"
              desc="gTTS converts summaries into Telugu audio."
            />
          </div>
        </div>
      </section>
    </>
  );
}

export default HeroSection;
