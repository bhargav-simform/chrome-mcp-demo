import React, { memo, useCallback, useRef, useId } from 'react';
import type { MoodType } from './types';
import { useEntryForm } from './hooks';
import { MOODS } from './utils';

interface EntryFormProps {
  onSubmit: (text: string, mood: MoodType) => boolean;
  isSubmitting?: boolean;
  className?: string;
}

const EntryForm: React.FC<EntryFormProps> = memo(({ 
  onSubmit, 
  isSubmitting: externalSubmitting = false,
  className = ''
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const textareaId = useId();
  const moodSelectId = useId();
  const formId = useId();

  const {
    text,
    mood,
    isSubmitting: internalSubmitting,
    localError,
    updateText,
    updateMood,
    submitForm,
    resetForm
  } = useEntryForm(onSubmit);

  const isSubmitting = externalSubmitting || internalSubmitting;

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    submitForm();
  }, [submitForm]);

  const handleTextareaKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      submitForm();
    }
  }, [submitForm]);

  const handleReset = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    resetForm();
    textareaRef.current?.focus();
  }, [resetForm]);

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateText(e.target.value);
  }, [updateText]);

  const handleMoodChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    updateMood(e.target.value as MoodType);
  }, [updateMood]);

  const characterCount = text.length;
  const maxCharacters = 2000;
  const isNearLimit = characterCount > maxCharacters * 0.8;
  const isOverLimit = characterCount > maxCharacters;

  return (
    <div className={`card ${className}`}>
      <h2 className="card-title">Add Journal Entry</h2>
      
      <form 
        ref={formRef}
        id={formId}
        onSubmit={handleSubmit}
        onReset={handleReset}
        className="entry-form"
        noValidate
      >
        <div className="form-group">
          <label htmlFor={textareaId} className="form-label">
            How was your day? *
            <span className="sr-only">Required field</span>
          </label>
          
          <textarea
            ref={textareaRef}
            id={textareaId}
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleTextareaKeyDown}
            placeholder="Share your thoughts, feelings, or experiences from today..."
            className={`form-control form-textarea ${isOverLimit ? 'error' : ''}`}
            disabled={isSubmitting}
            maxLength={maxCharacters + 100} // Allow slight overage for better UX
            rows={4}
            aria-describedby={`${textareaId}-help ${textareaId}-count`}
            aria-invalid={localError ? 'true' : 'false'}
            required
          />
          
          <div className="form-help">
            <div 
              id={`${textareaId}-help`}
              className="form-description"
            >
              Tip: Use Ctrl+Enter (Cmd+Enter on Mac) to quickly submit your entry
            </div>
            
            <div 
              id={`${textareaId}-count`}
              className={`character-count ${isNearLimit ? 'warning' : ''} ${isOverLimit ? 'error' : ''}`}
              aria-live="polite"
            >
              {characterCount}/{maxCharacters} characters
            </div>
          </div>
        </div>

        <div className="entry-form-controls">
          <div className="form-group">
            <label htmlFor={moodSelectId} className="form-label">
              Current mood *
              <span className="sr-only">Required field</span>
            </label>
            
            <select
              id={moodSelectId}
              value={mood}
              onChange={handleMoodChange}
              className="form-control form-select"
              disabled={isSubmitting}
              aria-describedby={`${moodSelectId}-help`}
              required
            >
              {MOODS.map((moodOption) => (
                <option key={moodOption} value={moodOption}>
                  {moodOption}
                </option>
              ))}
            </select>
            
            <div id={`${moodSelectId}-help`} className="form-description">
              Choose the mood that best represents how you're feeling
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="button button-primary"
              disabled={isSubmitting || !text.trim() || isOverLimit}
              aria-describedby="submit-help"
            >
              {isSubmitting ? (
                <>
                  <span className="sr-only">Saving entry...</span>
                  <span aria-hidden="true">Saving...</span>
                </>
              ) : (
                'Save Entry'
              )}
            </button>
            
            <button
              type="reset"
              className="button button-secondary"
              disabled={isSubmitting}
              aria-label="Clear form"
            >
              Clear
            </button>
          </div>
        </div>

        <div id="submit-help" className="form-description">
          Your entry will be saved locally in your browser
        </div>
      </form>

      {localError && (
        <div 
          className="error-message"
          role="alert"
          aria-live="assertive"
        >
          <strong>Error:</strong> {localError}
        </div>
      )}
    </div>
  );
});

EntryForm.displayName = 'EntryForm';

export default EntryForm;