import { useCallback } from 'react';
import { Note, CreateNoteData } from '@/types/note';
import { User } from '@supabase/supabase-js';
import { NotesController, NotesControllerDependencies } from '@/controllers/notesController';
import { AuthController, AuthControllerDependencies } from '@/controllers/authController';

type InputMode = 
  | { type: 'command' }
  | { type: 'auth'; step: 'email' | 'password'; authType: 'login' | 'signup'; data: Partial<{email: string; password: string}> }
  | { type: 'create'; step: 'tag' | 'content'; data: Partial<CreateNoteData> }
  | { type: 'modify'; data: { note: Note; originalContent: string } };

interface UseFormHandlerProps {
  notes: Note[];
  user: User | null;
  notesControllerDeps: NotesControllerDependencies;
  authControllerDeps: AuthControllerDependencies;
  inputMode: InputMode;
  setInputMode: (mode: InputMode) => void;
  currentDirectory: string;
  addOutput: (content: React.ReactNode, type?: string) => void;
  addNotification: (notification: { type: 'success' | 'error' | 'info' | 'warning'; message: string }) => void;
  executeCommand: (input: string) => void;
}

export function useFormHandler({
  notes,
  user,
  notesControllerDeps,
  authControllerDeps,
  inputMode,
  setInputMode,
  currentDirectory,
  addOutput,
  addNotification,
  executeCommand
}: UseFormHandlerProps) {

  const handleSubmit = useCallback(async (input: string) => {
    const notesController = new NotesController(notes, user, notesControllerDeps);
    const authController = new AuthController(user, authControllerDeps);
    
    if (inputMode.type === 'auth') {
      if (inputMode.step === 'email') {

        addOutput(
          <div className="flex items-center gap-2 mb-2">
            <span className="terminal-prompt">CLeep:{currentDirectory}$</span>
            <span className="terminal-text">Email: {input}</span>
          </div>
        );
        
        const result = await authController.processEmailInput(input, inputMode.authType);
        if (result.success && result.requiresInput) {
          setInputMode({
            type: 'auth',
            step: 'password',
            authType: inputMode.authType,
            data: { ...inputMode.data, email: input }
          });
          addOutput(<div className="terminal-info">{result.requiresInput.prompt}</div>, 'info');
        } else if (!result.success) {
          addOutput(<div className="terminal-error">{result.message}</div>, 'error');
          setInputMode({ type: 'command' });
        }
      } else if (inputMode.step === 'password') {
        const result = await authController.processPasswordInput(
          inputMode.data.email!, 
          input, 
          inputMode.authType
        );
        
        if (result.success) {
          if (inputMode.authType === 'signup') {
            addOutput(<div className="terminal-success">{result.message}</div>, 'success');
            addNotification({ 
              type: "success", 
              message: "Account created! Check your email for confirmation." 
            });
          } else {
            addOutput(<div className="terminal-success">{result.message}</div>, 'success');
            addNotification({ type: "success", message: "Logged in successfully" });
          }
        } else {
          addOutput(<div className="terminal-error">{result.message}</div>, 'error');
        }
        setInputMode({ type: 'command' });
      }
    } else if (inputMode.type === 'create') {
      if (inputMode.step === 'tag') {
        setInputMode({
          type: 'create',
          step: 'content',
          data: { ...inputMode.data, tag: input }
        });
        addOutput(<div className="terminal-info">Enter content for note:</div>, 'info');
      } else if (inputMode.step === 'content') {
        const result = notesController.finishCreateNote({
          title: inputMode.data.title!,
          tag: inputMode.data.tag!,
          content: input
        });
        addOutput(<div className="terminal-success">{result.message}</div>, 'success');
        setInputMode({ type: 'command' });
      }
    } else if (inputMode.type === 'modify') {
      const result = notesController.finishModifyNote({
        note: inputMode.data.note,
        content: input
      });
      addOutput(<div className="terminal-success">{result.message}</div>, 'success');
      setInputMode({ type: 'command' });
    } else {
      executeCommand(input);
    }
  }, [notes, user, notesControllerDeps, authControllerDeps, inputMode, setInputMode, currentDirectory, addOutput, addNotification, executeCommand]);

  return { handleSubmit };
}
