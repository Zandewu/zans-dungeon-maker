import { useState, useCallback } from "react";

export default function useDrawing() {
  const [mode, setMode] = useState("floor");
  const [isEraser, setIsEraser] = useState(false);
  const [tiles, setTiles] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [touchState, setTouchState] = useState({ 
    mode: null, 
    lastTouches: [] 
  });

  const clearTiles = useCallback(() => {
    setTiles([]);
  }, []);

  return {
    // State
    mode,
    setMode,
    isEraser,
    setIsEraser,
    tiles,
    setTiles,
    isDrawing,
    setIsDrawing,
    touchState,
    setTouchState,
    
    // Actions
    clearTiles,
  };
}