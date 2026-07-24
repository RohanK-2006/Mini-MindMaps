import Header from "./components/Header.tsx";
import GeneratePanel from "./components/Generatepanel.tsx";
import MindmapCanvas from "./components/Mindmapcanvas.tsx";
import NodeSummaryPanel from "./components/Nodesummarypanel.tsx";
import Previousmindmaps from "./components/Previousmindmaps.tsx";
import { useTheme } from "./context/ThemeProvider.tsx";

function App() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}>
      <Header />

      <main className="pt-16 min-h-screen flex flex-col md:flex-row p-6 gap-6 md:pt-20">
        <section className="w-full md:w-100 flex flex-col gap-6 shrink-0 h-[calc(100vh-120px)]">
          <GeneratePanel />
          <Previousmindmaps />
        </section>

        <section className="grow flex flex-col gap-6">
          <MindmapCanvas />
          <NodeSummaryPanel />
        </section>
      </main>
    </div>
  );
}

export default App;