import { useState, useEffect, useCallback } from "react";
import { drawGrid, drawTiles, drawPlayer, drawCenterCross } from "./drawingUtils";

export default function useCanvas(canvasRef, tileSize, drawingState) {
  const [ctx, setCtx] = useState(null);
  const [camera, setCamera] = useState({ x: 0, y: 0 });

  const draw = useCallback((context) => {
    if (!context || !drawingState) return;
    
    const { width, height } = context.canvas;
    const cx = width / 2;
    const cy = height / 2;

    // Clear background
    context.fillStyle = "#111827";
    context.fillRect(0, 0, width, height);

    // Draw components
    drawGrid(context, camera, tileSize, cx, cy, width, height);
    drawTiles(context, drawingState.tiles, camera, tileSize, cx, cy);
    drawPlayer(context, drawingState.playerPosition, camera, tileSize, cx, cy);
    drawCenterCross(context, cx, cy);
  }, [camera, tileSize, drawingState.tiles, drawingState.playerPosition]);

  // Setup canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    context.imageSmoothingEnabled = false;
    setCtx(context);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      draw(context);
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [canvasRef, draw]);

  // Redraw when dependencies change
  useEffect(() => {
    if (ctx) draw(ctx);
  }, [ctx, draw]);

  return { ctx, camera, setCamera };
}