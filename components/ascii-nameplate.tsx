"use client";

import { useEffect, useRef } from "react";

const glyphs: Record<string, string[]> = {
  A: [" ### ", "#   #", "#####", "#   #", "#   #"],
  C: [" ####", "#    ", "#    ", "#    ", " ####"],
  D: ["#### ", "#   #", "#   #", "#   #", "#### "],
  E: ["#####", "#    ", "#### ", "#    ", "#####"],
  H: ["#   #", "#   #", "#####", "#   #", "#   #"],
  I: ["#####", "  #  ", "  #  ", "  #  ", "#####"],
  L: ["#    ", "#    ", "#    ", "#    ", "#####"],
  M: ["#   #", "## ##", "# # #", "#   #", "#   #"],
  N: ["#   #", "##  #", "# # #", "#  ##", "#   #"],
  O: [" ### ", "#   #", "#   #", "#   #", " ### "],
  Q: [" ### ", "#   #", "#   #", "#  ##", " ####"],
  R: ["#### ", "#   #", "#### ", "# #  ", "#  ##"],
  U: ["#   #", "#   #", "#   #", "#   #", " ### "],
  V: ["#   #", "#   #", "#   #", " # # ", "  #  "],
  Z: ["#####", "   # ", "  #  ", " #   ", "#####"],
  " ": ["   ", "   ", "   ", "   ", "   "],
};

function renderAsciiLine(value: string) {
  return Array.from({ length: 5 }, (_, row) =>
    [...value].map((character) => glyphs[character]?.[row] ?? "     ").join(" ")
  ).join("\n");
}

const asciiName = `${renderAsciiLine("DOHN MICHAEL")}\n\n${renderAsciiLine("VARQUEZ")}`;

export function AsciiNameplate() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;
    const rootElement = root;
    const canvasElement = canvas;
    const drawingContext = context;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const ramp = " .:+*#";
    const pointer = { x: -1000, y: -1000 };
    const target = { x: -1000, y: -1000 };
    let width = 0;
    let height = 0;
    let columns = 0;
    let rows = 0;
    let animationFrame = 0;
    let lastFrame = 0;
    let visible = true;

    function resize() {
      const ratio = Math.min(2, window.devicePixelRatio || 1);
      width = rootElement.clientWidth;
      height = rootElement.clientHeight;
      canvasElement.width = Math.max(1, Math.floor(width * ratio));
      canvasElement.height = Math.max(1, Math.floor(height * ratio));
      canvasElement.style.width = `${width}px`;
      canvasElement.style.height = `${height}px`;
      drawingContext.setTransform(ratio, 0, 0, ratio, 0, 0);
      drawingContext.font = "11px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
      drawingContext.textBaseline = "top";
      columns = Math.ceil(width / 14);
      rows = Math.ceil(height / 17);
    }

    function trackPointer(event: PointerEvent) {
      if (event.pointerType && event.pointerType !== "mouse") return;
      const bounds = rootElement.getBoundingClientRect();
      target.x = event.clientX - bounds.left;
      target.y = event.clientY - bounds.top;
    }

    function clearPointer() {
      target.x = -1000;
      target.y = -1000;
    }

    function draw(time: number) {
      drawingContext.clearRect(0, 0, width, height);
      const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
      drawingContext.fillStyle = accent;

      pointer.x += (target.x - pointer.x) * 0.12;
      pointer.y += (target.y - pointer.y) * 0.12;

      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const x = column * 14 + 2;
          const y = row * 17 + 2;
          const ambient = (0.5 + 0.5 * Math.sin(column * 0.48 + time * 0.52) * Math.sin(row * 0.64 - time * 0.36)) * 0.08;
          const deltaX = x - pointer.x;
          const deltaY = y - pointer.y;
          const proximity = Math.max(0, 1 - (deltaX * deltaX + deltaY * deltaY) / 13500) * 0.54;
          const brightness = ambient + proximity;
          if (brightness < 0.045) continue;

          drawingContext.globalAlpha = Math.min(0.25, brightness * 0.38);
          const characterIndex = Math.min(ramp.length - 1, Math.floor(brightness * ramp.length));
          drawingContext.fillText(ramp[characterIndex], x, y);
        }
      }

      drawingContext.globalAlpha = 1;
    }

    function loop(timestamp: number) {
      animationFrame = window.requestAnimationFrame(loop);
      if (!visible || document.hidden || timestamp - lastFrame < 56) return;
      lastFrame = timestamp;
      draw(timestamp / 1000);
    }

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(rootElement);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    intersectionObserver.observe(rootElement);

    if (finePointer.matches && !reduceMotion.matches) {
      window.addEventListener("pointermove", trackPointer, { passive: true });
      rootElement.addEventListener("pointerleave", clearPointer);
      animationFrame = window.requestAnimationFrame(loop);
    } else {
      pointer.x = width * 0.72;
      pointer.y = height * 0.38;
      target.x = pointer.x;
      target.y = pointer.y;
      draw(1.7);
    }

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("pointermove", trackPointer);
      rootElement.removeEventListener("pointerleave", clearPointer);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, []);

  return (
    <div ref={rootRef} className="ascii-nameplate">
      <h1 id="hero-title" className="sr-only">Dohn Michael Varquez</h1>
      <canvas ref={canvasRef} className="ascii-field" aria-hidden="true" />
      <pre className="ascii-name-art" aria-hidden="true">{asciiName}</pre>
    </div>
  );
}
