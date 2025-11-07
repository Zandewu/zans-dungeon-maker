export function calculateMapBounds(tiles, tileSize, playerPosition = null) {
  const allPositions = [...tiles.map(t => ({x: t.x, y: t.y}))];
  if (playerPosition) {
    allPositions.push(playerPosition);
  }

  if (allPositions.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 };
  }
  
  const xs = allPositions.map(p => p.x);
  const ys = allPositions.map(p => p.y);
  
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

export function convertToASCIIArray(tiles, bounds, tileSize, playerPosition = null) {
  if (bounds.width === 0 || bounds.height === 0) return [];

  // Buat grid kosong dengan spasi
  const grid = Array(bounds.height).fill().map(() => 
    Array(bounds.width).fill(' ')
  );

  // Draw tiles
  tiles.forEach(tile => {
    const col = Math.floor((tile.x - bounds.minX) / tileSize);
    const row = Math.floor((tile.y - bounds.minY) / tileSize);
    
    if (col >= 0 && col < bounds.width && row >= 0 && row < bounds.height) {
      if (tile.type === "wall") {
        grid[row][col] = '$';
      } else if (tile.type === "floor") {
        grid[row][col] = '=';
      }
    }
  });

  // Draw player
  if (playerPosition) {
    const playerCol = Math.floor((playerPosition.x - bounds.minX) / tileSize);
    const playerRow = Math.floor((playerPosition.y - bounds.minY) / tileSize);
    
    if (playerCol >= 0 && playerCol < bounds.width && playerRow >= 0 && playerRow < bounds.height) {
      grid[playerRow][playerCol] = '@';
    }
  }

  return grid;
}

export function convertToStringArray(asciiArray) {
  return asciiArray.map(row => row.join(''));
}