import { useState, useEffect, useCallback, useRef } from 'react';
import type { JournalEntry, MoodType, AppState, FormState } from './types';
import { storage, STORAGE_KEY, validateEntry, generateEntryId, getCurrentDate, getCurrentTimestamp, announceToScreenReader } from './utils';

// Hook for managing journal entries with localStorage persistence
export const useJournalEntries = () => {
  const [state, setState] = useState<AppState>({
    entries: [],
    isLoading: true,
    error: null
  });

  // Load entries from localStorage on mount
  useEffect(() => {
    try {
      const entries = storage.get(STORAGE_KEY);
      setState({
        entries,
        isLoading: false,
        error: null
      });
    } catch (error) {
      setState({
        entries: [],
        isLoading: false,
        error: 'Failed to load journal entries'
      });
    }
  }, []);

  // Add new entry
  const addEntry = useCallback((text: string, mood: MoodType, date?: string) => {
    const validationError = validateEntry(text, mood);
    if (validationError) {
      setState(prev => ({ ...prev, error: validationError }));
      return false;
    }

    try {
      const newEntry: JournalEntry = {
        id: generateEntryId(),
        text: text.trim(),
        mood,
        date: date || getCurrentDate(),
        createdAt: getCurrentTimestamp()
      };

      setState(prev => {
        const updatedEntries = [...prev.entries, newEntry];
        storage.set(STORAGE_KEY, updatedEntries);
        announceToScreenReader(`Journal entry added for ${mood} mood`);
        
        return {
          ...prev,
          entries: updatedEntries,
          error: null
        };
      });

      return true;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to save entry'
      }));
      return false;
    }
  }, []);

  // Remove entry
  const removeEntry = useCallback((id: string) => {
    try {
      setState(prev => {
        const updatedEntries = prev.entries.filter(entry => entry.id !== id);
        storage.set(STORAGE_KEY, updatedEntries);
        announceToScreenReader('Journal entry deleted');
        
        return {
          ...prev,
          entries: updatedEntries,
          error: null
        };
      });
      return true;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to delete entry'
      }));
      return false;
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    addEntry,
    removeEntry,
    clearError
  };
};

// Hook for managing form state with validation
export const useEntryForm = (onSubmit: (text: string, mood: MoodType) => boolean) => {
  const [formState, setFormState] = useState<FormState>({
    text: '',
    mood: 'Happy',
    isSubmitting: false
  });

  const [localError, setLocalError] = useState<string | null>(null);

  const updateText = useCallback((text: string) => {
    setFormState(prev => ({ ...prev, text }));
    if (localError) setLocalError(null);
  }, [localError]);

  const updateMood = useCallback((mood: MoodType) => {
    setFormState(prev => ({ ...prev, mood }));
  }, []);

  const submitForm = useCallback(async () => {
    const { text, mood } = formState;
    
    const validationError = validateEntry(text, mood);
    if (validationError) {
      setLocalError(validationError);
      return;
    }

    setFormState(prev => ({ ...prev, isSubmitting: true }));
    setLocalError(null);

    try {
      const success = onSubmit(text, mood);
      if (success) {
        setFormState({
          text: '',
          mood: 'Happy',
          isSubmitting: false
        });
      } else {
        setFormState(prev => ({ ...prev, isSubmitting: false }));
      }
    } catch (error) {
      setFormState(prev => ({ ...prev, isSubmitting: false }));
      setLocalError(error instanceof Error ? error.message : 'Failed to submit entry');
    }
  }, [formState, onSubmit]);

  const resetForm = useCallback(() => {
    setFormState({
      text: '',
      mood: 'Happy',
      isSubmitting: false
    });
    setLocalError(null);
  }, []);

  return {
    ...formState,
    localError,
    updateText,
    updateMood,
    submitForm,
    resetForm
  };
};

// Hook for debounced value (useful for search/filter)
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Hook for managing focus trap (accessibility)
export const useFocusTrap = (isActive: boolean) => {
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    };

    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        firstFocusable.focus();
      }
    };

    document.addEventListener('keydown', handleTabKey);
    document.addEventListener('keydown', handleEscKey);

    // Focus first element when activated
    firstFocusable?.focus();

    return () => {
      document.removeEventListener('keydown', handleTabKey);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isActive]);

  return containerRef;
};

// Hook for managing local storage
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  // Get value from localStorage or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
};

// Hook for intersection observer (lazy loading, animations)
export const useIntersectionObserver = (
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          setIsIntersecting(entry.isIntersecting);
        }
      },
      {
        threshold: 0.1,
        ...options
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [ref, options]);

  return isIntersecting;
};

// Hook for managing chart instance and cleanup
export const useChart = () => {
  const chartRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const createChart = useCallback(async (config: any) => {
    if (!canvasRef.current) return;

    // Destroy existing chart to prevent memory leaks
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    try {
      // Dynamic import for Chart.js to avoid issues
      const { Chart } = await import('chart.js/auto');
      chartRef.current = new Chart(canvasRef.current, config);
    } catch (error) {
      console.error('Error creating chart:', error);
    }
  }, []);

  const updateChart = useCallback((newData: any) => {
    if (chartRef.current) {
      chartRef.current.data = newData;
      chartRef.current.update('none'); // No animation for better performance
    }
  }, []);

  const destroyChart = useCallback(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      destroyChart();
    };
  }, [destroyChart]);

  return {
    canvasRef,
    createChart,
    updateChart,
    destroyChart,
    chartInstance: chartRef.current
  };
};

// Hook for managing keyboard shortcuts
export const useKeyboardShortcuts = (shortcuts: Record<string, () => void>) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const ctrl = event.ctrlKey || event.metaKey;
      const shift = event.shiftKey;
      const alt = event.altKey;

      let shortcutKey = '';
      if (ctrl) shortcutKey += 'ctrl+';
      if (shift) shortcutKey += 'shift+';
      if (alt) shortcutKey += 'alt+';
      shortcutKey += key;

      const handler = shortcuts[shortcutKey];
      if (handler) {
        event.preventDefault();
        handler();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};

// Hook for managing performance monitoring
export const usePerformanceMonitor = () => {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(Date.now());

  useEffect(() => {
    renderCount.current += 1;
    const now = Date.now();
    const timeSinceLastRender = now - lastRenderTime.current;
    lastRenderTime.current = now;

    // Only log in development mode
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      console.log(`Render #${renderCount.current}, Time since last: ${timeSinceLastRender}ms`);
    }
  });

  const getStats = useCallback(() => ({
    renderCount: renderCount.current,
    lastRenderTime: lastRenderTime.current
  }), []);

  return { getStats };
};