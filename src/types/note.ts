export type NoteStatus = 'active' | 'archived' | 'deleted';

export interface Note {
  id: string;
  user_id?: string;
  title: string;
  tag: string;
  content: string;
  status: NoteStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateNoteData {
  title: string;
  tag: string;
  content: string;
}

export interface TerminalCommand {
  command: string;
  args: string[];
  timestamp: string;
}

export interface TerminalOutput {
  content: React.ReactNode;
  type: 'success' | 'error' | 'info' | 'warning' | 'output';
  timestamp: string;
}