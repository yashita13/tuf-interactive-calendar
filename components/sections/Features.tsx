"use client";

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Settings,
  MousePointer2,
  BarChart3,
  Palette,
  Zap,
  LucideIcon
} from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

const features: Feature[] = [
  {
    icon: MousePointer2,
    title: "Intelligent Range Selection",
    description: "Select date ranges with click, drag, or keyboard input. Includes live preview, reverse selection handling, and automatic duration calculation.",
    color: "#3b82f6" // accent-blue
  },
  {
    icon: BarChart3,
    title: "Smart Notes & Event System",
    description: "Attach categorized notes (Work, Personal, Urgent) to single dates or ranges. Supports recurring events and real-time persistence.",
    color: "#f97316" // orange-500
  },
  {
    icon: Palette,
    title: "Calendar Intelligence",
    description: "Automatically highlights weekends and holidays, with quick navigation using Today button and month/year selector.",
    color: "#8b5cf6" // violet-500
  },
  {
    icon: Zap,
    title: "Real-Time Insights",
    description: "Track usage with built-in analytics including selected days, notes count, and monthly activity patterns.",
    color: "#10b981" // emerald-500
  }
];

const HorizontalMarquee = ({ text, isActive }: { text: string; isActive: boolean }) => {
  return (
    <div className="overflow-hidden whitespace-nowrap py-2 flex select-none pointer-events-none">
      <motion.div
        animate={isActive ? { x: [0, -1000] } : { x: 0 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="flex gap-8 items-center"
      >
        {[...Array(10)].map((_, i) => (
          <span key={i} className="text-5xl md:text-8xl font-bold uppercase tracking-tighter opacity-10">
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

const FeatureRow = ({ feature, index }: { feature: Feature; index: number }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const isInView = useInView(ref, { margin: "-45% 0px -45% 0px" });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity }}
      className={`relative min-h-[60vh] flex flex-col justify-center items-center transition-all duration-700 w-full group ${isInView ? "z-20 scale-100" : "z-10 scale-95 opacity-30 grayscale"
        }`}
    >
      {/* Background Highlight */}
      <motion.div
        initial={false}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[300px] md:h-[400px] bg-accent-blue/5 backdrop-blur-3xl rounded-[4rem] -z-10 border border-accent-blue/10"
      />

      {/* Marquee Background */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none opacity-20">
        <HorizontalMarquee text={feature.title} isActive={isInView} />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 px-6 md:px-12 max-w-7xl mx-auto w-full">
        {/* Text Content */}
        <div className="flex-1 space-y-6 text-center md:text-left">
          <motion.div
            animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0.5 }}
            className="w-16 h-16 rounded-2xl flex items-center justify-center border shadow-xl mx-auto md:mx-0"
            style={{
              backgroundColor: `${feature.color}15`,
              borderColor: `${feature.color}30`,
              color: feature.color
            }}
          >
            <feature.icon size={32} />
          </motion.div>

          <h2 className="text-4xl md:text-7xl font-bold tracking-tighter font-heading text-foreground">
            {feature.title}
          </h2>

          <p className="text-lg md:text-xl text-gray-text leading-relaxed max-w-xl font-medium mx-auto md:mx-0">
            {feature.description}
          </p>

          {/* <motion.button
            animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            className="px-8 py-4 bg-foreground text-background rounded-full font-bold text-sm tracking-widest uppercase hover:scale-105 transition-transform"
          >
            Explore Detail
          </motion.button> */}
        </div>

        {/* Visual Mockup */}
        <div className="flex-1 relative w-full aspect-square md:aspect-video flex items-center justify-center">
          <motion.div
            style={{ scale }}
            className="relative w-full max-w-lg aspect-square bg-card-bg/40 backdrop-blur-md border border-border-color rounded-[3rem] p-8 shadow-2xl overflow-hidden group/visual"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />

            {/* Inner "App Shell" */}
            <div className="h-full w-full bg-background/50 rounded-2xl border border-border-color shadow-inner flex flex-col overflow-hidden relative">
              <div className="p-4 border-b border-border-color flex gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500/50" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                <div className="w-2 h-2 rounded-full bg-green-500/50" />
              </div>

              <div className="flex-1 flex items-center justify-center p-6 relative">
                <motion.div
                  animate={isInView ? {
                    rotateY: [0, 10, 0, -10, 0],
                    y: [0, -10, 0]
                  } : {}}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="relative z-20"
                >
                  <feature.icon
                    size={120}
                    strokeWidth={1}
                    style={{ color: feature.color }}
                    className="drop-shadow-[0_0_20px_rgba(0,0,0,0.3)]"
                  />
                </motion.div>

                {/* Decorative element background */}
                <div
                  className="absolute inset-0 blur-[80px] opacity-20"
                  style={{ backgroundColor: feature.color }}
                />
              </div>

              {/* Progress bars mock */}
              <div className="p-6 space-y-3">
                <div className="h-2 w-3/4 bg-border-color rounded-full overflow-hidden">
                  <motion.div
                    animate={isInView ? { width: "100%" } : { width: "0%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-accent-blue"
                    style={{ backgroundColor: feature.color }}
                  />
                </div>
                <div className="h-2 w-1/2 bg-border-color rounded-full" />
              </div>
            </div>
          </motion.div>

          {/* Floating tags */}
          {/* <motion.div
            animate={isInView ? { x: 0, opacity: 1 } : { x: 20, opacity: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute -top-4 -right-4 p-4 bg-accent-blue/10 backdrop-blur-md border border-accent-blue/20 rounded-2xl shadow-xl z-30"
          >
            <div className="text-xs font-bold text-accent-blue uppercase tracking-widest">Advanced</div>
          </motion.div> */}
        </div>
      </div>
    </motion.div>
  );
};

export function Features() {
  const containerRef = useRef(null);

  return (
    <section
      id="features"
      ref={containerRef}
      className="relative py-24 md:py-48 bg-background transition-colors duration-500"
    >
      <div className="max-w-7xl mx-auto px-6 mb-32 text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="mb-8 p-3 rounded-2xl bg-accent-blue/10 border border-accent-blue/20"
        >
          <Settings size={20} className="text-accent-blue animate-spin-slow" />
        </motion.div>

        <h3 className="text-sm font-bold text-accent-blue tracking-[0.3em] uppercase mb-6 drop-shadow-sm">
          Core Capabilities
        </h3>

        <h2 className="text-5xl md:text-8xl font-bold tracking-tighter font-heading leading-[0.9] text-foreground mb-8">
          Crafted for precise <br />digital documentation.
        </h2>

        <p className="text-xl text-gray-text max-w-2xl font-medium">
          The next generation of temporal management, fused with industrial precision and aesthetic elegance.
        </p>
      </div>

      <div className="space-y-[20vh] pb-[40vh]">
        {features.map((feature, idx) => (
          <FeatureRow key={idx} feature={feature} index={idx} />
        ))}
      </div>

      {/* Decorative ambient light */}
      <div className="sticky top-1/2 -translate-y-1/2 w-full h-0 pointer-events-none">
        <div className="absolute left-0 w-[800px] h-[800px] bg-accent-blue/5 rounded-full blur-[200px] -translate-x-1/2 opacity-30 animate-pulse" />
        <div className="absolute right-0 w-[800px] h-[800px] bg-accent-blue/5 rounded-full blur-[200px] translate-x-1/2 opacity-30 animate-pulse" />
      </div>
    </section>
  );
}
