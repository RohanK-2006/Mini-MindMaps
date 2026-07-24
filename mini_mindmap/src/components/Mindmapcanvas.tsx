import { useEffect, useMemo, memo } from "react";
import { BrainCircuit, ZoomIn, ZoomOut, Scan } from "lucide-react";
import { useMap } from "../context/MapProvider";
import { useCanvasPanZoom } from "../hooks/useCanvasPanZoom";
import type { MindmapConnection, MindmapNode } from "../types/types";
import { useMock } from "../context/MockProvider";

// Virtual canvas coordinate space. Large enough that even mindmaps with
// many children won't run out of room; nodes are laid out relative to
// CENTER and the wrapper transform is what actually pans/zooms the view.
const CANVAS_SIZE = 2000;
const CENTER: Point = { x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2 };
const BASE_RADIUS = 220;
const MIN_ARC_SPACING = 150; // min px between sibling node centers

interface Point {
  x: number;
  y: number;
}

// ─── Node dimensions (must match the CSS classes on NodeCard) ────────────
// Root: w-44 = 176px, Child: w-40 = 160px
// Heights are estimated from px-4 py-3 + two text lines ≈ 72px root / 64px child.
// We add a small padding so arrows don't touch the border.
const NODE_DIMS: Record<"root" | "child", { w: number; h: number }> = {
  root: { w: 184, h: 78 },
  child: { w: 168, h: 70 },
};

// Gap between the edge of the node rectangle and where the arrow starts/ends.
const EDGE_GAP = 6;
// How far the Bézier curve bows outward (fraction of segment length).
const CURVE_TENSION = 0.15;

function computeChildRadius(childCount: number) {
  if (childCount <= 0) return BASE_RADIUS;
  const circumferenceNeeded = childCount * MIN_ARC_SPACING;
  return Math.max(BASE_RADIUS, circumferenceNeeded / (2 * Math.PI));
}

/**
 * Given a ray from `origin` toward `target`, find the point where it exits
 * the axis-aligned rectangle centered on `origin` with half-sizes hw, hh.
 * Returns that intersection point pushed outward by `gap`.
 */
function rectEdgeIntersection(
  origin: Point,
  target: Point,
  hw: number,
  hh: number,
  gap: number,
): Point {
  const dx = target.x - origin.x;
  const dy = target.y - origin.y;

  // Degenerate: both points identical → just push right
  if (dx === 0 && dy === 0) return { x: origin.x + hw + gap, y: origin.y };

  // Parameter t for intersection with each edge of the rect
  // We want the smallest positive t.
  let tMin = Infinity;

  // Right edge  x = hw
  if (dx !== 0) {
    const t = (dx > 0 ? hw : -hw) / dx;
    if (t > 0) {
      const yAtT = dy * t;
      if (Math.abs(yAtT) <= hh + 0.5) tMin = Math.min(tMin, t);
    }
  }
  // Bottom edge  y = hh
  if (dy !== 0) {
    const t = (dy > 0 ? hh : -hh) / dy;
    if (t > 0) {
      const xAtT = dx * t;
      if (Math.abs(xAtT) <= hw + 0.5) tMin = Math.min(tMin, t);
    }
  }

  if (!isFinite(tMin)) tMin = 0;

  const dist = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / dist;
  const uy = dy / dist;

  return {
    x: origin.x + dx * tMin + ux * gap,
    y: origin.y + dy * tMin + uy * gap,
  };
}

interface NodeCardProps {
  node: MindmapNode;
  position: Point;
  isRoot: boolean;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const NodeCard = memo(function NodeCard({ node, position, isRoot, isSelected, onSelect }: NodeCardProps) {
  return (
    <div
      data-canvas-node
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: position.x, top: position.y }}
    >
      <button
        type="button"
        onClick={() => onSelect(node.id)}
        className={`relative text-left rounded-2xl border px-4 py-3 transition-all duration-200 ease-out transform-gpu hover:-translate-y-0.5 hover:scale-105 active:scale-100 ${
          isRoot
            ? "w-44 bg-linear-to-br from-indigo-600 to-purple-600 text-white border-transparent shadow-md hover:shadow-xl hover:shadow-indigo-200"
            : isSelected
              ? "w-40 bg-white border-indigo-300 ring-4 ring-indigo-100 shadow-lg"
              : "w-40 bg-white border-slate-200 shadow-sm hover:border-indigo-200 hover:shadow-lg"
        }`}
      >
        {isRoot && (
          <span className="absolute -left-3 -top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow ring-1 ring-indigo-100">
            <BrainCircuit className="h-4 w-4 text-indigo-600" strokeWidth={2} />
          </span>
        )}
        <div className={`text-xs font-medium uppercase tracking-[0.18em] mb-2 ${isRoot ? "text-white/80" : "text-indigo-500"}`}>
          {isRoot ? "Root Topic" : "Node"}
        </div>
        <div className={`text-sm font-semibold leading-snug ${isRoot ? "text-white" : "text-slate-900"}`}>
          {node.label}
        </div>
      </button>
    </div>
  );
});

function MindmapCanvas() {
  const { map, loading: mapLoading, error: mapError, selectedNodeId, setSelectedNodeId } = useMap();
  const { mock_mode } = useMock();
  const { containerRef, contentRef, handlePointerDown, centerOn, zoomIn, zoomOut, resetView } = useCanvasPanZoom();

  const nodes = map?.nodes ?? [];
  const connections = map?.connections ?? [];

  const nodePositions = useMemo(() => {
    const positions = new Map<string, Point>();
    if (!map) return positions;

    const children = nodes.filter((node) => node.id !== map.rootId);
    const total = children.length;
    const radius = computeChildRadius(total);

    nodes.forEach((node) => {
      if (node.id === map.rootId) {
        positions.set(node.id, CENTER);
        return;
      }
      const index = children.findIndex((child) => child.id === node.id);
      const angle = (Math.PI * 2 * index) / Math.max(total, 1) - Math.PI / 2;
      positions.set(node.id, {
        x: CENTER.x + radius * Math.cos(angle),
        y: CENTER.y + radius * Math.sin(angle),
      });
    });

    return positions;
  }, [nodes, map]);

  // Re-center the view whenever a new mindmap is generated.
  useEffect(() => {
    if (map) centerOn(CENTER, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map?.rootId]);

  const edges = useMemo(() => {
    if (!map) return [];
    return connections
      .map((connection: MindmapConnection, index: number) => {
        const fromNode = nodes.find((node) => node.id === connection.from);
        const toNode = nodes.find((node) => node.id === connection.to);
        const fromPos = fromNode && nodePositions.get(fromNode.id);
        const toPos = toNode && nodePositions.get(toNode.id);
        if (!fromNode || !toNode || !fromPos || !toPos) return null;

        const fromIsRoot = fromNode.id === map.rootId;
        const toIsRoot = toNode.id === map.rootId;

        const fromDims = fromIsRoot ? NODE_DIMS.root : NODE_DIMS.child;
        const toDims = toIsRoot ? NODE_DIMS.root : NODE_DIMS.child;

        // Compute exact intersection with each node's bounding rectangle
        const start = rectEdgeIntersection(
          fromPos,
          toPos,
          fromDims.w / 2,
          fromDims.h / 2,
          EDGE_GAP,
        );
        const end = rectEdgeIntersection(
          toPos,
          fromPos,
          toDims.w / 2,
          toDims.h / 2,
          EDGE_GAP,
        );

        // Build a smooth cubic Bézier. Control points are offset perpendicular
        // to the segment so the curve bows slightly outward, giving a clean arc.
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const mx = (start.x + end.x) / 2;
        const my = (start.y + end.y) / 2;

        // Perpendicular unit vector (rotate 90°)
        const px = -dy / dist;
        const py = dx / dist;

        const bow = dist * CURVE_TENSION;
        const cp1x = start.x + dx * 0.25 + px * bow;
        const cp1y = start.y + dy * 0.25 + py * bow;
        const cp2x = start.x + dx * 0.75 + px * bow;
        const cp2y = start.y + dy * 0.75 + py * bow;

        const path = `M ${start.x} ${start.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${end.x} ${end.y}`;

        // Label position: midpoint of the Bézier (approximate: offset from
        // straight midpoint by the same perpendicular bow).
        const labelX = mx + px * bow * 0.5;
        const labelY = my + py * bow * 0.5;

        // Estimate label width: ~7px per character + padding
        const labelWidth = Math.max(44, connection.label.length * 7 + 20);

        return {
          key: `${connection.from}-${connection.to}-${index}`,
          path,
          label: connection.label,
          labelX,
          labelY,
          labelWidth,
        };
      })
      .filter((edge): edge is NonNullable<typeof edge> => edge !== null);
  }, [connections, nodes, nodePositions, map]);

  const loadingOverlay = mapLoading ? (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70 backdrop-blur-sm">
      <div className="text-center max-w-md px-6 flex flex-col items-center gap-5">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
          <div className="absolute inset-5 rounded-full bg-indigo-100/70 flex items-center justify-center">
            <BrainCircuit className="w-10 h-10 text-indigo-600" strokeWidth={1.5} />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">
            Generating your mindmap
          </h1>
          <p className="text-base text-slate-500">
            Gemini is building the structure, connections, and summaries now.
          </p>
        </div>
        <div className="w-full max-w-sm h-2 rounded-full bg-slate-100 overflow-hidden">
          <div className="h-full w-1/2 bg-linear-to-r from-indigo-500 to-purple-500 animate-pulse" />
        </div>
      </div>
    </div>
  ) : null;

  if (mapError) {
    return (
      <div className="relative bg-white border border-slate-200 rounded-xl h-[calc(100vh-240px)] overflow-hidden flex items-center justify-center bg-[radial-gradient(#CBD5E1_0.5px,transparent_0.5px)] bg-size-[24px_24px]">
        <div className="max-w-lg w-full px-6">
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 shadow-sm">
            <div className="w-14 h-14 rounded-full bg-rose-100 flex items-center justify-center mb-4">
              <BrainCircuit className="w-7 h-7 text-rose-600" strokeWidth={1.5} />
            </div>
            <p className="text-xs uppercase tracking-[0.2em] text-rose-500 mb-2">
              Generation Failed
            </p>
            <h1 className="text-2xl font-semibold text-slate-900 mb-2">
              We couldn't build the mindmap
            </h1>
            <p className="text-sm text-slate-600 leading-6">
              {mapError}
            </p>
            <div className="mt-5 flex items-center gap-3 text-sm text-rose-700 bg-rose-100/70 border border-rose-200 rounded-xl px-4 py-3">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-rose-500" />
              Try generating again with a different prompt or fix the input and retry.
            </div>
          </div>
        </div>

        <div className="absolute inset-0 pointer-events-none border-12 border-white/50 rounded-xl" />
      </div>
    );
  }

  if (!map) {
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
          {mock_mode && (
            <p className="text-base text-slate-500 mt-2">
              Mock mode is enabled. The mindmap will be generated from a static example.
            </p>
          )}
        </div>

        {loadingOverlay}

        <div className="absolute inset-0 pointer-events-none border-12 border-white/50 rounded-xl" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onMouseDown={handlePointerDown}
      className="relative bg-white border border-slate-200 rounded-xl h-[calc(100vh-240px)] overflow-hidden cursor-grab bg-[radial-gradient(#CBD5E1_0.5px,transparent_0.5px)] bg-size-[24px_24px]"
    >
      {loadingOverlay}

      {/* Pannable / zoomable content. Only this wrapper's transform changes
          during interaction — nodes and edges never re-render for pan/zoom. */}
      <div
        ref={contentRef}
        className="absolute left-0 top-0"
        style={{ width: CANVAS_SIZE, height: CANVAS_SIZE, transformOrigin: "0 0" }}
      >
        <svg
          className="absolute inset-0 pointer-events-none"
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`}
        >
          <defs>
            <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.5" />
            </linearGradient>
            <marker
              id="mindmap-arrowhead"
              viewBox="0 0 12 12"
              refX="10"
              refY="6"
              markerWidth="12"
              markerHeight="12"
              markerUnits="userSpaceOnUse"
              orient="auto"
            >
              <path
                d="M2,1 L10,6 L2,11 Z"
                fill="#7c3aed"
                stroke="#7c3aed"
                strokeWidth="0.5"
                strokeLinejoin="round"
              />
            </marker>
          </defs>

          {edges.map((edge) => (
            <g key={edge.key}>
              {/* Subtle glow behind the path */}
              <path
                d={edge.path}
                fill="none"
                stroke="#a78bfa"
                strokeWidth="6"
                strokeLinecap="round"
                opacity="0.12"
              />
              {/* Main connection line */}
              <path
                d={edge.path}
                fill="none"
                stroke="url(#connectionGradient)"
                strokeWidth="2.5"
                strokeLinecap="round"
                markerEnd="url(#mindmap-arrowhead)"
              />
              {/* Edge label */}
              <g transform={`translate(${edge.labelX}, ${edge.labelY})`}>
                <rect
                  x={-edge.labelWidth / 2}
                  y="-12"
                  width={edge.labelWidth}
                  height="24"
                  rx="12"
                  fill="white"
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  opacity="0.95"
                />
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="fill-slate-600"
                  fontSize="11"
                  fontWeight="500"
                >
                  {edge.label}
                </text>
              </g>
            </g>
          ))}
        </svg>

        {nodes.map((node) => {
          const position = nodePositions.get(node.id);
          if (!position) return null;
          return (
            <NodeCard
              key={node.id}
              node={node}
              position={position}
              isRoot={node.id === map.rootId}
              isSelected={node.id === selectedNodeId}
              onSelect={setSelectedNodeId}
            />
          );
        })}
      </div>

      {/* Fixed overlays — outside the transformed layer so they stay put on screen */}
      

      <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md border border-slate-200 rounded-xl px-4 py-3 shadow-sm pointer-events-none">
        <p className="text-xs text-slate-500">
          {nodes.length} nodes · {connections.length} connections
        </p>
      </div>

      <div className="absolute bottom-6 left-6 flex items-center gap-1 bg-white/90 backdrop-blur-md border border-slate-200 rounded-xl p-1 shadow-sm">
        <button
          type="button"
          onClick={zoomOut}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => resetView(CENTER)}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          aria-label="Reset view"
        >
          <Scan className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={zoomIn}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
      </div>

      <div className="absolute inset-0 pointer-events-none border-12 border-white/50 rounded-xl" />
    </div>
  );
}

export default MindmapCanvas;