import { BrainCircuit } from "lucide-react";
import { useMap } from "../context/MapProvider";

function MindmapCanvas() {

  const {map, loading: mapLoading} = useMap();

  return (
    <div className="relative bg-white border border-slate-200 rounded-xl h-[calc(100vh-240px)] overflow-hidden flex items-center justify-center bg-[radial-gradient(#CBD5E1_0.5px,transparent_0.5px)] bg-size-[24px_24px]">
      <div className="text-center max-w-md px-6 animate-[float_6s_ease-in-out_infinite]">
        <div className="w-32 h-32 mx-auto mb-6 bg-indigo-100/60 rounded-full flex items-center justify-center">
          <BrainCircuit className="w-16 h-16 text-indigo-600" strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">
          Ready to visualize your ideas?
        </h1>
        <p className="text-base text-slate-500">
          Paste your text in the generator to see your mindmap appear here.
          We'll automatically extract key concepts and relationships for you.
        </p>
      </div>

      {/* Subtle inner border overlay */}
      <div className="absolute inset-0 pointer-events-none border-12 border-white/50 rounded-xl" />
    </div>
  );
}

export default MindmapCanvas;