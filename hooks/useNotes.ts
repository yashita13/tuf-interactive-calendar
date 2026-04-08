import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  isSameMonth, parseISO, isSameDay, eachDayOfInterval, 
  format, getDay, getDate 
} from 'date-fns';

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
      // Seed sample data
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
          id: 'sample-4',
          dateKey: `${year}-${pad(month)}-15`,
          text: 'Personal focus session.',
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

  const addNote = useCallback((
    dateKey: string, 
    text: string, 
    type: NoteType = 'note', 
    category: NoteCategory = 'general', 
    recurrence: RecurrenceType = 'none',
    endDateKey?: string
  ) => {
    const newNotesToAdd: Note[] = [];
    
    if (endDateKey && endDateKey !== dateKey) {
      const interval = eachDayOfInterval({ 
        start: parseISO(dateKey), 
        end: parseISO(endDateKey) 
      });
      
      interval.forEach(date => {
        newNotesToAdd.push({
          id: crypto.randomUUID(),
          dateKey: format(date, 'yyyy-MM-dd'),
          text,
          type,
          category,
          recurrence: 'none', // Range notes don't recur individually usually
          createdAt: Date.now()
        });
      });
    } else {
      newNotesToAdd.push({
        id: crypto.randomUUID(),
        dateKey,
        text,
        type,
        category,
        recurrence,
        createdAt: Date.now()
      });
    }

    saveNotes([...notes, ...newNotesToAdd]);
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
    const date = parseISO(dateKey);
    return notes.filter(n => {
      // Direct match
      if (n.dateKey === dateKey) return true;
      
      // Recurrence match (only if note is in the past or on the same day)
      if (n.dateKey > dateKey) return false;
      
      if (n.recurrence === 'weekly') {
        return getDay(parseISO(n.dateKey)) === getDay(date);
      }
      if (n.recurrence === 'monthly') {
        return getDate(parseISO(n.dateKey)) === getDate(date);
      }
      
      return false;
    });
  }, [notes]);

  const hasNotes = useCallback((dateKey: string) => {
    return getNotesForDate(dateKey).some(n => n.type === 'note');
  }, [getNotesForDate]);

  const hasEvents = useCallback((dateKey: string) => {
    return getNotesForDate(dateKey).some(n => n.type === 'event');
  }, [getNotesForDate]);

  const getMonthlyStats = useCallback((currentMonth: Date) => {
    const monthlyNotes = notes.filter(n => 
      isSameMonth(parseISO(n.dateKey), currentMonth)
    );
    
    // Categorize activity patterns
    const categories = {
      work: monthlyNotes.filter(n => n.category === 'work').length,
      personal: monthlyNotes.filter(n => n.category === 'personal').length,
      urgent: monthlyNotes.filter(n => n.category === 'urgent').length,
    };

    const mostActiveCategory = Object.entries(categories).reduce((a, b) => b[1] > a[1] ? b : a)[0];

    return {
      totalNotes: monthlyNotes.filter(n => n.type === 'note').length,
      totalEvents: monthlyNotes.filter(n => n.type === 'event').length,
      totalEntries: monthlyNotes.length,
      workCount: categories.work,
      personalCount: categories.personal,
      urgentCount: categories.urgent,
      mostActiveCategory
    };
  }, [notes]);

  const upcomingEvents = useMemo(() => {
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');
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

