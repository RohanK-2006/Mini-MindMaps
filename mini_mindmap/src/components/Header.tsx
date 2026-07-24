import { Network } from "lucide-react";
import { useMock } from "../context/MockProvider";

function Header() {

  const {mock_mode: mockMode, toggle_mock_mode } = useMock();

  return (
    <header className="fixed top-0 left-0 w-full z-50 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm flex items-center justify-between px-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
          <Network className="w-5 h-5 text-indigo-600" strokeWidth={2} />
        </div>

        <span className="text-2xl font-extrabold text-indigo-600 tracking-tight">
          Mini Mindmap
        </span>
      </div>

      {/* Mock Mode Toggle */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-slate-600">
          Mock Mode
        </span>

        <button
          onClick={() => toggle_mock_mode()}
          className={`relative w-12 h-7 rounded-full transition-colors duration-300 cursor-pointer ${
            mockMode ? "bg-indigo-600" : "bg-slate-300"
          }`}
        >
          <span
            className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${
              mockMode ? "translate-x-5" : ""
            }`}
          />
        </button>
      </div>
    </header>
  );
}

export default Header;