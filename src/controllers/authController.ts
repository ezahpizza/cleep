import { User } from '@supabase/supabase-js';
import { AuthService } from '@/services/authService';
import { CommandResult } from '@/services/terminalService';
import { isUserAuthenticated } from '@/utils/authUtils';

export interface AuthControllerDependencies {
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => void;
}

export class AuthController {
  private user: User | null;
  private dependencies: AuthControllerDependencies;

  constructor(user: User | null, dependencies: AuthControllerDependencies) {
    this.user = user;
    this.dependencies = dependencies;
  }

  handleLoginCommand(): CommandResult {
    if (isUserAuthenticated(this.user)) {
      return {
        success: false,
        message: `Already logged in as ${this.user?.email}`
      };
    }

    return {
      success: true,
      requiresInput: {
        type: 'email',
        prompt: 'Enter your email:'
      },
      data: { type: 'login' }
    };
  }

  handleSignupCommand(): CommandResult {
    if (isUserAuthenticated(this.user)) {
      return {
        success: false,
        message: `Already logged in as ${this.user?.email}`
      };
    }

    return {
      success: true,
      requiresInput: {
        type: 'email',
        prompt: 'Enter your email:'
      },
      data: { type: 'signup' }
    };
  }

  handleLogoutCommand(): CommandResult {
    if (!isUserAuthenticated(this.user)) {
      return {
        success: false,
        message: 'Not logged in'
      };
    }

    this.dependencies.signOut();
    return {
      success: true,
      message: 'Logged out successfully'
    };
  }

  handleWhoamiCommand(): CommandResult {
    const userInfo = AuthService.formatUserInfo(this.user);
    
    return {
      success: true,
      data: {
        userInfo,
        isAuthenticated: userInfo.isAuthenticated
      }
    };
  }

  async processEmailInput(email: string, authType: 'login' | 'signup'): Promise<CommandResult> {
    if (!AuthService.validateEmail(email)) {
      return {
        success: false,
        message: 'Please enter a valid email address'
      };
    }

    return {
      success: true,
      requiresInput: {
        type: 'password',
        prompt: 'Enter your password:'
      },
      data: { type: authType, email }
    };
  }

  async processPasswordInput(email: string, password: string, authType: 'login' | 'signup'): Promise<CommandResult> {
    const passwordValidation = AuthService.validatePassword(password);
    
    if (!passwordValidation.isValid) {
      return {
        success: false,
        message: passwordValidation.errors.join(', ')
      };
    }

    if (authType === 'login') {
      const { error } = await this.dependencies.signIn(email, password);
      if (error) {
        return {
          success: false,
          message: `Login failed: ${error.message}`
        };
      }
      return {
        success: true,
        message: 'Logged in successfully'
      };
    } else {
      const { error } = await this.dependencies.signUp(email, password);
      if (error) {
        return {
          success: false,
          message: `Signup failed: ${error.message}`
        };
      }
      return {
        success: true,
        message: 'Signup successful! Please wait a few moments while we send a confirmation email to your inbox. Check your email and click the confirmation link to complete your registration.'
      };
    }
  }
}
