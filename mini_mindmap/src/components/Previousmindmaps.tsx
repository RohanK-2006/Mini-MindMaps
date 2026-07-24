import axios from "axios";
import { Clock3, History } from "lucide-react";
import { useEffect, useState } from "react";
import { useMap } from "../context/MapProvider";

function Previousmindmaps() {

  const [mindmaps, setMindmaps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setMap } = useMap();

  const onSelect = async(id: string) => {
    const response = await axios.get(`http://localhost:5000/api/mindmaps/${id}`)
    setMap(response.data);
  } 

  
  useEffect(() => {
    const fetchMindmaps = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          "http://localhost:5000/api/mindmaps"
        );

        setMindmaps(response.data);
      } catch (error) {
        console.error("Failed to fetch mindmaps:", error);
        setMindmaps([]);
        setError("Unable to load your previous mindmaps right now.");
      }finally {
        setLoading(false);
      }
    };

    fetchMindmaps();
  }, []);
  

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
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-8">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
              <div className="absolute inset-3 rounded-full bg-indigo-50 flex items-center justify-center">
                <Clock3 className="w-5 h-5 text-indigo-600" strokeWidth={1.8} />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">
                Loading previous mindmaps
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Fetching your saved mindmaps from the backend.
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="h-full flex flex-col items-center justify-center text-center gap-3 py-8 px-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
              <History className="w-6 h-6 text-rose-500" strokeWidth={1.8} />
            </div>
            <p className="text-sm font-medium text-slate-700">
              Couldn’t load previous mindmaps
            </p>
            <p className="text-sm text-slate-500 max-w-60">
              {error}
            </p>
          </div>
        ) : mindmaps.length === 0 ? (
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
            {mindmaps.map((mindmap: any) => (
              <li key={mindmap.id}>
                <button
                  onClick={() => onSelect?.(mindmap.id)}
                  className="cursor-pointer w-full text-left px-4 py-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all"
                >
                  <p className="text-sm font-medium text-slate-800 truncate">
                    {mindmap.title}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                    <History className="w-4 h-4" />
                    <p className="text-xs text-slate-400">
                      {new Date(mindmap.createdAt).toLocaleString()}
                    </p>
                  </div>
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