export default function Toolbar({
  activeLayer,
  setActiveLayer,
  tileMode,
  setTileMode,
  objectMode,
  setObjectMode,
  toolMode,
  setToolMode,
  rectangleFill,
  setRectangleFill,
  isEraser,
  setIsEraser,
  isZoomMode,
  setIsZoomMode,
  resetZoom,
  exportMap,
  onClear,
  onClearAll,
  showTileModal,
  setShowTileModal,
  showObjectModal,
  setShowObjectModal,
  textures,
  texturesLoaded,
}) {
  const getObjectIcon = (type) => {
    if (texturesLoaded && textures[type]) {
      return <img src={textures[type].src} alt={type} className="w-5 h-5" />;
    }
    switch(type) {
      case "player": return "👤";
      case "enemy": return "👹";
      case "spike": return "🟪";
      case "boss": return "👾";
      default: return "👤";
    }
  };

  const getTileIcon = (type) => {
    if (texturesLoaded && textures[type]) {
      return <img src={textures[type].src} alt={type} className="w-5 h-5" />;
    }
    switch(type) {
      case "floor": return "🧱";
      case "wall": return "🚧";
      default: return "🧱";
    }
  };

  const getObjectColor = (type) => {
    switch(type) {
      case "player": return "bg-green-600";
      case "enemy": return "bg-yellow-600";
      case "spike": return "bg-purple-600";
      case "boss": return "bg-red-600";
      default: return "bg-green-600";
    }
  };

  return (
    <>
      {/* Desktop Toolbar - Samping Kanan Vertikal */}
      <div className="hidden md:flex fixed right-4 top-1/2 transform -translate-y-1/2 flex-col gap-3 bg-gray-800/90 backdrop-blur-sm border border-gray-600 rounded-xl p-4 z-10 max-h-[80vh] overflow-y-auto">
        
        {/* Layer Selection */}
        <div className="flex flex-col gap-1 bg-gray-700 rounded-lg p-2">
          <div className="text-white text-xs font-medium mb-1 text-center">Layer</div>
          <button
            onClick={() => setActiveLayer("tile")}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeLayer === "tile" 
                ? "bg-blue-600 text-white" 
                : "text-gray-300 hover:text-white"
            }`}
          >
            🧱 Tile
          </button>
          <button
            onClick={() => setActiveLayer("object")}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeLayer === "object" 
                ? "bg-green-600 text-white" 
                : "text-gray-300 hover:text-white"
            }`}
          >
            🎯 Object
          </button>
        </div>

        {/* Tool Selection (Tile Layer Only) */}
        {activeLayer === "tile" && (
          <div className="flex flex-col gap-1 bg-gray-700 rounded-lg p-2">
            <div className="text-white text-xs font-medium mb-1 text-center">Tool</div>
            <button
              onClick={() => setToolMode("brush")}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                toolMode === "brush" 
                  ? "bg-purple-600 text-white" 
                  : "text-gray-300 hover:text-white"
              }`}
            >
              🖌️ Brush
            </button>
            <button
              onClick={() => setToolMode("rectangle")}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                toolMode === "rectangle" 
                  ? "bg-purple-600 text-white" 
                  : "text-gray-300 hover:text-white"
              }`}
            >
              ⬛ Rectangle
            </button>
          </div>
        )}

        {/* Rectangle Fill Mode (Rectangle Tool Only) */}
        {activeLayer === "tile" && toolMode === "rectangle" && (
          <div className="flex flex-col gap-1 bg-gray-700 rounded-lg p-2">
            <div className="text-white text-xs font-medium mb-1 text-center">Fill Mode</div>
            <button
              onClick={() => setRectangleFill("filled")}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                rectangleFill === "filled" 
                  ? "bg-yellow-600 text-white" 
                  : "text-gray-300 hover:text-white"
              }`}
            >
              🔲 Filled
            </button>
            <button
              onClick={() => setRectangleFill("border")}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                rectangleFill === "border" 
                  ? "bg-yellow-600 text-white" 
                  : "text-gray-300 hover:text-white"
              }`}
            >
              🟦 Border
            </button>
          </div>
        )}

        {/* Tile/Object Selection */}
        <div className="flex flex-col gap-1">
          {activeLayer === "tile" && (
            <button
              onClick={() => setShowTileModal(true)}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                tileMode === "floor" ? "bg-blue-600" : "bg-red-600"
              } text-white flex items-center justify-center gap-2`}
            >
              <span className="w-5 h-5 flex items-center justify-center">
                {getTileIcon(tileMode)}
              </span>
              {tileMode === "floor" ? "Floor" : "Wall"}
              <span className="text-xs">▼</span>
            </button>
          )}

          {activeLayer === "object" && (
            <button
              onClick={() => setShowObjectModal(true)}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${getObjectColor(objectMode)} text-white flex items-center justify-center gap-2`}
            >
              <span className="w-5 h-5 flex items-center justify-center">
                {getObjectIcon(objectMode)}
              </span>
              {objectMode.charAt(0).toUpperCase() + objectMode.slice(1)}
              <span className="text-xs">▼</span>
            </button>
          )}
        </div>

        {/* Common Tools */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setIsEraser(prev => !prev)}
            className={`px-3 py-2 rounded-lg text-sm font-medium ${
              isEraser ? "bg-orange-500" : "bg-gray-700"
            } text-white`}
          >
            🩹 {isEraser ? "Eraser On" : "Eraser"}
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={exportMap}
              className="px-3 py-2 rounded-lg bg-green-600 text-white text-sm font-medium"
            >
              💾 Export
            </button>
            <button
              onClick={onClear}
              className="px-3 py-2 rounded-lg bg-red-600 text-white text-sm font-medium"
            >
              🗑️ Clear
            </button>
          </div>
          
          <button
            onClick={onClearAll}
            className="px-3 py-2 rounded-lg bg-red-700 text-white text-sm font-medium"
          >
            💥 Clear All
          </button>
        </div>

        {/* Zoom Controls untuk Desktop */}
        <div className="flex flex-col gap-1 bg-gray-700 rounded-lg p-2">
          <div className="text-white text-xs font-medium mb-1 text-center">Zoom</div>
          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))}
              className="px-2 py-2 rounded bg-gray-600 text-white text-sm hover:bg-gray-500"
            >
              ➖
            </button>
            <button
              onClick={resetZoom}
              className="px-2 py-2 rounded bg-gray-600 text-white text-sm hover:bg-gray-500"
            >
              ⟳
            </button>
            <button
              onClick={() => setZoom(prev => Math.min(3, prev + 0.1))}
              className="px-2 py-2 rounded bg-gray-600 text-white text-sm hover:bg-gray-500"
            >
              ➕
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Toolbar - di bawah (lengkap) */}
      <div className="md:hidden fixed bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2 overflow-x-auto bg-gray-800/90 backdrop-blur-sm border border-gray-600 rounded-xl p-2 max-w-[90vw] z-10">
        {/* Layer Selection */}
        <div className="flex gap-1 bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setActiveLayer("tile")}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeLayer === "tile" 
                ? "bg-blue-600 text-white" 
                : "text-gray-300 hover:text-white"
            }`}
          >
            🧱 Tile
          </button>
          <button
            onClick={() => setActiveLayer("object")}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeLayer === "object" 
                ? "bg-green-600 text-white" 
                : "text-gray-300 hover:text-white"
            }`}
          >
            🎯 Object
          </button>
        </div>

        {/* Tool Selection (Tile Layer Only) */}
        {activeLayer === "tile" && (
          <div className="flex gap-1 bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setToolMode("brush")}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                toolMode === "brush" 
                  ? "bg-purple-600 text-white" 
                  : "text-gray-300 hover:text-white"
              }`}
            >
              🖌️ Brush
            </button>
            <button
              onClick={() => setToolMode("rectangle")}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                toolMode === "rectangle" 
                  ? "bg-purple-600 text-white" 
                  : "text-gray-300 hover:text-white"
              }`}
            >
              ⬛ Rectangle
            </button>
          </div>
        )}

        {/* Rectangle Fill Mode (Rectangle Tool Only) */}
        {activeLayer === "tile" && toolMode === "rectangle" && (
          <div className="flex gap-1 bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setRectangleFill("filled")}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                rectangleFill === "filled" 
                  ? "bg-yellow-600 text-white" 
                  : "text-gray-300 hover:text-white"
              }`}
            >
              🔲 Filled
            </button>
            <button
              onClick={() => setRectangleFill("border")}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                rectangleFill === "border" 
                  ? "bg-yellow-600 text-white" 
                  : "text-gray-300 hover:text-white"
              }`}
            >
              🟦 Border
            </button>
          </div>
        )}

        {/* Tile/Object Tools */}
        {activeLayer === "tile" && (
          <button
            onClick={() => setShowTileModal(true)}
            className={`px-3 py-2 rounded-lg text-sm font-medium ${
              tileMode === "floor" ? "bg-blue-600" : "bg-red-600"
            } text-white flex items-center gap-2`}
          >
            <span className="w-5 h-5 flex items-center justify-center">
              {getTileIcon(tileMode)}
            </span>
            {tileMode === "floor" ? "Floor" : "Wall"}
            <span className="text-xs">▼</span>
          </button>
        )}

        {activeLayer === "object" && (
          <button
            onClick={() => setShowObjectModal(true)}
            className={`px-3 py-2 rounded-lg text-sm font-medium ${getObjectColor(objectMode)} text-white flex items-center gap-2`}
          >
            <span className="w-5 h-5 flex items-center justify-center">
              {getObjectIcon(objectMode)}
            </span>
            {objectMode.charAt(0).toUpperCase() + objectMode.slice(1)}
            <span className="text-xs">▼</span>
          </button>
        )}

        {/* Zoom Controls (Mobile Only) */}
        <div className="flex gap-1 bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setIsZoomMode(prev => !prev)}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isZoomMode 
                ? "bg-orange-600 text-white" 
                : "text-gray-300 hover:text-white"
            }`}
          >
            🔍 {isZoomMode ? "Zoom On" : "Zoom"}
          </button>
          <button
            onClick={resetZoom}
            className="px-3 py-2 rounded-md text-sm font-medium bg-gray-600 text-white hover:bg-gray-500"
          >
            ⟳ Reset
          </button>
        </div>

        {/* Common Tools */}
        <button
          onClick={() => setIsEraser(prev => !prev)}
          className={`px-3 py-2 rounded-lg text-sm font-medium ${
            isEraser ? "bg-orange-500" : "bg-gray-700"
          } text-white`}
        >
          🩹 {isEraser ? "Eraser On" : "Eraser"}
        </button>

        <button
          onClick={exportMap}
          className="px-3 py-2 rounded-lg bg-green-600 text-white text-sm font-medium"
        >
          💾 Export
        </button>

        <button
          onClick={onClear}
          className="px-3 py-2 rounded-lg bg-red-600 text-white text-sm font-medium"
        >
          🗑️ Clear Layer
        </button>

        <button
          onClick={onClearAll}
          className="px-3 py-2 rounded-lg bg-red-700 text-white text-sm font-medium"
        >
          💥 Clear All
        </button>
      </div>
    </>
  );
}