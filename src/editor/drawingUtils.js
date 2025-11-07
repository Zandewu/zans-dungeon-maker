export function drawGrid(ctx, camera, tileSize, cx, cy, width, height) {
  ctx.strokeStyle = "#374151";
  ctx.lineWidth = 1;
  
  const gridOffsetX = camera.x % tileSize;
  const gridOffsetY = camera.y % tileSize;
  
  // Vertical lines
  for (let x = -width; x < width * 2; x += tileSize) {
    const screenX = cx + x + gridOffsetX;
    ctx.beginPath();
    ctx.moveTo(screenX, 0);
    ctx.lineTo(screenX, height);
    ctx.stroke();
  }

  // Horizontal lines
  for (let y = -height; y < height * 2; y += tileSize) {
    const screenY = cy + y + gridOffsetY;
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

export function drawPlayer(ctx, playerPosition, camera, tileSize, cx, cy) {
  if (!playerPosition) return;
  
  const sx = Math.floor(cx + playerPosition.x + camera.x);
  const sy = Math.floor(cy + playerPosition.y + camera.y);
  
  // Draw player as a green circle with @ symbol
  ctx.fillStyle = "#22c55e";
  ctx.beginPath();
  ctx.arc(sx + tileSize/2, sy + tileSize/2, tileSize/2 - 2, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw @ symbol
  ctx.fillStyle = "white";
  ctx.font = `${tileSize/2}px monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("@", sx + tileSize/2, sy + tileSize/2);
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