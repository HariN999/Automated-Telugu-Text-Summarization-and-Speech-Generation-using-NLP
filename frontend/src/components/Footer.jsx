function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/80">
      <div className="mx-auto max-w-6xl px-6 py-8">

        {/* Project Title */}
        <h3 className="mb-2 text-center text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
          Telugu AI — Summarizer & Speech
        </h3>

        {/* Project Description */}
        <p className="mb-6 text-center text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Transform Telugu content into insights. Summarize articles, generate speech, and extract meaning with state-of-the-art language AI.
        </p>

        {/* Divider */}
        <div className="my-6 h-px bg-slate-200 dark:bg-slate-700" />

        {/* Team Title */}
        <h4 className="mb-4 text-center text-lg font-semibold text-slate-900 dark:text-white">
          Project Team
        </h4>

        {/* Team Members */}
        <div className="flex flex-wrap justify-center gap-6 text-slate-600 dark:text-slate-400">
          <span className="hover:text-blue-600 dark:hover:text-blue-400 transition">
            Hariharan Narlakanti
          </span>
          <span className="hover:text-blue-600 dark:hover:text-blue-400 transition">
            Vivek Nidumolu
          </span>
          <span className="hover:text-blue-600 dark:hover:text-blue-400 transition">
            Vishnu Vardhan Reddy Padala
          </span>
          <span className="hover:text-blue-600 dark:hover:text-blue-400 transition">
            Sanjeev Practur
          </span>
        </div>

        {/* Divider */}
        <div className="my-6 h-px bg-slate-200 dark:bg-slate-700" />

        {/* Copyright */}
        <p className="text-center text-sm text-slate-500 dark:text-slate-500">
          © {new Date().getFullYear()} Telugu AI • All rights reserved
        </p>

      </div>
    </footer>
  );
}

export default Footer;