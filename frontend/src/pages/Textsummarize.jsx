import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, FileText, Volume2, Download, Copy, CheckCircle2, ChevronDown } from "lucide-react";
import APIService from "../services/api";

const SAMPLE_TEXTS = [
  "తెలుగు భాష ద్రావిడ భాషల కుటుంబానికి చెందిన భాష. ఇది ఆంధ్రప్రదేశ్ మరియు తెలంగాణ రాష్ట్రాల అధికార భాష. తెలుగు భాష చాలా ప్రాచీనమైనది మరియు గొప్ప సాహిత్య సంప్రదాయం కలిగి ఉంది. దీనిని అమృతభాష అని కూడా పిలుస్తారు. తెలుగు భాషలో అనేక ప్రాచీన గ్రంథాలు, కావ్యాలు మరియు సాహిత్య రచనలు ఉన్నాయి. నన్నయ, తిక్కన, ఎర్రన వంటి మహా కవులు తెలుగు సాహిత్యానికి ఎనలేని సేవ చేశారు.",
  "భారతదేశం అనేక సంస్కృతులు మరియు సంప్రదాయాలకు నిలయం. ఈ దేశంలో వివిధ మతాలు, భాషలు మరియు కళలు సమృద్ధిగా ఉన్నాయి. భారతీయ నాగరికత ప్రపంచంలోనే అత్యంత ప్రాచీనమైనది. సింధూ నాగరికత నుండి నేటి ఆధునిక భారతదేశం వరకు ఈ దేశం అనేక మార్పులను చూసింది. భారతదేశ స్వాతంత్ర్య పోరాటం ప్రపంచానికే ఆదర్శంగా నిలిచింది.",
  "హైదరాబాద్ తెలంగాణ రాష్ట్రానికి రాజధాని. ఇది భారతదేశంలోని ముఖ్యమైన సాంకేతిక కేంద్రాలలో ఒకటి. ఈ నగరం దాని చారిత్రక స్మారక చిహ్నాలకు, బిరియానీకి మరియు ముత్యాల మార్కెట్‌కు ప్రసిద్ధి చెందింది. చార్మినార్, గోల్కొండ కోట మరియు హుస్సేన్ సాగర్ ఇక్కడ ప్రసిద్ధ పర్యాటక ప్రదేశాలు. హైదరాబాద్ IT పరిశ్రమలో ప్రముఖ పాత్ర పోషిస్తోంది.",
];

const SUMMARIZATION_METHODS = [
  {
    id: "tfidf",
    name: "TF-IDF",
    description: "Fast extractive summarization using statistical analysis",
    badge: "⚡ Fast",
    color: "blue",
    speed: "~1 second",
    quality: "Good",
    type: "Extractive",
  },
  {
    id: "indicbart",
    name: "IndicBART",
    description: "High-quality abstractive summarization using AI model",
    badge: "🤖 AI-Powered",
    color: "purple",
    speed: "~3-5 seconds",
    quality: "Excellent",
    type: "Abstractive",
  },
];

function TextSummarize() {
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState("");
  const [error, setError] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("tfidf");
  const [showMethodDropdown, setShowMethodDropdown] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentMethod = SUMMARIZATION_METHODS.find(m => m.id === selectedMethod);

  const loadSampleText = () => {
    const randomIndex = Math.floor(Math.random() * SAMPLE_TEXTS.length);
    setInputText(SAMPLE_TEXTS[randomIndex]);
    setSummary("");
    setAudioUrl("");
    setError("");
  };

  const handleSummarize = async () => {
    if (!inputText.trim()) {
      setError("Please enter some text to summarize");
      return;
    }

    setIsProcessing(true);
    setProcessingStatus(`Processing with ${currentMethod.name}...`);
    setError("");
    setSummary("");
    setAudioUrl("");

    try {
      const result = await APIService.summarizeText(inputText, selectedMethod);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      setProcessingStatus("Summary generated successfully!");
      setSummary(result.summary);
      
      // Set audio URL if available
      if (result.audioPath) {
        setAudioUrl(APIService.getAudioUrl(result.audioPath));
      }
      
      setTimeout(() => setProcessingStatus(""), 2000);
    } catch (err) {
      setError(err.message || "An error occurred while processing your request");
      console.error("Error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClear = () => {
    setInputText("");
    setSummary("");
    setAudioUrl("");
    setError("");
    setProcessingStatus("");
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

  const charCount = inputText?.length || 0;
  const isDisabled = !inputText.trim() || isProcessing;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 p-6 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent dark:from-blue-400 dark:to-purple-400">
            Telugu Text Summarization
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Summarize Telugu text using AI-powered algorithms
          </p>
        </motion.div>

        {/* Method Selector Dropdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex justify-center"
        >
          <div className="relative">
            <button
              onClick={() => setShowMethodDropdown(!showMethodDropdown)}
              disabled={isProcessing}
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
                  {currentMethod.type} • {currentMethod.speed}
                </div>
              </div>
              <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform ${showMethodDropdown ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showMethodDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-0 right-0 top-full z-10 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800"
                >
                  {SUMMARIZATION_METHODS.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => {
                        setSelectedMethod(method.id);
                        setShowMethodDropdown(false);
                      }}
                      className={`w-full border-b border-slate-100 p-4 text-left transition-colors last:border-b-0 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700/50 ${
                        selectedMethod === method.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-slate-900 dark:text-slate-100">
                              {method.name}
                            </span>
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                              {method.badge}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                            {method.description}
                          </p>
                          <div className="mt-2 flex gap-4 text-xs text-slate-500 dark:text-slate-500">
                            <span>Speed: {method.speed}</span>
                            <span>Quality: {method.quality}</span>
                            <span>Type: {method.type}</span>
                          </div>
                        </div>
                        {selectedMethod === method.id && (
                          <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        )}
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input Panel */}
          <motion.div
            className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                  Input Text
                </h3>
              </div>

              <button
                onClick={loadSampleText}
                disabled={isProcessing}
                className="text-sm text-blue-600 transition-colors hover:text-blue-700 disabled:opacity-50 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Load sample
              </button>
            </div>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="తెలుగు వచనం ఇక్కడ టైప్ చేయండి..."
              disabled={isProcessing}
              className="min-h-[400px] flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
              dir="auto"
            />

            <div className="mt-4 flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {charCount.toLocaleString()} characters
                </span>

                {isProcessing && processingStatus && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-blue-600 dark:text-blue-400"
                  >
                    {processingStatus}
                  </motion.span>
                )}
              </div>

              <div className="flex gap-2">
                {inputText && (
                  <button
                    onClick={handleClear}
                    disabled={isProcessing}
                    className="rounded-full bg-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={handleSummarize}
                  disabled={isDisabled}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2 text-sm font-medium text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 dark:from-blue-500 dark:to-purple-500"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Summarize
                    </>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 rounded-lg bg-red-100 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400"
              >
                {error}
              </motion.div>
            )}
          </motion.div>

          {/* Output Panel */}
          <motion.div
            className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                  Summary
                </h3>
              </div>
              {summary && (
                <button
                  onClick={() => copyToClipboard(summary)}
                  className="flex items-center gap-1 text-sm text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <span className="text-green-600 dark:text-green-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="min-h-[400px] flex-1 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
              {summary ? (
                <div className="space-y-4">
                  <p className="leading-relaxed text-slate-900 dark:text-slate-100" dir="auto">
                    {summary}
                  </p>
                  
                  {audioUrl && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 space-y-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
                    >
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <Volume2 className="h-4 w-4" />
                        <span>Audio generated</span>
                      </div>
                      <audio
                        controls
                        src={audioUrl}
                        className="w-full"
                        preload="metadata"
                      >
                        Your browser does not support the audio element.
                      </audio>
                      <a
                        href={audioUrl}
                        download="summary_audio.mp3"
                        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline dark:text-blue-400"
                      >
                        <Download className="h-4 w-4" />
                        Download Audio
                      </a>
                    </motion.div>
                  )}
                </div>
              ) : (
                <div className="flex h-full items-center justify-center text-slate-500 dark:text-slate-500">
                  {isProcessing ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
                      <p className="text-sm">Generating summary...</p>
                    </div>
                  ) : (
                    <p className="text-sm">
                      Your summary will appear here after processing
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default TextSummarize;