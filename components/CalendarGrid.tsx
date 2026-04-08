'use client';
import { useEffect } from 'react';
import {
  format, isSameMonth, addDays, subDays, addWeeks, subWeeks, isSameDay, parseISO
} from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCcw, Calendar as CalendarIcon, Info } from 'lucide-react';
import { DayCell } from './DayCell';
import { useCalendar } from '@/hooks/useCalendar';
import { useNotes } from '@/hooks/useNotes';
import { cn } from '@/lib/utils';


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
    getDaysInMonth, getDayStatus, handleDateSelect, selection, focusedDate, setSelection
  } = calendar;

  const days = getDaysInMonth;

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;

      const current = focusedDate || selection.start || currentDate;
      let next: Date | null = null;

      switch (e.key) {
        case 'ArrowLeft': next = subDays(current, 1); break;
        case 'ArrowRight': next = addDays(current, 1); break;
        case 'ArrowUp': next = subWeeks(current, 1); break;
        case 'ArrowDown': next = addWeeks(current, 1); break;
        case 'Enter':
          if (focusedDate) handleDateSelect(focusedDate, 'click');
          return;
        case 'Escape':
          setSelection({ start: null, end: null });
          return;
        default: return;
      }

      if (next) {
        e.preventDefault();
        handleDateSelect(next, 'keyboard', e.shiftKey);

        if (!isSameMonth(next, currentDate)) {
          if (next > currentDate) nextMonth();
          else prevMonth();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selection, currentDate, focusedDate, handleDateSelect, nextMonth, prevMonth, setSelection]);

  const selectionInfo = (() => {
    if (!selection.start) return { type: 'none' };
    if (!selection.end || isSameDay(selection.start, selection.end)) {
      return {
        type: 'single',
        label: format(selection.start, 'MMM do'),
        sub: 'Single day selected'
      };
    }
    return {
      type: 'range',
      label: `${format(selection.start, 'MMM d')} → ${format(selection.end, 'MMM d')}`,
      sub: `${calendar.selectionStats?.days || 0} days selected`
    };
  })();

  return (
    <div className="w-full md:max-w-lg mx-auto" onMouseLeave={() => calendar.setHoverDate(null)}>
      {/* Dynamic Selection Info Panel - Moved UP */}
      <div className="h-24 mb-6">
        <AnimatePresence mode="wait">
          {!selection.start ? (
            <motion.div
              key="no-selection"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-full p-4 rounded-3xl bg-background/40 border border-dashed border-border-color flex items-center gap-6 group hover:bg-accent-blue/[0.02] transition-colors"
            >
              <div className="w-10 h-10 rounded-2xl bg-accent-blue/5 flex items-center justify-center text-accent-blue shrink-0 group-hover:scale-110 transition-transform">
                <CalendarIcon size={20} />
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-widest text-foreground/80">Timeline Ready</p>
                <p className="text-xs font-bold text-gray-text/40 uppercase tracking-tighter">Select a range to begin planning</p>
              </div>

            </motion.div>
          ) : (
            <motion.div
              key="active-selection"
              initial={{ opacity: 0, scale: 0.98, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              className="h-full p-4 rounded-3xl bg-accent-blue text-white shadow-xl shadow-accent-blue/20 flex items-center justify-between border border-white/10 relative overflow-hidden"
            >
              <div className="flex items-center gap-5 relative z-10">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0">
                  <Info size={20} />
                </div>
                <div>
                  <p className="text-base font-black tracking-tight leading-tight">{selectionInfo.label}</p>
                  <p className="text-xs font-black uppercase tracking-[0.2em] opacity-60 transition-opacity">{selectionInfo.sub}</p>
                </div>

              </div>
              <button
                onClick={() => setSelection({ start: null, end: null })}
                className="p-2 rounded-xl hover:bg-white/10 transition-colors relative z-10"
              >
                <RotateCcw size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>


      {/* Calendar Navigation & Month/Year Jumper */}
      <div className="flex flex-col gap-6 mb-8 transition-all">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-4xl font-black tracking-tighter text-foreground font-heading uppercase transition-colors duration-500">
              {format(currentDate, 'MMMM')}
            </h2>
            <span className="text-xs font-black text-gray-text/40 tracking-[0.2em] uppercase">{format(currentDate, 'yyyy')}</span>
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
              className="px-5 py-2.5 rounded-lg hover:bg-accent-blue/10 transition-all text-base font-black text-accent-blue flex items-center gap-2 group active:scale-95 border border-accent-blue/20 shadow-sm"
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
            className="flex-1 bg-background/40 border border-border-color rounded-lg px-3 py-2.5 text-sm font-black uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-accent-blue/20"
          >
            {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
          </select>
          <select
            value={currentDate.getFullYear()}
            onChange={(e) => jumpYear(parseInt(e.target.value))}
            className="bg-background/40 border border-border-color rounded-lg px-3 py-2.5 text-sm font-black uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-accent-blue/20"
          >

            {Array.from({ length: 20 }).map((_, i) => {
              const year = new Date().getFullYear() - 10 + i;
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
            onMouseUp={() => calendar.handleDateSelect(focusedDate || currentDate, 'mouseup')}
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
      </div>

    </div>
  );
}

