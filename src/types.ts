// Type definitions for MindTrackr application

export type MoodType = 'Happy' | 'Sad' | 'Stressed' | 'Calm' | 'Angry' | 'Excited';

export interface JournalEntry {
  id: string;
  date: string;
  mood: MoodType;
  text: string;
  createdAt: string;
}

export interface MoodCount {
  [mood: string]: number;
}

export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }>;
}

export interface AppState {
  entries: JournalEntry[];
  isLoading: boolean;
  error: string | null;
}

export interface FormState {
  text: string;
  mood: MoodType;
  isSubmitting: boolean;
}

export interface FilterState {
  mood: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

// Props interfaces
export interface MoodChartProps {
  entries: JournalEntry[];
  className?: string;
}

export interface EntryFormProps {
  onSubmit: (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => void;
  isSubmitting?: boolean;
}

export interface EntryListProps {
  entries: JournalEntry[];
  filterMood: string;
  onFilterChange: (mood: string) => void;
}

export interface EntryItemProps {
  entry: JournalEntry;
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;