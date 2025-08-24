import { useCallback } from 'react';
import { Note, TerminalOutput, CreateNoteData } from '@/types/note';
import { User } from '@supabase/supabase-js';
import { NotesController, NotesControllerDependencies } from '@/controllers/notesController';
import { AuthController, AuthControllerDependencies } from '@/controllers/authController';
import { TerminalService } from '@/services/terminalService';
import { HelpDisplay } from '@/components/ui/HelpDisplay';
import { NotesList } from '@/components/ui/NotesList';
import { UserInfoDisplay } from '@/components/ui/UserInfoDisplay';

type InputMode = 
  | { type: 'command' }
  | { type: 'auth'; step: 'email' | 'password'; authType: 'login' | 'signup'; data: Partial<{email: string; password: string}> }
  | { type: 'create'; step: 'tag' | 'content'; data: Partial<CreateNoteData> }
  | { type: 'modify'; data: { note: Note; originalContent: string } };

interface UseCommandExecutorProps {
  notes: Note[];
  user: User | null;
  notesControllerDeps: NotesControllerDependencies;
  authControllerDeps: AuthControllerDependencies;
  addOutput: (content: React.ReactNode, type?: TerminalOutput['type']) => void;
  currentDirectory: string;
  setCurrentDirectory: (dir: string) => void;
  setInputMode: (mode: InputMode) => void;
  setInput: (input: string) => void;
  handleNoteClick: (note: Note) => void;
  clearHistory: () => void;
}

export function useCommandExecutor({
  notes,
  user,
  notesControllerDeps,
  authControllerDeps,
  addOutput,
  currentDirectory,
  setCurrentDirectory,
  setInputMode,
  setInput,
  handleNoteClick,
  clearHistory
}: UseCommandExecutorProps) {
  
  const executeCommand = useCallback((input: string) => {
    const notesController = new NotesController(notes, user, notesControllerDeps);
    const authController = new AuthController(user, authControllerDeps);
    
    const { command, args } = TerminalService.parseCommand(input);
    
    addOutput(
      <div className="flex items-center gap-2 mb-2">
        <span className="terminal-prompt">CLeep:{currentDirectory}$</span>
        <span className="terminal-text">{input}</span>
      </div>
    );

    let result;

    switch (command) {
      case 'help': {
        addOutput(<HelpDisplay />, 'info');
        break;
      }

      case 'ls': {
        result = notesController.handleListCommand(args);
        if (result.success && result.data) {
          setCurrentDirectory(result.data.directory);
          addOutput(
            <NotesList 
              notes={result.data.notes} 
              directory={result.data.directory}
              onNoteClick={handleNoteClick}
            />
          );
        }
        break;
      }

      case 'cr': {
        result = notesController.handleCreateCommand(args);
        if (result.success && result.requiresInput) {
          setInputMode({ 
            type: 'create', 
            step: 'tag', 
            data: { title: result.data.title } 
          });
          addOutput(<div className="terminal-info">{result.requiresInput.prompt}</div>, 'info');
        } else if (!result.success) {
          addOutput(<div className="terminal-error">{result.message}</div>, 'error');
        }
        break;
      }

      case 'op': {
        result = notesController.handleOpenCommand(args);
        if (result.success) {
          addOutput(<div className="terminal-success">{result.message}</div>, 'success');
        } else {
          addOutput(<div className="terminal-error">{result.message}</div>, 'error');
        }
        break;
      }

      case 'mod': {
        result = notesController.handleModifyCommand(args);
        if (result.success && result.requiresInput && result.data?.note) {
          setInputMode({ 
            type: 'modify', 
            data: { 
              note: result.data.note,
              originalContent: result.data.note.content
            }
          });
          addOutput(<div className="terminal-info">{result.requiresInput.prompt}</div>, 'info');
          setInput(result.data.note.content);
        } else if (!result.success) {
          addOutput(<div className="terminal-error">{result.message}</div>, 'error');
        }
        break;
      }

      case 'del': {
        result = notesController.handleDeleteCommand(args);
        if (result.success) {
          addOutput(<div className="terminal-warning">{result.message}</div>, 'warning');
        } else {
          addOutput(<div className="terminal-error">{result.message}</div>, 'error');
        }
        break;
      }

      case 'archive': {
        result = notesController.handleArchiveCommand(args);
        if (result.success) {
          addOutput(<div className="terminal-success">{result.message}</div>, 'success');
        } else {
          addOutput(<div className="terminal-error">{result.message}</div>, 'error');
        }
        break;
      }

      case 'login': {
        result = authController.handleLoginCommand();
        if (result.success && result.requiresInput) {
          setInputMode({ 
            type: 'auth', 
            step: 'email', 
            authType: 'login', 
            data: {} 
          });
          addOutput(<div className="terminal-info">{result.requiresInput.prompt}</div>, 'info');
        } else if (!result.success) {
          addOutput(<div className="terminal-warning">{result.message}</div>, 'warning');
        }
        break;
      }

      case 'signup': {
        result = authController.handleSignupCommand();
        if (result.success && result.requiresInput) {
          setInputMode({ 
            type: 'auth', 
            step: 'email', 
            authType: 'signup', 
            data: {} 
          });
          addOutput(<div className="terminal-info">{result.requiresInput.prompt}</div>, 'info');
        } else if (!result.success) {
          addOutput(<div className="terminal-warning">{result.message}</div>, 'warning');
        }
        break;
      }

      case 'logout': {
        result = authController.handleLogoutCommand();
        if (result.success) {
          addOutput(<div className="terminal-success">{result.message}</div>, 'success');
        } else {
          addOutput(<div className="terminal-error">{result.message}</div>, 'error');
        }
        break;
      }

      case 'whoami': {
        result = authController.handleWhoamiCommand();
        if (result.success && result.data) {
          addOutput(
            <UserInfoDisplay userInfo={result.data.userInfo} />,
            'info'
          );
        }
        break;
      }

      case 'clear':
      case 'cls': {
        clearHistory();
        break;
      }

      default:
        addOutput(<div className="terminal-error">Command not found: {command}. Type 'help' for available commands.</div>, 'error');
    }
  }, [notes, user, notesControllerDeps, authControllerDeps, addOutput, currentDirectory, setCurrentDirectory, setInputMode, setInput, handleNoteClick, clearHistory]);

  return { executeCommand };
}
