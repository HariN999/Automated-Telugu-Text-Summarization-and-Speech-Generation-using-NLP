import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Globe } from "lucide-react";
import { useRef } from "react";

function HeroSection({ onGetStarted }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-20"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Gradient orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-500/30 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-purple-500/30 blur-3xl"
        />

        {/* Grid pattern */}
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

      <motion.div
        style={{ opacity, scale }}
        className="relative z-10 mx-auto max-w-6xl text-center"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 inline-flex items-center gap-2"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-300 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Powered by Advanced AI
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-6 bg-gradient-to-br from-white via-blue-100 to-purple-200 bg-clip-text text-6xl font-bold leading-tight tracking-tight text-transparent sm:text-7xl md:text-8xl lg:text-9xl"
        >
          AI that speaks
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text">
            తెలుగు
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto mb-12 max-w-3xl text-lg text-slate-300 sm:text-xl"
        >
          Transform Telugu content into insights. Summarize articles, generate
          speech, and extract meaning with state-of-the-art language AI.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-20 flex flex-wrap items-center justify-center gap-4"
        >
          <button
            onClick={onGetStarted}
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-blue-500/50 transition-all hover:scale-105 hover:shadow-xl hover:shadow-blue-500/60"
          >
            <span className="relative z-10 flex items-center gap-2">
              Get Started
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 transition-opacity group-hover:opacity-100" />
          </button>

          <button className="group inline-flex items-center gap-2 rounded-full border border-slate-600 bg-slate-800/50 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:border-slate-500 hover:bg-slate-800/70">
            Learn More
            <Zap className="h-5 w-5 transition-transform group-hover:rotate-12" />
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="grid grid-cols-1 gap-8 sm:grid-cols-3"
        >
          {[
            { icon: Sparkles, value: "99.2%", label: "Accuracy Rate" },
            { icon: Zap, value: "<50ms", label: "Response Time" },
            { icon: Globe, value: "10M+", label: "Words Processed" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + i * 0.1 }}
              className="group relative rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-white/10 hover:bg-white/10"
            >
              <stat.icon className="mb-3 h-6 w-6 text-blue-400 transition-transform group-hover:scale-110" />
              <div className="mb-1 text-3xl font-bold text-white">
                {stat.value}
              </div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-12 w-7 items-start justify-center rounded-full border-2 border-slate-600 p-1.5"
          >
            <motion.div
              animate={{ height: ["30%", "50%", "30%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 rounded-full bg-slate-400"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default HeroSection;