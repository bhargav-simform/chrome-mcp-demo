import React, { memo, useCallback, useMemo, useId } from 'react';
import type { JournalEntry } from './types';
import { filterEntriesByMood, sortEntriesByDate, formatDate, MOODS } from './utils';

interface EntryItemProps {
  entry: JournalEntry;
}

const EntryItem: React.FC<EntryItemProps> = memo(({ entry }) => {
  const formattedDate = formatDate(entry.date);
  
  return (
    <article className="entry-item">
      <header className="entry-meta">
        <time 
          className="entry-date"
          dateTime={entry.date}
        >
          {formattedDate}
        </time>
        <span 
          className="entry-mood"
          aria-label={`Mood: ${entry.mood}`}
        >
          {entry.mood}
        </span>
      </header>
      
      <div className="entry-content">
        {entry.text}
      </div>
    </article>
  );
});

EntryItem.displayName = 'EntryItem';

interface EntryListProps {
  entries: JournalEntry[];
  filterMood: string;
  onFilterChange: (mood: string) => void;
  className?: string;
}

const EntryList: React.FC<EntryListProps> = memo(({ 
  entries, 
  filterMood, 
  onFilterChange,
  className = ''
}) => {
  const filterId = useId();

  const filteredEntries = useMemo(() => {
    const filtered = filterEntriesByMood(entries, filterMood);
    return sortEntriesByDate(filtered, 'desc');
  }, [entries, filterMood]);

  const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange(e.target.value);
  }, [onFilterChange]);

  const totalEntries = entries.length;
  const filteredCount = filteredEntries.length;
  const showingFiltered = filterMood && totalEntries !== filteredCount;

  return (
    <section className={`card ${className}`} aria-labelledby="entries-heading">
      <header>
        <h2 id="entries-heading" className="card-title">
          Journal Entries
          {totalEntries > 0 && (
            <span className="entries-count" aria-label={`${totalEntries} total entries`}>
              ({totalEntries})
            </span>
          )}
        </h2>

        {totalEntries > 0 && (
          <div className="filter-controls">
            <label htmlFor={filterId} className="filter-label">
              Filter by mood:
            </label>
            
            <select
              id={filterId}
              value={filterMood}
              onChange={handleFilterChange}
              className="form-control form-select filter-select"
              aria-describedby="filter-help"
            >
              <option value="">All moods</option>
              {MOODS.map((mood) => (
                <option key={mood} value={mood}>
                  {mood}
                </option>
              ))}
            </select>
            
            <div id="filter-help" className="sr-only">
              Use this filter to show entries for a specific mood only
            </div>
          </div>
        )}
      </header>

      {showingFiltered && (
        <div className="filter-status" role="status" aria-live="polite">
          Showing {filteredCount} of {totalEntries} entries for <strong>{filterMood}</strong> mood.
          <button
            type="button"
            onClick={() => onFilterChange('')}
            className="filter-clear"
            aria-label="Clear mood filter to show all entries"
          >
            Show all entries
          </button>
        </div>
      )}

      {filteredEntries.length === 0 ? (
        <div className="empty-state">
          {totalEntries === 0 ? (
            <>
              <div className="empty-state-icon" aria-hidden="true">✍️</div>
              <h3 className="empty-state-title">No entries yet</h3>
              <p className="empty-state-description">
                Start by adding your first journal entry above
              </p>
            </>
          ) : (
            <>
              <div className="empty-state-icon" aria-hidden="true">🔍</div>
              <h3 className="empty-state-title">No entries found</h3>
              <p className="empty-state-description">
                No entries found for <strong>{filterMood}</strong> mood. Try selecting a different mood or{' '}
                <button
                  type="button"
                  onClick={() => onFilterChange('')}
                  className="inline-link"
                  aria-label="Clear filter to show all entries"
                >
                  clear the filter
                </button>
                .
              </p>
            </>
          )}
        </div>
      ) : (
        <div 
          className="entry-list"
          role="feed"
          aria-label={`Journal entries, ${filteredCount} items`}
          aria-describedby={showingFiltered ? "filter-status" : undefined}
        >
          {filteredEntries.map((entry) => (
            <EntryItem 
              key={entry.id} 
              entry={entry}
            />
          ))}
        </div>
      )}
    </section>
  );
});

EntryList.displayName = 'EntryList';

export default EntryList;