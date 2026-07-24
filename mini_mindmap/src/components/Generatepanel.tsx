import { useState } from "react";
import { Sparkles } from "lucide-react";

function GeneratePanel() {
  const [text, setText] = useState("");

  const handleGenerate = () => {
    console.log("Generating MindMap");
  };

  return (
    <section className="w-full md:w-100 flex flex-col">
      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col gap-6 h-[calc(100vh-400px)] min-h-80">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-slate-900">
            Generate Mindmap
          </h2>
          <p className="text-sm text-slate-500">
            Paste your transcript or research notes below to visualize the
            structure.
          </p>
        </div>

        <div className="grow relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g., The solar system consists of the Sun and the objects that orbit it, including eight planets..."
            className="w-full h-full p-4 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none text-sm text-slate-700 placeholder:text-slate-400"
          />
        </div>

        <button
          onClick={handleGenerate}
          className="cursor-pointer w-full h-12 bg-linear-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-md"
        >
          <Sparkles className="w-5 h-5" />
          Generate Mindmap
        </button>
      </div>
    </section>
  );
}

export default GeneratePanel;