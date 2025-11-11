import type { JournalEntry, MoodType, MoodCount } from './types';

// Constants
export const MOODS: readonly MoodType[] = ['Happy', 'Sad', 'Stressed', 'Calm', 'Angry', 'Excited'] as const;

export const MOOD_COLORS: Record<MoodType, string> = {
  Happy: '#10b981',
  Sad: '#3b82f6',
  Stressed: '#ef4444',
  Calm: '#8b5cf6',
  Angry: '#f59e0b',
  Excited: '#ec4899'
};

export const STORAGE_KEY = 'mindtrackr_entries';

// Local storage utilities
export const storage = {
  get: (key: string): JournalEntry[] => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return [];
      
      const parsed = JSON.parse(item);
      if (!Array.isArray(parsed)) return [];
      
      return parsed.filter(entry => 
        entry &&
        typeof entry.id === 'string' &&
        typeof entry.date === 'string' &&
        typeof entry.mood === 'string' &&
        typeof entry.text === 'string' &&
        MOODS.includes(entry.mood as MoodType)
      );
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  },

  set: (key: string, data: JournalEntry[]): void => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      throw new Error('Failed to save data');
    }
  }
};

// Date utilities
export const formatDate = (date: string): string => {
  try {
    const parsedDate = new Date(date);
    return parsedDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return date;
  }
};

export const getCurrentDate = (): string => {
  return new Date().toISOString().slice(0, 10);
};

export const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};

// Entry utilities
export const createEntry = (
  text: string,
  mood: MoodType,
  date?: string
): Omit<JournalEntry, 'id' | 'createdAt'> => ({
  text: text.trim(),
  mood,
  date: date || getCurrentDate()
});

export const generateEntryId = (): string => {
  return `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Mood counting and statistics
export const calculateMoodCounts = (entries: JournalEntry[]): MoodCount => {
  const counts: MoodCount = {};
  
  entries.forEach(entry => {
    if (MOODS.includes(entry.mood as MoodType)) {
      counts[entry.mood] = (counts[entry.mood] || 0) + 1;
    }
  });
  
  return counts;
};

export const getMoodFrequency = (entries: JournalEntry[], mood: MoodType): number => {
  if (entries.length === 0) return 0;
  const moodEntries = entries.filter(entry => entry.mood === mood);
  return Math.round((moodEntries.length / entries.length) * 100);
};

// Filtering utilities
export const filterEntriesByMood = (entries: JournalEntry[], mood: string): JournalEntry[] => {
  if (!mood) return entries;
  return entries.filter(entry => entry.mood === mood);
};

export const filterEntriesByDateRange = (
  entries: JournalEntry[],
  startDate?: string,
  endDate?: string
): JournalEntry[] => {
  if (!startDate && !endDate) return entries;
  
  return entries.filter(entry => {
    if (startDate && entry.date < startDate) return false;
    if (endDate && entry.date > endDate) return false;
    return true;
  });
};

// Sorting utilities
export const sortEntriesByDate = (entries: JournalEntry[], order: 'asc' | 'desc' = 'desc'): JournalEntry[] => {
  return [...entries].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return order === 'desc' ? dateB - dateA : dateA - dateB;
  });
};

// Validation utilities
export const validateEntry = (text: string, mood: MoodType): string | null => {
  if (!text.trim()) {
    return 'Please enter some text for your journal entry.';
  }
  
  if (text.trim().length < 3) {
    return 'Journal entry must be at least 3 characters long.';
  }
  
  if (text.trim().length > 2000) {
    return 'Journal entry must be less than 2000 characters.';
  }
  
  if (!MOODS.includes(mood)) {
    return 'Please select a valid mood.';
  }
  
  return null;
};

// Accessibility utilities
export const announceToScreenReader = (message: string): void => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.style.cssText = `
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  `;
  
  document.body.appendChild(announcement);
  
  // Delay to ensure screen reader picks it up
  setTimeout(() => {
    announcement.textContent = message;
  }, 100);
  
  // Clean up after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 3000);
};

// Performance utilities
export const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: number;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait) as unknown as number;
  };
};

export const throttle = <T extends (...args: unknown[]) => void>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};