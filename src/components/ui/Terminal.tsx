import { Note, CreateNoteData } from "@/types/note";
import { NoteDialog } from "../dialogs/NoteDialog";
import { DeleteConfirmDialog } from "../dialogs/DeleteConfirmDialog";
import { TerminalHeader } from "./TerminalHeader";
import { TerminalBody } from "./TerminalBody";
import { useTerminal } from "@/hooks/terminal/useTerminal";
import { useDeleteConfirmHandler } from "@/hooks/terminal/useDeleteConfirmHandler";
import { User } from "@supabase/supabase-js";

interface TerminalProps {
  mockNotes: Note[];
  onCreateNote: (data: CreateNoteData) => void;
  onUpdateNote: (id: string, updates: Partial<Note>) => void;
  onDeleteNote: (id: string, permanent?: boolean) => void;
  onCommand?: (command: string) => void;
  initialCommand?: string;
  user?: User | null;
}

export function Terminal({ 
  mockNotes, 
  onCreateNote, 
  onUpdateNote, 
  onDeleteNote, 
  onCommand,
  initialCommand,
  user: propUser
}: TerminalProps) {
  const terminal = useTerminal({
    mockNotes,
    onCreateNote,
    onUpdateNote,
    onDeleteNote,
    onCommand,
    initialCommand,
    user: propUser
  });

  const deleteConfirmHandler = useDeleteConfirmHandler({
    deleteNote: terminal.deleteNote,
    onDeleteNote,
    addOutput: terminal.terminalLogic.addOutput,
    onClose: () => terminal.setDeleteNote(null)
  });

  return (
    <section className="px-4 py-12 min-h-screen">
      <div
        ref={terminal.containerRef}
        onClick={terminal.handleContainerClick}
        className="h-[80vh] bg-slate-950/70 backdrop-blur rounded-lg w-full max-w-6xl mx-auto overflow-y-scroll shadow-xl cursor-text font-mono custom-scrollbar-dark"
      >
        <TerminalHeader />
        <TerminalBody 
          inputRef={terminal.inputRef}
          containerRef={terminal.containerRef}
          input={terminal.input}
          focused={terminal.focused}
          setFocused={terminal.setFocused}
          onChange={terminal.handleChange}
          onSubmit={terminal.handleSubmit}
          history={terminal.terminalLogic.history}
          currentDirectory={terminal.terminalLogic.currentDirectory}
          inputMode={terminal.terminalLogic.inputMode}
        />
      </div>

      <NoteDialog
        note={terminal.selectedNote}
        isOpen={!!terminal.selectedNote}
        onClose={() => terminal.setSelectedNote(null)}
      />

      <DeleteConfirmDialog
        note={terminal.deleteNote?.note || null}
        force={terminal.deleteNote?.force || false}
        isOpen={!!terminal.deleteNote}
        onClose={() => terminal.setDeleteNote(null)}
        onConfirm={deleteConfirmHandler.handleConfirm}
      />
    </section>
  );
}
