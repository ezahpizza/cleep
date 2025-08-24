import { Note } from "@/types/note";

interface NotesListProps {
  notes: Note[];
  directory: string;
  onNoteClick: (note: Note) => void;
}

export function NotesList({ notes, directory, onNoteClick }: NotesListProps) {
  return (
    <div className="text-slate-300">
      <div className="text-cyan-300 mb-2">Directory: {directory}</div>
      {notes.length === 0 ? (
        <div className="text-yellow-400">No notes found in this directory</div>
      ) : (
        <div className="space-y-1">
          {notes.map((note) => (
            <div 
              key={note.id} 
              className="hover:bg-slate-800 p-2 rounded cursor-pointer border-l-2 border-blue-500"
              onClick={() => onNoteClick(note)}
            >
              <div className="flex justify-between items-center">
                <span className="text-white font-medium">{note.title}</span>
                <span className="text-slate-400 text-sm">{note.tag}</span>
              </div>
              <div className="text-slate-400 text-sm truncate mt-1">
                {note.content.substring(0, 100)}...
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
