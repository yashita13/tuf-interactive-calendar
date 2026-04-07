'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { useCalendar } from '@/hooks/useCalendar';
import { useNotes, NoteType } from '@/hooks/useNotes';
import { Edit3, Trash2, Calendar as CalendarIcon, Info, Send, CheckCircle2 } from 'lucide-react';

interface NotesPanelProps {
  calendar: ReturnType<typeof useCalendar>;
  notesStore: ReturnType<typeof useNotes>;
}

export function NotesPanel({ calendar, notesStore }: NotesPanelProps) {
  const { selection, selectionStats } = calendar;
  const { addNote, removeNote, updateNote, getNotesForDate } = notesStore;

  const activeDate = selection.start;
  const activeDateKey = activeDate ? format(activeDate, 'yyyy-MM-dd') : null;
  const displayDate = activeDate ? format(activeDate, 'MMM do, yyyy') : '';

  const activeNotes = activeDateKey ? getNotesForDate(activeDateKey) : [];
  
  const [localText, setLocalText] = useState('');
  const [noteType, setNoteType] = useState<NoteType>('note');
  const [isSaved, setIsSaved] = useState(false);

  // Sync text when selection changes
  useEffect(() => {
    setLocalText('');
    setIsSaved(false);
  }, [activeDateKey]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDateKey || !localText.trim()) return;

    addNote(activeDateKey, localText.trim(), noteType);
    setLocalText('');
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="w-full h-full flex flex-col group min-h-[600px] transition-all">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent-blue/10 rounded-xl flex items-center justify-center text-accent-blue border border-accent-blue/20">
            <Edit3 size={20} />
          </div>
          <h3 className="text-xl font-bold font-heading tracking-tight text-foreground uppercase tracking-widest">Memos & Events</h3>
        </div>
      </div>
      
      {activeDate ? (
        <motion.div 
           initial={{ opacity: 0, x: -10 }}
           animate={{ opacity: 1, x: 0 }}
           className="mb-8"
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-accent-blue/50">Current Target</span>
              <div className="h-[1px] flex-grow bg-border-color/60" />
            </div>
            <p className="text-lg font-bold text-foreground tracking-tight">
              {selectionStats?.days && selectionStats.days > 1 
                ? `${format(selectionStats.start, 'MMM d')} → ${format(selectionStats.end, 'MMM d')}` 
                : displayDate
              }
            </p>
          </div>
        </motion.div>
      ) : (
        <div className="mb-8 p-6 rounded-2xl bg-accent-blue/5 border border-dashed border-accent-blue/20 flex flex-col items-center justify-center gap-4 text-center">
          <CalendarIcon size={32} className="text-accent-blue/30" />
          <p className="text-sm text-gray-text font-semibold max-w-[200px]">
             Experience precision. Click a day to document your timeline.
          </p>
        </div>
      )}

      {/* Note Editor */}
      <div className="relative mb-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative flex-grow bg-background/60 backdrop-blur-sm rounded-2xl p-6 border border-border-color shadow-inner transition-all hover:bg-background/80">
            {/* Background lines aesthetic */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.08]" 
                style={{ 
                  backgroundImage: 'linear-gradient(transparent, transparent 31px, var(--foreground) 31px, var(--foreground) 32px)',
                  backgroundSize: '100% 32px' 
                }}>
            </div>
            
            <textarea
              disabled={!activeDate}
              value={localText}
              onChange={(e) => setLocalText(e.target.value)}
              placeholder="Jot down a memo or event..."
              className="w-full min-h-[120px] bg-transparent resize-none focus:outline-none text-base text-foreground leading-[32px] pt-[2px] font-medium placeholder:text-gray-text/20 transition-all z-10"
            />
          </div>

          <div className="flex items-center justify-between gap-4">
             <div className="flex p-1 bg-background/80 rounded-xl border border-border-color shadow-sm">
                <button 
                  type="button"
                  onClick={() => setNoteType('note')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                    noteType === 'note' ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/20' : 'text-gray-text hover:text-foreground'
                  }`}
                >
                  Memo
                </button>
                <button 
                  type="button"
                  onClick={() => setNoteType('event')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                    noteType === 'event' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-gray-text hover:text-foreground'
                  }`}
                >
                  Event
                </button>
             </div>

             <button 
                type="submit"
                disabled={!activeDate || !localText.trim()}
                className="flex items-center gap-2 px-6 py-2 bg-accent-blue hover:bg-accent-blue/90 disabled:opacity-20 disabled:hover:bg-accent-blue text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-accent-blue/20 active:scale-95"
             >
                {isSaved ? <CheckCircle2 size={16} /> : <Send size={16} />}
                {isSaved ? 'SAVED' : 'SAVE'}
             </button>
          </div>
        </form>
      </div>

      {/* Saved Entries List */}
      <div className="flex-grow">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-xs font-black uppercase tracking-widest text-gray-text/30">History of entries</span>
            <div className="h-[1px] flex-grow bg-border-color/60" />
          </div>

          <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
            <AnimatePresence>
              {activeNotes.length === 0 ? (
                <motion.div 
                   initial={{ opacity: 0 }} 
                   animate={{ opacity: 1 }} 
                   className="py-10 flex flex-col items-center justify-center opacity-30 text-center"
                >
                  <Info size={24} className="mb-2" />
                  <p className="text-sm font-bold uppercase tracking-widest">No entries documented.</p>
                </motion.div>
              ) : (
                activeNotes.sort((a,b) => b.createdAt - a.createdAt).map(note => (
                  <motion.div 
                    key={note.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-5 rounded-2xl bg-background/40 border border-border-color flex justify-between gap-4 group hover:bg-accent-blue/5 hover:border-accent-blue/20 transition-all shadow-sm"
                  >
                    <div className="flex flex-col gap-2 min-w-0">
                       <div className="flex items-center gap-2">
                         <div className={`w-1.5 h-1.5 rounded-full ${note.type === 'event' ? 'bg-orange-500' : 'bg-accent-blue'}`} />
                         <span className="text-[9px] font-black uppercase tracking-[0.1em] text-gray-text/60">
                            {note.type} • {format(note.createdAt, 'h:mm a')}
                         </span>
                       </div>
                       <p className="text-base text-foreground font-medium leading-relaxed break-words">
                          {note.text}
                       </p>
                    </div>
                    <button 
                       onClick={() => removeNote(note.id)}
                       className="p-2 rounded-lg text-gray-text/20 hover:text-red-500 hover:bg-red-500/5 transition-all opacity-0 group-hover:opacity-100 shrink-0"
                    >
                       <Trash2 size={16} />
                    </button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
      </div>
    </div>
  );
}
