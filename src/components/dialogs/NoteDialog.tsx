import { AnimatePresence, motion } from "framer-motion";
import { FiFileText } from "react-icons/fi";
import { Note } from "@/types/note";

interface NoteDialogProps {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
}

export function NoteDialog({ note, isOpen, onClose }: NoteDialogProps) {
  if (!note) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
        >
          <motion.div
            initial={{ scale: 0, rotate: "12.5deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            exit={{ scale: 0, rotate: "0deg" }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-6 rounded-lg w-full max-w-2xl shadow-xl cursor-default relative overflow-hidden"
          >
            <FiFileText className="text-white/10 rotate-12 text-[250px] absolute z-0 -top-24 -left-24" />
            <div className="relative z-10">
              <div className="bg-white w-16 h-16 mb-4 rounded-full text-3xl text-indigo-600 grid place-items-center mx-auto">
                <FiFileText />
              </div>
              <h3 className="text-2xl font-bold text-center mb-2">
                {note.title}
              </h3>
              <div className="text-center mb-4">
                <span className="inline-block bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {note.tag}
                </span>
              </div>
              <div className="bg-white/10 rounded-lg p-4 mb-6 max-h-96 overflow-y-auto">
                <pre className="text-white/90 text-sm whitespace-pre-wrap font-mono">
                  {note.content}
                </pre>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="bg-white hover:opacity-90 transition-opacity text-indigo-600 font-semibold w-full py-2 rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
