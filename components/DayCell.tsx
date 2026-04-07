import { format, isWeekend, isToday } from 'date-fns';
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
  };
  hasNotes: boolean;
  hasEvents: boolean;
  onClick: (date: Date) => void;
};

export function DayCell({ date, status, hasNotes, hasEvents, onClick }: DayCellProps) {
  const { isCurrentMonth, isToday: _isToday, isSelectedStart, isSelectedEnd, isSelectedRange } = status;
  
  const _isWeekend = isWeekend(date);

  if (!isCurrentMonth) {
    return (
      <div className="h-11 w-11 md:h-12 md:w-12 flex items-center justify-center text-gray-text/10 text-sm md:text-base font-bold pointer-events-none transition-colors duration-500">
        {format(date, 'd')}
      </div>
    );
  }

  const isSelected = isSelectedStart || isSelectedEnd;

  return (
    <motion.button
      whileHover={{ 
        scale: isSelected ? 1.05 : 1.12,
        y: -1,
        boxShadow: "0 10px 20px -5px rgba(48, 139, 231, 0.15)"
      }}
      whileTap={{ scale: 0.92 }}
      onClick={() => onClick(date)}
      className={cn(
        "relative h-11 w-11 md:h-12 md:w-12 flex items-center justify-center text-sm md:text-base font-bold transition-all duration-300 rounded-xl",
        "outline-none focus:ring-2 focus:ring-accent-blue/40",
         !isSelected && !isSelectedRange && "hover:bg-accent-blue/5 hover:text-accent-blue",
        
        // Text Color Logic
        !isSelected && _isWeekend ? "text-accent-blue/60" : (!isSelected ? "text-foreground" : ""),
        
        // Today styling
        _isToday && !isSelected && !isSelectedRange && "border border-accent-blue/60 text-accent-blue shadow-lg shadow-accent-blue/20 bg-accent-blue/5",
        
        // Selected Range
        isSelectedRange && !isSelected && "bg-accent-blue/10 text-accent-blue rounded-md border border-accent-blue/20 ring-1 ring-accent-blue/10",
        
        // Selected Start/End
        isSelected && "bg-accent-blue text-white rounded-full shadow-[0_15px_30px_-5px_rgba(48,139,231,0.4)] z-10 scale-105"
      )}
    >
      {/* Background connector for range (visual polish) */}
      <AnimatePresence>
        {(isSelectedStart && isSelectedRange) && (
          <motion.div 
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            className="absolute right-0 w-1/2 h-full bg-accent-blue/10 -z-10 origin-left" 
          />
        )}
        {(isSelectedEnd && isSelectedRange) && (
          <motion.div 
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            className="absolute left-0 w-1/2 h-full bg-accent-blue/10 -z-10 origin-right" 
          />
        )}
      </AnimatePresence>

      {format(date, 'd')}

      {/* Markers Container */}
      <div className="absolute bottom-1.5 flex gap-1 items-center justify-center">
        {/* Note indicator dot */}
        {hasNotes && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={cn(
              "w-1.5 h-1.5 rounded-full shadow-sm",
              isSelected ? "bg-white" : "bg-accent-blue"
            )} 
          />
        )}
        {/* Event indicator dot */}
        {hasEvents && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={cn(
              "w-1.5 h-1.5 rounded-full shadow-sm",
              isSelected ? "bg-white/80" : "bg-orange-500"
            )} 
          />
        )}
      </div>
    </motion.button>
  );
}
