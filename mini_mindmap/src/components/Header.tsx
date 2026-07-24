import { Network } from "lucide-react";

function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm flex items-center px-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
          <Network className="w-5 h-5 text-indigo-600" strokeWidth={2} />
        </div>
        <span className="text-2xl font-extrabold text-indigo-600 tracking-tight">
          Mini Mindmap
        </span>
      </div>
    </header>
  );
}

export default Header;