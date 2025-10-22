export function calculateMapBounds(tiles, tileSize) {
  if (tiles.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 };
  }
  
  const xs = tiles.map(t => t.x);
  const ys = tiles.map(t => t.y);
  
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);
  
  return {
    minX,
    minY,
    maxX,
    maxY,
    width: Math.floor((maxX - minX) / tileSize) + 1,
    height: Math.floor((maxY - minY) / tileSize) + 1
  };
}

export function convertToTileArray(tiles, bounds, tileSize) {
  if (bounds.width === 0 || bounds.height === 0) return [];

  const grid = Array(bounds.height).fill().map(() => 
    Array(bounds.width).fill(0)
  );

  tiles.forEach(tile => {
    const col = Math.floor((tile.x - bounds.minX) / tileSize);
    const row = Math.floor((tile.y - bounds.minY) / tileSize);
    
    if (col >= 0 && col < bounds.width && row >= 0 && row < bounds.height) {
      grid[row][col] = tile.type === "wall" ? 2 : 1;
    }
  });

  return grid;
}

export function convertToCollisionArray(tiles, bounds, tileSize) {
  if (bounds.width === 0 || bounds.height === 0) return [];

  const grid = Array(bounds.height).fill().map(() => 
    Array(bounds.width).fill(0)
  );

  tiles.forEach(tile => {
    const col = Math.floor((tile.x - bounds.minX) / tileSize);
    const row = Math.floor((tile.y - bounds.minY) / tileSize);
    
    if (col >= 0 && col < bounds.width && row >= 0 && row < bounds.height) {
      if (tile.type === "wall") {
        grid[row][col] = 1;
      }
    }
  });

  return grid;
}