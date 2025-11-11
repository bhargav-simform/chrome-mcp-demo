import React, { memo, useCallback } from 'react';
import { JournalEntry, MoodType, MOODS, MOOD_COLORS } from '../types';

interface EntryListProps {
  entries: JournalEntry[];
  filterMood: string;
  onFilterChange: (mood: string) => void;
  onDeleteEntry?: (id: number) => void;
}

export const EntryList: React.FC<EntryListProps> = memo(({
  entries,
  filterMood,
  onFilterChange,
  onDeleteEntry
}) => {
  const handleFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onFilterChange(e.target.value);
    },
    [onFilterChange]
  );

  const filteredEntries = filterMood 
    ? entries.filter(entry => entry.mood === filterMood)
    : entries;

  const handleDeleteEntry = useCallback(
    (id: number) => {
      if (onDeleteEntry && window.confirm('Are you sure you want to delete this entry?')) {
        onDeleteEntry(id);
      }
    },
    [onDeleteEntry]
  );

  return (
    <section className="entries-section" aria-labelledby="entries-heading">
      <h2 id="entries-heading" className="section-title">
        Journal Entries ({entries.length})
      </h2>
      
      <div className="filter-controls">
        <label htmlFor="mood-filter" className="filter-label">
          Filter by mood:
        </label>
        <select
          id="mood-filter"
          className="mood-filter"
          value={filterMood}
          onChange={handleFilterChange}
        >
          <option value="">All moods</option>
          {MOODS.map((mood) => (
            <option key={mood} value={mood}>
              {mood}
            </option>
          ))}
        </select>
      </div>

      {filteredEntries.length === 0 ? (
        <div className="empty-state" role="status">
          {filterMood 
            ? `No entries found for "${filterMood}" mood.`
            : 'No journal entries yet. Start by writing about your day!'
          }
        </div>
      ) : (
        <ul className="entries-list" role="list">
          {filteredEntries.map((entry) => (
            <li
              key={entry.id}
              className="entry-item"
              style={{
                '--mood-color': MOOD_COLORS[entry.mood as MoodType]
              } as React.CSSProperties}
            >
              <div className="entry-header">
                <time className="entry-date" dateTime={entry.date}>
                  {new Date(entry.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </time>
                <span 
                  className="entry-mood"
                  aria-label={`Mood: ${entry.mood}`}
                >
                  {entry.mood}
                </span>
                {onDeleteEntry && (
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteEntry(entry.id)}
                    aria-label={`Delete entry from ${entry.date}`}
                    title="Delete entry"
                  >
                    ×
                  </button>
                )}
              </div>
              <div className="entry-content">
                {entry.text}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
});