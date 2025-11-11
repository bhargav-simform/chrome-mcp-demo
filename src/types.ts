export type MoodType = 'Happy' | 'Sad' | 'Stressed' | 'Calm' | 'Angry' | 'Excited';

export interface JournalEntry {
  id: number;
  date: string;
  mood: MoodType;
  text: string;
}

export interface MoodCount {
  [mood: string]: number;
}

export const MOODS: MoodType[] = ['Happy', 'Sad', 'Stressed', 'Calm', 'Angry', 'Excited'];

export const MOOD_COLORS: Record<MoodType, string> = {
  Happy: '#4ade80',
  Sad: '#3b82f6',
  Stressed: '#ef4444',
  Calm: '#06b6d4',
  Angry: '#f97316',
  Excited: '#a855f7'
};