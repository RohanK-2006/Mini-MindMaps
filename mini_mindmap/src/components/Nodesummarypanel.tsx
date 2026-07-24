import { Info } from "lucide-react";

interface NodeSummaryPanelProps {
  selectedNodeLabel?: string | null;
}

function NodeSummaryPanel({ selectedNodeLabel = null }: NodeSummaryPanelProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm h-20">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
          <Info className="w-5 h-5 text-slate-500" strokeWidth={1.8} />
        </div>
        <p className="text-base text-slate-500 italic">
          {selectedNodeLabel
            ? selectedNodeLabel
            : "No node selected. Generate a mindmap to start exploring."}
        </p>
      </div>
    </div>
  );
}

export default NodeSummaryPanel;