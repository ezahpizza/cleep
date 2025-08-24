import { useEffect, useRef, useState, useCallback } from "react";
import { Note, CreateNoteData } from "@/types/note";
import { User } from "@supabase/supabase-js";
import { useTerminalLogic } from "./useTerminalLogic";
import { useCommandExecutor } from "./useCommandExecutor";
import { useFormHandler } from "./useFormHandler";

interface UseTerminalProps {
  mockNotes: Note[];
  onCreateNote: (data: CreateNoteData) => void;
  onUpdateNote: (id: string, updates: Partial<Note>) => void;
  onDeleteNote: (id: string, permanent?: boolean) => void;
  onCommand?: (command: string) => void;
  initialCommand?: string;
  user?: User | null;
}

interface UseTerminalReturn {
  // UI State
  input: string;
  setInput: (input: string) => void;
  focused: boolean;
  setFocused: (focused: boolean) => void;
  selectedNote: Note | null;
  setSelectedNote: (note: Note | null) => void;
  deleteNote: { note: Note; force: boolean } | null;
  setDeleteNote: (deleteNote: { note: Note; force: boolean } | null) => void;
  
  // Refs
  containerRef: React.RefObject<HTMLDivElement>;
  inputRef: React.RefObject<HTMLInputElement>;
  
  // Terminal Logic
  terminalLogic: ReturnType<typeof useTerminalLogic>;
  
  // Event Handlers
  handleNoteClick: (note: Note) => void;
  handleConfirmDelete: (note: Note, force: boolean) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleContainerClick: () => void;
  
  // Utils
  scrollToBottom: () => void;
}

export function useTerminal({
  mockNotes,
  onCreateNote,
  onUpdateNote,
  onDeleteNote,
  onCommand,
  initialCommand,
  user: propUser
}: UseTerminalProps): UseTerminalReturn {
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastInitialCommandRef = useRef<string>("");
  
  // State
  const [input, setInput] = useState(initialCommand || "");
  const [focused, setFocused] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [deleteNote, setDeleteNote] = useState<{ note: Note; force: boolean } | null>(null);

  // Note interaction handlers
  const handleNoteClick = useCallback((note: Note) => {
    setSelectedNote(note);
  }, []);

  const handleConfirmDelete = useCallback((note: Note, force: boolean) => {
    setDeleteNote({ note, force });
  }, []);

  // Initialize terminal logic
  const terminalLogic = useTerminalLogic({
    notes: mockNotes,
    onCreateNote,
    onUpdateNote,
    onDeleteNote,
    onOpenNote: handleNoteClick,
    onConfirmDelete: handleConfirmDelete,
    user: propUser
  });

  // Initialize command executor
  const { executeCommand } = useCommandExecutor({
    notes: terminalLogic.notes,
    user: terminalLogic.user,
    notesControllerDeps: terminalLogic.notesControllerDeps,
    authControllerDeps: terminalLogic.authControllerDeps,
    addOutput: terminalLogic.addOutput,
    currentDirectory: terminalLogic.currentDirectory,
    setCurrentDirectory: terminalLogic.setCurrentDirectory,
    setInputMode: terminalLogic.setInputMode,
    setInput,
    handleNoteClick,
    clearHistory: terminalLogic.clearHistory
  });

  // Initialize form handler
  const { handleSubmit: processFormSubmit } = useFormHandler({
    notes: terminalLogic.notes,
    user: terminalLogic.user,
    notesControllerDeps: terminalLogic.notesControllerDeps,
    authControllerDeps: terminalLogic.authControllerDeps,
    inputMode: terminalLogic.inputMode,
    setInputMode: terminalLogic.setInputMode,
    currentDirectory: terminalLogic.currentDirectory,
    addOutput: terminalLogic.addOutput,
    addNotification: terminalLogic.addNotification,
    executeCommand
  });

  // Utility functions
  const scrollToBottom = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, []);

  // Event handlers
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    await processFormSubmit(input);
    setInput("");
    setTimeout(() => {
      scrollToBottom();
    }, 0);
  }, [input, processFormSubmit, scrollToBottom]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    scrollToBottom();
  }, [scrollToBottom]);

  const handleContainerClick = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (initialCommand && initialCommand !== lastInitialCommandRef.current) {
      lastInitialCommandRef.current = initialCommand;
      setInput(initialCommand);
      
      // Auto-execute command if it's not "cr" command
      if (!initialCommand.trim().startsWith("cr")) {
        setTimeout(async () => {
          await processFormSubmit(initialCommand);
          setInput("");
        }, 100);
      }
    }
  }, [initialCommand, processFormSubmit]);

  // Handle external commands
  useEffect(() => {
    const handleTerminalCommand = (event: CustomEvent) => {
      executeCommand(event.detail);
    };
    
    window.addEventListener('terminal-command', handleTerminalCommand as EventListener);
    return () => window.removeEventListener('terminal-command', handleTerminalCommand as EventListener);
  }, [executeCommand]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [terminalLogic.history, scrollToBottom]);

  // Cleanup focus on unmount
  useEffect(() => {
    return () => setFocused(false);
  }, []);

  return {
    // UI State
    input,
    setInput,
    focused,
    setFocused,
    selectedNote,
    setSelectedNote,
    deleteNote,
    setDeleteNote,
    
    // Refs
    containerRef,
    inputRef,
    
    // Terminal Logic
    terminalLogic,
    
    // Event Handlers
    handleNoteClick,
    handleConfirmDelete,
    handleSubmit,
    handleChange,
    handleContainerClick,
    
    // Utils
    scrollToBottom
  };
}
