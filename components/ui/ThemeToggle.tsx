"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  if (!mounted) return <div className="p-2 w-10 h-10" />;

  const isDark = resolvedTheme === "dark";

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      className="p-2.5 rounded-xl bg-accent-blue/5 hover:bg-accent-blue/10 transition-colors focus:outline-none border border-accent-blue/10"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
           key={isDark ? "dark" : "light"}
           initial={{ opacity: 0, rotate: -45, scale: 0.5 }}
           animate={{ opacity: 1, rotate: 0, scale: 1 }}
           exit={{ opacity: 0, rotate: 45, scale: 0.5 }}
           transition={{ duration: 0.3, ease: "backOut" }}
        >
          {isDark ? (
            <Moon size={20} className="text-accent-blue transition-colors" />
          ) : (
            <Sun size={20} className="text-orange-500 transition-colors" />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
}
