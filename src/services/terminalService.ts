export interface CommandResult {
  success: boolean;
  message?: string;
  data?: unknown;
  requiresInput?: {
    type: 'email' | 'password' | 'tag' | 'content';
    prompt: string;
  };
}

export interface ParsedCommand {
  command: string;
  args: string[];
}

export class TerminalService {
  static parseCommand(input: string): ParsedCommand {
    const parts = input.trim().split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);
    return { command, args };
  }

  static validateCommand(command: string, args: string[], requiredArgs: number = 0): boolean {
    return args.length >= requiredArgs;
  }

  static formatPath(directory: string): string {
    const validDirs = ['/home', '/archived', '/deleted'];
    return validDirs.includes(directory) ? directory : '/home';
  }

  static getStatusFromDirectory(directory: string): 'active' | 'archived' | 'deleted' {
    switch (directory) {
      case '/archived': return 'archived';
      case '/deleted': return 'deleted';
      default: return 'active';
    }
  }

  static extractQuotedString(args: string[]): string {
    return args.join(' ').replace(/"/g, '');
  }

  static isForceFlag(arg: string): boolean {
    return arg === '-f';
  }
}
