import { useRef } from "react";
import Toolbar from "../editor/Toolbar.jsx";
import useCanvas from "../editor/useCanvas.js";
import useDrawing from "../editor/useDrawing.js";
import useExport from "../editor/useExport.js";
import useEvents from "../editor/useEvents.js";

export default function Editor() {
  const canvasRef = useRef(null);
  const tileSize = 32;

  // Custom hooks
  const drawing = useDrawing();
  const { ctx, camera, setCamera } = useCanvas(canvasRef, tileSize, drawing);
  const { exportMap } = useExport(drawing.tiles, tileSize);
  const eventHandlers = useEvents(ctx, drawing, camera, setCamera, tileSize);

  return (
    <div className="fixed inset-0 overflow-hidden bg-gray-900">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full touch-none cursor-crosshair"
        {...eventHandlers}
      />
      
      <Toolbar
        mode={drawing.mode}
        setMode={drawing.setMode}
        isEraser={drawing.isEraser}
        setIsEraser={drawing.setIsEraser}
        exportMap={exportMap}
        onClear={drawing.clearTiles}
      />
    </div>
  );
}