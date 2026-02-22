function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface-muted)] transition-colors duration-300">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h3 className="mb-3 text-center text-2xl font-bold gradient-text">
          Telugu AI — Summarizer &amp; Speech
        </h3>

        <p className="app-subtle mx-auto mb-6 max-w-2xl text-center text-sm leading-relaxed">
          Transform Telugu content into insights. Summarize articles, generate speech,
          and extract meaning with state-of-the-art language AI.
        </p>

        <div className="my-6 h-px bg-[var(--border)]" />

        <h4 className="mb-4 text-center text-base font-semibold text-[var(--text-primary)]">
          Project Team
        </h4>

        <div className="flex flex-wrap justify-center gap-5 text-sm text-[var(--text-secondary)]">
          <span className="transition-colors hover:text-indigo-500">
            Hariharan Narlakanti
          </span>
          <span className="transition-colors hover:text-indigo-500">
            Vivek Nidumolu
          </span>
          <span className="transition-colors hover:text-indigo-500">
            Vishnu Vardhan Reddy Padala
          </span>
          <span className="transition-colors hover:text-indigo-500">
            Sanjeev Practur
          </span>
        </div>

        <div className="my-6 h-px bg-[var(--border)]" />

        <p className="text-center text-sm text-[var(--text-secondary)]/80">
          © {new Date().getFullYear()} Telugu AI · All rights reserved
        </p>
      </div>
    </footer>
  );
}

export default Footer;
