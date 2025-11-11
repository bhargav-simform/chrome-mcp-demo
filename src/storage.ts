import { JournalEntry } from './types';

const STORAGE_KEY = 'mindtrackr_entries';

export const getEntries = (): JournalEntry[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error('Error loading entries from localStorage:', error);
    return [];
  }
};

export const saveEntries = (entries: JournalEntry[]): boolean => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    return true;
  } catch (error) {
    console.error('Error saving entries to localStorage:', error);
    return false;
  }
};