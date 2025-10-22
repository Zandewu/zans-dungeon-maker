export function drawGrid(ctx, camera, tileSize, cx, cy, width, height) {
  ctx.strokeStyle = "#374151";
  ctx.lineWidth = 1;
  
  // Calculate the starting position untuk grid lines
  const startX = -Math.floor(width / tileSize) * tileSize + (camera.x % tileSize);
  const startY = -Math.floor(height / tileSize) * tileSize + (camera.y % tileSize);
  
  // Vertical lines
  for (let x = startX; x < width; x += tileSize) {
    const screenX = cx + x;
    ctx.beginPath();
    ctx.moveTo(screenX, 0);
    ctx.lineTo(screenX, height);
    ctx.stroke();
  }

  // Horizontal lines
  for (let y = startY; y < height; y += tileSize) {
    const screenY = cy + y;
    ctx.beginPath();
    ctx.moveTo(0, screenY);
    ctx.lineTo(width, screenY);
    ctx.stroke();
  }
}

export function drawTiles(ctx, tiles, camera, tileSize, cx, cy) {
  tiles.forEach(tile => {
    const sx = Math.floor(cx + tile.x + camera.x);
    const sy = Math.floor(cy + tile.y + camera.y);
    
    if (tile.type === "floor") {
      ctx.fillStyle = "#6b7280";
      ctx.strokeStyle = "#4b5563";
    } else if (tile.type === "wall") {
      ctx.fillStyle = "#dc2626";
      ctx.strokeStyle = "#991b1b";
    }
    
    ctx.fillRect(sx, sy, tileSize, tileSize);
    ctx.strokeRect(sx, sy, tileSize, tileSize);
  });
}

export function drawCenterCross(ctx, cx, cy) {
  ctx.beginPath();
  ctx.moveTo(cx - 10, cy);
  ctx.lineTo(cx + 10, cy);
  ctx.moveTo(cx, cy - 10);
  ctx.lineTo(cx, cy + 10);
  ctx.strokeStyle = "#4ade80";
  ctx.lineWidth = 2;
  ctx.stroke();
}