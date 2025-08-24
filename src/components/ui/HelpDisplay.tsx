export function HelpDisplay() {
  return (
    <div className="text-slate-300 space-y-2">
      <div className="text-emerald-400 font-bold">Available Commands:</div>
      <div className="ml-4 space-y-1">
        <div><span className="text-cyan-300">help</span> - Show this help message</div>
        <div><span className="text-cyan-300">ls /[path]</span> - List notes in directory</div>
        <div><span className="text-cyan-300">cr &lt;title&gt;</span> - Create a new note</div>
        <div><span className="text-cyan-300">op &lt;title&gt;</span> - Open a note</div>
        <div><span className="text-cyan-300">mod &lt;title&gt;</span> - Modify a note</div>
        <div><span className="text-cyan-300">del -f &lt;title&gt; </span> - Delete a note</div>
        <div><span className="text-cyan-300">archive &lt;title&gt;</span> - Archive a note</div>
        <div><span className="text-cyan-300">login</span> - Log in to your account</div>
        <div><span className="text-cyan-300">signup</span> - Create a new account</div>
        <div><span className="text-cyan-300">logout</span> - Log out</div>
        <div><span className="text-cyan-300">whoami</span> - Show user info</div>
        <div><span className="text-cyan-300">clear/cls</span> - Clear terminal</div>
      </div>
    </div>
  );
}
