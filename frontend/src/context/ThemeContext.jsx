import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(undefined);

export function ThemeProvider({ children }) {
  // Initialize theme state
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  // Load theme on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "dark" || savedTheme === "light") {
        setTheme(savedTheme);
      }
    } catch (error) {
      console.error("Error loading theme:", error);
    }
    setMounted(true);
  }, []);

  // Apply theme changes
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    
    try {
      // Remove both classes
      root.classList.remove("light", "dark");
      
      // Add current theme
      root.classList.add(theme);
      
      // Save to localStorage
      localStorage.setItem("theme", theme);
    } catch (error) {
      console.error("[Theme] Error applying theme:", error);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }; 

  // Prevent flash of unstyled content
  if (!mounted) {
    return null;
  }

  const value = { theme, toggleTheme };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}