import { AnimatePresence, motion } from "framer-motion";
import { FiAlertTriangle } from "react-icons/fi";
import { Note } from "@/types/note";

interface DeleteConfirmDialogProps {
  note: Note | null;
  force: boolean;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (permanent: boolean) => void;
}

export function DeleteConfirmDialog({ 
  note, 
  force, 
  isOpen, 
  onClose, 
  onConfirm 
}: DeleteConfirmDialogProps) {
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
            className="bg-gradient-to-br from-red-600 to-orange-600 text-white p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden"
          >
            <FiAlertTriangle className="text-white/10 rotate-12 text-[250px] absolute z-0 -top-24 -left-24" />
            <div className="relative z-10">
              <div className="bg-white w-16 h-16 mb-2 rounded-full text-3xl text-red-600 grid place-items-center mx-auto">
                <FiAlertTriangle />
              </div>
              <h3 className="text-3xl font-bold text-center mb-2">
                {force ? 'Critical Warning!' : 'Delete Note?'}
              </h3>
              <p className="text-center mb-4">
                {force ? (
                  <>This will <strong>permanently delete</strong> "{note.title}" from the database. This action cannot be undone.</>
                ) : (
                  <>How would you like to delete "{note.title}"?</>
                )}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="bg-transparent hover:bg-white/10 transition-colors text-white font-semibold w-full py-2 rounded"
                >
                  Cancel
                </button>
                {force ? (
                  <button
                    onClick={() => onConfirm(true)}
                    className="bg-white hover:opacity-90 transition-opacity text-red-600 font-semibold w-full py-2 rounded"
                  >
                    Delete Forever
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => onConfirm(false)}
                      className="bg-white/20 hover:bg-white/30 transition-colors text-white font-semibold w-full py-2 rounded"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => onConfirm(true)}
                      className="bg-white hover:opacity-90 transition-opacity text-red-600 font-semibold w-full py-2 rounded"
                    >
                      Delete Forever
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
