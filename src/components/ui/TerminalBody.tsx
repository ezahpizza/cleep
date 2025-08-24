import { Fragment } from "react";
import { motion } from "framer-motion";
import { TerminalOutput } from "@/types/note";
import { InputMode } from "@/types/terminal";
import { getInputPlaceholder, getInputType, getDisplayValue } from "@/utils/terminalUtils";

interface TerminalBodyProps {
  containerRef: React.RefObject<HTMLDivElement>;
  inputRef: React.RefObject<HTMLInputElement>;
  input: string;
  focused: boolean;
  setFocused: (focused: boolean) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  history: TerminalOutput[];
  currentDirectory: string;
  inputMode: InputMode;
}

export function TerminalBody({ 
  containerRef, 
  inputRef, 
  input, 
  focused, 
  setFocused, 
  onChange, 
  onSubmit, 
  history, 
  currentDirectory, 
  inputMode 
}: TerminalBodyProps) {
  return (
    <div className="p-4 text-slate-100 text-sm">
      <div className="text-emerald-400">Welcome to CLeep!</div>
      <div className="text-slate-300">Type 'help' for available commands</div>
      
      {/* Terminal History */}
      <div className="space-y-2 mb-4">
        {history.map((entry, index) => (
          <Fragment key={index}>
            {entry.content}
          </Fragment>
        ))}
      </div>

      {/* Current Input Line */}
      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          onChange={onChange}
          value={input}
          type={getInputType(inputMode)}
          className="sr-only"
          autoComplete="off"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={getInputPlaceholder(inputMode)}
        />
      </form>
      
      <p className="flex items-center">
        <span className="text-emerald-400">➜</span>{" "}
        <span className="text-cyan-300 ml-1">{currentDirectory}</span>{" "}
        <span className="text-slate-400 ml-1">$</span>{" "}
        <span className="ml-1">{getDisplayValue(input, inputMode)}</span>
        {focused && (
          <motion.span
            animate={{ opacity: [1, 1, 0, 0] }}
            transition={{
              repeat: Infinity,
              duration: 1,
              ease: "linear",
              times: [0, 0.5, 0.5, 1],
            }}
            className="inline-block w-2 h-5 bg-slate-400 ml-0.5"
          />
        )}
      </p>
      
      {/* Special prompt for "cr" command */}
      {(input.trim() === "cr" || input === "cr ") && (
        <div className="text-slate-400 text-xs mt-2 flex items-center">
          <span>Enter the title name and press enter</span>
        </div>
      )}
    </div>
  );
}
