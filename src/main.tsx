import React, { useState, useCallback, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { JournalEntry, MoodType, MoodCount } from './types';
import { getEntries, saveEntries } from './storage';
import { JournalForm } from './components/JournalForm';
import { MoodChart } from './components/MoodChart';
import { EntryList } from './components/EntryList';
import { ErrorBoundary } from './components/ErrorBoundary';
import './styles.css';

function App() {
  const [text, setText] = useState('');
  const [mood, setMood] = useState<MoodType>('Happy');
  const [filterMood, setFilterMood] = useState('');
  const [entries, setEntries] = useState<JournalEntry[]>(() => getEntries());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Memoized mood counts calculation
  const moodCounts = useMemo((): MoodCount => {
    const counts: MoodCount = {};
    entries.forEach((entry) => {
      counts[entry.mood] = (counts[entry.mood] || 0) + 1;
    });
    return counts;
  }, [entries]);

  // Optimized save function with error handling
  const handleSave = useCallback(async () => {
    if (!text.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const newEntry: JournalEntry = {
        id: Date.now(),
        date: new Date().toISOString().slice(0, 10),
        mood,
        text: text.trim()
      };
      
      const updatedEntries = [...entries, newEntry];
      
      if (saveEntries(updatedEntries)) {
        setEntries(updatedEntries);
        setText(''); // Clear form after successful save
      } else {
        throw new Error('Failed to save entry to storage');
      }
    } catch (error) {
      console.error('Error saving entry:', error);
      alert('Failed to save entry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [text, mood, entries, isSubmitting]);

  // Optimized delete function
  const handleDeleteEntry = useCallback((id: number) => {
    try {
      const updatedEntries = entries.filter(entry => entry.id !== id);
      
      if (saveEntries(updatedEntries)) {
        setEntries(updatedEntries);
      } else {
        throw new Error('Failed to delete entry from storage');
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
      alert('Failed to delete entry. Please try again.');
    }
  }, [entries]);

  const handleTextChange = useCallback((newText: string) => {
    setText(newText);
  }, []);

  const handleMoodChange = useCallback((newMood: MoodType) => {
    setMood(newMood);
  }, []);

  const handleFilterChange = useCallback((newFilter: string) => {
    setFilterMood(newFilter);
  }, []);

  return (
    <ErrorBoundary>
      <div className="app">
        <header>
          <h1 className="main-title">MindTrackr</h1>
        </header>
        
        <main>
          <JournalForm
            text={text}
            mood={mood}
            onTextChange={handleTextChange}
            onMoodChange={handleMoodChange}
            onSubmit={handleSave}
            disabled={isSubmitting}
          />

          <section className="chart-section" aria-labelledby="chart-heading">
            <h2 id="chart-heading" className="section-title">
              Mood Frequency
            </h2>
            <MoodChart moodCounts={moodCounts} />
          </section>

          <EntryList
            entries={entries}
            filterMood={filterMood}
            onFilterChange={handleFilterChange}
            onDeleteEntry={handleDeleteEntry}
          />
        </main>
      </div>
    </ErrorBoundary>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
