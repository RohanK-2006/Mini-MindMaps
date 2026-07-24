import { History } from "lucide-react";


function Previousmindmaps() {

  const mindmaps = [
    { id: "1", title: "Mindmap 1", createdAt: "2024-06-01" },
    { id: "2", title: "Mindmap 2", createdAt: "2024-06-02" },
    { id: "3", title: "Mindmap 3", createdAt: "2024-06-03" },
  ]; 

  const onSelect = (id: string) => {
    console.log(`Selected mindmap with id: ${id}`);
  } 

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col flex-1 min-h-0">
      <div className="space-y-1 mb-4">
        <h2 className="text-xl font-semibold text-slate-900">
          Previous Mindmaps
        </h2>
        <p className="text-sm text-slate-500">
          Your generated mindmaps will appear here.
        </p>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        {mindmaps.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center gap-3 py-8">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
              <History className="w-6 h-6 text-slate-400" strokeWidth={1.8} />
            </div>
            <p className="text-sm text-slate-400 italic max-w-55">
              No mindmaps generated yet. Your history will show up here.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {mindmaps.map((mindmap) => (
              <li key={mindmap.id}>
                <button
                  onClick={() => onSelect?.(mindmap.id)}
                  className="w-full text-left px-4 py-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all"
                >
                  <p className="text-sm font-medium text-slate-800 truncate">
                    {mindmap.title}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {mindmap.createdAt}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Previousmindmaps;