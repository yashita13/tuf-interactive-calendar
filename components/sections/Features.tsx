"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Calendar, Edit3, Settings, Smartphone, PieChart, MousePointer2 } from "lucide-react";

const FeatureCard = ({ icon: Icon, title, description, delay, index }: any) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`flex flex-col md:flex-row items-center gap-12 py-24 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
    >
      <div className="flex-1 space-y-6">
        <div className="w-14 h-14 bg-accent-blue/10 rounded-2xl flex items-center justify-center text-accent-blue border border-accent-blue/10 shadow-inner">
          <Icon size={28} />
        </div>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight font-heading text-foreground">{title}</h2>
        <p className="text-lg text-gray-text leading-relaxed max-w-lg font-medium">
          {description}
        </p>
      </div>
      
      <div className="flex-1 w-full bg-card-bg/40 backdrop-blur-md border border-border-color rounded-[2.5rem] p-10 shadow-2xl relative group transition-all hover:scale-[1.02] duration-500 overflow-hidden">
        <div className="absolute inset-0 bg-accent-blue/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem]" />
        
        {/* Mock visual representation */}
        <div className="aspect-video bg-background/50 rounded-3xl flex items-center justify-center border border-border-color shadow-inner relative z-10 overflow-hidden">
           <motion.div 
             initial={{ scale: 0.8, opacity: 0 }}
             animate={isInView ? { scale: 1, opacity: 0.1 } : { scale: 0.8, opacity: 0 }}
             transition={{ duration: 1, delay: delay + 0.2 }}
             className="absolute inset-0 flex items-center justify-center"
           >
             <Icon size={240} strokeWidth={0.5} className="text-accent-blue" />
           </motion.div>
           
           <div className="relative flex flex-col items-center gap-4 z-20">
              <div className="w-32 h-1 bg-accent-blue/20 rounded-full animate-pulse" />
              <div className="flex gap-2">
                 <div className="w-2 h-2 rounded-full bg-accent-blue shadow-lg shadow-accent-blue/40" />
                 <div className="w-2 h-2 rounded-full bg-orange-500 shadow-lg shadow-orange-500/40" />
                 <div className="w-2 h-2 rounded-full bg-accent-blue/40" />
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export function Features() {
  const features = [
    {
      icon: MousePointer2,
      title: "Precision Range Selection",
      description: "Document span effortlessly. Click to set start, click to finalize end. Chronicle automatically calculates duration and highlights the timeline span with visual fluidity.",
      delay: 0.1
    },
    {
      icon: Edit3,
      title: "Tactile Memos & Events",
      description: "Classify entries with intent. Choose between simple memos or pivotal events, documented on our signature ruled-paper editor with real-time persistence.",
      delay: 0.2
    },
    {
       icon: PieChart,
       title: "Deep Insights & Metrics",
       description: "Visualize your throughput. Get real-time analytics on your monthly entries, selections, and event distributions directly within your workspace.",
       delay: 0.3
    },
    {
      icon: Smartphone,
      title: "Surface-Agnostic Design",
      description: "A flawless transition from desktop to touch. Chronicle adapts its interactive layout to honor the spatial arrangement of a physical wall calendar on any device.",
      delay: 0.4
    }
  ];

  return (
    <section id="features" className="relative py-24 md:py-48 px-6 md:px-12 bg-background transition-colors duration-500 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="mb-24 text-center max-w-2xl mx-auto flex flex-col items-center">
           <motion.div 
             initial={{ opacity: 0, scale: 0.8 }}
             whileInView={{ opacity: 1, scale: 1 }}
             className="mb-8 p-3 rounded-2xl bg-accent-blue/10 border border-accent-blue/20"
           >
              <Settings size={20} className="text-accent-blue animate-spin-slow" />
           </motion.div>
           <h3 className="text-sm font-bold text-accent-blue tracking-[0.3em] uppercase mb-6 drop-shadow-sm">The Ecosystem</h3>
           <p className="text-4xl md:text-6xl font-bold tracking-tight font-heading leading-tight text-foreground">
             Crafted for precise <br />digital documentation.
           </p>
        </div>

        <div className="space-y-12">
          {features.map((feature, idx) => (
            <FeatureCard key={idx} {...feature} index={idx} />
          ))}
        </div>
      </div>

      {/* Decorative ambient light */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-accent-blue/5 rounded-full blur-[160px] pointer-events-none opacity-40 animate-pulse" />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-accent-blue/5 rounded-full blur-[160px] pointer-events-none opacity-40 animate-pulse" />
    </section>
  );
}
