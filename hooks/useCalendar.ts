import { useState, useCallback, useMemo } from 'react';
import { 
  addMonths, subMonths, startOfMonth, endOfMonth, 
  startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth,
  isSameDay, isWithinInterval, differenceInDays, max, min, 
  setMonth as setDateMonth, setYear as setDateYear
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
  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelection({ start: today, end: null });
  };

  const setMonth = (month: number) => setCurrentDate(setDateMonth(currentDate, month));
  const setYear = (year: number) => setCurrentDate(setDateYear(currentDate, year));

  const getDaysInMonth = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentDate));
    const end = endOfWeek(endOfMonth(currentDate));
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const selectionStats = useMemo(() => {
    if (!selection.start) return null;
    if (!selection.end) return { start: selection.start, end: selection.start, days: 1 };
    
    return {
      start: selection.start,
      end: selection.end,
      days: differenceInDays(selection.end, selection.start) + 1
    };
  }, [selection]);

  const handleDateSelect = useCallback((date: Date) => {
    setSelection(prev => {
      if (!prev.start) {
        return { start: date, end: null };
      }
      
      if (prev.start && !prev.end) {
        if (isSameDay(date, prev.start)) {
          return { start: null, end: null };
        }
        
        const start = min([prev.start, date]);
        const end = max([prev.start, date]);
        return { start, end };
      }

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
    selectionStats,
    nextMonth,
    prevMonth,
    goToToday,
    setMonth,
    setYear,
    getDaysInMonth,
    handleDateSelect,
    getDayStatus,
  };
}
