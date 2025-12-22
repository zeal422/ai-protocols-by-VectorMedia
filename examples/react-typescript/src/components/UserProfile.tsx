/**
 * User Profile Component following moreFRONTend Protocol
 * Accessible, performant, with proper TypeScript types
 */
import { useState } from 'react';
import { User } from '../types/user';
import { validateEmail } from '../utils/validation';

interface UserProfileProps {
  user: User;
  onUpdate?: (updates: Partial<User>) => Promise<void>;
}

export function UserProfile({ user, onUpdate }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: user.name, email: user.email });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation (SECAUDIT protocol)
    const newErrors: Record<string, string> = {};
    
    if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onUpdate?.(formData);
      setIsEditing(false);
      setErrors({});
    } catch (error) {
      setErrors({ submit: 'Failed to update profile. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isEditing) {
    return (
      <div className="user-profile" style={styles.container}>
        <div style={styles.avatar}>
          <span style={styles.avatarText}>
            {user.name.charAt(0).toUpperCase()}
          </span>
        </div>
        
        <div style={styles.info}>
          <h3 style={styles.name}>{user.name}</h3>
          <p style={styles.email}>{user.email}</p>
          <p style={styles.meta}>
            Member since {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>

        <button
          onClick={() => setIsEditing(true)}
          style={styles.button}
          aria-label="Edit profile"
        >
          Edit Profile
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={styles.container} noValidate>
      <div style={styles.formGroup}>
        <label htmlFor="name" style={styles.label}>
          Name
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          style={{
            ...styles.input,
            ...(errors.name ? styles.inputError : {}),
          }}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <p id="name-error" style={styles.error} role="alert">
            {errors.name}
          </p>
        )}
      </div>

      <div style={styles.formGroup}>
        <label htmlFor="email" style={styles.label}>
          Email
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          style={{
            ...styles.input,
            ...(errors.email ? styles.inputError : {}),
          }}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p id="email-error" style={styles.error} role="alert">
            {errors.email}
          </p>
        )}
      </div>

      {errors.submit && (
        <p style={styles.error} role="alert">
          {errors.submit}
        </p>
      )}

      <div style={styles.actions}>
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            ...styles.button,
            ...(isSubmitting ? styles.buttonDisabled : {}),
          }}
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={() => {
            setIsEditing(false);
            setFormData({ name: user.name, email: user.email });
            setErrors({});
          }}
          style={styles.buttonSecondary}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// Inline styles for demonstration (in production, use CSS modules or styled-components)
const styles = {
  container: {
    padding: '1.5rem',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    maxWidth: '600px',
  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: '#3b82f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
  },
  avatarText: {
    color: 'white',
    fontSize: '2rem',
    fontWeight: 'bold',
  },
  info: {
    marginBottom: '1rem',
  },
  name: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
  },
  email: {
    color: '#6b7280',
    marginBottom: '0.25rem',
  },
  meta: {
    fontSize: '0.875rem',
    color: '#9ca3af',
  },
  formGroup: {
    marginBottom: '1rem',
  },
  label: {
    display: 'block',
    fontWeight: '500',
    marginBottom: '0.5rem',
  },
  input: {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  error: {
    color: '#ef4444',
    fontSize: '0.875rem',
    marginTop: '0.25rem',
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '1.5rem',
  },
  button: {
    padding: '0.5rem 1rem',
    background: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  buttonSecondary: {
    padding: '0.5rem 1rem',
    background: 'transparent',
    color: '#6b7280',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
  },
};
