/**
 * UserProfile Component Tests following FULLSPEC Protocol
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserProfile } from '../../src/components/UserProfile';
import { User } from '../../src/types/user';

const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  createdAt: '2024-01-01T00:00:00.000Z',
};

describe('UserProfile', () => {
  it('renders user information correctly', () => {
    render(<UserProfile user={mockUser} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText(/Member since/)).toBeInTheDocument();
  });

  it('shows edit form when Edit Profile is clicked', async () => {
    render(<UserProfile user={mockUser} />);
    
    const editButton = screen.getByRole('button', { name: /edit profile/i });
    await userEvent.click(editButton);
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('validates name input', async () => {
    render(<UserProfile user={mockUser} />);
    
    await userEvent.click(screen.getByRole('button', { name: /edit profile/i }));
    
    const nameInput = screen.getByLabelText(/name/i);
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'A');
    
    const saveButton = screen.getByRole('button', { name: /save changes/i });
    await userEvent.click(saveButton);
    
    expect(await screen.findByText(/name must be at least 2 characters/i)).toBeInTheDocument();
  });

  it('validates email input', async () => {
    render(<UserProfile user={mockUser} />);
    
    await userEvent.click(screen.getByRole('button', { name: /edit profile/i }));
    
    const emailInput = screen.getByLabelText(/email/i);
    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, 'invalid-email');
    
    const saveButton = screen.getByRole('button', { name: /save changes/i });
    await userEvent.click(saveButton);
    
    expect(await screen.findByText(/invalid email format/i)).toBeInTheDocument();
  });

  it('calls onUpdate with valid data', async () => {
    const onUpdate = vi.fn().mockResolvedValue(undefined);
    render(<UserProfile user={mockUser} onUpdate={onUpdate} />);
    
    await userEvent.click(screen.getByRole('button', { name: /edit profile/i }));
    
    const nameInput = screen.getByLabelText(/name/i);
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Jane Doe');
    
    const saveButton = screen.getByRole('button', { name: /save changes/i });
    await userEvent.click(saveButton);
    
    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalledWith({
        name: 'Jane Doe',
        email: 'john@example.com',
      });
    });
  });

  it('cancels editing and resets form', async () => {
    render(<UserProfile user={mockUser} />);
    
    await userEvent.click(screen.getByRole('button', { name: /edit profile/i }));
    
    const nameInput = screen.getByLabelText(/name/i);
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Changed Name');
    
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await userEvent.click(cancelButton);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByLabelText(/name/i)).not.toBeInTheDocument();
  });

  it('disables submit button while submitting', async () => {
    const onUpdate = vi.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
    render(<UserProfile user={mockUser} onUpdate={onUpdate} />);
    
    await userEvent.click(screen.getByRole('button', { name: /edit profile/i }));
    
    const saveButton = screen.getByRole('button', { name: /save changes/i });
    await userEvent.click(saveButton);
    
    expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled();
  });
});
