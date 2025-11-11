import React, { memo, useCallback } from 'react';
import { MOODS, MoodType } from '../types';

interface JournalFormProps {
  text: string;
  mood: MoodType;
  onTextChange: (text: string) => void;
  onMoodChange: (mood: MoodType) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export const JournalForm: React.FC<JournalFormProps> = memo(({
  text,
  mood,
  onTextChange,
  onMoodChange,
  onSubmit,
  disabled = false
}) => {
  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onTextChange(e.target.value);
    },
    [onTextChange]
  );

  const handleMoodChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onMoodChange(e.target.value as MoodType);
    },
    [onMoodChange]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (text.trim()) {
        onSubmit();
      }
    },
    [text, onSubmit]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (text.trim()) {
          onSubmit();
        }
      }
    },
    [text, onSubmit]
  );

  return (
    <form className="journal-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="journal-text" className="form-label">
          How are you feeling today? Share your thoughts...
        </label>
        <textarea
          id="journal-text"
          className="journal-textarea"
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder="Write something about your day... (Ctrl+Enter to save)"
          disabled={disabled}
          rows={4}
          aria-describedby="journal-help"
        />
        <div id="journal-help" className="form-help">
          Tip: Use Ctrl+Enter (Cmd+Enter on Mac) to quickly save your entry
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="mood-select" className="form-label">
          Current mood
        </label>
        <select
          id="mood-select"
          className="mood-select"
          value={mood}
          onChange={handleMoodChange}
          disabled={disabled}
        >
          {MOODS.map((moodOption) => (
            <option key={moodOption} value={moodOption}>
              {moodOption}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="submit-button"
        disabled={disabled || !text.trim()}
      >
        Save Entry
      </button>
    </form>
  );
});