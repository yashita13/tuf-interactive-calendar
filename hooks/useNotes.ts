import { useState, useEffect } from 'react';

export type Note = {
  id: string;
  dateKey: string; // YYYY-MM-DD
  text: string;
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

  const addNote = (dateKey: string, text: string) => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      dateKey,
      text,
      createdAt: Date.now()
    };
    saveNotes([...notes, newNote]);
  };

  const removeNote = (id: string) => {
    saveNotes(notes.filter(n => n.id !== id));
  };

  const getNotesForDate = (dateKey: string) => {
    return notes.filter(n => n.dateKey === dateKey);
  };

  const hasNotes = (dateKey: string) => {
    return notes.some(n => n.dateKey === dateKey);
  };

  return {
    notes,
    isLoaded,
    addNote,
    removeNote,
    getNotesForDate,
    hasNotes
  };
}
