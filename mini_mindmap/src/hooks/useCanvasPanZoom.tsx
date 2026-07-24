import { useCallback, useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
}

const MIN_SCALE = 0.35;
const MAX_SCALE = 2.5;
const WHEEL_SENSITIVITY = 0.0018;
const BUTTON_ZOOM_STEP = 1.2;
const BUTTON_TRANSITION_MS = 200;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Drives an infinite pan/zoom canvas by writing directly to a DOM node's
 * `transform` style via refs, instead of React state. This means panning
 * and zooming never trigger a re-render of the mindmap's nodes/edges —
 * only the CSS transform of one wrapper div changes, so interaction stays
 * smooth regardless of node count.
 */
export function useCanvasPanZoom() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const scaleRef = useRef(1);
  const panRef = useRef<Point>({ x: 0, y: 0 });
  const isPanningRef = useRef(false);
  const panPointerStartRef = useRef<Point>({ x: 0, y: 0 });
  const panOriginRef = useRef<Point>({ x: 0, y: 0 });

  const applyTransform = useCallback(() => {
    const content = contentRef.current;
    if (!content) return;
    const { x, y } = panRef.current;
    content.style.transform = `translate(${x}px, ${y}px) scale(${scaleRef.current})`;
  }, []);

  const withTransition = useCallback((fn: () => void) => {
    const content = contentRef.current;
    if (!content) {
      fn();
      return;
    }
    content.style.transition = `transform ${BUTTON_TRANSITION_MS}ms ease-out`;
    fn();
    window.setTimeout(() => {
      if (content) content.style.transition = "";
    }, BUTTON_TRANSITION_MS);
  }, []);

  // Centers a given point of the content's coordinate space in the viewport.
  // Call this once the mindmap data is ready (e.g. root node coordinates).
  const centerOn = useCallback(
    (contentPoint: Point, scale = 1) => {
      const container = containerRef.current;
      if (!container) return;
      const { width, height } = container.getBoundingClientRect();
      scaleRef.current = clamp(scale, MIN_SCALE, MAX_SCALE);
      panRef.current = {
        x: width / 2 - contentPoint.x * scaleRef.current,
        y: height / 2 - contentPoint.y * scaleRef.current,
      };
      applyTransform();
    },
    [applyTransform]
  );

  const zoomBy = useCallback(
    (factor: number, focal?: Point) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const focalX = focal?.x ?? rect.width / 2;
      const focalY = focal?.y ?? rect.height / 2;

      const prevScale = scaleRef.current;
      const nextScale = clamp(prevScale * factor, MIN_SCALE, MAX_SCALE);
      if (nextScale === prevScale) return;

      // Keep the point under the cursor (or viewport center) visually fixed.
      const contentX = (focalX - panRef.current.x) / prevScale;
      const contentY = (focalY - panRef.current.y) / prevScale;

      scaleRef.current = nextScale;
      panRef.current = {
        x: focalX - contentX * nextScale,
        y: focalY - contentY * nextScale,
      };
      applyTransform();
    },
    [applyTransform]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (contentRef.current) contentRef.current.style.transition = "";
      const rect = container.getBoundingClientRect();
      const factor = Math.exp(-e.deltaY * WHEEL_SENSITIVITY);
      zoomBy(factor, { x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    // passive: false is required so preventDefault() actually stops page scroll.
    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [zoomBy]);

  const handlePointerDown = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("[data-canvas-node]")) return; // let node clicks through
    if (e.button !== 0) return;

    const container = containerRef.current;
    if (contentRef.current) contentRef.current.style.transition = "";

    isPanningRef.current = true;
    panPointerStartRef.current = { x: e.clientX, y: e.clientY };
    panOriginRef.current = { ...panRef.current };
    if (container) container.style.cursor = "grabbing";
    document.body.style.userSelect = "none";

    const handlePointerMove = (moveEvent: MouseEvent) => {
      if (!isPanningRef.current) return;
      const dx = moveEvent.clientX - panPointerStartRef.current.x;
      const dy = moveEvent.clientY - panPointerStartRef.current.y;
      panRef.current = {
        x: panOriginRef.current.x + dx,
        y: panOriginRef.current.y + dy,
      };
      applyTransform();
    };

    const handlePointerUp = () => {
      isPanningRef.current = false;
      if (container) container.style.cursor = "grab";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
    };

    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);
  }, [applyTransform]);

  const zoomIn = useCallback(() => withTransition(() => zoomBy(BUTTON_ZOOM_STEP)), [withTransition, zoomBy]);
  const zoomOut = useCallback(() => withTransition(() => zoomBy(1 / BUTTON_ZOOM_STEP)), [withTransition, zoomBy]);
  const resetView = useCallback(
    (contentPoint: Point) => withTransition(() => centerOn(contentPoint, 1)),
    [withTransition, centerOn]
  );

  return {
    containerRef,
    contentRef,
    handlePointerDown,
    centerOn,
    zoomIn,
    zoomOut,
    resetView,
  };
}