import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { Radio, Link2, FileText, Mic2, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

function Navbar() {
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { path: "/", label: "Home", icon: Radio },
    { path: "/speak", label: "Speak", icon: Mic2 },
    { path: "/url", label: "URL", icon: Link2 },
    { path: "/summarize", label: "Summarize", icon: FileText },
  ];

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 22 }}
      className="sticky top-0 z-50"
    >
      {/* Glass bar */}
      <div className="border-b border-[var(--border-color)] bg-[var(--bg-primary)]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

          {/* Logo — icon and text vertically centred on the same baseline */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="flex items-center gap-2.5"
          >
            {/* Icon mark */}
            <div className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 shadow-lg shadow-indigo-500/30">
              <span className="text-base font-bold leading-none text-white">తె</span>
              <div className="absolute inset-0 rounded-xl ring-1 ring-white/20" />
            </div>

            {/* Brand text — title + subtitle stacked and centred against the icon */}
            <div className="flex flex-col justify-center gap-0.5">
              <span
                className="text-[15px] font-semibold leading-none tracking-tight"
                style={{ color: 'var(--text-primary)' }}
              >
                Telugu AI
              </span>
              <span
                className="text-[11px] font-medium leading-none tracking-wider uppercase"
                style={{ color: 'var(--text-secondary)' }}
              >
                Summarizer &amp; Speech
              </span>
            </div>
          </motion.div>

          {/* Right: Nav + divider + theme toggle — all on one consistent baseline */}
          <div className="flex items-center gap-1">

            {/* Navigation links */}
            <nav className="flex items-center gap-1">
              {navItems.map((item, index) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `relative flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08 * index }}
                        className="relative z-10 flex items-center gap-1.5"
                      >
                        <item.icon className="h-[15px] w-[15px] flex-shrink-0" />
                        <span className="hidden sm:inline">{item.label}</span>
                      </motion.div>

                      {isActive && (
                        <motion.div
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200/60 dark:border-indigo-500/20"
                          transition={{ type: "spring", stiffness: 350, damping: 32 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Divider — single consistent margin via the parent gap */}
            <div className="mx-3 h-5 w-px flex-shrink-0 bg-[var(--border-color)]" />

            {/* Theme toggle */}
            <motion.button
              onClick={toggleTheme}
              whileTap={{ scale: 0.9 }}
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-secondary)] transition-all hover:border-indigo-300 hover:text-[var(--text-primary)] dark:hover:border-indigo-500/40"
              aria-label="Toggle theme"
            >
              <motion.div
                key={theme}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.25 }}
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </motion.div>
            </motion.button>
          </div>

        </div>
      </div>
    </motion.header>
  );
}

export default Navbar;