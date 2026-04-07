'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarGrid } from '@/components/CalendarGrid';
import { NotesPanel } from '@/components/NotesPanel';
import { useCalendar } from '@/hooks/useCalendar';
import { useNotes } from '@/hooks/useNotes';
import { ImageSection } from '@/components/ImageSection';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export function WallCalendar() {
  const calendar = useCalendar();
  const notesStore = useNotes();

  const { selectionStats, currentDate } = calendar;
  const monthlyStats = notesStore.getMonthlyStats(currentDate);

  if (!notesStore.isLoaded) return null;

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      {/* Selection & Analytics Stats Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-3 bg-card-bg/40 backdrop-blur-md rounded-2xl border border-border-color shadow-sm transition-all duration-500">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent-blue/10 flex items-center justify-center text-accent-blue">
            <CalendarIcon size={18} />
          </div>
          <AnimatePresence mode="wait">
            {!selectionStats ? (
              <motion.span 
                key="default"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-sm font-semibold text-gray-text"
              >
                Select a date range to begin.
              </motion.span>
            ) : (
              <motion.div 
                key="selected"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2"
              >
                <span className="text-sm font-bold text-foreground">
                  {format(selectionStats.start, 'MMM d, yyyy')}
                </span>
                {selectionStats.days > 1 && (
                  <>
                    <span className="text-gray-text">→</span>
                    <span className="text-sm font-bold text-foreground">
                      {format(selectionStats.end, 'MMM d, yyyy')}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-accent-blue/10 text-accent-blue text-[10px] font-bold uppercase tracking-widest ml-2">
                      {selectionStats.days} Days
                    </span>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-widest text-gray-text/60">
           <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-accent-blue" />
             <span>{monthlyStats.totalNotes} Memos</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
             <span>{monthlyStats.totalEvents} Events</span>
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

        <div className="flex flex-col md:flex-row w-full divide-y md:divide-y-0 md:divide-x divide-border-color transition-colors duration-500">
          <div className="w-full md:w-5/12 p-6 md:p-14 shrink-0 bg-background/20 transition-colors duration-500">
            <NotesPanel calendar={calendar} notesStore={notesStore} />
          </div>
          <div className="w-full md:w-7/12 p-6 md:p-14 flex items-center justify-center bg-card-bg transition-colors duration-500">
            <CalendarGrid calendar={calendar} notesStore={notesStore} />
          </div>
        </div>
      </motion.div>

        <p className="text-sm font-medium">Tip: Click a start and end date to select a range.</p>
    </div>
  );
}
