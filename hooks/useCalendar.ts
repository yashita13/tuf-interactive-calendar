import { useState, useCallback } from 'react';
import { 
  addMonths, subMonths, startOfMonth, endOfMonth, 
  startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth,
  isSameDay, isWithinInterval, isBefore, max, min
} from 'date-fns';

export type SelectionRange = {
  start: Date | null;
  end: Date | null;
};

export function useCalendar(initialDate: Date = new Date()) {
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [selection, setSelection] = useState<SelectionRange>({ start: null, end: null });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const getDaysInMonth = () => {
    const start = startOfWeek(startOfMonth(currentDate));
    const end = endOfWeek(endOfMonth(currentDate));
    return eachDayOfInterval({ start, end });
  };

  const handleDateSelect = useCallback((date: Date) => {
    setSelection(prev => {
      // If nothing is selected, select start
      if (!prev.start) {
        return { start: date, end: null };
      }
      
      // If start is selected but no end
      if (prev.start && !prev.end) {
        // If they click the same date, unselect it
        if (isSameDay(date, prev.start)) {
          return { start: null, end: null };
        }
        
        // Ensure start is always before end (reverse selection handled automatically)
        const start = min([prev.start, date]);
        const end = max([prev.start, date]);
        return { start, end };
      }

      // If both are selected, reset and select new start
      return { start: date, end: null };
    });
  }, []);

  const getDayStatus = useCallback((date: Date) => {
    const isCurrentMonth = isSameMonth(date, currentDate);
    const isToday = isSameDay(date, new Date());
    
    let isSelectedStart = false;
    let isSelectedEnd = false;
    let isSelectedRange = false;

    if (selection.start) {
      isSelectedStart = isSameDay(date, selection.start);
    }
    
    if (selection.end) {
      isSelectedEnd = isSameDay(date, selection.end);
      if (selection.start && isWithinInterval(date, { start: selection.start, end: selection.end })) {
        isSelectedRange = true;
      }
    }

    return {
      isCurrentMonth,
      isToday,
      isSelectedStart,
      isSelectedEnd,
      isSelectedRange,
    };
  }, [currentDate, selection]);

  return {
    currentDate,
    selection,
    nextMonth,
    prevMonth,
    getDaysInMonth,
    handleDateSelect,
    getDayStatus,
  };
}
