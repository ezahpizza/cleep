import { Note, CreateNoteData } from '@/types/note';

export type InputMode = 
  | { type: 'command' }
  | { type: 'auth'; step: 'email' | 'password'; authType: 'login' | 'signup'; data: Partial<{email: string; password: string}> }
  | { type: 'create'; step: 'tag' | 'content'; data: Partial<CreateNoteData> }
  | { type: 'modify'; data: { note: Note; originalContent: string } };
