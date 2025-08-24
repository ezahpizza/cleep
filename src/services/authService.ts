import { User } from '@supabase/supabase-js';

export interface AuthState {
  user: User | null;
  loading: boolean;
}

export interface AuthResult {
  success: boolean;
  error?: string;
}

export class AuthService {
  static formatUserInfo(user: User | null): {
    email: string;
    id: string;
    created_at: string;
    isAuthenticated: boolean;
  } {
    if (!user) {
      return {
        email: 'guest@goatnote',
        id: 'guest',
        created_at: new Date().toISOString(),
        isAuthenticated: false
      };
    }

    return {
      email: user.email || 'Unknown',
      id: user.id,
      created_at: user.created_at || new Date().toISOString(),
      isAuthenticated: true
    };
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePassword(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    
    if (password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
