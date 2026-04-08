'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarGrid } from '@/components/CalendarGrid';
import { NotesPanel } from '@/components/NotesPanel';
import { useCalendar } from '@/hooks/useCalendar';
import { useNotes } from '@/hooks/useNotes';
import { ImageSection } from '@/components/ImageSection';
import { format, parseISO } from 'date-fns';
import { Calendar as CalendarIcon, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ExportModal } from './ExportModal';
import { Download } from 'lucide-react';


export function WallCalendar() {
  const calendar = useCalendar();
  const notesStore = useNotes();

  const { selectionStats, currentDate } = calendar;
  const monthlyStats = notesStore.getMonthlyStats(currentDate);

  const [accentColor, setAccentColor] = useState('#308be7');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);


  useEffect(() => {
    document.documentElement.style.setProperty('--accent-blue', accentColor);
    // Rough RGB approximation for shadows/transparency
    const r = parseInt(accentColor.slice(1, 3), 16);
    const g = parseInt(accentColor.slice(3, 5), 16);
    const b = parseInt(accentColor.slice(5, 7), 16);
    document.documentElement.style.setProperty('--accent-color-rgb', `${r}, ${g}, ${b}`);
  }, [accentColor]);

  const ACCENTS = [
    { name: 'Classic', color: '#308be7' },
    { name: 'Emerald', color: '#10b981' },
    { name: 'Rose', color: '#f43f5e' },
    { name: 'Amber', color: '#f59e0b' },
    { name: 'Violet', color: '#8b5cf6' },
  ];

  if (!notesStore.isLoaded) return null;

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto px-4 md:px-0">
      {/* Product Analytics & Selection Bar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 px-6 py-4 bg-card-bg/40 backdrop-blur-xl rounded-2xl border border-border-color shadow-2xl transition-all duration-500 overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-accent-blue/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-accent-blue/10 flex items-center justify-center text-accent-blue border border-accent-blue/20 shadow-inner">
            <CalendarIcon size={24} />
          </div>
          <div className="flex flex-col">
            <AnimatePresence mode="wait">
              {!selectionStats ? (
                <motion.div
                  key="default"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex flex-col"
                >
                  <span className="text-sm font-black uppercase tracking-[0.2em] text-accent-blue/60 mb-0.5">Focus Target</span>
                  <span className="text-lg font-bold text-gray-text/40">Select a range to begin</span>
                </motion.div>
              ) : (
                <motion.div
                  key="selected"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex flex-col"
                >
                  <span className="text-sm font-black uppercase tracking-[0.2em] text-accent-blue/60 mb-0.5">
                    {selectionStats.days} {selectionStats.days === 1 ? 'Day' : 'Days'} Insight
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-foreground transition-colors">
                      {format(selectionStats.start, 'MMM d')}
                    </span>
                    {selectionStats.days > 1 && (
                      <>
                        <div className="w-4 h-[2px] bg-accent-blue/30 rounded-full" />
                        <span className="text-xl font-bold text-foreground transition-colors">
                          {format(selectionStats.end, 'MMM d')}
                        </span>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-8 relative z-10">
          {/* Accent Picker */}
          <div className="flex items-center gap-3 p-1.5 bg-background/50 rounded-full border border-border-color shadow-sm">
            {ACCENTS.map((a) => (
              <button
                key={a.color}
                onClick={() => setAccentColor(a.color)}
                className={cn(
                  "w-6 h-6 rounded-full transition-all hover:scale-125 active:scale-95 border-2",
                  accentColor === a.color ? "border-white scale-110 shadow-lg" : "border-transparent opacity-60"
                )}
                style={{ backgroundColor: a.color }}
                title={a.name}
              />
            ))}
          </div>

          <div className="h-8 w-[1px] bg-border-color hidden sm:block" />


            <div className="flex items-center gap-8 font-heading">

            <div className="flex flex-col items-center">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-text/30">Memos</span>
              <span className="text-2xl font-bold text-accent-blue leading-none mt-1">{monthlyStats.totalNotes}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-text/30">Events</span>
              <span className="text-2xl font-bold text-orange-500 leading-none mt-1">{monthlyStats.totalEvents}</span>
            </div>
            <div className="flex flex-col items-start px-4 border-l border-border-color">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-text/30">Prime Focus</span>
              <span className={cn(
                "text-xs font-black uppercase tracking-widest mt-1",
                monthlyStats.mostActiveCategory === 'work' ? "text-accent-blue" :
                  monthlyStats.mostActiveCategory === 'personal' ? "text-emerald-500" :
                    monthlyStats.mostActiveCategory === 'urgent' ? "text-rose-500" : "text-gray-text"
              )}>
                {monthlyStats.mostActiveCategory || 'N/A'}
              </span>
            </div>
          </div>

        </div>
      </div>


      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full bg-card-bg rounded-2xl shadow-[0_30px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col border border-border-color transition-colors duration-500 ring-1 ring-white/5"
      >
        {/* Fake Spiral Binding Holes */}
        <div className="absolute top-0 left-0 w-full h-8 spiral-holes z-20 pointer-events-none opacity-40" />

        {/* Fake Spiral Metal Rings */}
        <div className="absolute top-[-8px] left-0 w-full h-12 flex justify-between px-6 md:px-10 z-30 pointer-events-none opacity-60">
          {Array.from({ length: 42 }).map((_, i) => (
            <div key={i} className={cn(
              "w-2 h-full rounded-full bg-gradient-to-b from-ring-binding via-ring-binding/70 to-ring-binding/30 shadow-sm",
              i % 2 !== 0 && "hidden md:block" // Every other ring is hidden on mobile
            )} />
          ))}
        </div>

        <ImageSection currentDate={calendar.currentDate} />

        <div className="flex flex-col-reverse md:flex-row w-full divide-y md:divide-y-0 md:divide-x divide-border-color transition-colors duration-500">
          <div className="w-full md:w-5/12 px-4 pt-2 pb-8 md:p-14 shrink-0 bg-background/20 transition-colors duration-500">

            <NotesPanel calendar={calendar} notesStore={notesStore} />
          </div>
          <div className="w-full md:w-7/12 px-1 pt-6 pb-2 md:p-14 flex flex-col justify-start bg-card-bg transition-colors duration-500">

            <CalendarGrid calendar={calendar} notesStore={notesStore} />

            {/* INTEGRATED SIDEBAR ROADMAP (Desktop Only) */}
            <div className="hidden md:block mt-12 pt-10 border-t border-border-color/60">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-8 h-8 rounded-lg bg-accent-blue/10 flex items-center justify-center text-accent-blue/60">
                   <Info size={16} />
                </div>
                <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-text/40">Future Roadmap</span>
                <div className="h-[1px] flex-grow bg-gradient-to-r from-border-color/60 to-transparent" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {notesStore.upcomingEvents.slice(0, 4).map((event: any) => (
                  <motion.div 
                    key={event.id} 
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-background/40 border border-border-color/40 hover:border-accent-blue/20 hover:bg-accent-blue/[0.02] transition-all shadow-sm"
                  >
                    <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-card-bg border border-border-color/60 shadow-inner">
                      <span className="text-[10px] font-black text-accent-blue uppercase leading-none">{format(parseISO(event.dateKey), 'MMM')}</span>
                      <span className="text-lg font-black text-foreground leading-none mt-0.5">{format(parseISO(event.dateKey), 'd')}</span>
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={cn("w-1.5 h-1.5 rounded-full", event.category === 'urgent' ? 'bg-rose-500 animate-pulse' : 'bg-accent-blue')} />
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-text/40">{event.category}</span>
                      </div>
                      <p className="text-sm font-bold text-foreground line-clamp-1 group-hover:text-accent-blue transition-colors">{event.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* GLOBAL FOOTER ROADMAP (Mobile Only) */}
        <div className="md:hidden grid grid-cols-1 w-full border-t border-border-color bg-background/5">

          <div className="md:col-start-6 md:col-span-7 p-8 md:p-14">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-8 h-8 rounded-lg bg-accent-blue/10 flex items-center justify-center text-accent-blue">
                 <Info size={16} />
              </div>
              <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-text/40">Future Roadmap</span>
              <div className="h-[1px] flex-grow bg-gradient-to-r from-border-color to-transparent" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {notesStore.upcomingEvents.slice(0, 4).map((event: any) => (
                <motion.div 
                  key={event.id} 
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-card-bg border border-border-color/60 hover:border-accent-blue/20 hover:bg-accent-blue/[0.02] transition-all shadow-sm"
                >
                  <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-background border border-border-color shadow-inner">
                    <span className="text-[10px] font-black text-accent-blue uppercase leading-none">{format(parseISO(event.dateKey), 'MMM')}</span>
                    <span className="text-lg font-black text-foreground leading-none mt-0.5">{format(parseISO(event.dateKey), 'd')}</span>
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={cn("w-1.5 h-1.5 rounded-full", event.category === 'urgent' ? 'bg-rose-500 animate-pulse' : 'bg-accent-blue')} />
                      <span className="text-[9px] font-black uppercase tracking-widest text-gray-text/40">{event.category}</span>
                    </div>
                    <p className="text-sm font-bold text-foreground line-clamp-1 group-hover:text-accent-blue transition-colors">{event.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 px-2">
        <p className="text-sm font-medium text-gray-text/60 italic">Tip: Click a start and end date to select a range.</p>
        
        <button
          onClick={() => setIsExportModalOpen(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-accent-blue text-white rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-accent-blue/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-20 disabled:pointer-events-none disabled:grayscale"
          disabled={!selectionStats}
          title={!selectionStats ? "Select a range to export" : "Export timeline"}
        >
          <Download size={14} className="animate-bounce" />
          <span>Export Timeline</span>
        </button>
      </div>


      <ExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)}
        calendar={calendar}
        notesStore={notesStore}
      />
    </div>

  );
}
