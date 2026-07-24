import { Info } from "lucide-react";
import { useMap } from "../context/MapProvider";

interface NodeSummaryPanelProps {
  selectedNodeLabel?: string | null;
}

function NodeSummaryPanel({ selectedNodeLabel = null }: NodeSummaryPanelProps) {
  const { map, selectedNodeId } = useMap();
  const selectedNode = map?.nodes.find((node) => node.id === selectedNodeId) ?? null;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-start gap-4 shadow-sm min-h-28">
      <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
        <Info className="w-5 h-5 text-slate-500" strokeWidth={1.8} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
          Selected Node
        </p>
        {selectedNode ? (
          <>
            <h3 className="text-lg font-semibold text-slate-900 truncate">
              {selectedNode.label}
            </h3>
            <p className="text-sm text-slate-500 mt-2 leading-6">
              {selectedNode.summary}
            </p>
          </>
        ) : (
          <p className="text-base text-slate-500 italic">
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