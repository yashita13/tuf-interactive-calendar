'use client';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayCell } from './DayCell';
import { useCalendar } from '@/hooks/useCalendar';
import { useNotes } from '@/hooks/useNotes';

const WEEKDAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

interface CalendarGridProps {
  calendar: ReturnType<typeof useCalendar>;
  notesStore: ReturnType<typeof useNotes>;
}

export function CalendarGrid({ calendar, notesStore }: CalendarGridProps) {
  const { currentDate, nextMonth, prevMonth, getDaysInMonth, getDayStatus, handleDateSelect } = calendar;
  const days = getDaysInMonth();
  
  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Visual Header to hold the month navigation */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold tracking-tight text-gray-800">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-1">
          <button 
            onClick={prevMonth}
            className="p-1 rounded-md hover:bg-gray-100 transition-colors text-gray-500 hover:text-accent-blue"
          >
            <ChevronLeft size={18} />
          </button>
          <button 
            onClick={nextMonth}
            className="p-1 rounded-md hover:bg-gray-100 transition-colors text-gray-500 hover:text-accent-blue"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* WeekDays grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
        {WEEKDAYS.map((day, ix) => (
          <div 
            key={day} 
            className={`h-6 flex items-center justify-center text-[10px] font-bold ${ix >= 5 ? 'text-accent-blue' : 'text-gray-500'}`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <AnimatePresence mode="popLayout">
        <motion.div 
          key={currentDate.toString()}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-7 gap-1 sm:gap-2 relative"
        >
          {days.map((date, i) => (
            <DayCell 
              key={date.toString() + i} 
              date={date} 
              status={getDayStatus(date)}
              hasNotes={notesStore.hasNotes(format(date, 'yyyy-MM-dd'))}
              onClick={handleDateSelect}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
