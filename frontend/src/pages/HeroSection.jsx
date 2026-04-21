import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Globe } from "lucide-react";
import ArchStep from "../components/ArchStep";

const MotionDiv = motion.div;
const MotionH1 = motion.h1;
const MotionP = motion.p;

const HOME_FEATURES = [
  {
    icon: Globe,
    label: "Multi-Source",
    desc: "Scrapes Eenadu, BBC Telugu & user input",
    accentClass: "home-feature-indigo",
  },
  {
    icon: Sparkles,
    label: "AI-Powered",
    desc: "mT5 & TF-IDF for Telugu summarization",
    accentClass: "home-feature-violet",
  },
  {
    icon: Zap,
    label: "Voice Output",
    desc: "High-quality Text-to-Speech in Telugu",
    accentClass: "home-feature-fuchsia",
  },
];

function HeroSection({ onGetStarted }) {
  return (
    <>
      {/* Home hero now uses dedicated theme tokens for light/dark parity. */}
      <section className="home-hero-section relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-24">
        <div className="home-hero-bg absolute inset-0" />
        <div className="noise-overlay" />

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <MotionDiv
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-48 -top-48 h-[500px] w-[500px] rounded-full bg-indigo-400/10 dark:bg-indigo-600/20 blur-[100px]"
          />
          <MotionDiv
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute -bottom-48 -right-48 h-[500px] w-[500px] rounded-full bg-violet-400/10 dark:bg-violet-700/20 blur-[100px]"
          />
          <MotionDiv
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.35, 0.2] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 4 }}
            className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-400/10 dark:bg-fuchsia-600/15 blur-[80px]"
          />
        </div>

        <div className="home-grid-overlay absolute inset-0" />

        <MotionDiv
          className="relative z-10 mx-auto max-w-5xl text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <MotionDiv
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="home-pill-badge mb-10 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Powered by mT5 &amp; TF-IDF</span>
          </MotionDiv>

          <MotionH1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="mb-6 font-display"
          >
            <span className="home-title block text-5xl font-bold leading-tight sm:text-6xl md:text-7xl lg:text-8xl">
              AI that speaks
            </span>
            <span className="block text-5xl font-bold leading-tight sm:text-6xl md:text-7xl lg:text-8xl">
              <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent dark:from-indigo-400 dark:via-violet-400 dark:to-fuchsia-400">
                తెలుగు
              </span>
            </span>
          </MotionH1>

          <MotionP
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="home-subtitle mx-auto mb-16 max-w-2xl text-lg sm:text-xl"
          >
            Transform Telugu content into insights. Summarize articles, generate
            speech, and extract meaning with state-of-the-art language AI.
          </MotionP>

          <MotionDiv
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-24 flex flex-wrap items-center justify-center gap-4"
          >
            <button
              onClick={onGetStarted}
              className="home-btn-primary group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full px-8 py-3.5 text-sm font-semibold"
            >
              <span>Get Started</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>

            <a
              href="#learn-more"
              className="home-btn-secondary inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold"
            >
              Learn More
              <Zap className="h-4 w-4" />
            </a>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-3"
          >
            {HOME_FEATURES.map((feature, i) => (
              <MotionDiv
                key={feature.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85 + i * 0.08 }}
                className={`home-feature-card ${feature.accentClass} group rounded-2xl p-5 text-left`}
              >
                <div className="home-feature-icon mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl">
                  <feature.icon className="h-4 w-4" />
                </div>
                <div className="home-feature-title mb-1 text-base font-semibold">{feature.label}</div>
                <div className="home-feature-desc text-sm leading-relaxed">{feature.desc}</div>
              </MotionDiv>
            ))}
          </MotionDiv>
        </MotionDiv>
      </section>

      {/* Architecture section keeps existing dark look, while light mode gets cleaner card contrast. */}
      <section id="learn-more" className="home-arch-section relative overflow-hidden px-6 py-28">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <MotionDiv
            animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-indigo-400/15 dark:bg-indigo-500/30 blur-[80px]"
          />
          <MotionDiv
            animate={{ scale: [1, 1.25, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-violet-400/10 dark:bg-violet-500/25 blur-[80px]"
          />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl">
          <div className="mb-6 flex justify-center">
            <span className="home-pill-badge rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest">
              How It Works
            </span>
          </div>

          <h2 className="home-title mb-4 text-center font-display text-4xl font-bold">
            Architecture Overview
          </h2>
          <p className="home-subtitle mb-14 text-center text-sm">
            Five deliberate steps from raw content to polished audio summary.
          </p>

          <div className="grid gap-4">
            <ArchStep
              step="01"
              icon="search"
              title="Content Extraction"
              desc="BeautifulSoup extracts Telugu news articles."
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
              desc="Edge TTS converts the final summary into natural-sounding Telugu audio."
            />
          </div>
        </div>
      </section>
    </>
  );
}

export default HeroSection;
