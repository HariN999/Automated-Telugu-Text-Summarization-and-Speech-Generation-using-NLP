function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-100 dark:border-white/8 dark:bg-[#12121f] transition-colors duration-300">
      <div className="mx-auto max-w-6xl px-6 py-10">

        {/* Project Title */}
        <h3 className="mb-3 text-center text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">
          Telugu AI — Summarizer &amp; Speech
        </h3>

        {/* Project Description */}
        <p className="mb-6 mx-auto max-w-2xl text-center text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          Transform Telugu content into insights. Summarize articles, generate speech,
          and extract meaning with state-of-the-art language AI.
        </p>

        {/* Divider */}
        <div className="my-6 h-px bg-slate-200 dark:bg-white/8" />

        {/* Team Title */}
        <h4 className="mb-4 text-center text-base font-semibold text-slate-900 dark:text-white">
          Project Team
        </h4>

        {/* Team Members */}
        <div className="flex flex-wrap justify-center gap-5 text-sm text-slate-600 dark:text-slate-400">
          <span className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400">
            Hariharan Narlakanti
          </span>
          <span className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400">
            Vivek Nidumolu
          </span>
          <span className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400">
            Vishnu Vardhan Reddy Padala
          </span>
          <span className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400">
            Sanjeev Practur
          </span>
        </div>

        {/* Divider */}
        <div className="my-6 h-px bg-slate-200 dark:bg-white/8" />

        {/* Copyright */}
        <p className="text-center text-sm text-slate-400 dark:text-slate-500">
          © {new Date().getFullYear()} Telugu AI · All rights reserved
        </p>

      </div>
    </footer>
  );
}

export default Footer;