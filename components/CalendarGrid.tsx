'use client';
import { format, setMonth, setYear } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCcw, Calendar as CalendarIcon } from 'lucide-react';
import { DayCell } from './DayCell';
import { useCalendar } from '@/hooks/useCalendar';
import { useNotes } from '@/hooks/useNotes';

const WEEKDAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

interface CalendarGridProps {
  calendar: ReturnType<typeof useCalendar>;
  notesStore: ReturnType<typeof useNotes>;
}

export function CalendarGrid({ calendar, notesStore }: CalendarGridProps) {
  const { 
    currentDate, nextMonth, prevMonth, goToToday, setMonth: jumpMonth, 
    getDaysInMonth, getDayStatus, handleDateSelect 
  } = calendar;
  
  const days = getDaysInMonth;
  
  return (
    <div className="w-full max-w-md mx-auto">
      {/* Calendar Navigation & Month/Year Jumper */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 transition-all">
        <div className="flex flex-col gap-1 items-center sm:items-start">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground font-heading uppercase transition-colors duration-500">
            {format(currentDate, 'MMMM')}
          </h2>
          <span className="text-sm font-bold text-gray-text/40 tracking-widest">{format(currentDate, 'yyyy')}</span>
        </div>

        <div className="flex items-center gap-2 p-1.5 bg-background/40 backdrop-blur-sm rounded-xl border border-border-color shadow-sm">
          <button 
            onClick={prevMonth}
            className="p-2 rounded-lg hover:bg-accent-blue/10 transition-all text-gray-text hover:text-accent-blue focus:outline-none active:scale-95"
            aria-label="Previous month"
          >
            <ChevronLeft size={22} />
          </button>
          
          <button 
            onClick={goToToday}
            className="px-4 py-2 rounded-lg hover:bg-accent-blue/10 transition-all text-sm font-bold text-accent-blue flex items-center gap-2 group active:scale-95"
            aria-label="Go to today"
          >
            <RotateCcw size={14} className="group-hover:rotate-[-90deg] transition-transform duration-500" />
            TIL TODAY
          </button>

          <button 
            onClick={nextMonth}
            className="p-2 rounded-lg hover:bg-accent-blue/10 transition-all text-gray-text hover:text-accent-blue focus:outline-none active:scale-95"
            aria-label="Next month"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      </div>

      {/* WeekDays grid */}
      <div className="grid grid-cols-7 gap-2 sm:gap-4 mb-4 border-b border-border-color pb-4 transition-colors duration-500">
        {WEEKDAYS.map((day, ix) => (
          <div 
            key={day} 
            className={`flex items-center justify-center text-xs font-bold tracking-widest ${ix >= 5 ? 'text-accent-blue/60' : 'text-gray-text/60'}`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days grid with Flip/Animation */}
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div 
          key={currentDate.toString()}
          initial={{ opacity: 0, x: -10, filter: 'blur(8px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, x: 10, filter: 'blur(8px)' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-7 gap-2 sm:gap-4 relative"
        >
          {days.map((date, i) => (
            <DayCell 
              key={date.toString() + i} 
              date={date} 
              status={getDayStatus(date)}
              hasNotes={notesStore.hasNotes(format(date, 'yyyy-MM-dd'))}
              hasEvents={notesStore.hasEvents(format(date, 'yyyy-MM-dd'))}
              onClick={handleDateSelect}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      <div className="mt-12 flex flex-wrap justify-center gap-2">
         {MONTHS.map((m, idx) => (
            <button 
              key={m}
              onClick={() => jumpMonth(idx)}
              className={`px-3 py-1 text-[11px] font-bold uppercase tracking-widest rounded-md border transition-all ${
                idx === currentDate.getMonth() 
                ? 'bg-accent-blue/10 border-accent-blue/30 text-accent-blue' 
                : 'bg-transparent border-border-color text-gray-text/40 hover:border-gray-text/40 hover:text-gray-text'
              }`}
            >
              {m.slice(0, 3)}
            </button>
         ))}
      </div>
    </div>
  );
}
