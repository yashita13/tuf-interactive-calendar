import { useState, useEffect, useCallback, useMemo } from 'react';
import { isSameMonth, parseISO } from 'date-fns';

export type NoteType = 'note' | 'event';

export type Note = {
  id: string;
  dateKey: string; // YYYY-MM-DD
  text: string;
  type: NoteType;
  createdAt: number;
};

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('calendar-notes');
    if (stored) {
      try {
        setNotes(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse notes');
      }
    }
    setIsLoaded(true);
  }, []);

  const saveNotes = (newNotes: Note[]) => {
    setNotes(newNotes);
    localStorage.setItem('calendar-notes', JSON.stringify(newNotes));
  };

  const addNote = useCallback((dateKey: string, text: string, type: NoteType = 'note') => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      dateKey,
      text,
      type,
      createdAt: Date.now()
    };
    saveNotes([...notes, newNote]);
  }, [notes]);

  const updateNote = useCallback((id: string, text: string, type?: NoteType) => {
    const newNotes = notes.map(n => 
      n.id === id ? { ...n, text, type: type || n.type } : n
    );
    saveNotes(newNotes);
  }, [notes]);

  const removeNote = useCallback((id: string) => {
    saveNotes(notes.filter(n => n.id !== id));
  }, [notes]);

  const getNotesForDate = useCallback((dateKey: string) => {
    return notes.filter(n => n.dateKey === dateKey);
  }, [notes]);

  const hasNotes = useCallback((dateKey: string) => {
    return notes.some(n => n.dateKey === dateKey && n.type === 'note');
  }, [notes]);

  const hasEvents = useCallback((dateKey: string) => {
    return notes.some(n => n.dateKey === dateKey && n.type === 'event');
  }, [notes]);

  // Analytics for a specific month
  const getMonthlyStats = useCallback((currentMonth: Date) => {
    const monthlyNotes = notes.filter(n => 
      isSameMonth(parseISO(n.dateKey), currentMonth)
    );
    
    return {
      totalNotes: monthlyNotes.filter(n => n.type === 'note').length,
      totalEvents: monthlyNotes.filter(n => n.type === 'event').length,
      totalEntries: monthlyNotes.length
    };
  }, [notes]);

  return {
    notes,
    isLoaded,
    addNote,
    updateNote,
    removeNote,
    getNotesForDate,
    hasNotes,
    hasEvents,
    getMonthlyStats
  };
}
