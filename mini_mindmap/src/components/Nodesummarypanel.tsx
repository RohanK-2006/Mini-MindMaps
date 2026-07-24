import { Info } from "lucide-react";
import { useMap } from "../context/MapProvider";
import { useTheme } from "../context/ThemeProvider";

interface NodeSummaryPanelProps {
  selectedNodeLabel?: string | null;
}

function NodeSummaryPanel({ selectedNodeLabel = null }: NodeSummaryPanelProps) {
  const { map, selectedNodeId } = useMap();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const selectedNode = map?.nodes.find((node) => node.id === selectedNodeId) ?? null;

  return (
    <div className={`rounded-xl p-5 flex items-start gap-4 shadow-sm min-h-28 border transition-colors duration-300 ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"}`}>
      <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${isDark ? "bg-slate-800" : "bg-slate-100"}`}>
        <Info className={`w-5 h-5 ${isDark ? "text-slate-300" : "text-slate-500"}`} strokeWidth={1.8} />
      </div>

      <div className="min-w-0 flex-1">
        <p className={`text-xs uppercase tracking-[0.2em] mb-2 ${isDark ? "text-slate-400" : "text-slate-400"}`}>
          Selected Node
        </p>
        {selectedNode ? (
          <>
            <h3 className={`text-lg font-semibold truncate ${isDark ? "text-slate-100" : "text-slate-900"}`}>
              {selectedNode.label}
            </h3>
            <p className={`text-sm mt-2 leading-6 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              {selectedNode.summary}
            </p>
          </>
        ) : (
          <p className={`text-base italic ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            {selectedNodeLabel
              ? selectedNodeLabel
              : "No node selected. Click a mindmap node to inspect it here."}
          </p>
        )}
      </div>
    </div>
  );
}

export default NodeSummaryPanel;