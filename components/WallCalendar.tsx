'use client';
import { motion } from 'framer-motion';
import { CalendarGrid } from './CalendarGrid';
import { NotesPanel } from './NotesPanel';
import { useCalendar } from '@/hooks/useCalendar';
import { useNotes } from '@/hooks/useNotes';
import { ImageSection } from './ImageSection';

export function WallCalendar() {
  const calendar = useCalendar();
  const notesStore = useNotes();

  if (!notesStore.isLoaded) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative w-full max-w-4xl bg-white rounded-md shadow-2xl overflow-hidden flex flex-col mx-auto"
      style={{
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 15px rgba(0,0,0,0.05)"
      }}
    >
      {/* Fake Spiral Binding Holes */}
      <div className="absolute top-0 left-0 w-full h-5 spiral-holes z-20 pointer-events-none opacity-80" />
      
      {/* Fake Spiral Metal Rings */}
      <div className="absolute top-[-4px] left-0 w-full h-8 flex justify-between px-6 z-30 pointer-events-none opacity-60">
        {Array.from({ length: 42 }).map((_, i) => (
          <div key={i} className="w-1.5 h-full rounded-full bg-gradient-to-b from-gray-300 via-gray-500 to-gray-400 shadow-sm" />
        ))}
      </div>

      <ImageSection currentDate={calendar.currentDate} />

      <div className="flex flex-col md:flex-row w-full divide-y md:divide-y-0 md:divide-x divide-gray-100">
        <div className="w-full md:w-5/12 p-6 md:p-8 shrink-0">
          <NotesPanel calendar={calendar} notesStore={notesStore} />
        </div>
        <div className="w-full md:w-7/12 p-6 md:p-8 flex items-center justify-center">
          <CalendarGrid calendar={calendar} notesStore={notesStore} />
        </div>
      </div>
    </motion.div>
  );
}
