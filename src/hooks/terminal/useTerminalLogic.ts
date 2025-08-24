import { useState, useCallback, useMemo } from 'react';
import { Note, TerminalOutput, CreateNoteData } from '@/types/note';
import { NotesControllerDependencies } from '@/controllers/notesController';
import { AuthControllerDependencies } from '@/controllers/authController';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { User } from '@supabase/supabase-js';

type InputMode = 
  | { type: 'command' }
  | { type: 'auth'; step: 'email' | 'password'; authType: 'login' | 'signup'; data: Partial<{email: string; password: string}> }
  | { type: 'create'; step: 'tag' | 'content'; data: Partial<CreateNoteData> }
  | { type: 'modify'; data: { note: Note; originalContent: string } };

interface UseTerminalLogicProps {
  notes: Note[];
  onCreateNote: (data: CreateNoteData) => void;
  onUpdateNote: (id: string, updates: Partial<Note>) => void;
  onDeleteNote: (id: string, permanent?: boolean) => void;
  onOpenNote: (note: Note) => void;
  onConfirmDelete: (note: Note, force: boolean) => void;
  user?: User | null;
}

export function useTerminalLogic({
  notes,
  onCreateNote,
  onUpdateNote,
  onDeleteNote,
  onOpenNote,
  onConfirmDelete,
  user: propUser
}: UseTerminalLogicProps) {
  const [history, setHistory] = useState<TerminalOutput[]>([]);
  const [currentDirectory, setCurrentDirectory] = useState('/home');
  const [inputMode, setInputMode] = useState<InputMode>({ type: 'command' });
  
  const authState = useAuth();
  const { addNotification } = useNotifications();

  const user = propUser !== undefined ? propUser : authState.user;
  const { signIn, signUp, signOut } = authState;

  const addOutput = useCallback((content: React.ReactNode, type: TerminalOutput['type'] = 'output') => {
    setHistory(prev => [...prev, {
      content,
      type,
      timestamp: new Date().toISOString()
    }]);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const notesControllerDeps = useMemo((): NotesControllerDependencies => ({
    onCreateNote,
    onUpdateNote,
    onDeleteNote,
    onOpenNote,
    onConfirmDelete
  }), [onCreateNote, onUpdateNote, onDeleteNote, onOpenNote, onConfirmDelete]);

  const authControllerDeps = useMemo((): AuthControllerDependencies => ({
    signIn,
    signUp,
    signOut
  }), [signIn, signUp, signOut]);

  return {
    // State
    history,
    currentDirectory,
    setCurrentDirectory,
    inputMode,
    setInputMode,
    user,
    addNotification,
    
    // Actions
    addOutput,
    clearHistory,
    
    // Dependencies
    notesControllerDeps,
    authControllerDeps,
    notes
  };
}
