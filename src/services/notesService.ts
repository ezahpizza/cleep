import { Note } from '@/types/note';

export class NotesService {
  static findNoteByTitle(notes: Note[], title: string, userId?: string): Note | undefined {
    return notes.find(note => 
      note.title.toLowerCase().includes(title.toLowerCase()) && 
      (!userId || note.user_id === userId)
    );
  }

  static filterNotesByStatus(notes: Note[], status: 'active' | 'archived' | 'deleted'): Note[] {
    return notes.filter(note => note.status === status);
  }

  static formatNoteForDisplay(note: Note): {
    title: string;
    date: string;
    tag: string;
    status: string;
  } {
    return {
      title: note.title,
      date: new Date(note.created_at).toLocaleDateString(),
      tag: note.tag,
      status: note.status
    };
  }

  static validateNoteData(title: string, tag?: string, content?: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    
    if (!title || title.trim().length === 0) {
      errors.push('Title is required');
    }
    
    if (title && title.length > 100) {
      errors.push('Title must be less than 100 characters');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
