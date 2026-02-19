import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Link2, Loader2, CheckCircle2, AlertCircle,
  Play, Download, Copy, ExternalLink, ChevronDown,
} from "lucide-react";
import APIService from "../services/api";

const SUMMARIZATION_METHODS = [
  {
    id: "tfidf",
    name: "TF-IDF",
    badge: "⚡ Fast",
    description: "Picks the most important sentences directly from the article.",
  },
  {
    id: "mt5_base",
    name: "mT5 Base",
    badge: "🤖 AI",
    description: "Generates fluent summaries using the multilingual XLSum base model.",
  },
  {
    id: "mt5_finetuned",
    name: "mT5 Fine-tuned",
    badge: "✨ Best",
    description: "Highest quality — mT5 fine-tuned specifically on Telugu news.",
  },
];

/** Human-readable label for a method id */
const methodLabel = (id) =>
  SUMMARIZATION_METHODS.find((m) => m.id === id)?.name ?? id;

function PasteUrl() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("tfidf");
  const [showMethodDropdown, setShowMethodDropdown] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentMethod = SUMMARIZATION_METHODS.find((m) => m.id === selectedMethod);

  const handleFetchNews = async () => {
    if (!url.trim()) {
      setError("Please enter a valid URL");
      return;
    }
    try {
      new URL(url);
    } catch {
      setError("Please enter a valid URL starting with http:// or https://");
      return;
    }

    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await APIService.processUrl(url, selectedMethod);
      setResult({
        title: "News Article",
        summary: response.summary,
        audioUrl: response.audio_url
          ? APIService.getAudioUrl(response.audio_url)
          : null,
        originalUrl: url,
        method: response.method,
      });
    } catch (err) {
      setError(err.message || "Failed to process URL. Please check the URL and try again.");
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setUrl("");
    setResult(null);
    setError("");
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handlePlayAudio = () => {
    const audio = document.getElementById("summary-audio");
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 px-6 py-12 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/50">
            <Link2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent dark:from-blue-400 dark:to-purple-400">
            Fetch News from URL
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Paste a news article link to summarize and generate audio
          </p>
        </motion.div>

        {/* Method Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex justify-center"
        >
          <div className="relative">
            <button
              onClick={() => setShowMethodDropdown(!showMethodDropdown)}
              disabled={isLoading}
              className="flex items-center gap-3 rounded-xl border border-slate-300 bg-white px-6 py-3 shadow-sm transition-all hover:border-slate-400 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600"
            >
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {currentMethod.name}
                  </span>
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    {currentMethod.badge}
                  </span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-500">
                  {currentMethod.description}
                </div>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-slate-500 transition-transform ${showMethodDropdown ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {showMethodDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-0 right-0 top-full z-10 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800"
                  style={{ minWidth: "280px" }}
                >
                  {SUMMARIZATION_METHODS.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => {
                        setSelectedMethod(method.id);
                        setShowMethodDropdown(false);
                      }}
                      className={`w-full border-b border-slate-100 p-4 text-left transition-colors last:border-b-0 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700/50 ${
                        selectedMethod === method.id
                          ? "bg-blue-50 dark:bg-blue-900/20"
                          : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-slate-900 dark:text-slate-100">
                              {method.name}
                            </span>
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                              {method.badge}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {method.description}
                          </p>
                        </div>
                        {selectedMethod === method.id && (
                          <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                        )}
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* URL Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800"
        >
          <label className="mb-3 block text-sm font-medium text-slate-700 dark:text-slate-300">
            News Article URL
          </label>

          <div className="relative">
            <input
              type="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError("");
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !isLoading && url.trim()) {
                  handleFetchNews();
                }
              }}
              placeholder="https://example.com/telugu-news-article"
              disabled={isLoading}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 pr-12 text-slate-900 placeholder-slate-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
            <Link2 className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 flex items-center gap-2 rounded-lg bg-red-100 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400"
              >
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-6 flex gap-3">
            <button
              onClick={handleFetchNews}
              disabled={isLoading || !url.trim()}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 dark:from-blue-500 dark:to-purple-500"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  Fetch & Summarize
                </>
              )}
            </button>

            {url && !isLoading && (
              <button
                onClick={handleClear}
                className="rounded-xl border border-slate-200 bg-slate-100 px-6 py-3 font-semibold text-slate-700 transition-all hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
              >
                Clear
              </button>
            )}
          </div>
        </motion.div>

        {/* Result Card */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/20 dark:text-green-400">
                      ✓ Summarized with {methodLabel(result.method)}
                    </span>
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
                    {result.title}
                  </h3>
                  <a
                    href={result.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline dark:text-blue-400"
                  >
                    <ExternalLink className="h-3 w-3" />
                    View original article
                  </a>
                </div>
                <button
                  onClick={() => copyToClipboard(result.summary)}
                  className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100"
                  title="Copy summary"
                >
                  {copied ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <Copy className="h-5 w-5" />
                  )}
                </button>
              </div>

              <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900">
                <h4 className="mb-3 text-sm font-medium text-slate-600 dark:text-slate-400">
                  Summary
                </h4>
                <p className="leading-relaxed text-slate-900 dark:text-slate-100" dir="auto">
                  {result.summary}
                </p>
              </div>

              {result.audioUrl && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    Audio generated successfully
                  </div>

                  <audio
                    id="summary-audio"
                    src={result.audioUrl}
                    className="hidden"
                    onEnded={() => setIsPlaying(false)}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  />

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handlePlayAudio}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-500/30 transition-all hover:scale-105"
                    >
                      <Play className={`h-4 w-4 ${isPlaying ? "animate-pulse" : ""}`} />
                      {isPlaying ? "Playing..." : "Play Audio"}
                    </button>

                    <a
                      href={result.audioUrl}
                      download="summary_audio.mp3"
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </a>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        <AnimatePresence>
          {isLoading && !result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-12 shadow-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <Loader2 className="mb-4 h-12 w-12 animate-spin text-blue-600 dark:text-blue-400" />
              <p className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                Processing your URL...
              </p>
              <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                Fetching article, extracting text, and generating summary
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default PasteUrl;