import { format, isWeekend } from 'date-fns';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

type DayCellProps = {
  date: Date;
  status: {
    isCurrentMonth: boolean;
    isToday: boolean;
    isSelectedStart: boolean;
    isSelectedEnd: boolean;
    isSelectedRange: boolean;
  };
  hasNotes: boolean;
  onClick: (date: Date) => void;
};

export function DayCell({ date, status, hasNotes, onClick }: DayCellProps) {
  const { isCurrentMonth, isToday, isSelectedStart, isSelectedEnd, isSelectedRange } = status;
  
  const _isWeekend = isWeekend(date);

  if (!isCurrentMonth) {
    return (
      <div className="h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center text-gray-200 text-sm font-semibold pointer-events-none">
        {format(date, 'd')}
      </div>
    );
  }

  const isSelected = isSelectedStart || isSelectedEnd;

  return (
    <motion.button
      whileHover={{ scale: isSelected ? 1 : 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(date)}
      className={cn(
        "relative h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center text-sm font-semibold transition-colors duration-200",
        "outline-none focus-visible:ring-2 focus-visible:ring-accent-blue",
        !isSelected && !isSelectedRange && "hover:bg-gray-100",
        
        // Text Color Logic
        !isSelected && _isWeekend ? "text-accent-blue" : (!isSelected ? "text-gray-800" : ""),
        
        // Today styling
        isToday && !isSelected && !isSelectedRange && "border border-accent-blue rounded-full",
        
        // Selected Range
        isSelectedRange && !isSelected && "bg-accent-blue-light text-accent-blue rounded-sm",
        
        // Selected Start/End
        isSelected && "bg-accent-blue text-white rounded-full shadow-md shadow-accent-blue/40 z-10"
      )}
    >
      {/* Background connector for range (visual polish) */}
      {(isSelectedStart && isSelectedRange) && (
        <div className="absolute right-0 w-1/2 h-full bg-accent-blue-light rounded-r-sm -z-10" />
      )}
      {(isSelectedEnd && isSelectedRange) && (
        <div className="absolute left-0 w-1/2 h-full bg-accent-blue-light rounded-l-sm -z-10" />
      )}

      {format(date, 'd')}

      {/* Note indicator dot */}
      {hasNotes && (
        <div className={cn(
          "absolute bottom-0.5 w-1 h-1 rounded-full",
          isSelected ? "bg-white" : "bg-orange-400"
        )} />
      )}
    </motion.button>
  );
}
