import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

type DayCellProps = {
  date: Date;
  status: {
    isCurrentMonth: boolean;
    isToday: boolean;
    isSelectedStart: boolean;
    isSelectedEnd: boolean;
    isSelectedRange: boolean;
    isHovered: boolean;
    isDragging: boolean;
    isFocused: boolean;
    isWeekend: boolean;
    isHoliday: string | null;
    isWeeklyRecurrence: boolean;
    isMonthlyRecurrence: boolean;
    isPending: boolean;
  };
  hasNotes: boolean;
  hasEvents: boolean;
  onClick: (date: Date, type?: 'click' | 'mousedown' | 'mouseenter' | 'mouseup') => void;
};

export function DayCell({ date, status, hasNotes, hasEvents, onClick }: DayCellProps) {
  const {
    isCurrentMonth, isToday: _isToday, isSelectedStart, isSelectedEnd,
    isSelectedRange, isHovered, isDragging, isFocused, isWeekend, isHoliday, 
    isWeeklyRecurrence, isMonthlyRecurrence, isPending
  } = status;

  if (!isCurrentMonth) {
    return (
      <div className="w-full aspect-square flex items-center justify-center text-gray-text/10 text-sm md:text-base font-bold pointer-events-none transition-colors duration-500">
        {format(date, 'd')}
      </div>
    );
  }


  const isSelected = isSelectedStart || isSelectedEnd;
  const isAnyRecurrence = isWeeklyRecurrence || isMonthlyRecurrence;

  return (
    <motion.button
      whileHover={{
        scale: isSelected ? 1.05 : 1.12,
        y: -1,
        boxShadow: "0 10px 20px -5px rgba(var(--accent-color-rgb), 0.15)"
      }}
      whileTap={{ scale: 0.92 }}
      onMouseDown={() => onClick(date, 'mousedown')}
      onMouseEnter={() => onClick(date, 'mouseenter')}
      onMouseUp={() => onClick(date, 'mouseup')}
      onClick={() => onClick(date, 'click')}
      title={isHoliday ? `${format(date, 'MMM do')}: ${isHoliday}` : undefined}
      className={cn(
        "relative w-full aspect-square flex items-center justify-center text-sm md:text-base font-bold transition-all duration-300 rounded-xl md:rounded-2xl",
        "outline-none scroll-mt-20 group/day",


        // Focus state
        isFocused && "ring-2 ring-accent-blue/60 ring-offset-2 ring-offset-background z-30 shadow-lg shadow-accent-blue/30",
        !isSelected && !isSelectedRange && !isHovered && "hover:bg-accent-blue/5 hover:text-accent-blue font-semibold",

        // Text Color Logic
        !isSelected && isWeekend ? "text-accent-blue/60" : (!isSelected ? "text-foreground" : ""),
        !isSelected && isHoliday && "text-red-500",

        // Hover/Dragging states
        isHovered && !isSelectedRange && "bg-accent-blue/10 text-accent-blue border border-accent-blue/20",
        isSelectedRange && isDragging && "bg-accent-blue/40 text-white/95",

        // Today styling
        _isToday && !isSelected && !isSelectedRange && "border-[1.5px] border-accent-blue/60 text-accent-blue shadow-lg shadow-accent-blue/20 bg-accent-blue/5",

        // Recurrence Styling
        isMonthlyRecurrence && !isSelectedRange && !isSelected && "bg-accent-blue/5 text-accent-blue/80 border border-accent-blue/10",
        isWeeklyRecurrence && !isSelectedRange && !isSelected && "bg-accent-blue/[0.03] text-accent-blue/70 border border-dashed border-accent-blue/20",

        // Selected Range (Finalized Body - Soft)
        isSelectedRange && !isSelected && !isDragging && "bg-accent-blue/10 text-accent-blue rounded-none border-y border-accent-blue/20",

        // Selected Start/End (Strong Boundary - High Contrast)
        isSelected && "bg-accent-blue text-white rounded-full shadow-[0_15px_30px_-5px_rgba(var(--accent-color-rgb),0.5)] z-10 scale-105 font-black ring-2 ring-white/20",

        // Pulse effect for pending state
        isSelected && isPending && "animate-pulse ring-4 ring-accent-blue/30"
      )}
    >
      {/* Background connector for range (visual polish) */}
      <AnimatePresence>
        {(isSelectedStart && isSelectedRange) && (
          <motion.div
            key="range-connector-start"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            className="absolute right-0 w-1/2 h-full bg-accent-blue/5 -z-10 origin-left"
          />
        )}
        {(isSelectedEnd && isSelectedRange) && (
          <motion.div
            key="range-connector-end"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            className="absolute left-0 w-1/2 h-full bg-accent-blue/5 -z-10 origin-right"
          />
        )}
        {/* Recurrence Pattern Overlay */}
        {isWeeklyRecurrence && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--accent-blue)_1px,_transparent_1px)] bg-[size:4px_4px] pointer-events-none rounded-xl"
          />
        )}
      </AnimatePresence>


      <span className="relative z-20">{format(date, 'd')}</span>

      {/* Markers Container */}
      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex items-center justify-center gap-0.5">
        {/* Note indicator dot */}
        {hasNotes && (
          <motion.div
            key="marker-note"
            initial={{ scale: 0, y: 5 }}
            animate={{ scale: 1, y: 0 }}
            className={cn(
              "w-1.5 h-1.5 rounded-full shadow-sm",
              isSelected ? "bg-white" : "bg-accent-blue"
            )}
          />
        )}
        {/* Event indicator dot */}
        {hasEvents && (
          <motion.div
            key="marker-event"
            initial={{ scale: 0, y: 5 }}
            animate={{ scale: 1, y: 0 }}
            className={cn(
              "w-1.5 h-1.5 rounded-full shadow-sm",
              isSelected ? "bg-white/80" : "bg-orange-500"
            )}
          />
        )}
        {/* Holiday Marker */}
        {isHoliday && (
          <motion.div
            key="marker-holiday"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={cn(
              "w-1.5 h-1.5 rounded-full shadow-sm",
              isSelected ? "bg-white/40" : "bg-red-500"
            )}
          />
        )}
      </div>

      {/* Hover Holiday Tooltip */}
      {isHoliday && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-background border border-border-color rounded shadow-xl pointer-events-none opacity-0 group-hover/day:opacity-100 transition-opacity z-50 whitespace-nowrap text-[10px] font-bold uppercase tracking-widest text-red-500">
          {isHoliday}
        </div>
      )}
    </motion.button>
  );
}
