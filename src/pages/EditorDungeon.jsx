import { useRef, useEffect, useState, useCallback } from "react";
import Toolbar from "../editor/Toolbar.jsx";

export default function Editor() {
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  const tileSize = 32;
  const [camera, setCamera] = useState({ x: 0, y: 0 });
  
  // Layer system
  const [activeLayer, setActiveLayer] = useState("tile");
  const [tileMode, setTileMode] = useState("floor");
  const [objectMode, setObjectMode] = useState("player");
  const [toolMode, setToolMode] = useState("brush");
  const [rectangleFill, setRectangleFill] = useState("filled");
  
  const [isEraser, setIsEraser] = useState(false);
  const [tiles, setTiles] = useState([]);
  const [objects, setObjects] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [touchState, setTouchState] = useState({ 
    mode: null, 
    lastTouches: [] 
  });

  // Zoom system
  const [zoom, setZoom] = useState(1);
  const [isZoomMode, setIsZoomMode] = useState(false);

  // Texture state
  const [texturesLoaded, setTexturesLoaded] = useState(false);
  const [textures, setTextures] = useState({
    floor: null,
    wall: null,
    player: null,
    enemy: null,
    spike: null,
    boss: null
  });

  // Rectangle drawing state
  const [rectangleStart, setRectangleStart] = useState(null);
  const [rectangleEnd, setRectangleEnd] = useState(null);
  const [isDrawingRectangle, setIsDrawingRectangle] = useState(false);

  // Modal states
  const [showTileModal, setShowTileModal] = useState(false);
  const [showObjectModal, setShowObjectModal] = useState(false);

  // Export form state
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportForm, setExportForm] = useState({
    nama_dungeon: "",
    nama_pembuat: ""
  });
  const [isExporting, setIsExporting] = useState(false);

  // Object sizes
  const objectSizes = {
    player: { width: 1, height: 1 },
    enemy: { width: 1, height: 1 },
    spike: { width: 1, height: 1 },
    boss: { width: 3, height: 3 }
  };

  // State untuk camera pan dengan mouse
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });

  // Load textures on component mount
  useEffect(() => {
    const loadTextures = async () => {
      const texturePromises = [
        loadTexture('floor', '/tiles/floor.png'),
        loadTexture('wall', '/tiles/wall.png'),
        loadTexture('player', '/objects/player.png'),
        loadTexture('enemy', '/objects/enemy.png'),
        loadTexture('spike', '/objects/spike.png'),
        loadTexture('boss', '/objects/boss.png')
      ];

      try {
        const loadedTextures = await Promise.all(texturePromises);
        const textureMap = {};
        loadedTextures.forEach(({ name, image }) => {
          textureMap[name] = image;
        });
        setTextures(textureMap);
        setTexturesLoaded(true);
      } catch (error) {
        console.error('Failed to load textures:', error);
        setTexturesLoaded(true);
      }
    };

    loadTextures();
  }, []);

  const loadTexture = (name, url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ name, image: img });
      img.onerror = () => {
        console.warn(`Failed to load texture: ${url}`);
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        
        if (name === 'floor') {
          ctx.fillStyle = '#6b7280';
        } else if (name === 'wall') {
          ctx.fillStyle = '#dc2626';
        } else if (name === 'player') {
          ctx.fillStyle = '#22c55e';
        } else if (name === 'enemy') {
          ctx.fillStyle = '#f59e0b';
        } else if (name === 'spike') {
          ctx.fillStyle = '#a855f7';
        } else if (name === 'boss') {
          ctx.fillStyle = '#ef4444';
        }
        
        ctx.fillRect(0, 0, 32, 32);
        ctx.strokeStyle = '#000';
        ctx.strokeRect(0, 0, 32, 32);
        
        resolve({ name, image: canvas });
      };
      img.src = url;
    });
  };

  // Reset toolMode ketika berpindah layer dari tile ke object
  useEffect(() => {
    if (activeLayer === "object" && toolMode === "rectangle") {
      setToolMode("brush");
    }
  }, [activeLayer, toolMode]);

  // Setup canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext("2d");
    context.imageSmoothingEnabled = false;
    setCtx(context);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      draw();
    };

    resize();
    window.addEventListener("resize", resize);
    
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Drawing function
  const draw = useCallback(() => {
    if (!ctx) return;
    
    const canvas = ctx.canvas;
    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;

    // Clear background
    ctx.fillStyle = "#111827";
    ctx.fillRect(0, 0, width, height);

    // Draw tiles dengan texture support
    tiles.forEach(tile => {
      const scaledTileSize = tileSize * zoom;
      const sx = cx + tile.x * zoom + camera.x * zoom;
      const sy = cy + tile.y * zoom + camera.y * zoom;
      
      const texture = textures[tile.type];
      if (texture && texturesLoaded) {
        ctx.drawImage(texture, sx, sy, scaledTileSize, scaledTileSize);
      } else {
        if (tile.type === "floor") {
          ctx.fillStyle = "#6b7280";
          ctx.strokeStyle = "#4b5563";
        } else if (tile.type === "wall") {
          ctx.fillStyle = "#dc2626";
          ctx.strokeStyle = "#991b1b";
        }
        ctx.fillRect(sx, sy, scaledTileSize, scaledTileSize);
        ctx.strokeRect(sx, sy, scaledTileSize, scaledTileSize);
      }
    });

    // Draw objects dengan texture support
    objects.forEach(obj => {
      const size = objectSizes[obj.type];
      const scaledWidth = size.width * tileSize * zoom;
      const scaledHeight = size.height * tileSize * zoom;
      
      const sx = cx + obj.x * zoom + camera.x * zoom;
      const sy = cy + obj.y * zoom + camera.y * zoom;
      
      const texture = textures[obj.type];
      if (texture && texturesLoaded) {
        ctx.drawImage(texture, sx, sy, scaledWidth, scaledHeight);
      } else {
        if (obj.type === "player") {
          ctx.fillStyle = "#22c55e";
          ctx.beginPath();
          ctx.arc(sx + scaledWidth/2, sy + scaledHeight/2, scaledWidth/2 - 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (obj.type === "enemy") {
          ctx.fillStyle = "#f59e0b";
          ctx.beginPath();
          ctx.arc(sx + scaledWidth/2, sy + scaledHeight/2, scaledWidth/2 - 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (obj.type === "spike") {
          ctx.fillStyle = "#a855f7";
          ctx.beginPath();
          ctx.moveTo(sx + scaledWidth/2, sy + 4);
          ctx.lineTo(sx + 4, sy + scaledHeight - 4);
          ctx.lineTo(sx + scaledWidth - 4, sy + scaledHeight - 4);
          ctx.closePath();
          ctx.fill();
        } else if (obj.type === "boss") {
          ctx.fillStyle = "#ef4444";
          ctx.fillRect(sx, sy, scaledWidth, scaledHeight);
          ctx.strokeStyle = "#dc2626";
          ctx.lineWidth = 2;
          ctx.strokeRect(sx, sy, scaledWidth, scaledHeight);
        }
      }
    });

    // Draw rectangle preview
    if (activeLayer === "tile" && isDrawingRectangle && rectangleStart && rectangleEnd) {
      const minX = Math.min(rectangleStart.x, rectangleEnd.x);
      const maxX = Math.max(rectangleStart.x, rectangleEnd.x);
      const minY = Math.min(rectangleStart.y, rectangleEnd.y);
      const maxY = Math.max(rectangleStart.y, rectangleEnd.y);
      
      const sx = cx + minX * zoom + camera.x * zoom;
      const sy = cy + minY * zoom + camera.y * zoom;
      const widthRect = (maxX - minX + tileSize) * zoom;
      const heightRect = (maxY - minY + tileSize) * zoom;
      
      if (rectangleFill === "filled") {
        ctx.strokeStyle = "#60a5fa";
        ctx.fillStyle = "rgba(96, 165, 250, 0.2)";
      } else {
        ctx.strokeStyle = "#f87171";
        ctx.fillStyle = "rgba(96, 165, 250, 0.2)";
      }
      
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(sx, sy, widthRect, heightRect);
      ctx.setLineDash([]);
      ctx.fillRect(sx, sy, widthRect, heightRect);
    }

    // Draw center cross
    ctx.beginPath();
    ctx.moveTo(cx - 10, cy);
    ctx.lineTo(cx + 10, cy);
    ctx.moveTo(cx, cy - 10);
    ctx.lineTo(cx, cy + 10);
    ctx.strokeStyle = "#4ade80";
    ctx.lineWidth = 2;
    ctx.stroke();

  }, [ctx, camera, tiles, objects, tileSize, activeLayer, isDrawingRectangle, rectangleStart, rectangleEnd, rectangleFill, textures, texturesLoaded, zoom, objectSizes]);

  // Redraw when dependencies change
  useEffect(() => {
    draw();
  }, [draw]);

  // Convert screen coordinates to world coordinates
  const screenToWorld = useCallback((clientX, clientY) => {
    if (!ctx) return { x: 0, y: 0 };
    
    const rect = ctx.canvas.getBoundingClientRect();
    const cx = ctx.canvas.width / 2;
    const cy = ctx.canvas.height / 2;
    
    const worldX = Math.floor((clientX - rect.left - cx - camera.x * zoom) / (tileSize * zoom)) * tileSize;
    const worldY = Math.floor((clientY - rect.top - cy - camera.y * zoom) / (tileSize * zoom)) * tileSize;
    
    return { x: worldX, y: worldY };
  }, [ctx, camera, tileSize, zoom]);

  // Brush drawing logic
  const drawWithBrush = useCallback((worldX, worldY) => {
    if (activeLayer === "tile") {
      setTiles(prev => {
        const existingIndex = prev.findIndex(t => t.x === worldX && t.y === worldY);
        
        if (isEraser) {
          if (existingIndex !== -1) {
            return prev.filter((_, index) => index !== existingIndex);
          }
        } else {
          if (existingIndex !== -1) {
            const updated = [...prev];
            updated[existingIndex] = { ...updated[existingIndex], type: tileMode };
            return updated;
          } else {
            return [...prev, { x: worldX, y: worldY, type: tileMode }];
          }
        }
        return prev;
      });
    } else if (activeLayer === "object") {
      setObjects(prev => {
        const size = objectSizes[objectMode];
        const objectWidth = size.width * tileSize;
        const objectHeight = size.height * tileSize;
        
        if (!isEraser) {
          const wouldCollide = prev.some(obj => {
            if (obj.type === objectMode && (objectMode === "player" || objectMode === "boss")) {
              return false;
            }
            
            const objSize = objectSizes[obj.type];
            const objWidth = objSize.width * tileSize;
            const objHeight = objSize.height * tileSize;
            
            return (
              worldX < obj.x + objWidth &&
              worldX + objectWidth > obj.x &&
              worldY < obj.y + objHeight &&
              worldY + objectHeight > obj.y
            );
          });
          
          if (wouldCollide) {
            return prev;
          }
        }
        
        if (isEraser) {
          const objectToErase = prev.find(obj => {
            const objSize = objectSizes[obj.type];
            const objWidth = objSize.width * tileSize;
            const objHeight = objSize.height * tileSize;
            
            return (
              worldX >= obj.x && 
              worldX < obj.x + objWidth &&
              worldY >= obj.y && 
              worldY < obj.y + objHeight
            );
          });
          
          if (objectToErase) {
            return prev.filter(obj => obj !== objectToErase);
          }
        } else {
          if (objectMode === "player" || objectMode === "boss") {
            const filtered = prev.filter(obj => obj.type !== objectMode);
            return [...filtered, { x: worldX, y: worldY, type: objectMode }];
          } else {
            return [...prev, { x: worldX, y: worldY, type: objectMode }];
          }
        }
        return prev;
      });
    }
  }, [activeLayer, tileMode, objectMode, isEraser, tileSize, objectSizes]);

  // Rectangle drawing logic
  const createRectangle = useCallback((start, end) => {
    if (activeLayer !== "tile") return;
    
    const minX = Math.min(start.x, end.x);
    const maxX = Math.max(start.x, end.x);
    const minY = Math.min(start.y, end.y);
    const maxY = Math.max(start.y, end.y);
    
    const newTiles = [];
    
    if (rectangleFill === "filled") {
      for (let x = minX; x <= maxX; x += tileSize) {
        for (let y = minY; y <= maxY; y += tileSize) {
          newTiles.push({ x, y, type: "floor" });
        }
      }
    } else if (rectangleFill === "border") {
      for (let x = minX; x <= maxX; x += tileSize) {
        for (let y = minY; y <= maxY; y += tileSize) {
          const isBorder = 
            x === minX || x === maxX || y === minY || y === maxY;
          
          if (isBorder) {
            newTiles.push({ x, y, type: "wall" });
          } else {
            newTiles.push({ x, y, type: "floor" });
          }
        }
      }
    }
    
    setTiles(prev => {
      if (isEraser) {
        const filtered = prev.filter(tile => 
          tile.x < minX || tile.x > maxX || tile.y < minY || tile.y > maxY
        );
        return filtered;
      } else {
        const filtered = prev.filter(tile => 
          tile.x < minX || tile.x > maxX || tile.y < minY || tile.y > maxY
        );
        return [...filtered, ...newTiles];
      }
    });
  }, [activeLayer, rectangleFill, isEraser, tileSize]);

  // Mouse events
  const handleMouseDown = useCallback((e) => {
    if (e.button === 2) {
      e.preventDefault();
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
      return;
    }
    
    if (e.button === 0) {
      const worldPos = screenToWorld(e.clientX, e.clientY);
      
      if (toolMode === "brush") {
        setIsDrawing(true);
        drawWithBrush(worldPos.x, worldPos.y);
      } else if (toolMode === "rectangle" && activeLayer === "tile") {
        setIsDrawingRectangle(true);
        setRectangleStart(worldPos);
        setRectangleEnd(worldPos);
      }
    }
  }, [toolMode, activeLayer, screenToWorld, drawWithBrush]);

  const handleMouseMove = useCallback((e) => {
    if (isPanning) {
      const deltaX = e.clientX - lastPanPoint.x;
      const deltaY = e.clientY - lastPanPoint.y;
      
      setCamera(c => ({ 
        x: c.x - deltaX / zoom, 
        y: c.y - deltaY / zoom 
      }));
      
      setLastPanPoint({ x: e.clientX, y: e.clientY });
      return;
    }
    
    const worldPos = screenToWorld(e.clientX, e.clientY);
    
    if (isDrawing && toolMode === "brush") {
      drawWithBrush(worldPos.x, worldPos.y);
    } else if (isDrawingRectangle && toolMode === "rectangle" && activeLayer === "tile") {
      setRectangleEnd(worldPos);
    }
  }, [isPanning, lastPanPoint, isDrawing, isDrawingRectangle, toolMode, activeLayer, screenToWorld, drawWithBrush, zoom]);

  const handleMouseUp = useCallback((e) => {
    if (e.button === 2) {
      setIsPanning(false);
    } else if (e.button === 0) {
      if (isDrawingRectangle && rectangleStart && rectangleEnd && activeLayer === "tile") {
        createRectangle(rectangleStart, rectangleEnd);
      }
      setIsDrawing(false);
      setIsDrawingRectangle(false);
      setRectangleStart(null);
      setRectangleEnd(null);
    }
  }, [isDrawingRectangle, rectangleStart, rectangleEnd, activeLayer, createRectangle]);

  const handleContextMenu = useCallback((e) => {
    e.preventDefault();
  }, []);

  // Keyboard events
  const handleKeyDown = useCallback((e) => {
    const moveSpeed = 20;
    switch(e.key) {
      case 'ArrowUp':
        setCamera(c => ({ ...c, y: c.y - moveSpeed }));
        break;
      case 'ArrowDown':
        setCamera(c => ({ ...c, y: c.y + moveSpeed }));
        break;
      case 'ArrowLeft':
        setCamera(c => ({ ...c, x: c.x - moveSpeed }));
        break;
      case 'ArrowRight':
        setCamera(c => ({ ...c, x: c.x + moveSpeed }));
        break;
      case ' ':
        setIsEraser(prev => !prev);
        break;
      case 'e':
      case 'E':
        setIsEraser(prev => !prev);
        break;
      case '1':
        setActiveLayer("tile");
        break;
      case '2':
        setActiveLayer("object");
        break;
      case 'b':
      case 'B':
        setToolMode("brush");
        break;
      case 'r':
      case 'R':
        if (activeLayer === "tile") {
          setToolMode("rectangle");
        }
        break;
      case '=':
      case '+':
        e.preventDefault();
        setZoom(prev => Math.min(3, prev + 0.1));
        break;
      case '-':
        e.preventDefault();
        setZoom(prev => Math.max(0.5, prev - 0.1));
        break;
      case '0':
        e.preventDefault();
        setZoom(1);
        break;
      default:
        break;
    }
  }, [activeLayer]);

  // Wheel event untuk zoom
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const zoomFactor = 0.1;
    const delta = e.deltaY > 0 ? -zoomFactor : zoomFactor;
    
    setZoom(prev => {
      const newZoom = Math.max(0.5, Math.min(3, prev + delta));
      return newZoom;
    });
  }, []);

  // Touch events
  const handleTouchStart = useCallback((e) => {
    e.preventDefault();
    const touches = Array.from(e.touches);
    
    if (touches.length === 1) {
      const worldPos = screenToWorld(touches[0].clientX, touches[0].clientY);
      
      if (toolMode === "brush") {
        setTouchState({ mode: "draw", lastTouches: touches });
        drawWithBrush(worldPos.x, worldPos.y);
      } else if (toolMode === "rectangle" && activeLayer === "tile") {
        setTouchState({ mode: "rectangle", lastTouches: touches });
        setIsDrawingRectangle(true);
        setRectangleStart(worldPos);
        setRectangleEnd(worldPos);
      }
    } else if (touches.length === 2) {
      if (isZoomMode) {
        setTouchState({ mode: "zoom", lastTouches: touches });
      } else {
        setTouchState({ mode: "pan", lastTouches: touches });
      }
    }
  }, [toolMode, activeLayer, screenToWorld, drawWithBrush, isZoomMode]);

  const handleTouchMove = useCallback((e) => {
    e.preventDefault();
    const touches = Array.from(e.touches);
    const { mode: touchMode, lastTouches } = touchState;

    if (touchMode === "draw" && touches.length === 1 && toolMode === "brush") {
      const worldPos = screenToWorld(touches[0].clientX, touches[0].clientY);
      drawWithBrush(worldPos.x, worldPos.y);
    } else if (touchMode === "rectangle" && touches.length === 1 && toolMode === "rectangle" && activeLayer === "tile") {
      const worldPos = screenToWorld(touches[0].clientX, touches[0].clientY);
      setRectangleEnd(worldPos);
    } else if (touchMode === "pan" && touches.length === 2) {
      const prev = midpoint(lastTouches);
      const curr = midpoint(touches);
      setCamera(c => ({ 
        x: c.x + (curr.x - prev.x) / zoom, 
        y: c.y + (curr.y - prev.y) / zoom 
      }));
      setTouchState({ mode: "pan", lastTouches: touches });
    } else if (touchMode === "zoom" && touches.length === 2) {
      const prevDistance = distance(lastTouches[0], lastTouches[1]);
      const currDistance = distance(touches[0], touches[1]);
      const scaleFactor = currDistance / prevDistance;
      
      setZoom(prevZoom => {
        const newZoom = Math.max(0.5, Math.min(3, prevZoom * scaleFactor));
        return newZoom;
      });
      
      setTouchState({ mode: "zoom", lastTouches: touches });
    }
  }, [touchState, toolMode, activeLayer, screenToWorld, drawWithBrush, zoom, isZoomMode]);

  const handleTouchEnd = useCallback((e) => {
    e.preventDefault();
    if (e.touches.length === 0) {
      if (isDrawingRectangle && rectangleStart && rectangleEnd && activeLayer === "tile") {
        createRectangle(rectangleStart, rectangleEnd);
      }
      setIsDrawingRectangle(false);
      setRectangleStart(null);
      setRectangleEnd(null);
      setTouchState({ mode: null, lastTouches: [] });
    }
  }, [isDrawingRectangle, rectangleStart, rectangleEnd, activeLayer, createRectangle]);

  const midpoint = (touches) => ({
    x: (touches[0].clientX + touches[1].clientX) / 2,
    y: (touches[0].clientY + touches[1].clientY) / 2,
  });

  const distance = (touch1, touch2) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Export functions
  const handleExportClick = useCallback(() => {
    setShowExportModal(true);
  }, []);

  const handleExportSubmit = useCallback(async () => {
    if (!exportForm.nama_dungeon.trim() || !exportForm.nama_pembuat.trim()) {
      alert("Harap isi nama dungeon dan nama pembuat!");
      return;
    }

    setIsExporting(true);
    
    try {
      const bounds = calculateMapBounds(tiles, objects, tileSize, objectSizes);
      const tileArray = convertToTileArray(tiles, bounds, tileSize);
      const objectArray = convertToObjectArray(objects, bounds, tileSize, objectSizes);
      const wallArray = convertToWallArray(tiles, bounds, tileSize);
      
      const mapData = {
        metadata: {
          version: "1.1",
          exportDate: new Date().toISOString(),
          tileSize: tileSize,
          bounds: bounds,
          nama_dungeon: exportForm.nama_dungeon,
          nama_pembuat: exportForm.nama_pembuat
        },
        tiles: tileArray,
        objects: objectArray,
        walls: wallArray
      };
      
      const response = await fetch('http://localhost:5000/api/dungeons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nama_dungeon: exportForm.nama_dungeon,
          nama_pembuat: exportForm.nama_pembuat,
          data_dungeon: JSON.stringify(mapData)
        })
      });

      if (!response.ok) {
        throw new Error('Gagal menyimpan dungeon ke database');
      }

      const result = await response.json();
      alert('Dungeon berhasil disimpan ke database!');
      setShowExportModal(false);
      setExportForm({ nama_dungeon: "", nama_pembuat: "" });
      
    } catch (error) {
      console.error('Export error:', error);
      alert('Gagal menyimpan ke database, menyimpan sebagai file...');
      exportToFile();
    } finally {
      setIsExporting(false);
    }
  }, [exportForm, tiles, objects, tileSize, objectSizes]);

  const handleExportFormChange = useCallback((field, value) => {
    setExportForm(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const exportToFile = useCallback(() => {
    const bounds = calculateMapBounds(tiles, objects, tileSize, objectSizes);
    const tileArray = convertToTileArray(tiles, bounds, tileSize);
    const objectArray = convertToObjectArray(objects, bounds, tileSize, objectSizes);
    const wallArray = convertToWallArray(tiles, bounds, tileSize);
    
    const mapData = {
      metadata: {
        version: "1.1",
        exportDate: new Date().toISOString(),
        tileSize: tileSize,
        bounds: bounds,
        nama_dungeon: exportForm.nama_dungeon || "Unnamed Dungeon",
        nama_pembuat: exportForm.nama_pembuat || "Unknown Creator"
      },
      tiles: tileArray,
      objects: objectArray,
      walls: wallArray
    };
    
    const json = JSON.stringify(mapData, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${exportForm.nama_dungeon || 'dungeon'}-map.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setShowExportModal(false);
    setExportForm({ nama_dungeon: "", nama_pembuat: "" });
  }, [tiles, objects, tileSize, objectSizes, exportForm]);

  const handleCancelExport = useCallback(() => {
    setShowExportModal(false);
    setExportForm({ nama_dungeon: "", nama_pembuat: "" });
  }, []);

  // Clear function
  const clearCurrentLayer = useCallback(() => {
    if (activeLayer === "tile") {
      setTiles([]);
    } else if (activeLayer === "object") {
      setObjects([]);
    }
  }, [activeLayer]);

  const clearAll = useCallback(() => {
    setTiles([]);
    setObjects([]);
  }, []);

  // Reset zoom function
  const resetZoom = useCallback(() => {
    setZoom(1);
    setCamera({ x: 0, y: 0 });
  }, []);

  // Add keyboard event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="fixed inset-0 overflow-hidden bg-gray-900">
      {/* Loading Indicator */}
      {!texturesLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-80 z-50">
          <div className="text-white text-lg">Loading textures...</div>
        </div>
      )}
      
      {/* Zoom Indicator */}
      <div className="absolute top-4 left-4 bg-gray-800/90 text-white px-3 py-2 rounded-lg z-10">
        Zoom: {Math.round(zoom * 100)}%
      </div>

      {/* Controls Help untuk Komputer */}
      <div className="absolute top-16 left-4 bg-gray-800/90 text-white px-3 py-2 rounded-lg z-10 text-sm hidden md:block">
        <div className="font-bold mb-1">Controls:</div>
        <div>Right Click + Drag: Pan Camera</div>
        <div>Mouse Wheel: Zoom</div>
        <div>Arrow Keys: Move Camera</div>
        <div>1/2: Switch Layer</div>
        <div>B/R: Brush/Rectangle</div>
        <div>E/Space: Toggle Eraser</div>
      </div>
      
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full touch-none cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onContextMenu={handleContextMenu}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />
      
      <Toolbar
        activeLayer={activeLayer}
        setActiveLayer={setActiveLayer}
        tileMode={tileMode}
        setTileMode={setTileMode}
        objectMode={objectMode}
        setObjectMode={setObjectMode}
        toolMode={toolMode}
        setToolMode={setToolMode}
        rectangleFill={rectangleFill}
        setRectangleFill={setRectangleFill}
        isEraser={isEraser}
        setIsEraser={setIsEraser}
        isZoomMode={isZoomMode}
        setIsZoomMode={setIsZoomMode}
        resetZoom={resetZoom}
        exportMap={handleExportClick}
        onClear={clearCurrentLayer}
        onClearAll={clearAll}
        showTileModal={showTileModal}
        setShowTileModal={setShowTileModal}
        showObjectModal={showObjectModal}
        setShowObjectModal={setShowObjectModal}
        textures={textures}
        texturesLoaded={texturesLoaded}
      />

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-white text-lg font-bold mb-4">Export Dungeon</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Nama Dungeon *
                </label>
                <input
                  type="text"
                  value={exportForm.nama_dungeon}
                  onChange={(e) => handleExportFormChange('nama_dungeon', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  placeholder="Masukkan nama dungeon"
                />
              </div>
              
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Nama Pembuat *
                </label>
                <input
                  type="text"
                  value={exportForm.nama_pembuat}
                  onChange={(e) => handleExportFormChange('nama_pembuat', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  placeholder="Masukkan nama pembuat"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleExportSubmit}
                disabled={isExporting}
                className={`flex-1 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isExporting 
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                    : 'bg-green-600 text-white hover:bg-green-500'
                }`}
              >
                {isExporting ? 'Menyimpan...' : '💾 Simpan ke Database'}
              </button>
              
              <button
                onClick={exportToFile}
                disabled={isExporting}
                className={`flex-1 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isExporting 
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-500'
                }`}
              >
                📥 Download File
              </button>
            </div>

            <button
              onClick={handleCancelExport}
              disabled={isExporting}
              className={`w-full mt-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isExporting 
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-600 text-white hover:bg-gray-500'
              }`}
            >
              Batal
            </button>

            <p className="text-gray-400 text-xs mt-4 text-center">
              * Database: localhost:5000 | File: Download JSON
            </p>
          </div>
        </div>
      )}

      {/* Tile Selection Modal */}
      {showTileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-white text-lg font-bold mb-4">Select Tile Type</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setTileMode("floor");
                  setShowTileModal(false);
                }}
                className={`p-4 rounded-lg border-2 ${
                  tileMode === "floor" 
                    ? "border-blue-500 bg-blue-500 bg-opacity-20" 
                    : "border-gray-600 bg-gray-700"
                } text-white text-center`}
              >
                {texturesLoaded && textures.floor ? (
                  <img src={textures.floor.src} alt="Floor" className="w-8 h-8 mx-auto mb-1" />
                ) : (
                  <div className="text-2xl">🧱</div>
                )}
                <div className="text-sm mt-1">Floor</div>
              </button>
              <button
                onClick={() => {
                  setTileMode("wall");
                  setShowTileModal(false);
                }}
                className={`p-4 rounded-lg border-2 ${
                  tileMode === "wall" 
                    ? "border-red-500 bg-red-500 bg-opacity-20" 
                    : "border-gray-600 bg-gray-700"
                } text-white text-center`}
              >
                {texturesLoaded && textures.wall ? (
                  <img src={textures.wall.src} alt="Wall" className="w-8 h-8 mx-auto mb-1" />
                ) : (
                  <div className="text-2xl">🚧</div>
                )}
                <div className="text-sm mt-1">Wall</div>
              </button>
            </div>
            <button
              onClick={() => setShowTileModal(false)}
              className="w-full mt-4 p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Object Selection Modal */}
      {showObjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-white text-lg font-bold mb-4">Select Object Type</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setObjectMode("player");
                  setShowObjectModal(false);
                }}
                className={`p-4 rounded-lg border-2 ${
                  objectMode === "player" 
                    ? "border-green-500 bg-green-500 bg-opacity-20" 
                    : "border-gray-600 bg-gray-700"
                } text-white text-center`}
              >
                {texturesLoaded && textures.player ? (
                  <img src={textures.player.src} alt="Player" className="w-8 h-8 mx-auto mb-1" />
                ) : (
                  <div className="text-2xl">👤</div>
                )}
                <div className="text-sm mt-1">Player</div>
              </button>
              <button
                onClick={() => {
                  setObjectMode("enemy");
                  setShowObjectModal(false);
                }}
                className={`p-4 rounded-lg border-2 ${
                  objectMode === "enemy" 
                    ? "border-yellow-500 bg-yellow-500 bg-opacity-20" 
                    : "border-gray-600 bg-gray-700"
                } text-white text-center`}
              >
                {texturesLoaded && textures.enemy ? (
                  <img src={textures.enemy.src} alt="Enemy" className="w-8 h-8 mx-auto mb-1" />
                ) : (
                  <div className="text-2xl">👹</div>
                )}
                <div className="text-sm mt-1">Enemy</div>
              </button>
              <button
                onClick={() => {
                  setObjectMode("spike");
                  setShowObjectModal(false);
                }}
                className={`p-4 rounded-lg border-2 ${
                  objectMode === "spike" 
                    ? "border-purple-500 bg-purple-500 bg-opacity-20" 
                    : "border-gray-600 bg-gray-700"
                } text-white text-center`}
              >
                {texturesLoaded && textures.spike ? (
                  <img src={textures.spike.src} alt="Spike" className="w-8 h-8 mx-auto mb-1" />
                ) : (
                  <div className="text-2xl">🟪</div>
                )}
                <div className="text-sm mt-1">Spike</div>
              </button>
              <button
                onClick={() => {
                  setObjectMode("boss");
                  setShowObjectModal(false);
                }}
                className={`p-4 rounded-lg border-2 ${
                  objectMode === "boss" 
                    ? "border-red-500 bg-red-500 bg-opacity-20" 
                    : "border-gray-600 bg-gray-700"
                } text-white text-center`}
              >
                {texturesLoaded && textures.boss ? (
                  <img src={textures.boss.src} alt="Boss" className="w-8 h-8 mx-auto mb-1" />
                ) : (
                  <div className="text-2xl">👾</div>
                )}
                <div className="text-sm mt-1">Boss (3x3)</div>
              </button>
            </div>
            <button
              onClick={() => setShowObjectModal(false)}
              className="w-full mt-4 p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Utility functions
function calculateMapBounds(tiles, objects, tileSize, objectSizes) {
  const allPositions = [
    ...tiles.map(t => ({x: t.x, y: t.y})),
    ...objects.map(obj => {
      const size = objectSizes[obj.type];
      return {
        x: obj.x,
        y: obj.y,
        width: size.width * tileSize,
        height: size.height * tileSize
      };
    })
  ];

  if (allPositions.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 };
  }
  
  const xs = allPositions.map(p => p.x);
  const ys = allPositions.map(p => p.y);
  const maxXs = allPositions.map(p => p.x + (p.width || tileSize));
  const maxYs = allPositions.map(p => p.y + (p.height || tileSize));
  
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const maxX = Math.max(...maxXs);
  const maxY = Math.max(...maxYs);
  
  return {
    minX,
    minY,
    maxX,
    maxY,
    width: Math.floor((maxX - minX) / tileSize) + 1,
    height: Math.floor((maxY - minY) / tileSize) + 1
  };
}

function convertToTileArray(tiles, bounds, tileSize) {
  if (bounds.width === 0 || bounds.height === 0) return [];

  const grid = Array(bounds.height).fill().map(() => 
    Array(bounds.width).fill(' ')
  );

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

  return grid.map(row => row.join(''));
}

function convertToObjectArray(objects, bounds, tileSize, objectSizes) {
  if (bounds.width === 0 || bounds.height === 0) return [];

  const grid = Array(bounds.height).fill().map(() => 
    Array(bounds.width).fill(' ')
  );

  objects.forEach(obj => {
    const size = objectSizes[obj.type];
    const startCol = Math.floor((obj.x - bounds.minX) / tileSize);
    const startRow = Math.floor((obj.y - bounds.minY) / tileSize);
    
    for (let row = startRow; row < startRow + size.height; row++) {
      for (let col = startCol; col < startCol + size.width; col++) {
        if (col >= 0 && col < bounds.width && row >= 0 && row < bounds.height) {
          if (obj.type === "player") {
            grid[row][col] = '@';
          } else if (obj.type === "enemy") {
            grid[row][col] = 'E';
          } else if (obj.type === "spike") {
            grid[row][col] = '^';
          } else if (obj.type === "boss") {
            grid[row][col] = 'B';
          }
        }
      }
    }
  });

  return grid.map(row => row.join(''));
}

function convertToWallArray(tiles, bounds, tileSize) {
  if (bounds.width === 0 || bounds.height === 0) return [];

  const grid = Array(bounds.height).fill().map(() => 
    Array(bounds.width).fill(' ')
  );

  const walls = tiles.filter(tile => tile.type === "wall");
  
  walls.forEach(wall => {
    const col = Math.floor((wall.x - bounds.minX) / tileSize);
    const row = Math.floor((wall.y - bounds.minY) / tileSize);
    
    if (col >= 0 && col < bounds.width && row >= 0 && row < bounds.height) {
      grid[row][col] = '$';
    }
  });

  return grid.map(row => row.join(''));
}