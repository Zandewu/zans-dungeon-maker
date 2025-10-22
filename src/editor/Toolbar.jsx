export default function Toolbar({
  mode,
  setMode,
  isEraser,
  setIsEraser,
  exportMap,
  onClear,
}) {
  return (
    <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2 overflow-x-auto bg-gray-800/90 backdrop-blur-sm border border-gray-600 rounded-xl p-2 max-w-[90vw] z-10">
      <ToolbarButton
        active={mode === "floor"}
        onClick={() => setMode("floor")}
        label="🧱 Floor"
        activeColor="bg-blue-600"
        inactiveColor="bg-gray-700"
      />
      
      <ToolbarButton
        active={mode === "wall"}
        onClick={() => setMode("wall")}
        label="🚧 Wall"
        activeColor="bg-red-600"
        inactiveColor="bg-gray-700"
      />
      
      <ToolbarButton
        active={isEraser}
        onClick={() => setIsEraser(prev => !prev)}
        label="🩹 Eraser"
        activeColor="bg-orange-500"
        inactiveColor="bg-gray-700"
      />
      
      <ToolbarButton
        onClick={exportMap}
        label="💾 Export Map"
        inactiveColor="bg-green-600"
      />
      
      <ToolbarButton
        onClick={onClear}
        label="🗑️ Clear All"
        inactiveColor="bg-red-600"
      />
    </div>
  );
}

function ToolbarButton({ active, onClick, label, activeColor, inactiveColor }) {
  const bgColor = active ? activeColor : inactiveColor;
  
  return (
    <button
      onClick={onClick}
      className={`
        ${bgColor} text-white px-3 py-2 rounded-lg 
        flex-shrink-0 border-none cursor-pointer 
        text-sm font-medium transition-colors duration-200
        hover:opacity-90 focus:outline-none focus:ring-2 
        focus:ring-white/50
      `}
    >
      {label}
    </button>
  );
}