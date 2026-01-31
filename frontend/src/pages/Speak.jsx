import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Radio, FileText, BarChart3, Circle } from "lucide-react";

const MODES = [
  {
    id: "radio",
    name: "Radio Mode",
    icon: Radio,
    description: "Continuous headline-style audio stream for quick news consumption",
    color: "blue",
  },
  {
    id: "brief",
    name: "Brief Mode",
    icon: FileText,
    description: "2–3 sentence summaries for fast essential information",
    color: "green",
  },
  {
    id: "analysis",
    name: "Analysis Mode",
    icon: BarChart3,
    description: "Detailed contextual summaries with background information",
    color: "purple",
  },
];

function Speak() {
  const [isRecording, setIsRecording] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [selectedMode, setSelectedMode] = useState("radio");
  const [audioLevel, setAudioLevel] = useState(0);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;

      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

      const updateLevel = () => {
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setAudioLevel(average / 255);
        animationFrameRef.current = requestAnimationFrame(updateLevel);
      };

      updateLevel();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setIsRecording(false);
    setAudioLevel(0);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex flex-col items-center justify-between gap-4 sm:flex-row"
        >
          <div className="text-center sm:text-left">
            <h1 className="mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-4xl font-bold text-transparent">
              AI News Radio
            </h1>
            <p className="text-slate-400">
              Voice-powered Telugu & English news summarization
            </p>
          </div>

          {/* Language Toggle */}
          <div className="flex gap-1 rounded-full border border-white/10 bg-slate-800/50 p-1 backdrop-blur-sm">
            <button
              onClick={() => setSelectedLanguage("en")}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                selectedLanguage === "en"
                  ? "bg-blue-500 text-white shadow-lg shadow-blue-500/50"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              English
            </button>
            <button
              onClick={() => setSelectedLanguage("te")}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                selectedLanguage === "te"
                  ? "bg-blue-500 text-white shadow-lg shadow-blue-500/50"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              తెలుగు
            </button>
          </div>
        </motion.div>

        {/* Recording Interface */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-16 flex flex-col items-center"
        >
          {/* Mic Button */}
          <div className="relative">
            {/* Animated rings when recording */}
            <AnimatePresence>
              {isRecording && (
                <>
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 1, opacity: 0.5 }}
                      animate={{
                        scale: 1 + i * 0.3,
                        opacity: 0,
                      }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.4,
                      }}
                      className="absolute inset-0 rounded-full border-2 border-red-500"
                      style={{
                        filter: "blur(1px)",
                      }}
                    />
                  ))}
                </>
              )}
            </AnimatePresence>

            {/* Main button */}
            <motion.button
              onClick={toggleRecording}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative flex h-44 w-44 items-center justify-center rounded-full shadow-2xl transition-all ${
                isRecording
                  ? "bg-gradient-to-br from-red-500 to-red-600 shadow-red-500/50"
                  : "bg-gradient-to-br from-blue-500 to-purple-600 shadow-blue-500/50"
              }`}
            >
              {/* Audio level indicator */}
              {isRecording && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-red-400/30"
                  animate={{
                    scale: 1 + audioLevel * 0.2,
                  }}
                  transition={{ duration: 0.1 }}
                />
              )}

              {/* Icon */}
              <motion.div
                animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {isRecording ? (
                  <MicOff className="h-16 w-16 text-white" />
                ) : (
                  <Mic className="h-16 w-16 text-white" />
                )}
              </motion.div>

              {/* Recording indicator */}
              {isRecording && (
                <motion.div
                  className="absolute -top-2 -right-2 flex items-center gap-2 rounded-full bg-red-500 px-3 py-1 text-xs font-medium text-white"
                  animate={{ opacity: [1, 0.6, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Circle className="h-2 w-2 fill-current" />
                  REC
                </motion.div>
              )}
            </motion.button>
          </div>

          {/* Status text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-center"
          >
            <p className="mb-1 text-lg font-semibold text-white">
              {isRecording ? "Recording..." : "Ready to Record"}
            </p>
            <p className="text-sm text-slate-400">
              {isRecording
                ? "Speak your news text clearly"
                : "Click the microphone to start speaking"}
            </p>
          </motion.div>
        </motion.div>

        {/* Mode Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="mb-6 text-center text-xl font-semibold text-white">
            Choose Summary Mode
          </h3>

          <div className="grid gap-4 sm:grid-cols-3">
            {MODES.map((mode, index) => {
              const isSelected = selectedMode === mode.id;
              const colorClasses = {
                blue: "from-blue-500/20 to-blue-600/20 border-blue-500/30 hover:border-blue-500/50",
                green: "from-green-500/20 to-green-600/20 border-green-500/30 hover:border-green-500/50",
                purple: "from-purple-500/20 to-purple-600/20 border-purple-500/30 hover:border-purple-500/50",
              };

              return (
                <motion.button
                  key={mode.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  onClick={() => setSelectedMode(mode.id)}
                  className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 text-left transition-all ${
                    isSelected
                      ? `${colorClasses[mode.color]} scale-105 shadow-lg`
                      : "border-white/10 bg-slate-800/30 hover:border-white/20"
                  }`}
                >
                  <div className="relative z-10">
                    <mode.icon
                      className={`mb-3 h-7 w-7 transition-colors ${
                        isSelected ? `text-${mode.color}-400` : "text-slate-400 group-hover:text-white"
                      }`}
                    />
                    <h4 className="mb-2 text-lg font-semibold text-white">
                      {mode.name}
                    </h4>
                    <p className="text-sm text-slate-400">
                      {mode.description}
                    </p>
                  </div>

                  {/* Selection indicator */}
                  {isSelected && (
                    <motion.div
                      layoutId="mode-indicator"
                      className="absolute right-4 top-4 h-3 w-3 rounded-full bg-white shadow-lg"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Speak;