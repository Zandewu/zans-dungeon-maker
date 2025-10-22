import { useCallback } from "react";
import { calculateMapBounds, convertToTileArray, convertToCollisionArray } from "./mapUtils";

export default function useExport(tiles, tileSize) {
  const exportMap = useCallback(() => {
    const bounds = calculateMapBounds(tiles, tileSize);
    const tileArray = convertToTileArray(tiles, bounds, tileSize);
    const collisionArray = convertToCollisionArray(tiles, bounds, tileSize);
    
    const mapData = {
      metadata: {
        version: "1.0",
        exportDate: new Date().toISOString(),
        tileSize: tileSize,
        bounds: bounds,
      },
      tiles: tileArray,
      collisions: collisionArray
    };
    
    const json = JSON.stringify(mapData, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dungeon-map.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [tiles, tileSize]);

  return { exportMap };
}