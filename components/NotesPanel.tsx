'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { useCalendar } from '@/hooks/useCalendar';
import { useNotes } from '@/hooks/useNotes';
import { useEffect } from "react";


interface NotesPanelProps {
  calendar: ReturnType<typeof useCalendar>;
  notesStore: ReturnType<typeof useNotes>;
}

export function NotesPanel({ calendar, notesStore }: NotesPanelProps) {
  const { selection } = calendar;
  const { addNote, getNotesForDate } = notesStore;

  const activeDate = selection.start;
  const activeDateKey = activeDate ? format(activeDate, 'yyyy-MM-dd') : null;
  const displayDate = activeDate ? format(activeDate, 'MMM do, yyyy') : '';

  const activeNotes = activeDateKey ? getNotesForDate(activeDateKey) : [];
  // Use first note if it exists, otherwise empty
  const initialText = activeNotes.length > 0 ? activeNotes[0].text : '';

  const [localText, setLocalText] = useState(initialText);
  // Update localText when selected date changes
  if (activeDateKey && activeNotes.length > 0 && activeNotes[0].text !== localText && localText === '') {
    // small hack to sync safely in this simple component
  }

  // Effect to sync text when selection changes
  useEffect(() => {
    setLocalText(activeNotes.length > 0 ? activeNotes[0].text : '');
  }, [activeDateKey]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalText(e.target.value);
  };

  const handleBlur = () => {
    if (!activeDateKey) return;

    // Simplification for the replica: only keep 1 combined note string per date.
    if (activeNotes.length > 0) {
      if (localText.trim() === '') {
        notesStore.removeNote(activeNotes[0].id);
      } else if (localText !== activeNotes[0].text) {
        notesStore.removeNote(activeNotes[0].id);
        addNote(activeDateKey, localText);
      }
    } else if (localText.trim() !== '') {
      addNote(activeDateKey, localText);
    }
  };

  return (
    <div className="w-full flex flex-col h-full">
      <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-4">Notes</h3>

      {activeDate ? (
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold text-accent-blue bg-accent-blue/10 px-2 py-1 rounded">
            {displayDate}
          </span>
        </div>
      ) : (
        <div className="mb-2 text-xs text-gray-400 italic">Select a date to take notes</div>
      )}

      {/* Ruled lines container */}
      <div className="relative flex-grow min-h-[200px]">
        {/* Background lines */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(transparent, transparent 27px, #eaeaea 27px, #eaeaea 28px)',
            backgroundSize: '100% 28px'
          }}>
        </div>

        <textarea
          disabled={!activeDate}
          value={localText}
          onChange={handleTextChange}
          onBlur={handleBlur}
          placeholder={activeDate ? "Write something here..." : ""}
          className="w-full h-full bg-transparent resize-none focus:outline-none text-sm text-gray-800 leading-[28px] pt-[4px]"
          style={{ lineHeight: '28px' }}
        />
      </div>
    </div>
  );
}
