'use client';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { NoteCategory } from '@/hooks/useNotes';
import { Briefcase, User, AlertTriangle, Zap, Calendar } from 'lucide-react';

interface ExportTemplateProps {
  range: { start: Date; end: Date; days: number };
  notes: any[];
  accentColor: string;
}

export function ExportTemplate({ range, notes, accentColor }: ExportTemplateProps) {
  const getCategoryIcon = (cat: NoteCategory) => {
    switch (cat) {
      case 'work': return <Briefcase size={14} />;
      case 'personal': return <User size={14} />;
      case 'urgent': return <AlertTriangle size={14} />;
      default: return <Zap size={14} />;
    }
  };

  const getCategoryColor = (cat: NoteCategory) => {
    switch (cat) {
      case 'work': return 'text-accent-blue';
      case 'personal': return 'text-emerald-500';
      case 'urgent': return 'text-rose-500';
      default: return 'text-gray-400';
    }
  };

  return (
    <div 
      id="export-container"
      className="w-[800px] bg-[#0c0c0e] text-white p-12 rounded-[2.5rem] border border-white/10 overflow-hidden relative shadow-2xl"
      style={{ 
        fontFamily: "Inter, system-ui, sans-serif",
        backgroundImage: 'radial-gradient(circle at top right, rgba(var(--accent-color-rgb), 0.1), transparent 40%)'
      }}
    >
      {/* Glossy Backdrop */}
      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-12 border-b border-white/5 pb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tighter mb-4 flex items-center gap-4">
            <span className="w-4 h-12 bg-accent-blue rounded-full" />
            Timeline Snapshot
          </h1>
          <div className="flex items-center gap-3 text-gray-400">
            <Calendar size={18} className="text-accent-blue" />
            <span className="text-xl font-bold tracking-tight">
              {format(range.start, 'MMM d, yyyy')} — {format(range.end, 'MMM d, yyyy')}
            </span>
            <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-black uppercase tracking-[0.2em] border border-white/10 ml-2">
              {range.days} {range.days === 1 ? 'Day' : 'Days'}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Chronicle App</p>
          <p className="text-xs font-bold text-accent-blue opacity-60">Export Generated {format(new Date(), 'HH:mm')}</p>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 space-y-8">
        {notes.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl opacity-30">
            <p className="text-xl font-bold tracking-tight uppercase">No recorded entries for this period</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {notes.sort((a, b) => b.createdAt - a.createdAt).map((note) => (
              <div 
                key={note.id}
                className="p-8 rounded-[1.5rem] bg-white/[0.03] border border-white/5 relative overflow-hidden group"
              >
                <div className={cn("absolute left-0 top-0 w-1.5 h-full", 
                  note.category === 'work' ? 'bg-accent-blue' :
                  note.category === 'personal' ? 'bg-emerald-500' :
                  note.category === 'urgent' ? 'bg-rose-500' : 'bg-gray-500'
                )} />
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className={cn("flex items-center gap-2 text-xs font-black uppercase tracking-widest", getCategoryColor(note.category))}>
                      {getCategoryIcon(note.category)}
                      {note.category}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-white/10" />
                    <span className="text-xs font-bold text-white/30">
                      {format(parseISO(note.dateKey), 'MMM d')} • {format(note.createdAt, 'h:mm a')}
                    </span>
                  </div>
                  {note.recurrence !== 'none' && (
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/20 px-2 py-1 border border-white/5 rounded-lg">
                      {note.recurrence}
                    </span>
                  )}
                </div>
                
                <p className="text-xl font-medium leading-relaxed text-white/90 break-words">
                  {note.text}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Branding */}
      <div className="mt-16 pt-8 border-t border-white/5 flex items-center justify-between opacity-30">
        <p className="text-[10px] font-black uppercase tracking-widest">Premium Interactive Calendar v1.0</p>
        <div className="flex gap-4">
          <div className="w-2 h-2 rounded-full bg-accent-blue" />
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <div className="w-2 h-2 rounded-full bg-rose-500" />
        </div>
      </div>
    </div>
  );
}
