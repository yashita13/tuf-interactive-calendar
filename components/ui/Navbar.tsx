"use client";

import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { motion } from "framer-motion";
import Link from "next/link";

export function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 w-full h-16 md:h-20 z-50 flex items-center justify-between px-6 md:px-12 backdrop-blur-md bg-background/50 border-b border-border-color"
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-accent-blue rounded-lg flex items-center justify-center shadow-lg shadow-accent-blue/20">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
          </svg>
        </div>
        <span className="text-xl font-bold tracking-tight text-foreground">Chronicle</span>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <Link 
          href="#calendar" 
          className="hidden md:flex px-5 py-2 bg-accent-blue hover:bg-accent-blue/90 text-white rounded-full text-sm font-semibold transition-all shadow-lg shadow-accent-blue/20 active:scale-95"
        >
          Explore Calendar
        </Link>
      </div>
    </motion.nav>
  );
}
