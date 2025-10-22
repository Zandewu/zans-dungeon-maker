import { useCallback } from "react";

export default function useEvents(ctx, drawing, camera, setCamera, tileSize) {
  const { 
    mode, isEraser, isDrawing, touchState,
    setTiles, setIsDrawing, setTouchState
  } = drawing;

  const drawAtPosition = useCallback((clientX, clientY) => {
    if (!ctx) return;
    
    const rect = ctx.canvas.getBoundingClientRect();
    const cx = ctx.canvas.width / 2;
    const cy = ctx.canvas.height / 2;
    
    const worldX = Math.floor((clientX - rect.left - cx - camera.x) / tileSize) * tileSize;
    const worldY = Math.floor((clientY - rect.top - cy - camera.y) / tileSize) * tileSize;

    setTiles(prev => {
      const existingIndex = prev.findIndex(t => t.x === worldX && t.y === worldY);
      
      if (isEraser) {
        // Erase mode - remove tile
        if (existingIndex !== -1) {
          return prev.filter((_, index) => index !== existingIndex);
        }
      } else {
        // Draw mode - add or update tile
        if (existingIndex !== -1) {
          // Update existing tile type
          const updated = [...prev];
          updated[existingIndex] = { ...updated[existingIndex], type: mode };
          return updated;
        } else {
          // Add new tile
          return [...prev, { x: worldX, y: worldY, type: mode }];
        }
      }
      return prev;
    });
  }, [ctx, camera, tileSize, mode, isEraser, setTiles]);

  // Mouse events
  const handleMouseDown = useCallback((e) => {
    setIsDrawing(true);
    drawAtPosition(e.clientX, e.clientY);
  }, [drawAtPosition, setIsDrawing]);

  const handleMouseMove = useCallback((e) => {
    if (isDrawing) {
      drawAtPosition(e.clientX, e.clientY);
    }
  }, [isDrawing, drawAtPosition]);

  const handleMouseUp = useCallback(() => {
    setIsDrawing(false);
  }, [setIsDrawing]);

  // Touch events
  const handleTouchStart = useCallback((e) => {
    e.preventDefault();
    const touches = Array.from(e.touches);
    
    if (touches.length === 1) {
      setTouchState({ mode: "draw", lastTouches: touches });
      drawAtPosition(touches[0].clientX, touches[0].clientY);
    } else if (touches.length === 2) {
      setTouchState({ mode: "pan", lastTouches: touches });
    }
  }, [drawAtPosition, setTouchState]);

  const handleTouchMove = useCallback((e) => {
    e.preventDefault();
    const touches = Array.from(e.touches);
    const { mode: touchMode, lastTouches } = touchState;

    if (touchMode === "draw" && touches.length === 1) {
      drawAtPosition(touches[0].clientX, touches[0].clientY);
    } else if (touchMode === "pan" && touches.length === 2) {
      const prev = midpoint(lastTouches);
      const curr = midpoint(touches);
      setCamera(c => ({ 
        x: c.x + (curr.x - prev.x), 
        y: c.y + (curr.y - prev.y) 
      }));
      setTouchState({ mode: "pan", lastTouches: touches });
    }
  }, [touchState, drawAtPosition, setCamera, setTouchState]);

  const handleTouchEnd = useCallback((e) => {
    e.preventDefault();
    if (e.touches.length === 0) {
      setTouchState({ mode: null, lastTouches: [] });
    }
  }, [setTouchState]);

  const midpoint = (touches) => ({
    x: (touches[0].clientX + touches[1].clientX) / 2,
    y: (touches[0].clientY + touches[1].clientY) / 2,
  });

  return {
    onMouseDown: handleMouseDown,
    onMouseMove: handleMouseMove,
    onMouseUp: handleMouseUp,
    onMouseLeave: handleMouseUp,
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };
}