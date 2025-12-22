/**
 * SearchBar Component Tests following FULLSPEC Protocol
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from '../../src/components/SearchBar';

describe('SearchBar', () => {
  it('renders with placeholder text', () => {
    render(<SearchBar onSearch={() => {}} placeholder="Search users..." />);
    
    const input = screen.getByRole('searchbox');
    expect(input).toHaveAttribute('placeholder', 'Search users...');
  });

  it('calls onSearch with debounced input', async () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} debounceMs={100} />);
    
    const input = screen.getByRole('searchbox');
    await userEvent.type(input, 'test query');
    
    // Should not call immediately
    expect(onSearch).not.toHaveBeenCalled();
    
    // Should call after debounce delay
    await waitFor(() => {
      expect(onSearch).toHaveBeenCalledWith('test query');
    }, { timeout: 200 });
  });

  it('shows clear button when input has value', async () => {
    render(<SearchBar onSearch={() => {}} />);
    
    const input = screen.getByRole('searchbox');
    await userEvent.type(input, 'test');
    
    const clearButton = screen.getByRole('button', { name: /clear search/i });
    expect(clearButton).toBeInTheDocument();
  });

  it('clears input when clear button is clicked', async () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);
    
    const input = screen.getByRole('searchbox') as HTMLInputElement;
    await userEvent.type(input, 'test');
    
    const clearButton = screen.getByRole('button', { name: /clear search/i });
    await userEvent.click(clearButton);
    
    expect(input.value).toBe('');
    expect(onSearch).toHaveBeenCalledWith('');
  });

  it('shows status message when searching', async () => {
    render(<SearchBar onSearch={() => {}} />);
    
    const input = screen.getByRole('searchbox');
    await userEvent.type(input, 'test');
    
    expect(screen.getByText(/searching for "test"/i)).toBeInTheDocument();
  });

  it('has proper ARIA attributes for accessibility', () => {
    render(<SearchBar onSearch={() => {}} placeholder="Search" />);
    
    const searchContainer = screen.getByRole('search');
    expect(searchContainer).toBeInTheDocument();
    
    const input = screen.getByRole('searchbox');
    expect(input).toHaveAttribute('aria-label', 'Search');
  });

  it('trims whitespace from query', async () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} debounceMs={50} />);
    
    const input = screen.getByRole('searchbox');
    await userEvent.type(input, '  test query  ');
    
    await waitFor(() => {
      expect(onSearch).toHaveBeenCalledWith('test query');
    }, { timeout: 100 });
  });
});
