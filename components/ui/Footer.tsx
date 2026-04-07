"use client";

import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="py-12 md:py-24 px-6 md:px-12 bg-background border-t border-border-color transition-colors duration-500 overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="flex flex-col items-center md:items-start gap-4">
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
          <p className="text-sm text-gray-text font-medium max-w-sm text-center md:text-left">
            A premium, physical calendar experience designed for digital focus.
            Recreating the timeless wall calendar aesthetic in a modern Next.js app.
            <br /><br />Build by :<br /> Yashita Bahrani
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 text-sm font-semibold text-gray-text">
          <a href="https://portfolio-animation-chi.vercel.app/" className="hover:text-accent-blue transition-colors">Portfolio</a>
          <a href="https://github.com/yashita13" className="hover:text-accent-blue transition-colors">GitHub</a>
          <a href="https://www.linkedin.com/in/yashita-bahrani/" className="hover:text-accent-blue transition-colors">LinkedIn</a>
          <a href="https://drive.google.com/file/d/1K_rx47013ihfytNULVwI5gsTc2wEMpaq/view?usp=sharing" className="hover:text-accent-blue transition-colors">Resume</a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-12 md:mt-24 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-text/40">
        <p>© 2026 Chronicle. Built with Precision.</p>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-accent-blue transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-accent-blue transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
