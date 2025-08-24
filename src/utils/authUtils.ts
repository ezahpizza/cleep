import { User } from '@supabase/supabase-js';

/**
 * Checks if a user is truly authenticated (not a mock/guest user)
 */
export function isUserAuthenticated(user: User | null): boolean {
  // If no user object, definitely not authenticated
  if (!user) return false;
  
  // If it's explicitly a guest user, not authenticated
  if (user.id === 'guest' || user.email === 'guest@goatnote') {
    return false;
  }
  
  // Must have a real user ID (UUIDs are typically 36 characters) and email
  // and be marked as authenticated by Supabase
  return !!(
    user.id && 
    user.id.length > 10 && // Real Supabase user IDs are much longer than 'guest'
    user.email && 
    user.email.includes('@') &&
    user.email !== 'guest@goatnote' &&
    user.aud === 'authenticated'
  );
}

/**
 * Gets the real authentication status consistently across the app
 */
export function getAuthStatus(user: User | null): {
  isAuthenticated: boolean;
  isGuest: boolean;
  user: User | null;
} {
  const isAuthenticated = isUserAuthenticated(user);
  
  return {
    isAuthenticated,
    isGuest: !isAuthenticated,
    user: isAuthenticated ? user : null
  };
}
