import { useState, useEffect, useCallback, useMemo } from 'react';
import { isSameMonth, parseISO } from 'date-fns';

export type NoteType = 'note' | 'event';
export type NoteCategory = 'work' | 'personal' | 'urgent' | 'general';
export type RecurrenceType = 'none' | 'weekly' | 'monthly';

export type Note = {
  id: string;
  dateKey: string; // YYYY-MM-DD
  text: string;
  type: NoteType;
  category: NoteCategory;
  recurrence: RecurrenceType;
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
    } else {
      // Seed sample data for first-time viewers
      const today = new Date();
      const month = today.getMonth() + 1;
      const year = today.getFullYear();
      const pad = (n: number) => n.toString().padStart(2, '0');
      
      const samples: Note[] = [
        {
          id: 'sample-1',
          dateKey: `${year}-${pad(month)}-01`,
          text: '🚀 Launch of the new Chronicle Calendar project.',
          type: 'event',
          category: 'work',
          recurrence: 'none',
          createdAt: new Date(`${year}-${pad(month)}-01T10:00:00`).getTime()
        },
        {
          id: 'sample-2',
          dateKey: `${year}-${pad(month)}-01`,
          text: 'Check responsiveness on ultra-wide monitors.',
          type: 'note',
          category: 'urgent',
          recurrence: 'none',
          createdAt: new Date(`${year}-${pad(month)}-01T14:30:00`).getTime()
        },
        {
          id: 'sample-3',
          dateKey: `${year}-${pad(month)}-07`,
          text: 'Weekly Sync with lead designer.',
          type: 'event',
          category: 'work',
          recurrence: 'weekly',
          createdAt: new Date(`${year}-${pad(month)}-07T11:00:00`).getTime()
        },
        {
          id: 'sample-4',
          dateKey: `${year}-${pad(month)}-15`,
          text: 'Personal meditation and focus session.',
          type: 'note',
          category: 'personal',
          recurrence: 'none',
          createdAt: new Date(`${year}-${pad(month)}-15T09:00:00`).getTime()
        }
      ];
      setNotes(samples);
      localStorage.setItem('calendar-notes', JSON.stringify(samples));
    }
    setIsLoaded(true);
  }, []);

  const saveNotes = (newNotes: Note[]) => {
    setNotes(newNotes);
    localStorage.setItem('calendar-notes', JSON.stringify(newNotes));
  };

  const addNote = useCallback((dateKey: string, text: string, type: NoteType = 'note', category: NoteCategory = 'general', recurrence: RecurrenceType = 'none') => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      dateKey,
      text,
      type,
      category,
      recurrence,
      createdAt: Date.now()
    };
    saveNotes([...notes, newNote]);
  }, [notes]);

  const updateNote = useCallback((id: string, text: string, type?: NoteType, category?: NoteCategory) => {
    const newNotes = notes.map(n => 
      n.id === id ? { ...n, text, type: type || n.type, category: category || n.category } : n
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
      totalEntries: monthlyNotes.length,
      workCount: monthlyNotes.filter(n => n.category === 'work').length,
      personalCount: monthlyNotes.filter(n => n.category === 'personal').length,
      urgentCount: monthlyNotes.filter(n => n.category === 'urgent').length,
    };
  }, [notes]);

  const upcomingEvents = useMemo(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    return notes
      .filter(n => n.dateKey >= todayStr)
      .sort((a,b) => a.dateKey.localeCompare(b.dateKey))
      .slice(0, 5);
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
    getMonthlyStats,
    upcomingEvents
  };
}
