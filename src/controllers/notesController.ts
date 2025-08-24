import { Note, CreateNoteData } from '@/types/note';
import { NotesService } from '@/services/notesService';
import { TerminalService, CommandResult } from '@/services/terminalService';
import { User } from '@supabase/supabase-js';

export interface NotesControllerDependencies {
  onCreateNote: (data: CreateNoteData) => void;
  onUpdateNote: (id: string, updates: Partial<Note>) => void;
  onDeleteNote: (id: string, permanent?: boolean) => void;
  onOpenNote: (note: Note) => void;
  onConfirmDelete: (note: Note, force: boolean) => void;
}

export class NotesController {
  private notes: Note[];
  private user: User | null;
  private dependencies: NotesControllerDependencies;

  constructor(notes: Note[], user: User | null, dependencies: NotesControllerDependencies) {
    this.notes = notes;
    this.user = user;
    this.dependencies = dependencies;
  }

  handleCreateCommand(args: string[]): CommandResult {
    if (args.length === 0) {
      return {
        success: false,
        message: 'Usage: cr "title"'
      };
    }

    const title = TerminalService.extractQuotedString(args);
    const validation = NotesService.validateNoteData(title);
    
    if (!validation.isValid) {
      return {
        success: false,
        message: validation.errors.join(', ')
      };
    }

    return {
      success: true,
      requiresInput: {
        type: 'tag',
        prompt: `Enter tag for "${title}":`
      },
      data: { title }
    };
  }

  handleOpenCommand(args: string[]): CommandResult {
    if (args.length === 0) {
      return {
        success: false,
        message: 'Usage: op <title>'
      };
    }

    const title = args.join(' ');
    const note = NotesService.findNoteByTitle(this.notes, title);

    if (!note) {
      return {
        success: false,
        message: `Note not found: ${title}`
      };
    }

    this.dependencies.onOpenNote(note);
    return {
      success: true,
      message: `Opening: ${note.title}`
    };
  }

  handleModifyCommand(args: string[]): CommandResult {
    if (args.length === 0) {
      return {
        success: false,
        message: 'Usage: mod <title>'
      };
    }

    const title = args.join(' ');
    const note = NotesService.findNoteByTitle(this.notes, title, this.user?.id);

    if (!note) {
      return {
        success: false,
        message: `Note not found: ${title}`
      };
    }

    return {
      success: true,
      requiresInput: {
        type: 'content',
        prompt: `Current content: ${note.content}\nEnter new content:`
      },
      data: { note }
    };
  }

  handleDeleteCommand(args: string[]): CommandResult {
    const isForce = args.length > 0 && TerminalService.isForceFlag(args[0]);
    const titleArgs = isForce ? args.slice(1) : args;

    if (titleArgs.length === 0) {
      return {
        success: false,
        message: 'Usage: del [-f] <title>'
      };
    }

    const title = titleArgs.join(' ');
    const note = NotesService.findNoteByTitle(this.notes, title, this.user?.id);

    if (!note) {
      return {
        success: false,
        message: `Note not found: ${title}`
      };
    }

    this.dependencies.onConfirmDelete(note, isForce);
    return {
      success: true,
      message: `Confirm deletion of: ${note.title}`
    };
  }

  handleArchiveCommand(args: string[]): CommandResult {
    if (args.length === 0) {
      return {
        success: false,
        message: 'Usage: archive <title>'
      };
    }

    const title = args.join(' ');
    const note = NotesService.findNoteByTitle(this.notes, title, this.user?.id);

    if (!note) {
      return {
        success: false,
        message: `Note not found: ${title}`
      };
    }

    if (note.status === 'archived') {
      return {
        success: false,
        message: `Note "${note.title}" is already archived`
      };
    }

    this.dependencies.onUpdateNote(note.id, { status: 'archived' });
    return {
      success: true,
      message: `Note archived: ${note.title}`
    };
  }

  handleListCommand(args: string[]): CommandResult {
    const directory = args[0] || '/home';
    const formattedPath = TerminalService.formatPath(directory);
    const status = TerminalService.getStatusFromDirectory(formattedPath);
    const filteredNotes = NotesService.filterNotesByStatus(this.notes, status);

    return {
      success: true,
      data: {
        directory: formattedPath,
        notes: filteredNotes
      }
    };
  }

  finishCreateNote(createData: { title: string; tag: string; content: string }): CommandResult {
    const noteData: CreateNoteData = {
      title: createData.title,
      tag: createData.tag,
      content: createData.content
    };

    this.dependencies.onCreateNote(noteData);
    return {
      success: true,
      message: `Note created: ${noteData.title}`
    };
  }

  finishModifyNote(modifyData: { note: Note; content: string }): CommandResult {
    this.dependencies.onUpdateNote(modifyData.note.id, { content: modifyData.content });
    return {
      success: true,
      message: `Updated: ${modifyData.note.title}`
    };
  }
}
