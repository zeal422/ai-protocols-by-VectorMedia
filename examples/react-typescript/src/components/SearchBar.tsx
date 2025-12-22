/**
 * Accessible SearchBar following A11YCHECK Protocol
 * Keyboard navigation, ARIA labels, debounced input
 */
import { useState, useId } from 'react';
import { useDebounce } from '../hooks/useDebounce';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export function SearchBar({ 
  onSearch, 
  placeholder = 'Search...', 
  debounceMs = 300 
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const searchId = useId();
  
  // Performance optimization: Debounce search (Performance protocol)
  useDebounce(() => {
    if (query.trim()) {
      onSearch(query.trim());
    }
  }, debounceMs, [query]);

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div style={styles.container} role="search">
      <label htmlFor={searchId} style={styles.label}>
        Search
      </label>
      
      <div style={styles.inputWrapper}>
        <input
          id={searchId}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          style={styles.input}
          aria-label={placeholder}
          autoComplete="off"
        />
        
        {query && (
          <button
            onClick={handleClear}
            style={styles.clearButton}
            aria-label="Clear search"
            type="button"
          >
            ✕
          </button>
        )}
      </div>
      
      {query && (
        <div 
          role="status" 
          aria-live="polite" 
          style={styles.status}
        >
          Searching for "{query}"
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    maxWidth: '600px',
  },
  label: {
    display: 'block',
    fontWeight: '500',
    marginBottom: '0.5rem',
  },
  inputWrapper: {
    position: 'relative' as const,
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    paddingRight: '2.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'border-color 0.2s',
  },
  clearButton: {
    position: 'absolute' as const,
    right: '0.5rem',
    background: 'transparent',
    border: 'none',
    fontSize: '1.25rem',
    cursor: 'pointer',
    color: '#6b7280',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
  },
  status: {
    marginTop: '0.5rem',
    fontSize: '0.875rem',
    color: '#6b7280',
  },
};
