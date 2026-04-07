'use client';
import { useState, useEffect } from 'react';
import { 
  format, setMonth as setDateMonth, setYear as setDateYear, 
  addMonths, isSameMonth, isSameDay 
} from 'date-fns';
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
    currentDate, nextMonth, prevMonth, goToToday, setMonth: jumpMonth, setYear: jumpYear,
    getDaysInMonth, getDayStatus, handleDateSelect, selection
  } = calendar;
  
  const days = getDaysInMonth;

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only navigate if no input is focused
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;

      const current = selection.start || new Date();
      let next: Date | null = null;

      switch(e.key) {
        case 'ArrowLeft': next = addMonths(current, 0); next.setDate(current.getDate() - 1); break;
        case 'ArrowRight': next = addMonths(current, 0); next.setDate(current.getDate() + 1); break;
        case 'ArrowUp': next = addMonths(current, 0); next.setDate(current.getDate() - 7); break;
        case 'ArrowDown': next = addMonths(current, 0); next.setDate(current.getDate() + 7); break;
        case 'Enter': if (selection.start) handleDateSelect(selection.start, 'click'); return;
        default: return;
      }

      if (next) {
        e.preventDefault();
        if (e.shiftKey) {
           // Extend range logic could be added here
           handleDateSelect(next, 'mouseenter');
        } else {
           handleDateSelect(next, 'click');
        }
        // If next date is in different month, jump
        if (!isSameMonth(next, currentDate)) {
          if (next > currentDate) nextMonth();
          else prevMonth();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selection, currentDate, handleDateSelect, nextMonth, prevMonth]);
  
  return (
    <div className="w-full max-w-md mx-auto" onMouseLeave={() => calendar.setHoverDate(null)}>
      <AnimatePresence>
        {!selection.start && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mb-8 p-6 rounded-2xl bg-accent-blue/5 border border-dashed border-accent-blue/20 flex items-center gap-6 transition-all group hover:bg-accent-blue/[0.08]"
          >
            <div className="w-12 h-12 rounded-full bg-accent-blue/10 flex items-center justify-center text-accent-blue animate-pulse shrink-0">
              <CalendarIcon size={24} />
            </div>
            <p className="text-sm text-gray-text font-bold uppercase tracking-widest leading-snug">
              Experience precision. <br />
              <span className="text-accent-blue/60">Select dates to document.</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Calendar Navigation & Month/Year Jumper */}
      <div className="flex flex-col gap-6 mb-10 transition-all">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-bold tracking-tight text-foreground font-heading uppercase transition-colors duration-500">
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
              className="px-4 py-2 rounded-lg hover:bg-accent-blue/10 transition-all text-sm font-bold text-accent-blue flex items-center gap-2 group active:scale-95 border border-accent-blue/20"
              aria-label="Go to today"
            >
              <RotateCcw size={14} className="group-hover:rotate-[-90deg] transition-transform duration-500" />
              <span className="hidden sm:inline">TODAY</span>
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

        {/* Quick Jumper Dropdowns */}
        <div className="flex gap-2">
          <select 
            value={currentDate.getMonth()}
            onChange={(e) => jumpMonth(parseInt(e.target.value))}
            className="flex-1 bg-background/40 border border-border-color rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-accent-blue/20"
          >
            {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
          </select>
          <select 
            value={currentDate.getFullYear()}
            onChange={(e) => jumpYear(parseInt(e.target.value))}
            className="bg-background/40 border border-border-color rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-accent-blue/20"
          >
            {Array.from({ length: 10 }).map((_, i) => {
              const year = new Date().getFullYear() - 5 + i;
              return <option key={year} value={year}>{year}</option>
            })}
          </select>
        </div>
      </div>

      {/* WeekDays grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-4 mb-4 border-b border-border-color pb-4 transition-colors duration-500">
        {WEEKDAYS.map((day, ix) => (
          <div 
            key={day} 
            className={`flex items-center justify-center text-[10px] font-black tracking-widest ${ix >= 5 ? 'text-accent-blue' : 'text-gray-text/40'}`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days grid with Flip/Animation */}
      <div className="relative overflow-hidden min-h-[300px]">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentDate.toString()}
            initial={{ opacity: 0, x: 20, rotateY: 15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            exit={{ opacity: 0, x: -20, rotateY: -15 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-7 gap-1 sm:gap-4 relative"
            onMouseUp={() => calendar.handleDateSelect(new Date(), 'mouseup')}
          >
            {days.map((date, i) => (
              <DayCell 
                key={date.toString() + i} 
                date={date} 
                status={getDayStatus(date)}
                hasNotes={notesStore.hasNotes(format(date, 'yyyy-MM-dd'))}
                hasEvents={notesStore.hasEvents(format(date, 'yyyy-MM-dd'))}
                isHoliday={date.getDate() === 25 && date.getMonth() === 11} // Demo holiday: Christmas
                onClick={handleDateSelect}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
         {MONTHS.map((m, idx) => (
            <button 
              key={m}
              onClick={() => jumpMonth(idx)}
              className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] rounded-md border transition-all ${
                idx === currentDate.getMonth() 
                ? 'bg-accent-blue text-white border-accent-blue shadow-md shadow-accent-blue/20' 
                : 'bg-transparent border-border-color text-gray-text/40 hover:border-gray-text/60'
              }`}
            >
              {m.slice(0, 3)}
            </button>
         ))}
      </div>
    </div>
  );
}
