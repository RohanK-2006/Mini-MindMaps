import { Network } from "lucide-react";
import { useMock } from "../context/MockProvider";
import { useTheme } from "../context/ThemeProvider";

function Header() {

  const {mock_mode: mockMode, toggle_mock_mode } = useMock();
  const {theme, toggleTheme} = useTheme();
  const isDark = theme === "dark";

  return (
    <header className={`fixed top-0 left-0 w-full z-50 h-16 backdrop-blur-md border-b shadow-sm flex items-center justify-between px-8 transition-colors duration-300 ${isDark ? "bg-slate-900/80 border-slate-700" : "bg-white/80 border-slate-200"}`}>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? "bg-indigo-500/15" : "bg-indigo-50"}`}>
          <Network className={`w-5 h-5 ${isDark ? "text-indigo-300" : "text-indigo-600"}`} strokeWidth={2} />
        </div>

        <span className={`text-2xl font-extrabold tracking-tight ${isDark ? "text-indigo-300" : "text-indigo-600"}`}>
          Mini Mindmap
        </span>
      </div>

      {/* Theme Toggle */}
      <div className="flex items-center gap-3">
        <span className={`text-sm font-medium ${isDark ? "text-slate-300" : "text-slate-600"}`}>
          Dark Mode
        </span>

        <button
          onClick={() => toggleTheme()}
          className={`relative w-12 h-7 rounded-full transition-colors duration-300 cursor-pointer ${theme === "dark" ? "bg-indigo-500" : "bg-slate-300"}`}
        >
          <span
            className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${
              theme === "dark" ? "translate-x-5" : ""
            }`}
          />
        </button>
      </div>

      {/* Mock Mode Toggle */}
      <div className="flex items-center gap-3">
        <span className={`text-sm font-medium ${isDark ? "text-slate-300" : "text-slate-600"}`}>
          Mock Mode
        </span>

        <button
          onClick={() => toggle_mock_mode()}
          className={`relative w-12 h-7 rounded-full transition-colors duration-300 cursor-pointer ${mockMode ? "bg-indigo-500" : "bg-slate-300"}`}
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