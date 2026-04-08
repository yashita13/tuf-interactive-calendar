'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { useCalendar } from '@/hooks/useCalendar';
import { cn } from '@/lib/utils';
import { useNotes, NoteType, NoteCategory, RecurrenceType } from '@/hooks/useNotes';
import { Edit3, Trash2, Calendar as CalendarIcon, Info, Send, CheckCircle2, Zap, Briefcase, User, AlertTriangle, Clock } from 'lucide-react';

interface NotesPanelProps {
  calendar: ReturnType<typeof useCalendar>;
  notesStore: ReturnType<typeof useNotes>;
}

export function NotesPanel({ calendar, notesStore }: NotesPanelProps) {
  const { selection, selectionStats } = calendar;
  const { addNote, removeNote, updateNote, getNotesForDate, upcomingEvents } = notesStore;

  const activeDate = selection.start;
  const activeDateKey = activeDate ? format(activeDate, 'yyyy-MM-dd') : null;
  const displayDate = activeDate ? format(activeDate, 'MMM do, yyyy') : '';

  const activeNotes = activeDateKey ? getNotesForDate(activeDateKey) : [];

  const [localText, setLocalText] = useState('');
  const [noteType, setNoteType] = useState<NoteType>('note');
  const [category, setCategory] = useState<NoteCategory>('general');
  const [recurrence, setRecurrence] = useState<RecurrenceType>('none');
  const [isSaved, setIsSaved] = useState(false);

  // Sync text when selection changes
  useEffect(() => {
    setLocalText('');
    setCategory('general');
    setIsSaved(false);
  }, [activeDateKey]);

  // Basic "Auto-suggest" Logic
  useEffect(() => {
    const text = localText.toLowerCase();
    if (text.includes('meeting') || text.includes('call') || text.includes('sync') || text.includes('report')) {
      setCategory('work');
    } else if (text.includes('gym') || text.includes('dinner') || text.includes('party') || text.includes('meditation')) {
      setCategory('personal');
    } else if (text.includes('urgent') || text.includes('immediate') || text.includes('blocker') || text.includes('asap')) {
      setCategory('urgent');
    }
  }, [localText]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalizedRecurrence = calendar.recurrence;
    if (!activeDateKey || !localText.trim()) return;

    if (selectionStats?.days && selectionStats.days > 1) {
      addNote(
        format(selectionStats.start, 'yyyy-MM-dd'),
        localText.trim(),
        noteType,
        category,
        finalizedRecurrence,
        format(selectionStats.end, 'yyyy-MM-dd')
      );
    } else {
      addNote(activeDateKey, localText.trim(), noteType, category, finalizedRecurrence);
    }

    setLocalText('');
    setIsSaved(false);
    setIsSaved(true);
    calendar.setRecurrence('none'); // Reset after add
    setTimeout(() => setIsSaved(false), 2000);
  };


  const getCategoryIcon = (cat: NoteCategory) => {
    switch (cat) {
      case 'work': return <Briefcase size={12} />;
      case 'personal': return <User size={12} />;
      case 'urgent': return <AlertTriangle size={12} />;
      default: return <Zap size={12} />;
    }
  };

  const CATEGORIES: { id: NoteCategory, label: string, color: string }[] = [
    { id: 'general', label: 'General', color: 'bg-gray-500' },
    { id: 'work', label: 'Work', color: 'bg-accent-blue' },
    { id: 'personal', label: 'Personal', color: 'bg-emerald-500' },
    { id: 'urgent', label: 'Urgent', color: 'bg-rose-500' },
  ];

  return (
    <div className="w-full h-full flex flex-col group min-h-[500px] md:min-h-[700px] transition-all">
      <div className="flex items-center justify-between mb-4 md:mb-8">

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent-blue/10 rounded-xl flex items-center justify-center text-accent-blue border border-accent-blue/20">
            <Edit3 size={20} />
          </div>
          <h3 className="text-xl font-bold font-heading tracking-tight text-foreground uppercase tracking-widest">Chronicle Entry</h3>
        </div>
      </div>

      {activeDate && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-4 md:mb-8 p-4 bg-background/40 rounded-2xl border border-border-color border-dashed"

        >
          <div className="flex flex-col gap-1">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-accent-blue/60 mb-1">Targeted Timeline</span>

            <p className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
              <CalendarIcon size={16} className="text-accent-blue" />
              {selectionStats?.days && selectionStats.days > 1
                ? `${format(selectionStats.start, 'MMM d')} → ${format(selectionStats.end, 'MMM d')} (${selectionStats.days} days)`
                : displayDate
              }
            </p>
          </div>
        </motion.div>
      )}

      {/* Note Editor */}
      <div className="relative mb-6 md:mb-10">

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="relative flex-grow bg-background/60 backdrop-blur-sm rounded-2xl p-6 border border-border-color shadow-2xl transition-all focus-within:border-accent-blue/40 focus-within:ring-1 focus-within:ring-accent-blue/20">
            <textarea
              disabled={!activeDate}
              value={localText}
              onChange={(e) => setLocalText(e.target.value)}
              placeholder="What's happening in this timeline? (e.g. 'Project sync', 'Gym session')..."
              className="w-full min-h-[80px] md:min-h-[140px] bg-transparent resize-none focus:outline-none text-base text-foreground leading-relaxed font-medium placeholder:text-gray-text/20 transition-all z-10"

            />
            {localText.length > 0 && (
              <div className="absolute top-4 right-4 animate-in fade-in zoom-in duration-300">
                <div className={cn("px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-tighter",
                  CATEGORIES.find(c => c.id === category)?.color
                )}>
                  {category} Suggested
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            {/* Category Picker */}
            {/* Category Picker - 2 rows for better text fit */}
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={cn(
                    "flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all border shadow-sm",
                    category === cat.id
                      ? `${cat.color} text-white border-transparent shadow-lg shadow-black/20`
                      : "bg-background/40 border-border-color text-gray-text hover:border-accent-blue/20 hover:text-accent-blue"
                  )}
                >
                  {getCategoryIcon(cat.id)}
                  <span className="truncate">{cat.label}</span>
                </button>
              ))}
            </div>

          </div>

          <div className="flex flex-col gap-6 p-4 bg-background/40 rounded-[2rem] border border-border-color shadow-sm mt-4">
            <div className="flex flex-col gap-4">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-text/30">Chronicle Settings</span>

              <div className="flex flex-col gap-6">
                {/* Type Selection */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-black uppercase tracking-widest text-gray-text/40">Entry Type</span>

                  <div className="flex p-1 bg-background/80 rounded-xl border border-border-color shadow-sm w-full">
                    <button
                      type="button"
                      onClick={() => setNoteType('note')}
                      className={cn(
                        "flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
                        noteType === 'note' ? 'bg-accent-blue text-white shadow-lg' : 'text-gray-text hover:bg-accent-blue/5'
                      )}
                    >
                      Memo
                    </button>
                    <button
                      type="button"
                      onClick={() => setNoteType('event')}
                      className={cn(
                        "flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
                        noteType === 'event' ? 'bg-orange-500 text-white shadow-lg' : 'text-gray-text hover:bg-orange-500/5'
                      )}
                    >
                      Event
                    </button>
                  </div>
                </div>

                {/* Recurrence Selection */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-black uppercase tracking-widest text-gray-text/40">Frequency</span>

                  <div className="grid grid-cols-2 p-1 bg-background/80 rounded-xl border border-border-color shadow-sm w-full gap-1">
                    <button
                      type="button"
                      onClick={() => calendar.setRecurrence('none')}
                      className={cn(
                        "flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                        calendar.recurrence === 'none' ? 'bg-gray-500 text-white shadow-lg' : 'text-gray-text hover:bg-gray-500/5'
                      )}
                    >
                      Once
                    </button>
                    <button
                      type="button"
                      onClick={() => calendar.setRecurrence('weekly')}
                      className={cn(
                        "flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                        calendar.recurrence === 'weekly' ? 'bg-accent-blue text-white shadow-lg' : 'text-gray-text hover:bg-accent-blue/5'
                      )}
                    >
                      Weekly
                    </button>
                    <button
                      type="button"
                      onClick={() => calendar.setRecurrence('monthly')}
                      className={cn(
                        "col-span-2 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                        calendar.recurrence === 'monthly' ? 'bg-indigo-500 text-white shadow-lg' : 'text-gray-text hover:bg-indigo-500/5'
                      )}
                    >
                      Monthly
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={!activeDate || !localText.trim()}
              className="w-full flex items-center justify-center gap-3 px-8 py-3 bg-accent-blue hover:bg-accent-blue/90 disabled:opacity-20 text-white rounded-2xl text-xs font-black tracking-[0.2em] transition-all shadow-xl shadow-accent-blue/20 active:scale-95 border border-white/10"
            >
              {isSaved ? <CheckCircle2 size={16} /> : <Send size={16} />}
              {isSaved ? 'SAVED TO TIMELINE' : 'ADD TO TIMELINE'}
            </button>

          </div>
        </form>
      </div>

      {/* History & Upcoming Panel */}
      <div className="flex-grow flex flex-col gap-10">
        <div>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-text/30">Active Selection History</span>
            <div className="h-[1px] flex-grow bg-border-color/40" />
          </div>


          <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
            <AnimatePresence mode="popLayout">
              {activeNotes.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-12 flex flex-col items-center justify-center opacity-20 text-center border-2 border-dashed border-border-color rounded-3xl"
                >
                  <Info size={32} className="mb-3" />
                  <p className="text-xs font-black uppercase tracking-[0.2em]">No entries for this date.</p>
                </motion.div>
              ) : (
                activeNotes.sort((a: any, b: any) => b.createdAt - a.createdAt).map((note: any) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="p-5 rounded-3xl bg-background/40 border border-border-color flex justify-between gap-4 group hover:bg-accent-blue/5 hover:border-accent-blue/20 transition-all shadow-sm relative overflow-hidden"
                  >
                    <div className={cn("absolute left-0 top-0 w-1 h-full", CATEGORIES.find(c => c.id === note.category)?.color)} />
                    <div className="flex flex-col gap-2 min-w-0 flex-grow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={cn("w-2 h-2 rounded-full", note.type === 'event' ? 'bg-orange-500' : 'bg-accent-blue')} />
                          <span className="text-[10px] font-black uppercase tracking-[0.1em] text-gray-text/60">
                            {note.category} • {format(note.createdAt, 'h:mm a')}
                          </span>
                        </div>
                        <button
                          onClick={() => removeNote(note.id)}
                          className="p-2 rounded-xl text-gray-text/20 hover:text-red-500 hover:bg-red-500/5 transition-all opacity-0 group-hover:opacity-100 shrink-0"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <p className="text-base text-foreground font-medium leading-relaxed break-words">
                        {note.text}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>

  );
}
