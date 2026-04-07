"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ChevronDown, MousePointer2 } from "lucide-react";

export function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

  return (
    <section ref={ref} className="relative h-screen flex flex-col items-center justify-center pt-16 md:pt-20 overflow-hidden transition-colors duration-500">
      {/* Cinematic Background Image with Parallax */}
      <motion.div
        style={{ scale, opacity, y }}
        className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2600&auto=format&fit=crop')] bg-cover bg-center"
      >
        <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] transition-colors duration-500"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background transition-colors duration-500"></div>
      </motion.div>

      <div className="relative z-10 text-center px-6 max-w-5xl pb-20 md:pb-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-20 mb-10 px-6 py-2.5 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-[10px] md:text-xs font-black uppercase tracking-[0.4em] inline-flex items-center gap-3 shadow-inner shadow-accent-blue/5"
          >
            <div className="w-2 h-2 rounded-full bg-accent-blue animate-pulse shadow-[0_0_15px_rgba(48,139,231,0.8)]" />
            V0.3 • The Intelligence Update
          </motion.div>

          <motion.h1
            className="text-7xl md:text-[10rem] font-black tracking-tighter font-heading leading-[0.8] mb-12 text-foreground transition-colors duration-500 uppercase"
          >
            CHRONICLE.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue via-accent-blue/80 to-accent-blue/60 drop-shadow-2xl">
              INTERACTIVE.
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-text font-bold mb-16 max-w-3xl mx-auto leading-relaxed transition-colors duration-500 uppercase tracking-tight"
          >
            Precision engineering for your timeline. <br />
            <span className="text-foreground/40">Drag. Document. Analyze. Repeat.</span>
          </motion.p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-15">
            <Link
              href="#calendar"
              className="group relative px-10 py-5 bg-accent-blue hover:bg-accent-blue/90 text-white rounded-[1.25rem] font-black uppercase tracking-widest text-[11px] transition-all shadow-2xl shadow-accent-blue/40 active:scale-95 flex items-center gap-3 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none skew-x-12" />
              <MousePointer2 size={16} />
              Start Planning
            </Link>
            <Link
              href="#features"
              className="px-10 py-5 bg-background/50 backdrop-blur-md border border-border-color hover:bg-background/80 text-foreground rounded-[1.25rem] font-black uppercase tracking-widest text-[11px] transition-all active:scale-95"
            >
              Discover
            </Link>
          </div>
        </motion.div>
      </div>

      <motion.div
        style={{ opacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-text hidden md:flex flex-col items-center gap-3 cursor-pointer group"
        onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-blue/40 group-hover:text-accent-blue transition-colors">Scroll to explore</span>
        <div className="relative w-6 h-10 border-2 border-accent-blue/20 rounded-full flex justify-center p-1.5 transition-colors group-hover:border-accent-blue/40">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-1 h-1 rounded-full bg-accent-blue"
          />
        </div>
      </motion.div>

      <div className="absolute inset-0 hero-gradient pointer-events-none opacity-50 transition-colors" />
    </section>
  );
}
