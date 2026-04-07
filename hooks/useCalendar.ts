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
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [isDragging, setIsDragging] = useState(false);

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
    const start = selection.start;
    const end = isDragging && hoverDate ? (start && hoverDate ? (isSameDay(start, hoverDate) ? start : hoverDate) : start) : selection.end;
    
    if (!start) return null;
    
    const trueStart = end ? min([start, end]) : start;
    const trueEnd = end ? max([start, end]) : start;

    return {
      start: trueStart,
      end: trueEnd,
      days: differenceInDays(trueEnd, trueStart) + 1
    };
  }, [selection, hoverDate, isDragging]);

  const handleDateSelect = useCallback((date: Date, type: 'click' | 'mousedown' | 'mouseenter' | 'mouseup' = 'click') => {
    if (type === 'mousedown') {
      setIsDragging(true);
      setSelection({ start: date, end: null });
      setHoverDate(date);
      return;
    }

    if (type === 'mouseenter' && isDragging) {
      setHoverDate(date);
      return;
    }

    if (type === 'mouseup' && isDragging) {
      setIsDragging(false);
      if (selection.start && !isSameDay(date, selection.start)) {
        const start = min([selection.start, date]);
        const end = max([selection.start, date]);
        setSelection({ start, end });
      }
      setHoverDate(null);
      return;
    }

    if (type === 'click' && !isDragging) {
      setSelection(prev => {
        if (!prev.start) return { start: date, end: null };
        if (prev.start && !prev.end) {
          if (isSameDay(date, prev.start)) return { start: null, end: null };
          return { start: min([prev.start, date]), end: max([prev.start, date]) };
        }
        return { start: date, end: null };
      });
    }
  }, [isDragging, selection]);

  const getDayStatus = useCallback((date: Date) => {
    const isCurrentMonth = isSameMonth(date, currentDate);
    const isToday = isSameDay(date, new Date());
    
    let isSelectedStart = false;
    let isSelectedEnd = false;
    let isSelectedRange = false;
    let isHovered = isSameDay(date, hoverDate || new Date(0));

    const start = selection.start;
    const end = isDragging && hoverDate ? hoverDate : selection.end;

    if (start) {
      isSelectedStart = isSameDay(date, start);
      if (end) {
        isSelectedEnd = isSameDay(date, end);
        const trueStart = min([start, end]);
        const trueEnd = max([start, end]);
        if (isWithinInterval(date, { start: trueStart, end: trueEnd })) {
          isSelectedRange = true;
        }
      }
    }

    return {
      isCurrentMonth,
      isToday,
      isSelectedStart,
      isSelectedEnd,
      isSelectedRange,
      isHovered,
      isDragging
    };
  }, [currentDate, selection, hoverDate, isDragging]);

  return {
    currentDate,
    selection,
    selectionStats,
    hoverDate,
    isDragging,
    nextMonth,
    prevMonth,
    goToToday,
    setMonth,
    setYear,
    getDaysInMonth,
    handleDateSelect,
    getDayStatus,
    setHoverDate,
  };
}
