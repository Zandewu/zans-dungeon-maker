import { useCallback } from "react";
import { calculateMapBounds, convertToASCIIArray, convertToStringArray } from "./mapUtils";

export default function useExport(tiles, tileSize, playerPosition) {
  const exportMap = useCallback(() => {
    const bounds = calculateMapBounds(tiles, tileSize, playerPosition);
    const asciiArray = convertToASCIIArray(tiles, bounds, tileSize, playerPosition);
    const stringArray = convertToStringArray(asciiArray);
    
    const mapData = {
      metadata: {
        version: "1.0",
        exportDate: new Date().toISOString(),
        tileSize: tileSize,
        bounds: bounds,
      },
      map: stringArray
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
  }, [tiles, tileSize, playerPosition]);

  return { exportMap };
}