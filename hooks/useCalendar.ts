import { useState, useCallback, useMemo, useRef, useEffect } from 'react';

import { 
  addMonths, subMonths, startOfMonth, endOfMonth, 
  startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth,
  isSameDay, isWithinInterval, differenceInDays, max, min, 
  setMonth as setDateMonth, setYear as setDateYear, isWeekend as isDateWeekend,
  format
} from 'date-fns';

export type SelectionRange = {
  start: Date | null;
  end: Date | null;
};

// Common Holidays for Calendar Intelligence
const HOLIDAYS: Record<string, string> = {
  '01-01': 'New Year\'s Day',
  '07-04': 'Independence Day',
  '12-25': 'Christmas',
  '05-01': 'Labor Day',
  '10-31': 'Halloween',
};

export type RecurrenceType = 'none' | 'weekly' | 'monthly';

export function useCalendar(initialDate: Date = new Date()) {
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [selection, setSelection] = useState<SelectionRange>({ start: null, end: null });
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [focusedDate, setFocusedDate] = useState<Date | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragAnchor, setDragAnchor] = useState<Date | null>(null);
  const [recurrence, setRecurrence] = useState<RecurrenceType>('none');
  const prevDateRef = useRef<Date>(currentDate);

  useEffect(() => {
    prevDateRef.current = currentDate;
  }, [currentDate]);


  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setFocusedDate(today);
  };

  const setMonth = (month: number) => setCurrentDate(setDateMonth(currentDate, month));
  const setYear = (year: number) => setCurrentDate(setDateYear(currentDate, year));

  const getDaysInMonth = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentDate));
    const end = endOfWeek(endOfMonth(currentDate));
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const selectionStats = useMemo(() => {
    let currentStart = selection.start;
    let currentEnd = selection.end;

    // During drag, the temporary range is between anchor and hover
    if (isDragging && dragAnchor && hoverDate) {
      currentStart = dragAnchor;
      currentEnd = hoverDate;
    }

    if (!currentStart) return null;

    const trueStart = currentEnd ? min([currentStart, currentEnd]) : currentStart;
    const trueEnd = currentEnd ? max([currentStart, currentEnd]) : currentStart;

    return {
      start: trueStart,
      end: trueEnd,
      days: differenceInDays(trueEnd, trueStart) + 1
    };
  }, [selection, hoverDate, isDragging, dragAnchor]);

  const handleDateSelect = useCallback((
    date: Date, 
    type: 'click' | 'mousedown' | 'mouseenter' | 'mouseup' | 'keyboard' = 'click',
    shiftKey: boolean = false
  ) => {
    const updateSelection = (date: Date) => {
      setSelection(prev => {
        // RULE: If resetting after a full range or starting fresh
        if (!prev.start || (prev.start && prev.end)) {
          return { start: date, end: null };
        }

        // RULE: Second tap on the SAME date (now results in 1-day range instead of null)
        if (isSameDay(date, prev.start)) {
          return { start: date, end: date };
        }

        // RULE: Normal range completion (auto-sorting)
        return {
          start: min([prev.start, date]),
          end: max([prev.start, date])
        };
      });
    };

    if (type === 'mousedown') {
      setIsDragging(true);
      setDragAnchor(date);
      setHoverDate(date);
      setFocusedDate(date);
      return;
    }

    if (type === 'mouseenter') {
      if (isDragging) {
        setHoverDate(date);
      }
      setFocusedDate(date);
      return;
    }

    if (type === 'mouseup') {
      if (isDragging) {
        setIsDragging(false);
        const anchor = dragAnchor;
        
        if (anchor && !isSameDay(date, anchor)) {
          // Range Drag Finalized (Desktop behavior)
          setSelection({
            start: min([anchor, date]),
            end: max([anchor, date])
          });
        }
        setDragAnchor(null);
        setHoverDate(null);
      }
      return;
    }

    if (type === 'keyboard') {
      setFocusedDate(date);
      if (shiftKey) {
        setSelection(prev => {
          const start = prev.start || date;
          return {
            start: start,
            end: date
          };
        });
      }
      return;
    }

    if (type === 'click') {
      // Direct click handles all single-tap/click selection logic
      updateSelection(date);
      setFocusedDate(date);
    }
  }, [isDragging, dragAnchor, setSelection, setIsDragging]);

  const getDayStatus = useCallback((date: Date) => {
    const isCurrentMonth = isSameMonth(date, currentDate);
    const isToday = isSameDay(date, new Date());
    const isFocused = isSameDay(date, focusedDate || new Date(0));
    const isWeekend = isDateWeekend(date);
    
    const monthDay = format(date, 'MM-dd');
    const isHoliday = HOLIDAYS[monthDay] || null;
    
    let isSelectedStart = false;
    let isSelectedEnd = false;
    let isSelectedRange = false;
    let isHovered = isSameDay(date, hoverDate || new Date(0));

    let start = selection.start;
    let end = selection.end;

    // Preview range during dragging
    if (isDragging && dragAnchor && hoverDate) {
      start = dragAnchor;
      end = hoverDate;
    }

    if (start) {
      const trueStart = end ? min([start, end]) : start;
      const trueEnd = end ? max([start, end]) : start;

      isSelectedStart = isSameDay(date, trueStart);
      isSelectedEnd = isSameDay(date, trueEnd);

      if (isWithinInterval(date, { start: trueStart, end: trueEnd })) {
        isSelectedRange = true;
      }
    }

    // Recurrence Logic
    let isWeeklyRecurrence = false;
    let isMonthlyRecurrence = false;

    if (selection.start && recurrence !== 'none') {
      const selStart = selection.start;
      const selEnd = selection.end || selection.start;
      const trueSelStart = min([selStart, selEnd]);
      const trueSelEnd = max([selStart, selEnd]);

      if (recurrence === 'weekly') {
        const startDayIdx = trueSelStart.getDay();
        const endDayIdx = trueSelEnd.getDay();
        const currentDayIdx = date.getDay();

        // Handle case where selection spans multiple days in a week
        if (startDayIdx <= endDayIdx) {
          isWeeklyRecurrence = currentDayIdx >= startDayIdx && currentDayIdx <= endDayIdx;
        } else {
          // Wrapped selection (though usually min/max prevents this, safety check)
          isWeeklyRecurrence = currentDayIdx >= startDayIdx || currentDayIdx <= endDayIdx;
        }
      } else if (recurrence === 'monthly') {
        const startDayNum = trueSelStart.getDate();
        const endDayNum = trueSelEnd.getDate();
        const currentDayNum = date.getDate();

        if (startDayNum <= endDayNum) {
          isMonthlyRecurrence = currentDayNum >= startDayNum && currentDayNum <= endDayNum;
        }
      }
    }

    const isPending = !!(selection.start && !selection.end);

    return {
      isCurrentMonth,
      isToday,
      isSelectedStart,
      isSelectedEnd,
      isSelectedRange,
      isPending,
      isHovered,
      isDragging,
      isFocused,
      isWeekend,
      isHoliday,
      isWeeklyRecurrence,
      isMonthlyRecurrence
    };
  }, [currentDate, selection, hoverDate, isDragging, focusedDate, dragAnchor, recurrence]);

  return {
    currentDate,
    selection,
    selectionStats,
    hoverDate,
    focusedDate,
    isDragging,
    recurrence,
    nextMonth,
    prevMonth,
    goToToday,
    setMonth,
    setYear,
    setRecurrence,
    getDaysInMonth,
    handleDateSelect,
    getDayStatus,
    setHoverDate,
    setSelection,
    prevDateRef
  };
}



