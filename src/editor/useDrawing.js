import { useState, useCallback } from "react";

export default function useDrawing() {
  const [mode, setMode] = useState("floor"); // "floor" | "wall" | "player"
  const [isEraser, setIsEraser] = useState(false);
  const [tiles, setTiles] = useState([]);
  const [playerPosition, setPlayerPosition] = useState(null); // { x, y }
  const [isDrawing, setIsDrawing] = useState(false);
  const [touchState, setTouchState] = useState({ 
    mode: null, 
    lastTouches: [] 
  });

  const clearTiles = useCallback(() => {
    setTiles([]);
    setPlayerPosition(null);
  }, []);

  return {
    // State
    mode,
    setMode,
    isEraser,
    setIsEraser,
    tiles,
    setTiles,
    playerPosition,
    setPlayerPosition,
    isDrawing,
    setIsDrawing,
    touchState,
    setTouchState,
    
    // Actions
    clearTiles,
  };
}