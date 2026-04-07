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
    isHovered: boolean;
    isDragging: boolean;
  };
  hasNotes: boolean;
  hasEvents: boolean;
  isHoliday?: boolean;
  onClick: (date: Date, type?: 'click' | 'mousedown' | 'mouseenter' | 'mouseup') => void;
};

export function DayCell({ date, status, hasNotes, hasEvents, isHoliday, onClick }: DayCellProps) {
  const { 
    isCurrentMonth, isToday: _isToday, isSelectedStart, isSelectedEnd, 
    isSelectedRange, isHovered, isDragging 
  } = status;
  
  const _isWeekend = isWeekend(date);

  if (!isCurrentMonth) {
    return (
      <div className="h-9 w-9 md:h-12 md:w-12 flex items-center justify-center text-gray-text/10 text-sm md :text-base font-bold pointer-events-none transition-colors duration-500">
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
        boxShadow: "0 10px 20px -5px rgba(var(--accent-color-rgb), 0.15)"
      }}
      whileTap={{ scale: 0.92 }}
      onMouseDown={() => onClick(date, 'mousedown')}
      onMouseEnter={() => onClick(date, 'mouseenter')}
      onMouseUp={() => onClick(date, 'mouseup')}
      onClick={() => onClick(date, 'click')}
      className={cn(
        "relative h-9 w-9 md:h-12 md:w-12 flex items-center justify-center text-sm md:text-base font-bold transition-all duration-300 rounded-xl",
        "outline-none focus:ring-2 focus:ring-accent-blue/40 scroll-mt-20",
         !isSelected && !isSelectedRange && !isHovered && "hover:bg-accent-blue/5 hover:text-accent-blue font-medium",
        
        // Text Color Logic
        !isSelected && _isWeekend ? "text-accent-blue/60" : (!isSelected ? "text-foreground" : ""),
        
        // Hover/Dragging states
        isHovered && !isSelectedRange && "bg-accent-blue/10 text-accent-blue border border-accent-blue/20",
        isSelectedRange && isDragging && "bg-accent-blue/30 text-white/90",

        // Today styling
        _isToday && !isSelected && !isSelectedRange && "border border-accent-blue/60 text-accent-blue shadow-lg shadow-accent-blue/20 bg-accent-blue/5",
        
        // Selected Range (Finalized)
        isSelectedRange && !isSelected && !isDragging && "bg-accent-blue/10 text-accent-blue rounded-md border border-accent-blue/20 ring-1 ring-accent-blue/10",
        
        // Selected Start/End
        isSelected && "bg-accent-blue text-white rounded-full shadow-[0_15px_30px_-5px_rgba(var(--accent-color-rgb),0.4)] z-10 scale-105"
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
              "w-1 h-1 rounded-full opacity-50",
              isSelected ? "bg-white/40" : "bg-red-400"
            )}
          />
        )}
      </div>
    </motion.button>
  );
}
