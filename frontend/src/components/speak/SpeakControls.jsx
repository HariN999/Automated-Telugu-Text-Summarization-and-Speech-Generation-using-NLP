import { motion } from "framer-motion";
import { RefreshCw, Play, Pause, Volume2, VolumeX } from "lucide-react";

const MotionButton = motion.button;
const MotionDiv = motion.div;

function SpeakControls({
  isLoading,
  newsData,
  isPlaying,
  isMuted,
  onPrev,
  onRefresh,
  onTogglePlayback,
  onNext,
  onToggleMute,
}) {
  return (
    <div className="flex items-center justify-center gap-3 sm:gap-4">
      <MotionButton
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={onPrev}
        disabled={newsData.length === 0}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] transition-all hover:border-indigo-300 hover:text-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:border-indigo-500/40"
      >
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
        </svg>
      </MotionButton>

      <MotionButton
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={onRefresh}
        disabled={isLoading}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] transition-all hover:border-indigo-300 hover:text-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:border-indigo-500/40"
      >
        <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
      </MotionButton>

      <MotionButton
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.93 }}
        onClick={onTogglePlayback}
        disabled={isLoading}
        className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 text-white shadow-2xl shadow-indigo-500/40 transition-all hover:shadow-indigo-500/60 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPlaying && (
          <>
            <MotionDiv
              animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full border-2 border-indigo-300"
            />
            <MotionDiv
              animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0, 0.2] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
              className="absolute inset-0 rounded-full border border-violet-300"
            />
          </>
        )}
        {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="ml-1 h-8 w-8" />}
      </MotionButton>

      <MotionButton
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={onNext}
        disabled={newsData.length === 0}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] transition-all hover:border-indigo-300 hover:text-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:border-indigo-500/40"
      >
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16 18h2V6h-2zm-11.5-6L13 6v12z" />
        </svg>
      </MotionButton>

      <MotionButton
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={onToggleMute}
        disabled={!isPlaying}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] transition-all hover:border-indigo-300 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:border-indigo-500/40"
      >
        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </MotionButton>
    </div>
  );
}

export default SpeakControls;
