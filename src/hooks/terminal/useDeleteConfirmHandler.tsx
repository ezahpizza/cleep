import { Note, TerminalOutput } from "@/types/note";

interface DeleteConfirmHandlerProps {
  deleteNote: { note: Note; force: boolean } | null;
  onDeleteNote: (id: string, permanent?: boolean) => void;
  addOutput: (content: React.ReactNode, type?: TerminalOutput['type']) => void;
  onClose: () => void;
}

export function useDeleteConfirmHandler({
  deleteNote,
  onDeleteNote,
  addOutput,
  onClose
}: DeleteConfirmHandlerProps) {
  const handleConfirm = (permanent: boolean) => {
    if (deleteNote?.note) {
      onDeleteNote(deleteNote.note.id, permanent);
      addOutput(
        <div className={permanent ? "text-red-400" : "text-yellow-400"}>
          Note {permanent ? 'permanently deleted' : 'moved to deleted'}: {deleteNote.note.title}
        </div>,
        permanent ? 'error' : 'warning'
      );
    }
    onClose();
  };

  return { handleConfirm };
}
