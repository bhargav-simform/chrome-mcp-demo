import React, { memo, useCallback, useState, useEffect } from 'react';
import { useJournalEntries, useKeyboardShortcuts } from './hooks';
import { announceToScreenReader } from './utils';
import MoodChart from './MoodChart';
import EntryForm from './EntryForm';
import EntryList from './EntryList';
import type { MoodType } from './types';
import './styles.css';

const App: React.FC = memo(() => {
  const {
    entries,
    isLoading,
    error,
    addEntry,
    clearError
  } = useJournalEntries();

  const [filterMood, setFilterMood] = useState<string>('');

  // Handle form submission
  const handleEntrySubmit = useCallback((text: string, mood: MoodType): boolean => {
    return addEntry(text, mood);
  }, [addEntry]);

  // Handle filter changes
  const handleFilterChange = useCallback((mood: string) => {
    setFilterMood(mood);
    if (mood) {
      announceToScreenReader(`Filtered to show ${mood} entries`);
    } else {
      announceToScreenReader('Showing all entries');
    }
  }, []);

  // Keyboard shortcuts
  const shortcuts = {
    'ctrl+k': () => {
      const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
      textarea?.focus();
    },
    'escape': () => {
      setFilterMood('');
      clearError();
    }
  };

  useKeyboardShortcuts(shortcuts);

  // Clear error when user interacts
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000); // Auto-clear error after 5 seconds

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [error, clearError]);

  // Handle loading state
  if (isLoading) {
    return (
      <div className="app-container">
        <div className="loading" role="status" aria-label="Loading MindTrackr">
          <div className="skeleton" style={{ width: '200px', height: '2rem', marginBottom: '1rem' }}></div>
          <div className="skeleton" style={{ width: '300px', height: '1rem' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Skip link for accessibility */}
      <a 
        href="#main-content" 
        className="skip-link sr-only focus-visible"
        style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          zIndex: 1000,
          padding: '0.5rem 1rem',
          backgroundColor: 'var(--color-primary)',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '0.25rem'
        }}
      >
        Skip to main content
      </a>

      <header className="app-header">
        <h1 className="app-title">
          MindTrackr
        </h1>
        <p className="app-subtitle">
          Your personal mental health journal with mood tracking
        </p>
      </header>

      <main id="main-content">
        {/* Global error display */}
        {error && (
          <div 
            className="error-message"
            role="alert"
            aria-live="assertive"
          >
            <strong>Error:</strong> {error}
            <button
              onClick={clearError}
              style={{
                marginLeft: '1rem',
                background: 'none',
                border: 'none',
                color: 'inherit',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontSize: 'inherit'
              }}
              aria-label="Dismiss error message"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Entry Form */}
        <EntryForm 
          onSubmit={handleEntrySubmit}
        />

        {/* Mood Chart */}
        {entries.length > 0 && (
          <section className="card" aria-labelledby="chart-heading">
            <h2 id="chart-heading" className="card-title">
              Mood Analysis
            </h2>
            <p className="form-description">
              Visual representation of your mood patterns over time
            </p>
            <MoodChart entries={entries} />
          </section>
        )}

        {/* Entry List */}
        <EntryList
          entries={entries}
          filterMood={filterMood}
          onFilterChange={handleFilterChange}
        />
      </main>

      <footer 
        className="app-footer"
        style={{
          marginTop: 'var(--spacing-3xl)',
          padding: 'var(--spacing-xl) 0',
          borderTop: '1px solid var(--color-border)',
          textAlign: 'center',
          color: 'var(--color-text-muted)',
          fontSize: '0.875rem'
        }}
      >
        <p>
          MindTrackr - Built with React, TypeScript, and Chart.js
        </p>
        <p style={{ marginTop: 'var(--spacing-sm)' }}>
          <kbd>Ctrl+K</kbd> to focus text area • <kbd>Escape</kbd> to clear filters
        </p>
      </footer>
    </div>
  );
});

App.displayName = 'App';

export default App;