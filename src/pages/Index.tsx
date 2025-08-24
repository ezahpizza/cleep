import { Sidebar } from "@/components/common/Sidebar";
import { Terminal } from "@/components/ui/Terminal";
import { useNotes } from "@/hooks/useNotes";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

const Index = () => {
  const { notes, createNote, updateNote, deleteNote } = useNotes();
  const { loading, user } = useAuth();
  const [terminalKey, setTerminalKey] = useState(0);
  const [pendingCommand, setPendingCommand] = useState<string>("");

  const handleCommand = (command: string) => {

    setPendingCommand(command);
    setTerminalKey(prev => prev + 1);

    setTimeout(() => {
      setPendingCommand("");
    }, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-slate-300">Loading...</div>
      </div>
    );
  }

  return (
    <div
      className="h-screen bg-slate-900 overflow-hidden flex custom-scrollbar"
      style={{
        backgroundImage: `url("/imgs/kyloBg.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Sidebar onCommand={handleCommand} user={user} loading={loading} />
      
      <div 
        className="flex-1 min-h-0 min-w-0 transition-all duration-300 ease-in-out"
      >
        <Terminal
          key={terminalKey}
          mockNotes={notes}
          onCreateNote={createNote}
          onUpdateNote={updateNote}
          onDeleteNote={deleteNote}
          onCommand={handleCommand}
          initialCommand={pendingCommand}
          user={user}
        />
      </div>
    </div>
  );
};

export default Index;
